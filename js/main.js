document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Boot Loader
    const bootLoader = document.getElementById('boot-loader');
    const bootLines = document.getElementById('boot-lines');
    const bootBar = document.getElementById('boot-bar');

    if (bootLoader && bootLines && bootBar) {
        if (sessionStorage.getItem('hasBooted')) {
            bootLoader.classList.add('hidden');
            startTypewriter();
        } else {
            document.body.style.overflow = 'hidden';
            const lines = [
                { text: '> Initializing VP Portfolio...', delay: 500 },
                { text: '> Loading <span class="accent">design_system</span>.css', delay: 600 },
                { text: '> Compiling <span class="accent">game_projects</span>[]', delay: 550 },
                { text: '> Linking <span class="accent">experience.timeline</span>', delay: 500 },
                { text: '> Mounting <span class="accent">skills.renderer</span>', delay: 450 },
                { text: '> Build complete — 0 errors', delay: 400, success: true },
                { text: '> Launching...', delay: 700, success: true },
            ];

            let totalDelay = 300;
            lines.forEach((line, i) => {
                totalDelay += line.delay;
                const progress = Math.round(((i + 1) / lines.length) * 100);
                setTimeout(() => {
                    const el = document.createElement('div');
                    el.className = 'boot-line' + (line.success ? ' success' : '');
                    el.innerHTML = line.text;
                    bootLines.appendChild(el);
                    bootBar.style.width = progress + '%';
                }, totalDelay);
            });

            totalDelay += 800;
            setTimeout(() => {
                bootLoader.classList.add('hidden');
                document.body.style.overflow = '';
                sessionStorage.setItem('hasBooted', 'true');
                startTypewriter();
            }, totalDelay);
        }
    } else {
        startTypewriter();
    }

    // Typewriter
    function startTypewriter() {
        const el = document.getElementById('typewriter');
        if (!el) return;
        const text = 'Game Designer & Unity Developer';
        let i = 0;
        el.textContent = '';
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 45 + Math.random() * 35);
            }
        }
        setTimeout(type, 300);
    }

    // Card Tilt
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        let rafId = null;

        card.addEventListener('mousemove', (e) => {
            // Disable tilt on mobile/tablets
            const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (isTouch || rafId || card.classList.contains('no-tilt')) return;
            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -1.5;
                const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 1.5;
                card.style.transition = 'none';
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
                rafId = null;
            });
        });

        card.addEventListener('mouseleave', () => {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            card.style.transition = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
            card.style.transform = '';
        });
    });



    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        let hovering = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function updateCursor() {
            cursorDot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            const offset = hovering ? 25 : 18;
            cursorRing.style.transform = `translate3d(${ringX - offset}px, ${ringY - offset}px, 0)`;
            requestAnimationFrame(updateCursor);
        }
        requestAnimationFrame(updateCursor);

        const interactiveSelector = 'a, button, .pill, .nav-btn, input, textarea, [role="button"]';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                hovering = true;
                cursorRing.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                hovering = false;
                cursorRing.classList.remove('hovering');
            }
        });
    }

    // Scroll Progress
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
        }, { passive: true });
    }

    // Scroll Reveal (staggered)
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        const visible = [];
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visible.push(entry.target);
                observer.unobserve(entry.target);
            }
        });
        visible.forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 80);
        });
    }, { threshold: 0.08 });
    revealElements.forEach(el => observer.observe(el));

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Play RPG Button
    const btnPlayRpg = document.getElementById('btn-play-rpg');
    const minigameSection = document.getElementById('minigame-section');
    if (btnPlayRpg && minigameSection) {
        btnPlayRpg.addEventListener('click', () => {
            minigameSection.classList.remove('hidden');
            minigameSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optionally, we could dispatch an event here if the game needs to "wake up"
            // But currently it runs on load, which is fine.
        });
    }

    // i18n
    // translations object is now loaded from js/translations.js

    const langToggle = document.querySelector('.lang-toggle');

    function applyTranslations(lang) {
        const language = lang === 'en' ? 'en' : 'pt';
        document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = translations[key];
            if (!translation) return;
            const value = translation[language] || translation.pt;
            if (!value) return;

            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                el.placeholder = value;
            } else {
                el.innerHTML = value;
            }

            if (key === 'btn-resume') {
                const resumeUrls = {
                    pt: 'assets/documents/Vinicius.Game.Designer.PT.pdf',
                    en: 'assets/documents/Vinicius.Game.Designer.EN.pdf'
                };
                const link = el.closest('a.resume-link');
                if (link) link.href = resumeUrls[language] || resumeUrls.pt;
            }
        });

        if (langToggle) {
            langToggle.setAttribute('aria-label', language === 'en' ? 'Português' : 'English');
            langToggle.dataset.lang = language;
        }

        localStorage.setItem('lang', language);

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    applyTranslations(localStorage.getItem('lang') || 'en');

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const next = (langToggle.dataset.lang || 'en') === 'en' ? 'pt' : 'en';
            applyTranslations(next);
        });
    }
});
