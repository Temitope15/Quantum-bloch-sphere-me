const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 3, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//Building the Bloch Sphere
const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
const sphereMat = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true, transparent: true, opacity: 0.3 });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

const equatorGeo = new THREE.RingGeometry(1.98, 2, 64);
const equatorMat = new THREE.MeshBasicMaterial({ color: 0x666666, side: THREE.DoubleSide });
const equator = new THREE.Mesh(equatorGeo, equatorMat);
equator.rotation.x = Math.PI / 2;
scene.add(equator);

const axesHelper = new THREE.AxesHelper(2.5);
scene.add(axesHelper);

const origin = new THREE.Vector3(0, 0, 0);
let currentDir = new THREE.Vector3(0, 1, 0); // default is north pole
const arrowHelper = new THREE.ArrowHelper(currentDir, origin, 2, 0x00e6ff, 0.4, 0.2);
scene.add(arrowHelper);

let trailPositions = [];
const trailGeo = new THREE.BufferGeometry();
const trailMat = new THREE.LineBasicMaterial({ color: 0xff00aa, linewidth: 2 });
const trailLine = new THREE.Line(trailGeo, trailMat);
scene.add(trailLine);

// animation
let targetDir = new THREE.Vector3(0, 1, 0);
let isAnimating = false;
let gateQueue = [];

// Rotations
const gates = {
    'X': { axis: new THREE.Vector3(0, 0, 1), angle: Math.PI },       // Rotate around Bloch X (Three Z)
    'Y': { axis: new THREE.Vector3(1, 0, 0), angle: Math.PI },       // Rotate around Bloch Y (Three X)
    'Z': { axis: new THREE.Vector3(0, 1, 0), angle: Math.PI },       // Rotate around Bloch Z (Three Y)
    'H': { axis: new THREE.Vector3(0, 1, 1).normalize(), angle: Math.PI } // Diagonal between Bloch Z and X
};

// ui interactions
document.getElementById('run-btn').addEventListener('click', () => {
    if (isAnimating) return;
    
    const input = document.getElementById('gate-input').value.toUpperCase().trim();
    if (!input) return;

    const sequence = input.split(/\s+/).filter(g => gates[g]);
    
    if (sequence.length > 0) {
        gateQueue = sequence;
        document.getElementById('status').innerText = `Applying: ${sequence.join(' -> ')}`;
        processNextGate();
    } else {
        document.getElementById('status').innerText = "Invalid gates. Use H, X, Y, Z.";
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    currentDir.set(0, 1, 0);
    targetDir.set(0, 1, 0);
    arrowHelper.setDirection(currentDir);
    trailPositions = [];
    trailGeo.setFromPoints(trailPositions);
    gateQueue = [];
    isAnimating = false;
    document.getElementById('status').innerText = "State: |0>";
    document.getElementById('gate-input').value = "";
});

function processNextGate() {
    if (gateQueue.length === 0) {
        isAnimating = false;
        document.getElementById('status').innerText += " (Done)";
        return;
    }

    isAnimating = true;
    const gate = gateQueue.shift();
    const operation = gates[gate];

    targetDir = currentDir.clone().applyAxisAngle(operation.axis, operation.angle);
}

// rendering
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (isAnimating) {
        currentDir.lerp(targetDir, 0.05).normalize();
        arrowHelper.setDirection(currentDir);

        const tipPosition = currentDir.clone().multiplyScalar(2);
        trailPositions.push(tipPosition);
        trailGeo.setFromPoints(trailPositions);

        if (currentDir.angleTo(targetDir) < 0.01) {
            currentDir.copy(targetDir); 
            processNextGate(); 
        }
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


animate();