/// <reference path="EnvironmentManager.ts" />
/// <reference path="Main.ts" />

class UploadManager {
    scene: BABYLON.Scene;
    envMng: EnvironmentManager;
    path: string;
    uploading: boolean = false;
    // materials: BABYLON.Material[] = [];
    constructor(scene: BABYLON.Scene, envMng: EnvironmentManager) {
        var self = this;
        self.envMng = envMng;
        self.scene = scene;

        $('body').on('modelChanged', function (e) {
            if (self.uploading)
                return;

            self.uploading = true;
            console.log(e.tab, e.model, e.textures);
            var paths: string[] = e.model.split('/');
            paths.pop();
            self.path = paths.join('/');
            self.path += "/";
            console.log(self.path);

            if (e.model == null && modelMeshes.length > 0) {
                for (var i = 0; i < modelMeshes.length; i++) {
                    scene.getMaterialByName(modelMeshes[i].name).dispose();
                    scene.getMeshByName(modelMeshes[i].name).dispose();
                    modelMeshes[i].dispose();
                }
                if (envMng.environments[envMng.currentEnvironment].groundShadow != null) {
                    envMng.environments[envMng.currentEnvironment].groundShadow.dispose();
                    envMng.environments[envMng.currentEnvironment].groundShadow = null;
                }
                modelMeshes = [];
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
        });
    }

    uploadNewModel(name: string, modelPath: string, modelName: string, scene: BABYLON.Scene, envManager: EnvironmentManager) {
        var self = this;

        // if (self.materials.length > 0) {
        //     for (var i = 0; i < self.materials.length; i++) {

        //         self.materials[i].dispose();
        //         self.materials[i] = null;
        //     }
        //     self.materials = [];
        // }
        var l = lensFlareSystem.mainLensEmitter.length;
        for (var i = 0; i < l; i++) {
            lensFlareSystem.disposeFlareSystem(0);
        }

        while (modelMeshes.length > 0) {
            for (var i = 0; i < modelMeshes.length; i++) {
                //scene.getMaterialByName(modelMeshes[i].name).dispose();
                scene.materials.splice(scene.materials.indexOf(scene.getMaterialByName(modelMeshes[i].name)), 1);
                scene.getMeshByName(modelMeshes[i].name).dispose();
                //modelMeshes[i].dispose();
            }
            for (var i = 0; i < modelMeshes.length; i++) {
                modelMeshes[i] = null;
            }
            if (envMng.environments[envMng.currentEnvironment].groundShadow != null) {
                envMng.environments[envMng.currentEnvironment].groundShadow.dispose();
                envMng.environments[envMng.currentEnvironment].groundShadow = null;
            }
            modelMeshes = [];
        }

        BABYLON.SceneLoader.ImportMesh(null, modelPath, modelName, scene, function (newMeshes) {
            for (var i = 0; i < newMeshes.length; i++) {
                // sceneMain.getMeshByName((<BABYLON.StandardMaterial>newMeshes[i].material).name).dispose();
                // (<BABYLON.StandardMaterial>newMeshes[i].material).dispose();

                //  self.materials.push(pbr);
                if (newMeshes[i].name.indexOf("Camera_Pivot") > -1) {
                    (<BABYLON.ArcRotateCamera>scene.activeCamera).target = newMeshes[i].position;
                    continue;
                }
                if (newMeshes[i].name.indexOf("Ground_Plane") > -1) {
                    var stdMat: BABYLON.StandardMaterial = <BABYLON.StandardMaterial>scene.getMaterialByName("Ground_Plane_Material");
                    if (!stdMat) {
                        stdMat = new BABYLON.StandardMaterial("Ground_Plane_Material", scene);
                    }
                    scene.getMaterialByName(newMeshes[i].material.name).dispose();
                    if (newMeshes[i].material)
                        newMeshes[i].material.dispose();
                    stdMat.diffuseTexture = new BABYLON.Texture(self.path + "Ground_Plane.png", scene);// mat.diffuseTexture;
                    stdMat.opacityTexture = new BABYLON.Texture(self.path + "Ground_Plane.png", scene);//mat.diffuseTexture;
                    stdMat.specularColor = BABYLON.Color3.Black();
                    stdMat.diffuseColor = BABYLON.Color3.White();
                    newMeshes[i].isPickable = false;
                    newMeshes[i].renderOutline = false;
                    newMeshes[i].material = stdMat;
                    envManager.environments[envManager.currentEnvironment].groundShadow = <BABYLON.Mesh>newMeshes[i];
                    continue;
                }
                else if (newMeshes[i].name.indexOf("Component_") > -1) {
                    // problem je ovde, kada uzmes materijal i asajnujes AO i Albedo, za sledeci materijal se opet to uradi a vise objekta mogu da imaju isti materijal
                    var targetMaterial = new BABYLON.PBRMaterial(newMeshes[i].name, scene);
                    var sourceMaterial = <BABYLON.PBRMaterial>scene.getMaterialByName("Chrome");

                    materialManager.copyMaterial(sourceMaterial, targetMaterial, scene);
                    if ((<BABYLON.StandardMaterial>newMeshes[i].material).diffuseTexture)
                        targetMaterial.albedoTexture = (<BABYLON.StandardMaterial>newMeshes[i].material).diffuseTexture.clone();

                    targetMaterial.refractionTexture = undefined;

                    scene.getMaterialByName(newMeshes[i].material.name).dispose();

                    if ((<BABYLON.StandardMaterial>newMeshes[i].material))
                        (<BABYLON.StandardMaterial>newMeshes[i].material).dispose();
                    // newMeshes[i].actionManager = new BABYLON.ActionManager(scene);
                    // newMeshes[i].actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newMeshes[i], "renderOutline", false));
                    // newMeshes[i].actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newMeshes[i], "renderOutline", true));

                    var url = self.path + newMeshes[i].name.substr(0, 12) + '_AO.jpg';
                    targetMaterial.ambientTexture = new BABYLON.Texture(url, scene);
                    targetMaterial.ambientTexture.coordinatesIndex = 1;

                    newMeshes[i].material = targetMaterial;
                    modelMeshes.push(newMeshes[i]);
                }
                else {
                    scene.getMeshByName(newMeshes[i].name).dispose();
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
                scene.meshes[i].isBlocker = f;
                scene.meshes[i].isPickable = f;
            }
            var refl = (<BABYLON.StandardMaterial>scene.getMeshByName("reflectionPlane").material).reflectionTexture;
            (<BABYLON.MirrorTexture>refl).renderList.splice(0, (<BABYLON.MirrorTexture>refl).renderList.length);
            (<BABYLON.MirrorTexture>refl).renderList.push(scene.getMeshByName("background"));
            (<BABYLON.MirrorTexture>refl).renderList.push(scene.getMeshByName("skybox"));
            for (var i = 0; i < modelMeshes.length; i++) {
                (<BABYLON.MirrorTexture>refl).renderList.push(modelMeshes[i]);
            }
            for (var i = 0; i < (<BABYLON.MirrorTexture>refl).renderList.length; i++) {
                console.log("render list: " + (<BABYLON.MirrorTexture>refl).renderList[i].name);

            }
            envManager.setReflection(scene, null);

            for (var i = 0; i < scene.meshes.length; i++) {
                console.log(scene.meshes[i].name);
            }
            self.uploading = false;
        });
    }

    applyNewMaterials(){

    }

    applyNewEnvironment(){

    }

    applyNewLensFlares() {

    }
}

