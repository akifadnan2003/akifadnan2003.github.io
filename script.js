// Wait for the DOM to be fully loaded before initializing scripts
document.addEventListener('DOMContentLoaded', () => {
    // Dynamically set the height of the Vanta background to match main content
    function resizeVantaBg() {
        const mainBg = document.getElementById('main-vanta-bg');
        const mainSections = document.querySelector('.main-sections');
        if (mainBg && mainSections) {
            mainBg.style.height = mainSections.offsetHeight + 'px';
        }
    }
    resizeVantaBg();
    window.addEventListener('resize', resizeVantaBg);

    // --- INITIALIZE Splitting.js ---
    Splitting();

    // Check if the device is mobile (we'll say anything less than 768px wide)
    const isMobile = window.innerWidth < 768;

    // --- INITIALIZE VANTA.JS BACKGROUND ---
    VANTA.NET({
        el: "#main-vanta-bg",
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

    // --- INITIALIZE AOS (Animate On Scroll) ---
    AOS.init();

});