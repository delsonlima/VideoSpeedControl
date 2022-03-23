/*
** Video Speed Control
*/

var vscContainer   = document.createElement("div");
vscContainer.id    = "vscContainer";
vscContainer.style = "position:fixed;top:0px;right:0px;z-index:10000";
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
    var videoTags = document.querySelectorAll("video");
    var iframeTags = document.querySelectorAll("iframe");
    var res = true;

    var changeTags = function(tags) {
        for (var i=0; i<tags.length; i++) {
            console.log("vsc: video speed changed -> " + vscSpeed);
            tags[i].playbackRate = vscSpeed;
        }
    }

    if (videoTags.length) {
        changeTags(videoTags);
    } else res = false;

    if (iframeTags.length) {
        for (var j=0; j<iframeTags.length; j++) {
            changeTags(iframeTags[j].contentWindow.document.querySelectorAll("video"));
        }
    } else res = false;

    if (!res) console.log("No video tag found :(");
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
        vscManualVelocity.addEventListener("keyup", function(){
            this.value = this.value.replace(",", ".");
        })
        vscManualVelocity.addEventListener("keydown",function(event){
            if (event.key == "Enter") {
                vscUpdateVideoSpeed(this.value);
                this.blur();
            }
        });
        document.querySelector("#vscContainer").appendChild(vscManualVelocity).focus();
    }
});
