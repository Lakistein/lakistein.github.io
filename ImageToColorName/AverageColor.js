function GetImage(){document.getElementById("img").onchange=function(a){var b=a.target||window.event.srcElement,c=b.files;if(FileReader&&c&&c.length){var d=new FileReader,f=new Image;d.onload=function(){f.onload=function(a){var b=document.createElement("canvas");b.width=this.width,b.height=this.height,b.getContext("2d").drawImage(this,0,0,this.width,this.height);for(var c=b.getContext("2d"),d=c.getImageData(0,0,this.width,this.height),e=d.data,f=0,g=0,h=0,i=0,j=0,k=e.length;j<k;j+=4)f+=e[j],g+=e[j+1],h+=e[j+2],i+=e[j+3];var l=rgbToHex(Math.round(f/(e.length/4)),Math.round(g/(e.length/4)),Math.round(h/(e.length/4))),m=ntc.name(l);n_rgb=m[0],n_name=m[1],n_exactmatch=m[2],document.getElementById("clr").style.backgroundColor=n_rgb,document.getElementById("clrName").innerText=n_name},f.src=d.result},d.readAsDataURL(c[0])}}}function rgbToHex(a,b,c){return"#"+((1<<24)+(a<<16)+(b<<8)+c).toString(16).slice(1)}