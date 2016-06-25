/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="Environment.ts" />

class EnvironmentManager {
    currentEnvironment: number = 0;
    environments: Environment[] = [];

    constructor(json: string, scene: BABYLON.Scene) {
        var jsonEnv = JSON.parse(json);
        this.loadEnvironment(scene, jsonEnv);
    }

    loadEnvironment(scene: BABYLON.Scene, jsonEnv: any) {
        BABYLON.SceneLoader.ImportMesh("", "./", "Environment.babylon", scene, (environment) => {
            var hemilight = new BABYLON.HemisphericLight("hemilight", new BABYLON.Vector3(0, 1, 0), scene);
            hemilight.range = 1000;
            hemilight.intensity = 1;
            hemilight.groundColor = BABYLON.Color3.White();
            for (var i = 0; i < environment.length; i++) {
                switch (environment[i].name) {
                    case "background":
                        var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
                        gradientMaterial.topColor = BABYLON.Color3.Red();
                        gradientMaterial.bottomColor = BABYLON.Color3.Blue();
                        environment[i].position.y = -0.1;
                        environment[i].material = gradientMaterial;
                        environment[i].isPickable = false;
                        environment[i].isVisible = false;
                        //hemilight.includedOnlyMeshes.push(environment[i]);
                        break;
                    case "groundPlane":
                        var groundPlaneMaterial = new BABYLON.PBRMaterial("groundPlaneMaterial", scene);
                        groundPlaneMaterial.albedoTexture = new BABYLON.Texture("./textures/flare.png", scene);
                        groundPlaneMaterial.opacityTexture = new BABYLON.Texture("./textures/flare.png", scene);
                        groundPlaneMaterial.albedoTexture.hasAlpha = true;
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
                        var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene);
                        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, false);
                        (<BABYLON.MirrorTexture>mirrorMaterial.reflectionTexture).mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                        mirrorMaterial.alpha = 0.1;
                        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.reflectionTexture.level = 1;
                        environment[i].material = mirrorMaterial;
                        environment[i].scaling = new BABYLON.Vector3(1010, 1010, 1010);
                        environment[i].isPickable = false;
                        break;
                }

                // if (environment[i].name != "background")
                //     hemilight.excludedMeshes.push(environment[i]);
            }

            var refl = (<BABYLON.StandardMaterial>scene.getMeshByName("reflectionPlane").material).reflectionTexture;
            for (var i = 0; i < environment.length; i++) {
                if (environment[i].name != "reflectionPlane")
                    (<BABYLON.MirrorTexture>refl).renderList.push(environment[i]);
            }

            for (var i = 0; i < 1; i++) {
                this.environments.push(new Environment(jsonEnv[i], scene));
            }

            var hdrSkybox = BABYLON.Mesh.CreateBox("skybox", 1000.0, scene);
            var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBoxMat", scene);
            hdrSkyboxMaterial.backFaceCulling = false;
            hdrSkyboxMaterial.reflectionTexture = this.environments[this.currentEnvironment].skyboxTexture;
            hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            hdrSkyboxMaterial.microSurface = 0.5;
            hdrSkyboxMaterial.cameraExposure = 0.6;
            hdrSkyboxMaterial.cameraContrast = 1.6;
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

        this.setSkybox(<BABYLON.Mesh>scene.getMeshByName("skybox"));
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

    changeTopGradient(value: string) {
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).topColor = BABYLON.Color3.FromHexString(value);
    }

    changeBottomGradient(value: string) {
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).bottomColor = BABYLON.Color3.FromHexString(value);
    }

    changeGradientOffset(value: number) {
        (<BABYLON.GradientMaterial>this.environments[this.currentEnvironment].backgroundMesh.material).offset = value;
    }

    updateGroundTexture(scene: BABYLON.Scene) {
        var file = (<File>(<HTMLInputElement>document.querySelector('#groundImg')).files[0]);
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        } else {
            this.environments[this.currentEnvironment].groundTexture = null;
        }
        reader.onloadend = () => {
            console.log(file.name);

            var mesh = scene.getMeshByName("groundPlane");
            if ((<BABYLON.PBRMaterial>mesh.material).albedoTexture)
                (<BABYLON.PBRMaterial>mesh.material).albedoTexture.dispose();
            if ((<BABYLON.PBRMaterial>mesh.material).opacityTexture)
                (<BABYLON.PBRMaterial>mesh.material).opacityTexture.dispose();
            this.environments[this.currentEnvironment].groundTexture = BABYLON.Texture.CreateFromBase64String(reader.result, file.name, scene);
            (<BABYLON.PBRMaterial>mesh.material).albedoTexture = this.environments[this.currentEnvironment].groundTexture;
            (<BABYLON.PBRMaterial>mesh.material).opacityTexture = this.environments[this.currentEnvironment].groundTexture;
            (<BABYLON.PBRMaterial>mesh.material).albedoTexture.hasAlpha = true;
        };
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
        this.environments[this.currentEnvironment].reflectiveMesh.material.alpha = value;
    }
} 