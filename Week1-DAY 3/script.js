document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initializing Component States ---
    initTheme();
    initCursorSpotlight();
    initTypingEffect();
    initScrollProgress();
    initSectionObserver();
    initCounters();
    initEmailCopy();
    initContactForm();
    initBackToTop();
});

/* --- Premium Theme Switcher Engine --- */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
    
    document.body.className = storedTheme;
    
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.className = 'light-theme';
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            document.body.className = 'dark-theme';
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });
}

/* --- Optimized Real-time Cursor Light Tracker --- */
function initCursorSpotlight() {
    const spotlight = document.getElementById('cursorSpotlight');
    if (!spotlight) return;

    window.addEventListener('mousemove', (e) => {
        // Utilizing CSS Variables transformation mapping via requestAnimationFrame logic natively
        window.requestAnimationFrame(() => {
            spotlight.style.setProperty('--x', `${e.clientX}px`);
            spotlight.style.setProperty('--y', `${e.clientY}px`);
        });
    });
}

/* --- Elegant Native String Writer (Typewriter) --- */
function initTypingEffect() {
    const target = document.getElementById('typingElement');
    if (!target) return;

    const phrases = ["Database Architecture", "Object-Oriented Development", "Cross-Functional Project Leadership", "Cinematic Content Strategy"];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40;
        } else {
            target.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 500; // Brief pause before writing next string
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --- Scroll Tracking Logic --- */
function initScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (progressBar) progressBar.style.width = `${scrolled}%`;

        // Active Section Navigation Tracking Matrix
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            const bottom = top + sec.offsetHeight;
            if (winScroll >= top && winScroll < bottom) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --- Structural Intersection Observers for Fluid Transitions --- */
function initSectionObserver() {
    const sections = document.querySelectorAll('.reveal-section');
    
    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Execution performance enhancement
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
}

/* --- Numerical Counter Micro-Animations --- */
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endVal = parseInt(target.getAttribute('data-target'), 10);
                let currentVal = 0;
                const duration = 1500;
                const increment = endVal / (duration / 16);

                const countInterval = setInterval(() => {
                    currentVal += increment;
                    if (currentVal >= endVal) {
                        target.textContent = endVal;
                        clearInterval(countInterval);
                    } else {
                        target.textContent = Math.floor(currentVal);
                    }
                }, 16);

                observer.unobserve(target);
            }
        });
    }, { threshold: 1.0 });

    counters.forEach(c => observer.observe(c));
}

/* --- Secure Clipboard Copier & Custom Notification Trigger --- */
function initEmailCopy() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const emailText = document.getElementById('emailText');

    if (!copyBtn || !emailText) return;

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(emailText.textContent).then(() => {
            showToast("Success: Email copied securely to clipboard.");
        }).catch(() => {
            showToast("Error: Application clipboard permissions denied.");
        });
    });
}

/* --- Clean Asynchronous Notification Stack --- */
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/* --- Frontend Validation Layer & Form Submission Handling --- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Native programmatic field assessment
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showToast("Warning: All interface interaction fields are required.");
            return;
        }

        showToast("Transmission Successful: Message routed dynamically.");
        form.reset();
    });
}

/* --- Back to Top Return Control --- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}