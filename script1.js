const video = document.getElementById('video');
const canvas = document.getElementById('face-canvas');
const ctx = canvas.getContext('2d');
const backgroundCanvas = document.getElementById('background-canvas');
const bgCtx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

let particlesArray = [];
let faceModel;

// Create particle object
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  
  // Draw particle
  draw() {
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    bgCtx.fillStyle = this.color;
    bgCtx.fill();
  }

  // Update particle position and check boundaries
  update() {
    if (this.x + this.size > backgroundCanvas.width || this.x - this.size < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y + this.size > backgroundCanvas.height || this.y - this.size < 0) {
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

// Create particle array
function initParticles() {
  particlesArray = [];
  let numberOfParticles = (backgroundCanvas.width * backgroundCanvas.height) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 5) + 1;
    let x = (Math.random() * (backgroundCanvas.width - size * 2)) + size;
    let y = (Math.random() * (backgroundCanvas.height - size * 2)) + size;
    let directionX = (Math.random() * 2) - 1;
    let directionY = (Math.random() * 2) - 1;
    let color = '#00b4db';
    
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// Animation loop for particles
function animateParticles() {
  requestAnimationFrame(animateParticles);
  bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
}

// Initialize particles
initParticles();
animateParticles();

// Set up the camera for face tracking
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  
  video.addEventListener('loadeddata', () => {
    detectFace();
  });
}

// Load the face detection model and detect the face
async function detectFace() {
  faceModel = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  );

  const faceLoop = async () => {
    const predictions = await faceModel.estimateFaces({
      input: video
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        ctx.beginPath();
        ctx.arc(prediction.scaledMesh[1][0], prediction.scaledMesh[1][1], 5, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
      });
    }
    requestAnimationFrame(faceLoop);
  };
  
  faceLoop();
}

// Start the camera and detection
setupCamera();

// Adjust canvas size on window resize
window.addEventListener('resize', function() {
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
  initParticles();
});
