/// <reference path="babylon.d.ts" />

class LensFlareSystem {
    constructor(scene: BABYLON.Scene) {
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

        //var count = 0;
        var meshFound = new BABYLON.PickingInfo();
        scene.registerBeforeRender(() => {
           // count++;

           // if (count > 5) {
            //    count = 0;
                var rayPick = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, mainLensEmitter.position);
                meshFound = scene.pickWithRay(rayPick, function(mesh) {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (mesh == modelMeshes[i])
                            return true;
                    }
                    return false;
                });
         //   }
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
                    hexaLensFlareSystem.lensFlares[i].size = flareSizes[i] + (1 - (<BABYLON.ArcRotateCamera>scene.activeCamera).radius / 6) / 6;
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
}