"use strict";
/* Adaptador visual local: conserva el juego original en su relación 160×272
   y usa una copia ambiental atenuada para completar cualquier monitor. */
(function localFullscreen(){
  const sourceCanvas = document.getElementById('cv');
  const ambientCanvas = document.getElementById('ambient');
  if(!sourceCanvas || !ambientCanvas) return;

  ambientCanvas.width = 160;
  ambientCanvas.height = 272;
  const ambientContext = ambientCanvas.getContext('2d', {alpha:false});
  ambientContext.imageSmoothingEnabled = false;

  function mirrorFrame(){
    ambientContext.drawImage(sourceCanvas, 0, 0, 160, 272);
    requestAnimationFrame(mirrorFrame);
  }
  requestAnimationFrame(mirrorFrame);
})();
