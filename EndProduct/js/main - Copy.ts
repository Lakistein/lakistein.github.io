/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="PBRConverter.ts" />
/// <reference path="EnvironmentUI.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />

// things to download: 
// Skyboxes with reflections
// Materials

var sceneMain: BABYLON.Scene;
var envUI: EnvironmentUI;
var time = 0;
var reflectionMeshes;
var camera_inistance;


window.addEventListener('DOMContentLoaded', function() {
    var canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
    var gui = new dat.GUI();
var shd = document.createElement('div');
shd.setAttribute("id", "shaders");
shd.setAttribute("style", "display:none");
    var engine = new BABYLON.Engine(canvas, true);
    var camera: BABYLON.ArcRotateCamera;
    var camera2: BABYLON.FreeCamera;
    //     function displayMaterialValues(material) {
    //         var folder = gui.addFolder(material.name);
    //         folder.add(material, "indexOfRefraction", 0, 2);
    //         folder.add(material, "alpha", 0, 1);
    //         folder.add(material, "directIntensity", 0, 2);
    //         folder.add(material, "emissiveIntensity", 0, 2);
    //         folder.add(material, "environmentIntensity", 0, 2);
    //         folder.add(material, "specularIntensity", 0, 2);
    //         folder.add(material, "overloadedShadowIntensity", 0, 2);
    //         folder.add(material, "overloadedShadeIntensity", 0, 2);
    //         folder.add(material, "cameraExposure", 0, 2);
    //         folder.add(material, "cameraContrast", 0, 2);
    //         folder.add(material, "microSurface", 0, 1);
    //         var color = folder.addColor(material, "albedoColor");
    //         color.onChange(function(value) {
    //             material.albedoColor = BABYLON.Color3.FromInts(value.r, value.g, value.b);
    //             envUI.environmentManager.setReflection(sceneMain, material.albedoColor);
    // 
    //         });
    //         folder.add(material.reflectivityColor, "r", 0, 1);
    //         folder.add(material.reflectivityColor, "g", 0, 1);
    //         folder.add(material.reflectivityColor, "b", 0, 1);
    //     }
    function createScene() {



        if (document.getElementById('shaders') == null)
            document.body.appendChild(shd);
        else document.getElementById('shaders').innerHTML = "";


        var scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, .5, 0), scene);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 6;
        camera.upperBetaLimit = 1.6;
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 50;
        camera.setPosition(new BABYLON.Vector3(0.004510142482902708, 0.7674630808337399, -2.9880500596552437));
        scene.activeCamera = camera;

        camera2 = new BABYLON.FreeCamera("ArcRotateCamera", new BABYLON.Vector3(0, 0, 0), scene);
        camera2.position = camera.position;
        camera2.rotation = camera.rotation;

        camera_inistance = camera;
        scene.activeCameras.push(camera2);
        scene.activeCameras.push(camera);
        // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 3, scene);
        // var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
        // gradientMaterial.topColor = BABYLON.Color3.Red(); // Set the gradient top color
        // gradientMaterial.bottomColor = BABYLON.Color3.Blue(); // Set the gradient bottom color
        // gradientMaterial.offset = 0.25;
        // sphere.material = gradientMaterial;
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function(newMeshes) {
            reflectionMeshes = newMeshes;
            var blackPlastic = new BABYLON.PBRMaterial("Black Plastic", scene);
            var redPlastic = new BABYLON.PBRMaterial("Red Plastic", scene);
            var chrome = new BABYLON.PBRMaterial("Chrome", scene);
            var blackMetal = new BABYLON.PBRMaterial("Black Metal", scene);
            var blackBox = new BABYLON.PBRMaterial("Black Box", scene);
            var blackCushion = new BABYLON.PBRMaterial("Black Cushion", scene);
            // var background = new BABYLON.GradientMaterial("Background", scene);
            var hemilight = new BABYLON.HemisphericLight("hemilight1", new BABYLON.Vector3(0, 1, 0), sceneMain);
            hemilight.range = 0.1;

            // Default intensity is 1. Let's dim the light a small amount
            hemilight.intensity = 0.7;
            for (var i = 0; i < newMeshes.length; i++) {
                switch (newMeshes[i].name) {
                    case "BOX_STYLE_1":
                        blackBox.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackbox.jpg", scene);
                        blackBox.ambientTexture = new BABYLON.Texture("./textures/models-textures/BOX_STYLE_1.jpg", scene);
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
                        var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
                        gradientMaterial.topColor = BABYLON.Color3.Red();
                        gradientMaterial.bottomColor = BABYLON.Color3.Blue();
                        newMeshes[i].position.y = -0.1;
                        newMeshes[i].material = gradientMaterial;
                        break;
                    case "GROUNDPLANE_STYLE_1":
                        var ground = new BABYLON.PBRMaterial("g", scene);
                        ground.albedoTexture = new BABYLON.Texture("./textures/models-textures/GROUNDPLANESHADOW_STYLE_1.png", scene);
                        ground.opacityTexture = new BABYLON.Texture("./textures/models-textures/GROUNDPLANESHADOW_STYLE_1.png", scene);
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
                        blackMetal.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackmetal.jpg", scene);
                        blackMetal.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
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
                        blackPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackplastic.jpg", scene);
                        blackPlastic.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
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
                        chrome.albedoTexture = new BABYLON.Texture("./textures/models-textures/chrome.jpg", scene);
                        chrome.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
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
                        redPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/redplastic.jpg", scene);
                        redPlastic.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
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
                        blackCushion.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackcushion.jpg", scene);
                        blackCushion.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                        blackCushion.ambientTexture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
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
                        groundPlaneMaterial.albedoTexture = new BABYLON.Texture("./textures/flare.png", scene);
                        groundPlaneMaterial.opacityTexture = new BABYLON.Texture("./textures/flare.png", scene);
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
                        break;
                    case "reflectionPlane":



                        break;
                }

                if (newMeshes[i].name != "background")
                    hemilight.excludedMeshes.push(newMeshes[i]);
            }



            var reflectionPlane = scene.getMeshByName("reflectionPlane");
            reflectionPlane.material = eash.shader(eash.alpha() + eash.solid(0xff0000, 0.0), scene);
            reflectionPlane.helperMaterial = eash.shader(eash.solid(0x0000ff), scene);


            var renderTarget = new BABYLON.RenderTargetTexture("depth", 1024, scene);


            for (var i = 0; i < newMeshes.length; i++) {

                    renderTarget.renderList.push(newMeshes[i]);
            }


            scene.customRenderTargets.push(renderTarget);

            renderTarget.onBeforeRender = function() {
                for (var index = 0; index < renderTarget.renderList.length; index++) {
                    renderTarget.renderList[index]._savedMaterial = renderTarget.renderList[index].material;
                    renderTarget.renderList[index].material = renderTarget.renderList[index].helperMaterial;
                }
            }

            renderTarget.onAfterRender = function() {
                for (var index = 0; index < renderTarget.renderList.length; index++) {

                    renderTarget.renderList[index].material = renderTarget.renderList[index]._savedMaterial;
                }
            }

            var pps1 = eash.linerPostProcess(eash.ppsMap(0), camera);

            eash.linerPostProcess('result = vec4(texture2D(textureSampler, vec2( 1.-uv.x, uv.y),1000.).xyz ,1.0);result = vec4(result.xyz*0.8,1.0); ', camera2);

            var a = [];
            var al = 1.0;
            for (var ij = 0.0005; ij < 0.01; ij += 0.001) {
                al -= 0.05;
                al = Math.max(0., al);
                var ji1 = Math.pow(ij, 0.9) / 1.33;
                a.push({ r: eash.cameraShot({ uv: ' uv  +vec2(' + _cs(ji1) + ',0.0)' }), e: al });
                a.push({ r: eash.cameraShot({ uv: ' uv  +vec2(-1.*' + _cs(ji1) + ',0.0)' }), e: al });
            }
            eash.linerPostProcess(

                eash.multi(a, true)
                , camera2, 1.0);


            a = [];
            al = 1.0;
            for (var ij = 0.0005; ij < 0.01; ij += 0.001) {
                al -= 0.05;
                al = Math.max(0., al);
                var ji1 = Math.pow(ij, 0.9) / 1.33;
                a.push({ r: eash.cameraShot({ uv: ' uv  +vec2(0.0,' + _cs(ji1) + ' )' }), e: al });
                a.push({ r: eash.cameraShot({ uv: ' uv  +vec2(0.0,-1.*' + _cs(ji1) + ' )' }), e: al });
            }
            eash.linerPostProcess(

                eash.multi(a, true)
                , camera2, 1.0);

            var pps2 = eash.linerPostProcess(eash.ppsMap(0), camera2);
            eash.linerPostProcess(eash.cameraLayer(1) + eash.reference('ref') + eash.cameraLayer(2)

                + eash.replace({
                    type: blue,
                    level: 5.,
                    levelCount: 6., levelFill: true,
                    mat: eash.cameraLayer(3)
                }), camera, {
                    apply: function(ef) {
                        ef.setTexture('ref1', renderTarget);
                        ef.setTextureFromPostProcess('ref2', pps1);
                        ef.setTextureFromPostProcess('ref3', pps2);
                    }
                });







            var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';

            envUI = new EnvironmentUI(str, sceneMain);
        });
        return scene;
    }

    sceneMain = createScene();
    
    // code bellow is for falres milestone
    var ray = BABYLON.Ray.CreateNewFromTo(new BABYLON.Vector3(5.26, 2.91, 1.75), new BABYLON.Vector3(5.26, 2.91, 1.75));
    var mainLensEmitter = new BABYLON.Mesh("lensEmitter", sceneMain);
    mainLensEmitter.position = new BABYLON.Vector3(0.027, 0.601, -1.225);
    var MainLensFlareSystem = new BABYLON.LensFlareSystem("mainLensFlareSystem", mainLensEmitter, sceneMain);
    var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), "./textures/Main Flare.png", MainLensFlareSystem);
    flare.texture.hasAlpha = true;
    var hexaLensEmitter = new BABYLON.Mesh("hexaLensEmitter", sceneMain);
    hexaLensEmitter.position = new BABYLON.Vector3(0.027, 0.601, -1.225);
    var hexaLensFlareSystem = new BABYLON.LensFlareSystem("hexaLensFlareSystem", hexaLensEmitter, sceneMain);
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


    sceneMain.registerBeforeRender(function() {
        var rayPick = BABYLON.Ray.CreateNewFromTo(camera.position, new BABYLON.Vector3(0.027, 0.601, -1.225));
        var meshFound = sceneMain.pickWithRay(rayPick, function(mesh) { return true; });
        if (meshFound != null && meshFound.pickedPoint != null) {
            flare.color = BABYLON.Color3.Black();
            hexaLensFlareSystem.isEnabled = false;
        }
        else {
            flare.color = BABYLON.Color3.White();
            hexaLensFlareSystem.isEnabled = true;
            var vec1 = hexaLensEmitter.position;
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
    var v = false;
    var fps = document.getElementById("fps");
    sceneMain.registerBeforeRender(() => {
        time++;

        camera2.position.x = camera.position.x * -1;
        camera2.position.y = camera.position.y;
        camera2.position.z = camera.position.z;
        camera2.setTarget(new BABYLON.Vector3(0., 0., 0.));


        for (var ms in reflectionMeshes) {

            var it = reflectionMeshes[ms];
            if (def(it.material) && it.material.isEashMaterial) {
                it.material.setVector3('camera', camera_inistance.position);
                it.material.setFloat('time', time++);


            }
        }
    });
    engine.runRenderLoop(function() {
        sceneMain.render();
        fps.innerText = engine.getFps().toString();
    });
    window.addEventListener('resize', function() {
        engine.resize();
    });
});

function def(e, r) { return void 0 != e && null != e ? void 0 != r && null != r ? e : !0 : r != _null ? void 0 != r && null != r ? r : !1 : null } function _cs(e) { return -1 == e.toString().indexOf(".") ? e + "." : e.toString() } var _null = "set null anyway", red = 0, yellow = 1, white = 2, cyan = 4, blue = 5, pink = 6, black = 7, green = 8, cnrm = "nrm", sundir = "sundir(9.0,18.0,vec3(0.,10.,0.))", False = !1, True = !0; String.prototype.trim = function() { return this.replace(/^\s+|\s+$/gm, "") }, String.prototype.replaceAll = function(e, r, s) { return this.replace(new RegExp(e.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), s ? "gi" : "g"), "string" == typeof r ? r.replace(/\$/g, "$$$$") : r) }; var shader_global = function() { var e = new Date, r = 1e4 * e.getFullYear() + 100 * e.getMonth() + e.getDay(), s = 1e4 * e.getHours() + 100 * e.getMinutes() + e.getSeconds(), t = 0, a = 0; return { x: r, y: s, z: t, w: a } }, eash = { globalOption: {}, textureReferences: {}, ind: 0, shdrIndex: 0, defShader: function(e, r) { function s(e, s) { if (e) { a = s; var t; if (e.dy) { var n = e.dy.toDataURL("image/jpeg"); t = new BABYLON.Texture(n, r) } else t = e.embed ? new BABYLON.Texture(e.embed, r, !0, !0, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, e.embed, !0) : new BABYLON.Texture(e, r); shaderMaterial.setTexture(a, t), (e.r || e.rx && e.ry) && e.r && (e.rx = e.r, e.ry = e.r) } } function t(e, s) { if (e) { a = s; var t; e && (t = new BABYLON.CubeTexture(e, r), t.coordinatesMode = BABYLON.Texture.PLANAR_MODE), shaderMaterial.setTexture(a, t), shaderMaterial.setMatrix("refmat", t.getReflectionTextureMatrix()) } } def(eash.globalOption) && (eash.globalOption.alpha = def(eash.globalOption.alpha, def(eash.globalOption.alpha, !1)), eash.globalOption.back = def(eash.globalOption.back, def(eash.globalOption.back, !1)), eash.globalOption.wire = def(eash.globalOption.wire, def(eash.globalOption.wire, !1))), shaderMaterial = new BABYLON.ShaderMaterial(def(e.name, "eash_shader"), r, { vertexElement: e.shader.vtx, fragmentElement: e.shader.frg }, e.shader.u); var a = ""; return def(eash.TextureReferences) && (def(eash.TextureReferences.ref1) && s(eash.TextureReferences.ref1, "ref1"), def(eash.TextureReferences.ref2) && s(eash.TextureReferences.ref2, "ref2"), def(eash.TextureReferences.ref3) && s(eash.TextureReferences.ref3, "ref3"), def(eash.TextureReferences.ref4) && s(eash.TextureReferences.ref4, "ref4"), def(eash.TextureReferences.ref5) && s(eash.TextureReferences.ref5, "ref5"), def(eash.TextureReferences.ref6) && s(eash.TextureReferences.ref6, "ref6"), def(eash.TextureReferences.ref7) && s(eash.TextureReferences.ref7, "ref7"), def(eash.TextureReferences.ref8) && s(eash.TextureReferences.ref8, "ref8"), def(eash.TextureReferences.refc1) && t(eash.TextureReferences.refc1, "refc1"), def(eash.TextureReferences.refc2) && t(eash.TextureReferences.refc2, "refc2"), def(eash.TextureReferences.refc3) && t(eash.TextureReferences.refc3, "refc3")), eash.globalOption.alpha ? shaderMaterial.needAlphaBlending = function() { return !0 } : shaderMaterial.needAlphaBlending = function() { return !1 }, eash.globalOption.back || (eash.globalOption.back = !1), shaderMaterial.needAlphaTesting = function() { return !0 }, shaderMaterial.setFloat("time", 0), shaderMaterial.setVector3("camera", BABYLON.Vector3.Zero()), shaderMaterial.setVector2("mouse", BABYLON.Vector2.Zero()), shaderMaterial.setVector2("screen", BABYLON.Vector2.Zero()), shaderMaterial.backFaceCulling = !eash.globalOption.back, shaderMaterial.wireframe = eash.globalOption.wire, shaderMaterial.onCompiled = function() { }, shaderMaterial.onError = function(e, r) { }, shaderMaterial }, normals: { nrm: "nrm", not_nrm: "-1.0*nrm", flat: "normalize(cross(dFdx(pos*-1.),dFdy(pos)))" }, shaderBase: { vertex: function(e, r, s, t, a) { return s = def(s, [eash.sh_global(), r, eash.sh_uniform(), eash.sh_varing(), eash.sh_tools(), eash.sh_main_vertex(e, t, a)]), s.join("\n") }, fragment: function(e, r, s, t, a) { return s = def(s, [eash.sh_global(), r, eash.sh_uniform(), eash.sh_varing(), eash.sh_tools(), eash.sh_main_fragment(e, t, a)]), s.join("\n") }, shader: function(e) { e && !e.u && (e.u = { attributes: ["position", "normal", "uv"], uniforms: ["view", "world", "worldView", "viewProjection", "worldViewProjection"] }), eash.shdrIndex++; var r = e.vtx, s = e.frg; e.vtx = "sh_v_" + eash.shdrIndex, e.frg = "sh_f_" + eash.shdrIndex; var t = document.createElement("Script"); t.setAttribute("id", e.vtx), t.setAttribute("type", "x-shader/x-vertex"), t.innerHTML = eash.shaderBase.vertex(r, e.helper, e.vtxops, def(e.id, 0), def(e.sysId, 0)), document.getElementById("shaders").appendChild(t); var a = document.createElement("Script"); return a.setAttribute("id", e.frg), a.setAttribute("type", "x-shader/x-fragment"), a.innerHTML = eash.shaderBase.fragment(s, e.helper, e.frgops, def(e.id, 0), def(e.sysId, 0)), document.getElementById("shaders").appendChild(a), { shader: e } } }, postProcessBase: { vertex: function(e, r, s, t, a) { return s = def(s, [eash.sh_global(), r, eash.sh_uniform_postProcess(), eash.sh_tools(), eash.sh_main_vertex_postprocess(e, t, a)]), s.join("\n") }, fragment: function(e, r, s, t, a) { return s = def(s, [eash.sh_global(), r, eash.sh_uniform_postProcess(), eash.sh_tools(), eash.sh_main_fragment(e, t, a)]), s.join("\n") }, postProcess: function(e) { e && !e.u && (e.u = { attributes: ["position"], uniforms: ["view", "world", "worldView", "viewProjection", "worldViewProjection"] }), eash.shdrIndex++; var r = e.vtx, s = e.frg; return e.vtx = "sh_v_" + eash.shdrIndex, e.frg = "sh_f_" + eash.shdrIndex, BABYLON.Effect.ShadersStore[e.frg + "PixelShader"] = eash.postProcessBase.fragment(s, e.helper, e.frgops, def(e.id, 0), def(e.sysId, 0)).replace("#extension GL_OES_standard_derivatives : enable", " ").replaceAll("\n", "  ").replaceAll("	", "    "), BABYLON.Effect.ShadersStore.postprocessVertexShader = eash.postProcessBase.vertex(r, e.helper, e.vtxops, def(e.id, 0), def(e.sysId, 0)).replaceAll("\n", "  ").replaceAll("	", "    "), e.frg } }, isDebug: !1, sh_global: function() { return ["precision highp float;", "uniform mat4 worldViewProjection;", "uniform mat4 worldView;          ", "uniform mat4 world; "].join("\n") }, sh_uniform: function() { return ["uniform vec3 camera;", "uniform vec2 mouse; ", "uniform float time; ", "uniform vec2 screen; ", "uniform vec3 glb; ", "uniform vec3 center; ", "uniform samplerCube refc1; ", "uniform samplerCube refc2; ", "uniform samplerCube refc3; ", "uniform sampler2D ref1; ", "uniform sampler2D ref2; ", "uniform sampler2D ref3; ", "uniform sampler2D ref4; ", "uniform sampler2D ref5; ", "uniform sampler2D ref6; ", "uniform sampler2D ref7; ", "uniform sampler2D ref8; ", "uniform vec3 vrefi; ", "uniform mat4 refmat; ", "uniform mat4 view;"].join("\n") }, sh_uniform_postProcess: function() { return ["uniform sampler2D textureSampler; ", "uniform vec3 camera;", "uniform vec2 mouse; ", "uniform float time; ", "uniform vec2 screen; ", "uniform vec3 glb; ", "uniform vec3 center; ", "uniform sampler2D ref1; ", "uniform sampler2D ref2; ", "uniform sampler2D ref3; ", "uniform sampler2D ref4; ", "uniform sampler2D ref5; ", "uniform sampler2D ref6; ", "uniform sampler2D ref7; ", "varying vec2 uv;    "].join("\n") }, sh_varing: function() { return ["varying vec3 pos;  ", "varying vec3 _pos;  ", "varying vec3 nrm;  ", "varying vec3 _nrm;  ", "varying vec2 u;    ", "varying vec2 u2;    ", "varying mat4 wvp;  ", def(eash.globalOption) ? def(eash.globalOption.hlp_Varying, "") : ""].join("\n") }, sh_tools: function() { return ["vec3 random3(vec3 c) {   float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));   vec3 r;   r.z = fract(512.0*j); j *= .125;  r.x = fract(512.0*j); j *= .125; r.y = fract(512.0*j);  return r-0.5;  } ", "float rand(vec2 co){   return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); } ", "const float F3 =  0.3333333;const float G3 =  0.1666667;", "float simplex3d(vec3 p) {   vec3 s = floor(p + dot(p, vec3(F3)));   vec3 x = p - s + dot(s, vec3(G3));  vec3 e = step(vec3(0.0), x - x.yzx);  vec3 i1 = e*(1.0 - e.zxy);  vec3 i2 = 1.0 - e.zxy*(1.0 - e);   vec3 x1 = x - i1 + G3;   vec3 x2 = x - i2 + 2.0*G3;   vec3 x3 = x - 1.0 + 3.0*G3;   vec4 w, d;    w.x = dot(x, x);   w.y = dot(x1, x1);  w.z = dot(x2, x2);  w.w = dot(x3, x3);   w = max(0.6 - w, 0.0);   d.x = dot(random3(s), x);   d.y = dot(random3(s + i1), x1);   d.z = dot(random3(s + i2), x2);  d.w = dot(random3(s + 1.0), x3);  w *= w;   w *= w;  d *= w;   return dot(d, vec4(52.0));     }  ", "float noise(vec3 m) {  return   0.5333333*simplex3d(m)   +0.2666667*simplex3d(2.0*m) +0.1333333*simplex3d(4.0*m) +0.0666667*simplex3d(8.0*m);   } ", "float dim(vec3 p1 , vec3 p2){   return sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)+(p2.z-p1.z)*(p2.z-p1.z)); }", "vec2  rotate_xy(vec2 pr1,vec2  pr2,float alpha) {vec2 pp2 = vec2( pr2.x - pr1.x,   pr2.y - pr1.y );return  vec2( pr1.x + pp2.x * cos(alpha*3.14159265/180.) - pp2.y * sin(alpha*3.14159265/180.),pr1.y + pp2.x * sin(alpha*3.14159265/180.) + pp2.y * cos(alpha*3.14159265/180.));} \n vec3  r_y(vec3 n, float a,vec3 c) {vec3 c1 = vec3( c.x,  c.y,   c.z );c1.x = c1.x;c1.y = c1.z;vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.x,  n.z ), a);n.x = p.x;n.z = p.y;return n; } \n vec3  r_x(vec3 n, float a,vec3 c) {vec3 c1 = vec3( c.x,  c.y,   c.z );c1.x = c1.y;c1.y = c1.z;vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.y,  n.z ), a);n.y = p.x;n.z = p.y;return n; } \n vec3  r_z(vec3 n, float a,vec3 c) {  vec3 c1 = vec3( c.x,  c.y,   c.z );vec2 p = rotate_xy(vec2(c1.x,c1.y), vec2( n.x,  n.y ), a);n.x = p.x;n.y = p.y;return n; }", "vec3 sundir(float da,float db,vec3 ps){ float h = floor(floor(glb.y/100.)/100.);float m =     floor(glb.y/100.) - h*100.;float s =      glb.y  - h*10000. -m*100.;float si = s *100./60.;float mi = m*100./60.;float hi = h+mi/100.+si/10000.;float dm = 180./(db-da); vec3  gp = vec3(ps.x,ps.y,ps.z);gp = r_z(gp," + (eash.isDebug ? "time*3.0" : " dm* hi -da*dm -90. ") + ",vec3(0.));gp = r_x(gp,40. ,vec3(0.)); gp.x = gp.x*-1.; gp.z = gp.z*-1.; return gp; }"].join("\n") }, sh_main_vertex: function(e, r, s) { return ["attribute vec3 position; ", "attribute vec3 normal;   ", "attribute vec2 uv;       ", "attribute vec2 uv2;       ", "void main(void) { ", "   vec4 result; vec4  ref; result = vec4(position.x,position.y,position.z,1.0) ;", "   pos = vec3(position.x,position.y,position.z);", "   nrm = vec3(normal.x,normal.y,normal.z);", "   result = vec4(pos,1.0);", e, "   ", "   gl_Position = worldViewProjection * vec4( result );", "   pos = result.xyz;", "   _pos = vec3(world * vec4(pos, 1.0));", "   _nrm = normalize(vec3(world * vec4(nrm, 0.0)));", "   u = uv;", "   u2 = uv2;", def(eash.globalOption) ? def(eash.globalOption.hlp_Vertex, "") : "", "}"].join("\n") }, sh_main_vertex_postprocess: function(e, r, s) { return [" attribute vec2 position; ", "                                ", " void main(void) {	                            ", "     uv = position*0.5+vec2(0.5,0.5);        ", "     gl_Position = vec4(position,0., 1.0);     ", " } "].join("  ") }, sh_main_fragment: function(e, r, s) { return ["#extension GL_OES_standard_derivatives : enable", "void main(void) { ", "   vec4 result;vec4  ref; result = vec4(1.,0.,0.,0.);", "   float fw = (gl_FragCoord.x-screen.x/2.0)/(screen.x/2.0) ;", "   float fh = (gl_FragCoord.y-screen.y/2.0)/(screen.y/2.0) ;", "   float mw = (mouse.x-screen.x/2.0)/(screen.x/2.0) ;", "   float mh = (mouse.y-screen.y/2.0)/(screen.y/2.0) ;", "   ", e, "   gl_FragColor = vec4( result );", "}"].join("\n") }, shader: function(e, r) { kg = { r: 0, g: 0, b: 0 }; var s = 0, t = 0; aia = 0, eash.globalOption = def(eash.globalOption, {}), eash.globalOption.id = s, eash.globalOption.sysId = t, eash.globalOption.cands = [], eash.globalOption.vtx = def(eash.globalOption) && def(eash.globalOption.vtx) ? eash.globalOption.vtx : null, eash.globalOption.frg = def(eash.globalOption) && def(eash.globalOption.frg) ? eash.globalOption.frg : null; var a = eash.defShader(eash.shaderBase.shader({ vtx: def(eash.globalOption) && def(eash.globalOption.vtx) ? eash.globalOption.vtx : "result = vec4(pos ,1.0);", frg: e, helper: "" }), r); return a.isEashMaterial = !0, a }, pspMultiLayer: [], pspIndex: 0, linerPostProcess: function(e, r, s) { s = def(s, {}); var t = eash.postProcessBase.postProcess({ frg: e, helper: "" }); eash.ind++; var a = new BABYLON.PostProcess("name" + eash.ind, t, ["camera", "mouse", "time", "screen", "glb", "center"], ["ref1", "ref2", "ref3", "ref4", "ref5", "ref6", "ref7"], def(s.scale, 1), r, BABYLON.Texture.BILINEAR_SAMPLINGMODE); return a.onApply = function(e) { e.setFloat("time", time), e.setVector2("screen", { x: a.width, y: a.height }), e.setVector3("camera", r.position), def(s.apply) && s.apply(e) }, a } }; eash.fback = "!gl_FrontFacing", eash.ffront = "gl_FrontFacing", eash.discard = "discard", shcolor = function(e, r, s, t) { var a = { r: 0, g: 0, b: 0, a: 0 }; if (!(e >= 0) || null != s && void 0 != s || null != t && void 0 != t) return e.length >= 3 ? (a.r = 1 * e[0], a.g = 1 * e[1], a.b = 1 * e[2], a.a = 1 * def(e[3], 1), a) : (a.r = null == e || void 0 == e ? 0 : 1 * e, a.g = null == r || void 0 == r ? 0 : 1 * r, a.b = null == s || void 0 == s ? 0 : 1 * s, a.a = null == t || void 0 == t ? 0 : 1 * t, a); var n = Color(e); return (null == r || void 0 == r) && (r = 1), a.r = 1 * n.r, a.g = 1 * n.g, a.b = 1 * n.b, a.a = r, a }; var c = shcolor, cs = function(e, r, s, t) { var a = c(e, r, s, t); return { r: _cs(a.r), g: _cs(a.g), b: _cs(a.b), a: _cs(a.a) } }, cs256 = function(e, r, s, t) { var a = c(e, r, s, t); return { r: _cs(256 * a.r), g: _cs(256 * a.g), b: _cs(256 * a.b), a: _cs(a.a) } }, Color = function(e) { return 3 === arguments.length ? this.setRGB(arguments[0], arguments[1], arguments[2]) : ColorPs.set(e) }, recolor = function(e, r) { var s; return r = def(r, 1), s = def(e.r) && def(e.g) && def(e.b) ? cs(e.r, e.g, e.b, r) : cs(e, r) }; ColorPs = { constructor: Color, r: 1, g: 1, b: 1, set: function(e) { return "number" == typeof e ? this.setHex(e) : "string" == typeof e && this.setStyle(e), this }, setHex: function(e) { return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (255 & e) / 255, this }, setRGB: function(e, r, s) { return this.r = e, this.g = r, this.b = s, this }, setHSL: function(e, r, s) { if (0 === r) this.r = this.g = this.b = s; else { var t = function(e, r, s) { return 0 > s && (s += 1), s > 1 && (s -= 1), 1 / 6 > s ? e + 6 * (r - e) * s : .5 > s ? r : 2 / 3 > s ? e + 6 * (r - e) * (2 / 3 - s) : e }, a = .5 >= s ? s * (1 + r) : s + r - s * r, n = 2 * s - a; this.r = t(n, a, e + 1 / 3), this.g = t(n, a, e), this.b = t(n, a, e - 1 / 3) } return this }, setStyle: function(e) { if (/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test(e)) { var r = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec(e); return this.r = Math.min(255, parseInt(r[1], 10)) / 255, this.g = Math.min(255, parseInt(r[2], 10)) / 255, this.b = Math.min(255, parseInt(r[3], 10)) / 255, this } if (/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test(e)) { var r = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec(e); return this.r = Math.min(100, parseInt(r[1], 10)) / 100, this.g = Math.min(100, parseInt(r[2], 10)) / 100, this.b = Math.min(100, parseInt(r[3], 10)) / 100, this } if (/^\#([0-9a-f]{6})$/i.test(e)) { var r = /^\#([0-9a-f]{6})$/i.exec(e); return this.setHex(parseInt(r[1], 16)), this } if (/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(e)) { var r = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(e); return this.setHex(parseInt(r[1] + r[1] + r[2] + r[2] + r[3] + r[3], 16)), this } }, copy: function(e) { return this.r = e.r, this.g = e.g, this.b = e.b, this }, copyGammaToLinear: function(e) { return this.r = e.r * e.r, this.g = e.g * e.g, this.b = e.b * e.b, this }, copyLinearToGamma: function(e) { return this.r = Math.sqrt(e.r), this.g = Math.sqrt(e.g), this.b = Math.sqrt(e.b), this }, convertGammaToLinear: function() { var e = this.r, r = this.g, s = this.b; return this.r = e * e, this.g = r * r, this.b = s * s, this }, convertLinearToGamma: function() { return this.r = Math.sqrt(this.r), this.g = Math.sqrt(this.g), this.b = Math.sqrt(this.b), this }, getHex: function() { return 255 * this.r << 16 ^ 255 * this.g << 8 ^ 255 * this.b << 0 }, getHexString: function() { return ("000000" + this.getHex().toString(16)).slice(-6) }, getHSL: function(e) { var r, s, t = e || { h: 0, s: 0, l: 0 }, a = this.r, n = this.g, i = this.b, c = Math.max(a, n, i), o = Math.min(a, n, i), l = (o + c) / 2; if (o === c) r = 0, s = 0; else { var f = c - o; switch (s = .5 >= l ? f / (c + o) : f / (2 - c - o), c) { case a: r = (n - i) / f + (i > n ? 6 : 0); break; case n: r = (i - a) / f + 2; break; case i: r = (a - n) / f + 4 }r /= 6 } return t.h = r, t.s = s, t.l = l, t }, getStyle: function() { return "rgb(" + (255 * this.r | 0) + "," + (255 * this.g | 0) + "," + (255 * this.b | 0) + ")" }, offsetHSL: function(e, r, s) { var t = this.getHSL(); return t.h += e, t.s += r, t.l += s, this.setHSL(t.h, t.s, t.l), this }, add: function(e) { return this.r += e.r, this.g += e.g, this.b += e.b, this }, addColors: function(e, r) { return this.r = e.r + r.r, this.g = e.g + r.g, this.b = e.b + r.b, this }, addScalar: function(e) { return this.r += e, this.g += e, this.b += e, this }, multiply: function(e) { return this.r *= e.r, this.g *= e.g, this.b *= e.b, this }, multiplyScalar: function(e) { return this.r *= e, this.g *= e, this.b *= e, this }, lerp: function(e, r) { return this.r += (e.r - this.r) * r, this.g += (e.g - this.g) * r, this.b += (e.b - this.b) * r, this }, equals: function(e) { return e.r === this.r && e.g === this.g && e.b === this.b }, fromArray: function(e) { return this.r = e[0], this.g = e[1], this.b = e[2], this }, toArray: function() { return [this.r, this.g, this.b] } }, eash.solid = function(e, r) { e = def(e, 0), r = def(r, 1); var s = recolor(e); return s.a = r, " result = vec4(" + _cs(s.r) + ", " + _cs(s.g) + ", " + _cs(s.b) + ", " + _cs(s.a) + ");" }, eash.light = function(e) { e = def(e, {}), e.color = def(e.color, 16777215); var r = recolor(e.color); def(e.dark, !1) && (r.r = 1 - r.r, r.g = 1 - r.g, r.b = 1 - r.b, e.c = -1 * def(e.c, .5)); var s = eash.ind++; return ["  vec3 dir_" + s + "_ =normalize(" + def(e.pos, "_pos") + "- " + def(e.dir, "camera") + ");", "  dir_" + s + "_ =r_x(dir_" + s + "_ ," + _cs(def(e.rx, 0)) + ",vec3(0.0));", "  dir_" + s + "_ =r_y(dir_" + s + "_ ," + _cs(def(e.ry, 0)) + ",vec3(0.0));", "  dir_" + s + "_ =r_z(dir_" + s + "_ ," + _cs(def(e.rz, 0)) + ",vec3(0.0));", "  vec4 p1_" + s + "_ = vec4(" + def(e.dir, "camera") + ",.0);                                ", "  vec4 c1_" + s + "_ = vec4(" + _cs(r.r) + "," + _cs(r.g) + "," + _cs(r.b) + ",0.0);                                ", "                                                                ", "  vec3 vnrm_" + s + "_ = normalize(vec3(world * vec4(" + def(e.nrm, "nrm") + ", 0.0)));          ", "  vec3 l_" + s + "_= normalize(p1_" + s + "_.xyz- " + def(e.pos, "_pos") + ");                             ", "  vec3 vw_" + s + "_= normalize(camera- " + def(e.pos, "_pos") + ");                             ", "  vec3 aw_" + s + "_= normalize(vw_" + s + "_+ l_" + s + "_);                                    ", "  float sc_" + s + "_= max(0., dot(vnrm_" + s + "_, aw_" + s + "_));                             ", "  sc_" + s + "_= pow(sc_" + s + "_, " + _cs(def(e.s_p, 222)) + ")/" + _cs(def(e.s_n, .3)) + " ;                                       ", "  float ndl_" + s + "_ = max(0., dot(vnrm_" + s + "_, l_" + s + "_));                            ", "  float ls_" + s + "_ = " + (def(e.f, !1) ? "" : "1.0-") + "max(0.0,min(1.0, sc_" + s + "_*" + _cs(def(e.s, .5)) + "  +ndl_" + s + "_*" + _cs(def(e.p, .5)) + ")) ;         ", "  result  += vec4( c1_" + s + "_.xyz*(1.0-ls_" + s + "_)*" + _cs(def(e.c, 1)) + "  ,1.0-ls_" + s + "_);                    "].join("\n") }, eash.flash = function(e) { var r = eash.ind++; return e = def(e, {}), ["  vec4 _nc_" + r + "_ = vec4(floor(abs(sin(pos.x+pos.y+pos.z+time*0.8)*2.)-0.1)); ", " result = result + _nc_" + r + "_*0.12 ;"].join("\n") }, eash.phonge = function(e, r, s, t) { return t = def(t, sundir), r = def(r, 16777198), e = def(e, 2), s = def(s, 1118464), eash.light({ dir: t, effect: "pr/" + _cs(e), color: r }) + eash.light({ dir: nat(t), effect: "pr/" + _cs(e), color: s }) }, eash.spec = function(e, r, s, t) { return t = def(t, sundir), s = def(s, 16777198), r = def(r, 10), e = def(e, 90), eash.light({ dir: avg(t, avg(camera, "nrm")), effect: intensive(e, r), color: s }) }, eash.multi = function(e, r) { for (var s = eash.ind++, t = "", a = ["", "", "", ""], n = 0, i = 0; i < e.length; i++)def(e[i].r) || (e[i] = { r: e[i], e: 1 }), t += " vec4 result_" + s + "_" + i + ";result_" + s + "_" + i + " = vec4(0.,0.,0.,0.); float rp_" + s + "_" + i + " = " + _cs(e[i].e) + "; \n", t += e[i].r + "\n", t += " result_" + s + "_" + i + " = result; \n", a[0] += (0 == i ? "" : " + ") + "result_" + s + "_" + i + ".x*rp_" + s + "_" + i, a[1] += (0 == i ? "" : " + ") + "result_" + s + "_" + i + ".y*rp_" + s + "_" + i, a[2] += (0 == i ? "" : " + ") + "result_" + s + "_" + i + ".z*rp_" + s + "_" + i, a[3] += (0 == i ? "" : " + ") + "result_" + s + "_" + i + ".w*rp_" + s + "_" + i, n += e[i].e; return 1 == def(r, 0) && (a[0] = "(" + a[0] + ")/" + _cs(n), a[1] = "(" + a[1] + ")/" + _cs(n), a[2] = "(" + a[2] + ")/" + _cs(n), a[3] = "(" + a[3] + ")/" + _cs(n)), t += "result = vec4(" + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ");" }, eash.alpha = function() { return eash.globalOption = def(eash.globalOption, {}), eash.globalOption.alpha = !0, "" }, eash.back = function(e) { return eash.globalOption = def(eash.globalOption, {}), eash.globalOption.back = !0, "if(" + eash.fback + "){" + def(e, "discard") + ";}" }, eash.front = function(e) { return eash.globalOption = def(eash.globalOption, {}), eash.globalOption.back = !0, "if(" + eash.ffront + "){" + def(e, "discard") + ";}" }, eash.wire = function(e) { return eash.globalOption = def(eash.globalOption, {}), eash.globalOption.wire = !0, "" }, eash.range = function(e) { var r = eash.ind++; return e = def(e, {}), e.pos = def(e.pos, "_pos"), e.point = def(e.point, "camera"), e.start = def(e.start, 50.1), e.end = def(e.end, 75.1), e.mat1 = def(e.mat1, "result = vec4(1.0,0.,0.,1.);"), e.mat2 = def(e.mat2, "result = vec4(0.0,0.,1.,1.);"), ["float s_r_dim_" + r + "_ = " + (def(e.dir) ? e.dir : " dim(" + e.pos + "," + e.point + ")") + ";", "if(s_r_dim_" + r + "_ > " + _cs(e.end) + "){", e.mat2, "}", "else { ", e.mat1, "   vec4 mat1_" + r + "_; mat1_" + r + "_  = result;", "   if(s_r_dim_" + r + "_ > " + _cs(e.start) + "){ ", e.mat2, "       vec4 mati2_" + r + "_;mati2_" + r + "_ = result;", "       float s_r_cp_" + r + "_  = (s_r_dim_" + r + "_ - (" + _cs(e.start) + "))/(" + _cs(e.end) + "-" + _cs(e.start) + ");", "       float s_r_c_" + r + "_  = 1.0 - s_r_cp_" + r + "_;", "       result = vec4(mat1_" + r + "_.x*s_r_c_" + r + "_+mati2_" + r + "_.x*s_r_cp_" + r + "_,mat1_" + r + "_.y*s_r_c_" + r + "_+mati2_" + r + "_.y*s_r_cp_" + r + "_,mat1_" + r + "_.z*s_r_c_" + r + "_+mati2_" + r + "_.z*s_r_cp_" + r + "_,mat1_" + r + "_.w*s_r_c_" + r + "_+mati2_" + r + "_.w*s_r_cp_" + r + "_);", "   }", "   else { result = mat1_" + r + "_; }", "}"].join("\n") }, eash.fresnel = function(e) { return e = def(e, {}), eash.light({ f: !0, dark: def(e.dark, !0), color: def(e.color, 0), c: def(e.c, .3), nrm: def(e.nrm, "nrm"), p: def(e.p, 1.7) }) }, eash.map = function(e) { e = def(e, {}); var r = eash.ind++; e.uv = def(e.uv, "u"), e.na = def(e.na, 1), e.n1 = def(e.n1, e.na), e.n2 = def(e.n2, e.na), e.t1 = def(e.t1, 1), e.t2 = def(e.t2, 1), e.rx = def(e.rx, 0), e.ry = def(e.ry, 0), e.rz = def(e.rz, 0), e.n = def(e.n, 0), e.p1 = def(e.p1, "y"), e.p2 = def(e.p2, "z"), e.p3 = def(e.p3, "x"), e.ignore = def(e.ignore, "vec4(0.0,0.,0.,1.0);"), e.ref = "", eash.TextureReferences = def(eash.TextureReferences, {}), def(e.ref1) && (eash.TextureReferences.ref1 = e.ref1, e.ref = "ref1"), def(e.ref2) && (eash.TextureReferences.ref2 = e.ref2, e.ref = "ref2"), def(e.ref3) && (eash.TextureReferences.ref3 = e.ref3, e.ref = "ref3"), def(e.ref4) && (eash.TextureReferences.ref4 = e.ref4, e.ref = "ref4"), def(e.ref5) && (eash.TextureReferences.ref5 = e.ref5, e.ref = "ref5"), def(e.ref6) && (eash.TextureReferences.ref6 = e.ref6, e.ref = "ref6"), def(e.ref7) && (eash.TextureReferences.ref7 = e.ref7, e.ref = "ref7"), def(e.ref8) && (eash.TextureReferences.ref8 = e.ref8, e.ref = "ref8"), e.uv_ind = def(e.uv_ind, -1), e.uv_count = def(e.uv_count, 3); var s = "uv" == e.uv ? "uv" : "u", t = "face" == e.uv ? ["vec3 centeri_" + r + "_ = vec3(0.);", "vec3 ppo_" + r + "_ = r_z( pos," + _cs(e.rz) + ",centeri_" + r + "_);  ", " ppo_" + r + "_ = r_y( ppo_" + r + "_," + _cs(e.ry) + ",centeri_" + r + "_);  ", " ppo_" + r + "_ = r_x( ppo_" + r + "_," + _cs(e.rx) + ",centeri_" + r + "_);  ", "vec3 nrm_" + r + "_ = r_z( " + def(e.nrm, "_nrm") + "," + _cs(e.rz) + ",centeri_" + r + "_);  ", " nrm_" + r + "_ = r_y( nrm_" + r + "_," + _cs(e.ry) + ",centeri_" + r + "_);  ", " nrm_" + r + "_ = r_x( nrm_" + r + "_," + _cs(e.rx) + ",centeri_" + r + "_);  ", "vec4 color_" + r + "_ = texture2D(" + e.ref + ", vec2((ppo_" + r + "_." + e.p1 + "/" + _cs(e.n1) + ")+" + _cs(e.t1) + ",(ppo_" + r + "_." + e.p2 + "/" + _cs(e.n2) + ")+" + _cs(e.t2) + "));  ", def(e.befor) ? " color_" + r + "_ =" + e.effect.befor("pr", "rc_" + r + "_") + ";" : "", def(e.effect) ? " color_" + r + "_.x=" + e.effect.replaceAll("pr", "color_" + r + "_.x") + ";" : "", def(e.effect) ? " color_" + r + "_.y=" + e.effect.replaceAll("pr", "color_" + r + "_.y") + ";" : "", def(e.effect) ? " color_" + r + "_.z=" + e.effect.replaceAll("pr", "color_" + r + "_.z") + ";" : "", "if(nrm_" + r + "_." + e.p3 + "  <  " + _cs(e.n) + "  )                                                    ", "    color_" + r + "_ = " + e.ignore + ";                                              ", " result = color_" + r + "_; "].join("\n") : ["vec3 centeri_" + r + "_ = vec3(0.);", "vec3 ppo_" + r + "_ = r_z( vec3(" + s + ".x ," + s + ".y ,0.0)," + _cs(e.rz) + ",centeri_" + r + "_);  ", " ppo_" + r + "_ = r_y( ppo_" + r + "_," + _cs(e.ry) + ",centeri_" + r + "_);  ", " ppo_" + r + "_ = r_x( ppo_" + r + "_," + _cs(e.rx) + ",centeri_" + r + "_);  ", "vec4 color_" + r + "_ = texture2D(" + e.ref + ", vec2((ppo_" + r + "_." + e.p3 + "/" + _cs(e.n1) + ")+" + _cs(e.t1) + ",(ppo_" + r + "_." + e.p1 + "/" + _cs(e.n2) + ")+" + _cs(e.t2) + "));  ", def(e.effect) ? " color_" + r + "_.x=" + e.effect.replaceAll("pr", "color_" + r + "_.x") + ";" : "", def(e.effect) ? " color_" + r + "_.y=" + e.effect.replaceAll("pr", "color_" + r + "_.y") + ";" : "", def(e.effect) ? " color_" + r + "_.z=" + e.effect.replaceAll("pr", "color_" + r + "_.z") + ";" : "", " result = color_" + r + "_; "].join("\n"); return t }, eash.noise = function(e) { e = def(e, {}); var r = eash.ind++; return e.pos = def(e.pos, "pos"), ["float i5_" + r + "_  =   noise(" + e.pos + ") ;", def(e.effect) ? "  i5_" + r + "_  =  " + e.effect.replaceAll("pr", "float i5_" + r + "_") + "  ;" : "", "result = vec4(i5_" + r + "_);"].join("\n") }, eash.effect = function(e) { e = def(e, {}); var r = eash.ind++; return ["vec4 res_" + r + "_ = vec4(0.);", "res_" + r + "_.x = " + (def(e.px) ? e.px.replaceAll("px", "result.x").replaceAll("py", "result.y").replaceAll("pz", "result.z").replaceAll("pw", "result.w") + ";" : " result.x;"), "res_" + r + "_.y = " + (def(e.py) ? e.py.replaceAll("px", "result.x").replaceAll("py", "result.y").replaceAll("pz", "result.z").replaceAll("pw", "result.w") + ";" : " result.y;"), "res_" + r + "_.z = " + (def(e.pz) ? e.pz.replaceAll("px", "result.x").replaceAll("py", "result.y").replaceAll("pz", "result.z").replaceAll("pw", "result.w") + ";" : " result.z;"), "res_" + r + "_.w = " + (def(e.pw) ? e.pw.replaceAll("px", "result.x").replaceAll("py", "result.y").replaceAll("pz", "result.z").replaceAll("pw", "result.w") + ";" : " result.w;"), "res_" + r + "_  = " + (def(e.pr) ? " vec4(" + e.pr.replaceAll("pr", "res_" + r + "_.x") + "," + e.pr.replaceAll("pr", "res_" + r + "_.y") + "," + e.pr.replaceAll("pr", "res_" + r + "_.z") + "," + e.pr.replaceAll("pr", "res_" + r + "_.w") + ");" : " res_" + r + "_*1.0;"), "result = res_" + r + "_ ;"].join("\n") }, eash.reference = function(e, r) { if (e = def(e, "ref"), r = def(r, ""), "ref" != e) { eash.ind++; return "vec4 res_" + e + "_ = result; " + r + " ref = result; result = res_" + e + "_; " } return r + " ref = result; " }, eash.replace = function(e) { var r = eash.ind++; e = def(e, {}), e.type = def(e.type, red), e.mat = def(e.mat, eash.solid(16711935)), e.area = def(e.area, -.233), e.opacity = def(e.opacity, 0), e.level = def(e.level, 0), e.levelCount = def(e.levelCount, 1), e.levelFill = def(e.levelFill, !1), e.live = def(e.live, !1), e.live && eash.reference(); var s = e.area, t = e.opacity, a = e.level, n = e.levelCount, i = e.levelFill, c = " > 0.5 + " + _cs(s) + " ", o = " < 0.5 - " + _cs(s) + " ", l = "((ref.x*" + _cs(n) + "-" + _cs(a) + ")>1.0 ? 0. : max(0.,(ref.x*" + _cs(n) + "-" + _cs(a) + ")))", f = "((ref.y*" + _cs(n) + "-" + _cs(a) + ")>1.0 ? 0. : max(0.,(ref.y*" + _cs(n) + "-" + _cs(a) + ")))", _ = "((ref.z*" + _cs(n) + "-" + _cs(a) + ")>1.0 ? 0. : max(0.,(ref.z*" + _cs(n) + "-" + _cs(a) + ")))"; i && (l = "min(1.0, max(0.,(ref.x*" + _cs(n) + "-" + _cs(a) + ")))", f = "min(1.0, max(0.,(ref.y*" + _cs(n) + "-" + _cs(a) + ")))", _ = "min(1.0, max(0.,(ref.z*" + _cs(n) + "-" + _cs(a) + ")))"); var u = " && ", d = " + ", h = "", p = ""; switch (e.type) { case white: p = l + c + u + f + c + u + _ + c, h = "(" + l + d + f + d + _ + ")/3.0"; break; case cyan: p = l + o + u + f + c + u + _ + c, h = "(" + f + d + _ + ")/2.0 - (" + l + ")/1.0"; break; case pink: p = l + c + u + f + o + u + _ + c, h = "(" + l + d + _ + ")/2.0 - (" + f + ")/1.0"; break; case yellow: p = l + c + u + f + c + u + _ + o, h = "(" + l + d + f + ")/2.0 - (" + _ + ")/1.0"; break; case blue: p = l + o + u + f + o + u + _ + c, h = "(" + _ + ")/1.0 - (" + l + d + f + ")/2.0"; break; case red: p = l + c + u + f + o + u + _ + o, h = "(" + l + ")/1.0 - (" + f + d + _ + ")/2.0"; break; case green: p = l + o + u + f + c + u + _ + o, h = "(" + f + ")/1.0 - (" + l + d + _ + ")/2.0"; break; case black: p = l + o + u + f + o + u + _ + o, h = "1.0-(" + l + d + f + d + _ + ")/3.0" }return " if( " + p + " ) { vec4 oldrs_" + r + "_ = vec4(result);float al_" + r + "_ = max(0.0,min(1.0," + h + "+(" + _cs(t) + "))); float  l_" + r + "_ =  1.0-al_" + r + "_;  " + e.mat + " result = result*al_" + r + "_ +  oldrs_" + r + "_ * l_" + r + "_;    }" }, eash.vertex = function(e) { return eash.globalOption = def(eash.globalOption, {}), eash.globalOption.vtx = e, "" }, eash.cameraShot = function(e) { return e = def(e, {}), "result = vec4(texture2D(textureSampler, " + def(e.uv, "uv") + ").xyz,1.0) ;" }, eash.cameraLayer = function(e, r) { return r = def(r, {}), "result = vec4(texture2D(ref" + e + ", " + def(r.uv, "uv") + ").xyz,1.0) ;" }, eash.filters = { glassWave: function(e) { return e = def(e, {}), e.radius = def(e.radius, .5), e.dispersion = def(e.dispersion, .005), e.r = def(e.r, e.radius), e.d = def(e.d, e.dispersion), "uv+vec2(cos(gl_FragCoord.x*" + _cs(e.r) + "  )+sin(gl_FragCoord.y*" + _cs(e.r) + "  ),cos(gl_FragCoord.y*" + _cs(e.r) + " )+sin(gl_FragCoord.x*" + _cs(e.r) + "))*" + _cs(e.d) } }, eash.pointedBlur = function(e) { e = def(e, {}), e.l = def(e.l, .55), e.dir1 = def(e.dir1, "vec2(-" + _cs(e.l) + ",-" + _cs(e.l) + ")"), e.dir2 = def(e.dir2, "vec2(" + _cs(e.l) + "," + _cs(e.l) + ")"), e.dir3 = def(e.dir3, "vec2(" + _cs(e.l) + ",-" + _cs(e.l) + ")"), e.dir4 = def(e.dir4, "vec2(-" + _cs(e.l) + "," + _cs(e.l) + ")"), e.r = def(e.r, 4.5), e.d = def(e.d, .001), e.mapInd = def(e.mapInd, 0), e.dir = def(e.dir, { x: 1, y: 0 }); var r = function(r) { return 0 == e.mapInd ? eash.cameraShot({ uv: r.uv }) : eash.cameraLayer(e.mapInd, { uv: r.uv }) }; return eash.multi([r({ uv: eash.filters.glassWave(e) }), r({ uv: eash.filters.glassWave(e) + "+ 0.005*" + e.dir1 }), r({ uv: eash.filters.glassWave(e) + "+ 0.01 *" + e.dir1 }), r({ uv: eash.filters.glassWave(e) + "+ 0.015*" + e.dir1 }), r({ uv: eash.filters.glassWave(e) + "+ 0.02 *" + e.dir1 }), r({ uv: eash.filters.glassWave(e) + "+ 0.025*" + e.dir1 }), r({ uv: eash.filters.glassWave(e) + "+ 0.005*" + e.dir2 }), r({ uv: eash.filters.glassWave(e) + "+ 0.01 *" + e.dir2 }), r({ uv: eash.filters.glassWave(e) + "+ 0.015*" + e.dir2 }), r({ uv: eash.filters.glassWave(e) + "+ 0.02 *" + e.dir2 }), r({ uv: eash.filters.glassWave(e) + "+ 0.025*" + e.dir2 }), r({ uv: eash.filters.glassWave(e) + "+ 0.005*" + e.dir3 }), r({ uv: eash.filters.glassWave(e) + "+ 0.01 *" + e.dir3 }), r({ uv: eash.filters.glassWave(e) + "+ 0.015*" + e.dir3 }), r({ uv: eash.filters.glassWave(e) + "+ 0.02 *" + e.dir3 }), r({ uv: eash.filters.glassWave(e) + "+ 0.025*" + e.dir3 }), r({ uv: eash.filters.glassWave(e) + "+ 0.005*" + e.dir4 }), r({ uv: eash.filters.glassWave(e) + "+ 0.01 *" + e.dir4 }), r({ uv: eash.filters.glassWave(e) + "+ 0.015*" + e.dir4 }), r({ uv: eash.filters.glassWave(e) + "+ 0.02 *" + e.dir4 }), r({ uv: eash.filters.glassWave(e) + "+ 0.025*" + e.dir4 })], !0) }, eash.glowingEdges = function(e) { e = def(e, {}), e.mapInd = def(e.mapInd, 0), e.dir = def(e.dir, { x: 1, y: 0 }); var r = function(r) { return 0 == e.mapInd ? eash.cameraShot({ uv: r.uv }) : eash.cameraLayer(e.mapInd, { uv: r.uv }) }; return r({ uv: "uv+ vec2(1.,0.)*0.0015  " }) + "vec4 rs1 = result;" + r({ uv: "uv+ vec2(1.,1.)*0.0015  " }) + "vec4 rs2 = result;" + r({ uv: "uv+ vec2(1.,0.)*0.0015  " }) + "vec4 rs3 = result;" + r({ uv: "uv+ vec2(-1.,-1.)*0.0015  " }) + "vec4 rs4 = result;" + r({ uv: "uv+ vec2(-1.,0.)*0.0015  " }) + "vec4 rs5 = result;" + r({ uv: "uv+ vec2(0.,-1.)*0.0015  " }) + "vec4 rs6 = result;" + eash.multi([" result = vec4(vec3(pow(length(rs1.xyz-rs2.xyz),1.)),1.0) ;", " result = vec4(vec3(pow(length(rs2.xyz-rs3.xyz),1.)),1.0) ;", " result = vec4(vec3(pow(length(rs3.xyz-rs4.xyz),1.)),1.0) ;", " result = vec4(vec3(pow(length(rs3.xyz-rs4.xyz),1.)),1.0) ;", " result = vec4(vec3(pow(length(rs4.xyz-rs5.xyz),1.)),1.0) ;", " result = vec4(vec3(pow(length(rs5.xyz-rs6.xyz),1.)),1.0) ;", " result = vec4(vec3(pow(length(rs6.xyz-rs1.xyz),1.)),1.0) ;"], !0) + "vec4 rs7 = result; float s = max(0.,min(1.,pow(length(rs7.xyz),0.8)/0.5));" + r({ uv: "uv" }) + eash.effect({ pr: "pow(pr,2.0)/0.5" }) + " result = vec4(result.xyz*( s),1.0);" }, eash.ppsMap = function(e, r) { return 0 == e ? eash.cameraShot(r) : eash.cameraLayer(e, r) }, eash.directionBlur = function(e) { e = def(e, {}), e.mapInd = def(e.mapInd, 0), e.dir = def(e.dir, { x: 1, y: 0 }); var r = function(r) { return 0 == e.mapInd ? eash.cameraShot({ uv: r }) : eash.cameraLayer(e.mapInd, { uv: r }) }; e.percent = def(e.percent, 10), e.h1 = def(e.h1, 1), e.h2 = def(e.h2, 3); for (var s = [], t = 1, a = e.h1 * e.percent / 1e4; a < e.percent / 100; a += e.h2 * e.percent / 1e4) { t -= .1, t = Math.max(0, t); var n = Math.pow(a, .9) / 1.33; s.push({ r: def(e.custom) ? e.custom("vec2(" + _cs(e.dir.x) + "," + _cs(e.dir.y) + ")*" + _cs(n), n, t) : r(" uv  +vec2(" + _cs(e.dir.x) + "," + _cs(e.dir.y) + ")*" + _cs(n)), e: t }), s.push({ r: def(e.custom) ? e.custom("-1.*vec2(" + _cs(e.dir.x) + "," + _cs(e.dir.y) + ")*" + _cs(n), n, t) : r(" uv  -vec2(" + _cs(e.dir.x) + "," + _cs(e.dir.y) + ")*" + _cs(n)), e: t }) } return eash.multi(s, !0) };