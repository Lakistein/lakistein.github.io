/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="babylon.2.3.d.ts" />
var PBRConverter = (function () {
    function PBRConverter() {
    }
    PBRConverter.PBRToJSON = function (material) {
        return '{ ' +
            '"indexOfRefraction":' + material.indexOfRefraction + ',' +
            '"albedoTexture":"' + ((material.albedoTexture) ? encodeURI(material.albedoTexture.getInternalTexture().url) : "null") + '",' +
            '"ambientTexture":"' + ((material.ambientTexture) ? encodeURI(material.ambientTexture.getInternalTexture().url) : "null") + '",' +
            '"bumpTexture":"' + ((material.bumpTexture) ? encodeURI(material.bumpTexture.getInternalTexture().url) : "null") + '",' +
            '"emissiveTexture":"' + ((material.emissiveTexture) ? encodeURI(material.emissiveTexture.getInternalTexture().url) : "null") + '",' +
            '"alpha" : ' + material.alpha + ',' +
            '"directIntensity" : ' + material.directIntensity + ',' +
            '"emissiveIntensity" : ' + material.emissiveIntensity + ',' +
            '"environmentIntensity" : ' + material.environmentIntensity + ',' +
            '"specularIntensity" : ' + material.specularIntensity + ',' +
            '"overloadedShadowIntensity" : ' + material.overloadedShadowIntensity + ',' +
            '"overloadedShadeIntensity" : ' + material.overloadedShadeIntensity + ',' +
            '"cameraExposure" : ' + material.cameraExposure + ',' +
            '"cameraContrast" : ' + material.cameraContrast + ',' +
            '"microSurface" : ' + material.microSurface + ',' +
            '"reflectivityColor" : {"r":' + material.reflectivityColor.r + ', "g":' + material.reflectivityColor.g + ', "b":' + material.reflectionColor.b + '}' +
            '}';
    };
    PBRConverter.prototype.JSONToPBR = function (json) {
        return null;
    };
    return PBRConverter;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
// TODO: uradi simple interface
var Environment = (function () {
    function Environment(json, scene) {
        this.lights = [];
        if (!json)
            return;
        this.id = json.id;
        this.groundTexture = null;
        this.groundShadow = scene.getMeshByName("GROUNDPLANE_STYLE_1");
        this.backgroundMesh = scene.getMeshByName("background");
        this.backgroundColor = this.backgroundMesh.material.albedoColor = new BABYLON.Color3(json.backgroundColor.r, json.backgroundColor.g, json.backgroundColor.b);
        this.rotateBackground = true;
        for (var i = 0; i < json.lights.length; i++) {
            switch (json.lights[i].type) {
                case "spot":
                    this.lights.push(new BABYLON.SpotLight("spot", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), new BABYLON.Vector3(json.lights[i].direction.x, json.lights[i].direction.y, json.lights[i].direction.z), json.lights[i].angle, 1, scene));
                    break;
                case "point":
                    this.lights.push(new BABYLON.PointLight("point", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene));
                    break;
                case "hemi":
                    this.lights.push(new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene));
                    break;
            }
            this.lights[i].intensity = json.lights[i].intensity;
            this.lights[i].range = json.lights[i].range;
            this.lights[i].diffuse = new BABYLON.Color3(json.lights[i].diffuse.r, json.lights[i].diffuse.g, json.lights[i].diffuse.b);
            this.lights[i].specular = new BABYLON.Color3(json.lights[i].specular.r, json.lights[i].specular.g, json.lights[i].specular.b);
        }
        scene.registerBeforeRender(function () {
            if (this.backgroundMesh == null)
                this.backgroundMesh = scene.getMeshByName("background");
            if (this.backgroundMesh && scene.activeCamera) {
                this.backgroundMesh.rotation.y = -(scene.activeCamera.alpha) + -Math.PI / 2;
            }
        });
    }
    Environment.prototype.toJSON = function () {
        var json = '{"backgroundColor": ' + JSON.stringify(this.backgroundColor) + ',"lights": [';
        for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].name !== "spot" && this.lights[i].name !== "point" && this.lights[i].name !== "hemi")
                continue;
            json += '{' +
                '"type":' + JSON.stringify(this.lights[i].name) + ',' +
                '"position": ' + JSON.stringify(this.lights[i].getAbsolutePosition()) + ',';
            if (this.lights[i].name === "spot") {
                json += '"angle":' + this.lights[i].angle + ',' +
                    '"direction":' + JSON.stringify(this.lights[i].direction) + ',';
            }
            json += '"diffuse:"' + JSON.stringify(this.lights[i].diffuse) + ',' + '"specular:"' + JSON.stringify(this.lights[i].specular) + ',' +
                '"intensity": ' + this.lights[i].intensity + ',' +
                '"range":' + this.lights[i].range.toPrecision(2) + '},';
        }
        json = json.substring(0, json.length - 1);
        json += ']}';
        return json;
    };
    return Environment;
})();
/*

{
    "backgroundColor": {"r": 255, "g":255, "b":255},
    "lights": [{
        "type": "point",
        "position": {"x": 1,"y": 1,"z": 1},
        "direction": {"x": 1,"y": 1,"z": 1},
        "diffuse": {"r": 1,"g": 1,"b": 1},
        "specular": {"r": 1,"g": 1,"b": 1},
        "intensity": 15,
        "range": 15,
    }]
}

 */ 
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="Environment.ts" />
var EnvironmentManager = (function () {
    function EnvironmentManager(json, scene) {
        this.environments = [];
        var jsonEnv = JSON.parse(json);
        for (var i = 0; i < jsonEnv.length; i++) {
            this.environments.push(new Environment(jsonEnv[i], scene));
        }
        this.setEnvironment(this.environments[2].id, scene);
    }
    EnvironmentManager.prototype.findEnvironmentById = function (id) {
        var environment = null;
        for (var i = 0; i < this.environments.length; i++) {
            if (this.environments[i].id == id) {
                environment = this.environments[i];
                this.currentEnvironment = i;
                break;
            }
        }
        return environment;
    };
    EnvironmentManager.prototype.setEnvironment = function (id, scene) {
        if (this.currentEnvironment && this.environments[this.currentEnvironment].id == id) {
            return;
        }
        this.removeLights(scene);
        var environment = this.findEnvironmentById(id);
        if (!environment)
            environment = this.environments[0];
        for (var i = 0; i < this.environments[this.currentEnvironment].lights.length; i++) {
            scene.lights.push(this.environments[this.currentEnvironment].lights[i]);
        }
        this.setBackgroundColor(scene.getMeshByName("background"), this.environments[this.currentEnvironment].backgroundColor, this.currentEnvironment);
        this.setReflection(scene);
    };
    EnvironmentManager.prototype.turnBackgroundOnOff = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.turnShadowOffOn = function (value) {
        this.environments[this.currentEnvironment].groundShadow.setEnabled(value);
    };
    EnvironmentManager.prototype.removeLights = function (scene) {
        for (var i = scene.lights.length - 1; i >= 0; --i) {
            if (scene.lights[i].name === "spot" || scene.lights[i].name === "point" || scene.lights[i].name === "hemi") {
                scene.lights.splice(i, 1);
            }
        }
    };
    EnvironmentManager.prototype.setBackgroundColor = function (mesh, color, environmentIndex) {
        mesh.material.albedoColor = this.environments[environmentIndex].backgroundColor;
    };
    EnvironmentManager.prototype.setReflection = function (scene, color) {
        for (var i = 0; i < scene.meshes.length; i++) {
            if (scene.meshes[i].material instanceof BABYLON.PBRMaterial && scene.meshes[i].name != "GROUNDPLANE_STYLE_1") {
                if (this.environments[this.currentEnvironment].reflectionTexture) {
                    scene.meshes[i].material.reflectionTexture = this.environments[this.currentEnvironment].reflectionTexture;
                }
                else {
                    scene.meshes[i].material.reflectionColor = (color) ? color : this.environments[this.currentEnvironment].backgroundColor;
                }
            }
        }
    };
    EnvironmentManager.prototype.updateGroundTexture = function (scene) {
        var _this = this;
        var file = document.querySelector('#groundImg').files[0];
        var reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
        }
        else {
            this.environments[this.currentEnvironment].groundTexture = null;
        }
        reader.onloadend = function () {
            var mesh = scene.getMeshByName("groundPlane");
            if (mesh.material.albedoTexture)
                mesh.material.albedoTexture.dispose();
            if (mesh.material.opacityTexture)
                mesh.material.opacityTexture.dispose();
            _this.environments[_this.currentEnvironment].groundTexture = BABYLON.Texture.CreateFromBase64String(reader.result, file.name, scene);
            mesh.material.albedoTexture = _this.environments[_this.currentEnvironment].groundTexture;
            mesh.material.opacityTexture = _this.environments[_this.currentEnvironment].groundTexture;
            mesh.material.albedoTexture.hasAlpha = true;
        };
    };
    return EnvironmentManager;
})();
/// <reference path="Environment.ts" />
/// <reference path="EnvironmentManager.ts" />
var EnvironmentUI = (function () {
    function EnvironmentUI(jsonString, scene) {
        var _this = this;
        this.environmentManager = new EnvironmentManager(jsonString, scene);
        var environments = document.getElementsByClassName('environment');
        var env = this.environmentManager;
        for (var i = 0; i < environments.length; i++) {
            environments.item(i).addEventListener('click', function () {
                env.setEnvironment(this.getAttribute("id"), scene);
            });
        }
        document.getElementById("background").onchange = function () {
            _this.environmentManager.turnBackgroundOnOff((document.getElementById('background')).checked);
        };
        document.getElementById("shadows").onchange = function () {
            _this.environmentManager.turnShadowOffOn((document.getElementById('shadows')).checked);
        };
        var k = 0;
        document.getElementById("arrowIcon").addEventListener('click', function () {
            if (document.getElementById("Environment").style.height == "70%") {
                document.getElementById("Environment").style.height = "7%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
            else {
                document.getElementById("Environment").style.height = "70%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
        });
    }
    return EnvironmentUI;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="PBRConverter.ts" />
/// <reference path="EnvironmentUI.ts" />
var sceneMain;
var envUI;
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
            material.albedoColor = BABYLON.Color3.FromInts(value.r, value.g, value.b);
            envUI.environmentManager.setReflection(sceneMain, material.albedoColor);
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
        var reflectionTexture = new BABYLON.CubeTexture("./textures/skybox/skybox", scene);
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/Skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.infiniteDistance = true;
        skybox.material = skyboxMaterial;
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
                        background.alpha = 1;
                        background.albedoColor = BABYLON.Color3.Black();
                        background.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        background.indexOfRefraction = 2;
                        background.directIntensity = 1.6;
                        background.environmentIntensity = 0.05;
                        background.overloadedShadeIntensity = 0.8;
                        background.cameraExposure = 1.5;
                        background.cameraContrast = 1.8;
                        background.microSurface = 0;
                        newMeshes[i].position.y = -0.1;
                        newMeshes[i].material = background;
                        break;
                    case "GROUNDPLANE_STYLE_1":
                        var ground = new BABYLON.PBRMaterial("g", scene);
                        ground.albedoTexture = new BABYLON.Texture("./textures/GROUNDPLANESHADOW_STYLE_1.png", scene);
                        ground.opacityTexture = new BABYLON.Texture("./textures/GROUNDPLANESHADOW_STYLE_1.png", scene);
                        ground.albedoTexture.hasAlpha = true;
                        ground.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        ground.directIntensity = 2;
                        ground.environmentIntensity = 0;
                        ground.overloadedShadeIntensity = 0;
                        ground.cameraExposure = 2;
                        ground.cameraContrast = 2;
                        ground.microSurface = 0;
                        newMeshes[i].position.y = 0.01;
                        newMeshes[i].material = ground;
                        break;
                    case "HEADSETARCH_STYLE_1":
                        blackMetal.albedoTexture = new BABYLON.Texture("./textures/blackmetal.jpg", scene);
                        blackMetal.ambientTexture = new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg", scene);
                        blackMetal.ambientTexture.coordinatesIndex = 1;
                        blackMetal.reflectivityColor = new BABYLON.Color3(0.1, 0.1, 0.1);
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
                    case "groundPlane":
                        var groundPlaneMaterial = new BABYLON.PBRMaterial("groundPlaneMaterial", sceneMain);
                        groundPlaneMaterial.albedoTexture = new BABYLON.Texture("./textures/blue.png", scene);
                        groundPlaneMaterial.opacityTexture = new BABYLON.Texture("./textures/blue.png", scene);
                        groundPlaneMaterial.albedoTexture.hasAlpha = true;
                        groundPlaneMaterial.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                        groundPlaneMaterial.directIntensity = 2;
                        groundPlaneMaterial.environmentIntensity = 0;
                        groundPlaneMaterial.overloadedShadeIntensity = 0;
                        groundPlaneMaterial.cameraExposure = 2;
                        groundPlaneMaterial.cameraContrast = 2;
                        groundPlaneMaterial.microSurface = 0;
                        groundPlaneMaterial.alpha = 1;
                        newMeshes[i].material = groundPlaneMaterial;
                        //             var mirrorMaterial = new BABYLON.StandardMaterial("texture4", scene);
                        //             mirrorMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                        //             var mirrorTexture = new BABYLON.MirrorTexture("mirror", 512, scene, true); //Create a mirror texture
                        // 
                        //             mirrorMaterial.reflectionTexture = mirrorTexture;
                        //             mirrorTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -10.0);
                        //             mirrorTexture.renderList = newMeshes;
                        //             mirrorMaterial.reflectionTexture.level = 0.6;//Select the level (0.0 > 1.0) of the reflection
                        //             newMeshes[i].material = mirrorMaterial;
                        gui.add(newMeshes[i].scaling, "x");
                        gui.add(newMeshes[i].scaling, "y");
                        gui.add(newMeshes[i].scaling, "z");
                        break;
                }
                if (newMeshes[i].name == "background")
                    displayMaterialValues(newMeshes[i].material);
            }
            var str = '[{"id":0,"backgroundColor":{"r":0,"g":0,"b":1},"lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":50000,"range":8.0}]},{"id":1,"backgroundColor":{"r":0,"g":1,"b":0},"lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":2,"backgroundColor":{"r":1,"g":0,"b":0},"lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":0,"range":8.0}]},{"id":3,"backgroundColor":{"r":0.7,"g":0.7,"b":0.7},"lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';
            envUI = new EnvironmentUI(str, sceneMain);
        });
        return scene;
    }
    sceneMain = createScene();
    // code bellow is for falres milestone
    var ray = BABYLON.Ray.CreateNewFromTo(new BABYLON.Vector3(5.26, 2.91, 1.75), new BABYLON.Vector3(5.26, 2.91, 1.75));
    var mainLensLight = new BABYLON.PointLight("lensLight", new BABYLON.Vector3(0.027, 0.601, -1.225), sceneMain);
    mainLensLight.intensity = 0;
    var MainLensFlareSystem = new BABYLON.LensFlareSystem("mainLensFlareSystem", mainLensLight, sceneMain);
    var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), "./textures/Main Flare.png", MainLensFlareSystem);
    flare.texture.hasAlpha = true;
    var hexaLensLight = new BABYLON.SpotLight("hexaLensLight", new BABYLON.Vector3(0.027, 0.601, -1.225), new BABYLON.Vector3(0.2, 0, -1), 10, 0.01, sceneMain);
    hexaLensLight.intensity = 0;
    var hexaLensFlareSystem = new BABYLON.LensFlareSystem("hexaLensFlareSystem", hexaLensLight, sceneMain);
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
    sceneMain.registerBeforeRender(function () {
        var rayPick = BABYLON.Ray.CreateNewFromTo(camera.position, new BABYLON.Vector3(0.027, 0.601, -1.225));
        var meshFound = sceneMain.pickWithRay(rayPick, function (mesh) { return true; });
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
    });
    var fps = document.getElementById("fps");
    engine.runRenderLoop(function () {
        sceneMain.render();
        fps.innerText = engine.getFps().toString();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
