// Guided flow state: which meal is being composed, which category (row) is
// currently shown, and the answers picked so far for that meal.
let currentMealId = null;
let currentRowIndex = 0;
let answers = {};

const ALL_PAGES = ['page-intro', 'page-meal-select', 'page-category', 'page-summary'];

function showPage(pageId) {
  ALL_PAGES.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== pageId);
  });
}

// Welcome screen -> meal choice
function goToMealSelect() {
  currentMealId = null;
  currentRowIndex = 0;
  answers = {};
  showPage('page-meal-select');
}

// Meal choice -> first category of that meal
function chooseMeal(mealId) {
  currentMealId = mealId;
  currentRowIndex = 0;
  answers = {};
  renderCategory();
  showPage('page-category');
}

// Render the current category's question and its 4 option cards
function renderCategory() {
  const meal = MEALS[currentMealId];
  const row = meal.rows[currentRowIndex];
  const answer = answers[row.id];

  const stepLabel = document.getElementById('category-step-label');
  if (stepLabel) {
    stepLabel.textContent = `${meal.emoji} ${meal.label} — Étape ${currentRowIndex + 1}/${meal.rows.length}`;
  }
  const title = document.getElementById('category-title');
  if (title) title.textContent = row.label;

  const grid = document.getElementById('category-options');
  if (grid) {
    grid.innerHTML = row.options.map((opt, i) => `
      <div class="food-card food-card-${opt.color}${answer && answer.optionIndex === i ? ' selected' : ''}"
           onclick="selectOption(${i})">
        <div class="card-icon">${opt.icon}</div>
        <div class="card-title">${opt.title}</div>
        ${opt.badge
          ? `<span class="card-badge card-badge-${opt.color}">${opt.badge}</span>`
          : `<div class="card-note">${opt.note}</div>`}
      </div>
    `).join('');
  }

  const nextBtn = document.getElementById('category-next-btn');
  if (nextBtn) {
    const isLast = currentRowIndex === meal.rows.length - 1;
    nextBtn.innerHTML = isLast
      ? 'Voir mon menu <i data-lucide="check" class="w-5 h-5"></i>'
      : 'Suivant <i data-lucide="arrow-right" class="w-5 h-5"></i>';
  }

  if (window.lucide) lucide.createIcons();
}

// Pick an option for the current category
function selectOption(optionIndex) {
  const meal = MEALS[currentMealId];
  const row = meal.rows[currentRowIndex];
  const opt = row.options[optionIndex];
  answers[row.id] = { rowLabel: row.label, name: opt.name, icon: opt.icon, optionIndex };
  renderCategory();
}

// Move to the next category, or to the summary if this was the last one.
// Blocked by a confirmation modal if nothing was picked for the current category.
function goNext() {
  const meal = MEALS[currentMealId];
  const row = meal.rows[currentRowIndex];

  if (!answers[row.id]) {
    showSkipModal(row);
    return;
  }

  advanceToNextCategory();
}

function advanceToNextCategory() {
  const meal = MEALS[currentMealId];
  if (currentRowIndex < meal.rows.length - 1) {
    currentRowIndex++;
    renderCategory();
  } else {
    renderSummary();
    showPage('page-summary');
  }
}

// "You haven't made a choice" confirmation modal
function showSkipModal(row) {
  const message = document.getElementById('skip-modal-message');
  if (message) message.textContent = row.warning;
  const modal = document.getElementById('skip-modal');
  if (modal) modal.classList.add('open');
}

function closeSkipModal() {
  const modal = document.getElementById('skip-modal');
  if (modal) modal.classList.remove('open');
}

// "Passer ce choix" — acknowledge the warning and move on without picking
function confirmSkip() {
  closeSkipModal();
  advanceToNextCategory();
}

// Move to the previous category, or back to meal choice if this was the first
function goPrev() {
  if (currentRowIndex === 0) {
    goToMealSelect();
  } else {
    currentRowIndex--;
    renderCategory();
  }
}

// Render the final recap of everything picked for the current meal
function renderSummary() {
  const meal = MEALS[currentMealId];
  const title = document.getElementById('summary-title');
  if (title) title.textContent = `Votre ${meal.label}`;

  const missingRows = meal.rows.filter(row => !answers[row.id]);

  const icon = document.getElementById('summary-icon');
  if (icon) icon.textContent = missingRows.length === 0 ? '🎉' : '⚠️';

  const status = document.getElementById('summary-status');
  if (status) {
    if (missingRows.length === 0) {
      status.innerHTML = `
        <div class="summary-banner summary-banner-ok">
          Bravo, vous avez composé un bon ${meal.label} !
        </div>
      `;
    } else {
      status.innerHTML = `
        <div class="summary-banner summary-banner-warning">
          <p>Attention, il vous manque un choix pour :</p>
          <ul class="list-disc list-inside mt-1">
            ${missingRows.map(row => `<li>${row.label}</li>`).join('')}
          </ul>
        </div>
      `;
    }
  }

  const list = document.getElementById('summary-list');
  if (list) {
    list.innerHTML = meal.rows.map(row => {
      const a = answers[row.id];
      if (!a) return '';
      return `
        <div class="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5">
          <span class="text-3xl">${a.icon}</span>
          <div class="text-left">
            <div class="text-xs font-black uppercase tracking-wide text-slate-500">${row.label}</div>
            <div class="font-extrabold text-slate-900">${a.name}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Back to the very first welcome screen
function restart() {
  currentMealId = null;
  currentRowIndex = 0;
  answers = {};
  showPage('page-intro');
}

window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});
