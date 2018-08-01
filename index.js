'use strict';

const constraints = {
  audio: true,
  video: {
    width: 1280,
    height: 720
  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(function (mediaStream) {
    let video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      e.preventDefault();
      video.play();
    };
  })
  .catch(function(err) {
    console.log(err.message);
  });