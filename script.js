// Wait for the DOM to be fully loaded before initializing scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- INITIALIZE Splitting.js ---
    Splitting();

    // Check if the device is mobile (we'll say anything less than 768px wide)
    const isMobile = window.innerWidth < 768;

    // --- INITIALIZE VANTA.JS BACKGROUNDS ---
    
    // Use different settings based on whether it's mobile or desktop
    if (isMobile) {
        // --- MOBILE VANTA SETTINGS (Simpler & Cleaner) ---

        VANTA.NET({
            el: "#home-vanta-bg",
            mouseControls: false,
            touchControls: false,
            scale: 1.00,
            color: 0x4a90e2,
            backgroundColor: 0x0a0a0a,
            points: 6.00, // Fewer points for a cleaner look
            maxDistance: 18.00, // Shorter connection lines
            spacing: 15.00
        });

        VANTA.FOG({
            el: "#about-vanta-bg",
            mouseControls: false,
            touchControls: false,
            highlightColor: 0x4a90e2,
            midtoneColor: 0x1f3c5a,
            lowlightColor: 0x0a0a0a,
            baseColor: 0x0a0a0a,
            speed: 1.00,
            zoom: 1.00 // Zoom in a bit on mobile
        });
        
        VANTA.WAVES({
            el: "#skills-vanta-bg",
            mouseControls: false,
            touchControls: false,
            color: 0x1c3d5e,
            shininess: 25.00,
            waveHeight: 10.00, // Lower waves
            waveSpeed: 0.4,
            zoom: 1.00
        });

        VANTA.GLOBE({
            el: "#projects-vanta-bg",
            mouseControls: false,
            touchControls: false,
            color: 0x4a90e2,
            backgroundColor: 0x0a0a0a,
            size: 0.70 // Make the globe a bit smaller
        });

    } else {
        // --- DESKTOP VANTA SETTINGS (The ones you already have) ---

        VANTA.NET({
            el: "#home-vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            color: 0x4a90e2,
            backgroundColor: 0x0a0a0a,
            points: 12.00,
            maxDistance: 25.00,
            spacing: 18.00
        });

        VANTA.FOG({
            el: "#about-vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0x4a90e2,
            midtoneColor: 0x1f3c5a,
            lowlightColor: 0x0a0a0a,
            baseColor: 0x0a0a0a,
            blurFactor: 0.50,
            speed: 1.20,
            zoom: 0.60
        });
        
        VANTA.WAVES({
            el: "#skills-vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            color: 0x1c3d5e,
            shininess: 25.00,
            waveHeight: 15.00,
            waveSpeed: 0.5,
            zoom: 0.85
        });

        VANTA.GLOBE({
            el: "#projects-vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            color: 0x4a90e2,
            backgroundColor: 0x0a0a0a,
            size: 0.8
        });
    }

    // --- INITIALIZE AOS (Animate On Scroll) ---
    AOS.init();

});