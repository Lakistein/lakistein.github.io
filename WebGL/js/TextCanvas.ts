/// <reference path="babylon.d.ts" />


class TextCanvas {
    titleText: string;
    descriptionText: string;
    width: number;
    height: number;
    position: BABYLON.Vector3;
    titleMesh: BABYLON.Mesh;
    descriptionMesh: BABYLON.Mesh;
    scene: BABYLON.Scene;

    constructor(jsonCanv: any, index: string, scene: BABYLON.Scene) {
        if (!jsonCanv) return;
        this.scene = scene;
        this.titleText = jsonCanv.text;
        this.width = jsonCanv.width;
        this.height = jsonCanv.height;
        this.position = new BABYLON.Vector3(jsonCanv.position.x, jsonCanv.position.y, jsonCanv.position.z);
        this.descriptionText = jsonCanv.description;
        this.titleMesh = this.createTextMesh(index, this.titleText, this.width, this.height, 2, jsonCanv.position, 'rgba(0, 0, 0, 0.5)', scene);
        this.titleMesh.renderingGroupId = 2;

        this.descriptionMesh = this.createTextMesh('-text-audio2', this.descriptionText, this.width, this.height, 2, new BABYLON.Vector3(0, -.1, 0), 'rgba(0, 0, 0, 0)', scene);
        this.descriptionMesh.isPickable = false;

        this.descriptionMesh.renderingGroupId = 3;
        this.descriptionMesh.parent = this.titleMesh;
    }

    createMesh(name, width, height, isPickable, scene, updatable) {
                //if(this.titleMesh) this.titleMesh.dispose();

        var plane = new BABYLON.Mesh(name, scene);

        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];

        // Vertices
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

        // Indices
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

    createText(text: string, backgroundColor, scene) {
        var dynamicTexture = new BABYLON.DynamicTexture('dynamic texture', 512, scene, true);
        // dynamicTexture.uScale = 0.7;
        // dynamicTexture.vScale = 0.054;
        // dynamicTexture.vOffset = -9;
        // dynamicTexture.uOffset = 0.25;
        dynamicTexture.hasAlpha = true;
        var texts = text.split('\n');
        for (var i = 0; i < texts.length; i++) {
            dynamicTexture.drawText(texts[i], 5, i * 60 + 60, '70px Arial', 'white', backgroundColor);
        }

        return dynamicTexture;
    };

    createTextMesh(name, text, width, height, textureWidth, position, backgroundColor, scene) {
        var textMesh = this.createMesh(name, width, height, true, scene, true);

        textMesh.position.x = position.x;
        textMesh.position.y = position.y;
        textMesh.position.z = position.z;

        var textMaterial = new BABYLON.StandardMaterial(name + '-material', scene);
        textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        textMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        textMaterial.diffuseTexture = this.createText(text, backgroundColor, scene);
        textMaterial.useAlphaFromDiffuseTexture = true;

        textMesh.material = textMaterial;
        return textMesh;
    };

    updateTitleText(text: string) {
        (<BABYLON.StandardMaterial>this.titleMesh.material).diffuseTexture = this.createText(text, 'rgba(0, 0, 0, 0.5)', this.scene);
    }

    updateDescriptionText(text: string) {
        (<BABYLON.StandardMaterial>this.descriptionMesh.material).diffuseTexture = this.createText(text, 'rgba(0, 0, 0, 0)', this.scene);
    }

    updateWidth(value: number) {
        this.titleMesh.scaling = new BABYLON.Vector3(value, this.titleMesh.scaling.y, this.titleMesh.scaling.z)
        this.width = value;
        // this.updateTitleText(this.titleText);
        // var height = 0.25//= document.getElementById('textCanvasHeight').value;
        // var indices = [];
        // var positions: Float32Array = this.titleMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        //  var normals: Float32Array = this.titleMesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        //  var uvs: Float32Array = this.titleMesh.getVerticesData(BABYLON.VertexBuffer.UVKind);
        // console.log(value);
        // console.log(height);

        // Vertices
        // this.width = value;
        // var halfWidth = value / 2.0;
        // var halfHeight = height / 2.0;
        // positions[0] = -halfWidth;
        // positions[1] = -halfHeight;
        // positions[2] = 0;
        //  normals[0] = (0, 0, -1.0);
        //   uvs[0] = (0.0, 0.0);

        // positions[3] = halfWidth;
        // positions[4] = -halfHeight;
        // positions[5] = 0;
        //  normals[1] = (0, 0, -1.0);
        //  uvs[1] = (1.0, 0.0);

        // positions[6] = halfWidth;
        // positions[7] = halfHeight;
        // positions[8] = 0;
        //  normals[2] = (0, 0, -1.0);
        //  uvs[2] = (1.0, 1.0);

        // positions[9] = -halfWidth;
        // positions[10] = halfHeight;
        // positions[11] = 0;
        //  normals[3] = (0, 0, -1.0);
        //  uvs[3] = (0.0, 1.0);

        // Indices


        // this.titleMesh.updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, positions);
        //   this.titleMesh.updateVerticesDataDirectly(BABYLON.VertexBuffer.NormalKind, normals);
        //    this.titleMesh.updateVerticesDataDirectly(BABYLON.VertexBuffer.UVKind, uvs);
        // this.titleMesh.setIndices(indices);
    }

    updateHeight(value: number) {
        this.height = value;
        this.titleMesh.scaling = new BABYLON.Vector3(this.titleMesh.scaling.x, value, this.titleMesh.scaling.z)
    }
}