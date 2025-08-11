/**
 * src/data/projects.js
 *
 * This file is the single source of truth for all project data.
 * By centralizing it here, we can easily manage and update projects
 * without touching the component logic.
 *
 * Each project object has the following structure:
 * - id: A unique string identifier, perfect for URL slugs and React keys.
 * - title: The main title of the project.
 * - tagline: A short, catchy phrase that summarizes the project.
 * - description: A more detailed paragraph explaining the project's goals,
 *   challenges, and your role.
 * - technologies: An array of strings listing the key technologies used.
 * - liveUrl: A URL to the deployed, live version of the project.
 * - repoUrl: A URL to the source code repository (e.g., GitHub).
 * - image_hero: The path to the main hero image for the project detail page.
 * - image_thumb: (Optional) A path to a specific thumbnail image.
 */

export const projects = [
  {
    id: 'cosmic-voyage',
    title: 'Cosmic Voyage',
    tagline: 'An interactive WebGL solar system explorer.',
    description:
      'Cosmic Voyage is a real-time 3D simulation of our solar system, built with Three.js and React. It features accurate orbital mechanics, detailed planet information cards, and cinematic camera controls. The main challenge was optimizing performance to ensure a smooth experience across devices while handling complex 3D assets.',
    technologies: ['React', 'Three.js', 'React Three Fiber', 'GSAP', 'GLSL Shaders'],
    liveUrl: 'https://example.com/cosmic-voyage',
    repoUrl: 'https://github.com/your-username/cosmic-voyage',
    image_hero: '/assets/images/project-cosmic-voyage-hero.jpg',
    image_thumb: '/assets/images/project-cosmic-voyage-thumb.png',
  },
  {
    id: 'data-dash',
    title: 'DataDash',
    tagline: 'A sleek and responsive data visualization dashboard.',
    description:
      'DataDash is a client-facing analytics platform that provides intuitive charts and graphs for complex datasets. Built with D3.js and React, it allows users to filter, sort, and export data dynamically. I focused on creating a clean user interface and ensuring all components were highly performant and accessible.',
    technologies: ['React', 'D3.js', 'Node.js', 'Express', 'PostgreSQL'],
    liveUrl: 'https://example.com/data-dash',
    repoUrl: 'https://github.com/your-username/data-dash',
    image_hero: '/assets/images/project-data-dash-hero.jpg',
    image_thumb: '/assets/images/project-data-dash-thumb.png',
  },
  {
    id: 'luxe-e-commerce',
    title: 'Luxe',
    tagline: 'A high-end e-commerce experience for a luxury brand.',
    description:
      'Luxe is a headless e-commerce site featuring bold animations and seamless page transitions. I used Next.js for server-side rendering to achieve fast page loads and Sanity.io as a headless CMS for easy content management. The goal was to create a premium, memorable shopping experience that reflects the brand\'s identity.',
    technologies: ['Next.js', 'Sanity.io', 'Framer Motion', 'Stripe API', 'Tailwind CSS'],
    liveUrl: 'https://example.com/luxe',
    repoUrl: 'https://github.com/your-username/luxe',
    image_hero: '/assets/images/project-luxe-hero.jpg',
    image_thumb: '/assets/images/project-luxe-thumb.png',
  },
];

// A helper function to easily find a project by its ID.
// This will be very useful when we build the project detail page.
export const getProjectById = (id) => {
  return projects.find((p) => p.id === id);
};
