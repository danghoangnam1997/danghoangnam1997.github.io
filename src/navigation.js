import { gsap } from 'gsap';

export class Navigation {
    constructor() {
        this.initMagneticLinks();
        this.initMobileMenu();
    }

    initMagneticLinks() {
        const links = document.querySelectorAll('.magnetic-link');

        links.forEach(link => {
            const text = link.querySelector('.link-text');

            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move text towards cursor (magnetic pull)
                gsap.to(text, {
                    x: x * 0.3, // Strength of pull
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                // Spring back to center
                gsap.to(text, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }

    initMobileMenu() {
        const toggle = document.querySelector('.menu-toggle');
        const menu = document.querySelector('.mobile-menu');
        const links = document.querySelectorAll('.mobile-link');
        const bars = document.querySelectorAll('.bar');

        let isOpen = false;

        const tl = gsap.timeline({ paused: true });

        tl.to(menu, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.4,
            ease: 'power2.inOut',
            pointerEvents: 'all'
        })
            .to(links, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            }, "-=0.2");

        toggle.addEventListener('click', () => {
            isOpen = !isOpen;

            if (isOpen) {
                tl.play();
                // Animate hamburger to X
                gsap.to(bars[0], { rotation: 45, y: 8, duration: 0.3 });
                gsap.to(bars[1], { rotation: -45, y: -8, duration: 0.3 }); // Adjusted y for gap
            } else {
                tl.reverse();
                // Animate X back to hamburger
                gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(bars[1], { rotation: 0, y: 0, duration: 0.3 });
            }
        });

        // Close menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                tl.reverse();
                gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(bars[1], { rotation: 0, y: 0, duration: 0.3 });
            });
        });
    }
}
