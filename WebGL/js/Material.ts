/// <reference path="babylon.d.ts"/>
/// <reference path="babylon.pbrMaterial.d.ts" />

class Material {
    name: string;
    pbr: BABYLON.PBRMaterial;

    constructor(json: string, scene: BABYLON.Scene) {
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

    public ToJSON(): string {
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
    }
}