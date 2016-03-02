/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="Environment.ts" />

class EnvironmentManager {
    currentEnvironment: number;
    environments: Environment[] = [];



    constructor(json: string, scene: BABYLON.Scene) {
        var jsonEnv = JSON.parse(json);

        for (var i = 0; i < jsonEnv.length; i++) {
            this.environments.push(new Environment(jsonEnv[i], scene));
        }

        var skybox = BABYLON.Mesh.CreateBox("skybox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.infiniteDistance = true;
        skybox.material = skyboxMaterial;

        this.setEnvironment(this.environments[2].id, scene);
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

        this.removeLights(scene);

        var environment = this.findEnvironmentById(id);
        if (!environment) environment = this.environments[0];

        for (var i = 0; i < this.environments[this.currentEnvironment].lights.length; i++) {
            scene.lights.push(this.environments[this.currentEnvironment].lights[i]);
        }

        //this.setBackgroundColor(<BABYLON.Mesh>scene.getMeshByName("background"), this.environments[this.currentEnvironment].backgroundColor, this.currentEnvironment);
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

    setBackgroundColor(mesh: BABYLON.Mesh, color: BABYLON.Color3, environmentIndex: number) {
        (<BABYLON.PBRMaterial>mesh.material).albedoColor = this.environments[environmentIndex].backgroundColor;
    }

    setSkybox(skybox: BABYLON.Mesh) {
        (<BABYLON.StandardMaterial>skybox.material).reflectionTexture = this.environments[this.currentEnvironment].skyboxTexture;
        (<BABYLON.StandardMaterial>skybox.material).reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    }

    setReflection(scene: BABYLON.Scene, color?: BABYLON.Color3) {
        for (var i = 0; i < scene.meshes.length; i++) {
            if (<BABYLON.PBRMaterial>scene.meshes[i].material instanceof BABYLON.PBRMaterial && scene.meshes[i].name != "GROUNDPLANE_STYLE_1" && scene.meshes[i].name != "skybox") {
                if (this.environments[this.currentEnvironment].reflectionTexture) {
                    (<BABYLON.PBRMaterial>scene.meshes[i].material).reflectionTexture = this.environments[this.currentEnvironment].reflectionTexture;
                }
                else {
                    (<BABYLON.PBRMaterial>scene.meshes[i].material).reflectionColor = (color) ? color : this.environments[this.currentEnvironment].backgroundColor;
                }
            }
        }
    }

    updateGroundTexture(scene: BABYLON.Scene) {
        var file = (<File>document.querySelector('#groundImg').files[0]);
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        } else {
            this.environments[this.currentEnvironment].groundTexture = null;
        }
        reader.onloadend = () => {
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
    
    turnGroundPlaneOffOn(value: boolean){
        this.environments[this.currentEnvironment].groundMesh.setEnabled(value);   
    }
    
    changeGroundPlaneSize(scale: number) {
        this.environments[this.currentEnvironment].groundMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    }
}