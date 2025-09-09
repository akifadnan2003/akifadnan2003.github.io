// Wait for the DOM to be fully loaded before initializing scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HOME SECTION: VANTA.NET ---
    VANTA.NET({
      el: "#home-vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x4a90e2,
      backgroundColor: 0x0a0a0a,
      points: 12.00,
      maxDistance: 25.00,
      spacing: 18.00
    });

    // --- 2. ABOUT SECTION: VANTA.RINGS --- (NEW EFFECT FOR CONSISTENCY)
    VANTA.RINGS({
      el: "#about-vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0x0a0a0a, // Your dark background
      color: 0x4a90e2        // Your blue accent color
    });
    
    // --- 3. SKILLS SECTION: VANTA.WAVES ---
    VANTA.WAVES({
      el: "#skills-vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x1c3d5e,
      shininess: 25.00,
      waveHeight: 15.00,
      waveSpeed: 0.5,
      zoom: 0.85
    });

    // --- 4. PROJECTS SECTION: VANTA.GLOBE ---
    VANTA.GLOBE({
      el: "#projects-vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x4a90e2,
      backgroundColor: 0x0a0a0a,
      size: 0.8
    });

    // --- INITIALIZE AOS (Animate On Scroll) ---
    AOS.init();

});