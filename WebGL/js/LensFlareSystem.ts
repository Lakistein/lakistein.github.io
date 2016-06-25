/// <reference path="babylon.d.ts" />

class LensFlareSystem {
    mainLensEmitter: BABYLON.Mesh[] = [];
    hexaLensEmitter: BABYLON.Mesh[] = [];
    hexaLensFlareSystem: BABYLON.LensFlareSystem[] = [];
    MainLensFlareSystem: BABYLON.LensFlareSystem[] = [];
    flareSizes: number[] = [];
    selectedLens: number;

    constructor(scene: BABYLON.Scene, json: string) {
        var self = this;

        $('body').on('lenseflareDropped', function (e) {
            var mesh = scene.pick(e.x, e.y);
            if (mesh && mesh.hit) {
                self.createFlares(scene, mesh.pickedPoint, e.model.main_flare, e.model.hexigon_shape, e.model.band_1, e.model.band_2);
            }
        });

        scene.registerBeforeRender(() => {
            if (this.MainLensFlareSystem.length == 0) return;
            for (var i = 0; i < this.MainLensFlareSystem.length; i++) {
                this.hexaLensFlareSystem[i].isEnabled = true;
                var vec1 = this.hexaLensEmitter[i].position;
                var vec2 = scene.activeCamera.position;
                var dot = BABYLON.Vector3.Dot(vec1, vec2);
                dot = dot / (Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z) * Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z));
                var acos = Math.acos(dot);
                var angle = acos * 180 / Math.PI;
                var bb = 0.06 - angle / 1000;
                if (bb > 0.1)
                    bb = 0.1;
                for (var j = 0; j < this.hexaLensFlareSystem[i].lensFlares.length; j++) {
                    this.hexaLensFlareSystem[i].lensFlares[j].size = this.flareSizes[i * 7 + j] + (1 - (<BABYLON.ArcRotateCamera>scene.activeCamera).radius / 6) / 6;
                    if (angle < 45) {
                        this.hexaLensFlareSystem[i].lensFlares[j].color = new BABYLON.Color3(bb, bb, bb);
                    }
                    else {
                        this.hexaLensFlareSystem[i].isEnabled = false;
                    }
                }
            }
        });

        var canvas = scene.getEngine().getRenderingCanvas();
        var onPointerDown = (evt) => {
            event.preventDefault();
            if (evt.button !== 0) {
                var pos = new BABYLON.Vector2(scene.pointerX, scene.pointerY);
                for (var i = 0; i < this.mainLensEmitter.length; i++) {
                     var p = BABYLON.Vector3.Project(this.mainLensEmitter[i].position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), scene.activeCamera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight()));
                    if(BABYLON.Vector2.Distance(pos, new BABYLON.Vector2(p.x, p.y)) < 10){
                        this.selectedLens = i;
                    }
                }

                return;
            }
        }

        canvas.addEventListener("pointerdown", onPointerDown, false);
        scene.onDispose = function () {
            canvas.removeEventListener("pointerdown", onPointerDown);
        }

    }

    createFlares(scene: BABYLON.Scene, position: BABYLON.Vector3, fpMain: string, fpHexa: string, fpB_1: string, fpB_2: string) {
        this.mainLensEmitter.push(new BABYLON.Mesh("lensEmitter" + this.mainLensEmitter.length, scene));
        this.mainLensEmitter[this.mainLensEmitter.length - 1].position = position;
        this.MainLensFlareSystem.push(new BABYLON.LensFlareSystem("mainLensFlareSystem" + this.MainLensFlareSystem.length, this.mainLensEmitter[this.mainLensEmitter.length - 1], scene));
        this.mainLensEmitter[this.mainLensEmitter.length - 1].isPickable = true;
        var flare = new BABYLON.LensFlare(.4, 1, new BABYLON.Color3(1, 1, 1), fpMain, this.MainLensFlareSystem[this.MainLensFlareSystem.length - 1]);

        flare.texture.hasAlpha = true;
        flare.texture.getAlphaFromRGB = true;
        this.hexaLensEmitter.push(new BABYLON.Mesh("hexaLensEmitter" + this.hexaLensEmitter.length, scene));
        this.hexaLensEmitter[this.hexaLensEmitter.length - 1].isPickable = false;
        this.hexaLensEmitter[this.hexaLensEmitter.length - 1].position = position;
        this.hexaLensFlareSystem.push(new BABYLON.LensFlareSystem("hexaLensFlareSystem" + this.hexaLensFlareSystem.length, this.hexaLensEmitter[this.hexaLensEmitter.length - 1], scene));

        var flare1 = new BABYLON.LensFlare(.2, -2.85, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare2 = new BABYLON.LensFlare(.1, -2.3, new BABYLON.Color3(0.1, 0.05, 0.05), fpB_2, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare3 = new BABYLON.LensFlare(.1, -0.5, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare4 = new BABYLON.LensFlare(.05, 0, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare5 = new BABYLON.LensFlare(.05, 0.4, new BABYLON.Color3(0.1, 0.05, 0.05), fpB_2, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare6 = new BABYLON.LensFlare(.05, 0.2, new BABYLON.Color3(0.1, 0.05, 0.05), fpB_1, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);
        var flare7 = new BABYLON.LensFlare(.05, 0.5, new BABYLON.Color3(0.1, 0.05, 0.05), fpHexa, this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1]);

        for (var i = 0; i < this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1].lensFlares.length; i++) {
            this.flareSizes.push(this.hexaLensFlareSystem[this.hexaLensFlareSystem.length - 1].lensFlares[i].size);
        }

        return
    }

    public disposeFlareSystem(index: number) {
        if (this.MainLensFlareSystem.length > 0) {
            this.MainLensFlareSystem[index].lensFlares[0].texture.dispose();
            this.MainLensFlareSystem[index].lensFlares[0].texture = null;
            this.MainLensFlareSystem[index].lensFlares = [];
            this.MainLensFlareSystem.splice(index, 1);
        }

        if (this.hexaLensFlareSystem.length > 0) {
            for (var i = 0; i < this.hexaLensFlareSystem[index].lensFlares.length; i++) {
                var tex = this.hexaLensFlareSystem[index].lensFlares[i].texture;
                tex.dispose();
                tex = null;
            }

            this.hexaLensFlareSystem[index].lensFlares = [];
            this.hexaLensFlareSystem[index].dispose();
            this.hexaLensFlareSystem.splice(index, 1);
        }

        if (this.mainLensEmitter.length > 0) {
            this.mainLensEmitter[index].dispose();
            this.mainLensEmitter.splice(index, 1);
        }

        if (this.hexaLensEmitter.length > 0) {
            this.hexaLensEmitter[index].dispose();
            this.hexaLensEmitter.splice(index, 1);
        }

        if (this.flareSizes.length > 0) {
            this.flareSizes.splice(index, 7);
        }
    }

    public ToJSON(): string {
        return '{' + // FIX
            '"pos":"' + this.mainLensEmitter[1].position +
            '"pos":"' + this.mainLensEmitter[1].position +
            '}';
    }
}