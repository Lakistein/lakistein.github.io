/// <reference path="Environment.ts" />
/// <reference path="EnvironmentManager.ts" />


class EnvironmentUI {
    environment: Environment;
    environmentManager: EnvironmentManager;

    constructor(environmentManager: EnvironmentManager, scene: BABYLON.Scene) {
        var self = this;
        this.environmentManager = environmentManager;
        var environments = document.getElementsByClassName('environment');
        var env = this.environmentManager;
        for (var i = 0; i < environments.length; i++) {
            environments.item(i).addEventListener('click', function() {
                env.setEnvironment(this.getAttribute("id"), scene);
            });
        }

        $('body').on('editorPropertyChanged', function(e) {
            //console.log(e.name, e.value);
            
            if(e.name === "show_background") {
                if(e.value === true) {
                    self.environmentManager.turnBackgroundOnOff(true);
                }
                else if(e.value === false) {
                    self.environmentManager.turnBackgroundOnOff(false);
                }
            }
            
            if(e.name === "show_ground_plane") {
                if(e.value === true) {
                    self.environmentManager.turnGroundPlaneOffOn(true);
                }
                else if(e.value === false) {
                    self.environmentManager.turnGroundPlaneOffOn(false);
                }
            }
            
            if(e.name === "show_shadow") {
                if(e.value === true) {
                    self.environmentManager.turnShadowOffOn(true);
                }
                else if(e.value === false) {
                    self.environmentManager.turnShadowOffOn(false);
                }
            }
            
            if(e.name === "show_reflective") {
                if(e.value === true) {
                    self.environmentManager.turnReflectivePlaneOffOn(true);
                }
                else if(e.value === false) {
                    self.environmentManager.turnReflectivePlaneOffOn(false);
                }
            }
            
            if(e.name === "gragient_top_hue") {
                self.environmentManager.changeTopGradient(e.value);
            }
            
            if(e.name === "gragient_bottom_hue") {
                self.environmentManager.changeBottomGradient(e.value);
            }
            
            if(e.name === "gragient_offset") {
                self.environmentManager.changeGradientOffset(e.value);
            }
            
            if(e.name === "reflective_amount") {
                self.environmentManager.changeReflectionAmount(e.value);
            }
           
        });
        
        /*document.getElementById("background").onchange = (ev) => {
            this.environmentManager.turnBackgroundOnOff((<HTMLInputElement>ev.target).checked);
        };

        document.getElementById("shadows").onchange = (ev) => {
            this.environmentManager.turnShadowOffOn((<HTMLInputElement>ev.target).checked);
        };

        document.getElementById("groundPlaneCheckbox").onchange = (ev) => {
            this.environmentManager.turnGroundPlaneOffOn((<HTMLInputElement>ev.target).checked);
        };

        document.getElementById("groundPlaneSize").oninput = (ev) => {
            this.environmentManager.changeGroundPlaneSize(parseFloat((<HTMLInputElement>ev.target).value));
        };

        document.getElementById("gradientTop").onchange = (ev) => {
            this.environmentManager.changeTopGradient((<HTMLInputElement>ev.target).value);
        };
        document.getElementById("gradientBottom").onchange = (ev) => {
            this.environmentManager.changeBottomGradient((<HTMLInputElement>ev.target).value);
        };
        document.getElementById("gradientOffset").oninput = (ev) => {
            this.environmentManager.changeGradientOffset(parseFloat((<HTMLInputElement>ev.target).value));
        };

        document.getElementById("reflective").onchange = (ev) => {
            this.environmentManager.turnReflectivePlaneOffOn((<HTMLInputElement>ev.target).checked);
        };
        
        document.getElementById("reflectionAmount").oninput = (ev) => {
            this.environmentManager.changeReflectionAmount(parseFloat((<HTMLInputElement>ev.target).value));
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
        });*/
    }
}