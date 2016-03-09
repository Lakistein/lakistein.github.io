/// <reference path="Environment.ts" />
/// <reference path="EnvironmentManager.ts" />

class EnvironmentUI {

    environment: Environment;
    environmentManager: EnvironmentManager;

    constructor(jsonString: string, scene: BABYLON.Scene) {
        this.environmentManager = new EnvironmentManager(jsonString, scene);
        var environments = document.getElementsByClassName('environment');
        var env = this.environmentManager;
        for (var i = 0; i < environments.length; i++) {
            environments.item(i).addEventListener('click', function() {
                env.setEnvironment(this.getAttribute("id"), scene);
            });
        }

        document.getElementById("background").onchange = (ev) => {
            this.environmentManager.turnBackgroundOnOff((<HTMLInputElement>ev.srcElement).checked);
        };

        document.getElementById("shadows").onchange = (ev) => {
            this.environmentManager.turnShadowOffOn((<HTMLInputElement>ev.srcElement).checked);
        };

        document.getElementById("groundPlaneCheckbox").onchange = (ev) => {
            this.environmentManager.turnGroundPlaneOffOn((<HTMLInputElement>ev.srcElement).checked);
        };

        document.getElementById("groundPlaneSize").onchange = (ev) => {
            this.environmentManager.changeGroundPlaneSize(parseFloat((<HTMLInputElement>ev.srcElement).value));
        };

        document.getElementById("gradientTop").onchange = (ev) => {
            this.environmentManager.changeTopGradient((<HTMLInputElement>ev.srcElement).value);
        };
        document.getElementById("gradientBottom").onchange = (ev) => {
            this.environmentManager.changeBottomGradient((<HTMLInputElement>ev.srcElement).value);
        };
        document.getElementById("gradientOffset").onchange = (ev) => {
            this.environmentManager.changeGradientOffset(parseFloat((<HTMLInputElement>ev.srcElement).value));
        };

        document.getElementById("reflective").onchange = (ev) => {
            this.environmentManager.turnReflectivePlaneOffOn((<HTMLInputElement>ev.srcElement).checked);
        };
             document.getElementById("reflectionAmount").onchange = (ev) => {
            this.environmentManager.changeReflectionAmount(parseFloat((<HTMLInputElement>ev.srcElement).value));
        };
        
        var k = 0;
        document.getElementById("arrowIcon").addEventListener('click', function() {
            if (document.getElementById("Environment").style.height == "75%") {
                document.getElementById("Environment").style.height = "7%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
            else {
                document.getElementById("Environment").style.height = "75%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
        });
    }
}