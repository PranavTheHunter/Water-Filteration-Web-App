// WebGLImageReveal.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WebGLImageReveal = ({ imageUrl }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300); // Set the size of the canvas
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(5, 5);
    const texture = new THREE.TextureLoader().load(imageUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      plane.rotation.y += 0.01; // Rotate for effect
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [imageUrl]);

  return <div ref={mountRef} />;
};

export default WebGLImageReveal;
