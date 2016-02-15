/// <reference path="babylon.2.3.d.ts" />
/// <reference path="babylon.pbrMaterial.js" />
/// <reference path="babylon.pbrMaterial.d.ts" />

    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function(){
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, false);
        camera.wheelPrecision = 20;
        //var light = new BABYLON.PointLight('light', new BABYLON.Vector3(0,1,-3), scene);  
        var light1 = new BABYLON.PointLight('light1', new BABYLON.Vector3(0,3,-3), scene);  
        light1.intensity = 2;
        
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {

            var redPlastic = new BABYLON.StandardMaterial("plastic", scene);
            var blackBox = new BABYLON.StandardMaterial("blackBox", scene);
            var blackCushion = new BABYLON.StandardMaterial("blackCushion", scene);
            var chrome = new BABYLON.StandardMaterial("chrome", scene);
            var blackPlastic = new BABYLON.StandardMaterial("blackPlastic", scene);
            var blackMetal = new BABYLON.StandardMaterial("blackMetal", scene);
            var HeadsetAO = new BABYLON.Texture("./HEADSET_STYLE_1.jpg", scene);
            
            redPlastic.diffuseTexture = new BABYLON.Texture("./redplastic.jpg",scene);   
            redPlastic.ambientTexture =  HeadsetAO;
            //redPlastic.ambientTexture.coordinatesIndex = 1;
            
            blackBox.diffuseTexture = new BABYLON.Texture("./blackbox.jpg", scene);
            blackBox.ambientTexture = new BABYLON.Texture("./BOX_STYLE_1.jpg", scene);
            blackBox.ambientTexture.coordinatesIndex = 1;
            
            blackCushion.diffuseTexture = new BABYLON.Texture("./blackcushion.jpg",scene);
            blackCushion.ambientTexture =  HeadsetAO;
            blackCushion.ambientTexture.coordinatesIndex = 1;
                        
            chrome.diffuseTexture = new BABYLON.Texture("./chrome.jpg",scene);
            chrome.ambientTexture =  HeadsetAO;
            chrome.ambientTexture.coordinatesIndex = 1;
                                    
            blackPlastic.diffuseTexture = new BABYLON.Texture("./blackplastic.jpg",scene);
            blackPlastic.ambientTexture =  HeadsetAO;
            blackPlastic.ambientTexture.coordinatesIndex = 1;
                                    
            blackMetal.diffuseTexture = new BABYLON.Texture("./blackmetal.jpg",scene);          
            blackMetal.ambientTexture =  HeadsetAO;
            blackMetal.ambientTexture.coordinatesIndex = 1;
                                    
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
