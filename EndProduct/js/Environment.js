/// <reference path="babylon.2.3.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
var Environment = (function () {
    //     constructor(environments: JSON) {
    // 
    //     }
    function Environment(scene) {
        this.lights = scene.lights;
        this.backgroundColor = scene.getMeshByName("background").material.albedoColor;
        this.ambientColor = scene.ambientColor;
    }
    Environment.prototype.toJSON = function () {
        var json = '{"backgroundColor": {"r": ' + this.backgroundColor.r + ', "g":' + this.backgroundColor.g + ',"b":' + this.backgroundColor.b + '},' + '"lights": [';
        for (var i = 0; i < this.lights.length; i++) {
            json += ' {' +
                '"type": "' + this.lights[i].name + '",' +
                '"position": { "x": ' + this.lights[i].getAbsolutePosition().x + ', "y": ' + this.lights[i].getAbsolutePosition().x + ', "z": ' + this.lights[i].getAbsolutePosition().x + ' },' +
                '"intensity": ' + this.lights[i].intensity + ',' +
                '"range": ' + this.lights[i].range + ',' +
                '}';
            if (this.lights[i].name === "spot") {
                json += '"coneAngle:' + this.lights[i].angle + ',' +
                    '"direction": { "x": ' + this.lights[i].direction.x + ', "y": ' + this.lights[i].direction.y + ', "z": ' + this.lights[i].direction.z + ' },';
            }
        }
        json += ']}';
        return JSON.stringify(json);
    };
    return Environment;
})();
/*

{
    "backgroundColor": {"r": 255, "g":255, "b":255},
    "lights": [{
        "type": "point",
        "position": {"x": 1,"y": 1,"z": 1},
        "direction": {"x": 1,"y": 1,"z": 1},
        "intensity": 15,
        "range": 15,
    }]
}

 */ 
