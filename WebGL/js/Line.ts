/// <reference path="babylon.d.ts" />

class Line {
    line: BABYLON.LinesMesh;
    points: Float32Array; // 0 - model point, 1 - canvas point

    constructor(i: number, points: BABYLON.Vector3[], scene: BABYLON.Scene) {
        this.line = BABYLON.Mesh.CreateLines("line" + i, points, scene, true)
        this.points[0][0] = points[0].x;
        this.points[0][1] = points[0].y;
        this.points[0][2] = points[0].z;

        this.points[1][0] = points[1].x;
        this.points[1][1] = points[1].y;
        this.points[1][2] = points[1].z;


    }

    updateModelPoint(modelPoint: BABYLON.Vector3) {
        this.points[0][0] = modelPoint.x;
        this.points[0][1] = modelPoint.y;
        this.points[0][2] = modelPoint.z;
        this.line.updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, this.points);
    }
}