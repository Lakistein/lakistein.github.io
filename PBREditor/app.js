window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var gui = new dat.GUI();
    var hdrTexture;
    var gui2 = new dat.GUI();
    var oldPos;
    var spheres = [];
    var currSphere;
    function generateJson(pbr, display) {
        var txt = '{' +
            '"name":"' + pbr.name + '",' +
            '"isGlass":"' + (pbr.refractionTexture ? "true" : "false") + '",' +
            '"indexOfRefraction":' + pbr.indexOfRefraction.toPrecision(2) + ',' +
            '"alpha":' + pbr.alpha.toPrecision(2) + ',' +
            '"directIntensity":' + pbr.directIntensity.toPrecision(2) + ',' +
            '"emissiveIntensity":' + pbr.emissiveIntensity.toPrecision(2) + ',' +
            '"environmentIntensity":' + pbr.environmentIntensity.toPrecision(2) + ',' +
            '"specularIntensity":' + pbr.specularIntensity.toPrecision(2) + ',' +
            '"overloadedShadowIntensity":' + pbr.overloadedShadowIntensity.toPrecision(2) + ',' +
            '"overloadedShadeIntensity":' + pbr.overloadedShadeIntensity.toPrecision(2) + ',' +
            '"cameraExposure":' + pbr.cameraExposure.toPrecision(2) + ',' +
            '"cameraContrast":' + pbr.cameraContrast.toPrecision(2) + ',' +
            '"microSurface":' + pbr.microSurface.toPrecision(2) + ',' +
            '"reflectivityColor":{"r":' + pbr.reflectivityColor.r.toPrecision(2) + ', "g":' + pbr.reflectivityColor.g.toPrecision(2) + ', "b":' + pbr.reflectivityColor.b.toPrecision(2) + '}' +
            '}';
        if (display) {
            var txtAre = document.getElementById("txt");
            var btn = document.getElementById("btn");
            txtAre.textContent = txt;
        }
        return txt;
    }
    function displayMaterialValues(material, scene) {
        var folder = gui.addFolder(material.name);
        var name = folder.add(material, "name").listen();
        name.onFinishChange(function (value) {
            if (value.indexOf("{") > -1) {
                var jsonMat = JSON.parse(value);
                material.name = jsonMat.name;
                material.indexOfRefraction = jsonMat.indexOfRefraction;
                material.alpha = jsonMat.alpha;
                material.directIntensity = jsonMat.directIntensity;
                material.emissiveIntensity = jsonMat.emissiveIntensity;
                material.environmentIntensity = jsonMat.environmentIntensity;
                material.specularIntensity = jsonMat.specularIntensity;
                material.overloadedShadowIntensity = jsonMat.overloadedShadowIntensity;
                material.overloadedShadeIntensity = jsonMat.overloadedShadeIntensity;
                material.cameraExposure = jsonMat.cameraExposure;
                material.cameraContrast = jsonMat.cameraContrast;
                material.microSurface = jsonMat.microSurface;
                material.reflectivityColor = new BABYLON.Color3(jsonMat.reflectivityColor.r, jsonMat.reflectivityColor.g, jsonMat.reflectivityColor.b);
            }
        });
        folder.add(material, "indexOfRefraction", 0, 2).listen();
        folder.add(material, "alpha", 0, 1).listen();
        folder.add(material, "directIntensity", 0, 2).listen();
        folder.add(material, "emissiveIntensity", 0, 2).listen();
        folder.add(material, "environmentIntensity", 0, 2).listen();
        folder.add(material, "specularIntensity", 0, 2).listen();
        folder.add(material, "overloadedShadowIntensity", 0, 2).listen();
        folder.add(material, "overloadedShadeIntensity", 0, 2).listen();
        folder.add(material, "cameraExposure", 0, 2).listen();
        folder.add(material, "cameraContrast", 0, 2).listen();
        folder.add(material, "microSurface", 0, 1).listen();
        var color = folder.addColor(material, "albedoColor").listen();
        color.onChange(function (value) {
            material.albedoColor = new BABYLON.Color3(value.r / 255, value.g / 255, value.b / 255);
        });
        folder.add(material.reflectivityColor, "r", 0, 1).listen();
        folder.add(material.reflectivityColor, "g", 0, 1).listen();
        folder.add(material.reflectivityColor, "b", 0, 1).listen();
        var obj = { Generate_Json: function () {
                var txt = '{' +
                    '"name":"' + material.name + '",' +
                    '"isGlass":"' + (material.refractionTexture ? "true" : "false") + '",' +
                    '"indexOfRefraction":' + material.indexOfRefraction.toPrecision(2) + ',' +
                    '"alpha":' + material.alpha.toPrecision(2) + ',' +
                    '"directIntensity":' + material.directIntensity.toPrecision(2) + ',' +
                    '"emissiveIntensity":' + material.emissiveIntensity.toPrecision(2) + ',' +
                    '"environmentIntensity":' + material.environmentIntensity.toPrecision(2) + ',' +
                    '"specularIntensity":' + material.specularIntensity.toPrecision(2) + ',' +
                    '"overloadedShadowIntensity":' + material.overloadedShadowIntensity.toPrecision(2) + ',' +
                    '"overloadedShadeIntensity":' + material.overloadedShadeIntensity.toPrecision(2) + ',' +
                    '"cameraExposure":' + material.cameraExposure.toPrecision(2) + ',' +
                    '"cameraContrast":' + material.cameraContrast.toPrecision(2) + ',' +
                    '"microSurface":' + material.microSurface.toPrecision(2) + ',' +
                    '"reflectivityColor":{"r":' + material.reflectivityColor.r.toPrecision(2) + ', "g":' + material.reflectivityColor.g.toPrecision(2) + ', "b":' + material.reflectivityColor.b.toPrecision(2) + '}' +
                    '}';
                var txtAre = document.getElementById("txt");
                var btn = document.getElementById("btn");
                txtAre.textContent = txt;
            } };
        var obj2 = { Open_In_New_Scene: function (material2) {
                debugger;
                var s = material2.getBindedMeshes()[0];
                oldPos = s.position;
                s.position = new BABYLON.Vector3(0, 0, 0);
                currSphere = s;
                scene.getMeshByName("hdrSkyBox").isVisible = false;
                for (var i = 0; i < spheres.length; i++) {
                    if (spheres[i].name == s.name)
                        continue;
                    spheres[i].isVisible = false;
                }
                var folder = gui2.__folders['Material'];
                if (folder) {
                    folder.close();
                    gui2.__ul.removeChild(folder.domElement.parentNode);
                    delete gui2.__folders['Material'];
                    gui2.onResize();
                }
                var folder = gui2.addFolder('Material');
                var name = folder.add(material2, "name").listen();
                name.onFinishChange(function (value) {
                    if (value.indexOf("{") > -1) {
                        var jsonMat = JSON.parse(value);
                        material2.name = jsonMat.name;
                        material2.indexOfRefraction = jsonMat.indexOfRefraction;
                        material2.alpha = jsonMat.alpha;
                        material2.directIntensity = jsonMat.directIntensity;
                        material2.emissiveIntensity = jsonMat.emissiveIntensity;
                        material2.environmentIntensity = jsonMat.environmentIntensity;
                        material2.specularIntensity = jsonMat.specularIntensity;
                        material2.overloadedShadowIntensity = jsonMat.overloadedShadowIntensity;
                        material2.overloadedShadeIntensity = jsonMat.overloadedShadeIntensity;
                        material2.cameraExposure = jsonMat.cameraExposure;
                        material2.cameraContrast = jsonMat.cameraContrast;
                        material2.microSurface = jsonMat.microSurface;
                        material2.reflectivityColor = new BABYLON.Color3(jsonMat.reflectivityColor.r, jsonMat.reflectivityColor.g, jsonMat.reflectivityColor.b);
                    }
                });
                folder.add(material2, "indexOfRefraction", 0, 2).listen();
                folder.add(material2, "alpha", 0, 1).listen();
                folder.add(material2, "directIntensity", 0, 2).listen();
                folder.add(material2, "emissiveIntensity", 0, 2).listen();
                folder.add(material2, "environmentIntensity", 0, 2).listen();
                folder.add(material2, "specularIntensity", 0, 2).listen();
                folder.add(material2, "overloadedShadowIntensity", 0, 2).listen();
                folder.add(material2, "overloadedShadeIntensity", 0, 2).listen();
                folder.add(material2, "cameraExposure", 0, 2).listen();
                folder.add(material2, "cameraContrast", 0, 2).listen();
                folder.add(material2, "microSurface", 0, 1).listen();
                var color = folder.addColor(material2, "albedoColor").listen();
                color.onChange(function (value) {
                    material2.albedoColor = new BABYLON.Color3(value.r / 255, value.g / 255, value.b / 255);
                    console.log(material2.albedoColor);
                });
                folder.add(material2.reflectivityColor, "r", 0, 1).listen();
                folder.add(material2.reflectivityColor, "g", 0, 1).listen();
                folder.add(material2.reflectivityColor, "b", 0, 1).listen();
                var obj3 = { Back: function () {
                        currSphere.position = oldPos;
                        scene.getMeshByName("hdrSkyBox").isVisible = true;
                        for (var i = 0; i < spheres.length; i++) {
                            spheres[i].isVisible = true;
                        }
                    } };
                folder.add(obj3, 'Back');
                folder.add(obj, 'Generate_Json');
            } };
        folder.add(obj, 'Generate_Json');
        folder.add({ Open_In_New_Scene: obj2.Open_In_New_Scene.bind(this, material) }, 'Open_In_New_Scene');
    }
    function createScene() {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, false);
        camera.wheelPrecision = 50;
        scene.activeCamera = camera;
        scene.clearColor = BABYLON.Color3.Gray();
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;
        hdrTexture = new BABYLON.HDRCubeTexture("./room.hdr", scene, 128, false, true, false, true);
        var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
        var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        hdrSkyboxMaterial.microSurface = 0.85;
        hdrSkyboxMaterial.cameraExposure = 0.6;
        hdrSkyboxMaterial.cameraContrast = 1.6;
        hdrSkybox.material = hdrSkyboxMaterial;
        hdrSkybox.infiniteDistance = true;
        {
            var Flat_1_pbr = new BABYLON.PBRMaterial("Flat 1", scene);
            Flat_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Flat_1_pbr.albedoColor = BABYLON.Color3.Red();
            Flat_1_pbr.reflectivityColor = BABYLON.Color3.White();
            Flat_1_pbr.microSurface = 0;
            var Flat_1 = BABYLON.Mesh.CreateSphere("Flat 1", 100, 3, scene, true);
            Flat_1.position.addInPlace(new BABYLON.Vector3(-4, 0, -6));
            Flat_1.material = Flat_1_pbr;
            Flat_1_pbr.reflectionTexture = hdrTexture;
            displayMaterialValues(Flat_1_pbr, scene);
            spheres.push(Flat_1);
        }
        {
            var Felt_1_pbr = new BABYLON.PBRMaterial("Felt 1", scene);
            Felt_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Felt_1_pbr.albedoColor = BABYLON.Color3.Red();
            Felt_1_pbr.reflectivityColor = BABYLON.Color3.White();
            Felt_1_pbr.microSurface = 0.1;
            var Felt_1 = BABYLON.Mesh.CreateSphere("Felt 1", 100, 3, scene, true);
            Felt_1.material = Felt_1_pbr;
            Felt_1.position.addInPlace(new BABYLON.Vector3(0, 0, -6));
            displayMaterialValues(Felt_1_pbr, scene);
            Felt_1_pbr.reflectionTexture = hdrTexture;
            spheres.push(Felt_1);
        }
        {
            var Semigloss_1_pbr = new BABYLON.PBRMaterial("Semigloss 1", scene);
            Semigloss_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Semigloss_1_pbr.albedoColor = BABYLON.Color3.Red();
            Semigloss_1_pbr.reflectivityColor = BABYLON.Color3.White();
            Semigloss_1_pbr.microSurface = 0.2;
            var Semigloss_1 = BABYLON.Mesh.CreateSphere("Semigloss 1", 100, 3, scene, true);
            Semigloss_1.material = Semigloss_1_pbr;
            Semigloss_1.position.addInPlace(new BABYLON.Vector3(4, 0, -6));
            displayMaterialValues(Semigloss_1_pbr, scene);
            Semigloss_1_pbr.reflectionTexture = hdrTexture;
            spheres.push(Semigloss_1);
        }
        {
            var Semigloss_2_pbr = new BABYLON.PBRMaterial("Semigloss 2", scene);
            Semigloss_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Semigloss_2_pbr.albedoColor = BABYLON.Color3.Red();
            Semigloss_2_pbr.reflectivityColor = BABYLON.Color3.White();
            Semigloss_2_pbr.microSurface = 0.3;
            var Semigloss_2 = BABYLON.Mesh.CreateSphere("Semigloss 2 ", 100, 3, scene, true);
            Semigloss_2.material = Semigloss_2_pbr;
            Semigloss_2.position.addInPlace(new BABYLON.Vector3(-4, 0, -2));
            displayMaterialValues(Semigloss_2_pbr, scene);
            Semigloss_2_pbr.reflectionTexture = hdrTexture;
            spheres.push(Semigloss_2);
        }
        {
            var Specular_1_pbr = new BABYLON.PBRMaterial("Specular 1", scene);
            Specular_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Specular_1_pbr.albedoColor = BABYLON.Color3.Red();
            Specular_1_pbr.reflectivityColor = BABYLON.Color3.White();
            Specular_1_pbr.microSurface = 0.4;
            var Specular_1 = BABYLON.Mesh.CreateSphere("Specular 1", 100, 3, scene, true);
            Specular_1.material = Specular_1_pbr;
            Specular_1.position.addInPlace(new BABYLON.Vector3(0, 0, -2));
            displayMaterialValues(Specular_1_pbr, scene);
            Specular_1_pbr.reflectionTexture = hdrTexture;
            spheres.push(Specular_1);
        }
        {
            var Specular_2_pbr = new BABYLON.PBRMaterial("Specular 2", scene);
            Specular_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Specular_2_pbr.albedoColor = BABYLON.Color3.Red();
            Specular_2_pbr.reflectivityColor = BABYLON.Color3.White();
            Specular_2_pbr.microSurface = 0.5;
            var Specular_2 = BABYLON.Mesh.CreateSphere("Specular 2", 100, 3, scene, true);
            Specular_2.material = Specular_2_pbr;
            Specular_2.position.addInPlace(new BABYLON.Vector3(4, 0, -2));
            displayMaterialValues(Specular_2_pbr, scene);
            Specular_2_pbr.reflectionTexture = hdrTexture;
            spheres.push(Specular_2);
        }
        {
            var Specular_3_pbr = new BABYLON.PBRMaterial("Specular 3", scene);
            Specular_3_pbr.reflectivityColor = BABYLON.Color3.Black();
            Specular_3_pbr.albedoColor = BABYLON.Color3.Red();
            Specular_3_pbr.reflectivityColor = BABYLON.Color3.White();
            Specular_3_pbr.microSurface = 0.6;
            var Specular_3 = BABYLON.Mesh.CreateSphere("Specular 3", 100, 3, scene, true);
            Specular_3.material = Specular_3_pbr;
            Specular_3.position.addInPlace(new BABYLON.Vector3(-4, 0, 2));
            displayMaterialValues(Specular_3_pbr, scene);
            Specular_3_pbr.reflectionTexture = hdrTexture;
            spheres.push(Specular_3);
        }
        {
            var Chrome_1_pbr = new BABYLON.PBRMaterial("Chrome 1", scene);
            Chrome_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Chrome_1_pbr.albedoColor = BABYLON.Color3.Red();
            Chrome_1_pbr.reflectivityColor = BABYLON.Color3.White();
            Chrome_1_pbr.microSurface = 0.7;
            var Chrome_1 = BABYLON.Mesh.CreateSphere("Chrome 1", 100, 3, scene, true);
            Chrome_1.material = Chrome_1_pbr;
            Chrome_1.position.addInPlace(new BABYLON.Vector3(0, 0, 2));
            displayMaterialValues(Chrome_1_pbr, scene);
            Chrome_1_pbr.reflectionTexture = hdrTexture;
            spheres.push(Chrome_1);
        }
        {
            var Chrome_2_pbr = new BABYLON.PBRMaterial("Chrome 2", scene);
            Chrome_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Chrome_2_pbr.albedoColor = BABYLON.Color3.Red();
            Chrome_2_pbr.reflectivityColor = BABYLON.Color3.White();
            Chrome_2_pbr.microSurface = 0.8;
            var Chrome_2 = BABYLON.Mesh.CreateSphere("Chrome 2", 100, 3, scene, true);
            Chrome_2.material = Chrome_2_pbr;
            Chrome_2.position.addInPlace(new BABYLON.Vector3(4, 0, 2));
            displayMaterialValues(Chrome_2_pbr, scene);
            Chrome_2_pbr.reflectionTexture = hdrTexture;
            spheres.push(Chrome_2);
        }
        {
            var Chrome_3_pbr = new BABYLON.PBRMaterial("Chrome 3", scene);
            Chrome_3_pbr.reflectivityColor = BABYLON.Color3.Black();
            Chrome_3_pbr.albedoColor = BABYLON.Color3.Red();
            Chrome_3_pbr.reflectivityColor = BABYLON.Color3.White();
            Chrome_3_pbr.microSurface = 0.9;
            var Chrome_3 = BABYLON.Mesh.CreateSphere("Chrome 3", 100, 3, scene, true);
            Chrome_3.material = Chrome_3_pbr;
            Chrome_3.position.addInPlace(new BABYLON.Vector3(-4, 0, 6));
            displayMaterialValues(Chrome_3_pbr, scene);
            Chrome_3_pbr.reflectionTexture = hdrTexture;
            spheres.push(Chrome_3);
        }
        {
            var Glass_1_pbr = new BABYLON.PBRMaterial("Glass 1", scene);
            Glass_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Glass_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Glass_1 = BABYLON.Mesh.CreateSphere("Glass 1", 100, 3, scene, true);
            Glass_1.material = Glass_1_pbr;
            Glass_1.position.addInPlace(new BABYLON.Vector3(0, 0, 6));
            displayMaterialValues(Glass_1_pbr, scene);
            Glass_1_pbr.reflectionTexture = hdrTexture;
            Glass_1_pbr.refractionTexture = hdrTexture;
            spheres.push(Glass_1);
        }
        {
            var Glass_2_pbr = new BABYLON.PBRMaterial("Glass 2", scene);
            Glass_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Glass_2_pbr.albedoColor = BABYLON.Color3.Red();
            var Glass_2 = BABYLON.Mesh.CreateSphere("Glass 2", 100, 3, scene, true);
            Glass_2.material = Glass_2_pbr;
            Glass_2.position.addInPlace(new BABYLON.Vector3(4, 0, 6));
            displayMaterialValues(Glass_2_pbr, scene);
            Glass_2_pbr.reflectionTexture = hdrTexture;
            Glass_2_pbr.refractionTexture = hdrTexture;
            spheres.push(Glass_2);
        }
        var txtAre = document.getElementById("txt");
        var btn = document.getElementById("btn");
        btn.onclick = function (ev) {
            var txt = "[";
            for (var i = 0; i < scene.meshes.length; i++) {
                if (scene.meshes[i].material instanceof BABYLON.PBRMaterial && scene.meshes[i].material.name != "skyBox") {
                    txt += generateJson(scene.meshes[i].material, false);
                    txt += ",";
                }
            }
            txt = txt.substr(0, txt.length - 2);
            txt += "]";
            txtAre.textContent = txt;
        };
        return scene;
    }
    ;
    var scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
