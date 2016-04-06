/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
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
        var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":0,"range":0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';
        var envMng = new EnvironmentManager(str, scene);
        envUI = new EnvironmentUI(envMng, scene);

        // Canvases
        var json: string = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.25,"height":0.03,"position":{"x":0.5733,"y":1.0350,"z":-1.4110},"linePosition":{"x":0.008,"y":0.601,"z":-1.2},"offset":0,"anchorTextureURL":"./textures/anchors/Anchor_2.png"},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.25,"height":0.03,"position":{"x":-2,"y":1,"z":0},"linePosition":{"x":-1.192,"y":0.7488,"z":-0.295},"offset":3,"anchorTextureURL":"./textures/anchors/Anchor_4.png"}]';

        // var textCanv = new TextCanvasManager(json, scene);

        uploadManager = new UploadManager(scene, envMng);

        var materials = '[{"name":"Chrome","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":0.9483554303824417,"environmentIntensity":1,"specularIntensity":0.02205477745075446,"overloadedShadowIntensity":1.058629317636214,"overloadedShadeIntensity":1.0145197627347051,"cameraExposure":1.301231869594513,"cameraContrast":0.9263006529316873,"microSurface":0.8711637093048011,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Copper","isGlass":"false","indexOfRefraction":0.3308216617613169,"alpha":0.9814375965585734,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":1,"specularIntensity":0.1102738872537723,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":0.8821910980301784,"microSurface":0.4852051039165981,"reflectivityColor":{"r":0.77,"g":0.77,"b":0.77}},{"name":"Brushed Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.9924649852839507,"specularIntensity":0.2205477745075446,"overloadedShadowIntensity":1.874656083314129,"overloadedShadeIntensity":2,"cameraExposure":1.0365745401854596,"cameraContrast":1.5438344215528121,"microSurface":0.49623249264197533,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Rubber","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.4852051039165981,"specularIntensity":2,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1.102738872537723,"microSurface":0.25,"reflectivityColor":{"r":0.27,"g":0.27,"b":0.27}},{"name":"Matte Finish","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.15438344215528121,"specularIntensity":1,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1,"microSurface":0.07719172107764061,"reflectivityColor":{"r":0.05,"g":0.05,"b":0.05}},{"name":"Clear Glass","isGlass":"true","indexOfRefraction":0.2360347112646383,"alpha":0.3422503313337255,"directIntensity":1.1093631429438,"emissiveIntensity":1,"environmentIntensity":1,"specularIntensity":0.04720694225292766,"overloadedShadowIntensity":0.6372937204145234,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1,"microSurface":0.684500662667451,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Dark Metal","isGlass":"true","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.15,"emissiveIntensity":1.0,"environmentIntensity":0.29,"specularIntensity":0.49,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.8,"microSurface":0.68,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Frosted Glass","isGlass":"true","indexOfRefraction":0.1102738872537723,"alpha":0.7167802671495199,"directIntensity":0.3749312166628258,"emissiveIntensity":1,"environmentIntensity":0.28671210685980797,"specularIntensity":0.4852051039165981,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":2,"cameraContrast":1.83054652841262,"microSurface":0.28671210685980797,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Felt","isGlass":"false","indexOfRefraction":0.7278076558748972,"alpha":1,"directIntensity":1.3673962019467765,"emissiveIntensity":1,"environmentIntensity":1.8526013058633746,"specularIntensity":1.1909579823407408,"overloadedShadowIntensity":0.8601363205794239,"overloadedShadeIntensity":1.0806840950869685,"cameraExposure":1.3673962019467765,"cameraContrast":1.0145197627347051,"microSurface":0.05513694362688615,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.4335605342990398,"emissiveIntensity":1,"environmentIntensity":0.02205477745075446,"specularIntensity":0.08821910980301784,"overloadedShadowIntensity":0.9704102078331962,"overloadedShadeIntensity":1,"cameraExposure":1.4556153117497943,"cameraContrast":1.4997248666513032,"microSurface":0.43006816028971195,"reflectivityColor":{"r":0.56,"g":0.56,"b":0.56}},{"name":"Shiny Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.1247936499884774,"emissiveIntensity":1.1689032048899863,"environmentIntensity":0.9924649852839507,"specularIntensity":0.9042458754809328,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1,"microSurface":0.7278076558748972,"reflectivityColor":{"r":0.28,"g":0.28,"b":0.28}},{"name":"Flat Surface","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.345341424496022,"emissiveIntensity":1,"environmentIntensity":0,"specularIntensity":0,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1.345341424496022,"cameraContrast":1,"microSurface":0,"reflectivityColor":{"r":0,"g":0,"b":0}}]';
        var materialManager = new MaterialManager(materials, scene);

        // for (var i = 0; i < scene.meshes.length; i++) {
        //     for (var j = 0; j < modelMeshes.length; j++) {

        //    }
        // }
        scene.executeWhenReady(() => {
            var Flat_1_pbr = new BABYLON.PBRMaterial("Flat 1", scene);
            Flat_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Flat_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Flat_1 = BABYLON.Mesh.CreateSphere("Flat 1", 100, 3, scene, true);
            Flat_1.renderOutline = false;
            Flat_1.material = Flat_1_pbr;
            modelMeshes.push(Flat_1);
            Flat_1_pbr.indexOfRefraction = 0.66;
            Flat_1_pbr.alpha = 1;
            Flat_1_pbr.directIntensity = 1;
            Flat_1_pbr.emissiveIntensity = 0.94;
            Flat_1_pbr.environmentIntensity = 1;
            Flat_1_pbr.specularIntensity = 0;
            Flat_1_pbr.overloadedShadowIntensity = 1;
            Flat_1_pbr.overloadedShadeIntensity = 1;
            Flat_1_pbr.cameraExposure = 1.3;
            Flat_1_pbr.cameraContrast = 0.9;
            Flat_1_pbr.microSurface = 0.87;
            Flat_1_pbr.reflectivityColor = new BABYLON.Color3(1, 1, 1);
            debugger;
            (<BABYLON.PBRMaterial>Flat_1.material).reflectionTexture = envMng.environments[0].reflectionTexture;
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
