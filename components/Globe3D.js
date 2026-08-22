'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FiMapPin, FiStar, FiArrowRight, FiX } from 'react-icons/fi';
import styles from './Globe3D.module.css';

const LOCATIONS = [
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, image: '/images/destinations/paris.jpg', rating: 4.9, cost: 'Premium (~₹12,000/day)' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, image: '/images/destinations/tokyo.jpg', rating: 4.8, cost: 'Premium (~₹12,000/day)' },
  { name: 'Bali', country: 'Indonesia', lat: -8.3405, lon: 115.092, image: '/images/destinations/bali.jpg', rating: 4.7, cost: 'Affordable (~₹3,500/day)' },
  { name: 'Santorini', country: 'Greece', lat: 36.3932, lon: 25.4615, image: '/images/destinations/santorini.jpg', rating: 4.9, cost: 'Premium (~₹12,000/day)' },
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.006, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600', rating: 4.8, cost: 'Luxury (~₹25,000/day)' },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', rating: 4.7, cost: 'Luxury (~₹25,000/day)' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', rating: 4.8, cost: 'Premium (~₹12,000/day)' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600', rating: 4.7, cost: 'Premium (~₹12,000/day)' },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lon: 75.7873, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', rating: 4.6, cost: 'Budget (~₹1,500/day)' },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', rating: 4.8, cost: 'Moderate (~₹6,500/day)' },
];

/**
 * Creates a high-definition procedural world map canvas texture
 * so the earth ALWAYS has realistic continents, oceans, and graticules
 * even if offline or before external textures load.
 */
function createProceduralEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#061a2e');
  oceanGrad.addColorStop(0.5, '#0b2545');
  oceanGrad.addColorStop(1, '#061a2e');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lat/Lon Grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;
  for (let lat = 0; lat <= canvas.height; lat += canvas.height / 12) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(canvas.width, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon <= canvas.width; lon += canvas.width / 24) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, canvas.height);
    ctx.stroke();
  }

  // Draw landmass silhouettes with rich emerald/forest glow
  ctx.fillStyle = '#164e63';
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;

  // Simplified continent polygons mapped onto equirectangular projection
  const continents = [
    // North America
    [[300, 150], [520, 160], [600, 260], [540, 420], [420, 480], [360, 420], [280, 280], [300, 150]],
    // South America
    [[460, 520], [580, 560], [560, 750], [490, 920], [440, 750], [420, 580], [460, 520]],
    // Europe
    [[950, 180], [1150, 170], [1180, 320], [1050, 360], [920, 320], [950, 180]],
    // Africa
    [[960, 380], [1160, 390], [1220, 560], [1120, 800], [1020, 780], [940, 520], [960, 380]],
    // Asia
    [[1180, 150], [1650, 160], [1720, 380], [1580, 520], [1320, 500], [1200, 340], [1180, 150]],
    // Australia
    [[1520, 680], [1720, 690], [1700, 850], [1540, 840], [1520, 680]],
    // India sub-continent
    [[1280, 380], [1380, 420], [1340, 560], [1260, 440], [1280, 380]],
    // Japan
    [[1680, 280], [1720, 290], [1700, 360], [1670, 340], [1680, 280]],
    // UK & Ireland
    [[920, 220], [960, 210], [950, 270], [910, 260], [920, 220]],
    // Scandinavia
    [[1020, 100], [1100, 90], [1080, 220], [1020, 200], [1020, 100]],
  ];

  continents.forEach(poly => {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  return new THREE.CanvasTexture(canvas);
}

export default function Globe3D({ onSelectCity }) {
  const mountRef = useRef(null);
  const [activeCity, setActiveCity] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 30, 220);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // OrbitControls for effortless 360 drag, hold, zoom & momentum
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.minDistance = 120;
    controls.maxDistance = 350;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.enablePan = false;

    // Globe Core Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 68;
    const globeGeometry = new THREE.SphereGeometry(radius, 64, 64);

    // Base Texture: high-resolution procedural continent map
    const proceduralTexture = createProceduralEarthTexture();
    proceduralTexture.wrapS = THREE.RepeatWrapping;
    proceduralTexture.wrapT = THREE.ClampToEdgeWrapping;

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: proceduralTexture,
      bumpScale: 1.2,
      specular: new THREE.Color(0x224466),
      shininess: 25,
      emissive: new THREE.Color(0x04111f),
      emissiveIntensity: 0.4,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globe);

    // Load satellite texture asynchronously to enhance if available
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    textureLoader.load(
      'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
      (tex) => {
        globeMaterial.map = tex;
        globeMaterial.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.log('Using procedural HD continent texture fallback', err);
      }
    );

    // Atmospheric outer glow
    const atmosGeo = new THREE.SphereGeometry(radius + 3.5, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    // Grid wireframe layer for cyberpunk / IIT luxury look
    const wireGeo = new THREE.SphereGeometry(radius + 0.3, 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(250, 150, 180);
    scene.add(sunLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    backLight.position.set(-200, -100, -150);
    scene.add(backLight);

    // Starfield particles
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 700;
      starPos[i + 1] = (Math.random() - 0.5) * 700;
      starPos[i + 2] = (Math.random() - 0.5) * 700;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.2,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Lat/Lon to Vector3 conversion
    const latLonToVector3 = (lat, lon, r) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Location Markers & Arcs
    const markerGroup = new THREE.Group();
    const markerMeshes = [];

    LOCATIONS.forEach((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, radius + 1.2);

      // Gold Pin Center
      const pinGeo = new THREE.SphereGeometry(2.0, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.userData = loc;

      // Outer Pulsing Halo
      const haloGeo = new THREE.SphereGeometry(3.6, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.35,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);

      // Pin stem
      const stemGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.copy(pos.clone().multiplyScalar(1.01));
      stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      markerGroup.add(pin);
      markerGroup.add(halo);
      markerGroup.add(stem);
      markerMeshes.push(pin);
    });

    // Draw flight routes / arcs between connected popular cities
    const arcs = [
      [LOCATIONS[0], LOCATIONS[1]], // Paris -> Tokyo
      [LOCATIONS[1], LOCATIONS[2]], // Tokyo -> Bali
      [LOCATIONS[3], LOCATIONS[4]], // Santorini -> New York
      [LOCATIONS[4], LOCATIONS[5]], // New York -> London
      [LOCATIONS[5], LOCATIONS[6]], // London -> Dubai
      [LOCATIONS[6], LOCATIONS[8]], // Dubai -> Jaipur
      [LOCATIONS[8], LOCATIONS[7]], // Jaipur -> Sydney
    ];

    arcs.forEach(([start, end]) => {
      const v1 = latLonToVector3(start.lat, start.lon, radius);
      const v2 = latLonToVector3(end.lat, end.lon, radius);

      // Middle elevation point
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(radius + distance * 0.25);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        linewidth: 1,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
    });

    globeGroup.add(markerGroup);

    // Raycasting for clicking pins
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist > 5) return; // Dragged, not clicked

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(markerMeshes);

      if (hits.length > 0) {
        setActiveCity(hits[0].object.userData);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      controls.update();

      // Pulse pin halos
      markerGroup.children.forEach((child, idx) => {
        if (idx % 3 === 1) {
          const s = 1 + Math.sin(t * 3.5 + idx) * 0.35;
          child.scale.set(s, s, s);
        }
      });

      // Slowly rotate starfield
      stars.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const nw = currentMount.clientWidth;
      const nh = currentMount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animId);
      controls.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={styles.globeWrapper}>
      <div ref={mountRef} className={styles.canvasContainer} />

      {/* Floating City Glass Preview Card */}
      {activeCity && (
        <div className={styles.cityPreviewCard}>
          <button className={styles.closeCard} onClick={() => setActiveCity(null)} aria-label="Close">
            <FiX />
          </button>
          <img
            src={activeCity.image}
            alt={activeCity.name}
            className={styles.previewImage}
            onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
          />
          <div className={styles.previewContent}>
            <span className={styles.previewCountry}><FiMapPin /> {activeCity.country}</span>
            <h3 className={styles.previewTitle}>{activeCity.name}</h3>
            <div className={styles.previewMeta}>
              <span className={styles.previewRating}><FiStar /> {activeCity.rating}</span>
              <span className={styles.previewCost}>{activeCity.cost}</span>
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => {
                if (onSelectCity) onSelectCity(activeCity.name);
                setActiveCity(null);
              }}
            >
              Explore {activeCity.name} <FiArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
