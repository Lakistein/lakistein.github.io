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
