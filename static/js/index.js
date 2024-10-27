// Initialize Three.js scene
let scene, camera, renderer, stars = [];

function init() {
    const container = document.getElementById('scene-container');

    // Create a scene
    scene = new THREE.Scene();

    // Set up the camera
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = 500;

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create stars
    createStars();

    // Start the animation loop
    animate();
}

function createStars() {
    const starGeometry = new THREE.SphereGeometry(1, 24, 24);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);

        star.position.x = Math.random() * 2000 - 1000;
        star.position.y = Math.random() * 2000 - 1000;
        star.position.z = Math.random() * 2000 - 1000;

        scene.add(star);
        stars.push(star);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move the stars
    stars.forEach(star => {
        star.position.z += 0.5;
        if (star.position.z > 1000) star.position.z = -1000;
    });

    renderer.render(scene, camera);
}

// Show hidden button after clicking start
document.getElementById('startBtn').addEventListener('click', function() {
    const introText = document.getElementById('introText');
    introText.classList.remove('hidden');
    introText.classList.add('visible');
    this.style.display = 'none'; // Hide the first button

    const enterBtn = document.getElementById('enterBtn');
    enterBtn.style.visibility = 'visible';
});

// Initialize the scene when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', init);

// Handle resizing of the window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
