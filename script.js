const firebaseConfig = {
  apiKey: "AIzaSyCZH5LRgfHfb4PemAa-0yOYr3j3H2C3k",
  authDomain: "rupeeflowsync.firebaseapp.com",
  projectId: "rupeeflowsync",
  storageBucket: "rupeeflowsync.firebasestorage.app",
  messagingSenderId: "871999494809",
  appId: "1:871999494809:web:d2e2ebbdef1772aaab608",
  measurementId: "G-RRH5J2ZCZG"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log("Successfully logged in as:", result.user.displayName);
      if (typeof loadUserData === "function") { loadUserData(); }
    })
    .catch((error) => {
      console.error("Google Login Error:", error.message);
    });
}

function logoutUser() {
  firebase.auth().signOut();
}
// ==========================================
// 1. INITIALIZE FIREBASE FIRST
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCZH5LRgfHfb4PemAa-0yOYr3j3H2C3k",
  authDomain: "rupeeflowsync.firebaseapp.com",
  projectId: "rupeeflowsync",
  storageBucket: "rupeeflowsync.firebasestorage.app",
  messagingSenderId: "871999494809",
  appId: "1:871999494809:web:d2e2ebbdef1772aaab608",
  measurementId: "G-RRH5J2ZCZG"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// 2. GOOGLE LOGIN & LOGOUT FUNCTIONS
// ==========================================
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log("Successfully logged in as:", result.user.displayName);
      // Load or sync user data after successful login
      if (typeof loadUserData === "function") {
        loadUserData();
      }
    })
    .catch((error) => {
      console.error("Google Login Error:", error.message);
      alert("Login failed: " + error.message);
    });
}

function logoutUser() {
  firebase.auth().signOut()
    .then(() => {
      console.log("Logged out successfully");
    })
    .catch((error) => {
      console.error("Logout Error:", error.message);
    });
}

// ==========================================
// 3. APP CONSTANTS & VARIABLES
// ==========================================
const EXPENSE_CATEGORIES = [
  "Food & Snacks", "Transportation", "Shopping", "Education",
  "Mobile Recharge", "Bills & Electricity", "Entertainment",
  "Medical", "Groceries", "Rent", "Travel", "Other"
];
const INCOME_CATEGORIES = [
  "Salary", "Pocket Money", "Freelance Income",
  "Scholarship", "Interest", "Other Income"
];

const formatINR = (num) => {
  return "₹" + Number(num || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const EMPTY_DATA = {
  wallets: [
    { id: "w_cash", name: "Cash Wallet", balance: 0 },
    { id: "w_upi", name: "UPI Wallet", balance: 0 },
    { id: "w_slice", name: "Slice", balance: 0 },
    { id: "w_digital", name: "Digital Money", balance: 0 },
    { id: "w_food", name: "Food App", balance: 0 },
    { id: "w_ippb", name: "IPPB", balance: 0 },
    { id: "w_sbi", name: "SBI", balance: 0 },
    { id: "w_paytm", name: "Paytm Wallet", balance: 0 }
  ],
  transactions: [],
  dailyLimit: 0,
  monthlyBudget: 0,
  categoryLimits: {},
  emergencyFund: { target: 0, saved: 0 },
  savingsGoals: [],
  challenges: [],
  wishlist: [],
  notes: [],
  recurring: [],
  lending: [],
  reminderTime: "",
  darkMode: false,
  appPin: null
};

let state = JSON.parse(localStorage.getItem("rupeeFlowUltimateState")) || EMPTY_DATA;
let calendarDate = new Date();
let selectedCalDate = getTodayStr();
let charts = {};

function saveState() {
  localStorage.setItem("rupeeFlowUltimateState", JSON.stringify(state));
  renderAll();
}

function initLockScreen() {
  const lockScreen = document.getElementById("lockScreen");
  const lockTitle = document.getElementById("lockTitle");
  const lockSubtitle = document.getElementById("lockSubtitle");
  const pinSubmitBtn = document.getElementById("pinSubmitBtn");
  const pinInput = document.getElementById("pinInput");
  const pinError = document.getElementById("pinError");

  lockScreen.classList.remove("hidden");
  pinInput.value = "";
  pinError.style.display = "none";

  if (!state.appPin) {
    lockTitle.textContent = "Create Security PIN";
    lockSubtitle.textContent = "Set a 4-digit PIN to lock and protect your tracker";
    pinSubmitBtn.textContent = "Set PIN & Enter";
  } else {
    lockTitle.textContent = "Website Locked";
    lockSubtitle.textContent = "Enter your 4-digit PIN to unlock";
    pinSubmitBtn.textContent = "Unlock";
  }

  document.getElementById("pinForm").onsubmit = (e) => {
    e.preventDefault();
    const entered = pinInput.value.trim();
    if (!/^\d{4}$/.test(entered)) {
      pinError.textContent = "Enter exactly 4 digits.";
      pinError.style.display = "block";
      return;
    }

    if (!state.appPin) {
      state.appPin = entered;
      saveState();
      lockScreen.classList.add("hidden");
    } else if (entered === state.appPin) {
      lockScreen.classList.add("hidden");
    } else {
      pinError.textContent = "Incorrect PIN. Try again.";
      pinError.style.display = "block";
      pinInput.value = "";
    }
  };
}

function lockApp() { initLockScreen(); }

function changePin() {
  const current = prompt("Enter current 4-digit PIN:");
  if (current !== state.appPin) return alert("Incorrect current PIN.");
  const nextPin = prompt("Enter new 4-digit PIN:");
  if (nextPin && /^\d{4}$/.test(nextPin)) {
    state.appPin = nextPin;
    saveState();
    alert("✅ PIN updated successfully!");
  } else {
    alert("Invalid PIN. Must be 4 digits.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLockScreen();

  document.getElementById("currentDateDisplay").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  if (state.darkMode) document.body.classList.add("dark-mode");

  populateDropdowns();
  setupEventListeners();
  setupVoiceRecognition();
  startReminderChecker();
  renderAll();
});

function populateDropdowns() {
  const filterCat = document.getElementById("filterCategory");
  const catLimitSelect = document.getElementById("catLimitCategory");
  const recCat = document.getElementById("recCategory");

  EXPENSE_CATEGORIES.forEach(c => {
    catLimitSelect.innerHTML += `<option value="${c}">${c}</option>`;
    recCat.innerHTML += `<option value="${c}">${c}</option>`;
  });

  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].forEach(c => {
    filterCat.innerHTML += `<option value="${c}">${c}</option>`;
  });

  setTxTab("expense");
  refreshWalletDropdowns();
}

function refreshWalletDropdowns() {
  const txW = document.getElementById("txWallet");
  const fromW = document.getElementById("txFromWallet");
  const toW = document.getElementById("txToWallet");
  const filterW = document.getElementById("filterWallet");

  const opts = state.wallets.map(w => `<option value="${w.id}">${w.name} (${formatINR(w.balance)})</option>`).join("");
  txW.innerHTML = opts;
  fromW.innerHTML = opts;
  toW.innerHTML = opts;
  filterW.innerHTML = `<option value="all">All Wallets</option>` + state.wallets.map(w => `<option value="${w.id}">${w.name}</option>`).join("");
}

function setTxTab(type) {
  document.getElementById("txType").value = type;
  document.querySelectorAll(".tx-tab").forEach(b => b.classList.remove("active"));
  document.getElementById(`tab-${type}`).classList.add("active");

  const stdFields = document.getElementById("standardTxFields");
  const trfFields = document.getElementById("transferTxFields");
  const nameLabel = document.getElementById("txNameLabel");

  if (type === "transfer") {
    stdFields.classList.add("hidden");
    trfFields.classList.remove("hidden");
    nameLabel.textContent = "Transfer Description *";
  } else {
    stdFields.classList.remove("hidden");
    trfFields.classList.add("hidden");
    nameLabel.textContent = type === "income" ? "Income Source Title *" : "Expense Title *";

    const catSel = document.getElementById("txCategory");
    const list = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    catSel.innerHTML = list.map(c => `<option value="${c}">${c}</option>`).join("");
  }

  if (!document.getElementById("txDate").value) {
    document.getElementById("txDate").value = getTodayStr();
  }
}

function resetTxForm() {
  document.getElementById("txForm").reset();
  document.getElementById("txId").value = "";
  document.getElementById("txDate").value = getTodayStr();
  document.getElementById("txSubmitBtn").textContent = "Save Transaction";
  setTxTab("expense");
}

function setupEventListeners() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  document.getElementById("openSidebar").onclick = () => document.getElementById("sidebar").classList.add("open");
  document.getElementById("closeSidebar").onclick = () => document.getElementById("sidebar").classList.remove("open");

  document.getElementById("themeToggle").onclick = () => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle("dark-mode", state.darkMode);
    saveState();
  };

  document.getElementById("txForm").onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("txId").value;
    const type = document.getElementById("txType").value;
    const amount = parseFloat(document.getElementById("txAmount").value);
    const date = document.getElementById("txDate").value;
    const name = document.getElementById("txName").value.trim();
    const notes = document.getElementById("txNotes").value.trim();

    if (!name || amount <= 0) return alert("Enter valid title and amount.");

    const fileInput = document.getElementById("txReceipt");
    let receiptData = null;
    if (fileInput.files && fileInput.files[0]) {
      receiptData = await fileToBase64(fileInput.files[0]);
    }

    if (id) {
      const oldTx = state.transactions.find(t => t.id === Number(id));
      if (oldTx) {
        applyWalletEffect(oldTx, -1);
        if (!receiptData) receiptData = oldTx.receipt;
      }
    }

    let txObj = { id: id ? Number(id) : Date.now(), type, amount, date, name, notes, receipt: receiptData };

    if (type === "transfer") {
      const fromWalletId = document.getElementById("txFromWallet").value;
      const toWalletId = document.getElementById("txToWallet").value;
      if (fromWalletId === toWalletId) return alert("Select two different wallets for transfer.");
      txObj.fromWalletId = fromWalletId;
      txObj.toWalletId = toWalletId;
      txObj.category = "Wallet Transfer";
      txObj.method = "Internal Transfer";
    } else {
      txObj.category = document.getElementById("txCategory").value;
      txObj.walletId = document.getElementById("txWallet").value;
      txObj.method = document.getElementById("txMethod").value;
      txObj.tag = document.getElementById("txTag").value;
    }

    applyWalletEffect(txObj, 1);

    if (id) {
      const idx = state.transactions.findIndex(t => t.id === Number(id));
      state.transactions[idx] = txObj;
    } else {
      state.transactions.unshift(txObj);
    }

    resetTxForm();
    saveState();
    switchView("dashboard");
  };

  ["searchInput", "searchAmount", "filterPeriod", "filterType", "filterCategory", "filterWallet"].forEach(id => {
    document.getElementById(id).addEventListener("input", renderTransactionsTable);
  });

  document.getElementById("walletForm").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("newWalletName").value.trim();
    const balance = parseFloat(document.getElementById("newWalletBalance").value) || 0;
    state.wallets.push({ id: "w_" + Date.now(), name, balance });
    e.target.reset();
    saveState();
  };

  document.getElementById("dailyLimitForm").onsubmit = (e) => {
    e.preventDefault();
    state.dailyLimit = parseFloat(document.getElementById("dailyLimitInput").value) || 0;
    saveState();
  };

  document.getElementById("monthlyBudgetForm").onsubmit = (e) => {
    e.preventDefault();
    state.monthlyBudget = parseFloat(document.getElementById("monthlyBudgetInput").value) || 0;
    saveState();
  };

  document.getElementById("catLimitForm").onsubmit = (e) => {
    e.preventDefault();
    const cat = document.getElementById("catLimitCategory").value;
    const amt = parseFloat(document.getElementById("catLimitAmount").value);
    if (amt > 0) {
      state.categoryLimits[cat] = amt;
      e.target.reset();
      saveState();
    }
  };

  document.getElementById("emergencyForm").onsubmit = (e) => {
    e.preventDefault();
    state.emergencyFund.target = parseFloat(document.getElementById("emTargetInput").value) || 0;
    state.emergencyFund.saved = parseFloat(document.getElementById("emSavedInput").value) || 0;
    saveState();
  };

  document.getElementById("savingsForm").onsubmit = (e) => {
    e.preventDefault();
    state.savingsGoals.push({
      id: Date.now(),
      name: document.getElementById("goalName").value.trim(),
      target: parseFloat(document.getElementById("goalTarget").value),
      saved: parseFloat(document.getElementById("goalSaved").value) || 0
    });
    e.target.reset();
    saveState();
  };

  document.getElementById("challengeForm").onsubmit = (e) => {
    e.preventDefault();
    state.challenges.push({
      id: Date.now(),
      name: document.getElementById("chalName").value.trim(),
      target: parseFloat(document.getElementById("chalTarget").value),
      saved: 0
    });
    e.target.reset();
    saveState();
  };

  document.getElementById("wishlistForm").onsubmit = (e) => {
    e.preventDefault();
    state.wishlist.push({
      id: Date.now(),
      name: document.getElementById("wishName").value.trim(),
      cost: parseFloat(document.getElementById("wishCost").value)
    });
    e.target.reset();
    saveState();
  };

  document.getElementById("noteForm").onsubmit = (e) => {
    e.preventDefault();
    state.notes.unshift({
      id: Date.now(),
      text: document.getElementById("finNoteInput").value.trim(),
      date: getTodayStr()
    });
    e.target.reset();
    saveState();
  };

  document.getElementById("recurringForm").onsubmit = (e) => {
    e.preventDefault();
    state.recurring.push({
      id: Date.now(),
      name: document.getElementById("recName").value.trim(),
      amount: parseFloat(document.getElementById("recAmount").value),
      type: document.getElementById("recType").value,
      freq: document.getElementById("recFreq").value,
      category: document.getElementById("recCategory").value,
      dueDate: document.getElementById("recDueDate").value
    });
    e.target.reset();
    saveState();
  };

  document.getElementById("lendingForm").onsubmit = (e) => {
    e.preventDefault();
    state.lending.unshift({
      id: Date.now(),
      type: document.getElementById("lendType").value,
      person: document.getElementById("lendPerson").value.trim(),
      amount: parseFloat(document.getElementById("lendAmount").value),
      dueDate: document.getElementById("lendDueDate").value,
      note: document.getElementById("lendNote").value.trim(),
      settled: false
    });
    e.target.reset();
    saveState();
  };

  document.getElementById("prevMonthBtn").onclick = () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  };
  document.getElementById("nextMonthBtn").onclick = () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  };

  document.getElementById("reminderForm").onsubmit = (e) => {
    e.preventDefault();
    state.reminderTime = document.getElementById("reminderTimeInput").value;
    if ("Notification" in window) Notification.requestPermission();
    saveState();
    alert(`⏰ Daily reminder set for ${state.reminderTime}!`);
  };

  document.getElementById("exportCsvBtn").onclick = exportToCSV;
  document.getElementById("importJsonInput").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (imported.wallets && imported.transactions) {
          state = imported;
          saveState();
          alert("✅ Data restored successfully!");
        }
      } catch {
        alert("Invalid backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  document.getElementById("resetDataBtn").onclick = () => {
    if (confirm("Reset ALL wallets, transactions, budgets, and goals back to ₹0?")) {
      const keepPin = state.appPin;
      const keepDark = state.darkMode;
      state = JSON.parse(JSON.stringify(EMPTY_DATA));
      state.appPin = keepPin;
      state.darkMode = keepDark;
      saveState();
    }
  };
}

function applyWalletEffect(tx, multiplier) {
  if (tx.type === "income") {
    const w = state.wallets.find(w => w.id === tx.walletId);
    if (w) w.balance += tx.amount * multiplier;
  } else if (tx.type === "expense") {
    const w = state.wallets.find(w => w.id === tx.walletId);
    if (w) w.balance -= tx.amount * multiplier;
  } else if (tx.type === "transfer") {
    const fromW = state.wallets.find(w => w.id === tx.fromWalletId);
    const toW = state.wallets.find(w => w.id === tx.toWalletId);
    if (fromW) fromW.balance -= tx.amount * multiplier;
    if (toW) toW.balance += tx.amount * multiplier;
  }
}

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;
  const tx = state.transactions.find(t => t.id === id);
  if (tx) applyWalletEffect(tx, -1);
  state.transactions = state.transactions.filter(t => t.id !== id);
  saveState();
}

function editTransaction(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;
  switchView("add-tx");
  setTxTab(tx.type);
  document.getElementById("txId").value = tx.id;
  document.getElementById("txAmount").value = tx.amount;
  document.getElementById("txDate").value = tx.date;
  document.getElementById("txName").value = tx.name;
  document.getElementById("txNotes").value = tx.notes || "";
  document.getElementById("txSubmitBtn").textContent = "Update Transaction";

  if (tx.type === "transfer") {
    document.getElementById("txFromWallet").value = tx.fromWalletId;
    document.getElementById("txToWallet").value = tx.toWalletId;
  } else {
    document.getElementById("txCategory").value = tx.category;
    document.getElementById("txWallet").value = tx.walletId;
    document.getElementById("txMethod").value = tx.method;
    document.getElementById("txTag").value = tx.tag || "Personal";
  }
}

function viewReceipt(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (tx && tx.receipt) {
    document.getElementById("receiptPreviewImg").src = tx.receipt;
    document.getElementById("receiptModal").classList.remove("hidden");
  }
}
function closeReceiptModal() { document.getElementById("receiptModal").classList.add("hidden"); }

function switchView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById(`view-${viewName}`).classList.add("active");
  const nav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (nav) nav.classList.add("active");
  document.getElementById("pageTitle").textContent = nav ? nav.textContent.replace(/^[^\w]+/, "") : "Dashboard";
  document.getElementById("sidebar").classList.remove("open");
  if (viewName === "analytics" || viewName === "dashboard") renderCharts();
}

function renderAll() {
  refreshWalletDropdowns();
  renderDashboard();
  renderTransactionsTable();
  renderCalendar();
  renderWalletsPage();
  renderBudgetsPage();
  renderSavingsPage();
  renderBillsPage();
  renderLendingPage();
  renderAnalyticsPage();
  renderInsightsPage();
  renderSettingsPage();
  renderCharts();
}

function renderDashboard() {
  const todayStr = getTodayStr();
  const curMonth = todayStr.slice(0, 7);

  const totalBalance = state.wallets.reduce((s, w) => s + w.balance, 0);
  const monthIncome = state.transactions.filter(t => t.type === "income" && t.date.startsWith(curMonth)).reduce((s, t) => s + t.amount, 0);
  const monthExpense = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth)).reduce((s, t) => s + t.amount, 0);
  const todaySpend = state.transactions.filter(t => t.type === "expense" && t.date === todayStr).reduce((s, t) => s + t.amount, 0);

  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const forecast = dayOfMonth > 0 ? Math.round((monthExpense / dayOfMonth) * daysInMonth) : 0;

  let noSpendDays = 0;
  for (let d = 1; d <= dayOfMonth; d++) {
    const ds = `${curMonth}-${String(d).padStart(2, '0')}`;
    const spentOnDay = state.transactions.some(t => t.type === "expense" && t.date === ds);
    if (!spentOnDay) noSpendDays++;
  }

  const totalSavings = state.savingsGoals.reduce((s, g) => s + g.saved, 0) + (state.emergencyFund.saved || 0);
  const remBudget = state.monthlyBudget > 0 ? state.monthlyBudget - monthExpense : 0;

  document.getElementById("dashTotalBalance").textContent = formatINR(totalBalance);
  document.getElementById("dashTodaySpend").textContent = formatINR(todaySpend);
  document.getElementById("dashDailyLimitSub").textContent = state.dailyLimit > 0
    ? `Remaining today: ${formatINR(state.dailyLimit - todaySpend)} (of ${formatINR(state.dailyLimit)})`
    : "No daily limit set";
  document.getElementById("dashMonthIncome").textContent = formatINR(monthIncome);
  document.getElementById("dashMonthExpense").textContent = formatINR(monthExpense);
  document.getElementById("dashForecastSub").textContent = `Est. month-end spend: ${formatINR(forecast)}`;
  document.getElementById("dashRemBudget").textContent = formatINR(remBudget);
  document.getElementById("dashBudgetPct").textContent = state.monthlyBudget > 0
    ? `${Math.round((monthExpense / state.monthlyBudget) * 100)}% of ${formatINR(state.monthlyBudget)} used`
    : "No monthly budget set";
  document.getElementById("dashTotalSavings").textContent = formatINR(totalSavings);
  document.getElementById("dashNoSpendCount").textContent = `${noSpendDays} No-Spend Days this month`;

  const alertsDiv = document.getElementById("globalAlerts");
  alertsDiv.innerHTML = "";
  if (state.dailyLimit > 0 && todaySpend > state.dailyLimit) {
    alertsDiv.innerHTML += `<div class="alert-banner alert-danger">⚠️ Daily Limit Exceeded! You spent ${formatINR(todaySpend)} today (Limit: ${formatINR(state.dailyLimit)}).</div>`;
  }
  if (state.monthlyBudget > 0 && monthExpense >= state.monthlyBudget * 0.8) {
    const pct = Math.round((monthExpense / state.monthlyBudget) * 100);
    alertsDiv.innerHTML += `<div class="alert-banner ${pct >= 100 ? 'alert-danger' : 'alert-warning'}">🎯 Monthly Budget Alert: ${pct}% used (${formatINR(monthExpense)} / ${formatINR(state.monthlyBudget)}).</div>`;
  }
  Object.entries(state.categoryLimits).forEach(([cat, lim]) => {
    const catSpent = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth) && t.category === cat).reduce((s, t) => s + t.amount, 0);
    if (lim > 0 && catSpent >= lim * 0.8) {
      alertsDiv.innerHTML += `<div class="alert-banner alert-warning">📂 Category Alert (${cat}): Spent ${formatINR(catSpent)} of ${formatINR(lim)} limit.</div>`;
    }
  });

  document.getElementById("dashWalletsStrip").innerHTML = state.wallets.map(w => `
    <div class="wallet-mini-card">
      <span class="stat-label">${w.name}</span>
      <strong>${formatINR(w.balance)}</strong>
    </div>
  `).join("");

  const sorted = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));
  document.getElementById("recentTransactionsBody").innerHTML = sorted.slice(0, 5).map(t => {
    const wName = t.type === "transfer"
      ? `${getWalletName(t.fromWalletId)} → ${getWalletName(t.toWalletId)}`
      : `${getWalletName(t.walletId)} (${t.method})`;
    const colorClass = t.type === "income" ? "text-green" : t.type === "expense" ? "text-red" : "text-blue";
    const sign = t.type === "income" ? "+" : t.type === "expense" ? "-" : "⇄ ";
    return `
      <tr>
        <td><strong>${t.name}</strong></td>
        <td>${t.category}</td>
        <td>${wName}</td>
        <td>${t.date}</td>
        <td class="${colorClass}"><strong>${sign}${formatINR(t.amount)}</strong></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="5">No transactions yet. Click "+ Income" or "+ Expense" to start!</td></tr>`;
}

function getWalletName(id) {
  const w = state.wallets.find(w => w.id === id);
  return w ? w.name : "Account";
}

function renderTransactionsTable() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const exactAmt = document.getElementById("searchAmount").value;
  const period = document.getElementById("filterPeriod").value;
  const type = document.getElementById("filterType").value;
  const cat = document.getElementById("filterCategory").value;
  const wal = document.getElementById("filterWallet").value;

  const todayStr = getTodayStr();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  const filtered = state.transactions.filter(t => {
    if (type !== "all" && t.type !== type) return false;
    if (cat !== "all" && t.category !== cat) return false;
    if (wal !== "all" && t.walletId !== wal && t.fromWalletId !== wal && t.toWalletId !== wal) return false;
    if (exactAmt && Number(t.amount) !== Number(exactAmt)) return false;
    if (search && !t.name.toLowerCase().includes(search) && !(t.notes || "").toLowerCase().includes(search) && !(t.method || "").toLowerCase().includes(search)) return false;

    if (period === "day" && t.date !== todayStr) return false;
    if (period === "week" && t.date < weekAgo) return false;
    if (period === "month" && !t.date.startsWith(todayStr.slice(0, 7))) return false;
    if (period === "year" && !t.date.startsWith(todayStr.slice(0, 4))) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  document.getElementById("allTransactionsBody").innerHTML = filtered.map(t => {
    const wInfo = t.type === "transfer"
      ? `${getWalletName(t.fromWalletId)} → ${getWalletName(t.toWalletId)}`
      : `${getWalletName(t.walletId)} • ${t.method}`;
    const badgeClass = t.type === "income" ? "badge-income" : t.type === "expense" ? "badge-expense" : "badge-transfer";
    const colorClass = t.type === "income" ? "text-green" : t.type === "expense" ? "text-red" : "text-blue";
    return `
      <tr>
        <td>
          <strong>${t.name}</strong> ${t.tag ? `<span class="tag-pill">${t.tag}</span>` : ""}
          ${t.notes ? `<div class="stat-sub">${t.notes}</div>` : ""}
        </td>
        <td><span class="badge ${badgeClass}">${t.type.toUpperCase()}</span></td>
        <td>${t.category}</td>
        <td>${wInfo}</td>
        <td>${t.date}</td>
        <td class="${colorClass}"><strong>${formatINR(t.amount)}</strong></td>
        <td>${t.receipt ? `<button class="btn-outline" style="padding:4px 8px" onclick="viewReceipt(${t.id})">🧾 View</button>` : "-"}</td>
        <td>
          <button class="btn-outline" style="padding:4px 8px" onclick="editTransaction(${t.id})">✏️</button>
          <button class="btn-danger-outline" style="padding:4px 8px" onclick="deleteTransaction(${t.id})">🗑️</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No matching transactions found.</td></tr>`;
}

// ULTIMATE CALENDAR (Displays Expenses, Recurring Bills & Lending Due Dates)
function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  document.getElementById("calendarMonthLabel").textContent = calendarDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${monthPrefix}-${String(d).padStart(2, '0')}`;
    const dayExp = state.transactions.filter(t => t.type === "expense" && t.date === ds).reduce((s, t) => s + t.amount, 0);
    const dayLend = state.lending.filter(l => l.dueDate === ds && !l.settled);
    const dayBills = state.recurring.filter(r => r.dueDate === ds);

    let heatClass = "";
    let labelHTML = "";

    if (dayExp === 0 && dayLend.length === 0 && dayBills.length === 0) {
      heatClass = "nospend";
      labelHTML = `<span class="cal-status" style="color:#10b981; font-weight:700;">No Spend</span>`;
    } else {
      if (dayExp > 0 && dayExp <= 300) heatClass = "heat-low";
      else if (dayExp > 300 && dayExp <= 1000) heatClass = "heat-med";
      else if (dayExp > 1000) heatClass = "heat-high";
      else heatClass = "heat-low";

      let badgeText = dayExp > 0 ? `₹${dayExp.toLocaleString("en-IN")}` : "";
      if (dayLend.length > 0) badgeText += ` 🤝(${dayLend.length})`;
      if (dayBills.length > 0) badgeText += ` 🔁(${dayBills.length})`;
      labelHTML = `<span class="cal-spend">${badgeText}</span>`;
    }

    const cell = document.createElement("div");
    cell.className = `cal-day ${heatClass} ${selectedCalDate === ds ? "selected" : ""}`;
    cell.innerHTML = `
      <strong>${d}</strong>
      ${labelHTML}
    `;
    cell.onclick = () => { selectedCalDate = ds; renderCalendar(); };
    grid.appendChild(cell);
  }

  const dayTxs = state.transactions.filter(t => t.date === selectedCalDate);
  const dayLends = state.lending.filter(l => l.dueDate === selectedCalDate);
  const dayBills = state.recurring.filter(r => r.dueDate === selectedCalDate);

  const dExp = dayTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const dInc = dayTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);

  document.getElementById("selectedDateTitle").textContent = `Activity on ${selectedCalDate}`;
  document.getElementById("selectedDateSummary").textContent = `Spent: ${formatINR(dExp)} | Income: ${formatINR(dInc)}`;
  
  let htmlContent = dayTxs.map(t => `
    <div class="date-tx-item">
      <div><strong>${t.name}</strong><div class="stat-sub">${t.category}</div></div>
      <strong class="${t.type === 'income' ? 'text-green' : 'text-red'}">${formatINR(t.amount)}</strong>
    </div>
  `).join("");

  htmlContent += dayLends.map(l => `
    <div class="date-tx-item" style="border-left: 3px solid #f59e0b; padding-left: 8px;">
      <div><strong>Lending Due: ${l.person}</strong><div class="stat-sub">${l.type.toUpperCase()} • ${l.note || ''}</div></div>
      <strong class="text-blue">${formatINR(l.amount)}</strong>
    </div>
  `).join("");

  htmlContent += dayBills.map(b => `
    <div class="date-tx-item" style="border-left: 3px solid #7c3aed; padding-left: 8px;">
      <div><strong>Recurring Due: ${b.name}</strong><div class="stat-sub">${b.freq} • ${b.category}</div></div>
      <strong class="text-red">${formatINR(b.amount)}</strong>
    </div>
  `).join("");

  document.getElementById("selectedDateTransactions").innerHTML = htmlContent || `<p class="stat-sub">No transactions or scheduled due dates on this date.</p>`;
}

function renderWalletsPage() {
  document.getElementById("walletsGrid").innerHTML = state.wallets.map(w => `
    <div class="goal-card">
      <div class="goal-header">
        <h4>${w.name}</h4>
        <button class="btn-outline" style="padding:4px 8px" onclick="adjustWalletBalance('${w.id}')">⚖️ Adjust</button>
      </div>
      <h2 class="stat-value text-blue">${formatINR(w.balance)}</h2>
    </div>
  `).join("");
}

function adjustWalletBalance(id) {
  const w = state.wallets.find(w => w.id === id);
  if (!w) return;
  const newBal = prompt(`Enter actual current balance for ${w.name} (₹):`, w.balance);
  if (newBal !== null && !isNaN(parseFloat(newBal))) {
    w.balance = parseFloat(newBal);
    saveState();
  }
}

function renderBudgetsPage() {
  const todayStr = getTodayStr();
  const curMonth = todayStr.slice(0, 7);

  const todaySpent = state.transactions.filter(t => t.type === "expense" && t.date === todayStr).reduce((s, t) => s + t.amount, 0);
  const monthSpent = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth)).reduce((s, t) => s + t.amount, 0);

  document.getElementById("dailyLimitInput").value = state.dailyLimit || "";
  document.getElementById("dispDailyLimit").textContent = formatINR(state.dailyLimit);
  document.getElementById("dispDailySpent").textContent = formatINR(todaySpent);
  document.getElementById("dispDailyRem").textContent = formatINR(state.dailyLimit > 0 ? state.dailyLimit - todaySpent : 0);
  const dPct = state.dailyLimit > 0 ? Math.min(100, Math.round((todaySpent / state.dailyLimit) * 100)) : 0;
  document.getElementById("dailyProgressBar").style.width = `${dPct}%`;

  document.getElementById("monthlyBudgetInput").value = state.monthlyBudget || "";
  document.getElementById("dispMonthLimit").textContent = formatINR(state.monthlyBudget);
  document.getElementById("dispMonthSpent").textContent = formatINR(monthSpent);
  document.getElementById("dispMonthRem").textContent = formatINR(state.monthlyBudget > 0 ? state.monthlyBudget - monthSpent : 0);
  const mPct = state.monthlyBudget > 0 ? Math.min(100, Math.round((monthSpent / state.monthlyBudget) * 100)) : 0;
  document.getElementById("monthlyProgressBar").style.width = `${mPct}%`;

  const entries = Object.entries(state.categoryLimits);
  document.getElementById("categoryLimitsList").innerHTML = entries.map(([cat, lim]) => {
    const spent = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth) && t.category === cat).reduce((s, t) => s + t.amount, 0);
    const pct = Math.min(100, Math.round((spent / lim) * 100));
    return `
      <div class="goal-card">
        <div class="goal-header">
          <strong>${cat}</strong>
          <button class="btn-danger-outline" style="padding:2px 8px" onclick="deleteCatLimit('${cat}')">✕</button>
        </div>
        <div class="budget-numbers">
          <span>Spent: ${formatINR(spent)}</span>
          <span>Limit: ${formatINR(lim)}</span>
        </div>
        <div class="progress-container"><div class="progress-bar" style="width:${pct}%; background:${pct >= 90 ? 'var(--danger)' : 'var(--primary)'}"></div></div>
      </div>
    `;
  }).join("") || `<p class="stat-sub">No category limits set yet.</p>`;
}

function deleteCatLimit(cat) { delete state.categoryLimits[cat]; saveState(); }

function renderSavingsPage() {
  const em = state.emergencyFund;
  document.getElementById("emTargetInput").value = em.target || "";
  document.getElementById("emSavedInput").value = em.saved || "";
  document.getElementById("emSavedDisp").textContent = formatINR(em.saved);
  document.getElementById("emTargetDisp").textContent = formatINR(em.target);
  const emPct = em.target > 0 ? Math.min(100, Math.round((em.saved / em.target) * 100)) : 0;
  document.getElementById("emPctDisp").textContent = `${emPct}%`;
  document.getElementById("emProgressBar").style.width = `${emPct}%`;

  document.getElementById("savingsGoalsList").innerHTML = state.savingsGoals.map(g => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    return `
      <div class="goal-card">
        <div class="goal-header"><strong>${g.name}</strong><button class="btn-outline" style="padding:4px 8px" onclick="depositGoal(${g.id})">+ Add ₹</button></div>
        <div class="budget-numbers"><span>Saved: ${formatINR(g.saved)}</span><span>Target: ${formatINR(g.target)}</span></div>
        <div class="progress-container"><div class="progress-bar" style="width:${pct}%"></div></div>
      </div>
    `;
  }).join("");

  document.getElementById("challengesList").innerHTML = state.challenges.map(c => {
    const pct = Math.min(100, Math.round((c.saved / c.target) * 100));
    return `
      <div class="goal-card">
        <div class="goal-header"><strong>🏆 ${c.name}</strong><button class="btn-outline" style="padding:4px 8px" onclick="depositChallenge(${c.id})">+ Progress</button></div>
        <div class="budget-numbers"><span>Saved: ${formatINR(c.saved)}</span><span>Goal: ${formatINR(c.target)}</span></div>
        <div class="progress-container"><div class="progress-bar" style="width:${pct}%"></div></div>
      </div>
    `;
  }).join("");

  document.getElementById("wishlistContainer").innerHTML = state.wishlist.map(w => `
    <div class="date-tx-item">
      <span>🛍️ <strong>${w.name}</strong> (${formatINR(w.cost)})</span>
      <button class="btn-danger-outline" style="padding:2px 8px" onclick="deleteWish(${w.id})">✕</button>
    </div>
  `).join("");

  document.getElementById("finNotesList").innerHTML = state.notes.map(n => `
    <div class="date-tx-item">
      <div><p>${n.text}</p><span class="stat-sub">${n.date}</span></div>
      <button class="btn-danger-outline" style="padding:2px 8px" onclick="deleteNote(${n.id})">✕</button>
    </div>
  `).join("");
}

function depositGoal(id) { const amt = parseFloat(prompt("Enter amount to add (₹):")); if (amt > 0) { state.savingsGoals.find(g => g.id === id).saved += amt; saveState(); } }
function depositChallenge(id) { const amt = parseFloat(prompt("Enter saved amount to add to challenge (₹):")); if (amt > 0) { state.challenges.find(c => c.id === id).saved += amt; saveState(); } }
function deleteWish(id) { state.wishlist = state.wishlist.filter(w => w.id !== id); saveState(); }
function deleteNote(id) { state.notes = state.notes.filter(n => n.id !== id); saveState(); }

function renderBillsPage() {
  document.getElementById("recurringList").innerHTML = state.recurring.map(r => `
    <div class="goal-card">
      <div class="goal-header">
        <div><h4>${r.name}</h4><span class="stat-sub">${r.freq} • ${r.category} • Due: ${r.dueDate}</span></div>
        <button class="btn-danger-outline" style="padding:4px 8px" onclick="deleteRecurring(${r.id})">✕</button>
      </div>
      <h3 class="${r.type === 'income' ? 'text-green' : 'text-red'} mb-15">${formatINR(r.amount)}</h3>
      <button class="btn-primary full-width" onclick="executeRecurring(${r.id})">✅ Record Payment Now</button>
    </div>
  `).join("") || `<p class="stat-sub">No recurring bills or subscriptions scheduled yet.</p>`;
}

function executeRecurring(id) {
  const r = state.recurring.find(x => x.id === id);
  if (!r) return;
  const defaultWallet = state.wallets[0]?.id;
  const tx = {
    id: Date.now(), type: r.type, amount: r.amount, date: getTodayStr(),
    name: r.name, category: r.category, walletId: defaultWallet, method: "Auto-Debit / UPI", notes: `Recurring (${r.freq})`
  };
  applyWalletEffect(tx, 1);
  state.transactions.unshift(tx);
  saveState();
  alert(`Recorded "${r.name}" (${formatINR(r.amount)})!`);
}
function deleteRecurring(id) { state.recurring = state.recurring.filter(r => r.id !== id); saveState(); }

function renderLendingPage() {
  const lentTotal = state.lending.filter(l => l.type === "lent" && !l.settled).reduce((s, l) => s + l.amount, 0);
  const borTotal = state.lending.filter(l => l.type === "borrowed" && !l.settled).reduce((s, l) => s + l.amount, 0);

  document.getElementById("totalLentDisp").textContent = formatINR(lentTotal);
  document.getElementById("totalBorrowedDisp").textContent = formatINR(borTotal);

  document.getElementById("lendingList").innerHTML = state.lending.map(l => `
    <div class="goal-card" style="opacity:${l.settled ? 0.6 : 1}">
      <div class="goal-header">
        <div>
          <span class="badge ${l.type === 'lent' ? 'badge-income' : 'badge-expense'}">${l.type === 'lent' ? 'LENT TO' : 'BORROWED FROM'}</span>
          <h4 style="margin-top:6px;">${l.person}</h4>
          <span class="stat-sub">Due: ${l.dueDate} ${l.note ? '• ' + l.note : ''}</span>
        </div>
        <button class="btn-danger-outline" style="padding:4px 8px" onclick="deleteLending(${l.id})">✕</button>
      </div>
      <h3 class="mb-15">${formatINR(l.amount)}</h3>
      <button class="btn-outline full-width" onclick="toggleSettleLending(${l.id})">
        ${l.settled ? "✅ Settled (Click to Reopen)" : "Mark as Repaid / Settled"}
      </button>
    </div>
  `).join("");
}

function toggleSettleLending(id) { const item = state.lending.find(l => l.id === id); if (item) { item.settled = !item.settled; saveState(); } }
function deleteLending(id) { state.lending = state.lending.filter(l => l.id !== id); saveState(); }

function renderAnalyticsPage() {
  const now = new Date();
  const curYear = String(now.getFullYear());
  const curMonth = getTodayStr().slice(0, 7);

  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const thisMonthExp = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth)).reduce((s, t) => s + t.amount, 0);
  const lastMonthExp = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(prevMonth)).reduce((s, t) => s + t.amount, 0);
  const mDiff = thisMonthExp - lastMonthExp;

  document.getElementById("monthCompareVal").textContent = formatINR(thisMonthExp);
  document.getElementById("monthCompareSub").textContent = lastMonthExp === 0
    ? "No last month data to compare"
    : `${mDiff >= 0 ? 'Spent ' + formatINR(mDiff) + ' more' : 'Spent ' + formatINR(Math.abs(mDiff)) + ' less'} than last month`;

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  const thisWeekExp = state.transactions.filter(t => t.type === "expense" && t.date >= weekAgo).reduce((s, t) => s + t.amount, 0);
  const lastWeekExp = state.transactions.filter(t => t.type === "expense" && t.date >= twoWeeksAgo && t.date < weekAgo).reduce((s, t) => s + t.amount, 0);
  const wDiff = thisWeekExp - lastWeekExp;

  document.getElementById("weekCompareVal").textContent = formatINR(thisWeekExp);
  document.getElementById("weekCompareSub").textContent = `${wDiff >= 0 ? '+' + formatINR(wDiff) : '-' + formatINR(Math.abs(wDiff))} vs previous 7 days`;

  const yearInc = state.transactions.filter(t => t.type === "income" && t.date.startsWith(curYear)).reduce((s, t) => s + t.amount, 0);
  const yearExp = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curYear)).reduce((s, t) => s + t.amount, 0);

  document.getElementById("yearIncomeVal").textContent = formatINR(yearInc);
  document.getElementById("yearExpenseVal").textContent = formatINR(yearExp);
}

function renderInsightsPage() {
  const insights = [];
  const curMonth = getTodayStr().slice(0, 7);
  const mInc = state.transactions.filter(t => t.type === "income" && t.date.startsWith(curMonth)).reduce((s, t) => s + t.amount, 0);
  const mExp = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth)).reduce((s, t) => s + t.amount, 0);

  if (mInc > 0) {
    const savePct = Math.round(((mInc - mExp) / mInc) * 100);
    insights.push(`💰 You have saved <strong>${savePct}%</strong> (${formatINR(mInc - mExp)}) of your monthly income so far.`);
  }

  const catTotals = {};
  state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth)).forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    insights.push(`📊 Your highest spending category this month is <strong>${topCat[0]}</strong> at <strong>${formatINR(topCat[1])}</strong>.`);
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  state.transactions.filter(t => t.type === "expense").forEach(t => {
    const d = new Date(t.date).getDay();
    if (!isNaN(d)) dayTotals[d] += t.amount;
  });
  const maxDayVal = Math.max(...dayTotals);
  if (maxDayVal > 0) {
    const maxDayName = dayNames[dayTotals.indexOf(maxDayVal)];
    insights.push(`📅 Your highest spending day of the week is <strong>${maxDayName}</strong> (${formatINR(maxDayVal)} total).`);
  }

  if (state.monthlyBudget > 0) {
    insights.push(`🎯 You have <strong>${formatINR(state.monthlyBudget - mExp)}</strong> remaining in your monthly budget.`);
  }

  document.getElementById("smartInsightsList").innerHTML = insights.length
    ? insights.map(i => `<div class="insight-card">${i}</div>`).join("")
    : `<p class="stat-sub">Add a few income and expense transactions to generate personalized insights!</p>`;
}

function renderSettingsPage() {
  document.getElementById("qrCodeImg").src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(window.location.href)}`;
  if (state.reminderTime) {
    document.getElementById("reminderTimeInput").value = state.reminderTime;
    document.getElementById("reminderStatus").textContent = `Active daily reminder at ${state.reminderTime}`;
  }
}

function startReminderChecker() {
  setInterval(() => {
    if (!state.reminderTime) return;
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (hhmm === state.reminderTime && now.getSeconds() === 0) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("RupeeFlow Reminder", { body: "Don't forget to record today's expenses!" });
      } else {
        alert("⏰ Evening Reminder: Don't forget to record today's expenses!");
      }
    }
  }, 1000);
}

function setupVoiceRecognition() {
  const voiceBtn = document.getElementById("voiceBtn");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { voiceBtn.style.display = "none"; return; }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  voiceBtn.onclick = () => { recognition.start(); voiceBtn.textContent = "🎙️ Listening..."; };

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.toLowerCase();
    voiceBtn.textContent = "🎙️ Voice Add";
    const match = text.match(/\d+(\.\d+)?/);
    if (!match) return alert(`Heard "${text}" — please include an amount.`);

    const amount = parseFloat(match[0]);
    const defaultWallet = state.wallets[0]?.id;
    const tx = {
      id: Date.now(), type: "expense", amount, date: getTodayStr(),
      name: text.charAt(0).toUpperCase() + text.slice(1),
      category: "Other", walletId: defaultWallet, method: "Google Pay (GPay)", tag: "Personal", notes: "Voice Entry"
    };
    applyWalletEffect(tx, 1);
    state.transactions.unshift(tx);
    saveState();
    alert(`✅ Added ₹${amount} via Voice!`);
  };
  recognition.onerror = () => { voiceBtn.textContent = "🎙️ Voice Add"; };
}

function renderCharts() {
  const curMonth = getTodayStr().slice(0, 7);
  const mExp = state.transactions.filter(t => t.type === "expense" && t.date.startsWith(curMonth));

  const catMap = {};
  mExp.forEach(t => catMap[t.category] = (catMap[t.category] || 0) + t.amount);
  const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"];

  makeChart("dashCategoryChart", "doughnut", Object.keys(catMap), [{ data: Object.values(catMap), backgroundColor: colors }]);
  makeChart("repCategoryChart", "pie", Object.keys(catMap), [{ data: Object.values(catMap), backgroundColor: colors }]);

  const incTotal = state.transactions.filter(t => t.type === "income" && t.date.startsWith(curMonth)).reduce((s, t) => s + t.amount, 0);
  const expTotal = mExp.reduce((s, t) => s + t.amount, 0);
  makeChart("dashIncomeExpenseChart", "bar", ["Income", "Expenses"], [{ label: "₹", data: [incTotal, expTotal], backgroundColor: ["#10b981", "#ef4444"] }]);

  const dLabels = [], dData = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dLabels.push(ds.slice(5));
    dData.push(state.transactions.filter(t => t.type === "expense" && t.date === ds).reduce((s, t) => s + t.amount, 0));
  }
  makeChart("repDailyChart", "line", dLabels, [{ label: "Daily Spend (₹)", data: dData, borderColor: "#2563eb", tension: 0.3, fill: true, backgroundColor: "rgba(37,99,235,0.1)" }]);

  const mLabels = [], mData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    const mp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    mLabels.push(mp);
    mData.push(state.transactions.filter(t => t.type === "expense" && t.date.startsWith(mp)).reduce((s, t) => s + t.amount, 0));
  }
  makeChart("repMonthlyChart", "bar", mLabels, [{ label: "Monthly Spend (₹)", data: mData, backgroundColor: "#8b5cf6" }]);

  makeChart("repWalletChart", "doughnut", state.wallets.map(w => w.name), [{ data: state.wallets.map(w => Math.max(0, w.balance)), backgroundColor: colors }]);
}

function makeChart(id, type, labels, datasets) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: state.darkMode ? "#f8fafc" : "#0f172a" } } }
    }
  });
}

function exportToCSV() {
  if (!state.transactions.length) return alert("No transactions to export.");
  const headers = ["ID", "Type", "Title", "Category", "Amount (INR)", "Date", "Method", "Tag", "Notes"];
  const rows = state.transactions.map(t => [
    t.id, t.type, `"${t.name}"`, `"${t.category}"`, t.amount, t.date, `"${t.method}"`, `"${t.tag || ''}"`, `"${t.notes || ''}"`
  ]);
  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const a = document.createElement("a");
  a.href = encodeURI(csv);
  a.download = `RupeeFlow_Pro_${getTodayStr()}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function downloadBackupJSON() {
  const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const a = document.createElement("a");
  a.href = str;
  a.download = `RupeeFlow_Backup_${getTodayStr()}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
