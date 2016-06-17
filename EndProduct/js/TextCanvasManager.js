/// <reference path="babylon.d.ts" />
/// <reference path="TextCanvas.ts" />
var TextCanvasManager = (function () {
    function TextCanvasManager(json, scene) {
        var _this = this;
        this.textCanvases = [];
        this.anchorTextures = [];
        this.rays = [];
        this.alterAnchorPoint = false;
        this.addingNewCanvas = false;
        this.pointss = [];
        this.arr = [];
        var jsonCanv = JSON.parse(json);
        for (var i = 1; i < 6; i++) {
            this.anchorTextures[i] = new BABYLON.Texture("./textures/anchors/Anchor_" + i + ".png", scene);
        }
        // napravi anchor points
        for (var i = 0; i < jsonCanv.length; i++) {
            this.textCanvases.push(new TextCanvas(jsonCanv[i], i.toString(), scene));
            this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(jsonCanv[i].linePosition.x, jsonCanv[i].linePosition.y, jsonCanv[i].linePosition.z)));
        }
        var ground = BABYLON.Mesh.CreatePlane("ground", 15, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
        //ground.renderingGroupId = 1;
        ground.material.alpha = 0;
        ground.isPickable = false;
        var canvas = scene.getEngine().getRenderingCanvas();
        var startingPoint;
        var currentMesh;
        var currentAnchorPoint;
        this.alterAnchorPoint = false;
        var getGroundPosition = function () {
            var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
            if (pickinfo.hit) {
                return pickinfo.pickedPoint;
            }
            return null;
        };
        var onPointerDown = function (evt) {
            event.preventDefault();
            if (evt.button !== 0) {
                return;
            }
            if (_this.addingNewCanvas) {
                var pickInfo = _this.pickWithMouse(modelMeshes, scene);
                if (!pickInfo.hit)
                    return;
                var vec = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x, pickInfo.pickedPoint.y + pickInfo.getNormal().y, pickInfo.pickedPoint.z + pickInfo.getNormal().z);
                var index = parseFloat(_this.textCanvases[_this.textCanvases.length - 1].titleMesh.name) + 1;
                var points = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x / 100, pickInfo.pickedPoint.y + pickInfo.getNormal().y / 100, pickInfo.pickedPoint.z + pickInfo.getNormal().z / 100);
                _this.textCanvases.push(new TextCanvas(JSON.parse('{"id":-1,"text":"Add Title","description":"Add Description","width":0.25,"height":0.05,"position":{"x":' + vec.x + ',"y":' + vec.y + ',"z":' + vec.z
                    + '},"linePosition": {"x":' + points.x + ',"y": ' + points.y + ',"z":' + points.z + '}, "offset": 0,"anchorTextureURL":"./textures/anchors/Anchor_3.png"}'), index.toString(), scene));
                _this.rays.push(BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, points));
                _this.pointss.push(_this.textCanvases[index].line.getVerticesData(BABYLON.VertexBuffer.PositionKind));
                _this.arr.push(_this.textCanvases[index].titleMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
                _this.addingNewCanvas = false;
                document.getElementById("anchBtn").style.visibility = "visible";
                if (!visible)
                    document.getElementById("editCardPanel").style.visibility = 'visible';
                return;
            }
            var pickInfo = scene.pick(evt.clientX, evt.clientY);
            //debugger;
            // , (mesh) => {
            //     for (var i = 0; i < this.textCanvases.length; i++) {
            //         if (this.textCanvases[i].anchor == mesh) {
            //             this.alterAnchorPoint = true;
            //             currentAnchorPoint = i;
            //             return true;
            //         }
            //         else if (!this.textCanvases[i].enabled) continue;
            //         else if (this.textCanvases[i].titleMesh == mesh || mesh == this.textCanvases[i].descriptionMesh)
            //             return true;
            //     }
            //     //this.alterAnchorPoint = false;
            //     return false;
            // });
            if (pickInfo.hit) {
                if (currentMesh) {
                    currentMesh.showBoundingBox = false;
                    currentMesh.getChildren()[0].showBoundingBox = false;
                }
                currentMesh = null;
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    if (pickInfo.pickedMesh == _this.textCanvases[i].anchor) {
                        currentAnchorPoint = i;
                        _this.alterAnchorPoint = true;
                        break;
                    }
                    if (!_this.textCanvases[i].enabled)
                        continue;
                    if (pickInfo.pickedMesh == _this.textCanvases[i].titleMesh) {
                        _this.textCanvases[i].titleMesh.showBoundingBox = true;
                        document.getElementById("titleCanvas").focus();
                        currentMesh = pickInfo.pickedMesh == _this.textCanvases[i].titleMesh ? pickInfo.pickedMesh : pickInfo.pickedMesh.parent;
                        ground.position = new BABYLON.Vector3(_this.pointss[currentMesh.name][0], _this.pointss[currentMesh.name][1], _this.pointss[currentMesh.name][2]);
                        break;
                    }
                    else if (pickInfo.pickedMesh == _this.textCanvases[i].descriptionMesh) {
                        _this.textCanvases[i].descriptionMesh.showBoundingBox = true;
                        document.getElementById("descriptionCanvas").focus();
                        currentMesh = pickInfo.pickedMesh == _this.textCanvases[i].titleMesh ? pickInfo.pickedMesh : pickInfo.pickedMesh.parent;
                        ground.position = new BABYLON.Vector3(_this.pointss[currentMesh.name][0], _this.pointss[currentMesh.name][1], _this.pointss[currentMesh.name][2]);
                        break;
                    }
                }
                if (currentMesh) {
                    startingPoint = getGroundPosition();
                    document.getElementById("anchBtn").style.visibility = 'visible';
                    document.getElementById("editCardPanel").style.visibility = 'visible';
                    document.getElementById("titleCanvas").value = (_this.textCanvases[currentMesh.name]).titleText;
                    document.getElementById("descriptionCanvas").value = (_this.textCanvases[currentMesh.name]).descriptionText;
                }
                else {
                    document.getElementById("editCardPanel").style.visibility = 'collapse';
                }
            }
            if (startingPoint && currentMesh || _this.alterAnchorPoint) {
                setTimeout(function () {
                    scene.activeCamera.detachControl(canvas);
                }, 0);
            }
        };
        var onPointerUp = function () {
            if (startingPoint || _this.alterAnchorPoint) {
                scene.activeCamera.attachControl(canvas, true);
                startingPoint = null;
                //currentAnchorPoint = null;
                _this.alterAnchorPoint = false;
                return;
            }
        };
        var onPointerMove = function (evt) {
            if (_this.alterAnchorPoint) {
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                    for (var i = 0; i < modelMeshes.length; i++) {
                        if (modelMeshes[i] == mesh) {
                            return true;
                        }
                    }
                    return false;
                });
                if (pickInfo.hit) {
                    var newVec = new BABYLON.Vector3(pickInfo.pickedPoint.x + pickInfo.getNormal().x / 100, pickInfo.pickedPoint.y + pickInfo.getNormal().y / 100, pickInfo.pickedPoint.z + pickInfo.getNormal().z / 100);
                    _this.pointss[currentAnchorPoint][0] = newVec.x;
                    _this.pointss[currentAnchorPoint][1] = newVec.y;
                    _this.pointss[currentAnchorPoint][2] = newVec.z;
                    _this.textCanvases[currentAnchorPoint].line.updateVerticesData(BABYLON.VertexBuffer.PositionKind, _this.pointss[currentAnchorPoint]);
                    _this.textCanvases[currentAnchorPoint].anchor.position = newVec;
                    return;
                }
            }
            if (!startingPoint) {
                return;
            }
            var current = getGroundPosition();
            if (!current) {
                return;
            }
            currentMesh.position = current;
            _this.textCanvases[currentMesh.name].updatePosition(current);
            startingPoint = current;
        };
        canvas.addEventListener("pointerdown", onPointerDown, false);
        canvas.addEventListener("pointerup", onPointerUp, false);
        canvas.addEventListener("pointermove", onPointerMove, false);
        scene.onDispose = function () {
            canvas.removeEventListener("pointerdown", onPointerDown);
            canvas.removeEventListener("pointerup", onPointerUp);
            canvas.removeEventListener("pointermove", onPointerMove);
        };
        for (var i = 0; i < this.textCanvases.length; i++) {
            this.pointss.push(this.textCanvases[i].line.getVerticesData(BABYLON.VertexBuffer.PositionKind));
            this.arr.push(this.textCanvases[i].titleMesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind).getData());
        }
        var visible = false;
        var t = document.getElementById("TextCanvasEditorTop");
        t.style.cursor = 'pointer';
        t.onclick = function (ev) {
            visible = !visible;
            document.getElementById("anchBtn").style.visibility = visible ? "collapse" : "visible";
            if (!visible)
                document.getElementById("editCardPanel").style.visibility = 'collapse';
        };
        var visible = false;
        var b = document.getElementById("anchBtn");
        b.style.cursor = 'pointer';
        b.onclick = function (ev) {
            _this.addingNewCanvas = true;
        };
        document.getElementById("titleCanvas").oninput = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateTitleText(ev.target.value);
        };
        document.getElementById("descriptionCanvas").oninput = function (ev) {
            (_this.textCanvases[currentMesh.name]).updateDescriptionText(ev.target.value);
        };
        var textCanvases = this.textCanvases;
        var textures = this.anchorTextures;
        var anchorsHtml = document.getElementsByClassName('anchor');
        for (var i = 0; i < anchorsHtml.length; i++) {
            anchorsHtml.item(i).addEventListener('click', function () {
                textCanvases[currentMesh ? currentMesh.name : currentAnchorPoint].changeanchorTesture(textures[this.getAttribute("id")[1]]);
            });
        }
        var rad = document.getElementsByName("size");
        var prev = null;
        for (var i = 0; i < rad.length; i++) {
            switch (rad[i].id) {
                case "small":
                    rad[i].onclick = function (ev) {
                        _this.textCanvases[currentMesh.name].updateWidth(1);
                    };
                    break;
                case "medium":
                    rad[i].onclick = function () {
                        _this.textCanvases[currentMesh.name].updateWidth(1.5);
                    };
                    break;
                case "large":
                    rad[i].onclick = function () {
                        _this.textCanvases[currentMesh.name].updateWidth(2);
                    };
                    break;
                default:
                    break;
            }
        }
        // document.getElementById("deleteCanvas").onclick = (ev) => {
        //     this.removeCard(currentMesh.name);
        //     document.getElementById("TextCanvasEditor").style.visibility = 'hidden';
        // }
        //var count = 0;
        var ancDoc = document.getElementById("anchorPointScreenCoordinate");
        ancDoc.style.position = "absolute";
        scene.registerBeforeRender(function () {
            if (scene.activeCamera) {
                for (var i = 0; i < _this.textCanvases.length; i++) {
                    var p = BABYLON.Vector3.Project(_this.textCanvases[0].anchor.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), scene.activeCamera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight()));
                    ancDoc.textContent = "X:" + p.x.toFixed(2) + " Y:" + p.y.toFixed(2) + (_this.textCanvases[0].anchor.isEnabled() ? "\nEnabled" : "\nDisabled");
                    ancDoc.style.top = p.y.toFixed(2).toString() + "px";
                    ancDoc.style.left = p.x.toFixed(2).toString() + "px";
                    //  console.log(p.x + "," + p.y);
                    _this.lookAtCamera(_this.textCanvases[i].titleMesh, scene);
                    _this.lookAtCamera(_this.textCanvases[i].anchor, scene);
                    var offsetCard = _this.textCanvases[i].offset;
                    var offsetCard2 = _this.textCanvases[i].offset == 0 ? 3 : 0;
                    //if (count % 2 != 0) continue; // enable for optimizing
                    //var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(arr[i], 0), this.textCanvases[i].descriptionMesh.getWorldMatrix());
                    var pos = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], offsetCard), _this.textCanvases[i].titleMesh.getWorldMatrix());
                    var pos1 = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(_this.arr[i], offsetCard2), _this.textCanvases[i].titleMesh.getWorldMatrix());
                    // var d1 = BABYLON.Vector3.Distance(pos1, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    // var d2 = BABYLON.Vector3.Distance(pos2, new BABYLON.Vector3(pointss[i][0], pointss[i][1], pointss[i][2]));
                    var dir = offsetCard2 == 3 ? pos.subtract(pos1).normalize() : pos1.subtract(pos).normalize();
                    // if (d1 < d2)
                    //     pos = pos1;
                    // else
                    _this.pointss[i][3] = offsetCard2 == 3 ? pos.x + dir.x / 8 : pos.x - dir.x / 8;
                    _this.pointss[i][4] = offsetCard2 == 3 ? pos.y + dir.y / 8 : pos.y - dir.y / 8;
                    _this.pointss[i][5] = offsetCard2 == 3 ? pos.z + dir.z / 8 : pos.z - dir.z / 8;
                    _this.pointss[i][6] = pos.x;
                    _this.pointss[i][7] = pos.y;
                    _this.pointss[i][8] = pos.z;
                    _this.textCanvases[i].line.updateVerticesData(BABYLON.VertexBuffer.PositionKind, _this.pointss[i]);
                }
            }
            _this.lookAtCamera(ground, scene);
            //count++;
            // scale canvas
            var rad = scene.activeCamera.radius / 2;
            for (var i = 0; i < _this.textCanvases.length; i++) {
                if (!_this.textCanvases[i].enabled || !_this.textCanvases[i].visible)
                    continue;
                var scale = rad * _this.textCanvases[i].scale;
                if (_this.textCanvases[i].isAnimating) {
                    _this.textCanvases[i].titleMesh.scaling.x *= scale;
                    _this.textCanvases[i].titleMesh.scaling.y *= scale;
                    _this.textCanvases[i].titleMesh.scaling.z *= scale;
                    continue;
                }
                _this.textCanvases[i].titleMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            }
            // optimizing
            // if (count < 20) return;
            // count = 0;
            // check if anchor point is visible, if not disable canvas
            for (var i = 0; i < _this.rays.length; i++) {
                _this.rays[i] = BABYLON.Ray.CreateNewFromTo(scene.activeCamera.position, new BABYLON.Vector3(_this.pointss[i][0], _this.pointss[i][1], _this.pointss[i][2]));
                _this.textCanvases[i].setTextCanvasEnabled(!_this.checkIfRayColidesWithMesh(_this.rays[i], modelMeshes, scene));
            }
        });
    }
    TextCanvasManager.prototype.removeCard = function (index) {
        this.textCanvases[index].enabled = false;
        this.textCanvases[index].descriptionMesh.setEnabled(false);
        this.textCanvases[index].titleMesh.setEnabled(false);
        this.textCanvases[index].line.setEnabled(false);
        this.textCanvases[index].anchor.setEnabled(false);
    };
    TextCanvasManager.prototype.checkIfRayColidesWithMesh = function (ray, meshes, scene) {
        var meshFound = scene.pickWithRay(ray, function (mesh) {
            for (var i = 0; i < meshes.length; i++) {
                if (mesh == meshes[i])
                    return true;
            }
            return false;
        });
        return meshFound.hit;
    };
    TextCanvasManager.prototype.pickWithMouse = function (meshes, scene) {
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
            for (var i = 0; i < modelMeshes.length; i++) {
                if (meshes[i] == mesh)
                    return true;
            }
            return false;
        });
        return pickInfo;
    };
    TextCanvasManager.prototype.lookAtCamera = function (mesh, scene) {
        mesh.rotation.y = -scene.activeCamera.alpha - (Math.PI / 2);
        mesh.rotation.x = -scene.activeCamera.beta + (Math.PI / 2);
    };
    return TextCanvasManager;
})();
