

window.addEventListener('DOMContentLoaded', function () {

    var canvas = document.getElementById('renderCanvas');
    var gui = new dat.GUI();
    var gui1 = new dat.GUI();
    var engine = new BABYLON.Engine(canvas, true);

    function disp(materialBP, materialRP, materialChrome, materialMetalArch) {

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

    };

    var createScene = function () {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 10, new BABYLON.Vector3(-0.5, .5, 0), scene);
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 20;
        // scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
        // 			scene.fogDensity = 0.01;
        // camera.rotation = 
        // Light
        
        // var light = new BABYLON.PointLight("point", new BABYLON.Vector3(-0.5, 2.1, -2.73), scene);
        // light.range = 3;
        // light.intensity = 20;
        // Lights
        // var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
        // light0.diffuse = new BABYLON.Color3(.8, .8, .8);
        // light0.specular = new BABYLON.Color3(1, 1, 1);
        // light0.groundColor = new BABYLON.Color3(0, 0, 0);
        //var pointLight = new BABYLON.PointLight("point", new BABYLON.Vector3(20, 20, 10), scene);
        // 
        //         var directionalLight = new BABYLON.DirectionalLight("directional", new BABYLON.Vector3(0, -0.6, 0.5), scene);
        // 
        //         directionalLight.intensity = 100;

        //var shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
        //shadowGenerator.bias = 0.01;
        //shadowGenerator.usePoissonSampling = true;
       // var cube = BABYLON.Mesh.CreateBox("cube", 2, scene);
       // cube.position = new BABYLON.Vector3(3, 0, 0);
        var spotLight = new BABYLON.SpotLight("spot", new BABYLON.Vector3(-0.06, 3.66, -2.63), new BABYLON.Vector3(-0.1, -0.8, 0.6), 0.6, 1, scene);
        // var l = new BABYLON.PointLight("p", new BABYLON.Vector3(-0.06, 3.66, -2.63), scene);
        //l.intensity = 100;
        spotLight.range = 20;
        spotLight.intensity = 1000;
        spotLight.diffuse = new BABYLON.Color3(0, 0, 0);
        spotLight.specular = new BABYLON.Color3(1, 1, 1);
        //         //var light = new BABYLON.PointLight("point", new BABYLON.Vector3(-0.06, 3.66, -2.63), scene);
        //         //         Environment Texture
        //         var hdrTexture = new BABYLON.HDRCubeTexture("./room.hdr", scene, 512);
        // 
        //         // Skybox
        //         var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 100.0, scene);
        //         var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
        //         hdrSkyboxMaterial.backFaceCulling = false;
        //         hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        //         hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        //         hdrSkyboxMaterial.microSurface = 1;
        //         hdrSkyboxMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
        //         hdrSkyboxMaterial.disableLighting = true;
        //         hdrSkyboxMaterial.cameraExposure = 0.6;
        //         hdrSkyboxMaterial.cameraContrast = 1.6;
        //         hdrSkyboxMaterial.directIntensity = 0;
        //         hdrSkybox.material = hdrSkyboxMaterial;
        //         hdrSkybox.infiniteDistance = true;
        var reflectionTexture = new BABYLON.CubeTexture("./textures/skybox", scene);
        // var ground = BABYLON.Mesh.CreateBox("ground", 2, scene);
        // 
        // ground.receiveShadows = true;
        // shadowGenerator.getShadowMap().renderList.push(ground);
        //Creation of a skybox
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
        // var hdr = new BABYLON.HDRRenderingPipeline("hdr", scene, 1.0, null, [scene.activeCamera]);
        // hdr.brightThreshold = 0.7; // Minimum luminance needed to compute HDR
        // hdr.gaussCoeff = 0.5; // Gaussian coefficient = gaussCoeff * theEffectOutput;
        // hdr.gaussMean = .5; // The Gaussian blur mean
        // hdr.gaussStandDev = 10; // Standard Deviation of the gaussian blur.
        // hdr.exposure = 2;
        // hdr.minimumLuminance = 0.2;
        // hdr.maximumLuminance = 1e20;
        // hdr.luminanceDecreaseRate = 0.3; // Decrease rate: darkness to light
        // hdr.luminanceIncreaserate = 0.5; // Increase rate: light to darkness
        // hdr.gaussMultiplier = 4.0; // Increase the blur intensity
  
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {
          var blackPlastic = new BABYLON.PBRMaterial("pl", scene);
            var redPlastic = new BABYLON.PBRMaterial("redp", scene);
            var chrome = new BABYLON.PBRMaterial("ch", scene);
            var blackMetal = new BABYLON.PBRMaterial("bm", scene);
            
            for (var i = 0; i < newMeshes.length; i++) {
                switch (newMeshes[i].name) {
                    case "BOX_STYLE_1":

                        var blackBox = new BABYLON.PBRMaterial("bm", scene);
                        blackBox.albedoTexture = new BABYLON.Texture("./textures/blackbox.jpg", scene);
                        blackBox.ambientTexture = new BABYLON.Texture("./textures/BOX_STYLE_1.jpg", scene);
                        blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        blackBox.reflectionTexture = reflectionTexture;
                        blackBox.indexOfRefraction = 2;

                        blackBox.directIntensity = 1;
                        blackBox.environmentIntensity = 0.4;
                        blackBox.overloadedShadeIntensity = 0.8;
                        blackBox.cameraExposure = 0.8;
                        blackBox.cameraContrast = 1.6;
                        blackBox.microSurface = 0.1;
                        newMeshes[i].material = blackBox;
                        //newMeshes[i].receiveShadows = true;
                        //shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                        break;
                    case "HEADSETARCH_STYLE_1":

                        blackMetal.albedoTexture = new BABYLON.Texture("./textures/blackmetal.jpg", scene);
                        blackMetal.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        blackMetal.ambientTexture.coordinatesIndex = 1;
                        blackMetal.reflectivityColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                        blackMetal.reflectionTexture = reflectionTexture;
                        blackMetal.indexOfRefraction = 2;
                        blackMetal.directIntensity = 1;
                        blackMetal.environmentIntensity = 0.4;
                        blackMetal.overloadedShadeIntensity = 0.8;
                        blackMetal.cameraExposure = 0.8;
                        blackMetal.cameraContrast = 1.6;
                        blackMetal.microSurface = 0.5;
                        newMeshes[i].material = blackMetal;
                        //newMeshes[i].receiveShadows = true;
                        //shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                        break;
                    case "HEADSETBLACKPLASTIC_STYLE_1":
                        //debugger;

                        blackPlastic.albedoTexture = new BABYLON.Texture("./textures/blackplastic.jpg", scene);
                        blackPlastic.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        blackPlastic.ambientTexture.coordinatesIndex = 1;
                        blackPlastic.reflectionTexture = reflectionTexture;
                        blackPlastic.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
                        blackPlastic.indexOfRefraction = 0.52;
                        blackPlastic.directIntensity = 1;
                        blackPlastic.environmentIntensity = 0.4;
                        blackPlastic.overloadedShadeIntensity = 0.8;
                        blackPlastic.cameraExposure = 0.8;
                        blackPlastic.cameraContrast = 1.6;
                        blackPlastic.microSurface = 0.8;


                        newMeshes[i].material = blackPlastic;

                        //newMeshes[i].receiveShadows = true;
                        //shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
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
                        //newMeshes[i].receiveShadows = true;
                        newMeshes[i].material = chrome;
                        //shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
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

                        //newMeshes[i].receiveShadows = true;
                        //shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                        break;
                    case "HEADSETCUSHION_STYLE_1":
                        var blackCushion = new BABYLON.PBRMaterial("cush", scene);
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
                        //blackCushion.reflectionTexture = reflectionTexture;
                        // blackCushion.albedoColor = new BABYLON.Color3(42, 42, 42);
                        newMeshes[i].material = blackCushion;
                        //newMeshes[i].receiveShadows = true;
                        //shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                        break;
                    default: break;
                }

            }
            disp(blackPlastic, redPlastic, chrome, blackMetal);

        });


        return scene;

    };

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});