/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="datgui.js" />

window.addEventListener('DOMContentLoaded', function() {
    var canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var camera: BABYLON.ArcRotateCamera;
    var gui = new dat.GUI();

    function displayMaterialValues(material: BABYLON.PBRMaterial) {
        var folder = gui.addFolder(material.name);
        folder.add(material, "indexOfRefraction", 0, 2);
        folder.add(material, "alpha", 0, 1);
        folder.add(material, "directIntensity", 0, 2);
        folder.add(material, "emissiveIntensity", 0, 2);
        folder.add(material, "environmentIntensity", 0, 2);
        folder.add(material, "specularIntensity", 0, 2);
        folder.add(material, "overloadedShadowIntensity", 0, 2);
        folder.add(material, "overloadedShadeIntensity", 0, 2);
        folder.add(material, "cameraExposure", 0, 2);
        folder.add(material, "cameraContrast", 0, 2);
        folder.add(material, "microSurface", 0, 1);
        var color = folder.addColor(material, "albedoColor");
        color.onChange(function(value) {

            material.albedoColor = new BABYLON.Color3(value.r / 255, value.g / 255, value.b / 255);
            console.log(material.albedoColor);

        });
        var reflectivityColor = folder.addColor(material, "reflectivityColor");
        reflectivityColor.onChange(function(value) {

            material.reflectivityColor = new BABYLON.Color3(value.r / 255, value.g / 255, value.b / 255);
            console.log(material.reflectivityColor);

        });
    }

    function createScene() {
        var scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, 0, 0), scene);

        camera.attachControl(canvas, true);
        camera.wheelPrecision = 50;
        scene.activeCamera = camera;
        var light = new BABYLON.HemisphericLight("", BABYLON.Vector3.Up(), scene);
        var pbr = new BABYLON.PBRMaterial("PBR Material", scene);
        pbr.reflectivityColor = BABYLON.Color3.Black();
        pbr.albedoColor = BABYLON.Color3.Red();
        var knot = BABYLON.Mesh.CreateTorusKnot("knot", 1, 0.4, 128, 64, 2, 3, scene);
        knot.material = pbr;

        displayMaterialValues(pbr);

        return scene;
    }

    var sceneMain = createScene();

    engine.runRenderLoop(function() {
        sceneMain.render();
    });
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
