# Lumina 2.0: High Concept Upgrade Plan

## Vision
Transform the static portfolio into an immersive, "living" digital experience that literally embodies the artist's tagline: *"Sculpting with Light"*. We will move from "Old Tech" (static HTML) to a "Modern Creative Dev" stack, focusing on atmosphere, fluidity, and premium interactions.

## Tech Stack Upgrade
- **Build Tool**: **Vite** (for modern asset management and hot reloading).
- **3D/WebGL**: **Three.js** (for interactive light effects).
- **Animation**: **GSAP (GreenSock)** (for professional-grade timelines and scroll triggers).
- **Smooth Scroll**: **Lenis** (for that premium, fluid scroll feel).

## Implementation Steps

### Phase 1: Foundation & Tech
1.  **Initialize Vite Project**:
    -   Set up a new Vite project to replace the old structure.
    -   Install dependencies: `three`, `gsap`, `@studio-freight/lenis`.
    -   Migrate existing HTML content to the new `index.html`.

2.  **Design System Overhaul**:
    -   **Typography**: Switch to a cinematic pairing (e.g., *Syncopate* for headers, *Space Grotesk* for body) to give a "sci-fi/industrial" vibe.
    -   **Global Atmosphere**: Add a fixed grain/noise overlay to the screen to simulate film stock.
    -   **Colors**: Define a "Neon Noir" palette (Deep Void Black `#050505` + Bioluminescent Cyan `#00f3ff`).

### Phase 2: The "Light" Experience
3.  **Hero Section - The Light Sculptor**:
    -   Implement a **Three.js** background scene.
    -   *Concept*: A volumetric fog container where the user's mouse acts as a moving light source, casting dynamic shadows and revealing hidden geometry.

4.  **Premium Navigation**:
    -   Create a "Glassmorphic" floating navbar with a frosted blur effect.
    -   Add magnetic hover effects to links (text physically moves towards the cursor).
    -   **Mobile**: Build a full-screen overlay menu with staggered text reveal animations.

### Phase 3: Content & Interaction
5.  **Immersive Gallery (Work)**:
    -   Implement **3D Tilt Cards**: Project cards gently rotate in 3D space based on mouse position.
    -   **Parallax**: Images move at a different speed than the text within the card.
    -   Replace placeholder gradients with high-quality, generated "Lighting Study" images.

6.  **Interactive "About" Section**:
    -   Break the standard grid layout. Use a "Spotlight" effect where text is dimmed until the user scrolls or hovers near it.
    -   Visualize skills as glowing orbs or a constellation that reacts to the cursor.

7.  **Polishing the Feel**:
    -   **Smooth Scroll**: Integrate **Lenis** to remove the default "jerky" scroll and replace it with a fluid, weighted momentum.
    -   **Custom Cursor**: A custom glowing cursor that blends with the background (using `mix-blend-mode: difference` or `overlay`).

8.  **Final Polish & Optimization**:
    -   Ensure WebGL performance (pause rendering when off-screen).
    -   Add page transition animations (fade/wipe between reload).
    -   SEO meta tags and Open Graph images.
