var wrapper = document.getElementById("s-p");
var clearButton = wrapper.querySelector("[data-action=clear]");
var changeColorButton = wrapper.querySelector("[data-action=change-color]");
var colorPalette = document.querySelector('.color-palette')
var undoButton = wrapper.querySelector("[data-action=undo]");
var savePNGButton = wrapper.querySelector("[data-action=png]");
var saveJPGButton = wrapper.querySelector("[data-action=jpg]");
var saveSVGButton = wrapper.querySelector("[data-action=svg]");
var canvas = wrapper.querySelector("canvas");
const knockSound = document.getElementById("knockSound");
const scribbleSound = document.getElementById("scribbleSound");

// Set backgroundColor for the signature pad
var signaturePad = new SP(canvas, {
    backgroundColor: '#ffffff00' // transparent
});

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
  
    // This part causes the canvas to be cleared
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
  
    // This library does not listen for canvas changes, so after the canvas is automatically
    // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
    // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
    // that the state of this library is consistent with visual state of the canvas, you
    // have to clear it manually.
    signaturePad.clear();
  }
  
  // On mobile devices it might make more sense to listen to orientation change,
  // rather than window resize events.
  window.onresize = resizeCanvas;
  resizeCanvas();
  
// Download function
  function download(dataURL, filename) {
    var blob = dataURLToBlob(dataURL);
    var url = window.URL.createObjectURL(blob);
  
    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;
  
    document.body.appendChild(a);
    a.click();
  
    window.URL.revokeObjectURL(url);
  }
  
  // One could simply use Canvas#toBlob method instead, but it's just to show
  // that it can be done using result of SignaturePad#toDataURL.
  function dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
  
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
  
    return new Blob([uInt8Array], { type: contentType });
  }
  
  clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
  });
  
  undoButton.addEventListener("click", function (event) {
    var data = signaturePad.toData();
  
    if (data) {
      data.pop(); // remove the last dot or line
      signaturePad.fromData(data);
    }
  });
  
  changeColorButton.addEventListener("click", function (event) {
    if (colorPalette.style.display === "none") {
      colorPalette.style.display = "flex";
    }
    else if (colorPalette.style.display === "") {
      colorPalette.style.display = "flex";
    } else {
      colorPalette.style.display = "none";
    }
  });
  
  savePNGButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      alert("Please provide a signature first.");
    } else {
      var dataURL = signaturePad.toDataURL();
      download(dataURL, "signature.png");
    }
  });
  
  saveJPGButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      alert("Please provide a signature first.");
    } else {
      var dataURL = signaturePad.toDataURL("image/jpeg");
      download(dataURL, "signature.jpg");
    }
  });
  
  saveSVGButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      alert("Please provide a signature first.");
    } else {
      var dataURL = signaturePad.toDataURL('image/svg+xml');
      download(dataURL, "signature.svg");
    }
  });
  