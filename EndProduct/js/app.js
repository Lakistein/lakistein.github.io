/// <reference path="babylon.d.ts" />
var LensFlareSystem = (function () {
    function LensFlareSystem(scene) {
        var mainLensEmitter = new BABYLON.Mesh("lensEmitter", scene);
        mainLensEmitter.position = new BABYLON.Vector3(0.008, 0.601, -1.2);
        var MainLensFlareSystem = new BABYLON.LensFlareSystem("mainLensFlareSystem", mainLensEmitter, scene);
        mainLensEmitter.isPickable = false;
        var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), "./textures/Main Flare.png", MainLensFlareSystem);
        flare.texture.hasAlpha = true;
        flare.texture.getAlphaFromRGB = true;
        var hexaLensEmitter = new BABYLON.Mesh("hexaLensEmitter", scene);
        hexaLensEmitter.isPickable = false;
        hexaLensEmitter.position = new BABYLON.Vector3(0.027, 0.601, -1.225);
        var hexaLensFlareSystem = new BABYLON.LensFlareSystem("hexaLensFlareSystem", hexaLensEmitter, scene);
        var flare1 = new BABYLON.LensFlare(.2, -2.85, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
        var flare2 = new BABYLON.LensFlare(.1, -2.3, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_2.png", hexaLensFlareSystem);
        var flare3 = new BABYLON.LensFlare(.1, -0.5, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
        var flare4 = new BABYLON.LensFlare(.05, 0, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
        var flare5 = new BABYLON.LensFlare(.05, 0.4, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_2.png", hexaLensFlareSystem);
        var flare6 = new BABYLON.LensFlare(.05, 0.2, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_1.png", hexaLensFlareSystem);
        var flare7 = new BABYLON.LensFlare(.05, 0.5, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
        var flareSizes = [];
        for (var i = 0; i < hexaLensFlareSystem.lensFlares.length; i++) {
            flareSizes.push(hexaLensFlareSystem.lensFlares[i].size);
        }
        //var count = 0;
        var meshFound = new BABYLON.PickingInfo();
        scene.registerBeforeRender(function () {
            // count++;
            // if (count > 5) {
            //    count = 0;
            var rayPick = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, mainLensEmitter.position);
            meshFound = scene.pickWithRay(rayPick, function (mesh) {
                for (var i = 0; i < modelMeshes.length; i++) {
                    if (mesh == modelMeshes[i])
                        return true;
                }
                return false;
            });
            //   }
            if (meshFound.pickedPoint != null) {
                flare.color = BABYLON.Color3.Black();
                hexaLensFlareSystem.isEnabled = false;
            }
            else {
                flare.color = BABYLON.Color3.White();
                hexaLensFlareSystem.isEnabled = true;
                var vec1 = hexaLensEmitter.position;
                var vec2 = scene.activeCamera.position;
                var dot = BABYLON.Vector3.Dot(vec1, vec2);
                dot = dot / (Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z) * Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z));
                var acos = Math.acos(dot);
                var angle = acos * 180 / Math.PI;
                var bb = 0.06 - angle / 1000;
                if (bb > 0.1)
                    bb = 0.1;
                for (var i = 0; i < hexaLensFlareSystem.lensFlares.length; i++) {
                    hexaLensFlareSystem.lensFlares[i].size = flareSizes[i] + (1 - scene.activeCamera.radius / 6) / 6;
                    if (angle < 45) {
                        hexaLensFlareSystem.lensFlares[i].color = new BABYLON.Color3(bb, bb, bb);
                    }
                    else {
                        hexaLensFlareSystem.isEnabled = false;
                    }
                }
            }
        });
    }
    return LensFlareSystem;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
// TODO: uradi simple interface
var Environment = (function () {
    function Environment(json, scene) {
        this.lights = [];
        if (!json)
            return;
        this.id = json.id;
        this.groundTexture = null;
        this.groundMesh = scene.getMeshByName("groundPlane");
        var hdr = new BABYLON.HDRCubeTexture(json.skyboxURL, scene);
        this.reflectionTexture = hdr;
        this.skyboxTexture = hdr.clone();
        this.groundShadow = scene.getMeshByName("GROUNDPLANE_STYLE_1");
        this.backgroundMesh = scene.getMeshByName("background");
        this.reflectiveMesh = scene.getMeshByName("reflectionPlane");
        // this.rotateBackground = true;
        // for (var i = 0; i < json.lights.length; i++) {
        //     switch (json.lights[i].type) {
        //         case "spot":
        //             this.lights.push(new BABYLON.SpotLight("spot", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), new BABYLON.Vector3(json.lights[i].direction.x, json.lights[i].direction.y, json.lights[i].direction.z), json.lights[i].angle, 1, scene));
        //             break;
        //         case "point":
        //             this.lights.push(new BABYLON.PointLight("point", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene));
        //             break;
        //         case "hemi":
        //             this.lights.push(new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene));
        //             break;
        //         // case "direction":
        //         //     light = new BABYLON.DirectionalLight("hemi", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene);
        //         //     break;
        //     }
        //     this.lights[i].excludedMeshes.push(this.backgroundMesh);
        //     this.lights[i].intensity = json.lights[i].intensity;
        //     this.lights[i].range = json.lights[i].range;
        //     this.lights[i].diffuse = new BABYLON.Color3(json.lights[i].diffuse.r, json.lights[i].diffuse.g, json.lights[i].diffuse.b);
        //     this.lights[i].specular = new BABYLON.Color3(json.lights[i].specular.r, json.lights[i].specular.g, json.lights[i].specular.b);
        // }
        scene.registerBeforeRender(function () {
            if (this.backgroundMesh == null)
                this.backgroundMesh = scene.getMeshByName("background");
            if (this.backgroundMesh && scene.activeCamera) {
                this.backgroundMesh.rotation.y = -(scene.activeCamera.alpha) + -Math.PI / 2;
            }
        });
    }
    Environment.prototype.toJSON = function () {
        var json = '"lights": [';
        for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].name !== "spot" && this.lights[i].name !== "point" && this.lights[i].name !== "hemi")
                continue;
            json += '{' +
                '"type":' + JSON.stringify(this.lights[i].name) + ',' +
                '"position": ' + JSON.stringify(this.lights[i].getAbsolutePosition()) + ',';
            if (this.lights[i].name === "spot") {
                json += '"angle":' + this.lights[i].angle + ',' +
                    '"direction":' + JSON.stringify(this.lights[i].direction) + ',';
            }
            json += '"diffuse:"' + JSON.stringify(this.lights[i].diffuse) + ',' + '"specular:"' + JSON.stringify(this.lights[i].specular) + ',' +
                '"intensity": ' + this.lights[i].intensity + ',' +
                '"range":' + this.lights[i].range.toPrecision(2) + '},';
        }
        json = json.substring(0, json.length - 1);
        json += ']}';
        return json;
    };
    return Environment;
})();
/*

{
    "backgroundColor": {"r": 255, "g":255, "b":255},
    "lights": [{
        "type": "point",
        "position": {"x": 1,"y": 1,"z": 1},
        "direction": {"x": 1,"y": 1,"z": 1},
        "diffuse": {"r": 1,"g": 1,"b": 1},
        "specular": {"r": 1,"g": 1,"b": 1},
        "intensity": 15,
        "range": 15,
    }]
}

 */ 
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
/// <reference path="babylon.d.ts" />
/// <reference path="EnvironmentManager.ts" />
var UploadManager = (function () {
    function UploadManager(scene, envMng) {
        this.envMng = envMng;
        this.scene = scene;
    }
    UploadManager.prototype.uploadModel = function () {
        var _this = this;
        var file = document.getElementById('uploadFiles').files[0];
        var reader = new FileReader();
        if (file) {
            reader.readAsText(file);
        }
        reader.onloadend = function () {
            _this.uploadNewModel(file.name.substr(0, file.name.indexOf(".")), "", "data:" + reader.result, _this.scene, _this.envMng);
        };
    };
    UploadManager.prototype.uploadModelFromServer = function (name, path, scene, envManager) {
        this.uploadNewModel(name, path, name, scene, envManager);
    };
    UploadManager.prototype.uploadNewModel = function (name, modelPath, modelName, scene, envManager) {
        if (modelMeshes.length > 0) {
            for (var i = 0; i < modelMeshes.length; i++) {
                modelMeshes[i].dispose();
            }
            modelMeshes = [];
        }
        BABYLON.SceneLoader.ImportMesh(null, modelPath, modelName, scene, function (newMeshes) {
            for (var i = 0; i < newMeshes.length; i++) {
                var mat = newMeshes[i].material;
                var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                pbr.albedoTexture = mat.diffuseTexture;
                if (mat.name.indexOf("Ground_Plane") > -1) {
                    var stdMat = new BABYLON.StandardMaterial("std", scene);
                    stdMat.diffuseTexture = new BABYLON.Texture("./Ground_Plane.png", scene); // mat.diffuseTexture;
                    stdMat.opacityTexture = new BABYLON.Texture("./Ground_Plane.png", scene); //mat.diffuseTexture;
                    stdMat.specularColor = BABYLON.Color3.Black();
                    stdMat.diffuseColor = BABYLON.Color3.White();
                    newMeshes[i].isPickable = false;
                    newMeshes[i].renderOutline = false;
                    newMeshes[i].material = stdMat;
                    continue;
                }
                else {
                    modelMeshes.push(newMeshes[i]);
                }
                // newMeshes[i].actionManager = new BABYLON.ActionManager(scene);
                // newMeshes[i].actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newMeshes[i], "renderOutline", false));
                // newMeshes[i].actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newMeshes[i], "renderOutline", true));
                if (newMeshes[i].name.indexOf("Component_") > -1) {
                    var url = './' + newMeshes[i].name.substr(0, 12) + '_AO.jpg';
                    pbr.ambientTexture = new BABYLON.Texture(url, scene);
                    pbr.ambientTexture.coordinatesIndex = 1;
                }
                newMeshes[i].outlineWidth = 0.3;
                newMeshes[i].outlineColor = BABYLON.Color3.White();
                newMeshes[i].material = pbr;
                newMeshes[i].isPickable = true;
            }
            var refl = scene.getMeshByName("reflectionPlane").material.reflectionTexture;
            for (var i = 0; i < newMeshes.length; i++) {
                refl.renderList.push(newMeshes[i]);
            }
            envManager.setReflection(scene, null);
        });
    };
    return UploadManager;
})();
/// <reference path="babylon.d.ts"/>
/// <reference path="babylon.pbrMaterial.d.ts" />
var Material = (function () {
    function Material(json, scene) {
        var jsonMat = JSON.parse(json);
        this.name = jsonMat.name;
        this.isGlass = jsonMat.isGlass == "true" ? true : false;
        this.pbr = new BABYLON.PBRMaterial(jsonMat.name, scene);
        this.pbr.albedoColor = BABYLON.Color3.Red();
        this.pbr.indexOfRefraction = jsonMat.indexOfRefraction;
        this.pbr.alpha = jsonMat.alpha;
        this.pbr.directIntensity = jsonMat.directIntensity;
        this.pbr.emissiveIntensity = jsonMat.emissiveIntensity;
        this.pbr.environmentIntensity = jsonMat.environmentIntensity;
        this.pbr.specularIntensity = jsonMat.specularIntensity;
        this.pbr.overloadedShadowIntensity = jsonMat.overloadedShadowIntensity;
        this.pbr.overloadedShadeIntensity = jsonMat.overloadedShadeIntensity;
        this.pbr.cameraExposure = jsonMat.cameraExposure;
        this.pbr.cameraContrast = jsonMat.cameraContrast;
        this.pbr.microSurface = jsonMat.microSurface;
        this.pbr.reflectivityColor = new BABYLON.Color3(jsonMat.reflectivityColor.r, jsonMat.reflectivityColor.g, jsonMat.reflectivityColor.b);
    }
    Material.prototype.ToJSON = function () {
        return '{' +
            '"name":"' + this.pbr.name + '",' +
            '"isGlass":"' + (this.pbr.refractionTexture ? "true" : "false") + '",' +
            '"indexOfRefraction":' + this.pbr.indexOfRefraction.toPrecision(2) + ',' +
            '"alpha":' + this.pbr.alpha.toPrecision(2) + ',' +
            '"directIntensity":' + this.pbr.directIntensity.toPrecision(2) + ',' +
            '"emissiveIntensity":' + this.pbr.emissiveIntensity.toPrecision(2) + ',' +
            '"environmentIntensity":' + this.pbr.environmentIntensity.toPrecision(2) + ',' +
            '"specularIntensity":' + this.pbr.specularIntensity.toPrecision(2) + ',' +
            '"overloadedShadowIntensity":' + this.pbr.overloadedShadowIntensity.toPrecision(2) + ',' +
            '"overloadedShadeIntensity":' + this.pbr.overloadedShadeIntensity.toPrecision(2) + ',' +
            '"cameraExposure":' + this.pbr.cameraExposure.toPrecision(2) + ',' +
            '"cameraContrast":' + this.pbr.cameraContrast.toPrecision(2) + ',' +
            '"microSurface":' + this.pbr.microSurface.toPrecision(2) + ',' +
            '"reflectivityColor":{"r":' + this.pbr.reflectivityColor.r.toPrecision(2) + ', "g":' + this.pbr.reflectivityColor.g.toPrecision(2) + ', "b":' + this.pbr.reflectivityColor.b.toPrecision(2) + '}' +
            '}';
    };
    return Material;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="Material.ts" />
var MaterialManager = (function () {
    function MaterialManager(materials, scene) {
        this.materials = {};
        var jsonMat = JSON.parse(materials);
        // var htmlElement = document.getElementById("materialBody");
        for (var i = 0; i < jsonMat.length; i++) {
            this.materials[jsonMat[i].name] = new Material(JSON.stringify(jsonMat[i]), scene);
        }
        // var file = document.getElementsByClassName('material');
        // var startdrag = (evt) => {
        //     evt.dataTransfer.setData("text", evt.target.alt);
        // }
        // for (var i = 0; i < file.length; i++) {
        //     (<HTMLElement>file[i]).addEventListener('dragstart', startdrag, false);
        // }
        // var canvas = scene.getEngine().getRenderingCanvas();
        // var dragover = (evt) => {
        //     evt.preventDefault();
        //     var pickResult = scene.pick(evt.offsetX, evt.offsetY);
        //     for (var i = 0; i < modelMeshes.length; i++) {
        //         modelMeshes[i].renderOutline = false;
        //     }
        //     if (pickResult.hit) {
        //         pickResult.pickedMesh.renderOutline = true;
        //     }
        // }
        // var drop = (evt) => {
        //     debugger;
        //     evt.preventDefault();
        //     var mat = this.cloneMaterial((<Material>this.materials[evt.dataTransfer.getData("text")]).pbr, scene);
        //     var pickResult = scene.pick(evt.offsetX, evt.offsetY);
        //     if (pickResult.hit) {
        //         mat.albedoTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).albedoTexture;
        //         mat.ambientTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).ambientTexture;
        //         mat.reflectionTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).reflectionTexture;
        //         if (this.materials[evt.dataTransfer.getData("text")].isGlass)
        //             mat.refractionTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).reflectionTexture;
        //         else
        //             mat.refractionTexture = undefined;
        //         // mat.emissiveColor = BABYLON.Color3.White();
        //         pickResult.pickedMesh.material = mat;
        //         pickResult.pickedMesh.renderOutline = false;
        //         //displayMaterialValues(mat, scene);
        //     }
        // }
        // canvas.addEventListener('dragover', dragover, false);
        // canvas.addEventListener('drop', drop, false);
    }
    MaterialManager.prototype.cloneMaterial = function (material, scene) {
        var pbr = new BABYLON.PBRMaterial(material.name, scene);
        pbr.albedoColor = BABYLON.Color3.Red();
        pbr.indexOfRefraction = material.indexOfRefraction;
        pbr.alpha = material.alpha;
        pbr.directIntensity = material.directIntensity;
        pbr.emissiveIntensity = material.emissiveIntensity;
        pbr.environmentIntensity = material.environmentIntensity;
        pbr.specularIntensity = material.specularIntensity;
        pbr.overloadedShadowIntensity = material.overloadedShadowIntensity;
        pbr.overloadedShadeIntensity = material.overloadedShadeIntensity;
        pbr.cameraExposure = material.cameraExposure;
        pbr.cameraContrast = material.cameraContrast;
        pbr.microSurface = material.microSurface;
        pbr.reflectivityColor = new BABYLON.Color3(material.reflectivityColor.r, material.reflectivityColor.g, material.reflectivityColor.b);
        return pbr;
    };
    MaterialManager.prototype.getMaterial = function (name, scene) {
        return this.cloneMaterial(this.materials[name].pbr, scene);
    };
    return MaterialManager;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />
/// <reference path="LensFlareSystem.ts" />
/// <reference path="UploadManager.ts" />
/// <reference path="MaterialManager.ts" />
// things to download: 
// Skyboxes with reflections
// Materials
var sceneMain;
var uploadManager;
var modelMeshes = [];
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var camera;
    function createScene() {
        var scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, .5, 0), scene);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 6;
        camera.upperBetaLimit = 1.6;
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 50;
        camera.setPosition(new BABYLON.Vector3(0.004510142482902708, 0.7674630808337399, -2.9880500596552437));
        scene.activeCamera = camera;
        // Environment / Background
        var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./room.hdr","lights":[]}]';
        var envMng = new EnvironmentManager(str, scene);
        // Canvases
        // var json: string = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.25,"height":0.03,"position":{"x":0.5733,"y":1.0350,"z":-1.4110},"linePosition":{"x":0.008,"y":0.601,"z":-1.2},"offset":0,"anchorTextureURL":"./textures/anchors/Anchor_2.png"},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.25,"height":0.03,"position":{"x":-2,"y":1,"z":0},"linePosition":{"x":-1.192,"y":0.7488,"z":-0.295},"offset":3,"anchorTextureURL":"./textures/anchors/Anchor_4.png"}]';
        // var textCanv = new TextCanvasManager(json, scene);
        var materials = '[{"name":"Chrome","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.3,"emissiveIntensity":0.95,"environmentIntensity":1.0,"specularIntensity":2.0,"overloadedShadowIntensity":1.1,"overloadedShadeIntensity":1.0,"cameraExposure":1.3,"cameraContrast":0.93,"microSurface":1.0,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Copper","isGlass":"false","indexOfRefraction":0.33,"alpha":0.98,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":1.0,"specularIntensity":0.11,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":0.88,"microSurface":0.75,"reflectivityColor":{"r":1.0,"g":0.77,"b":0.50}},{"name":"Brushed Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.99,"specularIntensity":0.22,"overloadedShadowIntensity":1.87,"overloadedShadeIntensity":2,"cameraExposure":1.03,"cameraContrast":1.54,"microSurface":0.49,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Rubber","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":0.066,"specularIntensity":2.0,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.1,"microSurface":0.25,"reflectivityColor":{"r":0.26,"g":0.26,"b":0.26}},{"name":"Matte Finish","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.15438344215528121,"specularIntensity":1,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1,"microSurface":0.07719172107764061,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Clear Glass","isGlass":"true","indexOfRefraction":0.24,"alpha":0.34,"directIntensity":1.1,"emissiveIntensity":1.0,"environmentIntensity":0.68,"specularIntensity":0.49,"overloadedShadowIntensity":0.64,"overloadedShadeIntensity":1.0,"cameraExposure":1.7,"cameraContrast":1.0,"microSurface":1.0,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Dark Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.15,"emissiveIntensity":1.0,"environmentIntensity":0.29,"specularIntensity":0.49,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.8,"microSurface":0.98,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Frosted Glass","isGlass":"true","indexOfRefraction":0.11,"alpha":0.71,"directIntensity":0.37,"emissiveIntensity":1,"environmentIntensity":0.28,"specularIntensity":0.48,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":2,"cameraContrast":1.83,"microSurface":0.28,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Felt","isGlass":"false","indexOfRefraction":0.72,"alpha":1,"directIntensity":1.36,"emissiveIntensity":0.57,"environmentIntensity":1.85,"specularIntensity":1.19,"overloadedShadowIntensity":0.86,"overloadedShadeIntensity":1.08,"cameraExposure":1.36,"cameraContrast":1.01,"microSurface":0.05,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.43,"emissiveIntensity":0.06,"environmentIntensity":0.02,"specularIntensity":0.08,"overloadedShadowIntensity":0.97,"overloadedShadeIntensity":1,"cameraExposure":1.45,"cameraContrast":1.49,"microSurface":0.43,"reflectivityColor":{"r":0.56,"g":0.56,"b":0.56}},{"name":"Shiny Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.93,"emissiveIntensity":1.2,"environmentIntensity":0.31,"specularIntensity":0.20,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.0,"microSurface":0.66,"reflectivityColor":{"r":0.30,"g":0.30,"b":0.30}},{"name":"Flat Surface","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.34,"emissiveIntensity":0,"environmentIntensity":0,"specularIntensity":0,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1.34,"cameraContrast":1,"microSurface":0,"reflectivityColor":{"r":0,"g":0,"b":0}}]';
        var materialManager = new MaterialManager(materials, scene);
        uploadManager = new UploadManager(scene, envMng);
        var modelStr = "model.babylon";
        uploadManager.uploadModelFromServer(modelStr, "", scene, envMng);
        var matComp = '[{"compNum":1,"matName":"Plastic"},{"compNum":2,"matName":"Brushed Metal"},{"compNum":3,"matName":"Flat Surface"},{"compNum":4,"matName":"Chrome"},{"compNum":5,"matName":"Plastic"},{"compNum":6,"matName":"Flat Surface"}]';
        var matJs = JSON.parse(matComp);
        scene.executeWhenReady(function () {
            for (var i = 0; i < modelMeshes.length; i++) {
                for (var j = 0; j < matJs.length; j++) {
                    if ("Component_" + matJs[j].compNum == modelMeshes[i].name) {
                        var mat = materialManager.getMaterial(matJs[j].matName, scene);
                        mat.albedoTexture = modelMeshes[i].material.albedoTexture;
                        mat.ambientTexture = modelMeshes[i].material.ambientTexture;
                        mat.reflectionTexture = modelMeshes[i].material.reflectionTexture;
                        if (materialManager.materials[matJs[j].matName].isGlass)
                            mat.refractionTexture = modelMeshes[i].material.reflectionTexture;
                        else
                            mat.refractionTexture = undefined;
                        modelMeshes[i].material = mat;
                        modelMeshes[i].renderOutline = false;
                        break;
                    }
                }
            }
            for (var i = 0; i < scene.meshes.length; i++) {
                var f = false;
                for (var j = 0; j < modelMeshes.length; j++) {
                    if (scene.meshes[i] == modelMeshes[j]) {
                        f = true;
                        break;
                    }
                }
                scene.meshes[i].isPickable = f;
            }
            var lensFlareSystem = new LensFlareSystem(sceneMain);
        });
        return scene;
    }
    sceneMain = createScene();
    sceneMain.executeWhenReady(function () {
    });
    engine.runRenderLoop(function () {
        sceneMain.render();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
