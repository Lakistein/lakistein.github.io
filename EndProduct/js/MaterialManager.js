/// <reference path="babylon.d.ts" />
/// <reference path="Material.ts" />
var MaterialManager = (function () {
    function MaterialManager(materials, scene) {
        this.materials = {};
        var jsonMat = JSON.parse(materials);
        // var htmlElement = document.getElementById("materialBody");
        for (var i = 0; i < jsonMat.length; i++) {
            this.materials[jsonMat[i].name] = new Material(JSON.stringify(jsonMat[i]), scene);
        }
        // var file = document.getElementsByClassName('material');
        // var startdrag = (evt) => {
        //     evt.dataTransfer.setData("text", evt.target.alt);
        // }
        // for (var i = 0; i < file.length; i++) {
        //     (<HTMLElement>file[i]).addEventListener('dragstart', startdrag, false);
        // }
        // var canvas = scene.getEngine().getRenderingCanvas();
        // var dragover = (evt) => {
        //     evt.preventDefault();
        //     var pickResult = scene.pick(evt.offsetX, evt.offsetY);
        //     for (var i = 0; i < modelMeshes.length; i++) {
        //         modelMeshes[i].renderOutline = false;
        //     }
        //     if (pickResult.hit) {
        //         pickResult.pickedMesh.renderOutline = true;
        //     }
        // }
        // var drop = (evt) => {
        //     debugger;
        //     evt.preventDefault();
        //     var mat = this.cloneMaterial((<Material>this.materials[evt.dataTransfer.getData("text")]).pbr, scene);
        //     var pickResult = scene.pick(evt.offsetX, evt.offsetY);
        //     if (pickResult.hit) {
        //         mat.albedoTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).albedoTexture;
        //         mat.ambientTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).ambientTexture;
        //         mat.reflectionTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).reflectionTexture;
        //         if (this.materials[evt.dataTransfer.getData("text")].isGlass)
        //             mat.refractionTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).reflectionTexture;
        //         else
        //             mat.refractionTexture = undefined;
        //         // mat.emissiveColor = BABYLON.Color3.White();
        //         pickResult.pickedMesh.material = mat;
        //         pickResult.pickedMesh.renderOutline = false;
        //         //displayMaterialValues(mat, scene);
        //     }
        // }
        // canvas.addEventListener('dragover', dragover, false);
        // canvas.addEventListener('drop', drop, false);
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
    MaterialManager.prototype.getMaterial = function (name, scene) {
        return this.cloneMaterial(this.materials[name].pbr, scene);
    };
    return MaterialManager;
})();
