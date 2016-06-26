var Environment = (function () {
    function Environment(json, scene) {
        this.lights = [];
        if (!json)
            return;
        this.id = json.id;
        this.groundTexture = null;
        this.groundMesh = scene.getMeshByName("groundPlane");
        var hdr = new BABYLON.HDRCubeTexture("/static/js/lib/room.hdr", scene);
        this.reflectionTexture = hdr.clone();
        this.skyboxTexture = hdr.clone();
        this.groundShadow = scene.getMeshByName("Ground_Plane");
        this.backgroundMesh = scene.getMeshByName("background");
        this.reflectiveMesh = scene.getMeshByName("reflectionPlane");
        this.saturationT = 1;
        this.saturationB = 1;
        this.ligthnessT = 0.5;
        this.ligthnessB = 0.5;
        this.hueT = 0;
        this.hueB = 0;
        this.gradientOffset = 0;
        this.groundMeshScale = 1;
        this.groundShadowEnabled = true;
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
}());
var EnvironmentManager = (function () {
    function EnvironmentManager(jsonE, scene) {
        this.currentEnvironment = 0;
        this.environments = [];
        var jsonEnv = JSON.parse(jsonE);
        this.loadEnvironment(scene, jsonEnv);
    }
    EnvironmentManager.prototype.loadEnvironment = function (scene, jsonEnv) {
        var _this = this;
        BABYLON.SceneLoader.ImportMesh("", "/static/js/lib/", "environment.babylon", scene, function (environment) {
            var hemilight = new BABYLON.HemisphericLight("hemilight", new BABYLON.Vector3(0, 1, 0), scene);
            hemilight.range = 1;
            hemilight.intensity = 2;
            for (var i = 0; i < environment.length; i++) {
                switch (environment[i].name) {
                    case "background":
                        BABYLON.Effect.ShadersStore.gradientVertexShader = "precision mediump float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec4 vPosition;varying vec3 vNormal;varying vec2 vUv;void main(){vec4 p = vec4(position,1.);vPosition = p;vNormal = normal;vUv = uv;gl_Position = worldViewProjection * p;}";
                        BABYLON.Effect.ShadersStore.gradientPixelShader = "precision mediump float;uniform mat4 worldView;varying vec4 vPosition;varying vec3 vNormal;uniform float offset;uniform vec3 topColor;uniform vec3 bottomColor;varying vec2 vUv;void main(void){float h = normalize(vPosition+offset).y;gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y + offset),1);}";
                        var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
                        shader.setFloat("offset", 0);
                        shader.setColor3("topColor", BABYLON.Color3.Red());
                        shader.setColor3("bottomColor", BABYLON.Color3.Blue());
                        environment[i].material = shader;
                        environment[i].isPickable = false;
                        break;
                    case "groundPlane":
                        var groundPlaneMaterial = sceneMain.getMaterialByName("groundPlaneMaterial");
                        if (!groundPlaneMaterial)
                            groundPlaneMaterial = new BABYLON.PBRMaterial("groundPlaneMaterial", scene);
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
                        var mirrorMaterial = new BABYLON.StandardMaterial("mirrorMat", scene);
                        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirrorTexture", 2048, scene);
                        mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                        mirrorMaterial.reflectionTexture.hasAlpha = true;
                        mirrorMaterial.alpha = 0.1;
                        mirrorMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
                        mirrorMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                        mirrorMaterial.reflectionTexture.level = 1;
                        environment[i].material = mirrorMaterial;
                        environment[i].scaling = new BABYLON.Vector3(80, 1, 80);
                        environment[i].isPickable = false;
                        break;
                }
                if (environment[i].name != "background")
                    hemilight.excludedMeshes.push(environment[i]);
            }
            var refl = scene.getMeshByName("reflectionPlane").material.reflectionTexture;
            for (var i = 0; i < environment.length; i++) {
                if (environment[i].name != "reflectionPlane" && environment[i].name != "groundPlane")
                    refl.renderList.push(environment[i]);
            }
            for (var i = 0; i < 1; i++) {
                _this.environments.push(new Environment(jsonEnv[i], scene));
            }
            var hdrSkybox = BABYLON.Mesh.CreateBox("skybox", 79.0, scene);
            var hdrSkyboxMaterial = scene.getMaterialByName("skyBoxMat");
            if (!hdrSkyboxMaterial)
                hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBoxMat", scene);
            hdrSkyboxMaterial.backFaceCulling = false;
            hdrSkyboxMaterial.reflectionTexture = _this.environments[_this.currentEnvironment].skyboxTexture;
            hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            hdrSkyboxMaterial.microSurface = 0.5;
            hdrSkyboxMaterial.cameraExposure = 0.6;
            hdrSkyboxMaterial.cameraContrast = 1.6;
            hdrSkyboxMaterial.sideOrientation = 0;
            hdrSkybox.material = hdrSkyboxMaterial;
            hdrSkybox.infiniteDistance = false;
            hdrSkybox.isPickable = false;
            _this.setEnvironment(_this.environments[0].id, scene);
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
        var environment = this.findEnvironmentById(id);
        if (!environment)
            environment = this.environments[0];
        this.setReflection(scene);
    };
    EnvironmentManager.prototype.turnBackgroundOnOff = function (value) {
        this.environments[this.currentEnvironment].backgroundMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.turnShadowOffOn = function (value) {
        this.environments[this.currentEnvironment].groundShadowEnabled = value;
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
    EnvironmentManager.prototype.hslToRgb = function (h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l;
        }
        else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };
    EnvironmentManager.prototype.changeTopGradientHue = function (value) {
        this.environments[this.currentEnvironment].hueT = parseFloat(value);
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueT, this.environments[this.currentEnvironment].saturationT, this.environments[this.currentEnvironment].ligthnessT);
        this.environments[this.currentEnvironment].backgroundMesh.material.setColor3("topColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2]));
    };
    EnvironmentManager.prototype.changeTopGradientLightness = function (value) {
        this.environments[this.currentEnvironment].ligthnessT = parseFloat(value);
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueT, this.environments[this.currentEnvironment].saturationT, this.environments[this.currentEnvironment].ligthnessT);
        this.environments[this.currentEnvironment].backgroundMesh.material.setColor3("topColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2]));
    };
    EnvironmentManager.prototype.changeBottomGradientHue = function (value) {
        this.environments[this.currentEnvironment].hueB = parseFloat(value);
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueB, this.environments[this.currentEnvironment].saturationB, this.environments[this.currentEnvironment].ligthnessB);
        this.environments[this.currentEnvironment].backgroundMesh.material.setColor3("bottomColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2]));
    };
    EnvironmentManager.prototype.changeBottomGradientLightness = function (value) {
        this.environments[this.currentEnvironment].ligthnessB = parseFloat(value);
        if (this.environments[this.currentEnvironment].ligthnessB < 0)
            this.environments[this.currentEnvironment].ligthnessB = 0;
        var ints = this.hslToRgb(this.environments[this.currentEnvironment].hueB, this.environments[this.currentEnvironment].saturationB, this.environments[this.currentEnvironment].ligthnessB);
        this.environments[this.currentEnvironment].backgroundMesh.material.setColor3("bottomColor", BABYLON.Color3.FromInts(ints[0], ints[1], ints[2]));
    };
    EnvironmentManager.prototype.changeGradientOffset = function (value) {
        this.environments[this.currentEnvironment].gradientOffset = value;
        this.environments[this.currentEnvironment].backgroundMesh.material.setFloat("offset", value);
    };
    EnvironmentManager.prototype.updateGroundTexture = function (scene) {
    };
    EnvironmentManager.prototype.turnGroundPlaneOffOn = function (value) {
        this.environments[this.currentEnvironment].groundMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.changeGroundPlaneSize = function (scale) {
        this.environments[this.currentEnvironment].groundMeshScale = scale;
        this.environments[this.currentEnvironment].groundMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    };
    EnvironmentManager.prototype.turnReflectivePlaneOffOn = function (value) {
        this.environments[this.currentEnvironment].reflectiveMesh.setEnabled(value);
    };
    EnvironmentManager.prototype.changeReflectionAmount = function (value) {
        this.environments[this.currentEnvironment].reflectiveMesh.material.alpha = value / 100;
        console.log(this.toJson());
    };
    EnvironmentManager.prototype.environmentChanged = function (json, scene) {
        if (!json || json == "")
            return;
        var jsEnv = JSON.parse(json);
        this.environments[this.currentEnvironment].backgroundMesh.setEnabled(jsEnv.backOnOff);
        this.environments[this.currentEnvironment].hueT = jsEnv.hueT;
        this.changeTopGradientHue(this.environments[this.currentEnvironment].hueT.toString());
        this.environments[this.currentEnvironment].ligthnessT = jsEnv.lightT;
        this.changeTopGradientLightness(this.environments[this.currentEnvironment].ligthnessT.toString());
        this.environments[this.currentEnvironment].hueB = jsEnv.hueB;
        this.changeBottomGradientHue(this.environments[this.currentEnvironment].hueB.toString());
        this.environments[this.currentEnvironment].ligthnessB = jsEnv.lightB;
        this.changeBottomGradientLightness(this.environments[this.currentEnvironment].ligthnessB.toString());
        this.environments[this.currentEnvironment].gradientOffset = jsEnv.gradOffset;
        this.changeGradientOffset(this.environments[this.currentEnvironment].gradientOffset);
        this.environments[this.currentEnvironment].groundMesh.setEnabled(jsEnv.groundPlaneOnOff);
        this.environments[this.currentEnvironment].groundMeshScale = jsEnv.groundPlaneScale;
        this.changeGroundPlaneSize(this.environments[this.currentEnvironment].groundMeshScale);
        if (this.environments[this.currentEnvironment].groundShadow)
            this.environments[this.currentEnvironment].groundShadow.setEnabled(jsEnv.shadowOnOff);
        this.environments[this.currentEnvironment].groundShadowEnabled = jsEnv.shadowOnOff;
        this.environments[this.currentEnvironment].reflectiveMesh.setEnabled(jsEnv.reflective);
        this.environments[this.currentEnvironment].reflectiveMesh.material.alpha = jsEnv.reflectiveAmount;
        this.changeReflectionAmount(this.environments[this.currentEnvironment].reflectiveMesh.material.alpha);
    };
    EnvironmentManager.prototype.toJson = function () {
        var json = "{";
        json += '"backOnOff":' + this.environments[this.currentEnvironment].backgroundMesh.isEnabled() + ",";
        json += '"hueT":' + this.environments[this.currentEnvironment].hueT + ",";
        json += '"lightT":' + this.environments[this.currentEnvironment].ligthnessT + ",";
        json += '"hueB":' + this.environments[this.currentEnvironment].hueB + ",";
        json += '"lightB":' + this.environments[this.currentEnvironment].ligthnessB + ",";
        json += '"gradOffset":' + this.environments[this.currentEnvironment].gradientOffset + ",";
        json += '"groundPlaneOnOff":' + this.environments[this.currentEnvironment].groundMesh.isEnabled() + ",";
        json += '"groundPlaneScale":' + this.environments[this.currentEnvironment].groundMeshScale + ",";
        json += '"shadowOnOff":' + this.environments[this.currentEnvironment].groundShadow.isEnabled() + ",";
        json += '"reflective":' + this.environments[this.currentEnvironment].reflectiveMesh.isEnabled() + ",";
        json += '"reflectiveAmount":' + this.environments[this.currentEnvironment].reflectiveMesh.material.alpha;
        json += "}";
        return json;
    };
    return EnvironmentManager;
}());
var EnvironmentUI = (function () {
    function EnvironmentUI(environmentManager, scene) {
        var self = this;
        this.environmentManager = environmentManager;
        $('body').on('editorPropertyChanged', function (e) {
            switch (e.name) {
                case "show_background":
                    self.environmentManager.turnBackgroundOnOff(e.value);
                    break;
                case "show_ground_plane":
                    self.environmentManager.turnGroundPlaneOffOn(e.value);
                    break;
                case "show_shadow":
                    self.environmentManager.turnShadowOffOn(e.value);
                    break;
                case "show_reflective":
                    self.environmentManager.turnReflectivePlaneOffOn(e.value);
                    break;
                case "gradient_top_hue":
                    self.environmentManager.changeTopGradientHue(e.value);
                    break;
                case "gradient_top_lightness":
                    self.environmentManager.changeTopGradientLightness(e.value);
                    break;
                case "gradient_bottom_hue":
                    self.environmentManager.changeBottomGradientHue(e.value);
                    break;
                case "gradient_bottom_lightness":
                    self.environmentManager.changeBottomGradientLightness(e.value);
                    break;
                case "gradient_offset":
                    self.environmentManager.changeGradientOffset(e.value);
                    break;
                case "reflective_amount":
                    self.environmentManager.changeReflectionAmount(e.value);
                    break;
            }
        });
    }
    return EnvironmentUI;
}());
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
        this.descriptionMesh = this.createTextMesh('text-' + index, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.titleHeight - 0.02, 0), 'rgba(0, 256, 0, 0)', scene, 'white', this.height);
        this.descriptionMesh.isPickable = true;
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
        dynamicTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        dynamicTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
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
            }
        }
        context.fillText(line, x, y);
    };
    TextCanvas.prototype.updateTitleText = function (text) {
        this.titleText = text;
        this.titleMesh.material.diffuseTexture = this.createText(this.titleText, 'rgba(0, 0, 0, 0)', this.scene, 'white', this.titleHeight);
    };
    TextCanvas.prototype.updateDescriptionText = function (text) {
        this.descriptionText = text;
        this.descriptionMesh.material.diffuseTexture = this.createText(this.descriptionText, 'rgba(0, 0, 0, 0)', this.scene, 'white', this.height);
    };
    TextCanvas.prototype.updateWidth = function (value) {
        this.scale = value;
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
}());
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
        for (var i = 0; i < jsonCanv.length; i++) {
            this.textCanvases.push(new TextCanvas(jsonCanv[i], i.toString(), scene));
            this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(jsonCanv[i].linePosition.x, jsonCanv[i].linePosition.y, jsonCanv[i].linePosition.z)));
        }
        var ground = BABYLON.Mesh.CreatePlane("ground", 15, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
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
        var ancDoc = document.getElementById("anchorPointScreenCoordinate");
        ancDoc.style.position = "absolute";
        scene.registerBeforeRender(function () {
            if (scene.activeCamera) {
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    var p = BABYLON.Vector3.Project(_this.textCanvases[0].anchor.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), scene.activeCamera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight()));
                    ancDoc.textContent = "X:" + p.x.toFixed(2) + " Y:" + p.y.toFixed(2) + (_this.textCanvases[0].anchor.isEnabled() ? "\nEnabled" : "\nDisabled");
                    ancDoc.style.top = p.y.toFixed(2).toString() + "px";
                    ancDoc.style.left = p.x.toFixed(2).toString() + "px";
                    _this.lookAtCamera(_this.textCanvases[i].titleMesh, scene);
                    _this.lookAtCamera(_this.textCanvases[i].anchor, scene);
                    var offsetCard = _this.textCanvases[i].offset;
                    var offsetCard2 = _this.textCanvases[i].offset == 0 ? 3 : 0;
                    var pos = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], offsetCard), _this.textCanvases[i].titleMesh.getWorldMatrix());
                    var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], offsetCard2), _this.textCanvases[i].titleMesh.getWorldMatrix());
                    var dir = offsetCard2 == 3 ? pos.subtract(pos1).normalize() : pos1.subtract(pos).normalize();
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
}());
var LensFlareSystem = (function () {
    function LensFlareSystem(scene, json) {
        var _this = this;
        this.mainLensEmitter = [];
        this.hexaLensEmitter = [];
        this.hexaLensFlareSystem = [];
        this.MainLensFlareSystem = [];
        this.flareSizes = [];
        this.ids = [];
        var self = this;
        this.createFromJson(json, scene);
        $('body').on('lenseflareDropped', function (e) {
            var mesh = scene.pick(e.x, e.y);
            if (mesh && mesh.hit) {
                self.ids.push(e.model.id);
                self.createFlares(scene, mesh.pickedPoint, e.model.main_flare, e.model.hexigon_shape, e.model.band_1, e.model.band_2);
            }
            console.log(self.ToJSON());
        });
        scene.registerBeforeRender(function () {
            if (_this.MainLensFlareSystem.length == 0)
                return;
            for (var i = 0; i < _this.MainLensFlareSystem.length; i++) {
                _this.hexaLensFlareSystem[i].isEnabled = true;
                var vec1 = _this.hexaLensEmitter[i].position;
                var vec2 = scene.activeCamera.position;
                var dot = BABYLON.Vector3.Dot(vec1, vec2);
                dot = dot / (Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z) * Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z));
                var acos = Math.acos(dot);
                var angle = acos * 180 / Math.PI;
                var bb = 0.06 - angle / 1000;
                if (bb > 0.1)
                    bb = 0.1;
                for (var j = 0; j < _this.hexaLensFlareSystem[i].lensFlares.length; j++) {
                    _this.hexaLensFlareSystem[i].lensFlares[j].size = _this.flareSizes[i * 7 + j] + (1 - scene.activeCamera.radius / 6) / 6;
                    if (angle < 45) {
                        _this.hexaLensFlareSystem[i].lensFlares[j].color = new BABYLON.Color3(bb, bb, bb);
                    }
                    else {
                        _this.hexaLensFlareSystem[i].isEnabled = false;
                    }
                }
            }
        });
        var canvas = scene.getEngine().getRenderingCanvas();
        var onPointerDown = function (evt) {
            event.preventDefault();
            if (evt.button !== 0) {
                var pos = new BABYLON.Vector2(scene.pointerX, scene.pointerY);
                for (var i = 0; i < _this.mainLensEmitter.length; i++) {
                    var p = BABYLON.Vector3.Project(_this.mainLensEmitter[i].position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), scene.activeCamera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight()));
                    if (BABYLON.Vector2.Distance(pos, new BABYLON.Vector2(p.x, p.y)) < 10) {
                        _this.selectedLens = i;
                    }
                }
                return;
            }
        };
        canvas.addEventListener("pointerdown", onPointerDown, false);
        scene.onDispose = function () {
            canvas.removeEventListener("pointerdown", onPointerDown);
        };
    }
    LensFlareSystem.prototype.createFlares = function (scene, position, fpMain, fpHexa, fpB_1, fpB_2) {
        this.mainLensEmitter.push(new BABYLON.Mesh("lensEmitter" + this.mainLensEmitter.length, scene));
        this.mainLensEmitter[this.mainLensEmitter.length - 1].position = position;
        this.MainLensFlareSystem.push(new BABYLON.LensFlareSystem("mainLensFlareSystem" + this.MainLensFlareSystem.length, this.mainLensEmitter[this.mainLensEmitter.length - 1], scene));
        this.mainLensEmitter[this.mainLensEmitter.length - 1].isPickable = true;
        var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), fpMain, this.MainLensFlareSystem[this.MainLensFlareSystem.length - 1]);
        flare.texture.hasAlpha = true;
        flare.texture.getAlphaFromRGB = true;
        this.hexaLensEmitter.push(new BABYLON.Mesh("hexaLensEmitter" + this.hexaLensEmitter.length, scene));
        this.hexaLensEmitter[this.hexaLensEmitter.length - 1].isPickable = false;
        this.hexaLensEmitter[this.hexaLensEmitter.length - 1].position = position;
        this.hexaLensFlareSystem.push(new BABYLON.LensFlareSystem("hexaLensFlareSystem" + this.hexaLensFlareSystem.length, this.hexaLensEmitter[this.hexaLensEmitter.length - 1], scene));
        var flare1 = new BABYLON.LensFlare(.2, -2.85, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare2 = new BABYLON.LensFlare(.1, -2.3, new BABYLON.Color3(0.1, 0.05, 0.05), fpB_2, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare3 = new BABYLON.LensFlare(.1, -0.5, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare4 = new BABYLON.LensFlare(.05, 0, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare5 = new BABYLON.LensFlare(.05, 0.4, new BABYLON.Color3(0.1, 0.05, 0.05), fpB_2, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare6 = new BABYLON.LensFlare(.05, 0.2, new BABYLON.Color3(0.1, 0.05, 0.05), fpB_1, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare7 = new BABYLON.LensFlare(.05, 0.5, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        for (var i = 0; i < this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1].lensFlares.length; i++) {
            this.flareSizes.push(this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1].lensFlares[i].size);
        }
        return;
    };
    LensFlareSystem.prototype.disposeFlareSystem = function (index) {
        if (this.MainLensFlareSystem.length > 0) {
            this.MainLensFlareSystem[index].lensFlares[0].texture.dispose();
            this.MainLensFlareSystem[index].lensFlares[0].texture = null;
            this.MainLensFlareSystem[index].lensFlares = [];
            this.MainLensFlareSystem.splice(index, 1);
        }
        if (this.hexaLensFlareSystem.length > 0) {
            for (var i = 0; i < this.hexaLensFlareSystem[index].lensFlares.length; i++) {
                var tex = this.hexaLensFlareSystem[index].lensFlares[i].texture;
                tex.dispose();
                tex = null;
            }
            this.hexaLensFlareSystem[index].lensFlares = [];
            this.hexaLensFlareSystem[index].dispose();
            this.hexaLensFlareSystem.splice(index, 1);
        }
        if (this.mainLensEmitter.length > 0) {
            this.mainLensEmitter[index].dispose();
            this.mainLensEmitter.splice(index, 1);
        }
        if (this.hexaLensEmitter.length > 0) {
            this.hexaLensEmitter[index].dispose();
            this.hexaLensEmitter.splice(index, 1);
        }
        if (this.flareSizes.length > 0) {
            this.flareSizes.splice(index, 7);
        }
        if (this.ids.length > 0) {
            this.ids.splice(index, 7);
        }
    };
    LensFlareSystem.prototype.createFromJson = function (json, scene) {
        if (!json || json == "")
            return;
        var jsonF = JSON.parse(json);
        for (var i = 0; i < jsonF.length; i++) {
            this.ids.push(jsonF[i].id);
            this.createFlares(scene, new BABYLON.Vector3(jsonF[i].pos.x, jsonF[i].pos.y, jsonF[i].pos.z), jsonF[i].fpMain, jsonF[i].fpHexa, jsonF[i].fpB_1, jsonF[i].fpB_2);
        }
    };
    LensFlareSystem.prototype.ToJSON = function () {
        var json = "[";
        for (var i = 0; i < this.MainLensFlareSystem.length; i++) {
            json += '{"pos":' + JSON.stringify(this.mainLensEmitter[i].getAbsolutePosition()) + ",";
            json += '"id":' + this.ids[i] + '},';
        }
        if (this.MainLensFlareSystem.length > 0)
            json = json.substring(0, json.length - 1);
        json += "]";
        return json;
    };
    return LensFlareSystem;
}());
var UploadManager = (function () {
    function UploadManager(scene, envMng) {
        this.uploading = false;
        var self = this;
        self.envMng = envMng;
        self.scene = scene;
        $('body').on('modelChanged', function (e) {
            if (self.uploading)
                return;
            self.uploading = true;
            console.log(e.tab, e.model, e.textures);
            var paths = e.model.split('/');
            paths.pop();
            self.id = e.id;
            self.path = paths.join('/');
            self.path += "/";
            console.log(self.path);
            if (e.model == null && modelMeshes.length > 0) {
                for (var i = 0; i < modelMeshes.length; i++) {
                    scene.getMaterialByName(modelMeshes[i].name).dispose();
                    scene.getMeshByName(modelMeshes[i].name).dispose();
                    modelMeshes[i].dispose();
                }
                if (envMng.environments[envMng.currentEnvironment].groundShadow != null) {
                    envMng.environments[envMng.currentEnvironment].groundShadow.dispose();
                    envMng.environments[envMng.currentEnvironment].groundShadow = null;
                }
                modelMeshes = [];
            }
            var strSplt = e.model.split('/');
            var mName = strSplt[strSplt.length - 1];
            strSplt.pop();
            var mPath = strSplt.join('/');
            console.log(strSplt);
            mPath += '/';
            console.log(mName);
            console.log(mPath);
            self.uploadNewModel(mName, mPath, mName, self.scene, self.envMng);
        });
    }
    UploadManager.prototype.uploadNewModel = function (name, modelPath, modelName, scene, envManager) {
        var self = this;
        var l = lensFlareSystem.mainLensEmitter.length;
        for (var i = 0; i < l; i++) {
            lensFlareSystem.disposeFlareSystem(0);
        }
        while (modelMeshes.length > 0) {
            for (var i = 0; i < modelMeshes.length; i++) {
                scene.materials.splice(scene.materials.indexOf(scene.getMaterialByName(modelMeshes[i].name)), 1);
                scene.getMeshByName(modelMeshes[i].name).dispose();
            }
            for (var i = 0; i < modelMeshes.length; i++) {
                modelMeshes[i] = null;
            }
            if (envMng.environments[envMng.currentEnvironment].groundShadow != null) {
                envMng.environments[envMng.currentEnvironment].groundShadow.dispose();
                envMng.environments[envMng.currentEnvironment].groundShadow = null;
            }
            modelMeshes = [];
        }
        BABYLON.SceneLoader.ImportMesh(null, modelPath, modelName, scene, function (newMeshes) {
            for (var i = 0; i < newMeshes.length; i++) {
                if (newMeshes[i].name.indexOf("Camera_Pivot") > -1) {
                    scene.activeCamera.target = newMeshes[i].position;
                    continue;
                }
                if (newMeshes[i].name.indexOf("Ground_Plane") > -1) {
                    var stdMat = scene.getMaterialByName("Ground_Plane_Material");
                    if (!stdMat) {
                        stdMat = new BABYLON.StandardMaterial("Ground_Plane_Material", scene);
                    }
                    scene.getMaterialByName(newMeshes[i].material.name).dispose();
                    if (newMeshes[i].material)
                        newMeshes[i].material.dispose();
                    stdMat.diffuseTexture = new BABYLON.Texture(self.path + "Ground_Plane.png", scene);
                    stdMat.opacityTexture = new BABYLON.Texture(self.path + "Ground_Plane.png", scene);
                    stdMat.specularColor = BABYLON.Color3.Black();
                    stdMat.diffuseColor = BABYLON.Color3.White();
                    newMeshes[i].isPickable = false;
                    newMeshes[i].renderOutline = false;
                    newMeshes[i].material = stdMat;
                    envManager.environments[envManager.currentEnvironment].groundShadow = newMeshes[i];
                    envManager.environments[envManager.currentEnvironment].groundShadow.setEnabled(envManager.environments[envManager.currentEnvironment].groundShadowEnabled);
                    continue;
                }
                else if (newMeshes[i].name.indexOf("Component_") > -1) {
                    var targetMaterial = new BABYLON.PBRMaterial(newMeshes[i].name, scene);
                    var sourceMaterial = scene.getMaterialByName("Chrome");
                    materialManager.copyMaterial(sourceMaterial, targetMaterial, scene);
                    if (newMeshes[i].material.diffuseTexture)
                        targetMaterial.albedoTexture = newMeshes[i].material.diffuseTexture.clone();
                    targetMaterial.refractionTexture = undefined;
                    scene.getMaterialByName(newMeshes[i].material.name).dispose();
                    if (newMeshes[i].material)
                        newMeshes[i].material.dispose();
                    var url = self.path + newMeshes[i].name.substr(0, 12) + '_AO.jpg';
                    targetMaterial.ambientTexture = new BABYLON.Texture(url, scene);
                    targetMaterial.ambientTexture.coordinatesIndex = 1;
                    newMeshes[i].material = targetMaterial;
                    modelMeshes.push(newMeshes[i]);
                }
                else {
                    scene.getMeshByName(newMeshes[i].name).dispose();
                }
            }
            for (var i = 0; i < scene.meshes.length; i++) {
                var f = false;
                for (var j = 0; j < modelMeshes.length; j++) {
                    if (scene.meshes[i] == modelMeshes[j]) {
                        f = true;
                        break;
                    }
                }
                scene.meshes[i].isBlocker = f;
                scene.meshes[i].isPickable = f;
            }
            var refl = scene.getMeshByName("reflectionPlane").material.reflectionTexture;
            refl.renderList.splice(0, refl.renderList.length);
            refl.renderList.push(scene.getMeshByName("background"));
            refl.renderList.push(scene.getMeshByName("skybox"));
            for (var i = 0; i < modelMeshes.length; i++) {
                refl.renderList.push(modelMeshes[i]);
            }
            for (var i = 0; i < refl.renderList.length; i++) {
                console.log("render list: " + refl.renderList[i].name);
            }
            envManager.setReflection(scene, null);
            for (var i = 0; i < scene.meshes.length; i++) {
                console.log(scene.meshes[i].name);
            }
            var js = '[{"compNum":1,"matName":"Matte Finish"}]';
            materialManager.newModelAdded(js, scene);
            self.uploading = false;
        });
    };
    UploadManager.prototype.applyNewMaterials = function () {
    };
    UploadManager.prototype.applyNewEnvironment = function () {
    };
    UploadManager.prototype.applyNewLensFlares = function () {
    };
    return UploadManager;
}());
var Material = (function () {
    function Material(json, scene) {
        var jsonMat = JSON.parse(json);
        this.name = jsonMat.name;
        this.isGlass = jsonMat.isGlass == "true" ? true : false;
        this.pbr = new BABYLON.PBRMaterial(jsonMat.name, scene);
        this.pbr.albedoColor = BABYLON.Color3.Red();
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
        return '{' +
            '"name":"' + this.pbr.name + '",' +
            '"isGlass":"' + (this.pbr.refractionTexture ? "true" : "false") + '",' +
            '"indexOfRefraction":' + this.pbr.indexOfRefraction.toPrecision(2) + ',' +
            '"alpha":' + this.pbr.alpha.toPrecision(2) + ',' +
            '"directIntensity":' + this.pbr.directIntensity.toPrecision(2) + ',' +
            '"emissiveIntensity":' + this.pbr.emissiveIntensity.toPrecision(2) + ',' +
            '"environmentIntensity":' + this.pbr.environmentIntensity.toPrecision(2) + ',' +
            '"specularIntensity":' + this.pbr.specularIntensity.toPrecision(2) + ',' +
            '"overloadedShadowIntensity":' + this.pbr.overloadedShadowIntensity.toPrecision(2) + ',' +
            '"overloadedShadeIntensity":' + this.pbr.overloadedShadeIntensity.toPrecision(2) + ',' +
            '"cameraExposure":' + this.pbr.cameraExposure.toPrecision(2) + ',' +
            '"cameraContrast":' + this.pbr.cameraContrast.toPrecision(2) + ',' +
            '"microSurface":' + this.pbr.microSurface.toPrecision(2) + ',' +
            '"reflectivityColor":{"r":' + this.pbr.reflectivityColor.r.toPrecision(2) + ', "g":' + this.pbr.reflectivityColor.g.toPrecision(2) + ', "b":' + this.pbr.reflectivityColor.b.toPrecision(2) + '}' +
            '}';
    };
    return Material;
}());
var MaterialManager = (function () {
    function MaterialManager(materials, scene) {
        this.materials = {};
        this.currentComponentMaterial = {};
        var self = this;
        var jsonMat = JSON.parse(materials);
        for (var i = 0; i < jsonMat.length; i++) {
            self.materials[jsonMat[i].name] = new Material(JSON.stringify(jsonMat[i]), scene);
        }
        $('body').on('materialDropped', function (e) {
            var pickResult = scene.pick(e.x, e.y);
            if (pickResult.hit) {
                var sourceMaterial = self.materials[e.name].pbr;
                self.materials[e.name].id = e.model.id;
                var targetMaterial = scene.getMaterialByName(pickResult.pickedMesh.name);
                self.copyMaterial(sourceMaterial, targetMaterial, scene);
                if (self.materials[e.name].isGlass)
                    targetMaterial.refractionTexture = pickResult.pickedMesh.material.reflectionTexture;
                else
                    targetMaterial.refractionTexture = undefined;
                pickResult.pickedMesh.material = targetMaterial;
                self.currentComponentMaterial[pickResult.pickedMesh.name] = e.name;
                console.log(self.ToJson());
            }
        });
    }
    MaterialManager.prototype.cloneMaterial = function (material, scene) {
        var pbr = new BABYLON.PBRMaterial(material.name, scene);
        pbr.albedoColor = BABYLON.Color3.Red();
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
    MaterialManager.prototype.copyMaterial = function (sourceMaterial, targetMaterial, scene) {
        targetMaterial.albedoColor = BABYLON.Color3.White();
        targetMaterial.indexOfRefraction = sourceMaterial.indexOfRefraction;
        targetMaterial.alpha = sourceMaterial.alpha;
        targetMaterial.directIntensity = sourceMaterial.directIntensity;
        targetMaterial.emissiveIntensity = sourceMaterial.emissiveIntensity;
        targetMaterial.environmentIntensity = sourceMaterial.environmentIntensity;
        targetMaterial.specularIntensity = sourceMaterial.specularIntensity;
        targetMaterial.overloadedShadowIntensity = sourceMaterial.overloadedShadowIntensity;
        targetMaterial.overloadedShadeIntensity = sourceMaterial.overloadedShadeIntensity;
        targetMaterial.cameraExposure = sourceMaterial.cameraExposure;
        targetMaterial.cameraContrast = sourceMaterial.cameraContrast;
        targetMaterial.microSurface = sourceMaterial.microSurface;
        targetMaterial.reflectivityColor = new BABYLON.Color3(sourceMaterial.reflectivityColor.r, sourceMaterial.reflectivityColor.g, sourceMaterial.reflectivityColor.b);
    };
    MaterialManager.prototype.ToJson = function () {
        var json = "[";
        for (var i = 0; i < modelMeshes.length; i++) {
            var matName = "Matte Finish";
            if (this.currentComponentMaterial[modelMeshes[i].name])
                matName = this.currentComponentMaterial[modelMeshes[i].name];
            json += '{"compNum":' + modelMeshes[i].name.substring(10, modelMeshes[i].name.length) + ',"id":"' + this.materials[matName].id + '"},';
        }
        if (modelMeshes.length > 0)
            json = json.substring(0, json.length - 1);
        json += "]";
        return json;
    };
    MaterialManager.prototype.newModelAdded = function (json, scene) {
        if (!json || json == "")
            return;
        var jsonMat = JSON.parse(json);
        this.currentComponentMaterial = {};
        for (var i = 0; i < modelMeshes.length; i++) {
            for (var j = 0; j < jsonMat.length; j++) {
                if ("Component_" + jsonMat[j].compNum == modelMeshes[i].name) {
                    var sourceMaterial = this.materials[jsonMat[j].matName].pbr;
                    var targetMaterial = modelMeshes[i].material;
                    this.copyMaterial(sourceMaterial, targetMaterial, scene);
                    if (this.materials[jsonMat[j].matName].isGlass)
                        targetMaterial.refractionTexture = modelMeshes[i].material.reflectionTexture;
                    else
                        targetMaterial.refractionTexture = undefined;
                    modelMeshes[i].material = targetMaterial;
                    this.currentComponentMaterial[modelMeshes[i].name] = sourceMaterial.name;
                    break;
                }
            }
        }
    };
    return MaterialManager;
}());
var Card = (function () {
    function Card(scene, camera) {
        var self = this;
        this.texture = new BABYLON.DynamicTexture("texture", { width: 1000, height: 320 }, scene, true);
        this.texture.hasAlpha = true;
        var textureBackground = new BABYLON.Texture("./textures/cards/callout_1.png", scene);
        textureBackground.hasAlpha = true;
        this.ctx = this.texture.getContext();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "80px Helvetica";
        this.ctx.fillText("Card Test", 20, 100, 1024);
        this.ctx.imageSmoothingEnabled = true;
        var planeTextMaterial = new BABYLON.StandardMaterial("texture", scene);
        planeTextMaterial.diffuseTexture = textureBackground;
        planeTextMaterial.emissiveTexture = this.texture;
        planeTextMaterial.specularColor = BABYLON.Color3.Black();
        var planeBackgroundMaterial = new BABYLON.StandardMaterial("textureBackground", scene);
        planeBackgroundMaterial.diffuseTexture = textureBackground;
        planeBackgroundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.card = BABYLON.MeshBuilder.CreatePlane("planeBackground", { width: 1.5, height: 0.48 }, scene);
        this.card.position.y = 1.5;
        this.card.position.x = -2;
        this.card.material = planeTextMaterial;
        this.texture.update();
    }
    Card.prototype.update = function (scene) {
        this.card.rotation.y = -scene.activeCamera.alpha - (Math.PI / 2);
        this.card.rotation.x = -scene.activeCamera.beta + (Math.PI / 2);
    };
    return Card;
}());
var sceneMain;
var envUI;
var envMng;
var uploadManager;
var materialManager;
var lensFlareSystem;
var modelMeshes = new Array();
var testSprite;
var canvas;
var engine;
var camera;
function createScene(params) {
    var scene = new BABYLON.Scene(engine);
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 6, new BABYLON.Vector3(0, .5, 0), scene);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 6;
    camera.upperBetaLimit = 1.6;
    camera.wheelPrecision = 50;
    camera.attachControl(canvas, true);
    camera.setPosition(new BABYLON.Vector3(0.0045, 0.7674, -2.9880));
    camera.minZ = 0.01;
    camera.maxZ = 100;
    scene.activeCamera = camera;
    var environments = '[{"id":1,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-1/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":0,"range":0}]},{"id":2,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-2/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":3,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-3/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"id":4,"backgroundColor":{"r":0,"g":0,"b":0},"skyboxURL":"./textures/skybox/env-4/","lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"angle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]';
    var materials = '[{"name":"Chrome","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.3,"emissiveIntensity":0.95,"environmentIntensity":1.0,"specularIntensity":2.0,"overloadedShadowIntensity":1.1,"overloadedShadeIntensity":1.0,"cameraExposure":1.3,"cameraContrast":0.93,"microSurface":1,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Copper","isGlass":"false","indexOfRefraction":0.33,"alpha":0.98,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":1.0,"specularIntensity":0.11,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":0.88,"microSurface":0.75,"reflectivityColor":{"r":1.0,"g":0.77,"b":0.50}},{"name":"Brushed Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.99,"specularIntensity":0.22,"overloadedShadowIntensity":1.87,"overloadedShadeIntensity":2,"cameraExposure":1.03,"cameraContrast":1.54,"microSurface":0.49,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Rubber","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":1.0,"emissiveIntensity":1.0,"environmentIntensity":0.066,"specularIntensity":2.0,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.1,"microSurface":0.25,"reflectivityColor":{"r":0.26,"g":0.26,"b":0.26}},{"name":"Matte Finish","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1,"emissiveIntensity":1,"environmentIntensity":0.15438344215528121,"specularIntensity":1,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1,"cameraContrast":1,"microSurface":0.07719172107764061,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Clear Glass","isGlass":"true","indexOfRefraction":0.24,"alpha":0.34,"directIntensity":1.1,"emissiveIntensity":1.0,"environmentIntensity":0.68,"specularIntensity":0.49,"overloadedShadowIntensity":0.64,"overloadedShadeIntensity":1.0,"cameraExposure":1.7,"cameraContrast":1.0,"microSurface":1.0,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Dark Metal","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.15,"emissiveIntensity":1.0,"environmentIntensity":0.29,"specularIntensity":0.49,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.8,"microSurface":0.98,"reflectivityColor":{"r":1.0,"g":1.0,"b":1.0}},{"name":"Frosted Glass","isGlass":"true","indexOfRefraction":0.11,"alpha":0.71,"directIntensity":0.37,"emissiveIntensity":1,"environmentIntensity":0.28,"specularIntensity":0.48,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":2,"cameraContrast":1.83,"microSurface":0.28,"reflectivityColor":{"r":1,"g":1,"b":1}},{"name":"Felt","isGlass":"false","indexOfRefraction":0.72,"alpha":1,"directIntensity":1.36,"emissiveIntensity":0.57,"environmentIntensity":1.85,"specularIntensity":1.19,"overloadedShadowIntensity":0.86,"overloadedShadeIntensity":1.08,"cameraExposure":1.36,"cameraContrast":1.01,"microSurface":0.05,"reflectivityColor":{"r":0,"g":0,"b":0}},{"name":"Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.43,"emissiveIntensity":0.06,"environmentIntensity":0.02,"specularIntensity":0.08,"overloadedShadowIntensity":0.97,"overloadedShadeIntensity":1,"cameraExposure":1.45,"cameraContrast":1.49,"microSurface":0.43,"reflectivityColor":{"r":0.56,"g":0.56,"b":0.56}},{"name":"Glossy Plastic","isGlass":"false","indexOfRefraction":0.66,"alpha":1.0,"directIntensity":0.93,"emissiveIntensity":1.2,"environmentIntensity":0.31,"specularIntensity":0.20,"overloadedShadowIntensity":1.0,"overloadedShadeIntensity":1.0,"cameraExposure":1.0,"cameraContrast":1.0,"microSurface":0.66,"reflectivityColor":{"r":0.30,"g":0.30,"b":0.30}},{"name":"Flat Surface","isGlass":"false","indexOfRefraction":0.66,"alpha":1,"directIntensity":1.34,"emissiveIntensity":0,"environmentIntensity":0,"specularIntensity":0,"overloadedShadowIntensity":1,"overloadedShadeIntensity":1,"cameraExposure":1.34,"cameraContrast":1,"microSurface":0,"reflectivityColor":{"r":0,"g":0,"b":0}}]';
    envMng = new EnvironmentManager(environments, scene);
    envUI = new EnvironmentUI(envMng, scene);
    lensFlareSystem = new LensFlareSystem(scene, null);
    materialManager = new MaterialManager(materials, scene);
    uploadManager = new UploadManager(scene, envMng);
    scene.executeWhenReady(function () {
        console.log(save());
    });
    return scene;
}
function save() {
    var json = "{";
    json += '"id":"' + uploadManager.id + '",';
    json += '"materials":' + materialManager.ToJson() + ',';
    json += '"flares":' + lensFlareSystem.ToJSON() + "}";
    return json;
}
function startApplication(params) {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    sceneMain = createScene(params);
    engine.runRenderLoop(function () {
        sceneMain.render();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
}
