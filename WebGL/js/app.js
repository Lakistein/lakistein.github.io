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
            _this.environmentManager.turnBackgroundOnOff(ev.srcElement.checked);
        };
        document.getElementById("shadows").onchange = function (ev) {
            _this.environmentManager.turnShadowOffOn(ev.srcElement.checked);
        };
        document.getElementById("groundPlaneCheckbox").onchange = function (ev) {
            _this.environmentManager.turnGroundPlaneOffOn(ev.srcElement.checked);
        };
        document.getElementById("groundPlaneSize").onchange = function (ev) {
            _this.environmentManager.changeGroundPlaneSize(parseFloat(ev.srcElement.value));
        };
        document.getElementById("gradientTop").onchange = function (ev) {
            _this.environmentManager.changeTopGradient(ev.srcElement.value);
        };
        document.getElementById("gradientBottom").onchange = function (ev) {
            _this.environmentManager.changeBottomGradient(ev.srcElement.value);
        };
        document.getElementById("gradientOffset").onchange = function (ev) {
            _this.environmentManager.changeGradientOffset(parseFloat(ev.srcElement.value));
        };
        document.getElementById("reflective").onchange = function (ev) {
            _this.environmentManager.turnReflectivePlaneOffOn(ev.srcElement.checked);
        };
        document.getElementById("reflectionAmount").onchange = function (ev) {
            _this.environmentManager.changeReflectionAmount(parseFloat(ev.srcElement.value));
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
var TextCanvas = (function () {
    function TextCanvas(jsonCanv, index, scene) {
        if (!jsonCanv)
            return;
        this.id = jsonCanv.id;
        this.scene = scene;
        this.titleText = jsonCanv.text;
        this.width = jsonCanv.width;
        this.height = jsonCanv.height;
        this.position = new BABYLON.Vector3(jsonCanv.position.x, jsonCanv.position.y, jsonCanv.position.z);
        this.descriptionText = jsonCanv.description;
        this.titleMesh = this.createTextMesh(index, this.titleText, this.width, this.height, 2, jsonCanv.position, 'rgba(255, 255, 255, 1)', scene, 'black');
        this.titleMesh.renderingGroupId = 2;
        this.descriptionMesh = this.createTextMesh('text-' + index, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 0, 0, 0)', scene, 'white');
        this.descriptionMesh.isPickable = false;
        this.descriptionMesh.showBoundingBox = true;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
    }
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
    TextCanvas.prototype.createText = function (text, backgroundColor, scene, textColor) {
        var dynamicTexture = new BABYLON.DynamicTexture('dynamic texture', { width: this.width * 2048, height: this.height * 512 }, scene, false);
        dynamicTexture.hasAlpha = true;
        var texts = text.split("\n");
        for (var i = 0; i < texts.length; i++) {
            dynamicTexture.drawText(texts[i], 5, i * 30 + 30, '30pt Arial', textColor, backgroundColor);
        }
        return dynamicTexture;
    };
    ;
    TextCanvas.prototype.createTextMesh = function (name, text, width, height, textureWidth, position, backgroundColor, scene, textColor) {
        var textMesh = this.createMesh(name, width, height, true, scene, true);
        textMesh.position.x = position.x;
        textMesh.position.y = position.y;
        textMesh.position.z = position.z;
        var textMaterial = new BABYLON.StandardMaterial(name + '-material', scene);
        textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        textMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        textMaterial.diffuseTexture = this.createText(text, backgroundColor, scene, textColor);
        textMaterial.useAlphaFromDiffuseTexture = true;
        textMesh.material = textMaterial;
        return textMesh;
    };
    ;
    TextCanvas.prototype.updateTitleText = function (text) {
        this.titleMesh.material.diffuseTexture = this.createText(text, 'rgba(255, 255, 255, 1)', this.scene, 'black');
    };
    TextCanvas.prototype.updateDescriptionText = function (text) {
        this.descriptionMesh.material.diffuseTexture = this.createText(text, 'rgba(0, 0, 0, 0)', this.scene, 'white');
    };
    TextCanvas.prototype.updateWidth = function (value) {
        this.width = value;
        var temp = this.createTextMesh(this.id, this.titleText, this.width, this.height, 2, this.position, 'rgba(255, 255, 255, 1)', this.scene, 'black');
        this.titleMesh.dispose();
        this.titleMesh = temp;
        this.titleMesh.renderingGroupId = 2;
        temp = this.createTextMesh(this.id, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 0, 0, 0)', this.scene, 'white');
        this.descriptionMesh.dispose();
        this.descriptionMesh = temp;
        this.descriptionMesh.isPickable = false;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
    };
    TextCanvas.prototype.updateHeight = function (value) {
        this.height = value;
        var temp = this.createTextMesh(this.id, this.titleText, this.width, this.height, 2, this.position, 'rgba(255, 255, 255, 1)', this.scene, 'black');
        this.titleMesh.dispose();
        this.titleMesh = temp;
        this.titleMesh.renderingGroupId = 2;
        temp = this.createTextMesh(this.id, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 0, 0, 0)', this.scene, 'white');
        this.descriptionMesh.dispose();
        this.descriptionMesh = temp;
        this.descriptionMesh.isPickable = false;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
    };
    return TextCanvas;
})();
var TextCanvasManager = (function () {
    function TextCanvasManager(json, scene) {
        var _this = this;
        this.textCanvases = [];
        this.lines = [];
        this.rays = [];
        this.alterAnchorPoint = false;
        var jsonCanv = JSON.parse(json);
        for (var i = 0; i < jsonCanv.length; i++) {
            this.textCanvases.push(new TextCanvas(jsonCanv[i], i.toString(), scene));
            var pos = this.textCanvases[i].titleMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            if (i == 0)
                var points = [new BABYLON.Vector3(0.008, 0.601, -1.2), new BABYLON.Vector3(this.textCanvases[i].position.x - this.textCanvases[i].width / 2, this.textCanvases[i].position.y + this.textCanvases[i].height / 2, this.textCanvases[i].position.z)];
            if (i == 1)
                var points = [new BABYLON.Vector3(-1.1941039015072528, 0.7389552891732385, -0.2917178395064628), new BABYLON.Vector3(this.textCanvases[i].position.x - this.textCanvases[i].width / 2, this.textCanvases[i].position.y + this.textCanvases[i].height / 2, this.textCanvases[i].position.z)];
            this.lines.push(BABYLON.Mesh.CreateLines("line" + i, points, scene, true));
            this.lines[i].renderingGroupId = 2;
            if (i == 0)
                this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(0.008, 0.601, -1.2)));
            if (i == 1)
                this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(-1.1941039015072528, 0.7389552891732385, -0.2917178395064628)));
        }
        var ground = BABYLON.Mesh.CreatePlane("ground", 15, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
        ground.lookAt(scene.activeCamera.position, 0, 0, 0);
        ground.renderingGroupId = 1;
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
            if (!_this.alterAnchorPoint)
                document.getElementById("TextCanvasEditor").style.visibility = 'hidden';
            if (_this.alterAnchorPoint) {
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                    for (var i = 0; i < _this.textCanvases.length; i++) {
                        if (_this.textCanvases[i].titleMesh == mesh || _this.textCanvases[i].descriptionMesh == mesh)
                            return false;
                    }
                    return true;
                });
                if (pickInfo.hit) {
                    console.log(pickInfo.pickedPoint);
                    pointss[currentMesh.name][0] = pickInfo.pickedPoint.x;
                    pointss[currentMesh.name][1] = pickInfo.pickedPoint.y;
                    pointss[currentMesh.name][2] = pickInfo.pickedPoint.z;
                    _this.lines[currentMesh.name].updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, pointss[currentMesh.name]);
                }
                return;
            }
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    if (_this.textCanvases[i].titleMesh == mesh)
                        return true;
                }
                return false;
            });
            if (pickInfo.hit) {
                currentMesh = null;
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    if (pickInfo.pickedMesh == _this.textCanvases[i].titleMesh) {
                        currentMesh = pickInfo.pickedMesh;
                        break;
                    }
                }
                if (!currentMesh)
                    return;
                document.getElementById("TextCanvasEditor").style.visibility = 'visible';
                document.getElementById("titleCanvas").value = (_this.textCanvases[currentMesh.name]).titleText;
                document.getElementById("descriptionCanvas").value = (_this.textCanvases[currentMesh.name]).descriptionText;
                document.getElementById('textCanvasWidth').value = (_this.textCanvases[currentMesh.name]).width.toString();
                document.getElementById('textCanvasHeight').value = (_this.textCanvases[currentMesh.name]).height.toString();
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
            var diff = current.subtract(startingPoint);
            currentMesh.position.addInPlace(diff);
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
        var pointss = [];
        var arr = [];
        var vertex = [];
        for (var i = 0; i < this.lines.length; i++) {
            pointss.push(this.lines[i].getVerticesData(BABYLON.VertexBuffer.PositionKind));
            arr.push(this.textCanvases[i].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
            vertex.push(BABYLON.Vector3.FromArray(arr[i], 0));
        }
        document.getElementById("titleCanvas").onchange = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateTitleText(ev.srcElement.value);
        };
        document.getElementById("descriptionCanvas").onchange = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateDescriptionText(ev.srcElement.value);
        };
        document.getElementById("textCanvasWidth").onchange = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateWidth(parseFloat(ev.srcElement.value));
        };
        document.getElementById("textCanvasHeight").onchange = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateHeight(parseFloat(ev.srcElement.value));
        };
        document.getElementById("anchorPoint").onchange = function (ev) {
            _this.alterAnchorPoint = ev.srcElement.checked;
        };
        var count = 0;
        scene.registerBeforeRender(function () {
            if (scene.activeCamera)
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    _this.textCanvases[i].titleMesh.lookAt(scene.activeCamera.position, 0, 0, 0);
                    console.log(pointss[0][3]);
                    if (count % 3 == 0) {
                        var pos = BABYLON.Vector3.TransformCoordinates(vertex[i], _this.textCanvases[i].descriptionMesh.getWorldMatrix());
                        pointss[i][3] = pos.x;
                        pointss[i][4] = pos.y;
                        pointss[i][5] = pos.z;
                        _this.lines[i].updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, pointss[i]);
                    }
                }
            ground.lookAt(scene.activeCamera.position, 0, 0, 0);
            count++;
            var rad = scene.activeCamera.radius / 2;
            for (var i = 0; i < _this.textCanvases.length; i++) {
                _this.textCanvases[i].titleMesh.scaling = new BABYLON.Vector3(rad, rad, rad);
            }
            if (count < 20)
                return;
            count = 0;
            for (var i = 0; i < _this.rays.length; i++) {
                if (i == 0)
                    _this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(0.008, 0.601, -1.2));
                if (i == 1)
                    _this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(-1.1941039015072528, 0.7389552891732385, -0.2917178395064628));
                var meshFound = scene.pickWithRay(_this.rays[i], function (mesh) {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (mesh == modelMeshes[i])
                            return true;
                    }
                    return false;
                });
                if (meshFound.hit) {
                    _this.lines[i].isVisible = false;
                    _this.textCanvases[i].titleMesh.isVisible = false;
                    _this.textCanvases[i].descriptionMesh.isVisible = false;
                }
                else {
                    _this.lines[i].isVisible = true;
                    _this.textCanvases[i].titleMesh.isVisible = true;
                    _this.textCanvases[i].descriptionMesh.isVisible = true;
                }
            }
        });
    }
    return TextCanvasManager;
})();
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
        var count = 0;
        var meshFound = new BABYLON.PickingInfo();
        scene.registerBeforeRender(function () {
            count++;
            if (count > 5) {
                count = 0;
                var rayPick = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, mainLensEmitter.position);
                meshFound = scene.pickWithRay(rayPick, function (mesh) {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (mesh == modelMeshes[i])
                            return true;
                    }
                    return false;
                });
            }
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
var sceneMain;
var envUI;
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
            var json = '[{"id":0,"text":"Red Plastic","description":"Scratch Resistant","width":0.5,"height":0.06,"position":{"x":2,"y":1,"z":0}},{"id":1,"text":"Chrome","description":"Durable Metal","width":0.5,"height":0.06,"position":{"x":-2,"y":1,"z":0}}]';
            var textCanv = new TextCanvasManager(json, scene);
        });
        return scene;
    }
    sceneMain = createScene();
    var lensFlareSystem = new LensFlareSystem(sceneMain);
    var fps = document.getElementById("fps");
    engine.runRenderLoop(function () {
        sceneMain.render();
        fps.innerText = engine.getFps().toString();
    });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
