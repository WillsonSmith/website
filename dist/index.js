const wavePath = document.querySelector("#wave-clip path");

let time = 0;
const numPoints = 50;

let amplitudeMultiplier = 1;

const waves = [
  { amplitude: 0.01, frequency: 2, phase: 0, bobSpeed: 0.005 },
  { amplitude: 0.006, frequency: 2, phase: Math.PI / 2, bobSpeed: 0.007 },
  { amplitude: 0.008, frequency: 2, phase: Math.PI, bobSpeed: 0.004 },
];

// let scrollWave = {
// x: 0,
//   amplitude: 0, // Starts at 0, grows on scroll
//   frequency: 1.5, // Slightly larger wavelength
//   phase: 0, // Phase dynamically tied to mouse position
//   decay: 0.005, // Rate at which the scroll wave fades out
// };

function animateWave() {
  let pathD = `M0,0.5`; // Start path at the middle of the screen

  if (amplitudeMultiplier > 1) {
    amplitudeMultiplier -= 0.01;
  }

  for (let i = 0; i <= numPoints; i++) {
    const x = i / numPoints; // Normalized x position (0 to 1)
    let y = 0.5; // Start with baseline height

    // Sum contributions from all waves
    for (const wave of waves) {
      y +=
        wave.amplitude *
        amplitudeMultiplier *
        Math.sin((wave.frequency * x + wave.phase + time) * Math.PI * 2);
    }

    pathD += ` L${x},${y}`;
  }

  pathD += ` V1 H0 Z`; // Close the path
  wavePath.setAttribute("d", pathD);

  // Animate individual wave properties (bobbing)
  for (const wave of waves) {
    wave.phase += wave.bobSpeed; // Increment phase to create the bobbing effect
  }

  // Increment time for global wave movement
  time += 0.0001;

  requestAnimationFrame(animateWave);
}

// globalThis.addEventListener("mousemove", (e) => {
//   mouseX = e.pageX;
// });

let isMoving = false;
globalThis.addEventListener("scroll", (e) => {
  const scrollStrength = Math.min(0.1, globalThis.scrollY * 0.0002);
  if (amplitudeMultiplier < 3) {
    amplitudeMultiplier += scrollStrength;
  }
  // console.log(scrollStrength);
  // if (amplitudeMultiplier == 1) {
  //   isMoving = true;
  //   amplitudeMultiplier = 2;
  //   // setTimeout(() => {
  //   //   isMoving = false;
  //   //   amplitudeMultiplier = 1;
  //   // }, 1000);
  // }

  //   if (scrollWave.amplitude == 0) {
  //       scrollWave.x = mouseX
  // scrollWave.amplitude = Math.max(scrollWave.amplitude, scrollWave.amplitude + 0.1); // Increase amplitude
  // scrollWave.phase = (scrollWave.x / document.body.clientWidth) * Math.PI * 2;
  //
  //   }
  // const scrollStrength = Math.min(0.1, window.scrollY * 0.0002); // Scale with scroll distance
});

animateWave();
