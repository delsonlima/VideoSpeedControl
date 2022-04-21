/*
** Video Speed Control
*/

vscGlobalSpeed = 1;
vscDebug=false;

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

    if (vscSpeed) vscGlobalSpeed = vscSpeed;
    else vscSpeed = vscGlobalSpeed;

    var changeTags = function(tags) {
        for (var i=0; i<tags.length; i++) {
            if (vscDebug) console.log("vsc: video speed changed -> " + vscSpeed);
            tags[i].playbackRate = vscSpeed;
       }
    }

    if (videoTags.length) {
        changeTags(videoTags);
    } else res = false;

    if (iframeTags.length) {
        for (var j=0; j<iframeTags.length; j++) {
            try {
                changeTags(iframeTags[j].contentWindow.document.querySelectorAll("video"));
            } catch {}
        }
    } else res = false;

    if (vscDebug) { if (!res) console.log("No video tag found :("); }
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

const vscObserver = new MutationObserver(function(mutationList){
    mutationList.forEach(function(mutation){
       if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(element){
                if (element.localName === 'video') {
                    if (vscDebug) console.log("video tag direct added");
                    vscUpdateVideoSpeed();
                } else if (element.localName != null && element.localName != 'span') {
                    if (vscDebug) console.log("video tag added as child");
                    vscUpdateVideoSpeed();
                }
            });
        }
    });
});

function vscRegisterObserver() {
    var obs1 = document.querySelector("body");
    var obs2 = document.querySelector("iframe").contentDocument.body;
    //var conf = {subtree:true,childList:true};
    var conf = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    };
    vscObserver.observe(obs1, conf);
    vscObserver.observe(obs2, conf);
}
vscRegisterObserver();
window.addEventListener("load", vscRegisterObserver);
