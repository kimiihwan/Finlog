/**
 * Finlog - Glassmorphic Financial Tracker Core Logic
 * Version: 1.3.0 (GCP Firebase Cloud Firestore Integration Edition)
 */

const APP_VERSION = '1.3.0';

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

// Initial Mock Data
const INITIAL_TRANSACTIONS = [
  { id: '1', date: '2026-08-28', type: 'expense', category: '식비', memo: '스타벅스 자바칩 프라푸치노', amount: 6800, payment: '신한 체크카드' },
  { id: '2', date: '2026-08-25', type: 'income', category: '급여/수입', memo: '8월 월급 수입', amount: 3500000, payment: '카카오뱅크 계좌' },
  { id: '3', date: '2026-08-24', type: 'expense', category: '쇼핑', memo: '무신사 여름 셔츠 구매', amount: 59000, payment: '신한 체크카드' },
  { id: '4', date: '2026-08-20', type: 'expense', category: '주거/통신', memo: 'SKT 통신비 자동이체', amount: 65000, payment: '카카오뱅크 계좌' },
  { id: '5', date: '2026-08-18', type: 'expense', category: '교통', memo: '지하철/버스 대중교통 후불', amount: 72000, payment: '신한 체크카드' },
  { id: '6', date: '2026-08-15', type: 'expense', category: '문화/취미', memo: 'CGV 영화 관람 및 팝콘', amount: 32000, payment: '현금' }
];

// Initial Recurring Items
const INITIAL_RECURRING = [
  { id: 'r1', day: 25, category: '주거/통신', memo: 'SKT 통신비 자동이체', amount: 65000, payment: '카카오뱅크 계좌' },
  { id: 'r2', day: 14, category: '문화/취미', memo: '넷플릭스 4K 프리미엄 구독', amount: 17000, payment: '신한 체크카드' },
  { id: 'r3', day: 1, category: '주거/통신', memo: '월세 자동이체', amount: 550000, payment: '카카오뱅크 계좌' }
];

class TransactionStore {
  constructor() {
    this.storageKey = 'finlog_transactions_v1';
    this.recurringKey = 'finlog_recurring_v1';
    this.budgetKey = 'finlog_monthly_budget_v1';
    this.fbConfigKey = 'finlog_firebase_config_v1';
    
    this.transactions = this.loadTransactions();
    this.recurringItems = this.loadRecurring();
    this.monthlyBudget = parseFloat(localStorage.getItem(this.budgetKey)) || 1500000;
    this.firebaseConfig = this.loadFirebaseConfig();
    this.db = null;
    this.isCloudEnabled = false;

    this.initFirebase();
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

  loadRecurring() {
    const data = localStorage.getItem(this.recurringKey);
    if (!data) {
      localStorage.setItem(this.recurringKey, JSON.stringify(INITIAL_RECURRING));
      return INITIAL_RECURRING;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_RECURRING;
    }
  }

  saveRecurring() {
    localStorage.setItem(this.recurringKey, JSON.stringify(this.recurringItems));
  }

  loadFirebaseConfig() {
    const data = localStorage.getItem(this.fbConfigKey);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  saveFirebaseConfig(cfg) {
    localStorage.setItem(this.fbConfigKey, JSON.stringify(cfg));
    this.firebaseConfig = cfg;
    this.initFirebase();
  }

  clearFirebaseConfig() {
    localStorage.removeItem(this.fbConfigKey);
    this.firebaseConfig = null;
    this.isCloudEnabled = false;
    location.reload();
  }

  initFirebase() {
    if (typeof firebase === 'undefined' || !this.firebaseConfig || !this.firebaseConfig.apiKey) {
      this.isCloudEnabled = false;
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(this.firebaseConfig);
      }
      this.db = firebase.firestore();
      this.isCloudEnabled = true;
      console.log('🔥 GCP Firebase Cloud Firestore Successfully Connected!');

      // Listen for Firestore real-time updates
      this.db.collection('transactions').onSnapshot((snapshot) => {
        const cloudItems = [];
        snapshot.forEach((doc) => {
          cloudItems.push({ id: doc.id, ...doc.data() });
        });
        if (cloudItems.length > 0) {
          // Sort by date descending
          cloudItems.sort((a, b) => new Date(b.date) - new Date(a.date));
          this.transactions = cloudItems;
          this.saveTransactions();
          if (window.finlogApp) window.finlogApp.render();
        }
      }, (error) => {
        console.warn('Firebase sync warning:', error);
      });
    } catch (err) {
      console.error('Firebase Init Error:', err);
      this.isCloudEnabled = false;
    }
  }

  addTransaction(item) {
    item.id = Date.now().toString();
    this.transactions.unshift(item);
    this.saveTransactions();

    if (this.isCloudEnabled && this.db) {
      this.db.collection('transactions').doc(item.id).set(item).catch(err => {
        console.error('Firestore save error:', err);
      });
    }
    return item;
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.saveTransactions();

    if (this.isCloudEnabled && this.db) {
      this.db.collection('transactions').doc(id).delete().catch(err => {
        console.error('Firestore delete error:', err);
      });
    }
  }

  addRecurring(item) {
    item.id = 'r_' + Date.now().toString();
    this.recurringItems.push(item);
    this.saveRecurring();
    return item;
  }

  deleteRecurring(id) {
    this.recurringItems = this.recurringItems.filter(r => r.id !== id);
    this.saveRecurring();
  }

  applyRecurringToCurrentMonth(recurringId, periodMonth) {
    const rec = this.recurringItems.find(r => r.id === recurringId);
    if (!rec) return;

    const dayStr = String(rec.day).padStart(2, '0');
    const date = `${periodMonth}-${dayStr}`;

    this.addTransaction({
      type: 'expense',
      category: rec.category,
      memo: `[고정지출] ${rec.memo}`,
      amount: rec.amount,
      payment: rec.payment,
      date
    });
  }

  getFilteredTransactions({ periodMonth, type, category, searchKeyword }) {
    return this.transactions.filter(t => {
      if (periodMonth && !t.date.startsWith(periodMonth)) return false;
      if (type && type !== 'all' && t.type !== type) return false;
      if (category && category !== 'all' && t.category !== category) return false;
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

  exportToCSV() {
    if (this.transactions.length === 0) {
      alert('내보낼 거래 내역이 없습니다.');
      return;
    }
    const headers = ['id', 'date', 'type', 'category', 'memo', 'amount', 'payment'];
    const rows = this.transactions.map(t => [
      t.id,
      t.date,
      t.type,
      t.category,
      `"${t.memo.replace(/"/g, '""')}"`,
      t.amount,
      t.payment
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Finlog_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportToSQL() {
    if (this.transactions.length === 0) {
      alert('내보낼 거래 내역이 없습니다.');
      return;
    }

    let sql = `-- Finlog Transaction Dataset (PostgreSQL / SQLite Compatible)\n`;
    sql += `-- Generated At: ${new Date().toISOString()}\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS transactions (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  date DATE NOT NULL,\n`;
    sql += `  type VARCHAR(16) NOT NULL,\n`;
    sql += `  category VARCHAR(32) NOT NULL,\n`;
    sql += `  memo TEXT,\n`;
    sql += `  amount NUMERIC(12, 2) NOT NULL,\n`;
    sql += `  payment_method VARCHAR(64),\n`;
    sql += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    this.transactions.forEach(t => {
      const escapedMemo = t.memo.replace(/'/g, "''");
      sql += `INSERT INTO transactions (id, date, type, category, memo, amount, payment_method) VALUES ('${t.id}', '${t.date}', '${t.type}', '${t.category}', '${escapedMemo}', ${t.amount}, '${t.payment}');\n`;
    });

    const blob = new Blob([sql], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Finlog_DB_Dump_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return 0;

    let addedCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 5) {
        const date = parts[0].trim();
        const typeStr = parts[1].trim();
        const category = parts[2].trim();
        const memo = parts[3].trim().replace(/^"|"$/g, '');
        const amount = parseFloat(parts[4]);
        const payment = parts[5] ? parts[5].trim() : '기타';

        if (date && amount) {
          const newItem = {
            id: 'imp_' + Date.now() + '_' + i,
            date,
            type: typeStr === '수입' || typeStr === 'income' ? 'income' : 'expense',
            category: category || '기타',
            memo: memo || '불러온 거래',
            amount: amount || 0,
            payment: payment || '기타'
          };
          this.transactions.push(newItem);
          if (this.isCloudEnabled && this.db) {
            this.db.collection('transactions').doc(newItem.id).set(newItem);
          }
          addedCount++;
        }
      }
    }
    this.saveTransactions();
    return addedCount;
  }
}

// UI Controller Class
class FinlogUI {
  constructor() {
    this.store = new TransactionStore();
    this.currentDate = new Date(2026, 7, 1);
    this.activeType = 'expense';

    this.initElements();
    this.bindEvents();
    this.render();
    this.updateCloudStatusUI();
  }

  initElements() {
    this.navItems = document.querySelectorAll('.nav-item');
    this.tabViews = document.querySelectorAll('.tab-view');

    this.currentPeriodDisplay = document.getElementById('currentPeriodDisplay');
    this.prevMonthBtn = document.getElementById('prevMonth');
    this.nextMonthBtn = document.getElementById('nextMonth');
    this.searchInput = document.getElementById('searchInput');
    this.btnExportCsv = document.getElementById('btnExportCsv');
    this.btnExportCsvSettings = document.getElementById('btnExportCsvSettings');
    this.btnExportSql = document.getElementById('btnExportSql');
    this.btnExportSqlSettings = document.getElementById('btnExportSqlSettings');
    this.importCsvInput = document.getElementById('importCsvInput');

    // Cloud Status Sidebar
    this.cloudStatusDot = document.getElementById('cloudStatusDot');
    this.cloudStatusTitle = document.getElementById('cloudStatusTitle');
    this.cloudStatusDesc = document.getElementById('cloudStatusDesc');
    this.btnSyncCloudSidebar = document.getElementById('btnSyncCloudSidebar');

    // Firebase Settings UI
    this.cfgApiKey = document.getElementById('cfgApiKey');
    this.cfgProjectId = document.getElementById('cfgProjectId');
    this.cfgAppId = document.getElementById('cfgAppId');
    this.cfgAuthDomain = document.getElementById('cfgAuthDomain');
    this.btnSaveFirebaseConfig = document.getElementById('btnSaveFirebaseConfig');
    this.btnClearFirebaseConfig = document.getElementById('btnClearFirebaseConfig');

    this.totalBalanceEl = document.getElementById('totalBalance');
    this.monthlyIncomeEl = document.getElementById('monthlyIncome');
    this.monthlyExpenseEl = document.getElementById('monthlyExpense');
    this.incomeCountEl = document.getElementById('incomeCount');
    this.expenseCountEl = document.getElementById('expenseCount');
    this.remainingBudgetEl = document.getElementById('remainingBudget');
    this.budgetProgressFill = document.getElementById('budgetProgressFill');

    this.recentTransactionsBody = document.getElementById('recentTransactionsBody');
    this.fullTransactionsBody = document.getElementById('fullTransactionsBody');
    this.recurringTableBody = document.getElementById('recurringTableBody');
    this.typeFilter = document.getElementById('typeFilter');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.categoryDonutChart = document.getElementById('categoryDonutChart');
    this.donutSlicesGroup = document.getElementById('donutSlices');
    this.categoryLegend = document.getElementById('categoryLegend');
    this.chartTotalAmount = document.getElementById('chartTotalAmount');

    this.addModal = document.getElementById('addModal');
    this.btnOpenAddModal = document.getElementById('btnOpenAddModal');
    this.btnCloseModal = document.getElementById('btnCloseModal');
    this.btnCancelModal = document.getElementById('btnCancelModal');
    this.addForm = document.getElementById('addTransactionForm');
    this.toggleBtns = document.querySelectorAll('.type-toggle-buttons .toggle-btn');
    this.inputDate = document.getElementById('inputDate');

    this.recurringModal = document.getElementById('recurringModal');
    this.btnOpenRecurringModal = document.getElementById('btnOpenRecurringModal');
    this.btnCloseRecurringModal = document.getElementById('btnCloseRecurringModal');
    this.btnCancelRecurringModal = document.getElementById('btnCancelRecurringModal');
    this.addRecurringForm = document.getElementById('addRecurringForm');

    if (this.inputDate) this.inputDate.valueAsDate = new Date();

    // Fill existing config into inputs
    if (this.store.firebaseConfig) {
      if (this.cfgApiKey) this.cfgApiKey.value = this.store.firebaseConfig.apiKey || '';
      if (this.cfgProjectId) this.cfgProjectId.value = this.store.firebaseConfig.projectId || '';
      if (this.cfgAppId) this.cfgAppId.value = this.store.firebaseConfig.appId || '';
      if (this.cfgAuthDomain) this.cfgAuthDomain.value = this.store.firebaseConfig.authDomain || '';
    }
  }

  bindEvents() {
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

    this.btnSyncCloudSidebar?.addEventListener('click', () => {
      this.switchTab('settings');
    });

    this.prevMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });

    this.nextMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });

    this.searchInput.addEventListener('input', () => this.renderTables());
    this.typeFilter?.addEventListener('change', () => this.renderTables());
    this.categoryFilter?.addEventListener('change', () => this.renderTables());

    // CSV & SQL Export / Import
    this.btnExportCsv?.addEventListener('click', () => this.store.exportToCSV());
    this.btnExportCsvSettings?.addEventListener('click', () => this.store.exportToCSV());
    this.btnExportSql?.addEventListener('click', () => this.store.exportToSQL());
    this.btnExportSqlSettings?.addEventListener('click', () => this.store.exportToSQL());

    // Firebase Config Actions (v1.3.0)
    this.btnSaveFirebaseConfig?.addEventListener('click', () => {
      const apiKey = this.cfgApiKey.value.trim();
      const projectId = this.cfgProjectId.value.trim();
      const appId = this.cfgAppId.value.trim();
      const authDomain = this.cfgAuthDomain.value.trim() || `${projectId}.firebaseapp.com`;

      if (!apiKey || !projectId) {
        alert('apiKey와 projectId는 필수 입력 항목입니다.');
        return;
      }

      this.store.saveFirebaseConfig({ apiKey, projectId, appId, authDomain });
      alert('GCP Firebase DB 설정이 성공적으로 저장되었습니다!');
      this.updateCloudStatusUI();
    });

    this.btnClearFirebaseConfig?.addEventListener('click', () => {
      if (confirm('Firebase DB 연동을 해제하시겠습니까?')) {
        this.store.clearFirebaseConfig();
      }
    });

    this.importCsvInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const count = this.store.importFromCSV(evt.target.result);
        alert(`${count}건의 거래 내역을 성공적으로 불러왔습니다.`);
        this.render();
      };
      reader.readAsText(file, 'UTF-8');
    });

    this.btnOpenAddModal.addEventListener('click', () => this.openModal(this.addModal));
    this.btnCloseModal.addEventListener('click', () => this.closeModal(this.addModal));
    this.btnCancelModal.addEventListener('click', () => this.closeModal(this.addModal));

    this.btnOpenRecurringModal?.addEventListener('click', () => this.openModal(this.recurringModal));
    this.btnCloseRecurringModal?.addEventListener('click', () => this.closeModal(this.recurringModal));
    this.btnCancelRecurringModal?.addEventListener('click', () => this.closeModal(this.recurringModal));

    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeType = btn.getAttribute('data-type');
      });
    });

    this.addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddSubmit();
    });

    this.addRecurringForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddRecurringSubmit();
    });
  }

  updateCloudStatusUI() {
    if (this.store.isCloudEnabled) {
      if (this.cloudStatusDot) this.cloudStatusDot.className = 'status-dot online';
      if (this.cloudStatusTitle) this.cloudStatusTitle.textContent = 'GCP Firestore ON';
      if (this.cloudStatusDesc) this.cloudStatusDesc.textContent = '구글 클라우드 DB와 실시간으로 안전하게 동기화 중입니다.';
    } else {
      if (this.cloudStatusDot) this.cloudStatusDot.className = 'status-dot offline';
      if (this.cloudStatusTitle) this.cloudStatusTitle.textContent = 'Cloud Sync OFF';
      if (this.cloudStatusDesc) this.cloudStatusDesc.textContent = '로컬 저장 중. Firebase Config를 설정하면 구글 DB와 실시간 동기화됩니다.';
    }
  }

  getFormattedPeriod() {
    const year = this.currentDate.getFullYear();
    const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  switchTab(tabId) {
    this.navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) item.classList.add('active');
      else item.classList.remove('active');
    });

    this.tabViews.forEach(view => {
      if (view.id === tabId) view.classList.add('active');
      else view.classList.remove('active');
    });
  }

  openModal(modal) {
    modal?.classList.add('active');
  }

  closeModal(modal) {
    modal?.classList.remove('active');
    if (modal === this.addModal) {
      this.addForm.reset();
      this.inputDate.valueAsDate = new Date();
    } else if (modal === this.recurringModal) {
      this.addRecurringForm?.reset();
    }
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

    this.closeModal(this.addModal);
    this.render();
  }

  handleAddRecurringSubmit() {
    const day = parseInt(document.getElementById('recurringDay').value);
    const amount = parseFloat(document.getElementById('recurringAmount').value);
    const category = document.getElementById('recurringCategory').value;
    const memo = document.getElementById('recurringMemo').value;
    const payment = document.getElementById('recurringPayment').value;

    if (!day || !amount || !memo) return;

    this.store.addRecurring({ day, amount, category, memo, payment });
    this.closeModal(this.recurringModal);
    this.render();
  }

  formatCurrency(num) {
    return '₩' + num.toLocaleString('ko-KR');
  }

  render() {
    const periodMonth = this.getFormattedPeriod();
    const [yearStr, monthStr] = periodMonth.split('-');
    this.currentPeriodDisplay.textContent = `${yearStr}년 ${parseInt(monthStr)}월`;

    const summary = this.store.calculateSummary(periodMonth);
    this.totalBalanceEl.textContent = this.formatCurrency(summary.netBalance);
    this.monthlyIncomeEl.textContent = this.formatCurrency(summary.totalIncome);
    this.monthlyExpenseEl.textContent = this.formatCurrency(summary.totalExpense);
    this.incomeCountEl.textContent = `${summary.incomeCount}건 입력됨`;
    this.expenseCountEl.textContent = `${summary.expenseCount}건 입력됨`;
    this.remainingBudgetEl.textContent = this.formatCurrency(summary.remainingBudget);
    this.budgetProgressFill.style.width = `${summary.budgetProgress}%`;

    this.renderTables();
    this.renderRecurringTable();
    this.renderChart(periodMonth, summary.totalExpense);
    this.renderAnalytics(periodMonth);
    this.updateCloudStatusUI();
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

    this.renderTableRows(this.recentTransactionsBody, items.slice(0, 5));
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

  renderRecurringTable() {
    if (!this.recurringTableBody) return;
    const items = this.store.recurringItems;

    if (items.length === 0) {
      this.recurringTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center" style="padding: 32px; color: var(--text-muted);">
            등록된 고정 지출/구독 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    const periodMonth = this.getFormattedPeriod();
    this.recurringTableBody.innerHTML = items.map(item => `
      <tr>
        <td><strong>매월 ${item.day}일</strong></td>
        <td>${item.category}</td>
        <td>${item.memo}</td>
        <td style="color: var(--text-muted);">${item.payment}</td>
        <td class="text-right text-expense" style="font-weight: 700;">-${this.formatCurrency(item.amount)}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-glass" style="width: auto; padding: 4px 12px;" onclick="window.finlogApp.applyRecurring('${item.id}', '${periodMonth}')">
            <i class="ri-add-line"></i> 당월 반영
          </button>
        </td>
        <td class="text-center">
          <button class="btn-delete" onclick="window.finlogApp.deleteRecurring('${item.id}')">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  applyRecurring(id, periodMonth) {
    this.store.applyRecurringToCurrentMonth(id, periodMonth);
    alert('당월 거래 내역에 고정 지출이 반영되었습니다.');
    this.render();
  }

  deleteRecurring(id) {
    if (confirm('이 고정 지출 항목을 삭제하시겠습니까?')) {
      this.store.deleteRecurring(id);
      this.render();
    }
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

    const catMap = {};
    items.forEach(t => catMap[t.category] = (catMap[t.category] || 0) + t.amount);

    const categoryData = Object.keys(catMap).map(cat => ({
      category: cat,
      amount: catMap[cat],
      percentage: totalExpense > 0 ? (catMap[cat] / totalExpense) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    const circumference = 2 * Math.PI * 38;
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
