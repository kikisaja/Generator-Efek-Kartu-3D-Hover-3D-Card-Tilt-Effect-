document.addEventListener("DOMContentLoaded", function () {
    // 1. Ambil Elemen Kontrol
    const maxTiltInput = document.getElementById("maxTiltInput");
    const perspectiveInput = document.getElementById("perspectiveInput");
    const speedInput = document.getElementById("speedInput");
    const glareToggle = document.getElementById("glareToggle");

    const maxTiltVal = document.getElementById("maxTiltVal");
    const perspectiveVal = document.getElementById("perspectiveVal");
    const speedVal = document.getElementById("speedVal");

    // 2. Ambil Elemen Kartu & Output
    const cardWrapper = document.getElementById("cardWrapper");
    const card3d = document.getElementById("card3d");
    const cardGlare = document.getElementById("cardGlare");
    const cssCode = document.getElementById("cssCode");
    const copyBtn = document.getElementById("copyBtn");

    // Update Teks Indikator Slider
    function updateControlValues() {
        maxTiltVal.textContent = `${maxTiltInput.value}°`;
        perspectiveVal.textContent = `${perspectiveInput.value}px`;
        speedVal.textContent = `${speedInput.value}ms`;
        
        // Update properti perspektif pembungkus kartu
        cardWrapper.style.perspective = `${perspectiveInput.value}px`;
        cssCode.value = `transform: rotateX(0deg) rotateY(0deg);\nperspective: ${perspectiveInput.value}px;`;
    }

    // 3. Logika Perhitungan Tilt 3D saat Kursor Bergerak
    function handleMouseMove(e) {
        const rect = card3d.getBoundingClientRect();

        // Hitung posisi kursor relatif terhadap tengah kartu (dalam rentang -1 hingga 1)
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left; // Posisi X kursor di dalam kartu
        const mouseY = e.clientY - rect.top;  // Posisi Y kursor di dalam kartu

        const centerX = width / 2;
        const centerY = height / 2;

        const percentX = (mouseX - centerX) / centerX;
        const percentY = (mouseY - centerY) / centerY;

        // Hitung Sudut Kemiringan (RotateX terbalik terhadap koordinat Y)
        const maxTilt = parseFloat(maxTiltInput.value);
        const tiltX = (percentY * -maxTilt).toFixed(2);
        const tiltY = (percentX * maxTilt).toFixed(2);

        // Terapkan Transformasi 3D ke Kartu (Tanpa transisi terlambat saat bergerak)
        card3d.style.transition = "none";
        card3d.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Update Kode CSS Output
        cssCode.value = `transform: perspective(${perspectiveInput.value}px)\n  rotateX(${tiltX}deg) rotateY(${tiltY}deg);`;

        // Atur Efek Kilauan (Glare) jika Diaktifkan
        if (glareToggle.checked) {
            cardGlare.style.opacity = "1";
            // Posisi kilauan mengikuti pergerakan kursor
            const glareX = (mouseX / width) * 100;
            const glareY = (mouseY / height) * 100;
            cardGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.35), transparent 60%)`;
        } else {
            cardGlare.style.opacity = "0";
        }
    }

    // 4. Reset Posisi Kartu Saat Kursor Keluar
    function handleMouseLeave() {
        const speed = speedInput.value;
        card3d.style.transition = `transform ${speed}ms ease-out`;
        card3d.style.transform = "rotateX(0deg) rotateY(0deg)";
        cardGlare.style.opacity = "0";

        cssCode.value = `transform: rotateX(0deg) rotateY(0deg);\nperspective: ${perspectiveInput.value}px;`;
    }

    // 5. Event Listeners pada Input Kontrol
    maxTiltInput.addEventListener("input", updateControlValues);
    perspectiveInput.addEventListener("input", updateControlValues);
    speedInput.addEventListener("input", updateControlValues);

    // 6. Event Listeners Pergerakan Kursor
    card3d.addEventListener("mousemove", handleMouseMove);
    card3d.addEventListener("mouseleave", handleMouseLeave);

    // 7. Salin Kode CSS
    copyBtn.addEventListener("click", function () {
        cssCode.select();
        navigator.clipboard.writeText(cssCode.value)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Tersalin! ✓";
                copyBtn.style.backgroundColor = "#16a34a";

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.backgroundColor = "#0284c7";
                }, 1500);
            });
    });

    // Inisialisasi awal
    updateControlValues();
});
