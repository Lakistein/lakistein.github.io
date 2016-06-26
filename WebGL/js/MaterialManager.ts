
/// <reference path="Material.ts" />

class MaterialManager {
    materials: { [key: string]: Material; } = {};
    currentComponentMaterial: { [key: string]: string; } = {};

    constructor(materials: string, scene: BABYLON.Scene) {
        var self = this;
        var jsonMat = JSON.parse(materials);
        for (var i = 0; i < jsonMat.length; i++) {
            self.materials[jsonMat[i].name] = new Material(JSON.stringify(jsonMat[i]), scene);
        }

        $('body').on('materialDropped', function (e) {
            var pickResult = scene.pick(e.x, e.y);

            if (pickResult.hit) {
                var sourceMaterial = self.materials[e.name].pbr;// self.cloneMaterial((<Material>self.materials[e.name]).pbr, scene);
                self.materials[e.name].id = e.model.id;
                var targetMaterial = <BABYLON.PBRMaterial>scene.getMaterialByName(pickResult.pickedMesh.name);
                self.copyMaterial(sourceMaterial, targetMaterial, scene);
                // targetMaterial.albedoTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).albedoTexture;
                // targetMaterial.ambientTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).ambientTexture;
                // targetMaterial.reflectionTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).reflectionTexture;
                if (self.materials[e.name].isGlass)
                    targetMaterial.refractionTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).reflectionTexture;
                else
                    targetMaterial.refractionTexture = undefined;
                pickResult.pickedMesh.material = targetMaterial;
                self.currentComponentMaterial[pickResult.pickedMesh.name] = e.name;

                console.log(self.ToJson());

            }
        });
    }

    cloneMaterial(material: BABYLON.PBRMaterial, scene: BABYLON.Scene): BABYLON.PBRMaterial {
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
    }

    public copyMaterial(sourceMaterial: BABYLON.PBRMaterial, targetMaterial: BABYLON.PBRMaterial, scene: BABYLON.Scene): void {
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
    }
    //[{"compNum":1,"matName":"Plastic"},{"compNum":2,"matName":"Brushed Metal"}
    public ToJson(): string {
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
    }

    public newModelAdded(json: string, scene: BABYLON.Scene) {
        if (!json || json == "")
            return;

        var jsonMat = JSON.parse(json);
        this.currentComponentMaterial = {};
        for (var i = 0; i < modelMeshes.length; i++) {
            for (var j = 0; j < jsonMat.length; j++) {
                if ("Component_" + jsonMat[j].compNum == modelMeshes[i].name) {
                    var sourceMaterial = this.materials[jsonMat[j].matName].pbr;
                    var targetMaterial = <BABYLON.PBRMaterial>modelMeshes[i].material;
                    this.copyMaterial(sourceMaterial, targetMaterial, scene);
                    // targetMaterial.albedoTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).albedoTexture;
                    // targetMaterial.ambientTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).ambientTexture;
                    // targetMaterial.reflectionTexture = (<BABYLON.PBRMaterial>pickResult.pickedMesh.material).reflectionTexture;
                    if (this.materials[jsonMat[j].matName].isGlass)
                        targetMaterial.refractionTexture = (<BABYLON.PBRMaterial>modelMeshes[i].material).reflectionTexture;
                    else
                        targetMaterial.refractionTexture = undefined;
                    modelMeshes[i].material = targetMaterial;
                    this.currentComponentMaterial[modelMeshes[i].name] = sourceMaterial.name;
                    break;
                }
            }
        }
    }
}