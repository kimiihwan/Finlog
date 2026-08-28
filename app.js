/**
 * Finlog - Glassmorphic Financial Tracker Core Logic
 * Supports local state management with GCP Firestore API compatibility
 */

// Category Definitions with Glassmorphic Color Palette
const CATEGORY_COLORS = {
  '식비': '#f43f5e',     // Neon Rose
  '교통': '#3b82f6',     // Bright Blue
  '쇼핑': '#ec4899',     // Pink
  '주거/통신': '#8b5cf6', // Violet
  '문화/취미': '#06b6d4', // Cyan
  '급여/수입': '#10b981', // Emerald Green
  '기타': '#f59e0b'      // Amber
};

// Initial Mock Data (If LocalStorage is empty)
const INITIAL_TRANSACTIONS = [
  { id: '1', date: '2026-08-28', type: 'expense', category: '식비', memo: '스타벅스 자바칩 프라푸치노', amount: 6800, payment: '신한 체크카드' },
  { id: '2', date: '2026-08-25', type: 'income', category: '급여/수입', memo: '8월 월급 수입', amount: 3500000, payment: '카카오뱅크 계좌' },
  { id: '3', date: '2026-08-24', type: 'expense', category: '쇼핑', memo: '무신사 여름 셔츠 구매', amount: 59000, payment: '신한 체크카드' },
  { id: '4', date: '2026-08-20', type: 'expense', category: '주거/통신', memo: 'SKT 통신비 자동이체', amount: 65000, payment: '카카오뱅크 계좌' },
  { id: '5', date: '2026-08-18', type: 'expense', category: '교통', memo: '지하철/버스 대중교통 후불', amount: 72000, payment: '신한 체크카드' },
  { id: '6', date: '2026-08-15', type: 'expense', category: '문화/취미', memo: 'CGV 영화 관람 및 팝콘', amount: 32000, payment: '현금' }
];

class TransactionStore {
  constructor() {
    this.storageKey = 'finlog_transactions_v1';
    this.budgetKey = 'finlog_monthly_budget_v1';
    this.transactions = this.loadTransactions();
    this.monthlyBudget = parseFloat(localStorage.getItem(this.budgetKey)) || 1500000;
  }

  loadTransactions() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_TRANSACTIONS;
    }
  }

  saveTransactions() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
  }

  addTransaction(item) {
    item.id = Date.now().toString();
    this.transactions.unshift(item);
    this.saveTransactions();
    return item;
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.saveTransactions();
  }

  getFilteredTransactions({ periodMonth, type, category, searchKeyword }) {
    return this.transactions.filter(t => {
      // Period filter (YYYY-MM)
      if (periodMonth && !t.date.startsWith(periodMonth)) return false;
      // Type filter
      if (type && type !== 'all' && t.type !== type) return false;
      // Category filter
      if (category && category !== 'all' && t.category !== category) return false;
      // Search Keyword
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        const matchesMemo = t.memo.toLowerCase().includes(kw);
        const matchesCategory = t.category.toLowerCase().includes(kw);
        const matchesPayment = t.payment.toLowerCase().includes(kw);
        if (!matchesMemo && !matchesCategory && !matchesPayment) return false;
      }
      return true;
    });
  }

  calculateSummary(periodMonth) {
    const monthItems = this.transactions.filter(t => t.date.startsWith(periodMonth));
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    monthItems.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
        incomeCount++;
      } else {
        totalExpense += t.amount;
        expenseCount++;
      }
    });

    const netBalance = 8450000 + 3200000 + (totalIncome - totalExpense);
    const remainingBudget = Math.max(0, this.monthlyBudget - totalExpense);
    const budgetProgress = Math.min(100, (totalExpense / this.monthlyBudget) * 100);

    return {
      netBalance,
      totalIncome,
      totalExpense,
      incomeCount,
      expenseCount,
      remainingBudget,
      budgetProgress
    };
  }
}

// UI Controller Class
class FinlogUI {
  constructor() {
    this.store = new TransactionStore();
    this.currentDate = new Date(2026, 7, 1); // August 2026
    this.activeType = 'expense';

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    // Navigation & Tabs
    this.navItems = document.querySelectorAll('.nav-item');
    this.tabViews = document.querySelectorAll('.tab-view');

    // Header & Controls
    this.currentPeriodDisplay = document.getElementById('currentPeriodDisplay');
    this.prevMonthBtn = document.getElementById('prevMonth');
    this.nextMonthBtn = document.getElementById('nextMonth');
    this.searchInput = document.getElementById('searchInput');

    // Summary Elements
    this.totalBalanceEl = document.getElementById('totalBalance');
    this.monthlyIncomeEl = document.getElementById('monthlyIncome');
    this.monthlyExpenseEl = document.getElementById('monthlyExpense');
    this.incomeCountEl = document.getElementById('incomeCount');
    this.expenseCountEl = document.getElementById('expenseCount');
    this.remainingBudgetEl = document.getElementById('remainingBudget');
    this.budgetProgressFill = document.getElementById('budgetProgressFill');

    // Tables & Charts
    this.recentTransactionsBody = document.getElementById('recentTransactionsBody');
    this.fullTransactionsBody = document.getElementById('fullTransactionsBody');
    this.typeFilter = document.getElementById('typeFilter');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.categoryDonutChart = document.getElementById('categoryDonutChart');
    this.donutSlicesGroup = document.getElementById('donutSlices');
    this.categoryLegend = document.getElementById('categoryLegend');
    this.chartTotalAmount = document.getElementById('chartTotalAmount');

    // Modal Elements
    this.addModal = document.getElementById('addModal');
    this.btnOpenAddModal = document.getElementById('btnOpenAddModal');
    this.btnCloseModal = document.getElementById('btnCloseModal');
    this.btnCancelModal = document.getElementById('btnCancelModal');
    this.addForm = document.getElementById('addTransactionForm');
    this.toggleBtns = document.querySelectorAll('.type-toggle-buttons .toggle-btn');
    this.inputDate = document.getElementById('inputDate');

    // Set Default Modal Date to today
    this.inputDate.valueAsDate = new Date();
  }

  bindEvents() {
    // Tab switching
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    document.getElementById('linkToAllTransactions')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('transactions');
    });

    // Month Navigation
    this.prevMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });

    this.nextMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });

    // Search Input
    this.searchInput.addEventListener('input', () => {
      this.renderTables();
    });

    // Table Filters
    this.typeFilter?.addEventListener('change', () => this.renderTables());
    this.categoryFilter?.addEventListener('change', () => this.renderTables());

    // Modal Control
    this.btnOpenAddModal.addEventListener('click', () => this.openModal());
    this.btnCloseModal.addEventListener('click', () => this.closeModal());
    this.btnCancelModal.addEventListener('click', () => this.closeModal());

    this.addModal.addEventListener('click', (e) => {
      if (e.target === this.addModal) this.closeModal();
    });

    // Income/Expense Toggle in Modal
    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeType = btn.getAttribute('data-type');
      });
    });

    // Submit Form
    this.addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddSubmit();
    });
  }

  getFormattedPeriod() {
    const year = this.currentDate.getFullYear();
    const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  switchTab(tabId) {
    this.navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.tabViews.forEach(view => {
      if (view.id === tabId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });
  }

  openModal() {
    this.addModal.classList.add('active');
  }

  closeModal() {
    this.addModal.classList.remove('active');
    this.addForm.reset();
    this.inputDate.valueAsDate = new Date();
  }

  handleAddSubmit() {
    const amount = parseFloat(document.getElementById('inputAmount').value);
    const category = document.getElementById('inputCategory').value;
    const date = document.getElementById('inputDate').value;
    const memo = document.getElementById('inputMemo').value;
    const payment = document.getElementById('inputPayment').value;

    if (!amount || !memo || !date) return;

    this.store.addTransaction({
      type: this.activeType,
      amount,
      category,
      date,
      memo,
      payment
    });

    this.closeModal();
    this.render();
  }

  formatCurrency(num) {
    return '₩' + num.toLocaleString('ko-KR');
  }

  render() {
    const periodMonth = this.getFormattedPeriod();
    const [yearStr, monthStr] = periodMonth.split('-');
    this.currentPeriodDisplay.textContent = `${yearStr}년 ${parseInt(monthStr)}월`;

    // Render Metrics
    const summary = this.store.calculateSummary(periodMonth);
    this.totalBalanceEl.textContent = this.formatCurrency(summary.netBalance);
    this.monthlyIncomeEl.textContent = this.formatCurrency(summary.totalIncome);
    this.monthlyExpenseEl.textContent = this.formatCurrency(summary.totalExpense);
    this.incomeCountEl.textContent = `${summary.incomeCount}건 입력됨`;
    this.expenseCountEl.textContent = `${summary.expenseCount}건 입력됨`;
    this.remainingBudgetEl.textContent = this.formatCurrency(summary.remainingBudget);
    this.budgetProgressFill.style.width = `${summary.budgetProgress}%`;

    this.renderTables();
    this.renderChart(periodMonth, summary.totalExpense);
    this.renderAnalytics(periodMonth);
  }

  renderTables() {
    const periodMonth = this.getFormattedPeriod();
    const searchKeyword = this.searchInput.value;
    const typeVal = this.typeFilter?.value || 'all';
    const catVal = this.categoryFilter?.value || 'all';

    const items = this.store.getFilteredTransactions({
      periodMonth,
      type: typeVal,
      category: catVal,
      searchKeyword
    });

    // Recent items (top 5)
    this.renderTableRows(this.recentTransactionsBody, items.slice(0, 5));
    // Full items
    this.renderTableRows(this.fullTransactionsBody, items);
  }

  renderTableRows(container, items) {
    if (!container) return;
    if (items.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="7" class="text-center" style="padding: 32px; color: var(--text-muted);">
            등록된 거래 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <tr>
        <td>${item.date}</td>
        <td>
          <span class="badge-tag ${item.type}">
            ${item.type === 'income' ? '수입' : '지출'}
          </span>
        </td>
        <td><strong>${item.category}</strong></td>
        <td>${item.memo}</td>
        <td style="color: var(--text-muted);">${item.payment}</td>
        <td class="text-right ${item.type === 'income' ? 'text-income' : 'text-expense'}" style="font-weight: 700;">
          ${item.type === 'income' ? '+' : '-'}${this.formatCurrency(item.amount)}
        </td>
        <td class="text-center">
          <button class="btn-delete" onclick="window.finlogApp.deleteItem('${item.id}')">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  deleteItem(id) {
    if (confirm('이 거래 내역을 삭제하시겠습니까?')) {
      this.store.deleteTransaction(id);
      this.render();
    }
  }

  renderChart(periodMonth, totalExpense) {
    const items = this.store.getFilteredTransactions({ periodMonth, type: 'expense' });
    this.chartTotalAmount.textContent = this.formatCurrency(totalExpense);

    // Group expenses by category
    const catMap = {};
    items.forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    const categoryData = Object.keys(catMap).map(cat => ({
      category: cat,
      amount: catMap[cat],
      percentage: totalExpense > 0 ? (catMap[cat] / totalExpense) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    // SVG Donut Slices calculation
    const circumference = 2 * Math.PI * 38; // 238.76
    let strokeDashoffsetAcc = 0;
    let slicesHTML = '';

    categoryData.forEach(item => {
      const color = CATEGORY_COLORS[item.category] || '#94a3b8';
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const offset = -strokeDashoffsetAcc;
      strokeDashoffsetAcc += (item.percentage / 100) * circumference;

      slicesHTML += `
        <circle cx="50" cy="50" r="38" class="chart-slice"
          stroke="${color}"
          stroke-dasharray="${strokeDasharray}"
          stroke-dashoffset="${offset}">
        </circle>
      `;
    });

    this.donutSlicesGroup.innerHTML = slicesHTML;

    // Render Legend
    this.categoryLegend.innerHTML = categoryData.map(item => `
      <div class="legend-item">
        <div class="legend-info">
          <span class="legend-color" style="background: ${CATEGORY_COLORS[item.category] || '#94a3b8'};"></span>
          <span>${item.category}</span>
        </div>
        <div>
          <strong>${this.formatCurrency(item.amount)}</strong>
          <span style="font-size: 11px; color: var(--text-muted); margin-left: 4px;">(${item.percentage.toFixed(1)}%)</span>
        </div>
      </div>
    `).join('');
  }

  renderAnalytics(periodMonth) {
    const analyticsEl = document.getElementById('analyticsContent');
    if (!analyticsEl) return;

    const items = this.store.getFilteredTransactions({ periodMonth, type: 'expense' });
    const catMap = {};
    items.forEach(t => catMap[t.category] = (catMap[t.category] || 0) + t.amount);

    analyticsEl.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
        ${Object.keys(catMap).map(cat => `
          <div class="glass-card" style="padding: 16px;">
            <span style="font-size: 13px; color: var(--text-muted);">${cat} 지출</span>
            <h3 style="font-size: 20px; margin-top: 4px; color: ${CATEGORY_COLORS[cat] || '#fff'}">
              ${this.formatCurrency(catMap[cat])}
            </h3>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  window.finlogApp = new FinlogUI();
});
