var planetDetails = [
  {
    name: "Earth",
    diameter: "12,742 km",
    distanceFromSun: "149.6 million km",
    description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life."
  },
  {
    name: "Mars",
    diameter: "6,779 km",
    distanceFromSun: "227.9 million km",
    description: "Mars is the fourth planet from the Sun and is often called the 'Red Planet' due to its reddish appearance."
  },
  {
    name: "Mercury",
    diameter: "4,880 km",
    distanceFromSun: "57.9 million km",
    description: "Mercury is the smallest planet in our solar system and the closest to the Sun."
  },
  {
    name: "Venus",
    diameter: "12,104 km",
    distanceFromSun: "108.2 million km",
    description: "Venus is the second planet from the Sun and has a thick, toxic atmosphere."
  },
  {
    name: "Sun",
    diameter: "1.39 million km",
    distanceFromSun: "0 km", 
    description: "The Sun is the star at the center of our solar system. It is a nearly perfect sphere of hot plasma, providing the energy that powers life on Earth. The Sun contains 99.86% of the total mass of the solar system."
  }
];

// ------------------------
// GLOBAL VARS
// ------------------------

var camera, controls, scene, renderer, cube, line, celestialBody, lookAtVector;
var moon, sun;

var nbrOfPlanet = 1;

// Names of the celestial objects (Earth, Mars, Mercury, Venus)
var objNames = ["Earth_Orbit", "Mars_orbit", "Mercury_Orbit", "Venus_Orbit"];

// Textures of the celestial objects
// From https://www.solarsystemscope.com/textures/
var objTextures = [
  "static/img/earth_suface.jpg", 
  "static/img/mars_surface.jpg", 
  "static/img/mercury_surface.jpg", 
  "static/img/venus_surface.jpg"];

// Sizes of the objects (corresponding to planets)
var objSizes = [0.2, 0.17, 0.07, 0.2];


// Colors for each celestial body (hexadecimal format)
//var objColors = [0x0066ff, 0xcc3333, 0xff0000, 0xffffff];
var objColors = [0xffffff, 0xffffff, 0xffffff, 0xffffff];


// Array to store trajectory information for heavenly bodies
var heavenlyBodies = [];

// ------------------------
// FUNC INIT
// ------------------------
function init() {
  // Create a perspective camera with field of view 75, and aspect ratio based on window size
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  lookAtVector = new THREE.Vector3(0,0,0);
  camera.lookAt(lookAtVector);

  var textureLoader = new THREE.TextureLoader();

  // Add trackball controls to enable interactive scene manipulation (rotate, zoom, pan)
  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = true;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];
  controls.addEventListener("change", render);

  // Create a 3D scene
  scene = new THREE.Scene();

  // Create the WebGL renderer and set its size
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);

  // Append the renderer's DOM element to the document (so it appears on the webpage)

  var container = document.getElementById('scene-container');
  container.appendChild(renderer.domElement);  
  //document.body.appendChild(renderer.domElement);

  var j = 0;

  // Create the Sun (a yellow sphere) and add it to the scene
  var geometry = new THREE.SphereGeometry(0.6, 16, 16);
  var material = new THREE.MeshBasicMaterial({
    map: textureLoader.load("static/img/sun_surface.jpg"),  // Apply the texture
    //color: 0xffff00,
    color: 0xfffff0,
    wireframe: false,
  });

  sun = new THREE.Mesh(geometry, material);
  scene.add(sun);

  // Add a point light to the scene (currently has no visible effect)
  var light = new THREE.PointLight(0xff0000, 1, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  // Add celestial bodies (planets) to the scene

  for (var i = 0; i < 4; i++) {
    mytexture = textureLoader.load(objTextures[j]);
    geometry = new THREE.SphereGeometry(objSizes[j], 16, 16);
    material = new THREE.MeshBasicMaterial({
      map: mytexture,  // Apply the texture
      color: objColors[j],
      wireframe: false,
    });
    sphere = new THREE.Mesh(geometry, material);
    sphere.name = objNames[i];
    scene.add(sphere);
    j++;
  }

  // Create the Moon's geometry and material
  var moonGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Adjust size of the Moon (smaller than Earth)
  var moonMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("static/img/moon_surface.jpg"),  // Apply the texture
    color: 0xfffff0,  // Light gray color for the Moon
    wireframe: false
  });

  moon = new THREE.Mesh(moonGeometry, moonMaterial);

  moon.position.set(0.7, 0, 0);  // Example distance from the Earth
  scene.add(moon);

  // Set the camera's initial position
  camera.position.z = 5;
}

var moonOrbitRadius = 0.3; // Adjust orbit radius (distance from Earth)
var moonSpeed = 10; // Adjust speed of orbit

function animateMoon() {
  // Continuously update the Moon's position to create an orbit
  var time = Date.now() * 0.001; // Incremental time for animation

  var hbTAnomoly = heavenlyBodies[0].trueAnomoly;
  currentPosition = heavenlyBodies[0].propagate(hbTAnomoly) ;  // Determine the current position.  

  var x = currentPosition[0] ;
  var y = currentPosition[1] ;
  var z = currentPosition[2] ;
  
  moon.position.y = y;

  moon.position.x = x + moonOrbitRadius * Math.cos(time * moonSpeed);
  moon.position.z = z + moonOrbitRadius * Math.sin(time * moonSpeed);  
}

function animateSun() {
  // Rotate the Sun around its Y-axis (or any axis you'd like)
  sun.rotation.y += 0.001; // Adjust the speed of rotation
}

// ------------------------
// FUNC RENDER
// ------------------------
// Render the scene
function render() {
  // Continuously call render for each frame
  requestAnimationFrame(render);

  if (nbrOfPlanet >= 0 && nbrOfPlanet < heavenlyBodies.length) 
  {
    var hbTAnomoly = heavenlyBodies[nbrOfPlanet].trueAnomoly;
    currentPosition = heavenlyBodies[nbrOfPlanet].propagate(hbTAnomoly) ;  // Determine the current position.  
  
    var x = currentPosition[0] ;
    var y = currentPosition[1] ;
    var z = currentPosition[2] ;
    var hBName = heavenlyBodies[nbrOfPlanet].name;  
  
    lookAtVector.set(x,y,z);    
  }
  else
  {
    lookAtVector.set(0,0,0);  
    console.log("SetSun")
  }

  camera.lookAt(lookAtVector); // Set look at coordinate like this

  //console.log(hBName, currentPosition);

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// ------------------------
// FUNC ANIMATE
// ------------------------
// Animate the scene
function animate() {
  // Continuously call animate for each frame
  requestAnimationFrame(animate);
  // Update the controls (for interactive rotation, zoom, pan)
  controls.update();
  // Update object positions
  updatePosition();
  // Call the moon animation
  animateMoon();
  // Call the sun animation  
  animateSun();
}

// ------------------------
// FUNC POPULATE_TABLE
// ------------------------
// Populate the table with celestial body data (each row contains information for one object)
function populate_table(rowNum, name, argP, meanA, ecc, inc, sma, raan, per) {
  // Get the table cell by its ID (e.g., r1c1 for row 1, column 1) and set the text content
  var cellID = "r" + rowNum + "c1";
  document.getElementById(cellID).textContent = name;
  document.getElementById("r" + rowNum + "c2").textContent = argP;
  document.getElementById("r" + rowNum + "c3").textContent = meanA;
  document.getElementById("r" + rowNum + "c4").textContent = ecc;
  document.getElementById("r" + rowNum + "c5").textContent = inc;
  document.getElementById("r" + rowNum + "c6").textContent = sma;
  document.getElementById("r" + rowNum + "c7").textContent = raan;
  document.getElementById("r" + rowNum + "c8").textContent = per;
}

// ------------------------
// FUNC GET_DATABLOCK
// ------------------------
// Load the JSON-LD data and process it to create trajectories for celestial bodies
function get_datablock() {
  var jsonld = document.querySelector("#OrbitOntology").innerText;
  var result = JSON.parse(jsonld);
  console.log(result.graph[1].name.value);

  // Loop through the celestial bodies in the JSON graph
  for (i = 1; i < result.graph.length; i++) {
    field = result.graph[i];
    if (i > 0 && i < 5) {
     // Create a Trajectory object for each celestial body using the data from JSON
      celestialBody = new Trajectory(
        field.name.value,
        field.semiMajorAxis.value,
        field.inclination.value,
        field.argPerigee.value,
        field.eccentricity.value,
        field.raan.value,
        field.meanAnomoly.value,
        field.sidereal.value
      );
      
      // Add the celestial body to the array
      heavenlyBodies.push(celestialBody);

      // Populate the table with data for the celestial body
      // populate_table(
      //   i,
      //   field.name.value,
      //   field.argPerigee.value,
      //   field.meanAnomoly.value,
      //   field.eccentricity.value,
      //   field.inclination.value,
      //   field.semiMajorAxis.value,
      //   field.raan.value,
      //   field.sidereal.value
      // );
    }
  }
}

function changePlanet(planetIndex) {
    
    if (planetIndex >= 0 && planetIndex < planetDetails.length) {
      nbrOfPlanet = planetIndex;
      console.log("Changed planet to: " + planetDetails[planetIndex].name);
  
      // Kiválasztott bolygó információinak kiírása a HTML-be
      var planet = planetDetails[planetIndex];
      var infoDiv = document.getElementById('planetInfo');
      infoDiv.innerHTML = `
        <h2>${planet.name}</h2>
        <p><strong>Diameter:</strong> ${planet.diameter}</p>
        <p><strong>Distance from Sun:</strong> ${planet.distanceFromSun}</p>
        <p><strong>Description:</strong> ${planet.description}</p>
      `;
    } else {
      // Ha érvénytelen az index, a Nap (utolsó elem) lesz beállítva
      console.log("Invalid planet index: " + planetIndex + ". Defaulting to Sun.");
      nbrOfPlanet = planetDetails.length - 1; // A Nap indexe az utolsó
      changePlanet(nbrOfPlanet); // Hívjuk meg újra a changePlanet függvényt a Nap indexével
    }    
}

// STEP1: Call initialization and start the animation
init();
// STEP2: Load data from JSON and process it to create trajectories
get_datablock();
// STEP3: Trace the orbits of celestial bodies
traceOrbits();
// STEP4: Start the animation loop
animate();

changePlanet(5);
