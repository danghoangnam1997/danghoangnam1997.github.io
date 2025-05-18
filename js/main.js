// Main JavaScript for Nam's portfolio website
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  const links = document.querySelectorAll('nav a');
  
  for (const link of links) {
    link.addEventListener('click', smoothScroll);
  }
  
  function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return; // Skip for logo link
    
    const targetElement = document.querySelector(targetId);
    const yOffset = -100; // Header height with some padding
    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
  
  // Scroll indicator for current section
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('nav ul li a');
  
  function updateActiveSection() {
    let currentSectionId = '';
    let minDistance = Infinity;
    
    // Calculate which section is closest to the top of the viewport
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const distance = Math.abs(sectionTop - window.scrollY - 150);
      
      if (distance < minDistance) {
        minDistance = distance;
        currentSectionId = section.getAttribute('id');
      }
    });
    
    // Update active class on navigation items
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  }
  
  // Handle header shrinking on scroll
  const header = document.querySelector('header');
  
  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Initialize animations for elements on scroll
  const animatedElements = document.querySelectorAll('.fade-in');
  
  function handleAnimations() {
    animatedElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 50) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Enhance portfolio items with hover effect
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('img').style.transform = 'scale(1.03)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.querySelector('img').style.transform = 'scale(1)';
    });
  });
  
  // Animate service items on scroll
  const serviceItems = document.querySelectorAll('.service-item');
  
  function animateServices() {
    serviceItems.forEach((item, index) => {
      const elementTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 50) {
        // Apply staggered animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 150);
      }
    });
  }
  
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
          input.style.borderColor = '#ff3860';
        } else {
          input.classList.remove('error');
          input.style.borderColor = '#ddd';
        }
      });
      
      if (isValid) {
        // Here you would typically send the form data to a server
        const submitButton = form.querySelector('button');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate sending (would be an actual fetch/ajax call)
        setTimeout(() => {
          submitButton.textContent = 'Message Sent!';
          
          // Reset form and button after delay
          setTimeout(() => {
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }, 2000);
        }, 1500);
      } else {
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.classList.add('form-error');
        errorElement.textContent = 'Please fill in all required fields';
        errorElement.style.color = '#ff3860';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '1rem';
        
        // Remove any existing error messages
        const existingError = form.querySelector('.form-error');
        if (existingError) {
          existingError.remove();
        }
        
        // Add error message to form
        form.appendChild(errorElement);
      }
    });
    
    // Clear error styling on input
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          this.classList.remove('error');
          this.style.borderColor = '#111';
        }
      });
    });
  }
  
  // Initialize everything and set up event listeners
  updateActiveSection();
  updateHeader();
  handleAnimations();
  animateServices();
  
  // Apply initial styling to animated elements
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Apply initial styling to service items
  serviceItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Combine all scroll-based events in one scroll handler for performance
  window.addEventListener('scroll', function() {
    updateActiveSection();
    updateHeader();
    handleAnimations();
    animateServices();
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    updateActiveSection();
  });
  
  // Trigger animations on initial load
  setTimeout(() => {
    handleAnimations();
    animateServices();
  }, 100);
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