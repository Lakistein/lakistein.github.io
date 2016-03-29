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
        this.groundMesh = scene.getMeshByName("groundPlane");
        this.reflectionTexture = new BABYLON.CubeTexture(json.skyboxURL + "reflections/skybox", scene);
        this.skyboxTexture = new BABYLON.CubeTexture(json.skyboxURL + "cubemap/skybox", scene);
        this.groundShadow = scene.getMeshByName("GROUNDPLANE_STYLE_1");
        this.backgroundMesh = scene.getMeshByName("background");
        this.reflectiveMesh = scene.getMeshByName("reflectionPlane");
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
            this.lights[i].excludedMeshes.push(this.backgroundMesh);
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
        var json = '"lights": [';
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
        this.loadEnvironment(scene, jsonEnv);
    }
    EnvironmentManager.prototype.loadEnvironment = function (scene, jsonEnv) {
        var _this = this;
        BABYLON.SceneLoader.ImportMesh("", "./", "ENVIRONMENT.babylon", scene, function (environment) {
            var hemilight = new BABYLON.HemisphericLight("hemilight", new BABYLON.Vector3(0, 1, 0), scene);
            hemilight.range = 0.1;
            hemilight.intensity = 0.7;
            for (var i = 0; i < environment.length; i++) {
                switch (environment[i].name) {
                    case "background":
                        var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
                        gradientMaterial.topColor = BABYLON.Color3.Red();
                        gradientMaterial.bottomColor = BABYLON.Color3.Blue();
                        environment[i].position.y = -0.1;
                        environment[i].material = gradientMaterial;
                        environment[i].isPickable = false;
                        hemilight.includedOnlyMeshes.push(environment[i]);
                        break;
                    case "groundPlane":
                        var groundPlaneMaterial = new BABYLON.PBRMaterial("groundPlaneMaterial", scene);
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
                        environment[i].material = groundPlaneMaterial;
                        environment[i].isPickable = false;
                        break;
                    case "reflectionPlane":
                        var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene);
                        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, false);
                        mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                        mirrorMaterial.alpha = 0.1;
                        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.reflectionTexture.level = 1;
                        environment[i].material = mirrorMaterial;
                        environment[i].scaling = new BABYLON.Vector3(1010, 1010, 1010);
                        environment[i].isPickable = false;
                        break;
                }
            }
            var refl = scene.getMeshByName("reflectionPlane").material.reflectionTexture;
            for (var i = 0; i < environment.length; i++) {
                if (environment[i].name != "reflectionPlane")
                    refl.renderList.push(environment[i]);
            }
            for (var i = 0; i < jsonEnv.length; i++) {
                _this.environments.push(new Environment(jsonEnv[i], scene));
            }
            var skybox = BABYLON.Mesh.CreateBox("skybox", 1000.0, scene);
            var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("", scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            skybox.infiniteDistance = true;
            skybox.material = skyboxMaterial;
            skybox.isPickable = false;
            _this.setEnvironment(_this.environments[2].id, scene);
            refl.renderList.push(scene.getMeshByName("skybox"));
        });
    };
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
        this.setSkybox(scene.getMeshByName("skybox"));
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
    EnvironmentManager.prototype.setSkybox = function (skybox) {
        skybox.material.reflectionTexture = this.environments[this.currentEnvironment].skyboxTexture;
        skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    };
    EnvironmentManager.prototype.setReflection = function (scene, color) {
        for (var i = 0; i < modelMeshes.length; i++) {
            if (this.environments[this.currentEnvironment].reflectionTexture && modelMeshes[i].material) {
                modelMeshes[i].material.reflectionTexture = this.environments[this.currentEnvironment].reflectionTexture;
            }
            else if (modelMeshes[i].material) {
                modelMeshes[i].material.reflectionColor = (color) ? color : this.environments[this.currentEnvironment].backgroundColor;
            }
        }
    };
    EnvironmentManager.prototype.changeTopGradient = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.material.topColor = BABYLON.Color3.FromHexString(value);
    };
    EnvironmentManager.prototype.changeBottomGradient = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.material.bottomColor = BABYLON.Color3.FromHexString(value);
    };
    EnvironmentManager.prototype.changeGradientOffset = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.material.offset = value;
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
            console.log(file.name);
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
    EnvironmentManager.prototype.turnGroundPlaneOffOn = function (value) {
        this.environments[this.currentEnvironment].groundMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.changeGroundPlaneSize = function (scale) {
        this.environments[this.currentEnvironment].groundMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    };
    EnvironmentManager.prototype.turnReflectivePlaneOffOn = function (value) {
        this.environments[this.currentEnvironment].reflectiveMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.changeReflectionAmount = function (value) {
        this.environments[this.currentEnvironment].reflectiveMesh.material.alpha = value;
    };
    return EnvironmentManager;
})();
/// <reference path="Environment.ts" />
/// <reference path="EnvironmentManager.ts" />
var EnvironmentUI = (function () {
    function EnvironmentUI(environmentManager, scene) {
        var _this = this;
        this.environmentManager = environmentManager;
        var environments = document.getElementsByClassName('environment');
        var env = this.environmentManager;
        for (var i = 0; i < environments.length; i++) {
            environments.item(i).addEventListener('click', function () {
                env.setEnvironment(this.getAttribute("id"), scene);
            });
        }
        document.getElementById("background").onchange = function (ev) {
            _this.environmentManager.turnBackgroundOnOff(ev.target.checked);
        };
        document.getElementById("shadows").onchange = function (ev) {
            _this.environmentManager.turnShadowOffOn(ev.target.checked);
        };
        document.getElementById("groundPlaneCheckbox").onchange = function (ev) {
            _this.environmentManager.turnGroundPlaneOffOn(ev.target.checked);
        };
        document.getElementById("groundPlaneSize").oninput = function (ev) {
            _this.environmentManager.changeGroundPlaneSize(parseFloat(ev.target.value));
        };
        document.getElementById("gradientTop").onchange = function (ev) {
            _this.environmentManager.changeTopGradient(ev.target.value);
        };
        document.getElementById("gradientBottom").onchange = function (ev) {
            _this.environmentManager.changeBottomGradient(ev.target.value);
        };
        document.getElementById("gradientOffset").oninput = function (ev) {
            _this.environmentManager.changeGradientOffset(parseFloat(ev.target.value));
        };
        document.getElementById("reflective").onchange = function (ev) {
            _this.environmentManager.turnReflectivePlaneOffOn(ev.target.checked);
        };
        document.getElementById("reflectionAmount").oninput = function (ev) {
            _this.environmentManager.changeReflectionAmount(parseFloat(ev.target.value));
        };
        var k = 0;
        document.getElementById("arrowIcon").addEventListener('click', function () {
            if (document.getElementById("Environment").style.height == "75%") {
                document.getElementById("Environment").style.height = "7%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
            else {
                document.getElementById("Environment").style.height = "75%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
        });
    }
    return EnvironmentUI;
})();
/// <reference path="babylon.d.ts" />
var TextCanvas = (function () {
    function TextCanvas(jsonCanv, index, scene) {
        this.enabled = true;
        this.visible = false;
        this.isPopedOut = false;
        this.scale = 1;
        this.popOut = new BABYLON.Animation("popOut", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        this.scaleUp = new BABYLON.Animation("scaleUp", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        this.popDown = new BABYLON.Animation("popDown", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        this.scaleDown = new BABYLON.Animation("scaleDown", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        if (!jsonCanv)
            return;
        this.id = jsonCanv.id;
        this.scene = scene;
        this.titleText = jsonCanv.text;
        this.width = jsonCanv.width;
        this.titleHeight = jsonCanv.height;
        this.height = jsonCanv.height + 0.04;
        this.position = new BABYLON.Vector3(jsonCanv.position.x, jsonCanv.position.y, jsonCanv.position.z);
        this.descriptionText = jsonCanv.description;
        this.titleMesh = this.createTextMesh(index, this.titleText, this.width, this.titleHeight, 2, jsonCanv.position, 'rgba(256, 0, 0, 0)', scene, 'white', this.titleHeight);
        this.titleMesh.renderingGroupId = 2;
        //this.createTexts(this.descriptionText, this.width + 0.3, this.height + 0.3, new BABYLON.Vector3(0, -this.height, 0), scene);
        this.descriptionMesh = this.createTextMesh('text-' + index, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.titleHeight - 0.02, 0), 'rgba(0, 256, 0, 0)', scene, 'white', this.height);
        this.descriptionMesh.isPickable = true;
        //this.descriptionMesh.showBoundingBox = true;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
        this.backgroundPlaneTitle = this.createMesh("", this.width, this.titleHeight, false, scene, true);
        this.backgroundPlaneTitle.material = new BABYLON.StandardMaterial("", scene);
        this.backgroundPlaneTitle.parent = this.titleMesh;
        this.backgroundPlaneTitle.material.opacityTexture = new BABYLON.Texture("./textures/title.png", scene);
        this.backgroundPlaneTitle.material.specularColor = BABYLON.Color3.Black();
        this.backgroundPlaneTitle.material.emissiveColor = BABYLON.Color3.White();
        this.backgroundPlaneDescription = this.createMesh("", this.width, this.height, false, scene, true);
        this.backgroundPlaneTitle.renderingGroupId = 1;
        this.backgroundPlaneDescription.material = new BABYLON.StandardMaterial("", scene);
        this.backgroundPlaneDescription.parent = this.descriptionMesh;
        this.backgroundPlaneDescription.material.opacityTexture = new BABYLON.Texture("./textures/body.png", scene);
        this.backgroundPlaneDescription.renderingGroupId = 1;
        this.backgroundPlaneDescription.material.specularColor = BABYLON.Color3.Black();
        this.backgroundPlaneDescription.material.emissiveColor = BABYLON.Color3.White();
        this.enabled = true;
        var vec = new BABYLON.Vector3(jsonCanv.linePosition.x, jsonCanv.linePosition.y, jsonCanv.linePosition.z);
        var points = [vec, vec, vec];
        this.line = BABYLON.Mesh.CreateLines("line" + index, points, scene, true);
        this.line.renderingGroupId = 1;
        this.line.isPickable = false;
        this.offset = jsonCanv.offset;
        this.createAncrhor(jsonCanv.anchorTextureURL, points[0], scene);
        this.setTextCanvasVisible(false);
        this.createAnimations(scene);
        // this.line.renderOutline = true;
        // this.line.outlineWidth = 10;
        // this.line.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
        // this.line.enableEdgesRendering(null, true);
        // this.line.edgesWidth = 60;
        //this.offset.push(0);
    }
    TextCanvas.prototype.updatePosition = function (pos) {
        this.position = pos;
        this.updateAnimations();
    };
    TextCanvas.prototype.updateAnimations = function () {
        var dirVec = this.anchor.position.subtract(this.position).normalize();
        var keys = [];
        keys.push({
            frame: 0,
            value: this.anchor.position
        });
        keys.push({
            frame: 7,
            value: new BABYLON.Vector3(this.position.x - dirVec.x / 15, this.position.y - dirVec.y / 15, this.position.z - dirVec.z / 15)
        });
        keys.push({
            frame: 8,
            value: new BABYLON.Vector3(this.position.x + dirVec.x / 20, this.position.y + dirVec.y / 20, this.position.z + dirVec.z / 20)
        });
        keys.push({
            frame: 9,
            value: new BABYLON.Vector3(this.position.x - dirVec.x / 25, this.position.y - dirVec.y / 25, this.position.z - dirVec.z / 25)
        });
        keys.push({
            frame: 10,
            value: new BABYLON.Vector3(this.position.x, this.position.y, this.position.z)
        });
        this.popOut.setKeys(keys);
        var keysDown = [];
        keysDown.push({
            frame: 0,
            value: this.position
        });
        keysDown.push({
            frame: 10,
            value: this.anchor.position
        });
        this.popDown.setKeys(keysDown);
    };
    TextCanvas.prototype.createAnimations = function (scene) {
        var _this = this;
        this.anchor.actionManager = new BABYLON.ActionManager(scene);
        ;
        var dirVec = this.anchor.position.subtract(this.position).normalize();
        var keysScale = [];
        keysScale.push({
            frame: 0,
            value: BABYLON.Vector3.Zero()
        });
        keysScale.push({
            frame: 10,
            value: new BABYLON.Vector3(1, 1, 1)
        });
        var keys = [];
        keys.push({
            frame: 0,
            value: this.anchor.position
        });
        keys.push({
            frame: 7,
            value: new BABYLON.Vector3(this.position.x - dirVec.x / 15, this.position.y - dirVec.y / 15, this.position.z - dirVec.z / 15)
        });
        keys.push({
            frame: 8,
            value: new BABYLON.Vector3(this.position.x + dirVec.x / 20, this.position.y + dirVec.y / 20, this.position.z + dirVec.z / 20)
        });
        keys.push({
            frame: 9,
            value: new BABYLON.Vector3(this.position.x - dirVec.x / 25, this.position.y - dirVec.y / 25, this.position.z - dirVec.z / 25)
        });
        keys.push({
            frame: 10,
            value: new BABYLON.Vector3(this.position.x, this.position.y, this.position.z)
        });
        this.popOut.setKeys(keys);
        this.scaleUp.setKeys(keysScale);
        var keysScaleDown = [];
        keysScaleDown.push({
            frame: 0,
            value: new BABYLON.Vector3(1, 1, 1)
        });
        keysScaleDown.push({
            frame: 10,
            value: BABYLON.Vector3.Zero()
        });
        var keysDown = [];
        keysDown.push({
            frame: 0,
            value: this.position
        });
        keysDown.push({
            frame: 10,
            value: this.anchor.position
        });
        this.popDown.setKeys(keysDown);
        this.scaleDown.setKeys(keysScaleDown);
        this.anchor.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function (evt) {
            if (_this.isAnimating)
                return;
            _this.titleMesh.animations = [];
            _this.isAnimating = true;
            if (_this.isPopedOut) {
                _this.titleMesh.animations.push(_this.popDown, _this.scaleDown);
            }
            else {
                _this.titleMesh.animations.push(_this.popOut, _this.scaleUp);
                _this.setTextCanvasVisible(true);
            }
            scene.beginAnimation(_this.titleMesh, 0, 10, false, 1, function () {
                _this.isPopedOut = !_this.isPopedOut;
                _this.setTextCanvasVisible(_this.isPopedOut);
                _this.isAnimating = false;
            });
        }));
    };
    TextCanvas.prototype.setTextCanvasEnabled = function (value) {
        //if (!this.isPopedOut) return;
        this.line.setEnabled(value);
        this.titleMesh.setEnabled(value);
        this.descriptionMesh.setEnabled(value);
        this.anchor.setEnabled(value);
    };
    TextCanvas.prototype.setTextCanvasVisible = function (value) {
        this.line.setEnabled(value);
        this.titleMesh.setEnabled(value);
        this.descriptionMesh.setEnabled(value);
        this.visible = value;
    };
    TextCanvas.prototype.createMesh = function (name, width, height, isPickable, scene, updatable) {
        var plane = new BABYLON.Mesh(name, scene);
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        var halfWidth = width / 2.0;
        var halfHeight = height / 2.0;
        positions.push(-halfWidth, -halfHeight, 0);
        normals.push(0, 0, -1.0);
        uvs.push(0.0, 0.0);
        positions.push(halfWidth, -halfHeight, 0);
        normals.push(0, 0, -1.0);
        uvs.push(1.0, 0.0);
        positions.push(halfWidth, halfHeight, 0);
        normals.push(0, 0, -1.0);
        uvs.push(1.0, 1.0);
        positions.push(-halfWidth, halfHeight, 0);
        normals.push(0, 0, -1.0);
        uvs.push(0.0, 1.0);
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        plane.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, updatable);
        plane.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, updatable);
        plane.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs, updatable);
        plane.setIndices(indices);
        plane.isPickable = isPickable;
        return plane;
    };
    ;
    TextCanvas.prototype.createText = function (text, backgroundColor, scene, textColor, height) {
        var dynamicTexture = new BABYLON.DynamicTexture('dynamic texture', { width: this.width * 2048, height: height * 1024 }, scene, false);
        dynamicTexture.hasAlpha = true;
        var texts = text.split("\n");
        for (var i = 0; i < Math.min(texts.length, 4); i++) {
            dynamicTexture.drawText(texts[i], 10, i * 29 + 25, '20pt Arial', textColor, backgroundColor);
        }
        return dynamicTexture;
    };
    ;
    TextCanvas.prototype.createTextMesh = function (name, text, width, height, textureWidth, position, backgroundColor, scene, textColor, textHeight) {
        var textMesh = this.createMesh(name, width, height, true, scene, true);
        textMesh.position.x = position.x;
        textMesh.position.y = position.y;
        textMesh.position.z = position.z;
        var textMaterial = new BABYLON.StandardMaterial(name + '-material', scene);
        textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        textMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        textMaterial.diffuseTexture = this.createText(text, backgroundColor, scene, textColor, textHeight);
        textMaterial.useAlphaFromDiffuseTexture = true;
        textMesh.material = textMaterial;
        return textMesh;
    };
    ;
    TextCanvas.prototype.createAncrhor = function (url, position, scene) {
        var pl = BABYLON.Mesh.CreatePlane("anch" + this.id, .1, scene);
        var mm = new BABYLON.StandardMaterial("SD" + this.id, scene);
        mm.opacityTexture = new BABYLON.Texture(url, scene);
        mm.emissiveColor = BABYLON.Color3.White();
        pl.material = mm;
        mm.diffuseColor = BABYLON.Color3.White();
        mm.specularColor = BABYLON.Color3.Black();
        pl.renderingGroupId = 2;
        pl.position = position;
        this.anchor = pl;
    };
    TextCanvas.prototype.changeanchorTesture = function (texture) {
        this.anchor.material.opacityTexture = texture;
    };
    TextCanvas.prototype.wrapText = function (context, text, x, y, maxWidth, lineHeight) {
        var words = text.split('\n');
        var line = '';
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            } //napravi ovo kako treba
        }
        context.fillText(line, x, y);
    };
    TextCanvas.prototype.updateTitleText = function (text) {
        this.titleText = text;
        // var textureContext = (<BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>this.titleMesh.material).diffuseTexture).getContext();
        // //textureContext.font = "bold 40px Calibri";
        // textureContext.save();
        // textureContext.fillStyle = "white";
        // textureContext.textAlign = "left";
        // this.wrapText(textureContext, this.descriptionText, 0, 80, this.width, 25);
        // textureContext.restore();
        // (<BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>this.descriptionMesh.material).diffuseTexture).update();
        this.titleMesh.material.diffuseTexture = this.createText(this.titleText, 'rgba(0, 0, 0, 0)', this.scene, 'white', this.titleHeight);
    };
    TextCanvas.prototype.updateDescriptionText = function (text) {
        this.descriptionText = text;
        this.descriptionMesh.material.diffuseTexture = this.createText(this.descriptionText, 'rgba(0, 0, 0, 0)', this.scene, 'white', this.height);
        // var textureContext = (<BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>this.descriptionMesh.material).diffuseTexture).getContext();
        // //(<BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>this.descriptionMesh.material).diffuseTexture).clear();
        // //textureContext.font = "bold 40px Calibri";
        // textureContext.clearRect(0, 0, this.width, this.height);
        // textureContext.save();
        // textureContext.fillStyle = "white";
        // textureContext.textAlign = "left";
        // this.wrapText(textureContext, this.descriptionText, null, 80, this.width, 25);
        // textureContext.restore();
        // (<BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>this.descriptionMesh.material).diffuseTexture).update();
    };
    TextCanvas.prototype.updateWidth = function (value) {
        this.scale = value;
        //this.titleMesh.scaling = new BABYLON.Vector3(value, value, value);
        // var oldW = this.width;
        // var oldPos = this.titleMesh.position.x;
        // this.width = value;
        // var temp = this.createTextMesh(this.id, this.titleText, this.width, this.titleHeight, 2, this.position, 'rgba(0, 256, 0, 1)', this.scene, 'black', this.titleHeight);
        // this.titleMesh.dispose();
        // this.titleMesh = temp;
        // //this.titleMesh.renderingGroupId = 2
        // this.titleMesh.position.x = oldPos + value / 2 - oldW / 2;
        // temp = this.createTextMesh(this.id, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(256, 0, 0, 1)', this.scene, 'white', this.height);
        // this.descriptionMesh.dispose();
        // this.descriptionMesh = temp;
        // this.descriptionMesh.isPickable = false;
        // this.descriptionMesh.showBoundingBox = true;
        // //this.descriptionMesh.renderingGroupId = 3;
        // this.descriptionMesh.parent = this.titleMesh;
        // this.descriptionMesh.position.y = this.descriptionMesh.position.y + this.height / 2 - this.titleHeight / 2;
        // this.width = value;
        // this.height = value / 5;
        // this.titleMesh.dispose();
        // this.descriptionMesh.dispose();
        // this.backgroundPlaneDescription.dispose();
        // this.backgroundPlaneTitle.dispose();
        // this.titleMesh = this.createTextMesh(this.id, this.titleText, this.width, this.titleHeight, 2, this.position, 'rgba(256, 0, 0, 0)', this.scene, 'white', this.titleHeight);
        // //this.titleMesh.renderingGroupId = 2;
        // //this.createTexts(this.descriptionText, this.width + 0.3, this.height + 0.3, new BABYLON.Vector3(0, -this.height, 0), scene);
        // this.descriptionMesh = this.createTextMesh('text-' + this.id, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 256, 0, 0)', this.scene, 'white', this.height);
        // this.descriptionMesh.isPickable = true;
        // //this.descriptionMesh.showBoundingBox = true;
        // //this.descriptionMesh.renderingGroupId = 3;
        // this.descriptionMesh.parent = this.titleMesh;
        // this.backgroundPlaneTitle = this.createMesh("", this.width, this.titleHeight, false, this.scene, true);
        // this.backgroundPlaneTitle.material = new BABYLON.StandardMaterial("", this.scene);
        // this.backgroundPlaneTitle.parent = this.titleMesh;
        // (<BABYLON.StandardMaterial>this.backgroundPlaneTitle.material).opacityTexture = new BABYLON.Texture("./textures/title.png", this.scene);
        // (<BABYLON.StandardMaterial>this.backgroundPlaneTitle.material).specularColor = BABYLON.Color3.Black();
        // (<BABYLON.StandardMaterial>this.backgroundPlaneTitle.material).emissiveColor = BABYLON.Color3.White();
        // this.backgroundPlaneDescription = this.createMesh("", this.width, this.height, false, this.scene, true);
        // this.backgroundPlaneTitle.renderingGroupId = 1;
        // this.backgroundPlaneDescription.material = new BABYLON.StandardMaterial("", this.scene);
        // this.backgroundPlaneDescription.parent = this.descriptionMesh;
        // (<BABYLON.StandardMaterial>this.backgroundPlaneDescription.material).opacityTexture = new BABYLON.Texture("./textures/body.png", this.scene);
        // this.backgroundPlaneDescription.renderingGroupId = 1;
        // (<BABYLON.StandardMaterial>this.backgroundPlaneDescription.material).specularColor = BABYLON.Color3.Black();
        // (<BABYLON.StandardMaterial>this.backgroundPlaneDescription.material).emissiveColor = BABYLON.Color3.White();
    };
    TextCanvas.prototype.updateHeight = function (value) {
        this.height = value;
        var temp = this.createTextMesh(this.id, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 0, 0, 0)', this.scene, 'white', this.height);
        this.descriptionMesh.dispose();
        this.descriptionMesh = temp;
        this.descriptionMesh.position.y = this.descriptionMesh.position.y + this.height / 2 - this.titleHeight / 2;
        this.descriptionMesh.isPickable = false;
        this.descriptionMesh.showBoundingBox = true;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
    };
    return TextCanvas;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="TextCanvas.ts" />
var TextCanvasManager = (function () {
    function TextCanvasManager(json, scene) {
        var _this = this;
        this.textCanvases = [];
        this.anchorTextures = [];
        this.rays = [];
        this.alterAnchorPoint = false;
        this.addingNewCanvas = false;
        this.pointss = [];
        this.arr = [];
        var jsonCanv = JSON.parse(json);
        for (var i = 1; i < 6; i++) {
            this.anchorTextures[i] = new BABYLON.Texture("./textures/anchors/Anchor_" + i + ".png", scene);
        }
        // napravi anchor points
        for (var i = 0; i < jsonCanv.length; i++) {
            this.textCanvases.push(new TextCanvas(jsonCanv[i], i.toString(), scene));
            this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(jsonCanv[i].linePosition.x, jsonCanv[i].linePosition.y, jsonCanv[i].linePosition.z)));
        }
        var ground = BABYLON.Mesh.CreatePlane("ground", 15, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
        //ground.renderingGroupId = 1;
        ground.material.alpha = 0;
        ground.isPickable = false;
        var canvas = scene.getEngine().getRenderingCanvas();
        var startingPoint;
        var currentMesh;
        var currentAnchorPoint;
        this.alterAnchorPoint = false;
        var getGroundPosition = function () {
            var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
            if (pickinfo.hit) {
                return pickinfo.pickedPoint;
            }
            return null;
        };
        var onPointerDown = function (evt) {
            event.preventDefault();
            if (evt.button !== 0) {
                return;
            }
            if (_this.addingNewCanvas) {
                var pickInfo = _this.pickWithMouse(modelMeshes, scene);
                if (!pickInfo.hit)
                    return;
                var vec = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x, pickInfo.pickedPoint.y + pickInfo.getNormal().y, pickInfo.pickedPoint.z + pickInfo.getNormal().z);
                var index = parseFloat(_this.textCanvases[_this.textCanvases.length - 1].titleMesh.name) + 1;
                var points = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x / 100, pickInfo.pickedPoint.y + pickInfo.getNormal().y / 100, pickInfo.pickedPoint.z + pickInfo.getNormal().z / 100);
                _this.textCanvases.push(new TextCanvas(JSON.parse('{"id":-1,"text":"Add Title","description":"Add Description","width":0.25,"height":0.05,"position":{"x":' + vec.x + ',"y":' + vec.y + ',"z":' + vec.z
                    + '},"linePosition": {"x":' + points.x + ',"y": ' + points.y + ',"z":' + points.z + '}, "offset": 0,"anchorTextureURL":"./textures/anchors/Anchor_3.png"}'), index.toString(), scene));
                _this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, points));
                _this.pointss.push(_this.textCanvases[index].line.getVerticesData(BABYLON.VertexBuffer.PositionKind));
                _this.arr.push(_this.textCanvases[index].titleMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
                _this.addingNewCanvas = false;
                document.getElementById("anchBtn").style.visibility = "visible";
                if (!visible)
                    document.getElementById("editCardPanel").style.visibility = 'visible';
                return;
            }
            var pickInfo = scene.pick(evt.clientX, evt.clientY);
            //debugger;
            // , (mesh) => {
            //     for (var i = 0; i < this.textCanvases.length; i++) {
            //         if (this.textCanvases[i].anchor == mesh) {
            //             this.alterAnchorPoint = true;
            //             currentAnchorPoint = i;
            //             return true;
            //         }
            //         else if (!this.textCanvases[i].enabled) continue;
            //         else if (this.textCanvases[i].titleMesh == mesh || mesh == this.textCanvases[i].descriptionMesh)
            //             return true;
            //     }
            //     //this.alterAnchorPoint = false;
            //     return false;
            // });
            if (pickInfo.hit) {
                if (currentMesh) {
                    currentMesh.showBoundingBox = false;
                    currentMesh.getChildren()[0].showBoundingBox = false;
                }
                currentMesh = null;
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    if (pickInfo.pickedMesh == _this.textCanvases[i].anchor) {
                        currentAnchorPoint = i;
                        _this.alterAnchorPoint = true;
                        break;
                    }
                    if (!_this.textCanvases[i].enabled)
                        continue;
                    if (pickInfo.pickedMesh == _this.textCanvases[i].titleMesh) {
                        _this.textCanvases[i].titleMesh.showBoundingBox = true;
                        document.getElementById("titleCanvas").focus();
                        currentMesh = pickInfo.pickedMesh == _this.textCanvases[i].titleMesh ? pickInfo.pickedMesh : pickInfo.pickedMesh.parent;
                        ground.position = new BABYLON.Vector3(_this.pointss[currentMesh.name][0], _this.pointss[currentMesh.name][1], _this.pointss[currentMesh.name][2]);
                        break;
                    }
                    else if (pickInfo.pickedMesh == _this.textCanvases[i].descriptionMesh) {
                        _this.textCanvases[i].descriptionMesh.showBoundingBox = true;
                        document.getElementById("descriptionCanvas").focus();
                        currentMesh = pickInfo.pickedMesh == _this.textCanvases[i].titleMesh ? pickInfo.pickedMesh : pickInfo.pickedMesh.parent;
                        ground.position = new BABYLON.Vector3(_this.pointss[currentMesh.name][0], _this.pointss[currentMesh.name][1], _this.pointss[currentMesh.name][2]);
                        break;
                    }
                }
                if (currentMesh) {
                    startingPoint = getGroundPosition();
                    document.getElementById("anchBtn").style.visibility = 'visible';
                    document.getElementById("editCardPanel").style.visibility = 'visible';
                    document.getElementById("titleCanvas").value = (_this.textCanvases[currentMesh.name]).titleText;
                    document.getElementById("descriptionCanvas").value = (_this.textCanvases[currentMesh.name]).descriptionText;
                }
                else {
                    document.getElementById("editCardPanel").style.visibility = 'collapse';
                }
            }
            if (startingPoint && currentMesh || _this.alterAnchorPoint) {
                setTimeout(function () {
                    scene.activeCamera.detachControl(canvas);
                }, 0);
            }
        };
        var onPointerUp = function () {
            if (startingPoint || _this.alterAnchorPoint) {
                scene.activeCamera.attachControl(canvas, true);
                startingPoint = null;
                //currentAnchorPoint = null;
                _this.alterAnchorPoint = false;
                return;
            }
        };
        var onPointerMove = function (evt) {
            if (_this.alterAnchorPoint) {
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (modelMeshes[i] == mesh) {
                            return true;
                        }
                    }
                    return false;
                });
                if (pickInfo.hit) {
                    var newVec = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x / 100, pickInfo.pickedPoint.y + pickInfo.getNormal().y / 100, pickInfo.pickedPoint.z + pickInfo.getNormal().z / 100);
                    _this.pointss[currentAnchorPoint][0] = newVec.x;
                    _this.pointss[currentAnchorPoint][1] = newVec.y;
                    _this.pointss[currentAnchorPoint][2] = newVec.z;
                    _this.textCanvases[currentAnchorPoint].line.updateVerticesData(BABYLON.VertexBuffer.PositionKind, _this.pointss[currentAnchorPoint]);
                    _this.textCanvases[currentAnchorPoint].anchor.position = newVec;
                    return;
                }
            }
            if (!startingPoint) {
                return;
            }
            var current = getGroundPosition();
            if (!current) {
                return;
            }
            currentMesh.position = current;
            _this.textCanvases[currentMesh.name].updatePosition(current);
            startingPoint = current;
        };
        canvas.addEventListener("pointerdown", onPointerDown, false);
        canvas.addEventListener("pointerup", onPointerUp, false);
        canvas.addEventListener("pointermove", onPointerMove, false);
        scene.onDispose = function () {
            canvas.removeEventListener("pointerdown", onPointerDown);
            canvas.removeEventListener("pointerup", onPointerUp);
            canvas.removeEventListener("pointermove", onPointerMove);
        };
        for (var i = 0; i < this.textCanvases.length; i++) {
            this.pointss.push(this.textCanvases[i].line.getVerticesData(BABYLON.VertexBuffer.PositionKind));
            this.arr.push(this.textCanvases[i].titleMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
        }
        var visible = false;
        var t = document.getElementById("TextCanvasEditorTop");
        t.style.cursor = 'pointer';
        t.onclick = function (ev) {
            visible = !visible;
            document.getElementById("anchBtn").style.visibility = visible ? "collapse" : "visible";
            if (!visible)
                document.getElementById("editCardPanel").style.visibility = 'collapse';
        };
        var visible = false;
        var b = document.getElementById("anchBtn");
        b.style.cursor = 'pointer';
        b.onclick = function (ev) {
            _this.addingNewCanvas = true;
        };
        document.getElementById("titleCanvas").oninput = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateTitleText(ev.target.value);
        };
        document.getElementById("descriptionCanvas").oninput = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateDescriptionText(ev.target.value);
        };
        var textCanvases = this.textCanvases;
        var textures = this.anchorTextures;
        var anchorsHtml = document.getElementsByClassName('anchor');
        for (var i = 0; i < anchorsHtml.length; i++) {
            anchorsHtml.item(i).addEventListener('click', function () {
                textCanvases[currentMesh ? currentMesh.name : currentAnchorPoint].changeanchorTesture(textures[this.getAttribute("id")[1]]);
            });
        }
        var rad = document.getElementsByName("size");
        var prev = null;
        for (var i = 0; i < rad.length; i++) {
            switch (rad[i].id) {
                case "small":
                    rad[i].onclick = function (ev) {
                        _this.textCanvases[currentMesh.name].updateWidth(1);
                    };
                    break;
                case "medium":
                    rad[i].onclick = function () {
                        _this.textCanvases[currentMesh.name].updateWidth(1.5);
                    };
                    break;
                case "large":
                    rad[i].onclick = function () {
                        _this.textCanvases[currentMesh.name].updateWidth(2);
                    };
                    break;
                default:
                    break;
            }
        }
        // document.getElementById("deleteCanvas").onclick = (ev) => {
        //     this.removeCard(currentMesh.name);
        //     document.getElementById("TextCanvasEditor").style.visibility = 'hidden';
        // }
        //var count = 0;
        var ancDoc = document.getElementById("anchorPointScreenCoordinate");
        ancDoc.style.position = "absolute";
        scene.registerBeforeRender(function () {
            if (scene.activeCamera) {
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    var p = BABYLON.Vector3.Project(_this.textCanvases[0].anchor.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), scene.activeCamera.viewport.toGlobal(scene.getEngine()));
                    ancDoc.textContent = "X:" + p.x.toFixed(2) + " Y:" + p.y.toFixed(2) + (_this.textCanvases[0].anchor.isEnabled() ? "\nEnabled" : "\nDisabled");
                    ancDoc.style.top = p.y.toFixed(2).toString() + "px";
                    ancDoc.style.left = p.x.toFixed(2).toString() + "px";
                    //  console.log(p.x + "," + p.y);
                    _this.lookAtCamera(_this.textCanvases[i].titleMesh, scene);
                    _this.lookAtCamera(_this.textCanvases[i].anchor, scene);
                    var offsetCard = _this.textCanvases[i].offset;
                    var offsetCard2 = _this.textCanvases[i].offset == 0 ? 3 : 0;
                    //if (count % 2 != 0) continue; // enable for optimizing
                    //var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(arr[i], 0), this.textCanvases[i].descriptionMesh.getWorldMatrix());
                    var pos = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], offsetCard), _this.textCanvases[i].titleMesh.getWorldMatrix());
                    var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], offsetCard2), _this.textCanvases[i].titleMesh.getWorldMatrix());
                    // var d1 = BABYLON.Vector3.Distance(pos1, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    // var d2 = BABYLON.Vector3.Distance(pos2, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    var dir = offsetCard2 == 3 ? pos.subtract(pos1).normalize() : pos1.subtract(pos).normalize();
                    // if (d1 < d2)
                    //     pos = pos1;
                    // else
                    _this.pointss[i][3] = offsetCard2 == 3 ? pos.x + dir.x / 8 : pos.x - dir.x / 8;
                    _this.pointss[i][4] = offsetCard2 == 3 ? pos.y + dir.y / 8 : pos.y - dir.y / 8;
                    _this.pointss[i][5] = offsetCard2 == 3 ? pos.z + dir.z / 8 : pos.z - dir.z / 8;
                    _this.pointss[i][6] = pos.x;
                    _this.pointss[i][7] = pos.y;
                    _this.pointss[i][8] = pos.z;
                    _this.textCanvases[i].line.updateVerticesData(BABYLON.VertexBuffer.PositionKind, _this.pointss[i]);
                }
            }
            _this.lookAtCamera(ground, scene);
            //count++;
            // scale canvas
            var rad = scene.activeCamera.radius / 2;
            for (var i = 0; i < _this.textCanvases.length; i++) {
                if (!_this.textCanvases[i].enabled || !_this.textCanvases[i].visible)
                    continue;
                var scale = rad * _this.textCanvases[i].scale;
                if (_this.textCanvases[i].isAnimating) {
                    _this.textCanvases[i].titleMesh.scaling.x *= scale;
                    _this.textCanvases[i].titleMesh.scaling.y *= scale;
                    _this.textCanvases[i].titleMesh.scaling.z *= scale;
                    continue;
                }
                _this.textCanvases[i].titleMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            }
            // optimizing
            // if (count < 20) return;
            // count = 0;
            // check if anchor point is visible, if not disable canvas
            for (var i = 0; i < _this.rays.length; i++) {
                _this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(_this.pointss[i][0], _this.pointss[i][1], _this.pointss[i][2]));
                _this.textCanvases[i].setTextCanvasEnabled(!_this.checkIfRayColidesWithMesh(_this.rays[i], modelMeshes, scene));
            }
        });
    }
    TextCanvasManager.prototype.removeCard = function (index) {
        this.textCanvases[index].enabled = false;
        this.textCanvases[index].descriptionMesh.setEnabled(false);
        this.textCanvases[index].titleMesh.setEnabled(false);
        this.textCanvases[index].line.setEnabled(false);
        this.textCanvases[index].anchor.setEnabled(false);
    };
    TextCanvasManager.prototype.checkIfRayColidesWithMesh = function (ray, meshes, scene) {
        var meshFound = scene.pickWithRay(ray, function (mesh) {
            for (var i = 0; i < meshes.length; i++) {
                if (mesh == meshes[i])
                    return true;
            }
            return false;
        });
        return meshFound.hit;
    };
    TextCanvasManager.prototype.pickWithMouse = function (meshes, scene) {
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
            for (var i = 0; i < modelMeshes.length; i++) {
                if (meshes[i] == mesh)
                    return true;
            }
            return false;
        });
        return pickInfo;
    };
    TextCanvasManager.prototype.lookAtCamera = function (mesh, scene) {
        mesh.rotation.y = -scene.activeCamera.alpha - (Math.PI / 2);
        mesh.rotation.x = -scene.activeCamera.beta + (Math.PI / 2);
    };
    return TextCanvasManager;
})();
/// <reference path="babylon.d.ts" />
var LensFlareSystem = (function () {
    function LensFlareSystem(scene) {
        var mainLensEmitter = new BABYLON.Mesh("lensEmitter", scene);
        mainLensEmitter.position = new BABYLON.Vector3(0.008, 0.601, -1.2);
        var MainLensFlareSystem = new BABYLON.LensFlareSystem("mainLensFlareSystem", mainLensEmitter, scene);
        mainLensEmitter.isPickable = false;
        var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), "./textures/Main Flare.png", MainLensFlareSystem);
        flare.texture.hasAlpha = true;
        flare.texture.getAlphaFromRGB = true;
        var hexaLensEmitter = new BABYLON.Mesh("hexaLensEmitter", scene);
        hexaLensEmitter.isPickable = false;
        hexaLensEmitter.position = new BABYLON.Vector3(0.027, 0.601, -1.225);
        var hexaLensFlareSystem = new BABYLON.LensFlareSystem("hexaLensFlareSystem", hexaLensEmitter, scene);
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
        //var count = 0;
        var meshFound = new BABYLON.PickingInfo();
        scene.registerBeforeRender(function () {
            // count++;
            // if (count > 5) {
            //    count = 0;
            var rayPick = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, mainLensEmitter.position);
            meshFound = scene.pickWithRay(rayPick, function (mesh) {
                for (var i = 0; i < modelMeshes.length; i++) {
                    if (mesh == modelMeshes[i])
                        return true;
                }
                return false;
            });
            //   }
            if (meshFound.pickedPoint != null) {
                flare.color = BABYLON.Color3.Black();
                hexaLensFlareSystem.isEnabled = false;
            }
            else {
                flare.color = BABYLON.Color3.White();
                hexaLensFlareSystem.isEnabled = true;
                var vec1 = hexaLensEmitter.position;
                var vec2 = scene.activeCamera.position;
                var dot = BABYLON.Vector3.Dot(vec1, vec2);
                dot = dot / (Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z) * Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z));
                var acos = Math.acos(dot);
                var angle = acos * 180 / Math.PI;
                var bb = 0.06 - angle / 1000;
                if (bb > 0.1)
                    bb = 0.1;
                for (var i = 0; i < hexaLensFlareSystem.lensFlares.length; i++) {
                    hexaLensFlareSystem.lensFlares[i].size = flareSizes[i] + (1 - scene.activeCamera.radius / 6) / 6;
                    if (angle < 45) {
                        hexaLensFlareSystem.lensFlares[i].color = new BABYLON.Color3(bb, bb, bb);
                    }
                    else {
                        hexaLensFlareSystem.isEnabled = false;
                    }
                }
            }
        });
    }
    return LensFlareSystem;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="EnvironmentManager.ts" />
var UploadManager = (function () {
    function UploadManager(scene, envMng) {
        this.envMng = envMng;
        this.scene = scene;
    }
    UploadManager.prototype.uploadModel = function () {
        var _this = this;
        var file = document.getElementById('uploadFiles').files[0];
        var reader = new FileReader();
        if (file) {
            reader.readAsText(file);
        }
        reader.onloadend = function () {
            _this.uploadNewModel(file.name.substr(0, file.name.indexOf(".")), "", "data:" + reader.result, _this.scene, _this.envMng);
        };
    };
    UploadManager.prototype.uploadNewModel = function (name, modelPath, modelName, scene, envManager) {
        if (modelMeshes.length > 0) {
            for (var i = 0; i < modelMeshes.length; i++) {
                modelMeshes[i].dispose();
            }
            modelMeshes = [];
        }
        BABYLON.SceneLoader.ImportMesh(null, modelPath, modelName, scene, function (newMeshes) {
            // var ambientTexture: BABYLON.Texture = new BABYLON.Texture("./textures/models-textures/HEADSET_STYLE_1.jpg", scene);
            // var blackPlastic = new BABYLON.PBRMaterial("Black Plastic", scene);
            // blackPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackplastic.jpg", scene);
            // blackPlastic.ambientTexture = ambientTexture;
            // blackPlastic.ambientTexture.coordinatesIndex = 1;
            // blackPlastic.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            // blackPlastic.specularIntensity = 0.1;
            // blackPlastic.indexOfRefraction = 0.52;
            // blackPlastic.directIntensity = 1;
            // blackPlastic.environmentIntensity = 0.05;
            // blackPlastic.overloadedShadowIntensity = 0.8;
            // blackPlastic.overloadedShadeIntensity = 0.8;
            // blackPlastic.cameraExposure = 1.26;
            // blackPlastic.cameraContrast = 1.6;
            // blackPlastic.microSurface = 0.31;
            // var redPlastic = new BABYLON.PBRMaterial("Red Plastic", scene);
            // redPlastic.albedoTexture = new BABYLON.Texture("./textures/models-textures/redplastic.jpg", scene);
            // redPlastic.ambientTexture = ambientTexture;
            // redPlastic.ambientTexture.coordinatesIndex = 1;
            // redPlastic.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            // redPlastic.indexOfRefraction = .52;
            // redPlastic.directIntensity = 1;
            // redPlastic.environmentIntensity = 0.5;
            // redPlastic.specularIntensity = 0.3;
            // redPlastic.overloadedShadowIntensity = 1.3;
            // redPlastic.overloadedShadeIntensity = 0.68;
            // redPlastic.cameraExposure = 0.8;
            // redPlastic.cameraContrast = 2;
            // redPlastic.microSurface = 0.34;
            // var chrome = new BABYLON.PBRMaterial("Chrome", scene);
            // chrome.albedoTexture = new BABYLON.Texture("./textures/models-textures/chrome.jpg", scene);
            // chrome.ambientTexture = ambientTexture;
            // chrome.ambientTexture.coordinatesIndex = 1;
            // chrome.reflectivityColor = new BABYLON.Color3(.9, .9, .9);
            // chrome.directIntensity = 0.3;
            // chrome.specularIntensity = 1.5;
            // chrome.environmentIntensity = 0.6;
            // chrome.cameraExposure = .23;
            // chrome.cameraContrast = 1.9;
            // chrome.microSurface = 0.99;
            // var blackMetal = new BABYLON.PBRMaterial("Black Metal", scene);
            // blackMetal.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackmetal.jpg", scene);
            // blackMetal.ambientTexture = ambientTexture;
            // blackMetal.ambientTexture.coordinatesIndex = 1;
            // blackMetal.reflectivityColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            // blackMetal.indexOfRefraction = 2;
            // blackMetal.directIntensity = 0.2;
            // blackMetal.environmentIntensity = 0.24;
            // blackMetal.specularIntensity = 0.7;
            // blackMetal.overloadedShadeIntensity = 0.8;
            // blackMetal.cameraExposure = 1.99;
            // blackMetal.cameraContrast = 1;
            // blackMetal.microSurface = 0.61;
            // var blackBox = new BABYLON.PBRMaterial("Black Box", scene);
            // blackBox.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackbox.jpg", scene);
            // blackBox.ambientTexture = new BABYLON.Texture("./textures/models-textures/BOX_STYLE_1.jpg", scene);
            // blackBox.reflectivityColor = new BABYLON.Color3(0, 0, 0);
            // blackBox.indexOfRefraction = 2;
            // blackBox.directIntensity = 1.7;
            // blackBox.environmentIntensity = 0.09;
            // blackBox.overloadedShadowIntensity = 0.6;
            // blackBox.overloadedShadeIntensity = 0.22;
            // blackBox.cameraExposure = 1.5;
            // blackBox.cameraContrast = 2;
            // blackBox.microSurface = 0.46;
            // var blackCushion = new BABYLON.PBRMaterial("Black Cushion", scene);
            // blackCushion.albedoTexture = new BABYLON.Texture("./textures/models-textures/blackcushion.jpg", scene);
            // blackCushion.ambientTexture = ambientTexture;
            // blackCushion.ambientTexture.coordinatesIndex = 1;
            // blackCushion.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
            // blackCushion.indexOfRefraction = .52;
            // blackCushion.directIntensity = 2;
            // blackCushion.environmentIntensity = 0;
            // blackCushion.overloadedShadeIntensity = 0.81;
            // blackCushion.cameraExposure = 2;
            // blackCushion.cameraContrast = 2;
            // blackCushion.microSurface = 0.4;
            for (var i = 0; i < newMeshes.length; i++) {
                var mat = newMeshes[i].material;
                var pbr = new BABYLON.PBRMaterial("PBR" + i, scene);
                pbr.reflectivityColor = new BABYLON.Color3(0, 0, 0);
                pbr.indexOfRefraction = 2;
                pbr.directIntensity = 1.7;
                pbr.environmentIntensity = 0.09;
                pbr.overloadedShadowIntensity = 0.6;
                pbr.overloadedShadeIntensity = 0.22;
                pbr.cameraExposure = 1.5;
                pbr.cameraContrast = 2;
                pbr.microSurface = 0.46;
                pbr.albedoTexture = mat.diffuseTexture;
                if (mat.name.indexOf("Ground_Plane") > -1) {
                    pbr.albedoTexture = mat.diffuseTexture;
                    pbr.opacityTexture = mat.diffuseTexture;
                    newMeshes[i].isPickable = false;
                    newMeshes[i].renderOutline = false;
                    newMeshes[i].material = pbr;
                    continue;
                }
                else {
                    modelMeshes.push(newMeshes[i]);
                }
                newMeshes[i].actionManager = new BABYLON.ActionManager(scene);
                newMeshes[i].actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newMeshes[i], "renderOutline", false));
                newMeshes[i].actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newMeshes[i], "renderOutline", true));
                if (newMeshes[i].name.indexOf("Part_") > -1) {
                    var a = './' + name + '_Part_' + newMeshes[i].name.substr(newMeshes[i].name.indexOf("Part_") + 5, 1) + '_AO.jpg';
                    pbr.ambientTexture = new BABYLON.Texture(a /*"./textures/models-textures/BOX_STYLE_1.jpg"*/, scene);
                    pbr.ambientTexture.coordinatesIndex = 1;
                }
                newMeshes[i].outlineWidth = 1;
                newMeshes[i].outlineColor = BABYLON.Color3.White();
                newMeshes[i].material = pbr;
            }
            var refl = scene.getMeshByName("reflectionPlane").material.reflectionTexture;
            for (var i = 0; i < newMeshes.length; i++) {
                refl.renderList.push(newMeshes[i]);
            }
            envManager.setReflection(scene, null);
        });
    };
    return UploadManager;
})();
/// <reference path="babylon.d.ts"/>
/// <reference path="babylon.pbrMaterial.d.ts" />
var Material = (function () {
    function Material(json, scene) {
        var jsonMat = JSON.parse(json);
        this.name = jsonMat.name;
        this.pbr = new BABYLON.PBRMaterial(jsonMat.name, scene);
        this.pbr.indexOfRefraction = jsonMat.indexOfRefraction;
        this.pbr.alpha = jsonMat.alpha;
        this.pbr.directIntensity = jsonMat.directIntensity;
        this.pbr.emissiveIntensity = jsonMat.emissiveIntensity;
        this.pbr.environmentIntensity = jsonMat.environmentIntensity;
        this.pbr.specularIntensity = jsonMat.specularIntensity;
        this.pbr.overloadedShadowIntensity = jsonMat.overloadedShadowIntensity;
        this.pbr.overloadedShadeIntensity = jsonMat.overloadedShadeIntensity;
        this.pbr.cameraExposure = jsonMat.cameraExposure;
        this.pbr.cameraContrast = jsonMat.cameraContrast;
        this.pbr.microSurface = jsonMat.microSurface;
        this.pbr.reflectivityColor = new BABYLON.Color3(jsonMat.reflectivityColor.r, jsonMat.reflectivityColor.g, jsonMat.reflectivityColor.b);
    }
    Material.prototype.ToJSON = function () {
        return '{ ' +
            '"name":"' + this.pbr.name + '",' +
            '"indexOfRefraction":' + this.pbr.indexOfRefraction + ',' +
            '"alpha" : ' + this.pbr.alpha + ',' +
            '"directIntensity" : ' + this.pbr.directIntensity + ',' +
            '"emissiveIntensity" : ' + this.pbr.emissiveIntensity + ',' +
            '"environmentIntensity" : ' + this.pbr.environmentIntensity + ',' +
            '"specularIntensity" : ' + this.pbr.specularIntensity + ',' +
            '"overloadedShadowIntensity" : ' + this.pbr.overloadedShadowIntensity + ',' +
            '"overloadedShadeIntensity" : ' + this.pbr.overloadedShadeIntensity + ',' +
            '"cameraExposure" : ' + this.pbr.cameraExposure + ',' +
            '"cameraContrast" : ' + this.pbr.cameraContrast + ',' +
            '"microSurface" : ' + this.pbr.microSurface + ',' +
            '"reflectivityColor" : {"r":' + this.pbr.reflectivityColor.r + ', "g":' + this.pbr.reflectivityColor.g + ', "b":' + this.pbr.reflectionColor.b + '}' +
            '}';
    };
    return Material;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="Material.ts" />
var MaterialManager = (function () {
    function MaterialManager(materials, scene) {
        var _this = this;
        this.materials = {};
        var jsonMat = JSON.parse(materials);
        var htmlElement = document.getElementById("materialBody");
        for (var i = 0; i < jsonMat.length; i++) {
            this.materials[jsonMat[i].name] = new Material(JSON.stringify(jsonMat[i]), scene);
            //<img class="material" src=".\textures\models-textures\redplastic.jpg" alt="Plastic" draggable="true">
            var img = document.createElement("img");
            img.src = "./textures/materials/" + jsonMat[i].name + ".jpg";
            img.alt = jsonMat[i].name;
            img.className = "material";
            img.draggable = true;
            if (i % 2 == 0 && i > 0)
                htmlElement.appendChild(document.createElement("br"));
            htmlElement.appendChild(img);
        }
        var file = document.getElementsByClassName('material');
        var startdrag = function (evt) {
            evt.dataTransfer.setData("text", evt.target.alt);
        };
        for (var i = 0; i < file.length; i++) {
            file[i].addEventListener('dragstart', startdrag, false);
        }
        var canvas = scene.getEngine().getRenderingCanvas();
        var dragover = function (evt) {
            evt.preventDefault();
            var pickResult = scene.pick(evt.offsetX, evt.offsetY);
            for (var i = 0; i < modelMeshes.length; i++) {
                modelMeshes[i].renderOutline = false;
            }
            if (pickResult.hit) {
                pickResult.pickedMesh.renderOutline = true;
            }
        };
        var drop = function (evt) {
            debugger;
            evt.preventDefault();
            console.log(evt.dataTransfer.getData("text"));
            var mat = _this.cloneMaterial(_this.materials[evt.dataTransfer.getData("text")].pbr, scene);
            // var src = evt.dataTransfer.getData("text");
            var pickResult = scene.pick(evt.offsetX, evt.offsetY);
            if (pickResult.hit) {
                mat.albedoTexture = pickResult.pickedMesh.material.albedoTexture;
                mat.ambientTexture = pickResult.pickedMesh.material.ambientTexture;
                mat.reflectionTexture = pickResult.pickedMesh.material.reflectionTexture;
                mat.refractionTexture = pickResult.pickedMesh.material.refractionTexture;
                pickResult.pickedMesh.material = mat;
            }
        };
        canvas.addEventListener('dragover', dragover, false);
        canvas.addEventListener('drop', drop, false);
    }
    MaterialManager.prototype.cloneMaterial = function (material, scene) {
        var pbr = new BABYLON.PBRMaterial(material.name, scene);
        pbr.indexOfRefraction = material.indexOfRefraction;
        pbr.alpha = material.alpha;
        pbr.directIntensity = material.directIntensity;
        pbr.emissiveIntensity = material.emissiveIntensity;
        pbr.environmentIntensity = material.environmentIntensity;
        pbr.specularIntensity = material.specularIntensity;
        pbr.overloadedShadowIntensity = material.overloadedShadowIntensity;
        pbr.overloadedShadeIntensity = material.overloadedShadeIntensity;
        pbr.cameraExposure = material.cameraExposure;
        pbr.cameraContrast = material.cameraContrast;
        pbr.microSurface = material.microSurface;
        pbr.reflectivityColor = new BABYLON.Color3(material.reflectivityColor.r, material.reflectivityColor.g, material.reflectivityColor.b);
        return pbr;
    };
    return MaterialManager;
})();
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="PBRConverter.ts" />
/// <reference path="EnvironmentUI.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />
/// <reference path="TextCanvasManager.ts" />
/// <reference path="LensFlareSystem.ts" />
/// <reference path="UploadManager.ts" />
/// <reference path="MaterialManager.ts" />
// things to download: 
// Skyboxes with reflections
// Materials
var sceneMain;
var envUI;
var uploadManager;
var modelMeshes = [];
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var camera;
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
        // Environment / Background
        var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';
        var envMng = new EnvironmentManager(str, scene);
        envUI = new EnvironmentUI(envMng, scene);
        // Canvases
        var json = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.25,"height":0.03,"position":{"x":0.5733,"y":1.0350,"z":-1.4110},"linePosition":{"x":0.008,"y":0.601,"z":-1.2},"offset":0,"anchorTextureURL":"./textures/anchors/Anchor_2.png"},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.25,"height":0.03,"position":{"x":-2,"y":1,"z":0},"linePosition":{"x":-1.192,"y":0.7488,"z":-0.295},"offset":3,"anchorTextureURL":"./textures/anchors/Anchor_4.png"}]';
        var textCanv = new TextCanvasManager(json, scene);
        uploadManager = new UploadManager(scene, envMng);
        //  uploadManager.uploadNewModel("./", "HEADSET", scene, envMng);
        var materials = '[{"name":"Plastic","indexOfRefraction":0.52,"alpha":1,"directIntensity":1,"emissiveIntensity":0,"environmentIntensity":0.5,"specularIntensity":0.3,"overloadedShadowIntensity":1.3,"overloadedShadeIntensity":0.68,"cameraExposure":0.8,"cameraContrast":2,"microSurface":0.34,"reflectivityColor":{"r":0.2,"g":0.2,"b":0.2}},{"name":"Metal","indexOfRefraction":2,"alpha":1,"directIntensity":1.7,"emissiveIntensity":1,"environmentIntensity":0.09,"specularIntensity":1,"overloadedShadowIntensity":0.6,"overloadedShadeIntensity":0.22,"cameraExposure":1.5,"cameraContrast":2,"microSurface":0.46,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Chrome","indexOfRefraction":0.66,"alpha":1,"directIntensity":0.3,"emissiveIntensity":1,"environmentIntensity":1,"specularIntensity":1.5,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":0.23,"cameraContrast":1.9,"microSurface":0.99,"reflectivityColor":{"r":1,"g":1,"b":1}}]';
        var materialManager = new MaterialManager(materials, scene);
        return scene;
    }
    sceneMain = createScene();
    var lensFlareSystem = new LensFlareSystem(sceneMain);
    var fps = document.getElementById("fps");
    engine.runRenderLoop(function () {
        sceneMain.render();
        fps.textContent = engine.getFps().toString();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
