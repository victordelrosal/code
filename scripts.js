/* ===================================================
   CODE GUIDES - Shared JavaScript
   =================================================== */

// ===== THEME MANAGEMENT =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// ===== VIEW TOGGLE (Hub Page) =====
function setView(view) {
    const buttons = document.querySelectorAll('.view-toggle button');
    const carouselView = document.getElementById('carousel-view');
    const listView = document.getElementById('list-view');

    if (!carouselView || !listView) return;

    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', (view === 'carousel' && i === 0) || (view === 'list' && i === 1));
    });

    if (view === 'carousel') {
        carouselView.classList.remove('hidden');
        listView.classList.remove('active');
    } else {
        carouselView.classList.add('hidden');
        listView.classList.add('active');
    }

    localStorage.setItem('view', view);
}

// ===== CAROUSEL SCROLL (Hub Page) =====
function scrollCarousel(direction) {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    const cardWidth = 320 + 24; // card width + gap
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}

// ===== SESSION/ACCORDION TOGGLE (Tutorial Pages) =====
function toggleSession(header) {
    const session = header.closest('.session');
    if (session) session.classList.toggle('open');
}

// ===== COMPLETION TOGGLE =====
function toggleCompletion(event, tutorialId) {
    event.preventDefault();
    event.stopPropagation();

    const btn = event.currentTarget;

    // Get current completion state from localStorage
    const completions = JSON.parse(localStorage.getItem('tutorialCompletions') || '{}');

    // Toggle completion
    const isCompleting = !completions[tutorialId];
    completions[tutorialId] = isCompleting;

    // Save to localStorage
    localStorage.setItem('tutorialCompletions', JSON.stringify(completions));

    // Add clicking effect
    btn.classList.add('clicking');
    setTimeout(() => btn.classList.remove('clicking'), 600);

    // Show clapping emoji when completing
    if (isCompleting) {
        showClapEmoji(btn);
    }

    // Update all elements with this tutorial ID (both carousel and list view)
    document.querySelectorAll(`[data-tutorial="${tutorialId}"]`).forEach(el => {
        // Remove completed class first to reset animation
        el.classList.remove('completed');

        if (isCompleting) {
            // Small delay to allow animation reset
            requestAnimationFrame(() => {
                el.classList.add('completed');
            });
        }
    });
}

function showClapEmoji(btn) {
    const emoji = document.createElement('span');
    emoji.className = 'clap-emoji';
    emoji.textContent = '👏';
    btn.appendChild(emoji);

    setTimeout(() => {
        emoji.remove();
    }, 1000);
}

function loadCompletions() {
    const completions = JSON.parse(localStorage.getItem('tutorialCompletions') || '{}');

    Object.keys(completions).forEach(tutorialId => {
        if (completions[tutorialId]) {
            document.querySelectorAll(`[data-tutorial="${tutorialId}"]`).forEach(el => {
                el.classList.add('completed');
            });
        }
    });
}

// ===== COPY CODE BUTTON =====
function copyCode(codeId, btn) {
    const codeEl = document.getElementById(codeId);
    if (!codeEl) return;

    const text = codeEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        const btnText = btn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Copied to clipboard';

        setTimeout(() => {
            btn.classList.remove('copied');
            if (btnText) btnText.textContent = 'Copy';
        }, 2000);
    });
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // Load saved view preference (hub page only)
    if (localStorage.getItem('view') === 'list') {
        setView('list');
    }

    // Load tutorial completion states
    loadCompletions();
});
