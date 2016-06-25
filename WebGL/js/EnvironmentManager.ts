/// <reference path="Environment.ts" />
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="Main.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />


class EnvironmentManager {
    currentEnvironment: number = 0;
    environments: Environment[] = [];

    constructor(json: string, scene: BABYLON.Scene) {
        var jsonEnv = JSON.parse(json);
        this.loadEnvironment(scene, jsonEnv);
    }

    loadEnvironment(scene: BABYLON.Scene, jsonEnv: any) {
        BABYLON.SceneLoader.ImportMesh("", "/static/js/lib/", "environment.babylon", scene, (environment) => {
            var hemilight = new BABYLON.HemisphericLight("hemilight", new BABYLON.Vector3(0, 1, 0), scene);
            hemilight.range = 1;
            hemilight.intensity = 2;
            for (var i = 0; i < environment.length; i++) {
                switch (environment[i].name) {
                    case "background":
                        var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
                        gradientMaterial.topColor = BABYLON.Color3.Red(); // Set the gradient top color
                        gradientMaterial.bottomColor = BABYLON.Color3.Blue(); // Set the gradient bottom color
                        gradientMaterial.offset = 0.25;
                        gradientMaterial.backFaceCulling = true;

                        environment[i].material = gradientMaterial;
                        // BABYLON.Effect.ShadersStore.gradientVertexShader = "precision mediump float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec4 vPosition;varying vec3 vNormal;varying vec2 vUv;void main(){vec4 p = vec4(position,1.);vPosition = p;vNormal = normal;vUv = uv;gl_Position = worldViewProjection * p;}";

                        // BABYLON.Effect.ShadersStore.gradientPixelShader = "precision mediump float;uniform mat4 worldView;varying vec4 vPosition;varying vec3 vNormal;uniform float offset;uniform vec3 topColor;uniform vec3 bottomColor;varying vec2 vUv;void main(void){float h = normalize(vPosition+offset).y;gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y + offset),1);}";

                        // var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
                        // shader.setFloat("offset", 0);
                        // shader.setColor3("topColor", BABYLON.Color3.Red());
                        // shader.setColor3("bottomColor", BABYLON.Color3.Blue());
                        //environment[i].material = shader;
                        environment[i].isPickable = false;
                        //hemilight.excludedMeshes.push(environment[i]);
                        break;
                    case "groundPlane":

                        var groundPlaneMaterial = <BABYLON.PBRMaterial>sceneMain.getMaterialByName("groundPlaneMaterial");
                        if (!groundPlaneMaterial)
                            groundPlaneMaterial = new BABYLON.PBRMaterial("groundPlaneMaterial", scene);
                        // groundPlaneMaterial.albedoTexture = new BABYLON.Texture("/media/projects/model3d/1/blackmetal.jpg", scene);
                        // groundPlaneMaterial.opacityTexture = new BABYLON.Texture("/media/projects/model3d/1/blackmetal.jpg", scene);
                        // groundPlaneMaterial.albedoTexture.hasAlpha = true;
                        groundPlaneMaterial.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        groundPlaneMaterial.directIntensity = 2;
                        groundPlaneMaterial.environmentIntensity = 0;
                        groundPlaneMaterial.overloadedShadeIntensity = 0;
                        groundPlaneMaterial.cameraExposure = 2;
                        groundPlaneMaterial.cameraContrast = 2;
                        groundPlaneMaterial.microSurface = 0;
                        groundPlaneMaterial.alpha = 1;
                        environment[i].material = groundPlaneMaterial;
                        environment[i].isPickable = false;
                        break;
                    case "reflectionPlane":
                        var mirrorMaterial = new BABYLON.StandardMaterial("mirrorMat", scene);
                        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirrorTexture", 1024, scene);
                        (<BABYLON.MirrorTexture>mirrorMaterial.reflectionTexture).mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                        mirrorMaterial.reflectionTexture.hasAlpha = true;
                        mirrorMaterial.alpha = 0.1;
                        mirrorMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
                        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.reflectionTexture.level = 1;
                        environment[i].material = mirrorMaterial;
                        environment[i].scaling = new BABYLON.Vector3(250, 1, 250);
                        environment[i].isPickable = false;
                        break;
                }

                if (environment[i].name != "background")
                    hemilight.excludedMeshes.push(environment[i]);
            }

            var refl = (<BABYLON.StandardMaterial>scene.getMeshByName("reflectionPlane").material).reflectionTexture;
            for (var i = 0; i < environment.length; i++) {
                if (environment[i].name != "reflectionPlane" && environment[i].name != "groundPlane")
                    (<BABYLON.MirrorTexture>refl).renderList.push(environment[i]);
            }

            for (var i = 0; i < 1; i++) {
                this.environments.push(new Environment(jsonEnv[i], scene));
            }

            var hdrSkybox = BABYLON.Mesh.CreateBox("skybox", 100.0, scene);
            var hdrSkyboxMaterial = <BABYLON.PBRMaterial>scene.getMaterialByName("skyBoxMat");
            if (!hdrSkyboxMaterial)
                hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBoxMat", scene);
            hdrSkyboxMaterial.backFaceCulling = false;
            hdrSkyboxMaterial.reflectionTexture = this.environments[this.currentEnvironment].skyboxTexture;
            hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            hdrSkyboxMaterial.microSurface = 0.5;
            hdrSkyboxMaterial.cameraExposure = 0.6;
            hdrSkyboxMaterial.cameraContrast = 1.6;
            hdrSkyboxMaterial.sideOrientation = 0;
            //hdrSkyboxMaterial.disableLighting = true;
            hdrSkybox.material = hdrSkyboxMaterial;
            hdrSkybox.infiniteDistance = true;
            hdrSkybox.isPickable = false;
            this.setEnvironment(this.environments[0].id, scene);

            (<BABYLON.MirrorTexture>refl).renderList.push(scene.getMeshByName("skybox"));
        });
    }

    findEnvironmentById(id: string): Environment {
        var environment = null;
        for (var i = 0; i < this.environments.length; i++) {
            if (this.environments[i].id == id) {
                environment = this.environments[i];
                this.currentEnvironment = i;
                break;
            }
        }
        return environment;
    }

    setEnvironment(id: string, scene: BABYLON.Scene) {
        if (this.currentEnvironment && this.environments[this.currentEnvironment].id == id) {
            return;
        }

        //  this.removeLights(scene);

        var environment = this.findEnvironmentById(id);
        if (!environment) environment = this.environments[0];

        // for (var i = 0; i < this.environments[this.currentEnvironment].lights.length; i++) {
        //     scene.lights.push(this.environments[this.currentEnvironment].lights[i]);
        // }

        //this.setSkybox(<BABYLON.Mesh>scene.getMeshByName("skybox"));
        this.setReflection(scene);
    }

    turnBackgroundOnOff(value: boolean) {

        this.environments[this.currentEnvironment].backgroundMesh.setEnabled(value);
    }

    turnShadowOffOn(value: boolean) {
        this.environments[this.currentEnvironment].groundShadow.setEnabled(value);
    }

    removeLights(scene: BABYLON.Scene) {
        for (var i = scene.lights.length - 1; i >= 0; --i) {
            if (scene.lights[i].name === "spot" || scene.lights[i].name === "point" || scene.lights[i].name === "hemi") {
                scene.lights.splice(i, 1);
            }
        }
    }

    setSkybox(skybox: BABYLON.Mesh) {
        (<BABYLON.StandardMaterial>skybox.material).reflectionTexture = this.environments[this.currentEnvironment].skyboxTexture;
        (<BABYLON.StandardMaterial>skybox.material).reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    }

    setReflection(scene: BABYLON.Scene, color?: BABYLON.Color3) {
        for (var i = 0; i < modelMeshes.length; i++) {
            if (this.environments[this.currentEnvironment].reflectionTexture && modelMeshes[i].material) {
                (<BABYLON.PBRMaterial>modelMeshes[i].material).reflectionTexture = this.environments[this.currentEnvironment].reflectionTexture;
            }
            else if (modelMeshes[i].material) {
                (<BABYLON.PBRMaterial>modelMeshes[i].material).reflectionColor = (color) ? color : this.environments[this.currentEnvironment].backgroundColor;
            }
        }
    }

    hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    changeTopGradientHue(value: string) {
        this.environments[this.currentEnvironment].hueT = parseFloat(value);
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueT, this.environments[this.currentEnvironment].saturationT, this.environments[this.currentEnvironment].ligthnessT);
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).setColor3("topColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2])); //BABYLON.Color3.FromHexString(value);
    }

    changeTopGradientLightness(value: string) {
        this.environments[this.currentEnvironment].ligthnessT = parseFloat(value);
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueT, this.environments[this.currentEnvironment].saturationT, this.environments[this.currentEnvironment].ligthnessT);
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).setColor3("topColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2])); //BABYLON.Color3.FromHexString(value);
    }

    changeBottomGradientHue(value: string) {
        this.environments[this.currentEnvironment].hueB = parseFloat(value);
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueB, this.environments[this.currentEnvironment].saturationB, this.environments[this.currentEnvironment].ligthnessB);
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).setColor3("bottomColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2])); //BABYLON.Color3.FromHexString(value);
    }

    changeBottomGradientLightness(value: string) {
        this.environments[this.currentEnvironment].ligthnessB = parseFloat(value);
        if (this.environments[this.currentEnvironment].ligthnessB < 0) this.environments[this.currentEnvironment].ligthnessB = 0
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueB, this.environments[this.currentEnvironment].saturationB, this.environments[this.currentEnvironment].ligthnessB);
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).setColor3("bottomColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2])); //BABYLON.Color3.FromHexString(value);
    }

    changeGradientOffset(value: number) {
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).setFloat("offset", value);
    }

    updateGroundTexture(scene: BABYLON.Scene) {
        // var file = (<File>(<HTMLInputElement>document.querySelector('#groundImg')).files[0]);
        // var reader = new FileReader();

        // if (file) {
        //     reader.readAsDataURL(file);
        // } else {
        //     this.environments[this.currentEnvironment].groundTexture = null;
        // }
        // reader.onloadend = () => {
        //     console.log(file.name);

        //     var mesh = scene.getMeshByName("groundPlane");
        //     if ((<BABYLON.PBRMaterial>mesh.material).albedoTexture)
        //         (<BABYLON.PBRMaterial>mesh.material).albedoTexture.dispose();
        //     if ((<BABYLON.PBRMaterial>mesh.material).opacityTexture)
        //         (<BABYLON.PBRMaterial>mesh.material).opacityTexture.dispose();
        //     this.environments[this.currentEnvironment].groundTexture = BABYLON.Texture.CreateFromBase64String(reader.result, file.name, scene);
        //     (<BABYLON.PBRMaterial>mesh.material).albedoTexture = this.environments[this.currentEnvironment].groundTexture;
        //     (<BABYLON.PBRMaterial>mesh.material).opacityTexture = this.environments[this.currentEnvironment].groundTexture;
        //     (<BABYLON.PBRMaterial>mesh.material).albedoTexture.hasAlpha = true;
        // };
    }

    turnGroundPlaneOffOn(value: boolean) {
        this.environments[this.currentEnvironment].groundMesh.setEnabled(value);
    }

    changeGroundPlaneSize(scale: number) {
        this.environments[this.currentEnvironment].groundMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    }

    turnReflectivePlaneOffOn(value: boolean) {
        this.environments[this.currentEnvironment].reflectiveMesh.setEnabled(value);
    }

    changeReflectionAmount(value: number) {
        this.environments[this.currentEnvironment].reflectiveMesh.material.alpha = value / 100;
    }
} 