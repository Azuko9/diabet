// State management for user selections
let activeTab = 'p1';
let selections = {};

const pageRequiredRows = {
  'p1': ['p1-1', 'p1-2', 'p1-3', 'p1-4', 'p1-5'],
  'p2': ['p2-1', 'p2-2', 'p2-3', 'p2-4', 'p2-5'],
  'p3': ['p3-1', 'p3-2', 'p3-3'],
  'p4': ['p4-1', 'p4-2', 'p4-3', 'p4-4', 'p4-5'],
  'all': ['p1-1', 'p1-2', 'p1-3', 'p1-4', 'p1-5', 'p2-1', 'p2-2', 'p2-3', 'p2-4', 'p2-5', 'p3-1', 'p3-2', 'p3-3', 'p4-1', 'p4-2', 'p4-3', 'p4-4', 'p4-5']
};

const tabLabels = {
  'p1': 'Petit-Déjeuner',
  'p2': 'Déjeuner',
  'p3': 'Goûter',
  'p4': 'Dîner',
  'all': 'Vue d\'ensemble'
};

const tabBgClasses = {
  'p1': 'bg-amber-600 text-white',
  'p2': 'bg-emerald-600 text-white',
  'p3': 'bg-pink-600 text-white',
  'p4': 'bg-indigo-600 text-white',
  'all': 'bg-indigo-900 text-white'
};

// Switch between page tabs
function switchTab(tabId) {
  activeTab = tabId;

  // Update button styling
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.className = 'tab-btn px-3 py-1.5 rounded-md text-sm font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5';
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.className = `tab-btn px-3 py-1.5 rounded-md text-sm font-bold transition-all ${tabBgClasses[tabId]} shadow-xs flex items-center gap-1.5`;
  }

  // Update active badge in selection bar
  const badge = document.getElementById('active-page-badge');
  if (badge) {
    badge.textContent = tabLabels[tabId];
  }

  // Hide or show poster sections
  const pages = ['p1', 'p2', 'p3', 'p4'];
  pages.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (!el) return;
    if (tabId === 'all' || tabId === p) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  updateSelectionBar();
}

// Toggle card selection
function selectFoodCard(cardElement) {
  const row = cardElement.closest('tr');
  if (!row) return;

  const rowId = row.getAttribute('data-row');
  const rowLabel = row.getAttribute('data-label') || 'Aliment';
  const itemName = cardElement.getAttribute('data-name');

  // Check if already selected
  if (cardElement.classList.contains('selected')) {
    cardElement.classList.remove('selected');
    delete selections[rowId];
  } else {
    // Deselect sibling cards in the same row
    row.querySelectorAll('.food-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    selections[rowId] = {
      rowId: rowId,
      label: rowLabel,
      name: itemName,
      element: cardElement
    };
  }

  updateSelectionBar();
}

// Update choices and completion status in top header bar
function updateSelectionBar() {
  const container = document.getElementById('selected-items-container');
  const selectionBar = document.getElementById('selection-bar');
  const statusBadge = document.getElementById('completion-status-badge');
  const iconContainer = document.getElementById('complete-icon-container');
  const barTitle = document.getElementById('selection-bar-title');

  if (!container || !selectionBar) return;

  const requiredRows = pageRequiredRows[activeTab] || [];
  const currentTabSelectedCount = requiredRows.filter(rowId => selections[rowId]).length;
  const totalRequired = requiredRows.length;
  const isComplete = totalRequired > 0 && currentTabSelectedCount === totalRequired;

  // Update Bar Background & Status
  if (isComplete) {
    selectionBar.className = "bg-emerald-950 text-emerald-100 border-2 border-emerald-500 rounded-xl px-4 py-2.5 flex items-center gap-3 justify-between shadow-lg transition-all duration-300";
    if (barTitle) barTitle.className = "text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300";
    if (statusBadge) {
      statusBadge.className = "bg-emerald-800 text-emerald-100 text-xs sm:text-sm px-3 py-1 rounded-full font-black border border-emerald-500 shadow-sm";
      statusBadge.textContent = `Complet (${currentTabSelectedCount}/${totalRequired})`;
    }
    if (iconContainer) {
      iconContainer.innerHTML = `
        <span class="bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md animate-bounce">
          <i data-lucide="arrow-up-circle" class="w-5 h-5 stroke-[3]"></i> Complet !
        </span>
      `;
    }
  } else {
    selectionBar.className = "bg-rose-950 text-rose-100 border-2 border-rose-600 rounded-xl px-4 py-2.5 flex items-center gap-3 justify-between shadow-lg transition-all duration-300";
    if (barTitle) barTitle.className = "text-xs sm:text-sm font-black uppercase tracking-wider text-rose-300";
    if (statusBadge) {
      statusBadge.className = "bg-rose-900 text-rose-200 text-xs sm:text-sm px-3 py-1 rounded-full font-bold border border-rose-700";
      statusBadge.textContent = `Incomplet (${currentTabSelectedCount}/${totalRequired})`;
    }
    if (iconContainer) {
      iconContainer.innerHTML = `
        <span class="bg-rose-900/80 text-rose-200 text-xs sm:text-sm px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-rose-700">
          <i data-lucide="alert-circle" class="w-4 h-4"></i> En cours
        </span>
      `;
    }
  }

  // Re-render items in container
  const selectedKeys = Object.keys(selections);
  if (selectedKeys.length === 0) {
    container.innerHTML = `<span class="text-sm sm:text-base text-rose-200/80 italic font-semibold">Cliquez sur un aliment ci-dessous pour composer votre plateau...</span>`;
  } else {
    let html = '';
    selectedKeys.forEach(key => {
      const item = selections[key];
      const isItemActiveInCurrentTab = requiredRows.includes(item.rowId);
      const badgeBg = isItemActiveInCurrentTab ? "bg-emerald-900/90 text-emerald-100 border-emerald-400" : "bg-slate-800 text-slate-200 border-slate-600";

      html += `
        <div class="${badgeBg} border-2 text-sm sm:text-base px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 shadow-sm">
          <span class="font-black">${item.label}:</span>
          <span class="font-bold">${item.name}</span>
          <button onclick="removeItem('${item.rowId}')" class="ml-1 text-rose-300 hover:text-white font-black text-lg">&times;</button>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Remove single selection item from header bar
function removeItem(rowId) {
  if (selections[rowId] && selections[rowId].element) {
    selections[rowId].element.classList.remove('selected');
  }
  delete selections[rowId];
  updateSelectionBar();
}

// Clear all selections
function resetSelections() {
  document.querySelectorAll('.food-card.selected').forEach(card => {
    card.classList.remove('selected');
  });
  selections = {};
  updateSelectionBar();
}

// Initialize Lucide icons on load
window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  updateSelectionBar();
});
