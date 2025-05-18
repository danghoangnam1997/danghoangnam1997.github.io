// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('nav a');
  
  for (const link of links) {
    link.addEventListener('click', smoothScroll);
  }
  
  function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const yOffset = -80; // Header height with some padding
    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
  
  // Scroll indicator for current section
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('nav ul li a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
  
  // Basic form validation
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation check
      const inputs = this.querySelectorAll('input, textarea');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Here you would typically send the form data to a server
        alert('Thanks for your message! I\'ll get back to you soon.');
        form.reset();
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
});

// Add "active" class to nav items when scrolled to section
window.addEventListener('scroll', function() {
  const scrollPosition = window.scrollY;
  
  // Header parallax effect
  const hero = document.getElementById('hero');
  if (hero && scrollPosition < window.innerHeight) {
    hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
  }
  
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.portfolio-item, .stat');
  revealElements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementPosition < windowHeight - 100) {
      element.classList.add('visible');
    }
  });
}); 