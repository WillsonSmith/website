const wavePath = document.querySelector("#wave-clip path");

let time = 0;
const numPoints = 50;

let amplitudeMultiplier = 1;

const waves = [
  { amplitude: 0.01, frequency: 2, phase: 0, bobSpeed: 0.005 },
  { amplitude: 0.006, frequency: 2, phase: Math.PI / 2, bobSpeed: 0.007 },
  { amplitude: 0.008, frequency: 2, phase: Math.PI, bobSpeed: 0.004 },
];

function animateWave() {
  let pathD = `M0,0.5`; // Start path at the middle of the screen

  if (amplitudeMultiplier > 1) {
    amplitudeMultiplier -= 0.01;
  }

  for (let i = 0; i <= numPoints; i++) {
    const x = i / numPoints; // Normalized x position (0 to 1)
    let y = 0.5;

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

globalThis.addEventListener("scroll", () => {
  const scrollStrength = Math.min(0.1, globalThis.scrollY * 0.0002);
  if (amplitudeMultiplier < 3) {
    amplitudeMultiplier += scrollStrength;
  }
});

animateWave();