document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate burger icon
        const bars = mobileBtn.querySelectorAll('.bar');
        if (navLinks.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const bars = mobileBtn.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Form Submission Handling
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate submission
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerText;

        btn.innerText = 'Envoi en cours...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = 'Demande envoyée !';
            btn.style.backgroundColor = '#28a745'; // Green success color

            // Reset form
            form.reset();

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Generic Slider Function
    function initSlider(trackSelector, dotsSelector, autoSlideInterval = 5000, itemsPerViewDesktop = 1) {
        const track = document.querySelector(trackSelector);
        if (!track) return;

        const slides = Array.from(track.children);
        const dotsContainer = document.querySelector(dotsSelector);

        // Determine items per view based on screen width
        let itemsPerView = window.innerWidth > 768 ? itemsPerViewDesktop : 1;

        // Update items per view on resize
        window.addEventListener('resize', () => {
            const newItemsPerView = window.innerWidth > 768 ? itemsPerViewDesktop : 1;
            if (newItemsPerView !== itemsPerView) {
                itemsPerView = newItemsPerView;
                updateDots(); // Re-create dots
                moveToSlide(0); // Reset to first slide
            }
        });

        let currentSlide = 0;
        let dots = [];

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const numDots = Math.ceil(slides.length / itemsPerView);

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    moveToSlide(i * itemsPerView);
                });
                dotsContainer.appendChild(dot);
            }
            dots = Array.from(dotsContainer.children);
        }

        function moveToSlide(index) {
            // Ensure index is valid
            if (index < 0) index = 0;
            // Adjust max index logic for multiple items per view
            const maxIndex = slides.length - itemsPerView;
            if (index > maxIndex) index = 0; // Loop back to start

            // Calculate percentage to move
            // Each slide width percentage is 100 / itemsPerView
            const movePercentage = index * (100 / itemsPerView);
            track.style.transform = 'translateX(-' + movePercentage + '%)';

            // Update active dot
            if (dotsContainer) {
                const dotIndex = Math.floor(index / itemsPerView);
                dots.forEach(d => d.classList.remove('active'));
                if (dots[dotIndex]) dots[dotIndex].classList.add('active');
            }

            currentSlide = index;
        }

        // Initialize dots
        updateDots();

        // Auto slide
        setInterval(() => {
            let nextSlide = currentSlide + itemsPerView;
            // Loop logic handled in moveToSlide, but we need to pass the "raw" next index
            if (nextSlide > slides.length - itemsPerView) {
                nextSlide = 0;
            }
            moveToSlide(nextSlide);
        }, autoSlideInterval);
    }

    // Initialize Testimonial Slider (1 item per view)
    initSlider('.testimonial-track', '.slider-dots', 5000, 1);

    // Initialize Product Slider (3 items per view on desktop)
    initSlider('.product-track', '.product-dots', 4000, 3);
});
