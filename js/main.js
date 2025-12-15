document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            
            // Reset hamburger icon
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Glitch Effect Randomization for Hero Title
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            const skew = Math.random() * 20 - 10;
            glitchText.style.setProperty('--skew', `${skew}deg`);
        }, 2000);
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }, index * 100);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.section-title').forEach(el => {
        staggerObserver.observe(el);
    });

    document.querySelectorAll('.project-card, .skill-category, .timeline-item, .education-card, .stat-item').forEach(el => {
        staggerObserver.observe(el);
    });

    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (target === 100) {
                    element.textContent = Math.floor(current) + '%';
                } else {
                    element.textContent = Math.floor(current) + '+';
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target === 100) {
                    element.textContent = target + '%';
                } else {
                    element.textContent = target + '+';
                }
            }
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(element.closest('.stat-item'));
    };

    document.querySelectorAll('.stat-number').forEach(el => {
        const text = el.textContent;
        if (text.includes('+')) {
            const value = parseInt(text);
            el.textContent = '0+';
            animateCounter(el, value);
        } else if (text.includes('%')) {
            el.textContent = '0%';
            animateCounter(el, 100);
        }
    });

    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timeline.classList.add('animated');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        timelineObserver.observe(timeline);
    }

    const translations = {
        'nav-home': { pt: 'Início', en: 'Home' },
        'nav-about': { pt: 'Sobre', en: 'About' },
        'nav-skills': { pt: 'Habilidades', en: 'Skills' },
        'nav-experience': { pt: 'Experiência', en: 'Experience' },
        'nav-education': { pt: 'Educação', en: 'Education' },
        'nav-projects': { pt: 'Projetos', en: 'Projects' },
        'nav-web': { pt: 'Sites Web', en: 'Web Sites' },
        'nav-contact': { pt: 'Contato', en: 'Contact' },
        'scroll-text': { pt: 'Rolar', en: 'Scroll' },
        'hero-desc': {
            pt: 'Game Designer & Unity Developer com foco em experiências imersivas para mobile e PC. Histórico de lançamentos com forte retenção e ciclos rápidos de prototipagem a release.',
            en: 'Game Designer & Unity Developer focused on immersive experiences for mobile and PC. Track record of launches with strong retention and fast prototyping-to-release cycles.'
        },
        'hero-cta-primary': { pt: 'Entrar em Contato', en: 'Contact Me' },
        'hero-cta-secondary': { pt: 'Ver Projetos', en: 'View Projects' },
        'social-proof-title': { pt: 'Trabalhei com', en: 'Worked with' },
        'about-title': { pt: 'Sobre Mim', en: 'About Me' },
        'about-p1': {
            pt: 'Olá! Sou <strong class="text-accent">Vinicius</strong>, Game Designer e Unity Developer com mais de 2 anos criando jogos e experiências interativas.',
            en: 'Hi! I am <strong class="text-accent">Vinicius</strong>, a Game Designer and Unity Developer with 2+ years creating games and interactive experiences.'
        },
        'about-p2': {
            pt: 'Acredito que jogos são o meio definitivo para contar histórias e conectar pessoas. Atuo na ponte entre visão criativa e execução técnica, garantindo que cada mecânica sirva à experiência do jogador.',
            en: 'I believe games are the ultimate medium to tell stories and connect people. I bridge creative vision and technical execution, ensuring every mechanic serves the player experience.'
        },
        'about-p3': {
            pt: 'Do protótipo rápido ao lançamento, gosto de iterar com métricas, polir UX/UI e entregar produtos prontos para escalar.',
            en: 'From fast prototyping to launch, I iterate with metrics, polish UX/UI, and ship products ready to scale.'
        },
        'stat-exp': { pt: 'Anos de Exp.', en: 'Years Exp.' },
        'stat-games': { pt: 'Jogos Lançados', en: 'Shipped Games' },
        'stat-passion': { pt: 'Paixão', en: 'Passion' },
        'btn-resume': { pt: 'Baixar Currículo', en: 'Download Resume' },
        'skills-title': { pt: 'Habilidades & Tecnologias', en: 'Skills & Tech' },
        'skill-core': { pt: 'Core', en: 'Core' },
        'skill-technical': { pt: 'Technical', en: 'Technical' },
        'skill-soft': { pt: 'Habilidades Interpessoais', en: 'Soft Skills' },
        'experience-title': { pt: 'Experiência', en: 'Experience' },
        'exp-ocarina-role': { pt: 'Game Designer Jr. & Developer', en: 'Game Designer Jr. & Developer' },
        'exp-ocarina-company': { pt: 'Ocarina Studios', en: 'Ocarina Studios' },
        'exp-ocarina-date': { pt: '2023 - 2025', en: '2023 - 2025' },
        'exp-ocarina-b1': { pt: 'Criação e desenvolvimento de jogos mobile com retenção D1 de até 40%.', en: 'Designed and developed mobile games reaching up to 40% D1 retention.' },
        'exp-ocarina-b2': { pt: 'Liderança de sistemas de gameplay e implementação de UI/UX em Unity.', en: 'Led gameplay systems and UI/UX implementation in Unity.' },
        'exp-ocarina-b3': { pt: 'Gestão de projeto e liderança de equipe multidisciplinar (5 pessoas).', en: 'Project management and leadership of a 5-person multidisciplinary team.' },
        'exp-ocarina-b4': { pt: 'Projeto selecionado para o Google Indie Accelerator.', en: 'Project selected for the Google Indie Accelerator.' },
        'exp-degree-role': { pt: 'Digital Games Degree', en: 'Digital Games Degree' },
        'exp-degree-company': { pt: 'FAM Centro Universitário', en: 'FAM University Center' },
        'exp-degree-date': { pt: '2021 - 2023', en: '2021 - 2023' },
        'exp-degree-desc1': { pt: 'Tecnólogo em Jogos Digitais.', en: 'Technologist Degree in Digital Games.' },
        'exp-degree-desc2': { pt: 'Projeto final: "Memories of a Scattered Mind" — jogo de horror psicológico explorando memória e PTSD.', en: 'Final project: "Memories of a Scattered Mind" — psychological horror game exploring memory and PTSD.' },
        'education-title': { pt: 'Educação', en: 'Education' },
        'edu-mba-title': { pt: 'MBA Game Design - Cursando', en: 'MBA Game Design - In Progress' },
        'edu-mba-inst': { pt: 'Centro Universitário Internacional - UNINTER • São Paulo SP • 2026', en: 'International University Center - UNINTER • São Paulo SP • 2026' },
        'edu-mba-desc': {
            pt: 'MBA em Game Design com foco em liderança de projetos, inovação e tecnologias emergentes (VR/AR, IA e machine learning). Formação voltada para gestão estratégica, desenvolvimento de experiências interativas e acompanhamento das tendências da indústria de jogos.',
            en: 'MBA in Game Design focused on project leadership, innovation, and emerging technologies (VR/AR, AI, and machine learning). Training aimed at strategic management, development of interactive experiences, and monitoring industry trends in games.'
        },
        'edu-degree-title': { pt: 'Jogos Digitais | Graduado em 2023', en: 'Digital Games | Graduated in 2023' },
        'edu-degree-inst': { pt: 'FAM Centro Universitário • 2023', en: 'FAM University Center • 2023' },
        'edu-degree-desc1': {
            pt: 'Desenvolvi Memories of a Scattered Mind, um jogo de terror psicológico em Unity, promovendo conscientização sobre TEPT por meio de design narrativo inovador.',
            en: 'Developed Memories of a Scattered Mind, a psychological horror game in Unity, promoting awareness about PTSD through innovative narrative design.'
        },
        'edu-degree-desc2': {
            pt: 'Responsável pelo game design e desenvolvimento na game engine Unity.',
            en: 'Responsible for game design and development in the Unity game engine.'
        },
        'projects-title': { pt: 'Projetos em Destaque', en: 'Featured Projects' },
        'proj-dq-cat': { pt: 'Puzzle Adventure', en: 'Puzzle Adventure' },
        'proj-dq-desc': { pt: 'Jogo de aventura com estilo artístico único e elementos de trivia. Desenvolvido para mobile com foco em retenção e engajamento.', en: 'Adventure game with a unique art style and trivia elements. Built for mobile with focus on retention and engagement.' },
        'proj-mr-cat': { pt: 'Simulation / Merge', en: 'Simulation / Merge' },
        'proj-mr-desc': { pt: 'Jogo de simulação de restaurante acolhedor com elementos de Match3 e Merge. Desenvolvido como Game Designer e Developer líder.', en: 'Cozy restaurant simulation with Match3 and Merge elements. Led as Game Designer and Developer.' },
        'proj-mem-cat': { pt: 'Psychological Horror', en: 'Psychological Horror' },
        'proj-mem-desc': { pt: 'Jogo narrativo experimental de horror psicológico explorando memória e percepção. Projeto de graduação premiado.', en: 'Experimental narrative horror game exploring memory and perception. Awarded graduation project.' },
        'project-btn-details': { pt: 'Ver Detalhes', en: 'View Details' },
        'projects-cta': { pt: 'Ver Mais Projetos no Itch.io', en: 'See More Projects on Itch.io' },
        'contact-title': { pt: 'Vamos Conversar', en: "Let's Connect" },
        'contact-text': {
            pt: 'Interessado em colaborar ou tem um projeto em mente? Estou disponível para novas oportunidades em tempo integral ou projetos freelance.',
            en: 'Interested in collaborating or have a project in mind? I am available for full-time roles or freelance projects.'
        },
        'contact-email-text': { pt: 'vini.gamedesigner@gmail.com', en: 'vini.gamedesigner@gmail.com' },
        'contact-availability': { pt: 'Disponível para freelas e tempo integral', en: 'Available for freelance and full-time' },
        'contact-btn-email': { pt: 'Enviar Email', en: 'Send Email' },
        'contact-linkedin-text': { pt: 'LinkedIn', en: 'LinkedIn' },
        'contact-itch-text': { pt: 'Itch.io', en: 'Itch.io' },
        'footer-credit': { pt: 'Desenhado e desenvolvido por VXNX', en: 'Designed & Built by VXNX' },
        'web-hero-title': { pt: 'Portfólio Web', en: 'Web Portfolio' },
        'web-hero-subtitle': { pt: 'Design & Desenvolvimento de Sites', en: 'Web Design & Development' },
        'web-hero-desc': {
            pt: 'Seleção de sites que projetei e desenvolvi, alinhando branding, copy e performance para negócios e criadores.',
            en: 'Selection of websites I designed and built, aligning branding, copy, and performance for businesses and creators.'
        },
        'web-hero-cta': { pt: 'Solicitar um site', en: 'Request a Website' },
        'web-hero-back': { pt: 'Voltar ao portfólio geral', en: 'Back to main portfolio' },
        'web-list-title': { pt: 'Sites em Destaque', en: 'Featured Websites' },
        'web-btn-visit': { pt: 'Visitar Site', en: 'Visit Site' },
        'web-fazotu-cat': { pt: 'Logística Nacional', en: 'National Logistics' },
        'web-fazotu-desc': {
            pt: 'Site institucional para transportadora com atuação nacional, focando em credibilidade, licenças e captura de leads B2B.',
            en: 'Corporate site for a nationwide logistics company, highlighting credibility, licenses, and B2B lead capture.'
        },
        'web-crsp-cat': { pt: 'Escritório Jurídico', en: 'Law Firm' },
        'web-crsp-desc': {
            pt: 'Landing de serviços jurídicos com foco em confiança, depoimentos e chamadas rápidas para consulta via WhatsApp.',
            en: 'Legal services landing with trust signals, testimonials, and quick consultation CTAs via WhatsApp.'
        },
        'web-rige-cat': { pt: 'Portfólio de Ilustração', en: 'Illustration Portfolio' },
        'web-rige-desc': {
            pt: 'Portfólio bilíngue para ilustradora freelance, com destaque para encomendas, redes e termos de serviço.',
            en: 'Bilingual portfolio for a freelance illustrator, highlighting commissions, socials, and terms of service.'
        },
        'web-contact-title': { pt: 'Pronto para um novo site?', en: 'Ready for a new website?' },
        'web-contact-text': {
            pt: 'Vamos conversar sobre seu projeto web — identidade, copy, SEO e performance alinhados ao seu negócio.',
            en: 'Let’s discuss your web project—identity, copy, SEO, and performance tailored to your business.'
        }
    };

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

            if (el.hasAttribute('data-text')) {
                el.setAttribute('data-text', value);
            }
        });

        if (langToggle) {
            langToggle.dataset.lang = language;
            langToggle.textContent = language === 'en' ? 'EN / PT' : 'PT / EN';
        }

        localStorage.setItem('lang', language);
    }

    const savedLang = localStorage.getItem('lang') || 'pt';
    applyTranslations(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const current = langToggle.dataset.lang || 'pt';
            const next = current === 'en' ? 'pt' : 'en';
            applyTranslations(next);
        });
    }
});
