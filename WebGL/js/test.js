/* global camera */
/// <reference path="babylon.2.3.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />

window.addEventListener('DOMContentLoaded', function () {

    var canvas = document.getElementById('renderCanvas');
    var gui = new dat.GUI();
    var engine = new BABYLON.Engine(canvas, true);
    //var ray = new BABYLON.
    function disp(materialBB, materialBP, materialRP, materialChrome, materialMetalArch, materialBC, materialB) {
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

        var folderBackground = gui.addFolder("Background");
        folderBackground.add(materialB, "indexOfRefraction", 0, 2);
        folderBackground.add(materialB, "alpha", 0, 1);
        folderBackground.add(materialB, "directIntensity", 0, 2);
        folderBackground.add(materialB, "emissiveIntensity", 0, 2);
        folderBackground.add(materialB, "environmentIntensity", 0, 2);
        folderBackground.add(materialB, "specularIntensity", 0, 2);
        folderBackground.add(materialB, "overloadedShadowIntensity", 0, 2);
        folderBackground.add(materialB, "overloadedShadeIntensity", 0, 2);
        folderBackground.add(materialB, "cameraExposure", 0, 2);
        folderBackground.add(materialB, "cameraContrast", 0, 2);
        folderBackground.add(materialB, "microSurface", 0, 1);
        folderBackground.add(materialB.reflectivityColor, "r", 0, 1);
        folderBackground.add(materialB.reflectivityColor, "g", 0, 1);
        folderBackground.add(materialB.reflectivityColor, "b", 0, 1);
    };
    var createScene = function () {

        var scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;
        camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 6, new BABYLON.Vector3(0, 100, 0), scene);
        camera.target = new BABYLON.Vector3(0, 0.5, 0);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 6;
        camera.upperBetaLimit = 1.6;
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 50;
        scene.activeCamera = camera;
        var spotLight = new BABYLON.SpotLight("spot", new BABYLON.Vector3(-0.06, 3.66, -2.63), new BABYLON.Vector3(-0.1, -0.8, 0.6), 0.9, 1, scene);

        spotLight.range = 8;
        spotLight.intensity = 500;
        spotLight.diffuse = new BABYLON.Color3(0, 0, 0);
        spotLight.specular = new BABYLON.Color3(1, 1, 1);
        var reflectionTexture = new BABYLON.CubeTexture("./textures/skybox", scene);
        
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {
            var blackPlastic = new BABYLON.PBRMaterial("bp", scene);
            var redPlastic = new BABYLON.PBRMaterial("rp", scene);
            var chrome = new BABYLON.PBRMaterial("ch", scene);
            var blackMetal = new BABYLON.PBRMaterial("bm", scene);
            var blackBox = new BABYLON.PBRMaterial("bb", scene);
            var blackCushion = new BABYLON.PBRMaterial("bc", scene);
            var background = new BABYLON.PBRMaterial("bg", scene);
            for (var i = 0; i < newMeshes.length; i++) {
                newMeshes[i].checkCollisions = true;
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
                        blackBox.cameraExposure = 1.1;
                        blackBox.cameraContrast = 2;
                        blackBox.microSurface = 0.46;
                        newMeshes[i].material = blackBox;
                        newMeshes[i].checkCollisions = true;
                        break;
                    case "background":
                        background.ambientTexture = new BABYLON.Texture("./textures/BACKGROUND_STYLE_1.jpg", scene);
                        //background.albedoColor = BABYLON.Color3.Gray();
                        background.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        //background.reflectionTexture = reflectionTexture;
                        background.indexOfRefraction = 2;
                        background.directIntensity = 1.6;
                        background.environmentIntensity = 0.05;
                        background.overloadedShadeIntensity = 0.8;
                        background.cameraExposure = 0.68;
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
                        blackMetal.cameraExposure = 0.8;
                        blackMetal.cameraContrast = 1.6;
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
                        blackPlastic.cameraExposure = 0.8;
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
                        newMeshes[i].checkCollisions = true;
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
                        break;
                    default: break;
                }
            }
            disp(blackBox, blackPlastic, redPlastic, chrome, blackMetal, blackCushion, background);
        });
        return scene;
    };

    var scene = createScene();
    var b = null;


    var ray = BABYLON.Ray.CreateNewFromTo(new BABYLON.Vector3(5.26, 2.91, 1.75), new BABYLON.Vector3(5.26, 2.91, 1.75));

    var mainLensLight = new BABYLON.PointLight("lensLight", new BABYLON.Vector3(0.027, 0.601, -1.225), scene);
    mainLensLight.intensity = 0;
    var MainLensFlareSystem = new BABYLON.LensFlareSystem("mainLensFlareSystem", mainLensLight, scene);
    var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), "./textures/Main Flare.png", MainLensFlareSystem);

    var hexaLensLight = new BABYLON.SpotLight("hexaLensLight", new BABYLON.Vector3(0.027, 0.601, -1.225), new BABYLON.Vector3(0.2, 0, -1), 10, 0.01, scene);
    hexaLensLight.intensity = 0;
    var hexaLensFlareSystem = new BABYLON.LensFlareSystem("hexaLensFlareSystem", hexaLensLight, scene);
    // var flare1 = new BABYLON.LensFlare(.3, -0.85, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    // var flare2 = new BABYLON.LensFlare(.1, -0.45, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    // var flare3 = new BABYLON.LensFlare(.05, -0.4, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    // var flare4 = new BABYLON.LensFlare(.02, -0.3, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    //var flare4 = new BABYLON.LensFlare(.02, 1, new BABYLON.Color3(0.1, 1, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var folderFlare = gui.addFolder("Flares");
    folderFlare.add(hexaLensLight.getAbsolutePosition(), "x", -200, 200);
    folderFlare.add(hexaLensLight.getAbsolutePosition(), "y", -200, 200);
    folderFlare.add(hexaLensLight.getAbsolutePosition(), "z", -200, 200);
    
 
    //lensFlare.borderLimit = 1000;


    var flare1 = new BABYLON.LensFlare(.2, -2.85, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flare2 = new BABYLON.LensFlare(.1, -2.3, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_2.png", hexaLensFlareSystem);
    var flare3 = new BABYLON.LensFlare(.1, -0.5, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flare4 = new BABYLON.LensFlare(.05, 0, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flare5 = new BABYLON.LensFlare(.05, 0.4, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_2.png", hexaLensFlareSystem);
    var flare6 = new BABYLON.LensFlare(.05, 0.2, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/Band_1.png", hexaLensFlareSystem);
    var flare7 = new BABYLON.LensFlare(.05, 0.5, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    //var flare4 = new BABYLON.LensFlare(.02, -0.3, new BABYLON.Color3(0.1, 0.05, 0.05), "./textures/flare.png", hexaLensFlareSystem);
    var flareSizes = [];
    for (var i = 0; i < hexaLensFlareSystem.lensFlares.length; i++) {
        flareSizes.push(hexaLensFlareSystem.lensFlares[i].size);
    }

    scene.registerBeforeRender(function () {
        var rayPick = BABYLON.Ray.CreateNewFromTo(camera.position, new BABYLON.Vector3(0.027, 0.601, -1.225));
        var meshFound = scene.pickWithRay(rayPick);


        if (meshFound != null && meshFound.pickedPoint != null) {
            flare.color = BABYLON.Color3.Black();
            hexaLensFlareSystem.isEnabled = false;
        } else {
            flare.color = BABYLON.Color3.White();
            hexaLensFlareSystem.isEnabled = true;

            var vec1 = hexaLensLight.position;
            var vec2 = camera.position;

            var dot = BABYLON.Vector3.Dot(vec1, vec2);

            dot = dot / (Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z) * Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z));

            var acos = Math.acos(dot);

            var angle = acos * 180 / Math.PI;
            var brightness = 1 - angle / 120;
            var bb = 0.06 - angle / 1000;

            if(bb > 0.1) bb = 0.1;

            for (var i = 0; i < hexaLensFlareSystem.lensFlares.length; i++) {
                hexaLensFlareSystem.lensFlares[i].size = flareSizes[i] + (1 - camera.radius / 6) / 6;
                if (angle < 45) {
                    // 45 = 0
                    // 0 = 1
                    hexaLensFlareSystem.lensFlares[i].color = new BABYLON.Color3(bb,bb,bb);

                } else {
                    hexaLensFlareSystem.isEnabled = false;
                }
            }
        }
        
        if (b == null)
            b = scene.meshes.find(x => x.name === "background");

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