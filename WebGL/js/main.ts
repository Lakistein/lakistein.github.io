/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="PBRConverter.ts" />
/// <reference path="EnvironmentUI.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />
/// <reference path="TextCanvasManager.ts" />
/// <reference path="LensFlareSystem.ts" />

// things to download: 
// Skyboxes with reflections
// Materials

var sceneMain: BABYLON.Scene;
var envUI: EnvironmentUI;
var modelMeshes = [];
window.addEventListener('DOMContentLoaded', function() {
    var canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
    //var gui = new dat.GUI();

    var engine = new BABYLON.Engine(canvas, true);
   
    var camera: BABYLON.ArcRotateCamera;

    //     function displayMaterialValues(material) {
    //         var folder = gui.addFolder(material.name);
    //         folder.add(material, "indexOfRefraction", 0, 2);
    //         folder.add(material, "alpha", 0, 1);
    //         folder.add(material, "directIntensity", 0, 2);
    //         folder.add(material, "emissiveIntensity", 0, 2);
    //         folder.add(material, "environmentIntensity", 0, 2);
    //         folder.add(material, "specularIntensity", 0, 2);
    //         folder.add(material, "overloadedShadowIntensity", 0, 2);
    //         folder.add(material, "overloadedShadeIntensity", 0, 2);
    //         folder.add(material, "cameraExposure", 0, 2);
    //         folder.add(material, "cameraContrast", 0, 2);
    //         folder.add(material, "microSurface", 0, 1);
    //         var color = folder.addColor(material, "albedoColor");
    //         color.onChange(function(value) {
    //             material.albedoColor = BABYLON.Color3.FromInts(value.r, value.g, value.b);
    //             envUI.environmentManager.setReflection(sceneMain, material.albedoColor);
    // 
    //         });
    //         folder.add(material.reflectivityColor, "r", 0, 1);
    //         folder.add(material.reflectivityColor, "g", 0, 1);
    //         folder.add(material.reflectivityColor, "b", 0, 1);
    //     }

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

        // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 3, scene);
        // var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
        // gradientMaterial.topColor = BABYLON.Color3.Red(); // Set the gradient top color
        // gradientMaterial.bottomColor = BABYLON.Color3.Blue(); // Set the gradient bottom color
        // gradientMaterial.offset = 0.25;
        // sphere.material = gradientMaterial;
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function(newMeshes) {
            var blackPlastic = new BABYLON.PBRMaterial("Black Plastic", scene);
            var redPlastic = new BABYLON.PBRMaterial("Red Plastic", scene);
            var chrome = new BABYLON.PBRMaterial("Chrome", scene);
            var blackMetal = new BABYLON.PBRMaterial("Black Metal", scene);
            var blackBox = new BABYLON.PBRMaterial("Black Box", scene);
            var blackCushion = new BABYLON.PBRMaterial("Black Cushion", scene);

            var hemilight = new BABYLON.HemisphericLight("hemilight1", new BABYLON.Vector3(0, 1, 0), sceneMain);
            hemilight.range = 0.1;
            hemilight.intensity = 0.7;
            for (var i = 0; i < newMeshes.length; i++) {
                switch (newMeshes[i].name) {
                    case "BOX_STYLE_1":
                        blackBox.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackbox.jpg", scene);
                        blackBox.ambientTexture = new BABYLON.Texture("./textures/models-textures/BOX_STYLE_1.jpg", scene);
                        blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        blackBox.indexOfRefraction = 2;
                        blackBox.directIntensity = 1.7;
                        blackBox.environmentIntensity = 0.09;
                        blackBox.overloadedShadowIntensity = 0.6;
                        blackBox.overloadedShadeIntensity = 0.22;
                        blackBox.cameraExposure = 1.5;
                        blackBox.cameraContrast = 2;
                        blackBox.microSurface = 0.46;
                        newMeshes[i].material = blackBox;
                        modelMeshes.push(newMeshes[i]);
                        break;
                    case "background":
                        var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
                        gradientMaterial.topColor = BABYLON.Color3.Red();
                        gradientMaterial.bottomColor = BABYLON.Color3.Blue();
                        newMeshes[i].position.y = -0.1;
                        newMeshes[i].material = gradientMaterial;
                        newMeshes[i].isPickable = false;
                        break;
                    case "GROUNDPLANE_STYLE_1":
                        var ground = new BABYLON.PBRMaterial("g", scene);
                        ground.albedoTexture = new BABYLON.Texture("./textures/models-textures/GROUNDPLANESHADOW_STYLE_1.png", scene);
                        ground.opacityTexture = new BABYLON.Texture("./textures/models-textures/GROUNDPLANESHADOW_STYLE_1.png", scene);
                        ground.albedoTexture.hasAlpha = true;
                        ground.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        ground.directIntensity = 2;
                        ground.environmentIntensity = 0;
                        ground.overloadedShadeIntensity = 0;
                        ground.cameraExposure = 2;
                        ground.cameraContrast = 2;
                        ground.microSurface = 0;
                        newMeshes[i].position.y = 0.01;
                        newMeshes[i].material = ground;
                        newMeshes[i].isPickable = false;
                        break;
                    case "HEADSETARCH_STYLE_1":
                        blackMetal.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackmetal.jpg", scene);
                        blackMetal.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
                        blackMetal.ambientTexture.coordinatesIndex = 1;
                        blackMetal.reflectivityColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                        blackMetal.indexOfRefraction = 2;
                        blackMetal.directIntensity = 0.2;
                        blackMetal.environmentIntensity = 0.24;
                        blackMetal.specularIntensity = 0.7;
                        blackMetal.overloadedShadeIntensity = 0.8;
                        blackMetal.cameraExposure = 1.99;
                        blackMetal.cameraContrast = 1;
                        blackMetal.microSurface = 0.61;
                        newMeshes[i].material = blackMetal;
                        modelMeshes.push(newMeshes[i]);

                        break;
                    case "HEADSETBLACKPLASTIC_STYLE_1":
                        blackPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackplastic.jpg", scene);
                        blackPlastic.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
                        blackPlastic.ambientTexture.coordinatesIndex = 1;
                        blackPlastic.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
                        blackPlastic.specularIntensity = 0.1;
                        blackPlastic.indexOfRefraction = 0.52;
                        blackPlastic.directIntensity = 1;
                        blackPlastic.environmentIntensity = 0.05;
                        blackPlastic.overloadedShadowIntensity = 0.8;
                        blackPlastic.overloadedShadeIntensity = 0.8;
                        blackPlastic.cameraExposure = 1.26;
                        blackPlastic.cameraContrast = 1.6;
                        blackPlastic.microSurface = 0.31;
                        newMeshes[i].material = blackPlastic;
                        modelMeshes.push(newMeshes[i]);

                        break;
                    case "HEADSETCHROME_STYLE_1":
                        chrome.albedoTexture = new BABYLON.Texture("./textures/models-textures/chrome.jpg", scene);
                        chrome.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
                        chrome.ambientTexture.coordinatesIndex = 1;
                        chrome.reflectivityColor = new BABYLON.Color3(.9, .9, .9);
                        chrome.directIntensity = 0.3;
                        chrome.specularIntensity = 1.5;
                        chrome.environmentIntensity = 0.6;
                        chrome.cameraExposure = .23;
                        chrome.cameraContrast = 1.9;
                        chrome.microSurface = 0.21;
                        newMeshes[i].material = chrome;
                        modelMeshes.push(newMeshes[i]);

                        break;
                    case "HEADSETCOLOREDPLASTIC_STYLE_1":
                        redPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/redplastic.jpg", scene);
                        redPlastic.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
                        redPlastic.ambientTexture.coordinatesIndex = 1;
                        redPlastic.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                        redPlastic.indexOfRefraction = .52;
                        redPlastic.directIntensity = 1;
                        redPlastic.environmentIntensity = 0.5;
                        redPlastic.specularIntensity = 0.3;
                        redPlastic.overloadedShadowIntensity = 1.3;
                        redPlastic.overloadedShadeIntensity = 0.68;
                        redPlastic.cameraExposure = 0.8;
                        redPlastic.cameraContrast = 2;
                        redPlastic.microSurface = 0.34;
                        newMeshes[i].material = redPlastic;
                        modelMeshes.push(newMeshes[i]);

                        break;
                    case "HEADSETCUSHION_STYLE_1":
                        blackCushion.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackcushion.jpg", scene);
                        blackCushion.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                        blackCushion.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
                        blackCushion.ambientTexture.coordinatesIndex = 1;
                        blackCushion.indexOfRefraction = .52;
                        blackCushion.directIntensity = 2;
                        blackCushion.environmentIntensity = 0;
                        blackCushion.overloadedShadeIntensity = 0.81;
                        blackCushion.cameraExposure = 2;
                        blackCushion.cameraContrast = 2;
                        blackCushion.microSurface = 0.4;
                        newMeshes[i].material = blackCushion;
                        modelMeshes.push(newMeshes[i]);

                    default: break;
                    case "groundPlane":
                        var groundPlaneMaterial = new BABYLON.PBRMaterial("groundPlaneMaterial", sceneMain);
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
                        newMeshes[i].material = groundPlaneMaterial;
                        newMeshes[i].isPickable = false;
                        break;
                    case "reflectionPlane":
                        var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene);
                        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, false);
                        (<BABYLON.MirrorTexture>mirrorMaterial.reflectionTexture).mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                        mirrorMaterial.alpha = 0.1;
                        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.reflectionTexture.level = 1;
                        newMeshes[i].material = mirrorMaterial;
                        newMeshes[i].scaling = new BABYLON.Vector3(1010, 1010, 1010);
                        newMeshes[i].isPickable = false;
                        break;
                }
                // newMeshes[i].isPickable = false;
                if (newMeshes[i].name != "background")
                    hemilight.excludedMeshes.push(newMeshes[i]);
            }

            var refl = (<BABYLON.StandardMaterial>scene.getMeshByName("reflectionPlane").material).reflectionTexture;
            for (var i = 0; i < newMeshes.length; i++) {
                if (newMeshes[i].name != "reflectionPlane")
                    (<BABYLON.MirrorTexture>refl).renderList.push(newMeshes[i]);
            }

            var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';

            envUI = new EnvironmentUI(str, sceneMain);
            (<BABYLON.MirrorTexture>refl).renderList.push(scene.getMeshByName("skybox"));
            var json: string = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.25,"height":0.05,"position":{"x":2,"y":1,"z":0},"linePosition":{"x":0.008,"y":0.601,"z":-1.2},"offset":0,"anchorTextureURL":"./textures/anchors/Anchor_3.png"},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.25,"height":0.05,"position":{"x":-2,"y":1,"z":0},"linePosition":{"x":-1.192,"y":0.7488,"z":-0.295},"offset":3,"anchorTextureURL":"./textures/anchors/Anchor_3.png"}]';

            var textCanv = new TextCanvasManager(json, scene);
        });
        return scene;
    }

    sceneMain = createScene();
    var lensFlareSystem = new LensFlareSystem(sceneMain);

    var fps = document.getElementById("fps");
    engine.runRenderLoop(function() {
        sceneMain.render();
        fps.textContent = engine.getFps().toString();
    });
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
