/// <reference path="babylon.d.ts" />
/// <reference path="TextCanvas.ts" />

class TextCanvasManager {
    textCanvases: TextCanvas[] = [];
    lines: BABYLON.LinesMesh[] = [];
    rays: BABYLON.Ray[] = [];
    alterAnchorPoint: boolean = false;

    constructor(json: string, scene: BABYLON.Scene) {
        var jsonCanv = JSON.parse(json);

        for (var i = 0; i < jsonCanv.length; i++) {
            this.textCanvases.push(new TextCanvas(jsonCanv[i], i.toString(), scene));
            var pos = this.textCanvases[i].titleMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            if (i == 0)
                var points = [new BABYLON.Vector3(0.008, 0.601, -1.2), new BABYLON.Vector3(this.textCanvases[i].position.x - this.textCanvases[i].width / 2, this.textCanvases[i].position.y + this.textCanvases[i].height / 2, this.textCanvases[i].position.z)];
            if (i == 1)
                var points = [new BABYLON.Vector3(-1.1941039015072528, 0.7389552891732385, -0.2917178395064628), new BABYLON.Vector3(this.textCanvases[i].position.x - this.textCanvases[i].width / 2, this.textCanvases[i].position.y + this.textCanvases[i].height / 2, this.textCanvases[i].position.z)];

            this.lines.push(BABYLON.Mesh.CreateLines("line" + i, points, scene, true));
            this.lines[i].renderingGroupId = 2;
            if (i == 0)
                this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(0.008, 0.601, -1.2)));
            if (i == 1)
                this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(-1.1941039015072528, 0.7389552891732385, -0.2917178395064628)));
        }
        var ground = BABYLON.Mesh.CreatePlane("ground", 15, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
        ground.lookAt(scene.activeCamera.position, 0, 0, 0);
        ground.renderingGroupId = 1;
        ground.material.alpha = 0;
        ground.isPickable = false;

        var canvas = scene.getEngine().getRenderingCanvas();
        var startingPoint;
        var currentMesh;

        var getGroundPosition = function() {
            var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) { return mesh == ground; });
            if (pickinfo.hit) {
                return pickinfo.pickedPoint;
            }
            return null;
        }

        var onPointerDown = (evt) => {
            if (evt.button !== 0) {
                return;
            }

            if (!this.alterAnchorPoint)
                document.getElementById("TextCanvasEditor").style.visibility = 'hidden';

            if (this.alterAnchorPoint) {
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
                    for (var i = 0; i < this.textCanvases.length; i++) {
                        if (this.textCanvases[i].titleMesh == mesh || this.textCanvases[i].descriptionMesh == mesh)
                            return false;
                    }
                    return true;
                });
                if (pickInfo.hit) {
                    console.log(pickInfo.pickedPoint);

                    pointss[currentMesh.name][0] = pickInfo.pickedPoint.x;
                    pointss[currentMesh.name][1] = pickInfo.pickedPoint.y;
                    pointss[currentMesh.name][2] = pickInfo.pickedPoint.z;
                    this.lines[currentMesh.name].updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, pointss[currentMesh.name]);
                }
                return;
            }

            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
                for (var i = 0; i < this.textCanvases.length; i++) {
                    if (this.textCanvases[i].titleMesh == mesh)
                        return true;
                }
                return false;
            });
            if (pickInfo.hit) {
                currentMesh = null;
                for (var i = 0; i < this.textCanvases.length; i++) {
                    if (pickInfo.pickedMesh == this.textCanvases[i].titleMesh) {
                        currentMesh = pickInfo.pickedMesh;
                        break;
                    }
                }
                if (!currentMesh) return;

                document.getElementById("TextCanvasEditor").style.visibility = 'visible';
                (<HTMLInputElement>document.getElementById("titleCanvas")).value = (this.textCanvases[currentMesh.name]).titleText;
                (<HTMLInputElement>document.getElementById("descriptionCanvas")).value = (this.textCanvases[currentMesh.name]).descriptionText;
                (<HTMLInputElement>document.getElementById('textCanvasWidth')).value = (this.textCanvases[currentMesh.name]).width.toString();
                (<HTMLInputElement>document.getElementById('textCanvasHeight')).value = (this.textCanvases[currentMesh.name]).height.toString();

                startingPoint = getGroundPosition();

                if (startingPoint) {
                    setTimeout(function() {
                        scene.activeCamera.detachControl(canvas);
                    }, 0);
                }
            }
        }

        var onPointerUp = () => {
            if (startingPoint) {
                scene.activeCamera.attachControl(canvas, true);
                startingPoint = null;
                return;
            }
        }

        var onPointerMove = (evt) => {
            if (!startingPoint) {
                return;
            }

            var current = getGroundPosition();

            if (!current) {
                return;
            }

            var diff = current.subtract(startingPoint);
            currentMesh.position.addInPlace(diff);

            startingPoint = current;
        }

        canvas.addEventListener("pointerdown", onPointerDown, false);
        canvas.addEventListener("pointerup", onPointerUp, false);
        canvas.addEventListener("pointermove", onPointerMove, false);

        scene.onDispose = function() {
            canvas.removeEventListener("pointerdown", onPointerDown);
            canvas.removeEventListener("pointerup", onPointerUp);
            canvas.removeEventListener("pointermove", onPointerMove);
        }

        var pointss = [];
        var arr = [];
        var vertex = [];
        for (var i = 0; i < this.lines.length; i++) {
            pointss.push(this.lines[i].getVerticesData(BABYLON.VertexBuffer.PositionKind));
            arr.push(this.textCanvases[i].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
            vertex.push(BABYLON.Vector3.FromArray(arr[i], 0));
        }


        document.getElementById("titleCanvas").onchange = (ev) => {
            (this.textCanvases[currentMesh.name]).updateTitleText((<HTMLInputElement>ev.srcElement).value);
        };

        document.getElementById("descriptionCanvas").onchange = (ev) => {
            (this.textCanvases[currentMesh.name]).updateDescriptionText((<HTMLInputElement>ev.srcElement).value);
        };

        document.getElementById("textCanvasWidth").onchange = (ev) => {
            (this.textCanvases[currentMesh.name]).updateWidth(parseFloat((<HTMLInputElement>ev.srcElement).value));
        };

        document.getElementById("textCanvasHeight").onchange = (ev) => {
            (this.textCanvases[currentMesh.name]).updateHeight(parseFloat((<HTMLInputElement>ev.srcElement).value));
        };

        document.getElementById("anchorPoint").onchange = (ev) => {
            this.alterAnchorPoint = (<HTMLInputElement>ev.srcElement).checked;
        }
        var count = 0;
        scene.registerBeforeRender(() => {
            if (scene.activeCamera)
                for (var i = 0; i < this.textCanvases.length; i++) {
                    this.textCanvases[i].titleMesh.lookAt(scene.activeCamera.position, 0, 0, 0);

                    console.log(pointss[0][3]);
                    if (count % 3 == 0) {
                        var pos = BABYLON.Vector3.TransformCoordinates(vertex[i], this.textCanvases[i].descriptionMesh.getWorldMatrix());
                        pointss[i][3] = pos.x;
                        pointss[i][4] = pos.y;
                        pointss[i][5] = pos.z;
                        this.lines[i].updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, pointss[i]);
                    }
                }
            ground.lookAt(scene.activeCamera.position, 0, 0, 0);
            count++;
            var rad = (<BABYLON.ArcRotateCamera>scene.activeCamera).radius / 2;
            for (var i = 0; i < this.textCanvases.length; i++) {
                this.textCanvases[i].titleMesh.scaling = new BABYLON.Vector3(rad, rad, rad);
            }
            if (count < 20) return;
            count = 0;

            for (var i = 0; i < this.rays.length; i++) {
                if (i == 0)
                    this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(0.008, 0.601, -1.2));
                if (i == 1)
                    this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(-1.1941039015072528, 0.7389552891732385, -0.2917178395064628));
                var meshFound = scene.pickWithRay(this.rays[i], function(mesh) {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (mesh == modelMeshes[i])
                            return true;
                    }
                    return false;
                });
                if (meshFound.hit) {
                    this.lines[i].isVisible = false;
                    this.textCanvases[i].titleMesh.isVisible = false;
                    this.textCanvases[i].descriptionMesh.isVisible = false;
                    //debugger;
                }
                else {
                    this.lines[i].isVisible = true;
                    this.textCanvases[i].titleMesh.isVisible = true;
                    this.textCanvases[i].descriptionMesh.isVisible = true;
                }
            }
        });
    }
}