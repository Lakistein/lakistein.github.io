/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />
/// <reference path="EnvironmentUI.ts" />
/// <reference path="TextCanvasManager.ts" />
/// <reference path="LensFlareSystem.ts" />
/// <reference path="UploadManager.ts" />
/// <reference path="MaterialManager.ts" />
/// <reference path="Card.ts" />
/// <reference path="CardManager.ts" />

var sceneMain: BABYLON.Scene;
var envUI: EnvironmentUI;
var envMng: EnvironmentManager;
var uploadManager: UploadManager;
var materialManager: MaterialManager;
var lensFlareSystem: LensFlareSystem;
var modelMeshes: BABYLON.AbstractMesh[] = new Array();

var testSprite: Card;

var canvas: HTMLCanvasElement;
var engine: BABYLON.Engine;
var camera: BABYLON.ArcRotateCamera;

function createScene(params: string) {
    var scene = new BABYLON.Scene(engine);

    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, .5, 0), scene);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 6;
    camera.upperBetaLimit = 1.6;
    camera.wheelPrecision = 50;
    camera.attachControl(canvas, true);
    camera.setPosition(new BABYLON.Vector3(0.0045, 0.7674, -2.9880));
    camera.minZ = 0.01;
    camera.maxZ = 100;
    scene.activeCamera = camera;

    var environments = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":0,"range":0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';

    var materials = '[{"name":"Chrome","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.3,"emissiveIntensity":0.95,"environmentIntensity":1.0,"specularIntensity":2.0,"overloadedShadowIntensity":1.1,"overloadedShadeIntensity":1.0,"cameraExposure":1.3,"cameraContrast":0.93,"microSurface":1,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Copper","isGlass":"false","indexOfRefraction":0.33,"alpha":0.98,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":1.0,"specularIntensity":0.11,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":0.88,"microSurface":0.75,"reflectivityColor":{"r":1.0,"g":0.77,"b":0.50}},{"name":"Brushed Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.99,"specularIntensity":0.22,"overloadedShadowIntensity":1.87,"overloadedShadeIntensity":2,"cameraExposure":1.03,"cameraContrast":1.54,"microSurface":0.49,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Rubber","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":0.066,"specularIntensity":2.0,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.1,"microSurface":0.25,"reflectivityColor":{"r":0.26,"g":0.26,"b":0.26}},{"name":"Matte Finish","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.15438344215528121,"specularIntensity":1,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1,"microSurface":0.07719172107764061,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Clear Glass","isGlass":"true","indexOfRefraction":0.24,"alpha":0.34,"directIntensity":1.1,"emissiveIntensity":1.0,"environmentIntensity":0.68,"specularIntensity":0.49,"overloadedShadowIntensity":0.64,"overloadedShadeIntensity":1.0,"cameraExposure":1.7,"cameraContrast":1.0,"microSurface":1.0,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Dark Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.15,"emissiveIntensity":1.0,"environmentIntensity":0.29,"specularIntensity":0.49,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.8,"microSurface":0.98,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Frosted Glass","isGlass":"true","indexOfRefraction":0.11,"alpha":0.71,"directIntensity":0.37,"emissiveIntensity":1,"environmentIntensity":0.28,"specularIntensity":0.48,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":2,"cameraContrast":1.83,"microSurface":0.28,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Felt","isGlass":"false","indexOfRefraction":0.72,"alpha":1,"directIntensity":1.36,"emissiveIntensity":0.57,"environmentIntensity":1.85,"specularIntensity":1.19,"overloadedShadowIntensity":0.86,"overloadedShadeIntensity":1.08,"cameraExposure":1.36,"cameraContrast":1.01,"microSurface":0.05,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.43,"emissiveIntensity":0.06,"environmentIntensity":0.02,"specularIntensity":0.08,"overloadedShadowIntensity":0.97,"overloadedShadeIntensity":1,"cameraExposure":1.45,"cameraContrast":1.49,"microSurface":0.43,"reflectivityColor":{"r":0.56,"g":0.56,"b":0.56}},{"name":"Glossy Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.93,"emissiveIntensity":1.2,"environmentIntensity":0.31,"specularIntensity":0.20,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.0,"microSurface":0.66,"reflectivityColor":{"r":0.30,"g":0.30,"b":0.30}},{"name":"Flat Surface","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.34,"emissiveIntensity":0,"environmentIntensity":0,"specularIntensity":0,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1.34,"cameraContrast":1,"microSurface":0,"reflectivityColor":{"r":0,"g":0,"b":0}}]';

    envMng = new EnvironmentManager(environments, scene);
    envUI = new EnvironmentUI(envMng, scene);
    lensFlareSystem = new LensFlareSystem(scene, null);
    materialManager = new MaterialManager(materials, scene);
    uploadManager = new UploadManager(scene, envMng);

    return scene;
}

function startApplication(params: string) {
    canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    sceneMain = createScene(params);

    engine.runRenderLoop(function () {
        sceneMain.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
}
