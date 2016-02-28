/// <reference path="babylon.2.3.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="PBRConverter.ts" />
/// <reference path="Environment.ts" />
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var gui = new dat.GUI();
    var engine = new BABYLON.Engine(canvas, true);
    var camera;
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
            console.log(value);
            var r = value.r / 255;
            var g = value.g / 255;
            var b = value.b / 255;
            material.albedoColor = new BABYLON.Color3(r, g, b);
        });
        folder.add(material.reflectivityColor, "r", 0, 1);
        folder.add(material.reflectivityColor, "g", 0, 1);
        folder.add(material.reflectivityColor, "b", 0, 1);
    }
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
        var spotLight = new BABYLON.SpotLight("spot", new BABYLON.Vector3(-0.06, 3.66, -2.63), new BABYLON.Vector3(-0.1, -0.8, 0.6), 0.9, 1, scene);
        console.log(spotLight.getAbsolutePosition());
        spotLight.range = 8;
        spotLight.intensity = 500;
        spotLight.diffuse = new BABYLON.Color3(0, 0, 0);
        spotLight.specular = new BABYLON.Color3(1, 1, 1);
        var reflectionTexture = new BABYLON.CubeTexture("./textures/skybox", scene);
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {
            var blackPlastic = new BABYLON.PBRMaterial("Black Plastic", scene);
            var redPlastic = new BABYLON.PBRMaterial("Red Plastic", scene);
            var chrome = new BABYLON.PBRMaterial("Chrome", scene);
            var blackMetal = new BABYLON.PBRMaterial("Black Metal", scene);
            var blackBox = new BABYLON.PBRMaterial("Black Box", scene);
            var blackCushion = new BABYLON.PBRMaterial("Black Cushion", scene);
            var background = new BABYLON.PBRMaterial("Background", scene);
            for (var i = 0; i < newMeshes.length; i++) {
                switch (newMeshes[i].name) {
                    case "BOX_STYLE_1":
                        blackBox.albedoTexture = new BABYLON.Texture("./textures/blackbox.jpg", scene);
                        blackBox.ambientTexture = new BABYLON.Texture("./textures/BOX_STYLE_1.jpg", scene);
                        blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        blackBox.reflectionTexture = reflectionTexture;
                        blackBox.indexOfRefraction = 2;
                        blackBox.directIntensity = 1.7;
                        blackBox.environmentIntensity = 0.09;
                        blackBox.overloadedShadowIntensity = 0.6;
                        blackBox.overloadedShadeIntensity = 0.22;
                        blackBox.cameraExposure = 1.5;
                        blackBox.cameraContrast = 2;
                        blackBox.microSurface = 0.46;
                        newMeshes[i].material = blackBox;
                        break;
                    case "background":
                        background.ambientTexture = new BABYLON.Texture("./textures/BACKGROUND_STYLE_1.jpg", scene);
                        background.albedoColor = BABYLON.Color3.Black();
                        background.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        background.indexOfRefraction = 2;
                        background.directIntensity = 1.6;
                        background.environmentIntensity = 0.05;
                        background.overloadedShadeIntensity = 0.8;
                        background.cameraExposure = 1.5;
                        background.cameraContrast = 1.8;
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
                        blackMetal.environmentIntensity = 0.24;
                        blackMetal.specularIntensity = 0.7;
                        blackMetal.overloadedShadeIntensity = 0.8;
                        blackMetal.cameraExposure = 1.99;
                        blackMetal.cameraContrast = 1;
                        blackMetal.microSurface = 0.61;
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
                        blackPlastic.overloadedShadowIntensity = 0.8;
                        blackPlastic.overloadedShadeIntensity = 0.8;
                        blackPlastic.cameraExposure = 1.26;
                        blackPlastic.cameraContrast = 1.6;
                        blackPlastic.microSurface = 0.31;
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
                        chrome.environmentIntensity = 0.6;
                        chrome.cameraExposure = .23;
                        chrome.cameraContrast = 1.9;
                        chrome.microSurface = 0.21;
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
                        redPlastic.environmentIntensity = 0.5;
                        redPlastic.specularIntensity = 0.3;
                        redPlastic.overloadedShadowIntensity = 1.3;
                        redPlastic.overloadedShadeIntensity = 0.68;
                        redPlastic.cameraExposure = 0.8;
                        redPlastic.cameraContrast = 2;
                        redPlastic.microSurface = 0.34;
                        newMeshes[i].material = redPlastic;
                        break;
                    case "HEADSETCUSHION_STYLE_1":
                        blackCushion.albedoTexture = new BABYLON.Texture("./textures/blackcushion.jpg", scene);
                        blackCushion.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                        blackCushion.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        blackCushion.ambientTexture.coordinatesIndex = 1;
                        blackCushion.indexOfRefraction = .52;
                        blackCushion.directIntensity = 2;
                        blackCushion.environmentIntensity = 0;
                        blackCushion.overloadedShadeIntensity = 0.81;
                        blackCushion.cameraExposure = 2;
                        blackCushion.cameraContrast = 2;
                        blackCushion.microSurface = 0.4;
                        newMeshes[i].material = blackCushion;
                    default: break;
                }
                if (newMeshes[i].material instanceof BABYLON.PBRMaterial)
                    displayMaterialValues(newMeshes[i].material);
            }
        });
        return scene;
    }
    ;
    var scene = createScene();
    var b = null;
    var ray = BABYLON.Ray.CreateNewFromTo(new BABYLON.Vector3(5.26, 2.91, 1.75), new BABYLON.Vector3(5.26, 2.91, 1.75));
    var mainLensLight = new BABYLON.PointLight("lensLight", new BABYLON.Vector3(0.027, 0.601, -1.225), scene);
    mainLensLight.intensity = 0;
    var MainLensFlareSystem = new BABYLON.LensFlareSystem("mainLensFlareSystem", mainLensLight, scene);
    var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), "./textures/Main Flare.png", MainLensFlareSystem);
    flare.texture.hasAlpha = true;
    var hexaLensLight = new BABYLON.SpotLight("hexaLensLight", new BABYLON.Vector3(0.027, 0.601, -1.225), new BABYLON.Vector3(0.2, 0, -1), 10, 0.01, scene);
    hexaLensLight.intensity = 0;
    var hexaLensFlareSystem = new BABYLON.LensFlareSystem("hexaLensFlareSystem", hexaLensLight, scene);
    var folderFlare = gui.addFolder("Flares");
    folderFlare.add(hexaLensLight.getAbsolutePosition(), "x", -200, 200);
    folderFlare.add(hexaLensLight.getAbsolutePosition(), "y", -200, 200);
    folderFlare.add(hexaLensLight.getAbsolutePosition(), "z", -200, 200);
    var flare1 = new BABYLON.LensFlare(.2, -2.85, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flare2 = new BABYLON.LensFlare(.1, -2.3, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_2.png", hexaLensFlareSystem);
    var flare3 = new BABYLON.LensFlare(.1, -0.5, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flare4 = new BABYLON.LensFlare(.05, 0, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flare5 = new BABYLON.LensFlare(.05, 0.4, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_2.png", hexaLensFlareSystem);
    var flare6 = new BABYLON.LensFlare(.05, 0.2, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_1.png", hexaLensFlareSystem);
    var flare7 = new BABYLON.LensFlare(.05, 0.5, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flareSizes = [];
    for (var i = 0; i < hexaLensFlareSystem.lensFlares.length; i++) {
        flareSizes.push(hexaLensFlareSystem.lensFlares[i].size);
    }
    scene.registerBeforeRender(function () {
        var rayPick = BABYLON.Ray.CreateNewFromTo(camera.position, new BABYLON.Vector3(0.027, 0.601, -1.225));
        var meshFound = scene.pickWithRay(rayPick, function (mesh) { return true; });
        if (meshFound != null && meshFound.pickedPoint != null) {
            flare.color = BABYLON.Color3.Black();
            hexaLensFlareSystem.isEnabled = false;
        }
        else {
            flare.color = BABYLON.Color3.White();
            hexaLensFlareSystem.isEnabled = true;
            var vec1 = hexaLensLight.position;
            var vec2 = camera.position;
            var dot = BABYLON.Vector3.Dot(vec1, vec2);
            dot = dot / (Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z) * Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z));
            var acos = Math.acos(dot);
            var angle = acos * 180 / Math.PI;
            var bb = 0.06 - angle / 1000;
            if (bb > 0.1)
                bb = 0.1;
            for (var i = 0; i < hexaLensFlareSystem.lensFlares.length; i++) {
                hexaLensFlareSystem.lensFlares[i].size = flareSizes[i] + (1 - camera.radius / 6) / 6;
                if (angle < 45) {
                    hexaLensFlareSystem.lensFlares[i].color = new BABYLON.Color3(bb, bb, bb);
                }
                else {
                    hexaLensFlareSystem.isEnabled = false;
                }
            }
        }
        if (b == null)
            b = scene.meshes.find(function (x) {
                return x.name === "background";
            });
        if (b != null && camera != null) {
            b.rotation.y = -camera.alpha + -Math.PI / 2;
        }
    });
    engine.runRenderLoop(function () {
        scene.render();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
