/// <reference path="babylon.pbrMaterial.d.ts" />
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
        for (var i = 0; i < jsonEnv.length; i++) {
            this.environments.push(new Environment(jsonEnv[i], scene));
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
        for (var i = 0; i < scene.meshes.length; i++) {
            if (scene.meshes[i].material instanceof BABYLON.PBRMaterial && scene.meshes[i].name != "GROUNDPLANE_STYLE_1" && scene.meshes[i].name != "skybox" && scene.meshes[i].name != "reflectionPlane") {
                if (this.environments[this.currentEnvironment].reflectionTexture) {
                    scene.meshes[i].material.reflectionTexture = this.environments[this.currentEnvironment].reflectionTexture;
                }
                else {
                    scene.meshes[i].material.reflectionColor = (color) ? color : this.environments[this.currentEnvironment].backgroundColor;
                }
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
        this.anchorTextures = [];
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
        //this.titleMesh.renderingGroupId = 2;
        //this.createTexts(this.descriptionText, this.width + 0.3, this.height + 0.3, new BABYLON.Vector3(0, -this.height, 0), scene);
        this.descriptionMesh = this.createTextMesh('text-' + index, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.titleHeight - 0.02, 0), 'rgba(0, 256, 0, 0)', scene, 'white', this.height);
        this.descriptionMesh.isPickable = true;
        //this.descriptionMesh.showBoundingBox = true;
        //this.descriptionMesh.renderingGroupId = 3;
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
        var points = [vec, vec];
        this.line = BABYLON.Mesh.CreateLines("line" + index, points, scene, true);
        this.line.renderingGroupId = 1;
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
        var dirVec = this.anchors.position.subtract(this.position).normalize();
        var keys = [];
        keys.push({
            frame: 0,
            value: this.anchors.position
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
            value: this.anchors.position
        });
        this.popDown.setKeys(keysDown);
    };
    TextCanvas.prototype.createAnimations = function (scene) {
        var _this = this;
        this.anchors.actionManager = new BABYLON.ActionManager(scene);
        ;
        var dirVec = this.anchors.position.subtract(this.position).normalize();
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
            value: this.anchors.position
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
            value: this.anchors.position
        });
        this.popDown.setKeys(keysDown);
        this.scaleDown.setKeys(keysScaleDown);
        this.anchors.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function (evt) {
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
        if (!this.isPopedOut)
            return;
        this.line.setEnabled(value);
        this.titleMesh.setEnabled(value);
        this.descriptionMesh.setEnabled(value);
        this.anchors.setEnabled(value);
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
        var pl = BABYLON.Mesh.CreatePlane("23", .1, scene);
        var mm = new BABYLON.StandardMaterial("SD", scene);
        mm.opacityTexture = new BABYLON.Texture(url, scene);
        mm.emissiveColor = BABYLON.Color3.White();
        pl.material = mm;
        mm.diffuseColor = BABYLON.Color3.White();
        mm.specularColor = BABYLON.Color3.Black();
        //pl.renderingGroupId = 1;
        pl.position = position;
        this.anchors = pl;
        //this.lookAtCamera(pl, scene);
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
        var textureContext = this.titleMesh.material.diffuseTexture.getContext();
        //textureContext.font = "bold 40px Calibri";
        textureContext.save();
        textureContext.fillStyle = "white";
        textureContext.textAlign = "left";
        this.wrapText(textureContext, this.descriptionText, 0, 80, this.width, 25);
        textureContext.restore();
        this.descriptionMesh.material.diffuseTexture.update();
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
        this.rays = [];
        this.alterAnchorPoint = false;
        this.addingNewCanvas = false;
        this.pointss = [];
        this.arr = [];
        var jsonCanv = JSON.parse(json);
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
        var getGroundPosition = function () {
            var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
            if (pickinfo.hit) {
                return pickinfo.pickedPoint;
            }
            return null;
        };
        var onPointerDown = function (evt) {
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
                _this.arr.push(_this.textCanvases[index].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
                _this.addingNewCanvas = false;
                document.getElementById("addButton").value = "Add Text Canvas";
                return;
            }
            if (!_this.alterAnchorPoint)
                document.getElementById("TextCanvasEditor").style.visibility = 'hidden';
            if (_this.alterAnchorPoint) {
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (modelMeshes[i] == mesh)
                            return true;
                    }
                    return false;
                });
                if (pickInfo.hit) {
                    var newVec = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x / 100, pickInfo.pickedPoint.y + pickInfo.getNormal().y / 100, pickInfo.pickedPoint.z + pickInfo.getNormal().z / 100);
                    _this.pointss[currentMesh.name][0] = newVec.x;
                    _this.pointss[currentMesh.name][1] = newVec.y;
                    _this.pointss[currentMesh.name][2] = newVec.z;
                    _this.textCanvases[currentMesh.name].line.updateVerticesData(BABYLON.VertexBuffer.PositionKind, _this.pointss[currentMesh.name]);
                    _this.textCanvases[currentMesh.name].anchors.position = newVec;
                }
                return;
            }
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    if (!_this.textCanvases[i].enabled)
                        continue;
                    if (_this.textCanvases[i].titleMesh == mesh || mesh == _this.textCanvases[i].descriptionMesh)
                        return true;
                }
                return false;
            });
            if (pickInfo.hit) {
                currentMesh = null;
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    if (!_this.textCanvases[i].enabled)
                        continue;
                    if (pickInfo.pickedMesh == _this.textCanvases[i].titleMesh || pickInfo.pickedMesh == _this.textCanvases[i].descriptionMesh) {
                        currentMesh = pickInfo.pickedMesh == _this.textCanvases[i].titleMesh ? pickInfo.pickedMesh : pickInfo.pickedMesh.parent;
                        ground.position = new BABYLON.Vector3(_this.pointss[currentMesh.name][0], _this.pointss[currentMesh.name][1], _this.pointss[currentMesh.name][2]);
                        break;
                    }
                }
                if (!currentMesh)
                    return;
                document.getElementById("TextCanvasEditor").style.visibility = 'visible';
                document.getElementById("titleCanvas").value = (_this.textCanvases[currentMesh.name]).titleText;
                document.getElementById("descriptionCanvas").value = (_this.textCanvases[currentMesh.name]).descriptionText;
                // (<HTMLInputElement>document.getElementById('textCanvasWidth')).value = (this.textCanvases[currentMesh.name]).width.toString();
                // (<HTMLInputElement>document.getElementById('textCanvasHeight')).value = (this.textCanvases[currentMesh.name]).height.toString();
                startingPoint = getGroundPosition();
                if (startingPoint) {
                    setTimeout(function () {
                        scene.activeCamera.detachControl(canvas);
                    }, 0);
                }
            }
        };
        var onPointerUp = function () {
            if (startingPoint) {
                scene.activeCamera.attachControl(canvas, true);
                startingPoint = null;
                return;
            }
        };
        var onPointerMove = function (evt) {
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
            for (var i = 0; i < _this.textCanvases.length; i++) {
                if (!_this.textCanvases[i].enabled || !_this.textCanvases[i].visible)
                    continue;
                _this.lookAtCamera(_this.textCanvases[i].titleMesh, scene);
                _this.lookAtCamera(_this.textCanvases[i].anchors, scene);
                //if (count % 2 != 0) continue; // enable for optimizing
                //var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(arr[i], 0), this.textCanvases[i].descriptionMesh.getWorldMatrix());
                var pos = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], _this.textCanvases[i].offset), _this.textCanvases[i].descriptionMesh.getWorldMatrix());
                // var d1 = BABYLON.Vector3.Distance(pos1, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                // var d2 = BABYLON.Vector3.Distance(pos2, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                // if (d1 < d2)
                //     pos = pos1;
                // else
                _this.pointss[i][3] = pos.x;
                _this.pointss[i][4] = pos.y;
                _this.pointss[i][5] = pos.z;
                _this.textCanvases[i].line.updateVerticesData(BABYLON.VertexBuffer.PositionKind, _this.pointss[i]);
            }
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
            this.arr.push(this.textCanvases[i].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
        }
        document.getElementById("titleCanvas").oninput = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateTitleText(ev.target.value);
        };
        document.getElementById("descriptionCanvas").oninput = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateDescriptionText(ev.target.value);
        };
        // document.getElementById("textCanvasWidth").oninput = (ev) => {
        //     (this.textCanvases[currentMesh.name]).updateWidth(parseFloat((<HTMLInputElement>ev.target).value));
        //     this.arr[currentMesh.name] = this.textCanvases[currentMesh.name].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData();
        // };
        // document.getElementById("textCanvasHeight").oninput = (ev) => {
        //     (this.textCanvases[currentMesh.name]).updateHeight(parseFloat((<HTMLInputElement>ev.target).value));
        //     //this.arr[currentMesh.name] = this.textCanvases[currentMesh.name].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData();
        // };
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
        document.getElementById("anchorPoint").onchange = function (ev) {
            _this.alterAnchorPoint = ev.target.checked;
        };
        document.getElementById("addButton").onclick = function (ev) {
            _this.addingNewCanvas = true;
            ev.target.value = "Adding New Canvas!";
        };
        document.getElementById("changeCanvasPoint").onclick = function (ev) {
            _this.textCanvases[currentMesh.name].offset = _this.textCanvases[currentMesh.name].offset == 9 ? 0 : _this.textCanvases[currentMesh.name].offset + 3;
        };
        document.getElementById("deleteCanvas").onclick = function (ev) {
            _this.removeCard(currentMesh.name);
            document.getElementById("TextCanvasEditor").style.visibility = 'hidden';
        };
        //var count = 0;
        scene.registerBeforeRender(function () {
            if (scene.activeCamera) {
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    if (!_this.textCanvases[i].enabled)
                        continue;
                    _this.lookAtCamera(_this.textCanvases[i].titleMesh, scene);
                    _this.lookAtCamera(_this.textCanvases[i].anchors, scene);
                    //if (count % 2 != 0) continue; // enable for optimizing
                    //var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(arr[i], 0), this.textCanvases[i].descriptionMesh.getWorldMatrix());
                    var pos = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], _this.textCanvases[i].offset), _this.textCanvases[i].descriptionMesh.getWorldMatrix());
                    // var d1 = BABYLON.Vector3.Distance(pos1, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    // var d2 = BABYLON.Vector3.Distance(pos2, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    // if (d1 < d2)
                    //     pos = pos1;
                    // else
                    _this.pointss[i][3] = pos.x;
                    _this.pointss[i][4] = pos.y;
                    _this.pointss[i][5] = pos.z;
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
            // for (var i = 0; i < this.rays.length; i++) {
            //     if (!this.textCanvases[i].enabled || !this.textCanvases[i].visible) continue;
            //     this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(this.pointss[i][0], this.pointss[i][1], this.pointss[i][2]));
            //     this.textCanvases[i].setTextCanvasEnabled(!this.checkIfRayColidesWithMesh(this.rays[i], modelMeshes, scene));
            // }
        });
    }
    TextCanvasManager.prototype.removeCard = function (index) {
        this.textCanvases[index].enabled = false;
        this.textCanvases[index].descriptionMesh.setEnabled(false);
        this.textCanvases[index].titleMesh.setEnabled(false);
        this.textCanvases[index].line.setEnabled(false);
        this.textCanvases[index].anchors.setEnabled(false);
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
/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="PBRConverter.ts" />
/// <reference path="EnvironmentUI.ts" />
/// <reference path="babylon.gradientMaterial.d.ts" />
/// <reference path="TextCanvasManager.ts" />
/// <reference path="LensFlareSystem.ts" />
// things to download: 
// Skyboxes with reflections
// Materials
var sceneMain;
var envUI;
var modelMeshes = [];
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    //var gui = new dat.GUI();
    var engine = new BABYLON.Engine(canvas, true);
    var camera;
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
        var scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, .5, 0), scene);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 6;
        camera.upperBetaLimit = 1.6;
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 50;
        camera.setPosition(new BABYLON.Vector3(0.004510142482902708, 0.7674630808337399, -2.9880500596552437));
        scene.activeCamera = camera;
        //camera.attachPostProcess(new BABYLON.FxaaPostProcess("fxaa", 1.0, camera, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, engine, false));
        // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 3, scene);
        // var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
        // gradientMaterial.topColor = BABYLON.Color3.Red(); // Set the gradient top color
        // gradientMaterial.bottomColor = BABYLON.Color3.Blue(); // Set the gradient bottom color
        // gradientMaterial.offset = 0.25;
        // sphere.material = gradientMaterial;
        BABYLON.SceneLoader.ImportMesh("", "./", "HEADSET.babylon", scene, function (newMeshes) {
            var blackPlastic = new BABYLON.PBRMaterial("Black Plastic", scene);
            var redPlastic = new BABYLON.PBRMaterial("Red Plastic", scene);
            var chrome = new BABYLON.PBRMaterial("Chrome", scene);
            var blackMetal = new BABYLON.PBRMaterial("Black Metal", scene);
            var blackBox = new BABYLON.PBRMaterial("Black Box", scene);
            var blackCushion = new BABYLON.PBRMaterial("Black Cushion", scene);
            var hemilight = new BABYLON.HemisphericLight("hemilight1", new BABYLON.Vector3(0, 1, 0), sceneMain);
            hemilight.range = 0.1;
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
                        modelMeshes.push(newMeshes[i]);
                        break;
                    case "background":
                        var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
                        gradientMaterial.topColor = BABYLON.Color3.Red();
                        gradientMaterial.bottomColor = BABYLON.Color3.Blue();
                        newMeshes[i].position.y = -0.1;
                        newMeshes[i].material = gradientMaterial;
                        newMeshes[i].isPickable = false;
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
                        newMeshes[i].isPickable = false;
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
                        modelMeshes.push(newMeshes[i]);
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
                        modelMeshes.push(newMeshes[i]);
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
                        modelMeshes.push(newMeshes[i]);
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
                        modelMeshes.push(newMeshes[i]);
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
                        modelMeshes.push(newMeshes[i]);
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
                        newMeshes[i].isPickable = false;
                        break;
                    case "reflectionPlane":
                        var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene);
                        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, false);
                        mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                        mirrorMaterial.alpha = 0.1;
                        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.reflectionTexture.level = 1;
                        newMeshes[i].material = mirrorMaterial;
                        newMeshes[i].scaling = new BABYLON.Vector3(1010, 1010, 1010);
                        newMeshes[i].isPickable = false;
                        break;
                }
                // newMeshes[i].isPickable = false;
                if (newMeshes[i].name != "background")
                    hemilight.excludedMeshes.push(newMeshes[i]);
            }
            var refl = scene.getMeshByName("reflectionPlane").material.reflectionTexture;
            for (var i = 0; i < newMeshes.length; i++) {
                if (newMeshes[i].name != "reflectionPlane")
                    refl.renderList.push(newMeshes[i]);
            }
            var str = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';
            envUI = new EnvironmentUI(str, sceneMain);
            refl.renderList.push(scene.getMeshByName("skybox"));
            var json = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.25,"height":0.03,"position":{"x":0.5733,"y":1.0350,"z":-1.4110},"linePosition":{"x":0.008,"y":0.601,"z":-1.2},"offset":0,"anchorTextureURL":"./textures/anchors/Anchor_2.png"},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.25,"height":0.03,"position":{"x":-2,"y":1,"z":0},"linePosition":{"x":-1.192,"y":0.7488,"z":-0.295},"offset":3,"anchorTextureURL":"./textures/anchors/Anchor_4.png"}]';
            var textCanv = new TextCanvasManager(json, scene);
        });
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
