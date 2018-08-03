'use strict';

// Providing model files in a models directory along with your assets under public/models
const MODEL_URL = '/models';
await faceapi.loadModels(MODEL_URL);

// If wanting to only load specific models
// await faceapi.loadFaceDetectionModel(MODEL_URL);
// await faceapi.loadFaceLandmarkModel(MODEL_URL);
// await faceapi.loadFaceRecognitionModel(MODEL_URL);

// To detect the face’s bounding boxes of an input with a score > minScore we simply say:
const minConfidence = 0.8;
const fullFaceDescriptions = await faceapi.allFaces(input, minConfidence);

// We can visualize the detection results by drawing the bounding boxes into a canvas:
fullFaceDescriptions.forEach((fd, i) => {
  faceapi.drawDetection(CanvasGradient, fd.detection, {withScore: true})
})

// The face landmarks can be displayed as follows:
fullFaceDescriptions.forEach((fd, i) => {
  faceapi.drawLandmarks(canvas, fd.landmarks, {drawLines: true})
})

// fetch images from url as blobs
const blobs = await Promise.all(
  ['sheldon.png', 'raj.png', 'leonard.png', 'howard.png'].map(
    async uri => (await fetch(uri)).blob()
  )
)

// convert blobs to HTMLImage elements
const images = await Promise.all(blobs.map(
  blob => faceapi.bufferToImage(blob)
));

// For each image we locate the subjects face and compute the face descriptor
const refDescriptions = await Promise.all(images.map(
  async img => (await faceapi.allFaces(img))[0]
));

const labels = ['sheldon', 'raj', 'leonard', 'howard'];

const refDescriptors = refDescriptions.map((fd, i) => ({
  descriptor: fd.descriptor,
  label: labels[i]
}));

const sortAsc = (a, b) => a - b;

const results = fullFaceDescriptions.map((fd) => {
  const bestMatch = refDescriptors.map(
    ({ descriptor, label }) => ({
      label,
      distance: faceapi.euclideanDistance(fd.descriptor, descriptor)
    })
  ).sort(sortAsc)[0]

  return {
    detection: fd.detection,
    label: bestMatch.label,
    distance: bestMatch.distance
  }
});

// 0.6 is a good distance threshold value to judge whether the descriptors match or not
const maxDistance = 0.6;

// we can draw the bounding boxes together with their labels into a canvas to display the results:
results.forEach(result => {
  faceapi.drawDetection(canvas, result.detection, {withScore: false})

  const text = `${result.distance < maxDistance ? result.className : 'unknown'} (${result.distance})`;
  const {x, y, height: boxHeight} = detection.getBox();
  faceapi.drawText(
    canvas.getContext('2d'),
    x,
    y + boxHeight,
    text
  )
});

// Gaining access to user's webcam (audio & video)
// const constraints = {
//   audio: true,
//   video: {
//     width: 1280,
//     height: 720
//   }
// };

// navigator.mediaDevices.getUserMedia(constraints)
//   .then(function (mediaStream) {
//     let video = document.querySelector('video');
//     video.srcObject = mediaStream;
//     video.onloadedmetadata = function(e) {
//       e.preventDefault();
//       video.play();
//     };
//   })
//   .catch(function(err) {
//     console.log(err.message);
//   });