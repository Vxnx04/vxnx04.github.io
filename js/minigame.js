document.addEventListener('DOMContentLoaded', () => {

    // GAME CONFIG & STATE
    const GAME = {
        player: {
            hp: 100, maxHp: 100, damage: 5,
            level: 1, gold: 0, xp: 0,
            stats: { str: 1, vit: 1, dex: 1 },
            costs: { str: 50, vit: 50, dex: 50 }
        },
        enemy: null,
        floor: 1,
        maxFloor: 10,
        state: 'IDLE', // IDLE, COMBAT, SHOP, BOSS, GAMEOVER
        skills: {
            attack: { name: 'Strike', cooldown: 0.5, damageMult: 1, color: '#3b82f6' },
            special: { name: 'Bash', cooldown: 4, damageMult: 2.5, color: '#ef4444' },
            heal: { name: 'Mend', cooldown: 12, healPct: 0.3, color: '#22c55e' }
        },
        cooldowns: { attack: 0, special: 0, heal: 0 },
        autoAttackTimer: 0,
        autoAttackInterval: 1.5, // Seconds
    };

    // DOM ELEMENTS
    const UI = {
        container: document.getElementById('minigame-container'),
        overlay: document.getElementById('game-overlay'),
        views: {
            combat: document.getElementById('game-combat-view'),
            shop: document.getElementById('game-shop-view'),
            controls: document.getElementById('game-controls')
        },
        text: {
            floor: document.getElementById('rpg-floor'),
            gold: document.getElementById('rpg-gold'),
            indicator: document.getElementById('rpg-floor-indicator')
        },
        entities: {
            player: document.getElementById('rpg-player'),
            enemy: document.getElementById('rpg-enemy'),
            playerHp: document.getElementById('player-hp-bar'),
            playerHpText: document.getElementById('player-hp-text'),
            enemyHp: document.getElementById('enemy-hp-bar'),
            enemyHpText: document.getElementById('enemy-hp-text'),
            damageOverlay: document.querySelector('.damage-overlay')
        },
        shop: {
            str: { btn: document.getElementById('btn-buy-str'), cost: document.getElementById('cost-str') },
            vit: { btn: document.getElementById('btn-buy-vit'), cost: document.getElementById('cost-vit') },
            dex: { btn: document.getElementById('btn-buy-dex'), cost: document.getElementById('cost-dex') },
            stats: {
                str: document.getElementById('shop-stat-str'),
                vit: document.getElementById('shop-stat-vit'),
                dex: document.getElementById('shop-stat-dex')
            },
            next: document.getElementById('btn-next-floor'),
            nextNum: document.getElementById('next-floor-num')
        },
        skills: {
            attack: document.getElementById('btn-skill-1'),
            special: document.getElementById('btn-skill-2'),
            heal: document.getElementById('btn-skill-3')
        },
        btnStart: document.getElementById('btn-start-game')
    };

    if (!UI.container) return;

    // LOCALIZATION
    const RPG_TEXT = {
        en: {
            title: "Pocket RPG",
            objective: "Defeat the Demon King on Floor 10",
            btnStart: "ENTER DUNGEON",
            merchant: "MERCHANT",
            str: "STR (+4 Dmg)",
            vit: "VIT (+25 HP)",
            dex: "DEX (+2% Crit)",
            btnNext: "Next Floor",
            floor: "FLOOR",
            monster: "Monster Lvl",
            boss: "DEMON KING",
            victory: "VICTORY!",
            victoryDesc: "You defeated the Demon King!",
            defeat: "YOU DIED",
            defeatDesc: "Fallen on Floor",
            retry: "RETRY FLOOR",
            newRun: "NEW RUN",
            btnProjects: "SEE MY PROJECTS",
            skills: ["STRIKE", "BASH", "MEND"]
        },
        pt: {
            title: "Pocket RPG",
            objective: "Derrote o Rei Demônio no Andar 10",
            btnStart: "ENTRAR NA MASMORRA",
            merchant: "MERCADOR",
            str: "FOR (+4 Dano)",
            vit: "VIT (+25 HP)",
            dex: "DES (+2% Crit)",
            btnNext: "Próximo Andar",
            floor: "ANDAR",
            monster: "Monstro Nvl",
            boss: "REI DEMÔNIO",
            victory: "VITÓRIA!",
            victoryDesc: "Você derrotou o Rei Demônio!",
            defeat: "VOCÊ MORREU",
            defeatDesc: "Caiu no Andar",
            retry: "TENTAR NOVAMENTE",
            newRun: "NOVA PARTIDA",
            btnProjects: "VER MEUS PROJETOS",
            skills: ["GOLPEAR", "ESMAGAR", "CURAR"]
        }
    };

    function getLang() {
        return document.documentElement.lang === 'pt-BR' ? 'pt' : 'en';
    }

    function safeSetText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    }

    function updateLanguage() {
        const lang = getLang();
        const t = RPG_TEXT[lang] || RPG_TEXT.en;

        // Static Text
        safeSetText('start-title', t.title);
        safeSetText('start-desc', t.objective);
        safeSetText('btn-start-game', t.btnStart);
        safeSetText('shop-title', t.merchant);
        safeSetText('shop-desc-str', t.str);
        safeSetText('shop-desc-vit', t.vit);
        safeSetText('shop-desc-dex', t.dex);
        safeSetText('btn-next-text', t.btnNext);

        // Skills
        const s1 = document.querySelector('#btn-skill-1 .text-\\[10px\\]');
        const s2 = document.querySelector('#btn-skill-2 .text-\\[10px\\]');
        const s3 = document.querySelector('#btn-skill-3 .text-\\[10px\\]');
        if (s1) s1.innerText = t.skills[0];
        if (s2) s2.innerText = t.skills[1];
        if (s3) s3.innerText = t.skills[2];

        // Floor Text
        if (UI.text.floor) UI.text.floor.innerText = `${t.floor} ${GAME.floor}`;

        // Indicator
        if (GAME.state === 'COMBAT' && GAME.enemy) {
            const isBoss = GAME.floor === 10;
            UI.text.indicator.innerText = isBoss ? t.boss : `${t.monster} ${GAME.floor}`;
        }

        // Modals
        const modal = document.getElementById('game-modal');
        if (modal && !modal.classList.contains('hidden')) {
            const mTitle = document.getElementById('modal-title');
            if (mTitle.innerText.includes('DIED') || mTitle.innerText.includes('MORREU') || mTitle.classList.contains('text-red-500')) {
                mTitle.innerText = t.defeat;
                document.getElementById('modal-desc').innerText = `${t.defeatDesc} ${GAME.floor}`;
                document.getElementById('btn-retry').innerText = t.retry;
                document.getElementById('btn-reset').innerText = t.newRun;
            } else {
                mTitle.innerText = t.victory;
                document.getElementById('modal-desc').innerText = t.victoryDesc;
                document.getElementById('btn-reset').innerText = t.btnProjects;
            }
        }
    }

    // Observer
    const observer = new MutationObserver(updateLanguage);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    // Initial call
    setTimeout(updateLanguage, 100);

    // Persistance
    loadGame();

    // CORE LOOP
    let lastTime = 0;
    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        updateCooldowns(dt); // Always update cooldowns

        if (GAME.state === 'COMBAT') {
            updateCombat(dt);
        }

        requestAnimationFrame(gameLoop);
    }

    function updateCooldowns(dt) {
        for (const key in GAME.cooldowns) {
            if (GAME.cooldowns[key] > 0) {
                GAME.cooldowns[key] -= dt;
                updateSkillUI(key, GAME.cooldowns[key], GAME.skills[key].cooldown);
            }
        }
    }

    function updateCombat(dt) {
        if (!GAME.enemy) return;

        // Player Auto-Attack
        GAME.autoAttackTimer -= dt;
        if (GAME.autoAttackTimer <= 0) {
            performAttack(1.0, false); // weak auto attack
            GAME.autoAttackTimer = GAME.autoAttackInterval;
        }

        // Enemy Attack (Simple timer)
        GAME.enemy.attackTimer -= dt;
        if (GAME.enemy.attackTimer <= 0) {
            enemyAttack();
            GAME.enemy.attackTimer = GAME.enemy.attackInterval;
        }
    }

    // ACTIONS & SKILLS
    function useSkill(key) {
        if (GAME.state !== 'COMBAT') return;
        if (GAME.cooldowns[key] > 0) return;

        const skill = GAME.skills[key];
        GAME.cooldowns[key] = skill.cooldown;

        if (key === 'heal') {
            const amount = Math.floor(GAME.player.maxHp * skill.healPct);
            healPlayer(amount);
        } else {
            performAttack(skill.damageMult, true);
        }
    }

    function performAttack(mult, isManual) {
        if (!GAME.enemy) return;

        // Stats
        const baseDmg = GAME.player.damage + (GAME.player.stats.str * 4);
        let dmg = baseDmg * mult;

        // Crit (DEX) - More dopamine!
        const critChance = 0.10 + (GAME.player.stats.dex * 0.02);
        const isCrit = Math.random() < critChance;
        if (isCrit) dmg *= 2;

        damageEnemy(dmg, isCrit);

        if (isManual) {
            animateEntity(UI.entities.player, 'attack');
        }
    }

    function enemyAttack() {
        if (GAME.state !== 'COMBAT') return;

        let dmg = GAME.enemy.damage;
        // Mitigation (VIT) - minimal
        dmg = Math.max(1, dmg - (GAME.player.stats.vit * 1.0));

        damagePlayer(dmg);
        animateEntity(UI.entities.enemy, 'attack');
    }

    // ENTITY LOGIC
    function spawnEnemy() {
        const f = GAME.floor;
        const isBoss = f % 10 === 0;

        // Scaling: 1.3x HP per floor, 1.2x Dmg per floor
        let hp = Math.floor(40 * Math.pow(1.3, f - 1) * (isBoss ? 2 : 1));
        if (isBoss) hp -= 150; // Nerf boss
        const dmg = Math.floor(5 * Math.pow(1.2, f - 1) * (isBoss ? 1.5 : 1));

        GAME.enemy = {
            hp: hp,
            maxHp: hp,
            damage: dmg,
            name: isBoss ? 'DEMON KING' : `Monster Lvl ${f}`,
            attackInterval: Math.max(0.5, 2.0 - (f * 0.05)),
            attackTimer: 1.0
        };

        GAME.state = 'COMBAT';
        updateLanguage(); // Set indicator text localized
        UI.text.indicator.style.color = isBoss ? 'red' : 'rgba(255,255,255,0.4)';

        // Visuals update
        const view = UI.views.combat;
        if (f === 10) view.style.background = 'radial-gradient(circle at center, #312e81 0%, #000 100%)'; // Boss Purple
        else if (f >= 6) view.style.background = 'radial-gradient(circle at center, #450a0a 0%, #1a1a20 100%)'; // Hard Red
        else view.style.background = 'radial-gradient(circle at center, #2d2d35 0%, #1a1a20 100%)'; // Normal Blue

        updateEnemyUI();
    }

    function damageEnemy(amount, isCrit) {
        if (!GAME.enemy) return;
        GAME.enemy.hp -= amount;
        showFloatingText(amount, UI.entities.enemy, isCrit ? 'crit' : 'normal');

        if (isCrit) {
            animateEntity(UI.entities.enemy, 'shake');
            createParticles(UI.entities.enemy, 8, '#f59e0b');
        } else {
            createParticles(UI.entities.enemy, 3, '#fff');
        }

        if (GAME.enemy.hp <= 0) {
            GAME.enemy.hp = 0;
            updateEnemyUI();
            onEnemyDeath();
        } else {
            updateEnemyUI();
        }
    }

    function createParticles(target, count, color) {
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const parentRect = UI.views.combat.getBoundingClientRect();

        const x = rect.left - parentRect.left + (rect.width / 2);
        const y = rect.top - parentRect.top + (rect.height / 2);

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.backgroundColor = color;
            p.style.left = x + 'px';
            p.style.top = y + 'px';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 30 + Math.random() * 50;
            const mx = Math.cos(angle) * velocity + 'px';
            const my = Math.sin(angle) * velocity + 'px';

            p.style.setProperty('--mx', mx);
            p.style.setProperty('--my', my);

            UI.views.combat.appendChild(p);
            setTimeout(() => p.remove(), 600);
        }
    }

    function damagePlayer(amount) {
        GAME.player.hp -= amount;
        showFloatingText(amount, UI.entities.player, 'damage');

        // Flash red
        UI.entities.damageOverlay.style.opacity = '0.5';
        setTimeout(() => UI.entities.damageOverlay.style.opacity = '0', 100);

        if (GAME.player.hp <= 0) {
            GAME.player.hp = 0;
            updatePlayerUI();
            onGameOver();
        } else {
            updatePlayerUI();
        }
    }

    function healPlayer(amount) {
        GAME.player.hp = Math.min(GAME.player.hp + amount, GAME.player.maxHp);
        showFloatingText(amount, UI.entities.player, 'heal');
        updatePlayerUI();
    }

    function onEnemyDeath() {
        GAME.state = 'SHOP';
        let goldReward = Math.floor(30 * Math.pow(1.2, GAME.floor));

        // Late game boost
        if (GAME.floor >= 6 && GAME.floor < 10) {
            goldReward = Math.floor(goldReward * 1.5);
        }

        GAME.player.gold += goldReward;
        showFloatingText(goldReward, UI.entities.player, 'gold');

        saveGame();
        updateUI();

        setTimeout(() => {
            const isBossFloor = GAME.floor === 10;
            if (isBossFloor) {
                const t = RPG_TEXT[getLang()];
                showModal(t.victory, t.victoryDesc, false);
            } else {
                openShop();
            }
        }, 800);
    }

    function onGameOver() {
        GAME.state = 'GAMEOVER';
        setTimeout(() => {
            const t = RPG_TEXT[getLang()];
            showModal(t.defeat, `${t.defeatDesc} ${GAME.floor}`, true);
        }, 1000);
    }

    function showModal(title, msg, canRetry) {
        const modal = document.getElementById('game-modal');
        const mTitle = document.getElementById('modal-title');
        const mDesc = document.getElementById('modal-desc');
        const btnRetry = document.getElementById('btn-retry');
        const btnReset = document.getElementById('btn-reset');

        modal.classList.remove('hidden');
        mTitle.innerText = title;
        mTitle.className = title.includes('DIED') ? 'game-title text-red-500' : 'game-title text-amber-500';
        mDesc.innerText = msg;

        if (canRetry) {
            btnRetry.classList.remove('hidden');
        } else {
            btnRetry.classList.add('hidden');
        }

        // Clear old listeners to avoid dupes (simple hack or use oneshot)
        btnRetry.onclick = () => {
            modal.classList.add('hidden');
            retryFloor();
        };

        const isVictory = !canRetry; // Victory = no retry (for now)
        const t = RPG_TEXT[getLang()];

        if (isVictory) {
            btnReset.innerText = t.btnProjects;
            btnReset.onclick = () => {
                modal.classList.add('hidden');
                const workSection = document.getElementById('work');
                if (workSection) workSection.scrollIntoView({ behavior: 'smooth' });
            };
        } else {
            btnReset.innerText = t.newRun;
            btnReset.onclick = () => {
                modal.classList.add('hidden');
                resetGame();
            };
        }
    }

    function retryFloor() {
        // Penalty: lose 10% gold? (Optional)
        // Full heal
        GAME.player.hp = GAME.player.maxHp;
        updatePlayerUI();
        spawnEnemy();
    }

    // SHOP LOGIC
    function openShop() {
        UI.views.combat.classList.add('hidden');
        UI.views.shop.classList.remove('hidden');
        UI.views.controls.classList.add('hidden');
        updateShopUI();
    }

    function closeShop() {
        UI.views.shop.classList.add('hidden');
        UI.views.combat.classList.remove('hidden');
        UI.views.controls.classList.remove('hidden');
        GAME.floor++;
        spawnEnemy();
        // Full heal between floors? Maybe 50%
        healPlayer(Math.floor(GAME.player.maxHp * 0.5));
    }

    function buyStat(stat) {
        const cost = GAME.player.costs[stat];
        if (GAME.player.gold >= cost) {
            GAME.player.gold -= cost;
            GAME.player.stats[stat]++;
            GAME.player.costs[stat] = Math.floor(cost * 1.3); // Cost scaling

            // Apply immediate effects
            if (stat === 'vit') {
                GAME.player.maxHp += 25;
                GAME.player.hp += 25;
            }

            // Feedback
            const btn = UI.shop[stat].btn;
            const label = stat.toUpperCase();
            showFloatingText(label, btn, 'upgrade');

            saveGame();
            updateShopUI();
            updatePlayerUI();
        }
    }

    function updateShopUI() {
        ['str', 'vit', 'dex'].forEach(stat => {
            const cost = GAME.player.costs[stat];
            const btn = UI.shop[stat].btn;
            const lbl = UI.shop[stat].cost;

            lbl.innerText = `${cost} G`;
            if (GAME.player.gold >= cost) {
                btn.classList.remove('disabled');
            } else {
                btn.classList.add('disabled');
            }
        });

        if (UI.shop.stats) {
            UI.shop.stats.str.innerText = GAME.player.stats.str;
            UI.shop.stats.vit.innerText = GAME.player.stats.vit;
            UI.shop.stats.dex.innerText = GAME.player.stats.dex;
        }
    }

    // UI & VISUALS
    function updateSkillUI(key, current, max) {
        const btn = UI.skills[key];
        if (!btn) return;
        const overlay = btn.querySelector('.action-cooldown');
        if (overlay) {
            const percent = (current / max) * 100;
            overlay.style.height = `${percent}%`;
        }
        btn.disabled = current > 0;
    }

    function updateEnemyUI() {
        if (!GAME.enemy) return;
        const pct = (GAME.enemy.hp / GAME.enemy.maxHp) * 100;
        UI.entities.enemyHp.style.width = `${pct}%`;
        if (UI.entities.enemyHpText) UI.entities.enemyHpText.innerText = `${Math.ceil(GAME.enemy.hp)} / ${GAME.enemy.maxHp}`;
    }

    function updatePlayerUI() {
        const pct = (GAME.player.hp / GAME.player.maxHp) * 100;
        UI.entities.playerHp.style.width = `${pct}%`;
        if (UI.entities.playerHpText) UI.entities.playerHpText.innerText = `${Math.ceil(GAME.player.hp)} / ${GAME.player.maxHp}`;
        UI.text.gold.innerText = GAME.player.gold;
    }

    function updateUI() {
        updateLanguage(); // Update localized text
        if (GAME.state === 'COMBAT') updateCombat(0); // visual update only?

        updatePlayerUI();
        updateEnemyUI();
        updateShopUI();
    }

    function showFloatingText(value, target, type) {
        const el = document.createElement('div');
        el.className = 'damage-number';

        let text = value;
        if (typeof value === 'number') text = value.toFixed(0);

        if (type === 'crit') {
            el.className += ' damage-crit';
            el.innerText = text + '!';
        } else if (type === 'heal') {
            el.style.color = '#22c55e';
            el.innerText = '+' + text;
        } else if (type === 'upgrade') {
            el.style.color = '#6366f1'; // Indigo
            el.innerText = '+1 ' + text;
        } else if (type === 'damage') {
            el.style.color = '#ef4444';
            el.innerText = '-' + text;
        } else if (type === 'gold') {
            el.style.color = '#f59e0b';
            el.innerText = '+' + text + ' G';
        } else {
            el.innerText = text;
        }

        // Random offset
        const x = (Math.random() - 0.5) * 40;
        el.style.transform = `translateX(${x}px)`;

        target.appendChild(el);
        setTimeout(() => el.remove(), 800);
    }

    function animateEntity(el, anim) {
        if (anim === 'attack') {
            el.style.transform = 'scale(1.2)';
            setTimeout(() => el.style.transform = '', 100);
        } else if (anim === 'shake') {
            el.classList.add('shake');
            setTimeout(() => el.classList.remove('shake'), 300);
        }
    }

    // SYSTEM
    function saveGame() {
        const data = {
            player: GAME.player,
            floor: GAME.floor,
            state: GAME.state
        };
        localStorage.setItem('rpg_save', JSON.stringify(data));
    }

    function loadGame() {
        const saved = localStorage.getItem('rpg_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                GAME.player = { ...GAME.player, ...data.player };
                GAME.floor = data.floor;
                if (data.state) GAME.state = data.state;
                updateUI();
            } catch (e) { console.error('Save invalid'); }
        }
    }

    function resetGame() {
        localStorage.removeItem('rpg_save');

        // Reset State
        GAME.player = {
            hp: 100, maxHp: 100, damage: 5,
            level: 1, gold: 0, xp: 0,
            stats: { str: 1, vit: 1, dex: 1 },
            costs: { str: 50, vit: 50, dex: 50 }
        };
        GAME.enemy = null;
        GAME.floor = 1;
        GAME.state = 'IDLE';
        GAME.cooldowns = { attack: 0, special: 0, heal: 0 };

        // Reset UI
        UI.views.shop.classList.add('hidden');
        UI.views.combat.classList.remove('hidden');
        if (UI.views.controls) UI.views.controls.classList.remove('hidden');
        UI.overlay.style.display = 'flex';

        updateUI();
        // Clear enemy UI
        UI.text.indicator.innerText = "Floor 1";
        UI.entities.enemyHp.style.width = '100%';
        if (UI.entities.enemyHpText) UI.entities.enemyHpText.innerText = "...";
    }

    // INPUTS
    UI.btnStart.addEventListener('click', () => {
        UI.overlay.style.display = 'none';

        // Resume logic
        if (GAME.state === 'SHOP') {
            openShop();
        } else {
            spawnEnemy();
        }

        requestAnimationFrame(gameLoop);
    });

    // Manual Click Attack
    UI.entities.enemy.addEventListener('click', () => {
        if (GAME.state === 'COMBAT') {
            performAttack(1.0, true); // Manual click = 100% dmg
        }
    });

    UI.shop.next.addEventListener('click', closeShop);

    UI.shop.str.btn.addEventListener('click', () => buyStat('str'));
    UI.shop.vit.btn.addEventListener('click', () => buyStat('vit'));
    UI.shop.dex.btn.addEventListener('click', () => buyStat('dex'));

    UI.skills.attack.addEventListener('click', () => useSkill('attack'));
    UI.skills.special.addEventListener('click', () => useSkill('special'));
    UI.skills.heal.addEventListener('click', () => useSkill('heal'));

    document.addEventListener('keydown', (e) => {
        if (GAME.state !== 'COMBAT') return;
        if (e.key === 'q') useSkill('attack');
        if (e.key === 'w') useSkill('special');
        if (e.key === 'e') useSkill('heal');
    });

});
