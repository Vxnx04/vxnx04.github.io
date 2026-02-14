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
            if (rafId) return;
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

    // Skill Filtering
    const skillPills = document.querySelectorAll('.skill-pill');
    const projectCards = document.querySelectorAll('.project-card');
    let activeSkill = null;

    skillPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const skill = pill.dataset.skill;

            if (activeSkill === skill) {
                activeSkill = null;
                skillPills.forEach(p => p.classList.remove('active'));
                projectCards.forEach(c => c.classList.remove('dimmed', 'highlighted'));
                return;
            }

            activeSkill = skill;
            skillPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            projectCards.forEach(card => {
                const skills = (card.dataset.skills || '').split(',');
                if (skills.includes(skill)) {
                    card.classList.remove('dimmed');
                    card.classList.add('highlighted');
                } else {
                    card.classList.remove('highlighted');
                    card.classList.add('dimmed');
                }
            });
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

    // i18n
    const translations = {
        'status-available': { pt: 'Disponível para Trabalho', en: 'Available for Work' },
        'hero-desc': {
            pt: 'Game Designer & Unity Developer com foco em experiências imersivas para mobile e PC. Histórico de lançamentos com forte retenção e ciclos rápidos de prototipagem a release.',
            en: 'Game Designer & Unity Developer focused on immersive experiences for mobile and PC. Track record of launches with strong retention and fast prototyping-to-release cycles.'
        },
        'hero-cta-primary': { pt: '<i data-lucide="mail" class="w-4 h-4"></i> Entrar em Contato', en: '<i data-lucide="mail" class="w-4 h-4"></i> Contact Me' },
        'hero-cta-secondary': { pt: '<i data-lucide="arrow-down" class="w-4 h-4"></i> Ver Projetos', en: '<i data-lucide="arrow-down" class="w-4 h-4"></i> View Projects' },
        'social-proof-title': { pt: 'Trabalhei com', en: 'Worked with' },
        'about-title': { pt: 'Sobre Mim', en: 'About Me' },
        'about-p1': {
            pt: 'Olá! Sou <strong class="text-white font-medium">Vinicius</strong>, Game Designer e Unity Developer com mais de 2 anos criando jogos e experiências interativas.',
            en: 'Hi! I am <strong class="text-white font-medium">Vinicius</strong>, a Game Designer and Unity Developer with 2+ years creating games and interactive experiences.'
        },
        'about-p2': {
            pt: 'Acredito que jogos são o meio definitivo para contar histórias e conectar pessoas. Atuo na ponte entre visão criativa e execução técnica, garantindo que cada mecânica sirva à experiência do jogador.',
            en: 'I believe games are the ultimate medium to tell stories and connect people. I bridge creative vision and technical execution, ensuring every mechanic serves the player experience.'
        },
        'about-p3': {
            pt: 'Do protótipo rápido ao lançamento, gosto de iterar com métricas, polir UX/UI e entregar produtos prontos para escalar.',
            en: 'From fast prototyping to launch, I iterate with metrics, polish UX/UI, and ship products ready to scale.'
        },
        'btn-resume': { pt: '<i data-lucide="download" class="w-4 h-4"></i> Baixar Currículo', en: '<i data-lucide="download" class="w-4 h-4"></i> Download Resume' },
        'skills-title': { pt: 'Habilidades & Tecnologias', en: 'Skills & Tech' },
        'skill-core': { pt: 'Core', en: 'Core' },
        'skill-technical': { pt: 'Técnico', en: 'Technical' },
        'skill-soft': { pt: 'Habilidades Interpessoais', en: 'Soft Skills' },
        'experience-title': { pt: 'Experiência', en: 'Experience' },
        'exp-ocarina-company': { pt: 'Ocarina Studios', en: 'Ocarina Studios' },
        'exp-ocarina-role': { pt: 'Game Designer Jr. & Developer', en: 'Game Designer Jr. & Developer' },
        'exp-ocarina-date': { pt: '2023 — 2025', en: '2023 — 2025' },
        'exp-ocarina-b1': { pt: 'Criação e desenvolvimento de jogos mobile com retenção D1 de até 40%.', en: 'Designed and developed mobile games reaching up to 40% D1 retention.' },
        'exp-ocarina-b2': { pt: 'Liderança de sistemas de gameplay e implementação de UI/UX em Unity.', en: 'Led gameplay systems and UI/UX implementation in Unity.' },
        'exp-ocarina-b3': { pt: 'Gestão de projeto e liderança de equipe multidisciplinar (5 pessoas).', en: 'Project management and leadership of a 5-person multidisciplinary team.' },
        'exp-ocarina-b4': { pt: 'Projeto selecionado para o Google Indie Accelerator.', en: 'Project selected for the Google Indie Accelerator.' },
        'tag-agile': { pt: 'Liderança Ágil', en: 'Agile Leadership' },
        'tag-csharp': { pt: 'Sistemas em Unity & C#', en: 'Unity & C# Systems' },
        'tag-analytics': { pt: 'Design Orientado a Dados', en: 'Data-Driven Design' },
        'tag-prototyping': { pt: 'Prototipagem Rápida', en: 'Rapid Prototyping' },
        'tag-mechanics': { pt: 'Mecânicas de Gameplay', en: 'Gameplay Mechanics' },
        'exp-degree-company': { pt: 'FAM Centro Universitário', en: 'FAM University Center' },
        'exp-degree-role': { pt: 'Tecnólogo em Jogos Digitais', en: 'Digital Games Degree' },
        'exp-degree-date': { pt: '2021 — 2023', en: '2021 — 2023' },
        'exp-degree-desc1': { pt: 'Tecnólogo em Jogos Digitais.', en: 'Technologist Degree in Digital Games.' },
        'exp-degree-desc2': { pt: 'Projeto final: "Memories of a Scattered Mind" — jogo de horror psicológico explorando memória e PTSD.', en: 'Final project: "Memories of a Scattered Mind" — psychological horror game exploring memory and PTSD.' },
        'education-title': { pt: 'Educação', en: 'Education' },
        'edu-mba-title': { pt: 'MBA Game Design', en: 'MBA Game Design' },
        'edu-mba-desc-short': {
            pt: 'Especialização em liderança, inovação e tecnologias emergentes (VR/AR, IA) para jogos.',
            en: 'Specialization in leadership, innovation, and emerging tech (VR/AR, AI) for games.'
        },
        'edu-degree-title': { pt: 'Jogos Digitais', en: 'Digital Games' },
        'edu-degree-role': { pt: 'Tecnólogo em Jogos Digitais', en: 'Digital Games Degree' },
        'edu-degree-inst': { pt: 'Centro Universitário FAM', en: 'FAM University Center' },
        'edu-degree-desc1': {
            pt: 'Graduação em Jogos Digitais. Desenvolvedor de "Memories of a Scattered Mind".',
            en: 'Technologist Degree in Digital Games. Developed "Memories of a Scattered Mind".'
        },
        'edu-neuro-title-short': { pt: 'Neurociência e Física da Consciência', en: 'Neuroscience & Physics of Consciousness' },
        'edu-neuro-desc': {
            pt: 'Estudo de processos cognitivos e tomada de decisão para aprimorar experiências interativas.',
            en: 'Study of cognitive processes and decision-making to enhance interactive experiences.'
        },
        'projects-title': { pt: 'Projetos em Destaque', en: 'Featured Projects' },
        'proj-dq-cat': { pt: 'Puzzle Adventure', en: 'Puzzle Adventure' },
        'proj-dq-desc': { pt: 'Jogo de aventura com estilo artístico único e elementos de trivia. Desenvolvido para mobile com foco em retenção e engajamento.', en: 'Adventure game with a unique art style and trivia elements. Built for mobile with focus on retention and engagement.' },
        'proj-mr-cat': { pt: 'Simulation / Merge', en: 'Simulation / Merge' },
        'proj-mr-desc': { pt: 'Jogo de simulação de restaurante acolhedor com elementos de Match3 e Merge. Desenvolvido como Game Designer e Developer líder.', en: 'Cozy restaurant simulation with Match3 and Merge elements. Led as Game Designer and Developer.' },
        'proj-mem-cat': { pt: 'Psychological Horror', en: 'Psychological Horror' },
        'proj-mem-desc': { pt: 'Jogo narrativo experimental de horror psicológico explorando memória e percepção. Projeto de graduação premiado.', en: 'Experimental narrative horror game exploring memory and perception. Awarded graduation project.' },
        'project-btn-details': { pt: '<i data-lucide="arrow-right" class="w-4 h-4"></i> Ver Detalhes', en: '<i data-lucide="arrow-right" class="w-4 h-4"></i> View Details' },
        'projects-cta': { pt: '<i data-lucide="gamepad-2" class="w-4 h-4"></i> Ver Mais Projetos no Itch.io', en: '<i data-lucide="gamepad-2" class="w-4 h-4"></i> See More Projects on Itch.io' },
        'web-list-title': { pt: 'Portfólio Web', en: 'Web Portfolio' },
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
            en: "Let's discuss your web project—identity, copy, SEO, and performance tailored to your business."
        },
        'web-hero-cta': { pt: '<i data-lucide="mail" class="w-4 h-4"></i> Solicitar um site', en: '<i data-lucide="mail" class="w-4 h-4"></i> Request a Website' },
        'web-hero-title': { pt: 'Design & Desenvolvimento', en: 'Design & Development' },
        'web-hero-desc': {
            pt: 'Seleção de sites que projetei e desenvolvi, alinhando branding, copy e performance para negócios e criadores.',
            en: 'A selection of websites I designed and developed, aligning branding, copy, and performance for businesses and creators.'
        },
        'web-hero-back': { pt: '<i data-lucide="arrow-left" class="w-4 h-4"></i> Voltar ao Portfólio', en: '<i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Portfolio' },
        'web-list-cta': { pt: '<i data-lucide="globe" class="w-4 h-4"></i> Portfólio Web', en: '<i data-lucide="globe" class="w-4 h-4"></i> Web Portfolio' },
        'contact-title': { pt: 'Vamos Conversar', en: "Let's Connect" },
        'contact-text': {
            pt: 'Interessado em colaborar ou tem um projeto em mente? Estou disponível para novas oportunidades em tempo integral ou projetos freelance.',
            en: 'Interested in collaborating or have a project in mind? I am available for full-time roles or freelance projects.'
        },
        'contact-availability': { pt: 'Disponível para freelas e tempo integral', en: 'Available for freelance and full-time' },
        'contact-btn-email': { pt: 'Enviar Email', en: 'Send Email' },
        'contact-linkedin-text': { pt: 'LinkedIn', en: 'LinkedIn' },
        'contact-itch-text': { pt: 'Itch.io', en: 'Itch.io' },
        'footer-credit': { pt: 'Desenhado e desenvolvido por VXNX', en: 'Designed & Built by VXNX' },

        /* Game Pages */
        'nav-games': { pt: 'Jogos', en: 'Games' },
        'nav-contact': { pt: 'Contato', en: 'Contact' },
        'platform-mobile': { pt: 'Mobile', en: 'Mobile' },
        'platform-desktop': { pt: 'Desktop', en: 'Desktop' },
        'status-released': { pt: 'Lançado', en: 'Released' },
        'status-demo': { pt: 'Demo', en: 'Demo' },
        'play-btn-play': { pt: 'Jogar Agora', en: 'Play Game' },
        'play-btn-itch': { pt: 'Jogar no Itch.io', en: 'Play on Itch.io' },
        'game-about-title': { pt: 'Sobre o Jogo', en: 'About the Game' },
        'role-title': { pt: 'Meu Papel', en: 'My Role' },
        'role-gd': { pt: 'Game Designer', en: 'Game Designer' },
        'role-unity': { pt: 'Desenvolvedor Unity', en: 'Unity Developer' },
        'role-ld': { pt: 'Level Designer', en: 'Level Designer' },
        'role-sd': { pt: 'Sound Designer', en: 'Sound Designer' },
        'resp-title': { pt: 'Responsabilidades', en: 'Responsibilities' },
        'tech-title': { pt: 'Tecnologias Usadas', en: 'Technologies Used' },
        'journey-title': { pt: 'Jornada de Desenvolvimento', en: 'Development Journey' },
        'back-to-games': { pt: '← Voltar para Jogos', en: '← Back to Games' },

        /* Dream QuiZzz */
        'dq-about-desc': {
            pt: 'Ambientado em um mundo de sonhos misterioso onde o conhecimento impulsiona o progresso, os jogadores devem responder a perguntas de trivia para se aproximar do Portal Final. A jornada é não-linear, com caminhos ramificados e dificuldade crescente, incentivando o pensamento estratégico e a exploração. À medida que progridem, os jogadores restauram gradualmente uma utopia de conhecimento despedaçada reconstruindo partes do Mundo dos Sonhos.',
            en: 'Set in a mysterious dream world where knowledge fuels progress, players must answer trivia questions to move closer to the End Portal. The journey is non-linear, with branching paths and escalating difficulty, encouraging strategic thinking and exploration. As players progress, they gradually restore a shattered utopia of knowledge by rebuilding parts of the Dream World.'
        },
        'dq-resp-1': { pt: 'Projetei mecânicas principais de gameplay combinando trivia e aventura, balanceando desafio, ritmo e fluxo do jogador', en: 'Designed core gameplay mechanics combining trivia and adventure, balancing challenge, pacing, and player flow' },
        'dq-resp-2': { pt: 'Implementei sistemas principais e UI/UX no Unity, incluindo lógica de quiz, progressão, navegação de fases e animações de feedback', en: 'Implemented core systems and UI/UX in Unity, including quiz logic, progression, stage navigation, and feedback animations' },
        'dq-resp-3': { pt: 'Mantive a documentação de game design, garantindo visão consistente, comunicação clara e gerenciamento de escopo', en: 'Maintained game design documentation, ensuring consistent vision, clear communication, and scope management' },
        'dq-resp-4': { pt: 'Liderei e participei de playtests regulares, coletando feedback qualitativo e iterando no gameplay e UX', en: 'Led and participated in regular playtests, collecting qualitative feedback and iterating on gameplay and UX' },
        'dq-resp-5': { pt: 'Monitorei dados analíticos (Firebase) para apoiar decisões de design baseadas em dados e medir retenção e pontos de desistência', en: 'Monitored analytics data (Firebase) to support data-driven design decisions and measure retention and drop-off points' },
        'dq-tech-1': { pt: 'Unity Engine (Sistemas 2D & UI)', en: 'Unity Engine (2D & UI systems)' },
        'dq-tech-2': { pt: 'C# (scripting de gameplay, lógica de UI e fluxo de jogo)', en: 'C# (scripting gameplay, UI logic, and game flow)' },
        'dq-tech-3': { pt: 'Figma (wireframes de UI, fluxogramas e mockups)', en: 'Figma (UI wireframes, flowcharts, and mockups)' },
        'dq-tech-4': { pt: 'Firebase (Remote Config, Analytics)', en: 'Firebase (Remote Config, Analytics)' },
        'dq-journey-p': {
            pt: 'Criar Dream QuiZzz foi um mergulho profundo no design de gameplay híbrido, misturando mecânicas de trivia com progressão estilo aventura. Isso exigiu prototipagem rápida, ciclos de feedback com jogadores e colaboração multifuncional.',
            en: 'Creating Dream Quizzz was a deep dive into hybrid gameplay design, blending trivia mechanics with adventure-style progression. This required rapid prototyping, player feedback loops, and cross-functional collaboration.'
        },
        'dq-journey-1': {
            pt: 'Encontrar o equilíbrio certo entre agência do jogador e fluxo de trivia foi desafiador. Prototipamos múltiplos modelos de interação e testamos com jogadores reais para criar uma experiência envolvente que mantém a emoção de ambos os gêneros.',
            en: 'Finding the right balance between player agency and trivia flow was challenging. We prototyped multiple interaction models and tested them with real players to create an engaging experience that maintains the excitement of both genres.'
        },
        'dq-journey-2': {
            pt: 'A importância do design mobile-first ficou clara ao focarmos na usabilidade com uma mão e entrega intuitiva de perguntas. Aprendemos a priorizar a experiência do usuário mantendo as mecânicas principais do jogo.',
            en: "The importance of mobile-first design became clear as we focused on one-handed usability and instinctive question delivery. We learned to prioritize user experience while maintaining the game's core mechanics."
        },
        'dq-journey-3': {
            pt: 'Implementamos um sistema de dificuldade dinâmica que se adapta ao desempenho do jogador, garantindo uma experiência desafiadora porém justa. O sistema usa Firebase Analytics para rastrear comportamento do jogador e ajustar a dificuldade das perguntas.',
            en: 'We implemented a dynamic difficulty system that adapts to player performance, ensuring a challenging yet fair experience. The system uses Firebase Analytics to track player behavior and adjust question difficulty accordingly.'
        },

        /* Mysterious Restaurant */
        'mr-about-desc': {
            pt: 'Herde um restaurante atemporal e conecte-se com seus clientes através de desafios únicos. Um jogo de simulação de restaurante com mecânicas de match-3 e merge.',
            en: 'Inherit a timeless restaurant, and connect with your customers through unique challenges. A restaurant simulation game with match-3 and merge mechanics.'
        },
        'mr-resp-1': { pt: 'Projetei o jogo e o onboarding', en: 'Designed the game and onboarding' },
        'mr-resp-2': { pt: 'Implementei sistemas de jogo e UI no Unity', en: 'Implemented game systems and UI in Unity' },
        'mr-resp-3': { pt: 'Mantive a documentação', en: 'Maintained documentation' },
        'mr-resp-4': { pt: 'Realizei playtests e iterações baseadas em feedback', en: 'Playtested and iterated based on feedback' },
        'mr-resp-5': { pt: 'Rastreei dados analíticos', en: 'Tracked analytics data' },
        'mr-tech-1': { pt: 'Unity Engine', en: 'Unity Engine' },
        'mr-tech-2': { pt: 'C#', en: 'C#' },
        'mr-tech-3': { pt: 'Figma (para UI/UX)', en: 'Figma (for UI/UX)' },
        'mr-tech-4': { pt: 'Firebase', en: 'Firebase' },
        'mr-journey-p': {
            pt: 'Este projeto começou originalmente como um jogo de restaurante baseado em trivia. No entanto, depois pivotamos para um estilo de gameplay match-3 para apoiar melhor o tema de restaurante e melhorar o engajamento.',
            en: 'This project originally began as a trivia-based restaurant game. However, we later pivoted to a match-3 gameplay style to better support the restaurant theme and improve engagement.'
        },
        'mr-journey-1': {
            pt: 'Integrar trivia em um ambiente de restaurante foi difícil. O pivô para mecânicas de match-3 e merge permitiu um loop de gameplay mais natural e envolvente.',
            en: 'Integrating trivia into a restaurant setting was difficult. The pivot to match-3 and merge mechanics allowed for a more natural and engaging gameplay loop.'
        },
        'mr-journey-2': {
            pt: 'Aprendi a importância de adaptar o design baseado no feedback dos jogadores e analíticos, e como misturar diferentes gêneros para uma experiência única.',
            en: 'Learned the importance of adapting design based on player feedback and analytics, and how to blend different genres for a unique experience.'
        },
        'mr-journey-3': {
            pt: 'Desenvolvi um sistema de ciclo dia/noite e comportamentos dinâmicos de clientes para manter o gameplay fresco e rejogável.',
            en: 'Developed a day/night cycle system and dynamic customer behaviors to keep gameplay fresh and replayable.'
        },

        /* Memories */
        'mem-about-desc': {
            pt: 'Memories of a Scattered Mind é um jogo de horror psicológico que coloca você na pele de William George Harrison, veterano do Exército dos EUA da Guerra do Vietnã. Após uma série de acontecimentos traumáticos em sua vida, junto com um caso mal tratado de TEPT, William tem experimentado ocorrências estranhas em sua própria casa.',
            en: 'Memories of a Scattered Mind is a Psychological Horror Game that sets you into the shoes of William George Harrison, US Army Vet from the Vietnam War. Following a series of traumatic happenings in his life, along with a poorly treated case PTSD, William has been experiencing strange occurrences around his own home.'
        },
        'mem-resp-1': { pt: 'Projetei o jogo e os níveis', en: 'Designed the game and levels' },
        'mem-resp-2': { pt: 'Implementei sistemas de jogo e UI no Unity', en: 'Implemented game systems and UI in Unity' },
        'mem-resp-3': { pt: 'Mantive a documentação', en: 'Maintained documentation' },
        'mem-resp-4': { pt: 'Criei e implementei o design de som', en: 'Created and implemented sound design' },
        'mem-tech-1': { pt: 'Unity Engine', en: 'Unity Engine' },
        'mem-tech-2': { pt: 'C#', en: 'C#' },
        'mem-tech-3': { pt: 'Figma (para UI/UX)', en: 'Figma (for UI/UX)' },
        'mem-journey-p': {
            pt: '<em>Memories of a Scattered Mind</em> foi meu primeiro projeto 3D na Unity — uma experiência de horror psicológico focada em narrativa e atmosfera em vez de jump scares tradicionais.',
            en: '<em>Memories of a Scattered Mind</em> was my first 3D project in Unity — a psychological horror experience focused on storytelling and atmosphere over traditional jump scares.'
        },
        'mem-journey-1': {
            pt: 'Manter a tensão e o medo sem jump scares exigiu design de nível cuidadoso, ritmo e trabalho de áudio. Focamos em narrativa ambiental e pistas sutis para imergir os jogadores na mente fraturada de William.',
            en: "Maintaining tension and dread without jump scares required careful level design, pacing, and audio work. We focused on environmental storytelling and subtle cues to immerse players in William's fractured mind."
        },
        'mem-journey-2': {
            pt: 'Aprendi a importância do ritmo e design ambiental no horror psicológico, e como o som pode ser usado para conduzir emoção e narrativa.',
            en: 'Learned the importance of pacing and environmental design in psychological horror, and how sound can be used to drive emotion and narrative.'
        },
        'mem-journey-3': {
            pt: 'Desenvolvi gatilhos de áudio personalizados e sistemas de iluminação dinâmica para melhorar a imersão e a experiência do jogador.',
            en: 'Developed custom audio triggers and dynamic lighting systems to enhance immersion and player experience.'
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

            if (key === 'btn-resume') {
                const resumeUrls = {
                    pt: 'https://github.com/user-attachments/files/25074221/Vinicius.PT-BR.pdf',
                    en: 'https://github.com/user-attachments/files/25074220/Vinicius.EN.pdf'
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
