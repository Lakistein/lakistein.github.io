/// <reference path="babylon.2.3.d.ts" />
/// <reference path="babylon.objFileLoader.ts" />
/// <reference path="babylon.pbrMaterial.js" />
/// <reference path="babylon.pbrMaterial.d.ts" />
// get the canvas DOM element
 // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // createScene function that creates and return the scene
    var createScene = function(){
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);



        // target the camera to scene origin

        // attach the camera to the canvas
        camera.attachControl(canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        //light.groundColor = new BABYLON.Color3(255, 255, 255);
       // light.intensity = 0.01;
        // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        //var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

        // move the sphere upward 1/2 of its height
        //sphere.position.y = 1;

        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        //var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

        // return the created scene    
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {

            var redPlastic = new BABYLON.PBRMaterial("plastic", scene);
            var blackBox = new BABYLON.PBRMaterial("blackBox", scene);
            var blackCushion = new BABYLON.PBRMaterial("blackCushion", scene);
            var chrome = new BABYLON.PBRMaterial("chrome", scene);
            var blackPlastic = new BABYLON.PBRMaterial("blackPlastic", scene);
            var blackMetal = new BABYLON.PBRMaterial("blackMetal", scene);
            
            redPlastic.reflectivityTexture = new BABYLON.Texture("./redplastic.jpg",scene);        
            blackBox.reflectivityTexture = new BABYLON.Texture("./blackbox.jpg",scene);
            blackCushion.reflectivityTexture = new BABYLON.Texture("./blackcushion.jpg",scene);
            chrome.reflectivityTexture = new BABYLON.Texture("./chrome.jpg",scene);
            blackPlastic.reflectivityTexture = new BABYLON.Texture("./blackplastic.jpg",scene);
            blackMetal.reflectivityTexture = new BABYLON.Texture("./blackmetal.jpg",scene);          
              
            newMeshes[0].material = chrome;
            newMeshes[1].material = blackMetal;
            newMeshes[4].material = blackPlastic;
            newMeshes[2].material = redPlastic;
            newMeshes[6].material = blackBox;
            newMeshes[3].material = blackCushion;
            camera.target = newMeshes[0];

    	});
        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
 