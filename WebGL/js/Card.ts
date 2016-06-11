/// <reference path="babylon.d.ts" />

class Card
{
    texture: BABYLON.DynamicTexture;
    ctx: CanvasRenderingContext2D;
    card: BABYLON.Mesh;
    
    constructor(scene : BABYLON.Scene, camera : BABYLON.ArcRotateCamera)
    {
        var self = this;
        
        this.texture = new BABYLON.DynamicTexture("texture", {width: 1000, height: 320}, scene, true);
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
        
        //this.card.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        
        this.texture.update();
    }
    
    update(scene) : void
    {
        this.card.rotation.y = -(<BABYLON.ArcRotateCamera>scene.activeCamera).alpha - (Math.PI / 2);
        this.card.rotation.x = -(<BABYLON.ArcRotateCamera>scene.activeCamera).beta + (Math.PI / 2);
    }
    
    
}


