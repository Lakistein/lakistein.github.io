/// <reference path="babylon.d.ts" />

class TextCanvas {
    id: string;
    titleText: string;
    descriptionText: string;
    width: number;
    height: number;
    position: BABYLON.Vector3;
    titleMesh: BABYLON.Mesh;
    descriptionMesh: BABYLON.Mesh;
    scene: BABYLON.Scene;
    enabled: boolean = true;
    titleHeight: number;

    constructor(jsonCanv: any, index: string, scene: BABYLON.Scene) {
        if (!jsonCanv) return;

        this.id = jsonCanv.id;
        this.scene = scene;
        this.titleText = jsonCanv.text;
        this.width = jsonCanv.width;
        this.titleHeight = jsonCanv.height;
        this.height = jsonCanv.height;
        this.position = new BABYLON.Vector3(jsonCanv.position.x, jsonCanv.position.y, jsonCanv.position.z);
        this.descriptionText = jsonCanv.description;
        this.titleMesh = this.createTextMesh(index, this.titleText, this.width, this.titleHeight, 2, jsonCanv.position, 'rgba(255, 255, 255, 1)', scene, 'black', this.titleHeight);
        this.titleMesh.renderingGroupId = 2;
        //this.createTexts(this.descriptionText, this.width + 0.3, this.height + 0.3, new BABYLON.Vector3(0, -this.height, 0), scene);
        this.descriptionMesh = this.createTextMesh('text-' + index, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 0, 0, 0)', scene, 'white', this.height);
        this.descriptionMesh.isPickable = false;
        this.descriptionMesh.showBoundingBox = true;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
        this.enabled = true;
    }

    createMesh(name, width, height, isPickable, scene, updatable) {
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

    createText(text: string, backgroundColor, scene, textColor, height) {
        var dynamicTexture = new BABYLON.DynamicTexture('dynamic texture', { width: this.width * 1024, height: height * 512 }, scene, false);
        dynamicTexture.hasAlpha = true;
        var texts = text.split("\n");
        for (var i = 0; i < texts.length; i++) {
            dynamicTexture.drawText(texts[i], 5, i * 25 + 25, '23pt Arial', textColor, backgroundColor);
        }

        return dynamicTexture;
    };

    createTextMesh(name, text, width, height, textureWidth, position, backgroundColor, scene, textColor, textHeight) {
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
    wrapText(context, text, x, y, maxWidth, lineHeight) {
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
            }//napravi ovo kako treba
        }
        context.fillText(line, x, y);
    }
    updateTitleText(text: string) {
        this.titleText = text;
        var textureContext = (<BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>this.titleMesh.material).diffuseTexture).getContext();
        //textureContext.font = "bold 40px Calibri";
        textureContext.save();
        textureContext.fillStyle = "white";
        textureContext.textAlign = "left";
        this.wrapText(textureContext, this.descriptionText, 0, 80, this.width, 25);
        textureContext.restore();
        (<BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>this.descriptionMesh.material).diffuseTexture).update();
    }

    updateDescriptionText(text: string) {
        this.descriptionText = text;
        (<BABYLON.StandardMaterial>this.descriptionMesh.material).diffuseTexture = this.createText(this.descriptionText, 'rgba(0, 0, 0, 0)', this.scene, 'white', this.height);
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
    }

    updateWidth(value: number) {
        var oldW = this.width;
        var oldPos = this.titleMesh.position.x;
        this.width = value;
        var temp = this.createTextMesh(this.id, this.titleText, this.width, this.titleHeight, 2, this.position, 'rgba(255, 255, 255, 1)', this.scene, 'black', this.titleHeight);
        this.titleMesh.dispose();
        this.titleMesh = temp;
        this.titleMesh.renderingGroupId = 2
        this.titleMesh.position.x = oldPos + value / 2 - oldW / 2;
        temp = this.createTextMesh(this.id, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 0, 0, 0)', this.scene, 'white', this.height);
        this.descriptionMesh.dispose();
        this.descriptionMesh = temp;
        this.descriptionMesh.isPickable = false;
        this.descriptionMesh.showBoundingBox = true;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
        this.descriptionMesh.position.y = this.descriptionMesh.position.y + this.height / 2 - this.titleHeight / 2;
    }

    updateHeight(value: number) {
        this.height = value;

        var temp = this.createTextMesh(this.id, this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -this.height, 0), 'rgba(0, 0, 0, 0)', this.scene, 'white', this.height);
        this.descriptionMesh.dispose();
        this.descriptionMesh = temp;
        this.descriptionMesh.position.y = this.descriptionMesh.position.y + this.height / 2 - this.titleHeight / 2;
        this.descriptionMesh.isPickable = false;
        this.descriptionMesh.showBoundingBox = true;
        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
    }

    // createTexts(text, width, height, position, scene: BABYLON.Scene) {

    //     var panel = this.createMesh("", width, height, true, scene, true);
    //     // panel.showBoundingBox = true;
    //     // panel.outline = 1;
    //     panel.position = position;
    //     panel.rotation = new BABYLON.Vector3(0, 0, 0);

    //     var panmat = new BABYLON.StandardMaterial("panmat", scene);
    //     panel.material = panmat;
    //     var panelTexture = new BABYLON.DynamicTexture("dyntex", 0, scene, true);
    //     panelTexture.hasAlpha = true;
    //     var ptSize = panelTexture.getSize();
    //     panmat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    //     panmat.specularColor = new BABYLON.Color3(0, 0, 0);
    //     panmat.diffuseTexture = panelTexture;

    //     var getPowerOfTwo = function(value, pow) {
    //         var pow = pow || 1;
    //         while (pow < value) {
    //             pow *= 2;
    //         }
    //         return pow;
    //     };

    //     var measureText = function(ctx, textToMeasure) {
    //         var textwidth = ctx.measureText(textToMeasure).width;
    //         return textwidth;
    //     };

    //     var createMultilineText = function(ctx, textToWrite, maxWidth, text) {
    //         textToWrite = textToWrite.replace("\n", " ");
    //         var currentText = textToWrite;
    //         var futureText;
    //         var subWidth = 0;
    //         var maxLineWidth = 0;

    //         var wordArray = textToWrite.split(" ");
    //         var wordsInCurrent, wordArrayLength;
    //         wordsInCurrent = wordArrayLength = wordArray.length;

    //         while (measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1) {
    //             wordsInCurrent--;
    //             var linebreak = false;

    //             currentText = futureText = "";
    //             for (var i = 0; i < wordArrayLength; i++) {
    //                 if (i < wordsInCurrent) {
    //                     currentText += wordArray[i];
    //                     if (i + 1 < wordsInCurrent) { currentText += " "; }
    //                 }
    //                 else {
    //                     futureText += wordArray[i];
    //                     if (i + 1 < wordArrayLength) { futureText += " "; }
    //                 }
    //             }
    //         }
    //         text.push(currentText);
    //         maxLineWidth = measureText(ctx, currentText);

    //         if (futureText) {
    //             subWidth = createMultilineText(ctx, futureText, maxWidth, text);
    //             if (subWidth > maxLineWidth) {
    //                 maxLineWidth = subWidth;
    //             }
    //         }

    //         return maxLineWidth;
    //     };

    //     var drawText = function(textObj) {
    //         var canvasX, canvasY;
    //         var textX, textY;
    //         var ctx;

    //         var text = [];
    //         var textToWrite = textObj.textToWrite;
    //         var maxWidth = textObj.maxWidth;

    //         var squareTexture = textObj.squareTexture;

    //         var textHeight = textObj.textHeight;
    //         var textAlignment = textObj.textAlignment;
    //         var textColor = textObj.textColor;
    //         var fontFamily = textObj.fontFamily;

    //         var backgroundColor = textObj.backgroundColor;

    //         ctx = textObj.canvas.getContext('2d');


    //         if (maxWidth && measureText(ctx, textToWrite) > maxWidth) {
    //             maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
    //             canvasX = getPowerOfTwo(maxWidth);
    //         } else {
    //             text.push(textToWrite);
    //             canvasX = getPowerOfTwo(measureText(ctx, textToWrite).width);
    //         }

    //         canvasY = getPowerOfTwo(textHeight * (text.length + 1));

    //         if (squareTexture) {
    //             (canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;
    //         }
    //         textObj.canvas.width = canvasX;
    //         textObj.canvas.height = canvasY;

    //         switch (textAlignment) {
    //             case "left":
    //                 textX = 0;
    //                 break;
    //             case "center":
    //                 textX = canvasX / 2;
    //                 break;
    //             case "right":
    //                 textX = canvasX;
    //                 break;
    //         }
    //         textY = canvasY / 2;
    //         ctx.fillStyle = backgroundColor;
    //         ctx.fillRect(0, 0, textObj.canvas.width, textObj.canvas.height);

    //         ctx.fillStyle = textColor;
    //         ctx.textAlign = textAlignment;

    //         ctx.textBaseline = 'middle';
    //         ctx.font = textHeight + "px " + fontFamily;

    //         var Yoffset = (canvasY - textHeight * (text.length + 1)) * 0.5;

    //         for (var i = 0; i < text.length; i++) {
    //             if (text.length > 1) {
    //                 textY = (i + 1) * textHeight + Yoffset;
    //             }
    //             ctx.fillText(text[i], textX, textY);
    //         }

    //         panelTexture.update();
    //     };

    //     var tobj = {};
    //     tobj.canvas = panelTexture._canvas;
    //     tobj.maxWidth = this.width;
    //     tobj.squareTexture = 1;
    //     tobj.textHeight = 5;
    //     tobj.textAlignment = "left";
    //     tobj.textColor = "#fff";
    //     tobj.fontFamily = "Arial";
    //     tobj.backgroundColor = 'rgba(0, 0, 0, 0)';
    //     tobj.textToWrite = text;

    //     drawText(tobj);

    //     return panel;
    // }
}