'use strict';

// Providing model files in a models directory along with your assets under public/models
const MODEL_URL = '/models';
await faceapi.loadModels(MODEL_URL);

// If wanting to only load specific models
await faceapi.loadFaceDetectionModel(MODEL_URL);
await faceapi.loadFaceLandmarkModel(MODEL_URL);
await faceapi.loadFaceRecognitionModel(MODEL_URL);

// To detect the face’s bounding boxes of an input with a score > minScore we simply say:
const minConfidence = 0.8;
const fullFaceDescriptions = await faceapi.allFaces(input, minConfidence);

// Gaining access to user's webcam (audio & video)
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