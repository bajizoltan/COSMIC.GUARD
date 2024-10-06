// ------------------------
// GLOBAL VARS
// ------------------------

var camera, controls, scene, renderer, cube, sphere, line, celestialBody, lookAtVector;

var nbrOfPlanet = 1;

// Names of the celestial objects (Earth, Mars, Mercury, Venus)
var objNames = ["Earth_Orbit", "Mars_orbit", "Mercury_Orbit", "Venus_Orbit"];


// Sizes of the objects (corresponding to planets)
var objSizes = [0.2, 0.17, 0.07, 0.2];


// Colors for each celestial body (hexadecimal format)
var objColors = [0x0066ff, 0xcc3333, 0xff0000, 0xffffff];


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

  // Add trackball controls to enable interactive scene manipulation (rotate, zoom, pan)
  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];
  controls.addEventListener("change", render);

  // Create a 3D scene
  scene = new THREE.Scene();

  // Create the WebGL renderer and set its size
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

  // Append the renderer's DOM element to the document (so it appears on the webpage)
  document.body.appendChild(renderer.domElement);

  var j = 0;

// Create the Sun (a yellow sphere) and add it to the scene
  var geometry = new THREE.SphereGeometry(0.6, 16, 16);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: false,
  });

  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Add a point light to the scene (currently has no visible effect)
  var light = new THREE.PointLight(0xff0000, 1, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  // Add celestial bodies (planets) to the scene
  for (var i = 0; i < 4; i++) {
    geometry = new THREE.SphereGeometry(objSizes[j], 16, 16);
    material = new THREE.MeshBasicMaterial({
      color: objColors[j],
      wireframe: false,
    });
    sphere = new THREE.Mesh(geometry, material);
    sphere.name = objNames[i];
    scene.add(sphere);
    j++;
  }

  // Set the camera's initial position
  camera.position.z = 5;
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

var i = 0;
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
      populate_table(
        i,
        field.name.value,
        field.argPerigee.value,
        field.meanAnomoly.value,
        field.eccentricity.value,
        field.inclination.value,
        field.semiMajorAxis.value,
        field.raan.value,
        field.sidereal.value
      );
    }
  }
}

function changePlanet(planetIndex) {
  nbrOfPlanet = planetIndex;
  console.log("Changed planet to: " + objNames[planetIndex]);
}

// STEP1: Call initialization and start the animation
init();
// STEP2: Load data from JSON and process it to create trajectories
get_datablock();
// STEP3: Trace the orbits of celestial bodies
traceOrbits();
// STEP4: Start the animation loop
animate();
