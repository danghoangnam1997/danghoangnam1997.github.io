import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { HeroScene } from './hero-scene.js';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Initialize Hero Scene
document.addEventListener('DOMContentLoaded', () => {
    new HeroScene('.hero-background');
});

console.log('Lumina 2.0 Initialized');
