/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="PBRConverter.ts" />
/// <reference path="EnvironmentUI.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />
/// <reference path="TextCanvasManager.ts" />
/// <reference path="LensFlareSystem.ts" />
/// <reference path="UploadManager.ts" />
/// <reference path="MaterialManager.ts" />

// things to download: 
// Skyboxes with reflections
// Materials

var sceneMain: BABYLON.Scene;
var envUI: EnvironmentUI;
var uploadManager: UploadManager;
var modelMeshes: BABYLON.AbstractMesh[] = [];
window.addEventListener('DOMContentLoaded', function() {
    var canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var camera: BABYLON.ArcRotateCamera;

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
        var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';

        var envMng = new EnvironmentManager(str, scene);
        envUI = new EnvironmentUI(envMng, scene);

        // Canvases
        var json: string = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.25,"height":0.03,"position":{"x":0.5733,"y":1.0350,"z":-1.4110},"linePosition":{"x":0.008,"y":0.601,"z":-1.2},"offset":0,"anchorTextureURL":"./textures/anchors/Anchor_2.png"},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.25,"height":0.03,"position":{"x":-2,"y":1,"z":0},"linePosition":{"x":-1.192,"y":0.7488,"z":-0.295},"offset":3,"anchorTextureURL":"./textures/anchors/Anchor_4.png"}]';

        var textCanv = new TextCanvasManager(json, scene);

        uploadManager = new UploadManager(scene, envMng);
        //  uploadManager.uploadNewModel("./", "HEADSET", scene, envMng);
        
        var materials = '[{"name":"Plastic","indexOfRefraction":0.52,"alpha":1,"directIntensity":1,"emissiveIntensity":0,"environmentIntensity":0.5,"specularIntensity":0.3,"overloadedShadowIntensity":1.3,"overloadedShadeIntensity":0.68,"cameraExposure":0.8,"cameraContrast":2,"microSurface":0.34,"reflectivityColor":{"r":0.2,"g":0.2,"b":0.2}},{"name":"Metal","indexOfRefraction":2,"alpha":1,"directIntensity":1.7,"emissiveIntensity":1,"environmentIntensity":0.09,"specularIntensity":1,"overloadedShadowIntensity":0.6,"overloadedShadeIntensity":0.22,"cameraExposure":1.5,"cameraContrast":2,"microSurface":0.46,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Chrome","indexOfRefraction":0.66,"alpha":1,"directIntensity":0.3,"emissiveIntensity":1,"environmentIntensity":1,"specularIntensity":1.5,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":0.23,"cameraContrast":1.9,"microSurface":0.99,"reflectivityColor":{"r":1,"g":1,"b":1}}]';
        var materialManager = new MaterialManager(materials, scene);
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
