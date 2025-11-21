import * as THREE from 'three';

export class HeroScene {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.init();
        this.addObjects();
        this.addLights();
        this.addEvents();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        // Volumetric fog effect (darkness)
        this.scene.fog = new THREE.FogExp2(0x050505, 0.002);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Mouse tracking
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
    }

    addObjects() {
        // Floating shards/cubes
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.4,
            metalness: 0.8,
            flatShading: true
        });

        this.particles = new THREE.Group();

        for (let i = 0; i < 150; i++) {
            const mesh = new THREE.Mesh(geometry, material);

            // Random position spread
            mesh.position.x = (Math.random() - 0.5) * 100;
            mesh.position.y = (Math.random() - 0.5) * 60;
            mesh.position.z = (Math.random() - 0.5) * 50;

            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            // Random scale
            const scale = Math.random() * 2 + 0.5;
            mesh.scale.set(scale, scale, scale);

            this.particles.add(mesh);
        }

        this.scene.add(this.particles);
    }

    addLights() {
        // Ambient dim light
        const ambientLight = new THREE.AmbientLight(0x220033, 0.5);
        this.scene.add(ambientLight);

        // The "Sculpting" Light (follows mouse)
        this.cursorLight = new THREE.PointLight(0x00f3ff, 3, 40);
        this.cursorLight.position.set(0, 0, 10);
        this.scene.add(this.cursorLight);

        // Helper to see the light source (optional, good for debug)
        // const sphereSize = 1;
        // const pointLightHelper = new THREE.PointLightHelper( this.cursorLight, sphereSize );
        // this.scene.add( pointLightHelper );
    }

    addEvents() {
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onResize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(event) {
        // Normalized coordinates (-1 to +1)
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Smooth mouse movement (Lerp)
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

        // Update light position based on mouse
        // Map normalized mouse to scene coordinates
        this.cursorLight.position.x = this.mouse.x * 40;
        this.cursorLight.position.y = this.mouse.y * 25;
        this.cursorLight.position.z = 10 + Math.sin(Date.now() * 0.001) * 5; // Breathing Z depth

        // Rotate particles slowly
        this.particles.rotation.y += 0.001;
        this.particles.rotation.x += 0.0005;

        // Individual particle movement (optional subtle float)
        this.particles.children.forEach((mesh, i) => {
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.002;
        });

        this.renderer.render(this.scene, this.camera);
    }
}
