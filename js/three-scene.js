// three-scene.js
document.addEventListener("DOMContentLoaded", () => {
  if (typeof THREE === "undefined") return;

  const canvas = document.getElementById("three-canvas");
  if (!canvas) return;

  // ====== Scene Setup ======
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ====== Lighting ======
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xff8844, 1.2);
  pointLight.position.set(2, 2, 3);
  scene.add(pointLight);

  // ====== Geometry ======
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff8844,
    metalness: 0.3,
    roughness: 0.4,
    emissive: 0x220000,
    emissiveIntensity: 0.5,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ====== Animation Loop ======
  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();
    mesh.rotation.x = elapsed * 0.2;
    mesh.rotation.y = elapsed * 0.3;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // ====== Responsive ======
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ====== Mouse Interaction ======
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
    const y = (e.clientY / window.innerHeight - 0.5) * 0.5;
    camera.position.x = x * 2;
    camera.position.y = -y * 2;
    camera.lookAt(scene.position);
  });
});