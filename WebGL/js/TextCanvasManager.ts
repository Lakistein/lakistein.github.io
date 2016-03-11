/// <reference path="babylon.d.ts" />
/// <reference path="TextCanvas.ts" />

class TextCanvasManager {
    textCanvases: TextCanvas[] = [];
    lines: BABYLON.LinesMesh[] = [];
    rays: BABYLON.Ray[] = [];
    alterAnchorPoint: boolean = false;
    addingNewCanvas: boolean = false;
    offset: number[] = [];
    anchors: BABYLON.AbstractMesh[] = [];
    pointss = [];
    arr = [];
    anchorTextures: BABYLON.Texture[] = [];

    constructor(json: string, scene: BABYLON.Scene) {
        var jsonCanv = JSON.parse(json);

        // napravi anchor points
        for (var i = 0; i < jsonCanv.length; i++) {
            this.textCanvases.push(new TextCanvas(jsonCanv[i], i.toString(), scene));
            var vec = new BABYLON.Vector3(jsonCanv[i].linePosition.x, jsonCanv[i].linePosition.y, jsonCanv[i].linePosition.z);
            var points = [vec, vec];
            this.offset[i] = jsonCanv[i].offset;
            this.createAncrhor(jsonCanv[i].anchorTextureURL, points[0], scene);

            this.createLine(points, scene);

            this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, vec));
        }

        var ground = BABYLON.Mesh.CreatePlane("ground", 15, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
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

            if (this.addingNewCanvas) {
                var pickInfo = this.pickWithMouse(modelMeshes, scene);
                if (!pickInfo.hit) return;
                var vec = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x, pickInfo.pickedPoint.y + pickInfo.getNormal().y, pickInfo.pickedPoint.z + pickInfo.getNormal().z);
                var index = parseFloat(this.textCanvases[this.textCanvases.length - 1].titleMesh.name) + 1;
                this.textCanvases.push(new TextCanvas(JSON.parse('{"id":-1,"text":"Add Title","description":"Add Description","width":0.25,"height":0.05,"position":{"x":' + vec.x + ',"y":' + vec.y + ',"z":' + vec.z + '}}'),
                    index.toString(), scene));

                var points = [new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x / 100, pickInfo.pickedPoint.y + pickInfo.getNormal().y / 100, pickInfo.pickedPoint.z + pickInfo.getNormal().z / 100), new BABYLON.Vector3(this.textCanvases[index].position.x - this.textCanvases[index].width / 2, this.textCanvases[index].position.y + this.textCanvases[index].height / 2, this.textCanvases[index].position.z)];
                this.lines.push(BABYLON.Mesh.CreateLines("line" + index, points, scene, true));
                this.lines[index].renderingGroupId = 2;
                this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, points[0]));

                this.pointss.push(this.lines[index].getVerticesData(BABYLON.VertexBuffer.PositionKind));
                this.arr.push(this.textCanvases[index].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
                this.createAncrhor("./textures/anchors/Anchor_3.png", points[0], scene);
                this.addingNewCanvas = false;
                (<HTMLInputElement>document.getElementById("addButton")).value = "Add Text Canvas";
                return;
            }

            if (!this.alterAnchorPoint)
                document.getElementById("TextCanvasEditor").style.visibility = 'hidden';

            if (this.alterAnchorPoint) {
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (modelMeshes[i] == mesh)
                            return true;
                    }
                    return false;
                });
                if (pickInfo.hit) {
                    var newVec = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x / 100, pickInfo.pickedPoint.y + pickInfo.getNormal().y / 100, pickInfo.pickedPoint.z + pickInfo.getNormal().z / 100);
                    this.pointss[currentMesh.name][0] = newVec.x;
                    this.pointss[currentMesh.name][1] = newVec.y;
                    this.pointss[currentMesh.name][2] = newVec.z;
                    this.lines[currentMesh.name].updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, this.pointss[currentMesh.name]);
                    this.anchors[currentMesh.name].position = newVec;
                }
                return;
            }

            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
                for (var i = 0; i < this.textCanvases.length; i++) {
                    if (!this.textCanvases[i].enabled) continue;
                    if (this.textCanvases[i].titleMesh == mesh)
                        return true;
                }
                return false;
            });
            if (pickInfo.hit) {
                currentMesh = null;
                for (var i = 0; i < this.textCanvases.length; i++) {
                    if (!this.textCanvases[i].enabled) continue;
                    if (pickInfo.pickedMesh == this.textCanvases[i].titleMesh) {
                        currentMesh = pickInfo.pickedMesh;
                        ground.position = new BABYLON.Vector3(this.pointss[currentMesh.name][0], this.pointss[currentMesh.name][1], this.pointss[currentMesh.name][2]);
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

            //var diff = current.subtract(startingPoint);
            currentMesh.position = current;//.addInPlace(diff);
            this.textCanvases[currentMesh.name].position = current;
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


        for (var i = 0; i < this.lines.length; i++) {
            this.pointss.push(this.lines[i].getVerticesData(BABYLON.VertexBuffer.PositionKind));
            this.arr.push(this.textCanvases[i].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
        }


        document.getElementById("titleCanvas").oninput = (ev) => {
            (this.textCanvases[currentMesh.name]).updateTitleText((<HTMLInputElement>ev.target).value);
        };

        document.getElementById("descriptionCanvas").oninput = (ev) => {
            (this.textCanvases[currentMesh.name]).updateDescriptionText((<HTMLInputElement>ev.target).value);
        };

        document.getElementById("textCanvasWidth").oninput = (ev) => {
            (this.textCanvases[currentMesh.name]).updateWidth(parseFloat((<HTMLInputElement>ev.target).value));
            this.arr[currentMesh.name] = this.textCanvases[currentMesh.name].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData();
        };

        document.getElementById("textCanvasHeight").oninput = (ev) => {
            (this.textCanvases[currentMesh.name]).updateHeight(parseFloat((<HTMLInputElement>ev.target).value));
            this.arr[currentMesh.name] = this.textCanvases[currentMesh.name].descriptionMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData();
        };

        document.getElementById("anchorPoint").onchange = (ev) => {
            this.alterAnchorPoint = (<HTMLInputElement>ev.target).checked;
        }

        document.getElementById("addButton").onclick = (ev) => {
            this.addingNewCanvas = true;
            (<HTMLInputElement>ev.target).value = "Adding New Canvas!";
        }

        document.getElementById("changeCanvasPoint").onclick = (ev) => {
            this.offset[currentMesh.name] = this.offset[currentMesh.name] == 9 ? 0 : this.offset[currentMesh.name] + 3;
        }

        document.getElementById("deleteCanvas").onclick = (ev) => {
            this.removeCard(currentMesh.name);
            document.getElementById("TextCanvasEditor").style.visibility = 'hidden';
        }

        var count = 0;
        scene.registerBeforeRender(() => {
            if (scene.activeCamera) {
                for (var i = 0; i < this.textCanvases.length; i++) {
                    if (!this.textCanvases[i].enabled /*|| !this.textCanvases[i].titleMesh.isEnabled()*/) continue;
                    this.lookAtCamera(this.textCanvases[i].titleMesh, scene);
                    this.lookAtCamera(this.anchors[i], scene);

                    //if (count % 2 != 0) continue; // enable for optimizing
                    //var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(arr[i], 0), this.textCanvases[i].descriptionMesh.getWorldMatrix());
                    var pos2 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(this.arr[i], this.offset[i]), this.textCanvases[i].descriptionMesh.getWorldMatrix());
                    // var d1 = BABYLON.Vector3.Distance(pos1, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    // var d2 = BABYLON.Vector3.Distance(pos2, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    var pos;

                    // if (d1 < d2)
                    //     pos = pos1;
                    // else
                    pos = pos2;

                    this.pointss[i][3] = pos.x;
                    this.pointss[i][4] = pos.y;
                    this.pointss[i][5] = pos.z;
                    this.lines[i].updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, this.pointss[i]);
                }
            }

            this.lookAtCamera(ground, scene);
            count++;

            // scale canvas
            var rad = (<BABYLON.ArcRotateCamera>scene.activeCamera).radius / 2;
            for (var i = 0; i < this.textCanvases.length; i++) {
                if (!this.textCanvases[i].enabled) continue;
                this.textCanvases[i].titleMesh.scaling = new BABYLON.Vector3(rad, rad, rad);
            }

            // optimizing
            if (count < 20) return;
            count = 0;

            // check if anchor point is visible, if not disable canvas
            for (var i = 0; i < this.rays.length; i++) {
                if (!this.textCanvases[i].enabled) continue;
                this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(this.pointss[i][0], this.pointss[i][1], this.pointss[i][2]));
                this.setTextCanvasEnabled(i, !this.checkIfRayColidesWithMesh(this.rays[i], modelMeshes, scene));
            }
        });
    }

    removeCard(index: number) {
        this.textCanvases[index].enabled = false;
        this.textCanvases[index].descriptionMesh.setEnabled(false);
        this.textCanvases[index].titleMesh.setEnabled(false);
        this.lines[index].setEnabled(false);
        this.anchors[index].setEnabled(false);
    }

    checkIfRayColidesWithMesh(ray: BABYLON.Ray, meshes: BABYLON.AbstractMesh[], scene: BABYLON.Scene) {
        var meshFound = scene.pickWithRay(ray, function(mesh) {
            for (var i = 0; i < meshes.length; i++) {
                if (mesh == meshes[i])
                    return true;
            }
            return false;
        });

        return meshFound.hit;
    }

    pickWithMouse(meshes: BABYLON.AbstractMesh[], scene: BABYLON.Scene) {
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
            for (var i = 0; i < modelMeshes.length; i++) {
                if (meshes[i] == mesh)
                    return true;
            }
            return false;
        });

        return pickInfo;
    }

    setTextCanvasEnabled(index: number, value: boolean) {
        this.lines[index].setEnabled(value);
        this.textCanvases[index].titleMesh.setEnabled(value);
        this.textCanvases[index].descriptionMesh.setEnabled(value);
        this.anchors[index].setEnabled(value);
    }

    createAncrhor(url: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {
        var pl = BABYLON.Mesh.CreatePlane("23", .1, scene);
        var mm = new BABYLON.StandardMaterial("SD", scene);
        mm.opacityTexture = new BABYLON.Texture(url, scene);
        mm.emissiveColor = BABYLON.Color3.White();
        pl.material = mm;
        mm.diffuseColor = BABYLON.Color3.White();
        mm.specularColor = BABYLON.Color3.Black();
        pl.renderingGroupId = 1;
        pl.position = position;
        this.anchors.push(pl);
        this.lookAtCamera(pl, scene);
    }

    createLine(points: BABYLON.Vector3[], scene: BABYLON.Scene) {
        this.lines.push(BABYLON.Mesh.CreateLines("line", points, scene, true));
        this.lines[this.lines.length - 1].renderingGroupId = 1;
        this.lines[0].edgesColor = new BABYLON.Color4(1, 1, 1, 1);
        this.lines[0].edgesWidth = 10;
    }

    changeTextCanvasLinePoint() {

    }

    createCanvas() {

    }
    lookAtCamera(mesh: BABYLON.AbstractMesh, scene: BABYLON.Scene) {
        mesh.rotation.y = -(<BABYLON.ArcRotateCamera>scene.activeCamera).alpha - (Math.PI / 2);
        mesh.rotation.x = -(<BABYLON.ArcRotateCamera>scene.activeCamera).beta + (Math.PI / 2);
    }
}