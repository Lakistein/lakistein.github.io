/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="Environment.ts" />
var EnvironmentManager = (function () {
    function EnvironmentManager(json, scene) {
        this.currentEnvironment = 0;
        this.environments = [];
        var jsonEnv = JSON.parse(json);
        this.loadEnvironment(scene, jsonEnv);
    }
    EnvironmentManager.prototype.loadEnvironment = function (scene, jsonEnv) {
        var _this = this;
        BABYLON.SceneLoader.ImportMesh("", "./", "Environment.babylon", scene, function (environment) {
            var hemilight = new BABYLON.HemisphericLight("hemilight", new BABYLON.Vector3(0, 1, 0), scene);
            hemilight.range = 0.1;
            hemilight.intensity = 0.7;
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
                        mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                        mirrorMaterial.alpha = 0.1;
                        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.reflectionTexture.level = 1;
                        environment[i].material = mirrorMaterial;
                        environment[i].scaling = new BABYLON.Vector3(1010, 1010, 1010);
                        environment[i].isPickable = false;
                        break;
                }
            }
            var refl = scene.getMeshByName("reflectionPlane").material.reflectionTexture;
            for (var i = 0; i < environment.length; i++) {
                if (environment[i].name != "reflectionPlane")
                    refl.renderList.push(environment[i]);
            }
            for (var i = 0; i < 1; i++) {
                _this.environments.push(new Environment(jsonEnv[i], scene));
            }
            var hdrSkybox = BABYLON.Mesh.CreateBox("skybox", 1000.0, scene);
            var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBoxMat", scene);
            hdrSkyboxMaterial.backFaceCulling = false;
            hdrSkyboxMaterial.reflectionTexture = _this.environments[_this.currentEnvironment].skyboxTexture;
            hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            hdrSkyboxMaterial.microSurface = 0.5;
            hdrSkyboxMaterial.cameraExposure = 0.6;
            hdrSkyboxMaterial.cameraContrast = 1.6;
            //hdrSkyboxMaterial.disableLighting = true;
            hdrSkybox.material = hdrSkyboxMaterial;
            hdrSkybox.infiniteDistance = true;
            hdrSkybox.isPickable = false;
            _this.setEnvironment(_this.environments[0].id, scene);
            refl.renderList.push(scene.getMeshByName("skybox"));
        });
    };
    EnvironmentManager.prototype.findEnvironmentById = function (id) {
        var environment = null;
        for (var i = 0; i < this.environments.length; i++) {
            if (this.environments[i].id == id) {
                environment = this.environments[i];
                this.currentEnvironment = i;
                break;
            }
        }
        return environment;
    };
    EnvironmentManager.prototype.setEnvironment = function (id, scene) {
        if (this.currentEnvironment && this.environments[this.currentEnvironment].id == id) {
            return;
        }
        //  this.removeLights(scene);
        var environment = this.findEnvironmentById(id);
        if (!environment)
            environment = this.environments[0];
        // for (var i = 0; i < this.environments[this.currentEnvironment].lights.length; i++) {
        //     scene.lights.push(this.environments[this.currentEnvironment].lights[i]);
        // }
        this.setSkybox(scene.getMeshByName("skybox"));
        this.setReflection(scene);
    };
    EnvironmentManager.prototype.turnBackgroundOnOff = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.turnShadowOffOn = function (value) {
        this.environments[this.currentEnvironment].groundShadow.setEnabled(value);
    };
    EnvironmentManager.prototype.removeLights = function (scene) {
        for (var i = scene.lights.length - 1; i >= 0; --i) {
            if (scene.lights[i].name === "spot" || scene.lights[i].name === "point" || scene.lights[i].name === "hemi") {
                scene.lights.splice(i, 1);
            }
        }
    };
    EnvironmentManager.prototype.setSkybox = function (skybox) {
        skybox.material.reflectionTexture = this.environments[this.currentEnvironment].skyboxTexture;
        skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    };
    EnvironmentManager.prototype.setReflection = function (scene, color) {
        for (var i = 0; i < modelMeshes.length; i++) {
            if (this.environments[this.currentEnvironment].reflectionTexture && modelMeshes[i].material) {
                modelMeshes[i].material.reflectionTexture = this.environments[this.currentEnvironment].reflectionTexture;
            }
            else if (modelMeshes[i].material) {
                modelMeshes[i].material.reflectionColor = (color) ? color : this.environments[this.currentEnvironment].backgroundColor;
            }
        }
    };
    EnvironmentManager.prototype.changeTopGradient = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.material.topColor = BABYLON.Color3.FromHexString(value);
    };
    EnvironmentManager.prototype.changeBottomGradient = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.material.bottomColor = BABYLON.Color3.FromHexString(value);
    };
    EnvironmentManager.prototype.changeGradientOffset = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.material.offset = value;
    };
    EnvironmentManager.prototype.updateGroundTexture = function (scene) {
        var _this = this;
        var file = document.querySelector('#groundImg').files[0];
        var reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
        }
        else {
            this.environments[this.currentEnvironment].groundTexture = null;
        }
        reader.onloadend = function () {
            console.log(file.name);
            var mesh = scene.getMeshByName("groundPlane");
            if (mesh.material.albedoTexture)
                mesh.material.albedoTexture.dispose();
            if (mesh.material.opacityTexture)
                mesh.material.opacityTexture.dispose();
            _this.environments[_this.currentEnvironment].groundTexture = BABYLON.Texture.CreateFromBase64String(reader.result, file.name, scene);
            mesh.material.albedoTexture = _this.environments[_this.currentEnvironment].groundTexture;
            mesh.material.opacityTexture = _this.environments[_this.currentEnvironment].groundTexture;
            mesh.material.albedoTexture.hasAlpha = true;
        };
    };
    EnvironmentManager.prototype.turnGroundPlaneOffOn = function (value) {
        this.environments[this.currentEnvironment].groundMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.changeGroundPlaneSize = function (scale) {
        this.environments[this.currentEnvironment].groundMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    };
    EnvironmentManager.prototype.turnReflectivePlaneOffOn = function (value) {
        this.environments[this.currentEnvironment].reflectiveMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.changeReflectionAmount = function (value) {
        this.environments[this.currentEnvironment].reflectiveMesh.material.alpha = value;
    };
    return EnvironmentManager;
})();
