/// <reference path="babylon.pbrMaterial.d.ts" />
/// <reference path="babylon.2.3.d.ts" />
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