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

// ===== IMAGE TOGGLE (Hide/Show Screenshots) =====
function toggleImages(btn) {
    const content = btn.closest('.session-content');
    if (!content) return;

    const isHidden = content.classList.toggle('text-only');
    btn.classList.toggle('active', isHidden);
    btn.querySelector('.toggle-text').textContent = isHidden ? 'Show images' : 'Hide images';
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

    // Get button position and append to body for no clipping (fixed position)
    const rect = btn.getBoundingClientRect();
    emoji.style.left = (rect.left + rect.width / 2) + 'px';
    emoji.style.top = rect.top + 'px';
    document.body.appendChild(emoji);

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

// ===== TUTORIAL PAGE COMPLETION TOGGLE =====
function injectTutorialCompletion() {
    const tutorialId = document.body.dataset.tutorial;
    if (!tutorialId) return; // Not a tutorial page

    const courseHeader = document.querySelector('.course-header');
    if (!courseHeader) return;

    // Create completion toggle for tutorial page
    const completions = JSON.parse(localStorage.getItem('tutorialCompletions') || '{}');
    const isCompleted = completions[tutorialId];

    const toggleHtml = `
        <button class="tutorial-completion-btn ${isCompleted ? 'completed' : ''}" onclick="toggleTutorialCompletion('${tutorialId}')" title="Mark as complete">
            <span class="check-empty"></span>
            <span class="check-filled"></span>
            <span class="btn-label">${isCompleted ? 'Completed!' : 'Mark Complete'}</span>
        </button>
    `;

    // Insert after the meta div
    const meta = courseHeader.querySelector('.meta');
    if (meta) {
        meta.insertAdjacentHTML('afterend', toggleHtml);
    }

    // Add completed class to body if completed
    if (isCompleted) {
        document.body.classList.add('tutorial-completed');
    }
}

function toggleTutorialCompletion(tutorialId) {
    const completions = JSON.parse(localStorage.getItem('tutorialCompletions') || '{}');
    const isCompleting = !completions[tutorialId];
    completions[tutorialId] = isCompleting;
    localStorage.setItem('tutorialCompletions', JSON.stringify(completions));

    const btn = document.querySelector('.tutorial-completion-btn');
    const label = btn.querySelector('.btn-label');

    if (isCompleting) {
        btn.classList.add('completed');
        label.textContent = 'Completed!';
        document.body.classList.add('tutorial-completed');
        showClapEmoji(btn);
    } else {
        btn.classList.remove('completed');
        label.textContent = 'Mark Complete';
        document.body.classList.remove('tutorial-completed');
    }
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

    // Inject completion toggle on tutorial pages
    injectTutorialCompletion();
});
