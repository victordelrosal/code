/* ===================================================
   CODE GUIDES - Shared JavaScript
   =================================================== */

// ===== THEME MANAGEMENT =====
function setTheme(theme) {
    document.body.classList.remove('light-mode', 'pro-mode');
    if (theme === 'light') document.body.classList.add('light-mode');
    if (theme === 'pro') document.body.classList.add('pro-mode');

    // Update theme selector buttons if they exist
    const buttons = document.querySelectorAll('.theme-selector button');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active',
            (theme === 'dark' && i === 0) ||
            (theme === 'light' && i === 1) ||
            (theme === 'pro' && i === 2)
        );
    });

    localStorage.setItem('theme', theme);
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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // Load saved view preference (hub page only)
    if (localStorage.getItem('view') === 'list') {
        setView('list');
    }
});
