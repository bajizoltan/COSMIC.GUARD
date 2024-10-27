let scene, camera, renderer, planet, planetTexture;
let rotationSpeed = 0.01;

const planetTextures = {
    sun: '../static/img/sun_surface.jpg',
    mercury: '../static/img/mercury_surface.jpg',
    venus: '../static/img/venus_surface.jpg',
    earth: '../static/img/earth_surface.jpg',
    mars: '../static/img/mars_surface.jpg',
    jupiter: '../static/img/jupiter_surface.jpg',
    saturn: '../static/img/saturn_surface.jpg',
    uranus: '../static/img/uranus_surface.jpg',
    neptune: '../static/img/neptune_surface.jpg'
};

// Planet information with formatted HTML
const planetInfo = {
  sun: `
      <h2>The Sun</h2>
      <p>The Sun is the <strong>star</strong> at the center of the Solar System.</p>
      <p>It provides the light and heat necessary for life on Earth.</p>
      <img src="images/sun.jpg" alt="The Sun" style="width: 100px;">
  `,
  mercury: `
      <h2>Mercury</h2>
      <p><strong>Mercury</strong> is the smallest planet in the Solar System and the closest to the Sun.</p>
      <p>It has almost no atmosphere and is extremely hot on one side and cold on the other.</p>
      <img src="images/mercury.jpg" alt="Mercury" style="width: 100px;">
  `,
  venus: `
      <h2>Venus</h2>
      <p><strong>Venus</strong> is the second planet from the Sun and has a thick, toxic atmosphere.</p>
      <p>It is sometimes called Earth’s "sister planet" due to its similar size and structure.</p>
      <img src="images/venus.jpg" alt="Venus" style="width: 100px;">
  `,
  earth: `
      <h2>Earth</h2>
      <p><strong>Earth</strong> is the third planet from the Sun and the only astronomical object known to harbor life.</p>
      <p>Earth has a perfect balance of water, atmosphere, and temperature to support life.</p>
      <img src="images/earth.jpg" alt="Earth" style="width: 100px;">
  `,
  mars: `
      <h2>Mars</h2>
      <p><strong>Mars</strong> is known as the "Red Planet" due to its reddish appearance caused by iron oxide (rust).</p>
      <p>Scientists are currently exploring the possibility of life on Mars.</p>
      <img src="images/mars.jpg" alt="Mars" style="width: 100px;">
  `,
  jupiter: `
      <h2>Jupiter</h2>
      <p><strong>Jupiter</strong> is the largest planet in the Solar System and is known for its Great Red Spot.</p>
      <p>It has a strong magnetic field and more than 75 moons.</p>
      <img src="images/jupiter.jpg" alt="Jupiter" style="width: 100px;">
  `,
  saturn: `
      <h2>Saturn</h2>
      <p><strong>Saturn</strong> is the second-largest planet in the Solar System and is famous for its stunning ring system.</p>
      <p>Its rings are made of ice and rock particles.</p>
      <img src="images/saturn.jpg" alt="Saturn" style="width: 100px;">
  `,
  uranus: `
      <h2>Uranus</h2>
      <p><strong>Uranus</strong> has a unique sideways rotation, making it different from all other planets in the Solar System.</p>
      <p>It has a faint ring system and is mostly composed of water, methane, and ammonia.</p>
      <img src="images/uranus.jpg" alt="Uranus" style="width: 100px;">
  `,
  neptune: `
      <h2>Neptune</h2>
      <p><strong>Neptune</strong> is the furthest planet from the Sun and has the strongest winds in the Solar System.</p>
      <p>It is known for its deep blue color caused by methane in its atmosphere.</p>
      <img src="images/neptune.jpg" alt="Neptune" style="width: 100px;">
  `
};
// Initialize scene, camera, and renderer
function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const canvas = document.getElementById('solarSystemCanvas');
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create stars as points
  createStars();  

  // Ambient light to simulate soft space illumination
  const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
  scene.add(ambientLight);

  // Invisible directional light to simulate sunlight for planets
  invisibleSunLight = new THREE.DirectionalLight(0xffffff, 1);
  invisibleSunLight.position.set(-10, 0, 5); // Light comes from the left side
  invisibleSunLight.visible = true; // Initially invisible
  scene.add(invisibleSunLight);

  animate();
}

// Create stars as small spheres
function createStars() {
  const starGeometry = new THREE.SphereGeometry(0.1, 8, 8); // Small sphere for each star
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const starCount = 500; // Number of stars
  for (let i = 0; i < starCount; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);

      // Randomly position each star
      star.position.x = THREE.MathUtils.randFloatSpread(200);
      star.position.y = THREE.MathUtils.randFloatSpread(200);
      star.position.z = THREE.MathUtils.randFloatSpread(200);

      scene.add(star);
  }
}

// Handle planet selection
function selectPlanet(sel_planet) {
//document.getElementById('planetSelector').addEventListener('change', function(event) {
  const selectedPlanet = sel_planet;
  const newTexture = new THREE.TextureLoader().load(planetTextures[selectedPlanet]);

  // Remove the existing planet if it exists
  if (planet) {
      scene.remove(planet);
  }

  // Create the selected planet or the Sun
  const planetGeometry = (selectedPlanet === 'sun') 
      ? new THREE.SphereGeometry(1.5, 32, 32) // Larger for the Sun
      : new THREE.SphereGeometry(1, 32, 32);  // Standard size for planets

  const planetMaterial = (selectedPlanet === 'sun') 
      ? new THREE.MeshBasicMaterial({ map: newTexture }) // The Sun emits its own light
      : new THREE.MeshStandardMaterial({ map: newTexture }); // Planets reflect light

  planet = new THREE.Mesh(planetGeometry, planetMaterial);
  scene.add(planet);

  // Update planet info with formatted HTML
  document.getElementById('planetInfo').innerHTML = planetInfo[selectedPlanet];

  // If the Sun is selected, make it emit light
  if (selectedPlanet === 'sun') {
      // Add a PointLight to the Sun
      sunLight = new THREE.PointLight(0xffffff, 2, 100);
      sunLight.position.set(0, 0, 0); // Sunlight from the Sun itself
      scene.add(sunLight);

      // Hide the directional light
      invisibleSunLight.visible = false;

  } else {
      // Remove the Sun's light if it exists
      if (sunLight) {
          scene.remove(sunLight);
      }

      // Make the directional light visible to simulate the Sun's light for planets
      invisibleSunLight.visible = true;
  }
};


// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  if (planet) {
      planet.rotation.y += rotationSpeed; // Rotate the planet
  }
  renderer.render(scene, camera);
}

// Resize the renderer on window resize
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();

const planetList = document.getElementById('planetList');
const scrollUpBtn = document.querySelector('.scroll-up');
const scrollDownBtn = document.querySelector('.scroll-down');

let scrollOffset = 0;
const maxScroll = planetList.scrollHeight - document.querySelector('.planet-selector').clientHeight;

function updateScrollButtons() {
    // Check if we need to show the scroll buttons
    if (scrollOffset > 0) {
        scrollUpBtn.style.display = 'block';
    } else {
        scrollUpBtn.style.display = 'none';
    }

    if (scrollOffset < maxScroll) {
        scrollDownBtn.style.display = 'block';
    } else {
        scrollDownBtn.style.display = 'none';
    }
}

function scrollUp() {
    scrollOffset = Math.max(scrollOffset - 100, 0);
    planetList.style.top = -scrollOffset + 'px';
    updateScrollButtons();
}

function scrollDown() {
    scrollOffset = Math.min(scrollOffset + 100, maxScroll);
    planetList.style.top = -scrollOffset + 'px';
    updateScrollButtons();
}

// Initialize the scroll buttons visibility
window.onload = updateScrollButtons;