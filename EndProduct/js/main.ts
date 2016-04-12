/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />
/// <reference path="LensFlareSystem.ts" />
/// <reference path="UploadManager.ts" />
/// <reference path="MaterialManager.ts" />

// things to download: 
// Skyboxes with reflections
// Materials

var sceneMain: BABYLON.Scene;
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
        var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./room1.babylon.hdr","lights":[]}]';
        var envMng = new EnvironmentManager(str, scene);

        // Canvases
        // var json: string = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.25,"height":0.03,"position":{"x":0.5733,"y":1.0350,"z":-1.4110},"linePosition":{"x":0.008,"y":0.601,"z":-1.2},"offset":0,"anchorTextureURL":"./textures/anchors/Anchor_2.png"},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.25,"height":0.03,"position":{"x":-2,"y":1,"z":0},"linePosition":{"x":-1.192,"y":0.7488,"z":-0.295},"offset":3,"anchorTextureURL":"./textures/anchors/Anchor_4.png"}]';

        // var textCanv = new TextCanvasManager(json, scene);

        var materials = '[{"name":"Chrome","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.3,"emissiveIntensity":0.95,"environmentIntensity":1.0,"specularIntensity":2.0,"overloadedShadowIntensity":1.1,"overloadedShadeIntensity":1.0,"cameraExposure":1.3,"cameraContrast":0.93,"microSurface":1.0,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Copper","isGlass":"false","indexOfRefraction":0.33,"alpha":0.98,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":1.0,"specularIntensity":0.11,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":0.88,"microSurface":0.75,"reflectivityColor":{"r":1.0,"g":0.77,"b":0.50}},{"name":"Brushed Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.99,"specularIntensity":0.22,"overloadedShadowIntensity":1.87,"overloadedShadeIntensity":2,"cameraExposure":1.03,"cameraContrast":1.54,"microSurface":0.49,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Rubber","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":0.066,"specularIntensity":2.0,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.1,"microSurface":0.25,"reflectivityColor":{"r":0.26,"g":0.26,"b":0.26}},{"name":"Matte Finish","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.15438344215528121,"specularIntensity":1,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1,"microSurface":0.07719172107764061,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Clear Glass","isGlass":"true","indexOfRefraction":0.24,"alpha":0.34,"directIntensity":1.1,"emissiveIntensity":1.0,"environmentIntensity":0.68,"specularIntensity":0.49,"overloadedShadowIntensity":0.64,"overloadedShadeIntensity":1.0,"cameraExposure":1.7,"cameraContrast":1.0,"microSurface":1.0,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Dark Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.15,"emissiveIntensity":1.0,"environmentIntensity":0.29,"specularIntensity":0.49,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.8,"microSurface":0.98,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Frosted Glass","isGlass":"true","indexOfRefraction":0.11,"alpha":0.71,"directIntensity":0.37,"emissiveIntensity":1,"environmentIntensity":0.28,"specularIntensity":0.48,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":2,"cameraContrast":1.83,"microSurface":0.28,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Felt","isGlass":"false","indexOfRefraction":0.72,"alpha":1,"directIntensity":1.36,"emissiveIntensity":0.57,"environmentIntensity":1.85,"specularIntensity":1.19,"overloadedShadowIntensity":0.86,"overloadedShadeIntensity":1.08,"cameraExposure":1.36,"cameraContrast":1.01,"microSurface":0.05,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.43,"emissiveIntensity":0.06,"environmentIntensity":0.02,"specularIntensity":0.08,"overloadedShadowIntensity":0.97,"overloadedShadeIntensity":1,"cameraExposure":1.45,"cameraContrast":1.49,"microSurface":0.43,"reflectivityColor":{"r":0.56,"g":0.56,"b":0.56}},{"name":"Shiny Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.93,"emissiveIntensity":1.2,"environmentIntensity":0.31,"specularIntensity":0.20,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.0,"microSurface":0.66,"reflectivityColor":{"r":0.30,"g":0.30,"b":0.30}},{"name":"Flat Surface","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.34,"emissiveIntensity":0,"environmentIntensity":0,"specularIntensity":0,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1.34,"cameraContrast":1,"microSurface":0,"reflectivityColor":{"r":0,"g":0,"b":0}}]';
        var materialManager = new MaterialManager(materials, scene);

        uploadManager = new UploadManager(scene, envMng);
        var modelStr = "model.babylon";
        uploadManager.uploadModelFromServer(modelStr, "", scene, envMng);

        var matComp = '[{"compNum":1,"matName":"Plastic"},{"compNum":2,"matName":"Brushed Metal"},{"compNum":3,"matName":"Flat Surface"},{"compNum":4,"matName":"Chrome"},{"compNum":5,"matName":"Plastic"},{"compNum":6,"matName":"Flat Surface"}]';
        var matJs = JSON.parse(matComp);
        scene.executeWhenReady(() => {
            for (var i = 0; i < modelMeshes.length; i++) {
                for (var j = 0; j < matJs.length; j++) {
                    if ("Component_" + matJs[j].compNum == modelMeshes[i].name) {
                        var mat = materialManager.getMaterial(matJs[j].matName, scene);
                        mat.albedoTexture = (<BABYLON.PBRMaterial>modelMeshes[i].material).albedoTexture;
                        mat.ambientTexture = (<BABYLON.PBRMaterial>modelMeshes[i].material).ambientTexture;
                        mat.reflectionTexture = (<BABYLON.PBRMaterial>modelMeshes[i].material).reflectionTexture;
                        if (materialManager.materials[matJs[j].matName].isGlass)
                            mat.refractionTexture = (<BABYLON.PBRMaterial>modelMeshes[i].material).reflectionTexture;
                        else
                            mat.refractionTexture = undefined;

                        modelMeshes[i].material = mat;
                        modelMeshes[i].renderOutline = false;
                        break;
                    }
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
                scene.meshes[i].isPickable = f;
            }
            var lensFlareSystem = new LensFlareSystem(sceneMain);

        });

        return scene;
    }

    sceneMain = createScene();
    sceneMain.executeWhenReady(() => {

    });
    engine.runRenderLoop(function() {
        sceneMain.render();
    });
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
