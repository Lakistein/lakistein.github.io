/// <reference path="babylon.d.ts"/>
/// <reference path="babylon.pbrMaterial.d.ts" />
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
})();
