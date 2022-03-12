/*
** Video Speed Controller
*/

var vscContainer   = document.createElement("div");
vscContainer.id    = "vscContainer";
vscContainer.style = "position:absolute;top:0px;right:0px;z-index:10000";
document.body.appendChild(vscContainer);

var vscVelocity   = document.createElement("select");
vscVelocity.id    = "vscVelocity";
vscVelocity.style = "width:50pt";
vscVelocity.addEventListener("change", function(){
    var vscManualQuery = document.querySelector("#vscManualVelocity");
    if (vscManualQuery != null) { vscManualQuery.remove(); }
});
document.querySelector("#vscContainer").appendChild(vscVelocity);

var vscVelocitiesArray = [1,1.5,2,2.5,3,3.5,"custom"];
for (var i = 0; i < vscVelocitiesArray.length; i++) {
    var velocityOption       = document.createElement("option");
    velocityOption.value     = vscVelocitiesArray[i];
    velocityOption.innerHTML = vscVelocitiesArray[i];
    document.querySelector("#vscVelocity").appendChild(velocityOption);
}

function vscUpdateVideoSpeed(vscSpeed) {
    var videoTag = null;

    if (document.querySelector("video") != null) {
        videoTag = document.querySelector("video");
    } else {
        var frameQuery = document.querySelector("iframe");
        if (frameQuery != null) {
            var videoOnFrameQuery = frameQuery.contentWindow.document.querySelector("video");
            if (videoOnFrameQuery != null) {
                videoTag = videoOnFrameQuery;
            }
        }
    }

    if (videoTag != null) {
        videoTag.playbackRate = vscSpeed;
        console.log("vsc: video speed changed -> " + vscSpeed);
    } else {
        console.log("No video tag found :(");
    }
}

document.querySelector("#vscVelocity").addEventListener("change", function(event) {
    var vscSpeed = event.target.value;

    if (parseInt(vscSpeed)) {
        vscUpdateVideoSpeed(vscSpeed);
    } else {
        var vscManualVelocity   = document.createElement("input");
        vscManualVelocity.id    = "vscManualVelocity";
        vscManualVelocity.placeholder = "1.0";
        vscManualVelocity.style = "display:block;width:40pt";
        vscManualVelocity.addEventListener("keydown",function(event){
            if (event.key == "Enter") {
                vscUpdateVideoSpeed(this.value);
                this.blur();
            }
        });
        document.querySelector("#vscContainer").appendChild(vscManualVelocity).focus();
    }
});
