/// <reference path="babylon.2.3.d.ts" />
/// <reference path="babylon.pbrMaterial.js" />
/// <reference path="babylon.pbrMaterial.d.ts" />

    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var getMaterial = function(name, albedoTexture, ambientTexture, indexOfRefraction, reflectivityColor, scene)
    {
        var newMaterial = new BABYLON.PBRMaterial(name, scene);
            newMaterial.albedoTexture = new BABYLON.Texture(albedoTexture, scene);
            newMaterial.ambientTexture = new BABYLON.Texture(ambientTexture, scene);
            newMaterial.ambientTexture.coordinatesIndex = 1;
            newMaterial.linkRefractionWithTransparency = false;
            newMaterial.indexOfRefraction = indexOfRefraction;
    
	       newMaterial.reflectivityColor = reflectivityColor;
	       newMaterial.microSurface = 1;
           
           return newMaterial;
    }
    
    var createScene = function(){
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, false);
        camera.wheelPrecision = 20;
        var light = new BABYLON.PointLight('light', new BABYLON.Vector3(-5.11, -0.42, -0.99), scene);  
        light.ra
        var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(5.19,0,-1.5), scene);  
        var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(-0.62,2.45,6.36), scene);  
        light1.intensity = 10;
        //   var light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0,4,0), scene);  
        // light2.intensity = 2;
        //   var light3 = new BABYLON.PointLight('light3', new BABYLON.Vector3(1.5,1,-3), scene);  
        // light3.intensity = 2;
        // light3.range = 10;
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {
            
            var blackBox = getMaterial("blackBox", "./BOX_STYLE_1", "./blackbox.jpg", 0.3, new BABYLON.Color3(0.3, 0.3, 0.3), scene);
            
            var redPlastic = getMaterial("redPlastic", "./HEADSET_STYLE_1.jpg", "./redplastic.jpg", 0.3, new BABYLON.Color3(0.3, 0.3, 0.3), scene);
            var blackCushion = getMaterial("blackCushions", "./HEADSET_STYLE_1.jpg", "./blackcushion.jpg", 0.3, new BABYLON.Color3(0.3, 0.3, 0.3), scene);
            var chrome = getMaterial("chrome", "./HEADSET_STYLE_1.jpg", "./chrome.jpg", 0.3, new BABYLON.Color3(0.3, 0.3, 0.3), scene);
            var blackPlastic = getMaterial("blackplastic", "./HEADSET_STYLE_1.jpg", "./blackplastic.jpg", 0.3, new BABYLON.Color3(0.3, 0.3, 0.3), scene);
            var blackMetal = getMaterial("blackMetal", "./HEADSET_STYLE_1.jpg", "./blackmetal.jpg", 0.3, new BABYLON.Color3(0.3, 0.3, 0.3), scene);
            var HeadsetAO = new BABYLON.Texture("./HEADSET_STYLE_1.jpg", scene);

     
                     
            for (var i = 0; i < newMeshes.length; i++) {
                switch (newMeshes[i].name) {
                    case "BOX_STYLE_1": newMeshes[i].material = blackBox;  break;
                    case "HEADSETARCH_STYLE_1": newMeshes[i].material = blackMetal; break;
                    case "HEADSETBLACKPLASTIC_STYLE_1": newMeshes[i].material = blackPlastic; break;
                    case "HEADSETCHROME_STYLE_1": newMeshes[i].material = chrome; break;
                    case "HEADSETCOLOREDPLASTIC_STYLE_1": newMeshes[i].material = redPlastic; break;
                    case "HEADSETCUSHION_STYLE_1": newMeshes[i].material = blackCushion; break;
                    default: break;
                }                
            }

            camera.target = newMeshes[0];

    	});
        return scene;
    }

    var scene = createScene();
     
    engine.runRenderLoop(function(){
        scene.render();
    });

    window.addEventListener('resize', function(){
        engine.resize();
    });
