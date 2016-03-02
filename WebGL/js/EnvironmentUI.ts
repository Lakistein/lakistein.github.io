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

        document.getElementById("background").onchange = () => {
            this.environmentManager.turnBackgroundOnOff(document.getElementById('background').checked);
        };

        document.getElementById("shadows").onchange = () => {
            this.environmentManager.turnShadowOffOn(document.getElementById('shadows').checked);
        };

        document.getElementById("groundPlaneCheckbox").onchange = () => {
            this.environmentManager.turnGroundPlaneOffOn(document.getElementById('groundPlaneCheckbox').checked);
        };

        document.getElementById("groundPlaneSize").onchange = () => {
            this.environmentManager.changeGroundPlaneSize(document.getElementById('groundPlaneSize').value);
        };

        var k = 0;
        document.getElementById("arrowIcon").addEventListener('click', function() {
            if (document.getElementById("Environment").style.height == "70%") {
                document.getElementById("Environment").style.height = "7%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
            else {
                document.getElementById("Environment").style.height = "70%";
                document.getElementById("arrowIcon").style.transform = "rotatex(" + k + "deg)";
                k += 180;
            }
        });
    }
}