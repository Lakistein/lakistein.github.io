/* global camera */
/// <reference path="babylon.2.3.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />

window.addEventListener('DOMContentLoaded', function () {

    var canvas = document.getElementById('renderCanvas');
    var gui = new dat.GUI();
    var engine = new BABYLON.Engine(canvas, true);

    function disp(materialBB, materialBP, materialRP, materialChrome, materialMetalArch, materialBC) {
        var folderBlackPlastic = gui.addFolder("Black Plastic");
        folderBlackPlastic.add(materialBP, "indexOfRefraction", 0, 2);
        folderBlackPlastic.add(materialBP, "alpha", 0, 1);
        folderBlackPlastic.add(materialBP, "directIntensity", 0, 2);
        folderBlackPlastic.add(materialBP, "emissiveIntensity", 0, 2);
        folderBlackPlastic.add(materialBP, "environmentIntensity", 0, 2);
        folderBlackPlastic.add(materialBP, "specularIntensity", 0, 2);
        folderBlackPlastic.add(materialBP, "overloadedShadowIntensity", 0, 2);
        folderBlackPlastic.add(materialBP, "overloadedShadeIntensity", 0, 2);
        folderBlackPlastic.add(materialBP, "cameraExposure", 0, 2);
        folderBlackPlastic.add(materialBP, "cameraContrast", 0, 2);
        folderBlackPlastic.add(materialBP, "microSurface", 0, 1);
        folderBlackPlastic.add(materialBP.reflectivityColor, "r", 0, 1);
        folderBlackPlastic.add(materialBP.reflectivityColor, "g", 0, 1);
        folderBlackPlastic.add(materialBP.reflectivityColor, "b", 0, 1);

        var folderRedPlastic = gui.addFolder("Red Plastic");
        folderRedPlastic.add(materialRP, "indexOfRefraction", 0, 2);
        folderRedPlastic.add(materialRP, "alpha", 0, 1);
        folderRedPlastic.add(materialRP, "directIntensity", 0, 2);
        folderRedPlastic.add(materialRP, "emissiveIntensity", 0, 2);
        folderRedPlastic.add(materialRP, "environmentIntensity", 0, 2);
        folderRedPlastic.add(materialRP, "specularIntensity", 0, 2);
        folderRedPlastic.add(materialRP, "overloadedShadowIntensity", 0, 2);
        folderRedPlastic.add(materialRP, "overloadedShadeIntensity", 0, 2);
        folderRedPlastic.add(materialRP, "cameraExposure", 0, 2);
        folderRedPlastic.add(materialRP, "cameraContrast", 0, 2);
        folderRedPlastic.add(materialRP, "microSurface", 0, 1);
        folderRedPlastic.add(materialRP.reflectivityColor, "r", 0, 1);
        folderRedPlastic.add(materialRP.reflectivityColor, "g", 0, 1);
        folderRedPlastic.add(materialRP.reflectivityColor, "b", 0, 1);

        var folderChrome = gui.addFolder("Chrome");
        folderChrome.add(materialChrome, "indexOfRefraction", 0, 2);
        folderChrome.add(materialChrome, "alpha", 0, 1);
        folderChrome.add(materialChrome, "directIntensity", 0, 2);
        folderChrome.add(materialChrome, "emissiveIntensity", 0, 2);
        folderChrome.add(materialChrome, "environmentIntensity", 0, 2);
        folderChrome.add(materialChrome, "specularIntensity", 0, 2);
        folderChrome.add(materialChrome, "overloadedShadowIntensity", 0, 2);
        folderChrome.add(materialChrome, "overloadedShadeIntensity", 0, 2);
        folderChrome.add(materialChrome, "cameraExposure", 0, 2);
        folderChrome.add(materialChrome, "cameraContrast", 0, 2);
        folderChrome.add(materialChrome, "microSurface", 0, 1);
        folderChrome.add(materialChrome.reflectivityColor, "r", 0, 1);
        folderChrome.add(materialChrome.reflectivityColor, "g", 0, 1);
        folderChrome.add(materialChrome.reflectivityColor, "b", 0, 1);

        var folderArch = gui.addFolder("Metal Arch");
        folderArch.add(materialMetalArch, "indexOfRefraction", 0, 2);
        folderArch.add(materialMetalArch, "alpha", 0, 1);
        folderArch.add(materialMetalArch, "directIntensity", 0, 2);
        folderArch.add(materialMetalArch, "emissiveIntensity", 0, 2);
        folderArch.add(materialMetalArch, "environmentIntensity", 0, 2);
        folderArch.add(materialMetalArch, "specularIntensity", 0, 2);
        folderArch.add(materialMetalArch, "overloadedShadowIntensity", 0, 2);
        folderArch.add(materialMetalArch, "overloadedShadeIntensity", 0, 2);
        folderArch.add(materialMetalArch, "cameraExposure", 0, 2);
        folderArch.add(materialMetalArch, "cameraContrast", 0, 2);
        folderArch.add(materialMetalArch, "microSurface", 0, 1);
        folderArch.add(materialMetalArch.reflectivityColor, "r", 0, 1);
        folderArch.add(materialMetalArch.reflectivityColor, "g", 0, 1);
        folderArch.add(materialMetalArch.reflectivityColor, "b", 0, 1);

        var folderBlackBox = gui.addFolder("Black Box");
        folderBlackBox.add(materialBB, "indexOfRefraction", 0, 2);
        folderBlackBox.add(materialBB, "alpha", 0, 1);
        folderBlackBox.add(materialBB, "directIntensity", 0, 2);
        folderBlackBox.add(materialBB, "emissiveIntensity", 0, 2);
        folderBlackBox.add(materialBB, "environmentIntensity", 0, 2);
        folderBlackBox.add(materialBB, "specularIntensity", 0, 2);
        folderBlackBox.add(materialBB, "overloadedShadowIntensity", 0, 2);
        folderBlackBox.add(materialBB, "overloadedShadeIntensity", 0, 2);
        folderBlackBox.add(materialBB, "cameraExposure", 0, 2);
        folderBlackBox.add(materialBB, "cameraContrast", 0, 2);
        folderBlackBox.add(materialBB, "microSurface", 0, 1);
        folderBlackBox.add(materialBB.reflectivityColor, "r", 0, 1);
        folderBlackBox.add(materialBB.reflectivityColor, "g", 0, 1);
        folderBlackBox.add(materialBB.reflectivityColor, "b", 0, 1);

        var folderBlackCushions = gui.addFolder("Black Cushions");
        folderBlackCushions.add(materialBC, "indexOfRefraction", 0, 2);
        folderBlackCushions.add(materialBC, "alpha", 0, 1);
        folderBlackCushions.add(materialBC, "directIntensity", 0, 2);
        folderBlackCushions.add(materialBC, "emissiveIntensity", 0, 2);
        folderBlackCushions.add(materialBC, "environmentIntensity", 0, 2);
        folderBlackCushions.add(materialBC, "specularIntensity", 0, 2);
        folderBlackCushions.add(materialBC, "overloadedShadowIntensity", 0, 2);
        folderBlackCushions.add(materialBC, "overloadedShadeIntensity", 0, 2);
        folderBlackCushions.add(materialBC, "cameraExposure", 0, 2);
        folderBlackCushions.add(materialBC, "cameraContrast", 0, 2);
        folderBlackCushions.add(materialBC, "microSurface", 0, 1);
        folderBlackCushions.add(materialBC.reflectivityColor, "r", 0, 1);
        folderBlackCushions.add(materialBC.reflectivityColor, "g", 0, 1);
        folderBlackCushions.add(materialBC.reflectivityColor, "b", 0, 1);
    };
    function setMaterialValues(material, indexOfRefraction, alpha, directIntensity, emissiveIntensity,
        environmentIntensity, specularIntensity, overloadedShadowIntensity, overloadedShadeIntensity,
        cameraExposure, cameraContrast, microSurface, reflectionTexture, reflectivityColor) {
        material.reflectivityColor = reflectivityColor;
        material.reflectivityColor = reflectivityColor;
        material.reflectionTexture = reflectionTexture;
        material.indexOfRefraction = indexOfRefraction;
        material.directIntensity = directIntensity;
        material.environmentIntensity = environmentIntensity;
        material.overloadedShadeIntensity = overloadedShadeIntensity;
        material.cameraExposure = cameraExposure;
        material.cameraContrast = cameraContrast;
        material.microSurface = microSurface;
    }

    var createScene = function () {

        var scene = new BABYLON.Scene(engine);
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 6, new BABYLON.Vector3(0, .5, 0), scene);
        camera.lowerRadiusLimit = 2.5;
        camera.upperRadiusLimit = 6;
        camera.upperBetaLimit = 1.6;
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 50;
        scene.activeCamera = camera;
        var spotLight = new BABYLON.SpotLight("spot", new BABYLON.Vector3(-0.06, 3.66, -3), new BABYLON.Vector3(-0.1, -0.8, 0.6), 0.6, 1, scene);
        
        spotLight.range = 8;
        spotLight.intensity = 500;
        spotLight.diffuse = new BABYLON.Color3(0, 0, 0);
        spotLight.specular = new BABYLON.Color3(1, 1, 1);
        //var ambLi = new BABYLON.HemisphericLight("l", BABYLON.Vector3.Up(), scene);
        var reflectionTexture = new BABYLON.CubeTexture("./textures/skybox", scene);

        var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.reflectionTexture = reflectionTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;

        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {
            var blackPlastic = new BABYLON.PBRMaterial("bp", scene);
            var redPlastic = new BABYLON.PBRMaterial("rp", scene);
            var chrome = new BABYLON.PBRMaterial("ch", scene);
            var blackMetal = new BABYLON.PBRMaterial("bm", scene);
            var blackBox = new BABYLON.PBRMaterial("bb", scene);
            var blackCushion = new BABYLON.PBRMaterial("bc", scene);
            for (var i = 0; i < newMeshes.length; i++) {
                switch (newMeshes[i].name) {
                    case "BOX_STYLE_1":
                        blackBox.albedoTexture = new BABYLON.Texture("./textures/blackbox.jpg", scene);
                        blackBox.ambientTexture = new BABYLON.Texture("./textures/BOX_STYLE_1.jpg", scene);
                        blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        blackBox.reflectionTexture = reflectionTexture;
                        blackBox.indexOfRefraction = 2;
                        blackBox.directIntensity = 1;
                        blackBox.environmentIntensity = 0.2;
                        blackBox.overloadedShadeIntensity = 0.8;
                        blackBox.cameraExposure = 0.8;
                        blackBox.cameraContrast = 1.6;
                        blackBox.microSurface = 0.1;
                        newMeshes[i].material = blackBox;
                        break;
                    case "background":
                        var background = new BABYLON.PBRMaterial("bg", scene);
                        background.ambientTexture = new BABYLON.Texture("./textures/BACKGROUND_STYLE_1.jpg", scene);
                        background.albedoColor = BABYLON.Color3.Gray();
                        background.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        //background.reflectionTexture = reflectionTexture;
                        background.indexOfRefraction = 2;
                        background.directIntensity = 1;
                        background.environmentIntensity = 0.4;
                        background.overloadedShadeIntensity = 0.8;
                        background.cameraExposure = 0.8;
                        background.cameraContrast = 1.6;
                        background.microSurface = 0;
                        newMeshes[i].material = background;
                        break;
                    case "GROUNDPLANE_STYLE_1":
                        var ground = new BABYLON.StandardMaterial("g", scene);
                        ground.opacityTexture = new BABYLON.Texture("./textures/GROUNDPLANESHADOW_STYLE_1.png", scene);
                        ground.specularColor = BABYLON.Color3.Black();
                        newMeshes[i].material = ground;
                        break;
                    case "HEADSETARCH_STYLE_1":
                        blackMetal.albedoTexture = new BABYLON.Texture("./textures/blackmetal.jpg", scene);
                        blackMetal.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        blackMetal.ambientTexture.coordinatesIndex = 1;
                        blackMetal.reflectivityColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                        blackMetal.reflectionTexture = reflectionTexture;
                        blackMetal.indexOfRefraction = 2;
                        blackMetal.directIntensity = 0.2;
                        blackMetal.environmentIntensity = 0.93;
                        blackMetal.specularIntensity = 0.7;
                        blackMetal.overloadedShadeIntensity = 0.8;
                        blackMetal.cameraExposure = 0.8;
                        blackMetal.cameraContrast = 1.6;
                        blackMetal.microSurface = 0.5;
                        newMeshes[i].material = blackMetal;
                        break;
                    case "HEADSETBLACKPLASTIC_STYLE_1":
                        blackPlastic.albedoTexture = new BABYLON.Texture("./textures/blackplastic.jpg", scene);
                        blackPlastic.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        blackPlastic.ambientTexture.coordinatesIndex = 1;
                        blackPlastic.reflectionTexture = reflectionTexture;
                        blackPlastic.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
                        blackPlastic.specularIntensity = 0.1;
                        blackPlastic.indexOfRefraction = 0.52;
                        blackPlastic.directIntensity = 1;
                        blackPlastic.environmentIntensity = 0.05;
                        blackPlastic.overloadedShadeIntensity = 0.8;
                        blackPlastic.cameraExposure = 0.8;
                        blackPlastic.cameraContrast = 1.6;
                        blackPlastic.microSurface = 0.32;
                        newMeshes[i].material = blackPlastic;
                        break;
                    case "HEADSETCHROME_STYLE_1":
                        chrome.albedoTexture = new BABYLON.Texture("./textures/chrome.jpg", scene);
                        chrome.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        chrome.ambientTexture.coordinatesIndex = 1;
                        chrome.reflectionTexture = reflectionTexture;
                        chrome.reflectivityColor = new BABYLON.Color3(.9, .9, .9);
                        chrome.directIntensity = 0.3;
                        chrome.specularIntensity = 1.5;
                        chrome.environmentIntensity = 1;
                        chrome.cameraExposure = .55;
                        chrome.cameraContrast = 1.5;
                        chrome.microSurface = 0.99;
                        newMeshes[i].material = chrome;
                        break;
                    case "HEADSETCOLOREDPLASTIC_STYLE_1":
                        redPlastic.albedoTexture = new BABYLON.Texture("./textures/redplastic.jpg", scene);
                        redPlastic.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        redPlastic.ambientTexture.coordinatesIndex = 1;
                        redPlastic.reflectionTexture = reflectionTexture;
                        redPlastic.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                        redPlastic.indexOfRefraction = .52;
                        redPlastic.directIntensity = 1;
                        redPlastic.environmentIntensity = 0;
                        redPlastic.overloadedShadeIntensity = 0.8;
                        redPlastic.cameraExposure = 0.8;
                        redPlastic.cameraContrast = 1.5;
                        redPlastic.microSurface = 0.68;
                        newMeshes[i].material = redPlastic;
                        break;
                    case "HEADSETCUSHION_STYLE_1":

                        blackCushion.albedoTexture = new BABYLON.Texture("./textures/blackcushion.jpg", scene);
                        blackCushion.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                        blackCushion.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        blackCushion.ambientTexture.coordinatesIndex = 1;
                        blackCushion.indexOfRefraction = .52;
                        blackCushion.directIntensity = 1;
                        blackCushion.environmentIntensity = 0;
                        blackCushion.overloadedShadeIntensity = 0.8;
                        blackCushion.cameraExposure = 0.5;
                        blackCushion.cameraContrast = 1.5;
                        blackCushion.microSurface = 0;
                        newMeshes[i].material = blackCushion;
                        break;
                    default: break;
                }
            }
            disp(blackBox, blackPlastic, redPlastic, chrome, blackMetal, blackCushion);
        });
        return scene;
    };

    var scene = createScene();
    var b = null;

    engine.runRenderLoop(function () 
    {
        if (b == null)
            b = scene.meshes.find(x => x.name === "background");
 
        if(b != null && camera != null)
        {
            b.rotation.y = -camera.alpha + -Math.PI / 2;
        }

        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});