var PBRConverter=function(){function a(){}return a.PBRToJSON=function(a){return'{ "indexOfRefraction":'+a.indexOfRefraction+',"albedoTexture":"'+(a.albedoTexture?encodeURI(a.albedoTexture.getInternalTexture().url):"null")+'","ambientTexture":"'+(a.ambientTexture?encodeURI(a.ambientTexture.getInternalTexture().url):"null")+'","bumpTexture":"'+(a.bumpTexture?encodeURI(a.bumpTexture.getInternalTexture().url):"null")+'","emissiveTexture":"'+(a.emissiveTexture?encodeURI(a.emissiveTexture.getInternalTexture().url):"null")+'","alpha" : '+a.alpha+',"directIntensity" : '+a.directIntensity+',"emissiveIntensity" : '+a.emissiveIntensity+',"environmentIntensity" : '+a.environmentIntensity+',"specularIntensity" : '+a.specularIntensity+',"overloadedShadowIntensity" : '+a.overloadedShadowIntensity+',"overloadedShadeIntensity" : '+a.overloadedShadeIntensity+',"cameraExposure" : '+a.cameraExposure+',"cameraContrast" : '+a.cameraContrast+',"microSurface" : '+a.microSurface+',"reflectivityColor" : {"r":'+a.reflectivityColor.r+', "g":'+a.reflectivityColor.g+', "b":'+a.reflectionColor.b+"}}"},a.prototype.JSONToPBR=function(a){return null},a}(),Environment=function(){function a(a,b){if(this.lights=[],a){this.backgroundColor=b.getMeshByName("background").material.albedoColor=new BABYLON.Color3(a.backgroundColor.r,a.backgroundColor.g,a.backgroundColor.b);for(var c=0;c<a.lights.length;c++){var d;switch(a.lights[c].type){case"spot":d=new BABYLON.SpotLight("spot",new BABYLON.Vector3(a.lights[c].position.x,a.lights[c].position.y,a.lights[c].position.z),new BABYLON.Vector3(a.lights[c].direction.x,a.lights[c].direction.y,a.lights[c].direction.z),a.lights[c].angle,5,b);break;case"point":d=new BABYLON.PointLight("point",new BABYLON.Vector3(a.lights[c].position.x,a.lights[c].position.y,a.lights[c].position.z),b);break;case"hemi":d=new BABYLON.HemisphericLight("hemi",new BABYLON.Vector3(a.lights[c].position.x,a.lights[c].position.y,a.lights[c].position.z),b)}d.intensity=a.lights[c].intensity,d.range=a.lights[c].range,d.diffuse=new BABYLON.Color3(a.lights[c].diffuse.r,a.lights[c].diffuse.g,a.lights[c].diffuse.b),d.specular=new BABYLON.Color3(a.lights[c].specular.r,a.lights[c].specular.g,a.lights[c].specular.b),this.lights.push(d)}}}return a.prototype.toJSON=function(){for(var a='{"backgroundColor": '+JSON.stringify(this.backgroundColor)+',"lights": [',b=0;b<this.lights.length;b++)("spot"===this.lights[b].name||"point"===this.lights[b].name||"hemi"===this.lights[b].name)&&(a+='{"type":'+JSON.stringify(this.lights[b].name)+',"position": '+JSON.stringify(this.lights[b].getAbsolutePosition())+",","spot"===this.lights[b].name&&(a+='"coneAngle":'+this.lights[b].angle+',"direction":'+JSON.stringify(this.lights[b].direction)+","),a+='"diffuse:"'+JSON.stringify(this.lights[b].diffuse)+',"specular:"'+JSON.stringify(this.lights[b].specular)+',"intensity": '+this.lights[b].intensity+',"range":'+this.lights[b].range.toPrecision(2)+"},");return a=a.substring(0,a.length-1),a+="]}"},a}(),EnviromentManager=function(){function a(a,b){this.environments=[];for(var c=JSON.parse(a),d=0;d<c.length;d++)this.environments.push(new Environment(c[d],b));this.setEnvironment(0,b)}return a.prototype.setEnvironment=function(a,b){for(var c=0;c<b.lights.length;c++)("spot"===b.lights[c].name||"point"===b.lights[c].name||"hemi"===b.lights[c].name)&&(b.lights=b.lights.splice(c,1));b.lights.concat(this.environments[a].lights),b.getMeshByName("background").material.albedoColor=this.environments[a].backgroundColor},a}();window.addEventListener("DOMContentLoaded",function(){function e(a){var c=b.addFolder(a.name);c.add(a,"indexOfRefraction",0,2),c.add(a,"alpha",0,1),c.add(a,"directIntensity",0,2),c.add(a,"emissiveIntensity",0,2),c.add(a,"environmentIntensity",0,2),c.add(a,"specularIntensity",0,2),c.add(a,"overloadedShadowIntensity",0,2),c.add(a,"overloadedShadeIntensity",0,2),c.add(a,"cameraExposure",0,2),c.add(a,"cameraContrast",0,2),c.add(a,"microSurface",0,1);var d=c.addColor(a,"albedoColor");d.onChange(function(b){var c=b.r/255,d=b.g/255,e=b.b/255;a.albedoColor=new BABYLON.Color3(c,d,e)}),c.add(a.reflectivityColor,"r",0,1),c.add(a.reflectivityColor,"g",0,1),c.add(a.reflectivityColor,"b",0,1)}function f(){var b=new BABYLON.Scene(c);d=new BABYLON.ArcRotateCamera("Camera",0,0,6,new BABYLON.Vector3(0,.5,0),b),d.lowerRadiusLimit=3,d.upperRadiusLimit=6,d.upperBetaLimit=1.6,d.attachControl(a,!0),d.wheelPrecision=50,d.setPosition(new BABYLON.Vector3(.004510142482902708,.7674630808337399,-2.9880500596552437)),b.activeCamera=d;var f=new BABYLON.SpotLight("spot",new BABYLON.Vector3(-.06,3.66,-2.63),new BABYLON.Vector3(-.1,-.8,.6),.9,1,b);f.range=8,f.intensity=500,f.diffuse=new BABYLON.Color3(0,0,0),f.specular=new BABYLON.Color3(1,1,1);var g=new BABYLON.CubeTexture("./textures/skybox",b);return BABYLON.SceneLoader.ImportMesh("","./","HEADSET.babylon",b,function(a){for(var c=new BABYLON.PBRMaterial("Black Plastic",b),d=new BABYLON.PBRMaterial("Red Plastic",b),f=new BABYLON.PBRMaterial("Chrome",b),h=new BABYLON.PBRMaterial("Black Metal",b),i=new BABYLON.PBRMaterial("Black Box",b),j=new BABYLON.PBRMaterial("Black Cushion",b),k=new BABYLON.PBRMaterial("Background",b),l=0;l<a.length;l++){switch(a[l].name){case"BOX_STYLE_1":i.albedoTexture=new BABYLON.Texture("./textures/blackbox.jpg",b),i.ambientTexture=new BABYLON.Texture("./textures/BOX_STYLE_1.jpg",b),i.reflectivityColor=new BABYLON.Color3(0,0,0),i.reflectionTexture=g,i.indexOfRefraction=2,i.directIntensity=1.7,i.environmentIntensity=.09,i.overloadedShadowIntensity=.6,i.overloadedShadeIntensity=.22,i.cameraExposure=1.5,i.cameraContrast=2,i.microSurface=.46,a[l].material=i;break;case"background":k.ambientTexture=new BABYLON.Texture("./textures/BACKGROUND_STYLE_1.jpg",b),k.albedoColor=BABYLON.Color3.Black(),k.reflectivityColor=new BABYLON.Color3(0,0,0),k.indexOfRefraction=2,k.directIntensity=1.6,k.environmentIntensity=.05,k.overloadedShadeIntensity=.8,k.cameraExposure=1.5,k.cameraContrast=1.8,k.microSurface=0,a[l].material=k;break;case"GROUNDPLANE_STYLE_1":var m=new BABYLON.StandardMaterial("g",b);m.opacityTexture=new BABYLON.Texture("./textures/GROUNDPLANESHADOW_STYLE_1.png",b),m.specularColor=BABYLON.Color3.Black(),a[l].material=m;break;case"HEADSETARCH_STYLE_1":h.albedoTexture=new BABYLON.Texture("./textures/blackmetal.jpg",b),h.ambientTexture=new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg",b),h.ambientTexture.coordinatesIndex=1,h.reflectivityColor=new BABYLON.Color3(.1,.1,.1),h.reflectionTexture=g,h.indexOfRefraction=2,h.directIntensity=.2,h.environmentIntensity=.24,h.specularIntensity=.7,h.overloadedShadeIntensity=.8,h.cameraExposure=1.99,h.cameraContrast=1,h.microSurface=.61,a[l].material=h;break;case"HEADSETBLACKPLASTIC_STYLE_1":c.albedoTexture=new BABYLON.Texture("./textures/blackplastic.jpg",b),c.ambientTexture=new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg",b),c.ambientTexture.coordinatesIndex=1,c.reflectionTexture=g,c.reflectivityColor=new BABYLON.Color3(.3,.3,.3),c.specularIntensity=.1,c.indexOfRefraction=.52,c.directIntensity=1,c.environmentIntensity=.05,c.overloadedShadowIntensity=.8,c.overloadedShadeIntensity=.8,c.cameraExposure=1.26,c.cameraContrast=1.6,c.microSurface=.31,a[l].material=c;break;case"HEADSETCHROME_STYLE_1":f.albedoTexture=new BABYLON.Texture("./textures/chrome.jpg",b),f.ambientTexture=new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg",b),f.ambientTexture.coordinatesIndex=1,f.reflectionTexture=g,f.reflectivityColor=new BABYLON.Color3(.9,.9,.9),f.directIntensity=.3,f.specularIntensity=1.5,f.environmentIntensity=.6,f.cameraExposure=.23,f.cameraContrast=1.9,f.microSurface=.21,a[l].material=f;break;case"HEADSETCOLOREDPLASTIC_STYLE_1":d.albedoTexture=new BABYLON.Texture("./textures/redplastic.jpg",b),d.ambientTexture=new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg",b),d.ambientTexture.coordinatesIndex=1,d.reflectionTexture=g,d.reflectivityColor=new BABYLON.Color3(.2,.2,.2),d.indexOfRefraction=.52,d.directIntensity=1,d.environmentIntensity=.5,d.specularIntensity=.3,d.overloadedShadowIntensity=1.3,d.overloadedShadeIntensity=.68,d.cameraExposure=.8,d.cameraContrast=2,d.microSurface=.34,a[l].material=d;break;case"HEADSETCUSHION_STYLE_1":j.albedoTexture=new BABYLON.Texture("./textures/blackcushion.jpg",b),j.reflectivityColor=new BABYLON.Color3(.05,.05,.05),j.ambientTexture=new BABYLON.Texture("./textures/HEADSET_STYLE_1.jpg",b),j.ambientTexture.coordinatesIndex=1,j.indexOfRefraction=.52,j.directIntensity=2,j.environmentIntensity=0,j.overloadedShadeIntensity=.81,j.cameraExposure=2,j.cameraContrast=2,j.microSurface=.4,a[l].material=j}a[l].material instanceof BABYLON.PBRMaterial&&e(a[l].material)}var n='[{"backgroundColor":{"r":0,"g":0,"b":1},"lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"coneAngle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"backgroundColor":{"r":0,"g":1,"b":0},"lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"coneAngle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]},{"backgroundColor":{"r":1,"g":0,"b":0},"lights":[{"type":"spot","position":{"x":-0.06,"y":3.66,"z":-2.63},"coneAngle":0.9,"direction":{"x":-0.1,"y":-0.8,"z":0.6},"diffuse":{"r":0,"g":0,"b":0},"specular":{"r":1,"g":1,"b":1},"intensity":500,"range":8.0}]}]',o=new EnviromentManager(n,b);o.setEnvironment(1,b)}),b}var d,a=document.getElementById("renderCanvas"),b=new dat.GUI,c=new BABYLON.Engine(a,!0),g=f(),h=null,j=(BABYLON.Ray.CreateNewFromTo(new BABYLON.Vector3(5.26,2.91,1.75),new BABYLON.Vector3(5.26,2.91,1.75)),new BABYLON.PointLight("lensLight",new BABYLON.Vector3(.027,.601,-1.225),g));j.intensity=0;var k=new BABYLON.LensFlareSystem("mainLensFlareSystem",j,g),l=new BABYLON.LensFlare(.4,1,new BABYLON.Color3(1,1,1),"./textures/Main Flare.png",k);l.texture.hasAlpha=!0;var m=new BABYLON.SpotLight("hexaLensLight",new BABYLON.Vector3(.027,.601,-1.225),new BABYLON.Vector3(.2,0,-1),10,.01,g);m.intensity=0;for(var n=new BABYLON.LensFlareSystem("hexaLensFlareSystem",m,g),w=(b.addFolder("Flares"),new BABYLON.LensFlare(.2,-2.85,new BABYLON.Color3(.1,.05,.05),"./textures/flare.png",n),new BABYLON.LensFlare(.1,-2.3,new BABYLON.Color3(.1,.05,.05),"./textures/Band_2.png",n),new BABYLON.LensFlare(.1,-.5,new BABYLON.Color3(.1,.05,.05),"./textures/flare.png",n),new BABYLON.LensFlare(.05,0,new BABYLON.Color3(.1,.05,.05),"./textures/flare.png",n),new BABYLON.LensFlare(.05,.4,new BABYLON.Color3(.1,.05,.05),"./textures/Band_2.png",n),new BABYLON.LensFlare(.05,.2,new BABYLON.Color3(.1,.05,.05),"./textures/Band_1.png",n),new BABYLON.LensFlare(.05,.5,new BABYLON.Color3(.1,.05,.05),"./textures/flare.png",n),[]),x=0;x<n.lensFlares.length;x++)w.push(n.lensFlares[x].size);g.registerBeforeRender(function(){var a=BABYLON.Ray.CreateNewFromTo(d.position,new BABYLON.Vector3(.027,.601,-1.225)),b=g.pickWithRay(a,function(a){return!0});if(null!=b&&null!=b.pickedPoint)l.color=BABYLON.Color3.Black(),n.isEnabled=!1;else{l.color=BABYLON.Color3.White(),n.isEnabled=!0;var c=m.position,e=d.position,f=BABYLON.Vector3.Dot(c,e);f/=Math.sqrt(c.x*c.x+c.y*c.y+c.z*c.z)*Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z);var i=Math.acos(f),j=180*i/Math.PI,k=.06-j/1e3;k>.1&&(k=.1);for(var o=0;o<n.lensFlares.length;o++)n.lensFlares[o].size=w[o]+(1-d.radius/6)/6,45>j?n.lensFlares[o].color=new BABYLON.Color3(k,k,k):n.isEnabled=!1}null==h&&(h=g.meshes.find(function(a){return"background"===a.name})),null!=h&&null!=d&&(h.rotation.y=-d.alpha+-Math.PI/2)}),c.runRenderLoop(function(){g.render()}),window.addEventListener("resize",function(){c.resize()})});