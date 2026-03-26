const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

if (window.innerWidth < 768) {
    camera.position.set(6, 4, 7); 
} else {
    camera.position.set(4, 3, 5); 
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// building the bloch sphere
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
let currentDir = new THREE.Vector3(0, 1, 0); 
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

const gates = {
    'X': { axis: new THREE.Vector3(0, 0, 1), angle: Math.PI },
    'Y': { axis: new THREE.Vector3(1, 0, 0), angle: Math.PI },
    'Z': { axis: new THREE.Vector3(0, 1, 0), angle: Math.PI },
    'H': { axis: new THREE.Vector3(0, 1, 1).normalize(), angle: Math.PI }
};

// ui interactivity
const expBox = document.getElementById('explanation-box');
const expTitle = document.getElementById('exp-title');
const expText = document.getElementById('exp-text');
const statusText = document.getElementById('status');
const gateInput = document.getElementById('gate-input');

function resetSphere() {
    currentDir.set(0, 1, 0);
    targetDir.set(0, 1, 0);
    arrowHelper.setDirection(currentDir);
    trailPositions = [];
    trailGeo.setFromPoints(trailPositions);
    gateQueue = [];
    isAnimating = false;
    statusText.innerText = "State: |0> (North Pole)";
    expBox.classList.add('hidden');
}

function startSequence(inputStr, title = null, desc = null) {
    if (isAnimating) return;
    
  
    if (trailPositions.length > 0) resetSphere();
    
    const sequence = inputStr.toUpperCase().trim().split(/\s+/).filter(g => gates[g]);
    
    if (sequence.length > 0) {
        gateInput.value = sequence.join(' ');
        gateQueue = sequence;
        statusText.innerText = `Applying: ${sequence.join(' -> ')} (PS: it may take a moment to complete)`;
        
        
        if (title && desc) {
            expTitle.innerText = title;
            expText.innerText = desc;
            expBox.classList.remove('hidden');
        } else {
            expBox.classList.add('hidden');
        }
        
        processNextGate();
    } else {
        statusText.innerText = "Invalid gates. Use H, X, Y, Z.";
    }
}

document.getElementById('run-btn').addEventListener('click', () => {
    startSequence(gateInput.value);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    gateInput.value = "";
    resetSphere();
});

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const seq = e.target.getAttribute('data-sequence');
        const title = e.target.getAttribute('data-title');
        const desc = e.target.getAttribute('data-desc');
        startSequence(seq, title, desc);
    });
});

function processNextGate() {
    if (gateQueue.length === 0) {
        isAnimating = false;
        statusText.innerText += " (Done)";
        return;
    }
    isAnimating = true;
    const gate = gateQueue.shift();
    const operation = gates[gate];
    targetDir = currentDir.clone().applyAxisAngle(operation.axis, operation.angle);
}

//  rendering
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