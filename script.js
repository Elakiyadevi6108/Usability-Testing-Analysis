// Screen transition logic
function navigateTo(targetScreenId, transitionClass) {
    const activeScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById('screen-' + targetScreenId);

    if (!targetScreen || activeScreen === targetScreen) return;

    // Remove active state from current
    activeScreen.classList.remove('active');
    
    // Reset target screen position before showing
    targetScreen.classList.remove('slide-up', 'slide-left', 'slide-right', 'fade');
    targetScreen.classList.add(transitionClass);
    
    // Force DOM reflow so transition applies
    void targetScreen.offsetWidth;

    // Add active to trigger transition
    targetScreen.classList.add('active');

    // Update bottom nav active state if applicable
    const navItems = targetScreen.querySelectorAll('.bottom-nav .nav-item');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetScreenId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Global click handler for bottom navs
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-item')) {
        const target = e.target.getAttribute('data-target');
        const currentActive = e.target.closest('.bottom-nav').querySelector('.active');
        
        // Simple heuristic for slide direction
        let transition = 'fade';
        if (currentActive) {
            const currentTarget = currentActive.getAttribute('data-target');
            if (currentTarget === 'home' && target === 'progress') transition = 'slide-left';
            if (currentTarget === 'progress' && target === 'home') transition = 'slide-right';
        }
        
        navigateTo(target, transition);
    }
});

// Splash screen auto-redirect
setTimeout(() => {
    navigateTo('login', 'fade');
}, 1500);

// === Play / Pause Toggle ===
let sessionInterval = null;
let sessionSeconds = 0;
const TOTAL_SECONDS = 15 * 60; // 15 minutes

function togglePlay(btn) {
    if (sessionInterval) {
        // Pause
        clearInterval(sessionInterval);
        sessionInterval = null;
        btn.textContent = '▶';
        btn.setAttribute('aria-label', 'Play session');
    } else {
        // Play
        btn.textContent = '⏸';
        btn.setAttribute('aria-label', 'Pause session');
        sessionInterval = setInterval(() => {
            sessionSeconds = Math.min(sessionSeconds + 1, TOTAL_SECONDS);
            const remaining = TOTAL_SECONDS - sessionSeconds;
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            const timer = document.getElementById('session-timer');
            const scrubber = document.getElementById('session-scrubber');
            if (timer) timer.textContent = `${m}:${s.toString().padStart(2, '0')}`;
            if (scrubber) scrubber.value = Math.round((sessionSeconds / TOTAL_SECONDS) * 100);
            if (sessionSeconds >= TOTAL_SECONDS) {
                clearInterval(sessionInterval);
                sessionInterval = null;
                if (btn) { btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play session'); }
            }
        }, 1000);
    }
}

// Reset session when navigating away
function resetSession() {
    if (sessionInterval) { clearInterval(sessionInterval); sessionInterval = null; }
    sessionSeconds = 0;
    const timer = document.getElementById('session-timer');
    const scrubber = document.getElementById('session-scrubber');
    const btn = document.getElementById('btn-play');
    if (timer) timer.textContent = '15:00';
    if (scrubber) scrubber.value = 0;
    if (btn) { btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play session'); }
}
