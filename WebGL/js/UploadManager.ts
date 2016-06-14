/// <reference path="EnvironmentManager.ts" />

class UploadManager {
    currentModel: BABYLON.AbstractMesh;
    scene: BABYLON.Scene;
    envMng: EnvironmentManager;
    constructor(scene: BABYLON.Scene, envMng: EnvironmentManager) {
        var self = this;
        self.envMng = envMng;
        self.scene = scene;

        $('body').on('modelChanged', function (e) {
            console.log(e.tab, e.model, e.textures);
            // var file = (<File>(<HTMLInputElement>document.getElementById('uploadFiles')).files[0]);
            // var reader = new FileReader();

            // if (file) {
            //     reader.readAsText(file);
            // }
            // reader.onloadend = () => {
            //file.name.substr(0, file.name.indexOf("."))
            if (e.model == null && modelMeshes.length > 0) {
                for (var i = 0; i < modelMeshes.length; i++) {
                    (<BABYLON.AbstractMesh>modelMeshes[i]).dispose();
                }
                modelMeshes = [];
                return;
            }

            var strSplt = e.model.split('/');

            var mName = strSplt[strSplt.length - 1];
            strSplt.pop();


            var mPath = strSplt.join('/');
            console.log(strSplt);
            mPath += '/';
            console.log(mName);
            console.log(mPath);

            self.uploadNewModel(mName, mPath, mName, self.scene, self.envMng);
            // };
        });
    }

    // uploadModel() {
    //     var file = (<File>(<HTMLInputElement>document.getElementById('uploadFiles')).files[0]);
    //     var reader = new FileReader();

    //     if (file) {
    //         reader.readAsText(file);
    //     }
    //     reader.onloadend = () => {
    //         this.uploadNewModel(file.name.substr(0, file.name.indexOf(".")), "", "data:" + reader.result, this.scene, this.envMng);
    //     };
    // }


    uploadNewModel(name: string, modelPath: string, modelName: string, scene: BABYLON.Scene, envManager: EnvironmentManager) {
        if (modelMeshes.length > 0) {
            for (var i = 0; i < modelMeshes.length; i++) {
                (<BABYLON.AbstractMesh>modelMeshes[i]).dispose();
            }
            modelMeshes = [];
        }

        BABYLON.SceneLoader.ImportMesh(null, modelPath, modelName, scene, function (newMeshes) {
            for (var i = 0; i < newMeshes.length; i++) {
                var mat: BABYLON.StandardMaterial = <BABYLON.StandardMaterial>newMeshes[i].material;
                var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                pbr.albedoTexture = mat.diffuseTexture;

                if (mat.name.indexOf("Ground_Plane") > -1) {
                    debugger;
                    var stdMat = new BABYLON.StandardMaterial("std", scene);
                    stdMat.diffuseTexture = new BABYLON.Texture("./Ground_Plane.png", scene);// mat.diffuseTexture;
                    stdMat.opacityTexture = new BABYLON.Texture("./Ground_Plane.png", scene);//mat.diffuseTexture;
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
            }

            var refl = (<BABYLON.StandardMaterial>scene.getMeshByName("reflectionPlane").material).reflectionTexture;
            for (var i = 0; i < newMeshes.length; i++) {
                (<BABYLON.MirrorTexture>refl).renderList.push(newMeshes[i]);
            }
            envManager.setReflection(scene, null);
        });
    }
}

