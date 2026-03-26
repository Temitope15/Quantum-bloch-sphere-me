# 🌐 Quantum Bloch Sphere Visualizer

An interactive, 3D educational tool built to help beginners visualize single-qubit quantum states and understand how quantum gates manipulate probabilities in real-time. 

Built as part of the 30-Day Quantum Computing Challenge for the Google Developer Group (GDG) community at Obafemi Awolowo University (OAU).

## 🎯 The Motivation
In classical programming, you can always use a `print()` statement to see what a variable is doing. In quantum computing, measuring a qubit destroys its state. This makes debugging quantum circuits conceptually difficult. 

This visualizer bridges the gap between raw quantum mathematics and physical intuition. By mapping the quantum state vector to a 3D sphere, users can literally see the geometric paths that quantum operations take, making concepts like superposition and phase shifts accessible and intuitive.

## ✨ Key Features
* **Real-Time 3D Rendering:** Smooth, responsive visualization of the Bloch sphere using Three.js.
* **Custom Gate Sequencing:** Input any combination of foundational quantum gates (H, X, Y, Z) and watch them execute sequentially.
* **Path Tracing:** Unlike standard visualizers that just snap to the final result, this tool draws a visible trail to show the exact geometric rotation path of the state vector.
* **Interactive Tutorials:** Built-in preset buttons that automatically run common quantum scenarios (like the Phase Flip) alongside clear, plain-English explanations.
* **Zero-Setup Execution:** Built entirely with vanilla web technologies. No servers, no `npm install`, and no Python environments required.

## 🛠️ Tech Stack
* **HTML5 & CSS3:** For a clean, modern, dark-mode "quantum" UI.
* **Vanilla JavaScript:** Handling the animation state machine and quantum rotation math (Quaternions).
* **Three.js (via CDN):** Powering the WebGL 3D graphics and camera controls.

## 🚀 How to Run It
Because this project uses vanilla web technologies, running it is incredibly simple:

1. Clone this repository to your local machine:
   ```bash
   git clone [https://github.com/yourusername/bloch-sphere-visualizer.git](https://github.com/yourusername/bloch-sphere-visualizer.git)
   ```
2. Navigate to the project folder.
3. Simply copy path and paste in your default browser to open it.

*(Alternatively, you can view the live demo here: `[https://quantum-bloch-sphere-me.vercel.app/]`)*

## 📚 The Physics: Supported Gates
This visualizer currently supports the fundamental single-qubit gates:

* **X-Gate (Bit Flip):** Rotates the state 180° around the X-axis. It swaps the probability of measuring a 0 or 1.
* **Y-Gate (Bit & Phase Flip):** Rotates the state 180° around the Y-axis. 
* **Z-Gate (Phase Flip):** Rotates the state 180° around the Z-axis (the equator). It leaves the probability of measuring 0 or 1 unchanged but alters the quantum phase.
* **H-Gate (Hadamard):** The gateway to quantum randomness. It rotates the state onto the equator, creating a perfect 50/50 superposition between 0 and 1.

## 🤝 Contributing
Feel free to fork this project and submit pull requests! Future ideas for expansion include adding multi-qubit visualization, supporting parameterized gates (like Rx, Ry, Rz), or adding a visual representation of measurement collapse.

## 👨‍💻 Author
**Temitope Akinsunmade**
* Quantum Computing Co Lead, GDG OAU
* Connect with me on [LinkedIn](https://linkedin.com/in/temitope-akinsunmade)
