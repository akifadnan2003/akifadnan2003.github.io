// Wait for the DOM to be fully loaded before initializing scripts
document.addEventListener('DOMContentLoaded', () => {



    // --- Unified VANTA.NET Background for Home, About, Skills ---
    VANTA.NET({
      el: "#main-vanta-bg",
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
    // Typewriter animation for "Hi I'm Akif Adnan"
    setTimeout(() => {
      const typewriterText = "Hi I'm Akif Adnan";
      const typewriterSpeed = 100; // ms per character
      let typewriterIndex = 0;
      const typewriterTarget = document.getElementById("typewriter");
      if (!typewriterTarget) {
        console.error('Typewriter element not found!');
        return;
      }
      typewriterTarget.textContent = "";
      function typeWriter() {
        if (typewriterIndex < typewriterText.length) {
          typewriterTarget.textContent += typewriterText.charAt(typewriterIndex);
          typewriterIndex++;
          setTimeout(typeWriter, typewriterSpeed);
        }
      }
      typeWriter();
    }, 200);

});