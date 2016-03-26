/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="datgui.js" />
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var camera;
    var gui = new dat.GUI();
    function displayMaterialValues(material) {
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
        color.onChange(function (value) {
            material.albedoColor = new BABYLON.Color3(value.r / 255, value.g / 255, value.b / 255);
            console.log(material.albedoColor);
        });
        folder.add(material.reflectivityColor, "r", 0, 1);
        folder.add(material.reflectivityColor, "g", 0, 1);
        folder.add(material.reflectivityColor, "b", 0, 1);
    }
    function createScene() {
        var scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 50;
        scene.activeCamera = camera;
        var light = new BABYLON.PointLight("", new BABYLON.Vector3(0, 2, 3), scene);
        var skybox = BABYLON.Mesh.CreateBox("skybox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
        skyboxMaterial.backFaceCulling = false;
        var reflectionTexture = new BABYLON.CubeTexture("./cubemap/skybox", scene);
        skyboxMaterial.reflectionTexture = reflectionTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.infiniteDistance = true;
        skybox.material = skyboxMaterial;
        skybox.isPickable = false;
        // Flat 1
        {
            var Flat_1_pbr = new BABYLON.PBRMaterial("Flat 1", scene);
            Flat_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Flat_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Flat_1 = BABYLON.Mesh.CreateSphere("Flat 1", 100, 3, scene, true);
            Flat_1.position.addInPlace(new BABYLON.Vector3(-4, 0, -4));
            Flat_1.material = Flat_1_pbr;
            displayMaterialValues(Flat_1_pbr);
            Flat_1_pbr.reflectionTexture = reflectionTexture;
            Flat_1_pbr.refractionTexture = reflectionTexture;
        }
        // Felt 1
        {
            var Felt_1_pbr = new BABYLON.PBRMaterial("Felt 1", scene);
            Felt_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Felt_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Felt_1 = BABYLON.Mesh.CreateSphere("Flat 1", 100, 3, scene, true);
            Felt_1.material = Felt_1_pbr;
            Felt_1.position.addInPlace(new BABYLON.Vector3(0, 0, -4));
            displayMaterialValues(Felt_1_pbr);
            Felt_1_pbr.reflectionTexture = reflectionTexture;
            Felt_1_pbr.refractionTexture = reflectionTexture;
        }
        // Semigloss 1
        {
            var Semigloss_1_pbr = new BABYLON.PBRMaterial("Semigloss 1", scene);
            Semigloss_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Semigloss_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Semigloss_1 = BABYLON.Mesh.CreateSphere("Semigloss 1", 100, 3, scene, true);
            Semigloss_1.material = Semigloss_1_pbr;
            Semigloss_1.position.addInPlace(new BABYLON.Vector3(4, 0, -4));
            displayMaterialValues(Semigloss_1_pbr);
            Semigloss_1_pbr.reflectionTexture = reflectionTexture;
            Semigloss_1_pbr.refractionTexture = reflectionTexture;
        }
        // Semigloss 2 
        {
            var Semigloss_2_pbr = new BABYLON.PBRMaterial("Semigloss 2", scene);
            Semigloss_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Semigloss_2_pbr.albedoColor = BABYLON.Color3.Red();
            var Semigloss_2 = BABYLON.Mesh.CreateSphere("Semigloss 2 ", 100, 3, scene, true);
            Semigloss_2.material = Semigloss_2_pbr;
            Semigloss_2.position.addInPlace(new BABYLON.Vector3(-4, 0, 0));
            displayMaterialValues(Semigloss_2_pbr);
            Semigloss_2_pbr.reflectionTexture = reflectionTexture;
            Semigloss_2_pbr.refractionTexture = reflectionTexture;
        }
        // Specular 1,
        {
            var Specular_1_pbr = new BABYLON.PBRMaterial("Specular 1", scene);
            Specular_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Specular_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Specular_1 = BABYLON.Mesh.CreateSphere("Specular 1", 100, 3, scene, true);
            Specular_1.material = Specular_1_pbr;
            Specular_1.position.addInPlace(new BABYLON.Vector3(0, 0, 0));
            displayMaterialValues(Specular_1_pbr);
            Specular_1_pbr.reflectionTexture = reflectionTexture;
            Specular_1_pbr.refractionTexture = reflectionTexture;
        }
        // Specular 2
        {
            var Specular_2_pbr = new BABYLON.PBRMaterial("Specular 2", scene);
            Specular_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Specular_2_pbr.albedoColor = BABYLON.Color3.Red();
            var Specular_2 = BABYLON.Mesh.CreateSphere("Specular 2", 100, 3, scene, true);
            Specular_2.material = Specular_2_pbr;
            Specular_2.position.addInPlace(new BABYLON.Vector3(4, 0, 0));
            displayMaterialValues(Specular_2_pbr);
            Felt_1_pbr.reflectionTexture = reflectionTexture;
            Felt_1_pbr.refractionTexture = reflectionTexture;
        }
        // Specular 3
        {
            var Specular_3_pbr = new BABYLON.PBRMaterial("Specular 3", scene);
            Specular_3_pbr.reflectivityColor = BABYLON.Color3.Black();
            Specular_3_pbr.albedoColor = BABYLON.Color3.Red();
            var Specular_3 = BABYLON.Mesh.CreateSphere("Specular 3", 100, 3, scene, true);
            Specular_3.material = Specular_3_pbr;
            Specular_3.position.addInPlace(new BABYLON.Vector3(-4, 0, 4));
            displayMaterialValues(Specular_3_pbr);
            Specular_3_pbr.reflectionTexture = reflectionTexture;
            Specular_3_pbr.refractionTexture = reflectionTexture;
        }
        // Chrome 1
        {
            var Chrome_1_pbr = new BABYLON.PBRMaterial("Chrome 1", scene);
            Chrome_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Chrome_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Chrome_1 = BABYLON.Mesh.CreateSphere("Chrome 1", 100, 3, scene, true);
            Chrome_1.material = Chrome_1_pbr;
            Chrome_1.position.addInPlace(new BABYLON.Vector3(0, 0, 4));
            displayMaterialValues(Chrome_1_pbr);
            Chrome_1_pbr.reflectionTexture = reflectionTexture;
            Chrome_1_pbr.refractionTexture = reflectionTexture;
        }
        // Chrome 2
        {
            var Chrome_2_pbr = new BABYLON.PBRMaterial("Chrome 2", scene);
            Chrome_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Chrome_2_pbr.albedoColor = BABYLON.Color3.Red();
            var Chrome_2 = BABYLON.Mesh.CreateSphere("Chrome 2", 100, 3, scene, true);
            Chrome_2.material = Chrome_2_pbr;
            Chrome_2.position.addInPlace(new BABYLON.Vector3(4, 0, 4));
            displayMaterialValues(Chrome_2_pbr);
            Chrome_2_pbr.reflectionTexture = reflectionTexture;
            Chrome_2_pbr.refractionTexture = reflectionTexture;
        }
        // Chrome 3
        {
            var Chrome_3_pbr = new BABYLON.PBRMaterial("Chrome 3", scene);
            Chrome_3_pbr.reflectivityColor = BABYLON.Color3.Black();
            Chrome_3_pbr.albedoColor = BABYLON.Color3.Red();
            // Chrome 3, Glass 1, Glass 2
            var Chrome_3 = BABYLON.Mesh.CreateSphere("Chrome 3", 100, 3, scene, true);
            Chrome_3.material = Chrome_3_pbr;
            Chrome_3.position.addInPlace(new BABYLON.Vector3(-4, 0, 8));
            displayMaterialValues(Chrome_3_pbr);
            Chrome_3_pbr.reflectionTexture = reflectionTexture;
            Chrome_3_pbr.refractionTexture = reflectionTexture;
        }
        // Glass 1
        {
            var Glass_1_pbr = new BABYLON.PBRMaterial("Glass 1", scene);
            Glass_1_pbr.reflectivityColor = BABYLON.Color3.Black();
            Glass_1_pbr.albedoColor = BABYLON.Color3.Red();
            var Glass_1 = BABYLON.Mesh.CreateSphere("Glass 1", 100, 3, scene, true);
            Glass_1.material = Glass_1_pbr;
            Glass_1.position.addInPlace(new BABYLON.Vector3(0, 0, 8));
            displayMaterialValues(Glass_1_pbr);
            Glass_1_pbr.reflectionTexture = reflectionTexture;
            Glass_1_pbr.refractionTexture = reflectionTexture;
        }
        // Glass 2
        {
            var Glass_2_pbr = new BABYLON.PBRMaterial("Glass 2", scene);
            Glass_2_pbr.reflectivityColor = BABYLON.Color3.Black();
            Glass_2_pbr.albedoColor = BABYLON.Color3.Red();
            var Glass_2 = BABYLON.Mesh.CreateSphere("Glass 2", 100, 3, scene, true);
            Glass_2.material = Glass_2_pbr;
            Glass_2.position.addInPlace(new BABYLON.Vector3(4, 0, 8));
            displayMaterialValues(Glass_2_pbr);
            Glass_2_pbr.reflectionTexture = reflectionTexture;
            Glass_2_pbr.refractionTexture = reflectionTexture;
        }
        return scene;
    }
    var sceneMain = createScene();
    engine.runRenderLoop(function () {
        sceneMain.render();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
