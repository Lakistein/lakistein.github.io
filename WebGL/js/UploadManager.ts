/// <reference path="babylon.d.ts" />
/// <reference path="EnvironmentManager.ts" />


class UploadManager {
    currentModel: BABYLON.AbstractMesh;
    scene: BABYLON.Scene;
    envMng: EnvironmentManager;
    constructor(scene: BABYLON.Scene, envMng: EnvironmentManager) {
        this.envMng = envMng;
        this.scene = scene;
    }

    uploadModel() {
        var file = (<File>(<HTMLInputElement>document.getElementById('uploadFiles')).files[0]);
        var reader = new FileReader();

        if (file) {
            reader.readAsText(file);
        }
        reader.onloadend = () => {
            this.uploadNewModel(file.name.substr(0, file.name.indexOf(".")), "", "data:" + reader.result, this.scene, this.envMng);
        };
    }

    uploadNewModel(name: string, modelPath: string, modelName: string, scene: BABYLON.Scene, envManager: EnvironmentManager) {
        if (modelMeshes.length > 0) {
            for (var i = 0; i < modelMeshes.length; i++) {
                (<BABYLON.AbstractMesh>modelMeshes[i]).dispose();
            }
            modelMeshes = [];
        }

        BABYLON.SceneLoader.ImportMesh(null, modelPath, modelName, scene, function(newMeshes) {
            modelMeshes = newMeshes;
            // var ambientTexture: BABYLON.Texture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
            // var blackPlastic = new BABYLON.PBRMaterial("Black Plastic", scene);
            // blackPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackplastic.jpg", scene);
            // blackPlastic.ambientTexture = ambientTexture;
            // blackPlastic.ambientTexture.coordinatesIndex = 1;
            // blackPlastic.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            // blackPlastic.specularIntensity = 0.1;
            // blackPlastic.indexOfRefraction = 0.52;
            // blackPlastic.directIntensity = 1;
            // blackPlastic.environmentIntensity = 0.05;
            // blackPlastic.overloadedShadowIntensity = 0.8;
            // blackPlastic.overloadedShadeIntensity = 0.8;
            // blackPlastic.cameraExposure = 1.26;
            // blackPlastic.cameraContrast = 1.6;
            // blackPlastic.microSurface = 0.31;

            // var redPlastic = new BABYLON.PBRMaterial("Red Plastic", scene);
            // redPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/redplastic.jpg", scene);
            // redPlastic.ambientTexture = ambientTexture;

            // redPlastic.ambientTexture.coordinatesIndex = 1;
            // redPlastic.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            // redPlastic.indexOfRefraction = .52;
            // redPlastic.directIntensity = 1;
            // redPlastic.environmentIntensity = 0.5;
            // redPlastic.specularIntensity = 0.3;
            // redPlastic.overloadedShadowIntensity = 1.3;
            // redPlastic.overloadedShadeIntensity = 0.68;
            // redPlastic.cameraExposure = 0.8;
            // redPlastic.cameraContrast = 2;
            // redPlastic.microSurface = 0.34;

            // var chrome = new BABYLON.PBRMaterial("Chrome", scene);
            // chrome.albedoTexture = new BABYLON.Texture("./textures/models-textures/chrome.jpg", scene);
            // chrome.ambientTexture = ambientTexture;
            // chrome.ambientTexture.coordinatesIndex = 1;
            // chrome.reflectivityColor = new BABYLON.Color3(.9, .9, .9);
            // chrome.directIntensity = 0.3;
            // chrome.specularIntensity = 1.5;
            // chrome.environmentIntensity = 0.6;
            // chrome.cameraExposure = .23;
            // chrome.cameraContrast = 1.9;
            // chrome.microSurface = 0.21;

            // var blackMetal = new BABYLON.PBRMaterial("Black Metal", scene);
            // blackMetal.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackmetal.jpg", scene);
            // blackMetal.ambientTexture = ambientTexture;
            // blackMetal.ambientTexture.coordinatesIndex = 1;
            // blackMetal.reflectivityColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            // blackMetal.indexOfRefraction = 2;
            // blackMetal.directIntensity = 0.2;
            // blackMetal.environmentIntensity = 0.24;
            // blackMetal.specularIntensity = 0.7;
            // blackMetal.overloadedShadeIntensity = 0.8;
            // blackMetal.cameraExposure = 1.99;
            // blackMetal.cameraContrast = 1;
            // blackMetal.microSurface = 0.61;

            // var blackBox = new BABYLON.PBRMaterial("Black Box", scene);
            // blackBox.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackbox.jpg", scene);
            // blackBox.ambientTexture = new BABYLON.Texture("./textures/models-textures/BOX_STYLE_1.jpg", scene);
            // blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
            // blackBox.indexOfRefraction = 2;
            // blackBox.directIntensity = 1.7;
            // blackBox.environmentIntensity = 0.09;
            // blackBox.overloadedShadowIntensity = 0.6;
            // blackBox.overloadedShadeIntensity = 0.22;
            // blackBox.cameraExposure = 1.5;
            // blackBox.cameraContrast = 2;
            // blackBox.microSurface = 0.46;

            // var blackCushion = new BABYLON.PBRMaterial("Black Cushion", scene);
            // blackCushion.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackcushion.jpg", scene);
            // blackCushion.ambientTexture = ambientTexture;
            // blackCushion.ambientTexture.coordinatesIndex = 1;
            // blackCushion.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
            // blackCushion.indexOfRefraction = .52;
            // blackCushion.directIntensity = 2;
            // blackCushion.environmentIntensity = 0;
            // blackCushion.overloadedShadeIntensity = 0.81;
            // blackCushion.cameraExposure = 2;
            // blackCushion.cameraContrast = 2;
            // blackCushion.microSurface = 0.4;

            for (var i = 0; i < newMeshes.length; i++) {
                var mat: BABYLON.StandardMaterial = <BABYLON.StandardMaterial>newMeshes[i].material;
                var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                            // blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
            // blackBox.indexOfRefraction = 2;
            // blackBox.directIntensity = 1.7;
            // blackBox.environmentIntensity = 0.09;
            // blackBox.overloadedShadowIntensity = 0.6;
            // blackBox.overloadedShadeIntensity = 0.22;
            // blackBox.cameraExposure = 1.5;
            // blackBox.cameraContrast = 2;
            // blackBox.microSurface = 0.46;
                pbr.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                pbr.indexOfRefraction = 2;
                pbr.directIntensity = 1.7;
                pbr.environmentIntensity = 0.09;
                pbr.overloadedShadowIntensity = 0.6;
                pbr.overloadedShadeIntensity = 0.22;
                pbr.cameraExposure = 1.5;
                pbr.cameraContrast = 2;
                pbr.microSurface = 0.46;
                pbr.albedoTexture = mat.diffuseTexture;
               // debugger;
                if (mat.name.indexOf("Ground_Plane") > -1) {
                    pbr.albedoTexture = mat.diffuseTexture;
                    pbr.opacityTexture = mat.diffuseTexture;
                }
                
                if (newMeshes[i].name.indexOf("Part_") > -1) {
                    var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                    pbr.ambientTexture = new BABYLON.Texture(a/*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                    pbr.ambientTexture.coordinatesIndex = 1;

                }


                newMeshes[i].material = pbr;
                // var mat: BABYLON.StandardMaterial = <BABYLON.StandardMaterial>newMeshes[i].material;

                // // var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                // // pbr.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                // // pbr.indexOfRefraction = .52;
                // // pbr.directIntensity = 1;
                // // pbr.specularIntensity = 0.5;

                // // pbr.environmentIntensity = 0.09;
                // // pbr.overloadedShadowIntensity = 1.3;
                // // pbr.overloadedShadeIntensity = 0.68;
                // // pbr.cameraExposure = 0.8;
                // // pbr.cameraContrast = 2;
                // // pbr.microSurface = 0.34;
                // // pbr.albedoTexture = new BABYLON.Texture(mat.diffuseTexture.getInternalTexture().url, scene);// mat.diffuseTexture;

                // // if (newMeshes[i].name.indexOf("Part_") > -1) {
                // //     var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                // //     pbr.ambientTexture = new BABYLON.Texture(a/*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                // //     pbr.ambientTexture.coordinatesIndex = 1;

                // // }


                // if (mat.name.indexOf("TRANSPARENT") > -1) {
                //     debugger;
                //     var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                //     pbr.albedoTexture = mat.diffuseTexture;
                //     pbr.opacityTexture = mat.diffuseTexture;
                //     pbr.albedoTexture.hasAlpha = true;
                //     pbr.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                //     pbr.directIntensity = 2;
                //     pbr.environmentIntensity = 0;
                //     pbr.overloadedShadeIntensity = 0;
                //     pbr.cameraExposure = 2;
                //     pbr.cameraContrast = 2;
                //     pbr.microSurface = 0;
                //     //pbrnewMeshes[i].position.y = 0.01;
                //     newMeshes[i].material = pbr;
                //     newMeshes[i].isPickable = false;
                //     continue;
                // }

                // // newMeshes[i].material = pbr;
                // // scene.getLightByName("hemilight").excludedMeshes.push(newMeshes[i]);
                // var a = newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1);

                // switch (a) {
                //     case "6":
                //         // var blackBox = new BABYLON.PBRMaterial("Black Box", scene);
                //         // blackBox.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackbox.jpg", scene);
                //         // blackBox.ambientTexture = new BABYLON.Texture("./textures/models-textures/BOX_STYLE_1.jpg", scene);
                //         // blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                //         // blackBox.indexOfRefraction = 2;
                //         // blackBox.directIntensity = 1.7;
                //         // blackBox.environmentIntensity = 0.09;
                //         // blackBox.overloadedShadowIntensity = 0.6;
                //         // blackBox.overloadedShadeIntensity = 0.22;
                //         // blackBox.cameraExposure = 1.5;
                //         // blackBox.cameraContrast = 2;
                //         // blackBox.microSurface = 0.46;
                //         var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                //         pbr.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                //         pbr.indexOfRefraction = .52;
                //         pbr.directIntensity = 1.7;
                //         pbr.environmentIntensity = 0.09;
                //         pbr.overloadedShadowIntensity = 0.6;
                //         pbr.overloadedShadeIntensity = 0.22;
                //         pbr.cameraExposure = 1.5;
                //         pbr.cameraContrast = 2;
                //         pbr.microSurface = 0.46;
                //         pbr.albedoTexture = new BABYLON.Texture(mat.diffuseTexture.getInternalTexture().url, scene);// mat.diffuseTexture;

                //         if (newMeshes[i].name.indexOf("Part_") > -1) {
                //             var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                //             pbr.ambientTexture = new BABYLON.Texture(a/*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                //             pbr.ambientTexture.coordinatesIndex = 1;

                //         }

                //                   //     (<BABYLON.Mesh>newMeshes[i])._shouldGenerateFlatShading = false;//.convertToFlatShadedMesh();
                //         newMeshes[i].material = pbr;
                //         break;
                //     case "5":
                //         break;
                //     case "1":
                //         // var ambientTexture: BABYLON.Texture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
                //         // var blackPlastic = new BABYLON.PBRMaterial("Black Plastic", scene);
                //         // blackPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackplastic.jpg", scene);
                //         // blackPlastic.ambientTexture = ambientTexture;
                //         // blackPlastic.ambientTexture.coordinatesIndex = 1;
                //         // blackPlastic.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
                //         // blackPlastic.specularIntensity = 0.1;
                //         // blackPlastic.indexOfRefraction = 0.52;
                //         // blackPlastic.directIntensity = 1;
                //         // blackPlastic.environmentIntensity = 0.05;
                //         // blackPlastic.overloadedShadowIntensity = 0.8;
                //         // blackPlastic.overloadedShadeIntensity = 0.8;
                //         // blackPlastic.cameraExposure = 1.26;
                //         // blackPlastic.cameraContrast = 1.6;
                //         // blackPlastic.microSurface = 0.31;


                //         var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                //         pbr.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
                //         pbr.indexOfRefraction = .52;
                //         pbr.directIntensity = 1;
                //         pbr.specularIntensity = 1;

                //         pbr.environmentIntensity = 0.05
                //         pbr.overloadedShadowIntensity = 0.8;
                //         pbr.overloadedShadeIntensity = 0.8;
                //         pbr.cameraExposure = 1.26;
                //         pbr.cameraContrast = 1.6;
                //         pbr.microSurface = 0.31;
                //         debugger;
                //         pbr.albedoTexture =new BABYLON.Texture(mat.diffuseTexture.getInternalTexture().url, scene); //mat.diffuseTexture;

                //         if (newMeshes[i].name.indexOf("Part_") > -1) {
                //             var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                //             pbr.ambientTexture = new BABYLON.Texture(a/*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                //             pbr.ambientTexture.coordinatesIndex = 1;

                //         }

                //         newMeshes[i].material = pbr;
                //         break;
                //     case "4":

                //         // var chrome = new BABYLON.PBRMaterial("Chrome", scene);
                //         // chrome.albedoTexture = new BABYLON.Texture("./textures/models-textures/chrome.jpg", scene);
                //         // chrome.ambientTexture = ambientTexture;
                //         // chrome.ambientTexture.coordinatesIndex = 1;
                //         // chrome.reflectivityColor = new BABYLON.Color3(.9, .9, .9);
                //         // chrome.directIntensity = 0.3;
                //         // chrome.specularIntensity = 1.5;
                //         // chrome.environmentIntensity = 0.6;
                //         // chrome.cameraExposure = .23;
                //         // chrome.cameraContrast = 1.9;
                //         // chrome.microSurface = 0.21;

                //         var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                //         pbr.reflectivityColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                //         pbr.indexOfRefraction = .52;
                //         pbr.directIntensity = 0.3;
                //         pbr.specularIntensity = 1.5;

                //         pbr.environmentIntensity = 0.6;
                //         pbr.cameraExposure = 0.23;
                //         pbr.cameraContrast = 1.9;
                //         pbr.microSurface = 0.21;
                //         pbr.albedoTexture = new BABYLON.Texture(mat.diffuseTexture.getInternalTexture().url, scene);// mat.diffuseTexture;

                //         if (newMeshes[i].name.indexOf("Part_") > -1) {
                //             var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                //             pbr.ambientTexture = new BABYLON.Texture(a/*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                //             pbr.ambientTexture.coordinatesIndex = 1;

                //         }


                //         newMeshes[i].material = pbr;
                //         break;
                //     case "3":
                //     debugger;
                //         var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                //         pbr.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                //         pbr.indexOfRefraction = .52;
                //         pbr.directIntensity = 1;
                //         pbr.specularIntensity = 0.5;

                //         pbr.environmentIntensity = 0.09;
                //         pbr.overloadedShadowIntensity = 1.3;
                //         pbr.overloadedShadeIntensity = 0.68;
                //         pbr.cameraExposure = 0.8;
                //         pbr.cameraContrast = 2;
                //         pbr.microSurface = 0.34;
                //         pbr.albedoTexture = new BABYLON.Texture(mat.diffuseTexture.getInternalTexture().url, scene);// mat.diffuseTexture;

                //         if (newMeshes[i].name.indexOf("Part_") > -1) {
                //             var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                //             pbr.ambientTexture = new BABYLON.Texture(a/*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                //             pbr.ambientTexture.coordinatesIndex = 1;

                //         }


                //         if (mat.name.indexOf("TRANSPARENT") > -1) {
                //             pbr.opacityTexture = mat.diffuseTexture;
                //         }

                //         newMeshes[i].material = pbr;

                //         break;
                //     case "2":
                //         var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                //         pbr.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                //         pbr.indexOfRefraction = .52;
                //         pbr.directIntensity = 2;
                //         pbr.specularIntensity = 0.5;

                //         pbr.environmentIntensity = 0;
                //         pbr.overloadedShadeIntensity = 0.81;
                //         pbr.cameraExposure = 5;
                //         pbr.cameraContrast = 2;
                //         pbr.microSurface = 0.4;
                //         pbr.albedoTexture = new BABYLON.Texture(mat.diffuseTexture.getInternalTexture().url, scene);// mat.diffuseTexture;

                //         if (newMeshes[i].name.indexOf("Part_") > -1) {
                //             var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                //             pbr.ambientTexture = new BABYLON.Texture(a/*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                //             pbr.ambientTexture.coordinatesIndex = 1;

                //         }


                //         if (mat.name.indexOf("TRANSPARENT") > -1) {
                //             pbr.opacityTexture = mat.diffuseTexture;
                //         }

                //         newMeshes[i].material = pbr;
                //     default: break;
                // }
            }


            var refl = (<BABYLON.StandardMaterial>scene.getMeshByName("reflectionPlane").material).reflectionTexture;
            for (var i = 0; i < newMeshes.length; i++) {
                (<BABYLON.MirrorTexture>refl).renderList.push(newMeshes[i]);
            }
            debugger;
            envManager.setReflection(scene, null);
        });
    }
}
