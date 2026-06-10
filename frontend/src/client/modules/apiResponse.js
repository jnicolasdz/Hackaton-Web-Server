const apiURL = '/api/exercises';

const listEl        = document.getElementById('list');
const modalOverlay  = document.getElementById('modal-overlay');
const modalBody     = document.getElementById('modal-body');
const modalClose    = document.getElementById('modal-close');
const pointsHintEl  = document.getElementById('points-hint');

let cardTemplate = null;
let currentCategory = 'any';

// ── Points per difficulty ─────────────────────────────
const POINTS = { '1': 2, '2': 4, '3': 8 };

function updatePointsHint(cat) {
    if (cat === 'any') {
        pointsHintEl.innerHTML =
            'Resolver un ejercicio otorga ' +
            '<span class="pts-badge" style="background:rgba(52,211,153,0.12);color:#34d399">★ 2 pts · Fácil</span> &nbsp;' +
            '<span class="pts-badge" style="background:rgba(251,191,36,0.12);color:#fbbf24">★ 4 pts · Medio</span> &nbsp;' +
            '<span class="pts-badge" style="background:rgba(248,113,113,0.12);color:#f87171">★ 8 pts · Difícil</span>';
    } else {
        const labels = { '1': 'Fácil', '2': 'Medio', '3': 'Difícil' };
        const colors = {
            '1': { bg: 'rgba(52,211,153,0.12)',  fg: '#34d399' },
            '2': { bg: 'rgba(251,191,36,0.12)',  fg: '#fbbf24' },
            '3': { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
        };
        const { bg, fg } = colors[cat];
        pointsHintEl.innerHTML =
            'Resolver un ejercicio ' +
            '<span class="pts-badge" style="background:' + bg + ';color:' + fg + '">' + labels[cat] + '</span>' +
            ' otorga ' +
            '<span class="pts-badge" style="background:' + bg + ';color:' + fg + '">★ ' + POINTS[cat] + ' puntos</span>';
    }
}

// ── LocalStorage helpers ──────────────────────────────
function getCompleted() {
    try { return JSON.parse(localStorage.getItem('completedExercises') || '[]'); }
    catch { return []; }
}
function setCompleted(arr) {
    localStorage.setItem('completedExercises', JSON.stringify(arr));
}

// ── Fetch ─────────────────────────────────────────────
async function fetchExercises() {
    try {
        const res = await fetch(apiURL);
        if (!res.ok) throw new Error('fetch');
        return await res.json();
    } catch {
        return [
            {
                "id": 1, "category": 1,
                "title": "Editor de texto",
                "description": "Crear script que dado un archivo de texto plano retorne el mismo archivo con todo su contenido en mayúsculas.",
                "expected_input": "archivo.txt",
                "expected_output": "ARCHIVO.TXT",
                "hint": "tr",
                "solved": false
            },
            {
                "id": 2, "category": 2,
                "title": "Contar palabras",
                "description": "Dado un archivo de texto, imprime el número total de palabras que contiene.",
                "expected_input": "texto.txt",
                "expected_output": "42",
                "hint": "wc",
                "solved": true
            },
            {
                "id": 3, "category": 3,
                "title": "Ordenar logs",
                "description": "Ordena un archivo de logs por timestamp de forma ascendente.",
                "expected_input": "server.log",
                "expected_output": "server_sorted.log",
                "hint": "sort",
                "solved": false
            }
        ];
    }
}

// ── Difficulty map ─────────────────────────────────────
const DIFFICULTY = {
    1: { label: 'Fácil',   bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
    2: { label: 'Medio',   bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
    3: { label: 'Difícil', bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
};

// ── Build card clone ───────────────────────────────────
function buildCard(e) {
    const clone = cardTemplate.content.cloneNode(true);
    const card  = clone.querySelector('.card');
    card.setAttribute('data-id', e.id);

    // ID
    clone.querySelector('.card-id').textContent = `#${e.id}`;

    // Difficulty tag
    const diff = DIFFICULTY[e.category] || { label: `Nivel ${e.category}`, bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' };
    const diffEl = clone.querySelector('.card-difficulty');
    diffEl.textContent = diff.label;
    diffEl.style.background = diff.bg;
    diffEl.style.color = diff.color;

    // Title
    clone.querySelector('.card-title').textContent = e.title;

    // Description
    clone.querySelector('.card-description').textContent = e.description || '';

    // IO
    clone.querySelector('.card-input').textContent  = e.expected_input  || '—';
    clone.querySelector('.card-output').textContent = e.expected_output || '—';

    // Solved badge
    const markBtn = clone.querySelector('.btn.mark');
    applyBadgeStyle(markBtn, e.solved);

    // Hint toggle
    const btnHint  = clone.querySelector('.btn-hint');
    const hintText = clone.querySelector('.hint-text');
    hintText.textContent = e.hint || 'Revisa la documentación técnica sobre este tema.';

    btnHint.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const open = hintText.style.display === 'block';
        hintText.style.display = open ? 'none' : 'block';
        btnHint.innerHTML = open ? '💡 Mostrar pista' : 'Ocultar pista';
    });

    return clone;
}

function applyBadgeStyle(btn, solved) {
    if (solved) {
        btn.textContent = '✓ Resuelto';
        btn.style.background = 'rgba(52,211,153,0.12)';
        btn.style.color = '#34d399';
    } else {
        btn.textContent = 'Pendiente';
        btn.style.background = 'rgba(248,113,113,0.12)';
        btn.style.color = '#f87171';
    }
}

// ── Modal ──────────────────────────────────────────────
function openModal(e) {
    modalBody.innerHTML = '';
    const clone = buildCard(e);
    modalBody.appendChild(clone);
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (ev) => {
    if (ev.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeModal();
});

// ── Render ─────────────────────────────────────────────
function render(exercises) {
    if (!cardTemplate) return;

    const items = exercises.filter(e =>
        currentCategory === 'any' || e.category === Number(currentCategory)
    );

    if (items.length === 0) {
        listEl.innerHTML = '<div class="empty">No se encontraron ejercicios.</div>';
        return;
    }

    listEl.innerHTML = '';

    items.forEach(e => {
        const clone = buildCard(e);

        // Click en la tarjeta → abre modal
        const card = clone.querySelector('.card');
        card.addEventListener('click', () => openModal(e));

        // Evitar que el hint-btn propague al card (ya tiene stopPropagation dentro)
        listEl.appendChild(clone);
    });
}

// ── Patch badge sin re-render ───────────────────────────
function patchSolvedBadge(cardEl, solved) {
    const btn = cardEl.querySelector('.btn.mark');
    if (btn) applyBadgeStyle(btn, solved);
}

// ── Init ───────────────────────────────────────────────
(async () => {
    // Cargar template
    try {
        const res = await fetch('static/task_card.html');
        if (!res.ok) throw new Error();
        const html = await res.text();
        const doc  = new DOMParser().parseFromString(html, 'text/html');
        cardTemplate = doc.getElementById('task-card-template');
    } catch {
        console.error('No se pudo cargar task_card.html');
    }

    const exercises = await fetchExercises();
    render(exercises);
    updatePointsHint('any'); // estado inicial

    // Pill buttons — filtro por categoría
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            updatePointsHint(currentCategory);
            render(exercises);
        });
    });

    // Polling cada 10 s — parchea solo badges que cambiaron
    const POLL_INTERVAL = 10_000;
    setInterval(async () => {
        let fresh;
        try {
            const res = await fetch(apiURL);
            if (!res.ok) return;
            fresh = await res.json();
        } catch { return; }

        fresh.forEach(freshEx => {
            const cached = exercises.find(ex => ex.id === freshEx.id);
            if (!cached || cached.solved === freshEx.solved) return;
            cached.solved = freshEx.solved;
            const cardEl = listEl.querySelector(`.card[data-id="${freshEx.id}"]`);
            if (cardEl) patchSolvedBadge(cardEl, freshEx.solved);
        });
    }, POLL_INTERVAL);
})();