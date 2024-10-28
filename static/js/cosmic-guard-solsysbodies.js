let scene, camera, renderer, planet, planetTexture;
let rotationSpeed = 0.01;
let sunLight;

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

  sunLight = new THREE.PointLight(0xffffff, 2, 100);
  sunLight.position.set(0, 0, 0); // Sunlight from the Sun itself

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

  

  // If the Sun is selected, make it emit light
  if (selectedPlanet === 'sun') {
      // Add a PointLight to the Sun
      
      
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

