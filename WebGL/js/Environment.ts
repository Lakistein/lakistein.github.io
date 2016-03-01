/// <reference path="babylon.d.ts" />
/// <reference path="babylon.pbrMaterial.d.ts" />
// TODO: uradi simple interface
class Environment {
    id: string;
    lights: BABYLON.Light[] = [];
    backgroundColor: BABYLON.Color3;
    backgroundMesh: BABYLON.Mesh;
    rotateBackground: boolean;
    reflectionTexture: BABYLON.Texture;
    groundTexture: BABYLON.Texture;
    groundShadow: BABYLON.Mesh;

    constructor(json: any, scene: BABYLON.Scene) {
        if (!json) return;

        this.id = json.id;
        this.groundTexture = null;
        this.groundShadow = <BABYLON.Mesh>scene.getMeshByName("GROUNDPLANE_STYLE_1");
        this.backgroundMesh = <BABYLON.Mesh>scene.getMeshByName("background");
        this.backgroundColor = (<BABYLON.PBRMaterial>this.backgroundMesh.material).albedoColor = new BABYLON.Color3(json.backgroundColor.r, json.backgroundColor.g, json.backgroundColor.b);
        this.rotateBackground = true;
        for (var i = 0; i < json.lights.length; i++) {
            switch (json.lights[i].type) {
                case "spot":
                    this.lights.push(new BABYLON.SpotLight("spot", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), new BABYLON.Vector3(json.lights[i].direction.x, json.lights[i].direction.y, json.lights[i].direction.z), json.lights[i].angle, 1, scene));
                    break;
                case "point":
                    this.lights.push(new BABYLON.PointLight("point", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene));
                    break;
                case "hemi":
                    this.lights.push(new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene));
                    break;
                // case "direction":
                //     light = new BABYLON.DirectionalLight("hemi", new BABYLON.Vector3(json.lights[i].position.x, json.lights[i].position.y, json.lights[i].position.z), scene);
                //     break;
            }
            this.lights[i].intensity = json.lights[i].intensity;
            this.lights[i].range = json.lights[i].range;
            this.lights[i].diffuse = new BABYLON.Color3(json.lights[i].diffuse.r, json.lights[i].diffuse.g, json.lights[i].diffuse.b);
            this.lights[i].specular = new BABYLON.Color3(json.lights[i].specular.r, json.lights[i].specular.g, json.lights[i].specular.b);
        }



        scene.registerBeforeRender(function() {
            if (this.backgroundMesh == null)
                this.backgroundMesh = scene.getMeshByName("background");

            if (this.backgroundMesh && scene.activeCamera) {
                this.backgroundMesh.rotation.y = -((<BABYLON.ArcRotateCamera>scene.activeCamera).alpha) + -Math.PI / 2;
            }
        });
    }

    public toJSON(): string {
        var json = '{"backgroundColor": ' + JSON.stringify(this.backgroundColor) + ',"lights": [';
        for (var i = 0; i < this.lights.length; i++) {
            if (this.lights[i].name !== "spot" && this.lights[i].name !== "point" && this.lights[i].name !== "hemi")
                continue;

            json += '{' +
                '"type":' + JSON.stringify(this.lights[i].name) + ',' +
                '"position": ' + JSON.stringify(this.lights[i].getAbsolutePosition()) + ',';
            if (this.lights[i].name === "spot") {
                json += '"angle":' + (<BABYLON.SpotLight>this.lights[i]).angle + ',' +
                    '"direction":' + JSON.stringify((<BABYLON.SpotLight>this.lights[i]).direction) + ',';
            }
            json += '"diffuse:"' + JSON.stringify(this.lights[i].diffuse) + ',' + '"specular:"' + JSON.stringify(this.lights[i].specular) + ',' +
                '"intensity": ' + this.lights[i].intensity + ',' +
                '"range":' + this.lights[i].range.toPrecision(2) + '},';
        }
        json = json.substring(0, json.length - 1);
        json += ']}';
        return json;
    }
}

/*

{
    "backgroundColor": {"r": 255, "g":255, "b":255},
    "lights": [{
        "type": "point",
        "position": {"x": 1,"y": 1,"z": 1},
        "direction": {"x": 1,"y": 1,"z": 1},
        "diffuse": {"r": 1,"g": 1,"b": 1},
        "specular": {"r": 1,"g": 1,"b": 1},
        "intensity": 15,
        "range": 15,
    }]
}

 */