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
        //dynamicTexture.wrapU = BABYLON.Texture.add;
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
