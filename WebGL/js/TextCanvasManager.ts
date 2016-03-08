/// <reference path="babylon.d.ts" />
/// <reference path="TextCanvas.ts" />

class TextCanvasManager {
    textCanvases: TextCanvas[] = [];
    lines: BABYLON.LinesMesh[] = [];
    alterAnchorPoint: boolean = false;

    constructor(json: string, scene: BABYLON.Scene) {
        var jsonCanv = JSON.parse(json);

        for (var i = 0; i < jsonCanv.length; i++) {
            this.textCanvases.push(new TextCanvas(jsonCanv[i], i.toString(), scene));
            var pos = this.textCanvases[i].titleMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            var points = [new BABYLON.Vector3(0.008, 0.601, -1.2), new BABYLON.Vector3(this.textCanvases[i].position.x - this.textCanvases[i].width / 2, this.textCanvases[i].position.y + this.textCanvases[i].height / 2, this.textCanvases[i].position.z)];
            this.lines.push(BABYLON.Mesh.CreateLines("line" + i, points, scene, true));
            this.lines[i].renderingGroupId = 2;
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
                document.getElementById("titleCanvas").value = (this.textCanvases[currentMesh.name]).titleText;
                document.getElementById("descriptionCanvas").value = (this.textCanvases[currentMesh.name]).descriptionText;
                document.getElementById('textCanvasWidth').value = (this.textCanvases[currentMesh.name]).width;
                document.getElementById('textCanvasHeight').value = (this.textCanvases[currentMesh.name]).height;

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
            arr.push(this.textCanvases[i].titleMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
            vertex.push(BABYLON.Vector3.FromArray(arr[i], 0));
        }


        document.getElementById("titleCanvas").onchange = () => {
            (this.textCanvases[currentMesh.name]).updateTitleText(document.getElementById('titleCanvas').value);
        };

        document.getElementById("descriptionCanvas").onchange = () => {
            (this.textCanvases[currentMesh.name]).updateDescriptionText(document.getElementById('descriptionCanvas').value);
        };

        document.getElementById("textCanvasWidth").onchange = () => {
            (this.textCanvases[currentMesh.name]).updateWidth(document.getElementById('textCanvasWidth').value);
        };

        document.getElementById("textCanvasHeight").onchange = () => {
            (this.textCanvases[currentMesh.name]).updateHeight(document.getElementById('textCanvasHeight').value);
        };

        document.getElementById("anchorPoint").onchange = () => {
            this.alterAnchorPoint = document.getElementById('anchorPoint').checked;
        };

        scene.registerBeforeRender(() => {
            if (scene.activeCamera)
                for (var i = 0; i < this.textCanvases.length; i++) {
                    this.textCanvases[i].titleMesh.lookAt(scene.activeCamera.position, 0, 0, 0);


                    var pos = BABYLON.Vector3.TransformCoordinates(vertex[i], this.textCanvases[i].titleMesh.getWorldMatrix());
                    //points[1] = new BABYLON.Vector3(this.textCanvases[0].titleMesh.position.x, this.textCanvases[0].titleMesh.position.y,  this.textCanvases[0].titleMesh.position.z);
                    pointss[i][3] = pos.x;
                    pointss[i][4] = pos.y;
                    pointss[i][5] = pos.z;
                    this.lines[i].updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, pointss[i]);
                }
            ground.lookAt(scene.activeCamera.position, 0, 0, 0);
        });
    }
}