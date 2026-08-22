'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FiMapPin, FiStar, FiArrowRight, FiX } from 'react-icons/fi';
import styles from './Globe3D.module.css';

const LOCATIONS = [
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, image: '/images/destinations/paris.jpg', rating: 4.9, cost: '$$$$' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, image: '/images/destinations/tokyo.jpg', rating: 4.8, cost: '$$$$' },
  { name: 'Bali', country: 'Indonesia', lat: -8.3405, lon: 115.092, image: '/images/destinations/bali.jpg', rating: 4.7, cost: '$$' },
  { name: 'Santorini', country: 'Greece', lat: 36.3932, lon: 25.4615, image: '/images/destinations/santorini.jpg', rating: 4.9, cost: '$$$$' },
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.006, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600', rating: 4.8, cost: '$$$$$' },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', rating: 4.7, cost: '$$$$$' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', rating: 4.8, cost: '$$$$' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600', rating: 4.7, cost: '$$$$' },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lon: 75.7873, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', rating: 4.6, cost: '$' },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', rating: 4.8, cost: '$$$' },
];

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
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Globe Sphere
    const radius = 70;
    const globeGeometry = new THREE.SphereGeometry(radius, 64, 64);
    
    // Wireframe / Grid Material for Futuristic Sci-Fi Look
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Inner Core Sphere
    const innerGeo = new THREE.SphereGeometry(radius - 0.5, 32, 32);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x0a0e1a,
      emissive: 0x030712,
      shininess: 20,
    });
    const innerGlobe = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerGlobe);

    // Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(radius + 4, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight1.position.set(200, 100, 150);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    dirLight2.position.set(-200, -100, -150);
    scene.add(dirLight2);

    // Star Particles Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600;
      starPositions[i + 1] = (Math.random() - 0.5) * 600;
      starPositions[i + 2] = (Math.random() - 0.5) * 600;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.5,
      transparent: true,
      opacity: 0.7,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Lat/Lon conversion helper
    const latLonToVector3 = (lat, lon, r) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Location Markers (Pulsing glowing spheres)
    const markerGroup = new THREE.Group();
    const markerObjects = [];

    LOCATIONS.forEach((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, radius + 1);
      
      const pinGeo = new THREE.SphereGeometry(2.2, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.userData = loc;

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(3.8, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.4,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);

      markerGroup.add(pin);
      markerGroup.add(halo);
      markerObjects.push(pin);
    });

    scene.add(markerGroup);

    // Interactive Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerObjects);

      if (intersects.length > 0) {
        const clickedCity = intersects[0].object.userData;
        setActiveCity(clickedCity);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Rotation & Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow elegant rotation
      globe.rotation.y = elapsedTime * 0.08;
      innerGlobe.rotation.y = elapsedTime * 0.08;
      markerGroup.rotation.y = elapsedTime * 0.08;
      starField.rotation.y = elapsedTime * 0.02;

      // Pulse markers
      markerGroup.children.forEach((child, idx) => {
        if (idx % 2 === 1) {
          const scale = 1 + Math.sin(elapsedTime * 4 + idx) * 0.25;
          child.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
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
          <button className={styles.closeCard} onClick={() => setActiveCity(null)}>
            <FiX />
          </button>
          <img src={activeCity.image} alt={activeCity.name} className={styles.previewImage} />
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
