"use strict";

const App = {
  editingId: null,
  pendingDeleteId: null,

  /* ---- DOM References ---- */
  dom: {},

  cacheDom() {
    this.dom = {
      form: document.getElementById("transactionForm"),
      formTitle: document.getElementById("formTitle"),
      transactionId: document.getElementById("transactionId"),
      description: document.getElementById("description"),
      amount: document.getElementById("amount"),
      type: document.getElementById("type"),
      date: document.getElementById("date"),
      category: document.getElementById("category"),
      submitBtn: document.getElementById("submitBtn"),
      cancelBtn: document.getElementById("cancelBtn"),
      totalBalance: document.getElementById("totalBalance"),
      totalIncome: document.getElementById("totalIncome"),
      totalExpense: document.getElementById("totalExpense"),
      tableBody: document.getElementById("tableBody"),
      filterCategory: document.getElementById("filterCategory"),
      filterType: document.getElementById("filterType"),
      modalOverlay: document.getElementById("modalOverlay"),
      modalMessage: document.getElementById("modalMessage"),
      modalConfirm: document.getElementById("modalConfirm"),
      modalCancel: document.getElementById("modalCancel"),
    };
  },

  /* ---- Formatting ---- */
  formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  },

  formatDate(dateStr) {
    const parts = dateStr.split("T")[0].split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  },

  getTodayISO() {
    return new Date().toISOString().split("T")[0];
  },

  /* ---- Category Helpers ---- */
  getCategoryName(categoryId) {
    if (!categoryId) return "-";
    const categories = Storage.getCategories();
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : "-";
  },

  populateCategorySelects() {
    const categories = Storage.getCategories();
    const optionsHtml = '<option value="">Sem categoria</option>' +
      categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");

    this.dom.category.innerHTML = optionsHtml;
    this.dom.filterCategory.innerHTML = '<option value="">Todas categorias</option>' +
      categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  },

  /* ---- Render ---- */
  renderDashboard() {
    let transactions = Storage.getTransactions();

    const filterCategory = this.dom.filterCategory.value;
    const filterType = this.dom.filterType.value;

    if (filterCategory) {
      transactions = transactions.filter((t) => t.categoryId === filterCategory);
    }
    if (filterType) {
      transactions = transactions.filter((t) => t.type === parseInt(filterType));
    }

    const income = transactions
      .filter((t) => t.type === 1)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 2)
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    this.dom.totalBalance.textContent = this.formatCurrency(balance);
    this.dom.totalIncome.textContent = this.formatCurrency(income);
    this.dom.totalExpense.textContent = this.formatCurrency(expense);

    this.renderTable(transactions);
  },

  renderTable(transactions) {
    if (transactions.length === 0) {
      this.dom.tableBody.innerHTML =
        '<tr class="table__empty"><td colspan="6">Nenhuma transação registrada.</td></tr>';
      return;
    }

    const sorted = [...transactions].sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });

    this.dom.tableBody.innerHTML = sorted
      .map((t) => {
        const typeLabel = t.type === 1 ? "Receita" : "Despesa";
        const typeClass = t.type === 1 ? "type-badge--income" : "type-badge--expense";
        const amountClass = t.type === 1 ? "amount--income" : "amount--expense";
        const sign = t.type === 1 ? "" : "-";
        const syncBadge = t.syncStatus === "pending"
          ? '<span class="sync-badge sync-badge--pending">pendente</span>'
          : "";

        return `
          <tr>
            <td>${this.formatDate(t.date)}</td>
            <td>${this.escapeHtml(t.description)}${syncBadge}</td>
            <td>${this.escapeHtml(this.getCategoryName(t.categoryId))}</td>
            <td class="${amountClass}">${sign} ${this.formatCurrency(t.amount)}</td>
            <td><span class="type-badge ${typeClass}">${typeLabel}</span></td>
            <td>
              <button class="btn btn--icon btn--edit" data-edit="${t.id}" title="Editar">Editar</button>
              <button class="btn btn--icon btn--delete" data-delete="${t.id}" title="Excluir">Excluir</button>
            </td>
          </tr>`;
      })
      .join("");
  },

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  /* ---- Form Handling ---- */
  resetForm() {
    this.dom.form.reset();
    this.dom.transactionId.value = "";
    this.dom.date.value = this.getTodayISO();
    this.dom.formTitle.textContent = "Nova Transação";
    this.dom.submitBtn.textContent = "Salvar";
    this.dom.cancelBtn.style.display = "none";
    this.editingId = null;
  },

  showFormForEdit(id) {
    const transactions = Storage.getTransactions();
    const t = transactions.find((tx) => tx.id === id);
    if (!t) return;

    this.editingId = id;
    this.dom.transactionId.value = t.id;
    this.dom.description.value = t.description;
    this.dom.amount.value = t.amount;
    this.dom.type.value = t.type.toString();
    this.dom.date.value = t.date.split("T")[0];
    this.dom.category.value = t.categoryId || "";
    this.dom.formTitle.textContent = "Editar Transação";
    this.dom.submitBtn.textContent = "Atualizar";
    this.dom.cancelBtn.style.display = "inline-block";
    this.dom.form.scrollIntoView({ behavior: "smooth" });
  },

  async handleSubmit(e) {
    e.preventDefault();

    const description = this.dom.description.value.trim();
    const amount = parseFloat(this.dom.amount.value);
    const type = parseInt(this.dom.type.value);
    const date = this.dom.date.value;
    const categoryId = this.dom.category.value || null;

    if (!description || !amount || amount <= 0 || !date) {
      this.showFieldErrors();
      return;
    }

    if (this.editingId) {
      this.updateExisting(description, amount, type, date, categoryId);
    } else {
      this.createNew(description, amount, type, date, categoryId);
    }
  },

  async createNew(description, amount, type, date, categoryId) {
    const id = crypto.randomUUID();
    const transaction = {
      id,
      serverId: null,
      description,
      amount,
      date: new Date(date + "T00:00:00").toISOString(),
      type,
      categoryId,
      syncStatus: "pending",
    };

    Storage.addTransaction(transaction);
    this.resetForm();
    this.renderDashboard();

    try {
      const result = await Api.createTransaction(transaction);
      Storage.updateTransaction(id, { serverId: result.id, syncStatus: "synced" });
      this.renderDashboard();
    } catch {
      /* Keep pending status — background sync will retry */
    }
  },

  async updateExisting(description, amount, type, date, categoryId) {
    const serverId = this.getServerId(this.editingId);

    Storage.updateTransaction(this.editingId, {
      description,
      amount,
      date: new Date(date + "T00:00:00").toISOString(),
      type,
      categoryId,
      syncStatus: "pending",
    });

    this.resetForm();
    this.renderDashboard();

    if (serverId) {
      try {
        const data = { description, amount, type, date, categoryId };
        await Api.updateTransaction(serverId, data);
        Storage.updateTransaction(this.editingId, { syncStatus: "synced" });
        this.renderDashboard();
      } catch {
        /* Keep pending */
      }
    }
  },

  getServerId(localId) {
    const transactions = Storage.getTransactions();
    const t = transactions.find((tx) => tx.id === localId);
    return t ? t.serverId : null;
  },

  showFieldErrors() {
    [this.dom.description, this.dom.amount, this.dom.type, this.dom.date].forEach((el) => {
      if (!el.value || (el.type === "number" && parseFloat(el.value) <= 0)) {
        el.classList.add("error");
      } else {
        el.classList.remove("error");
      }
    });
  },

  /* ---- Delete Handling ---- */
  confirmDelete(id) {
    this.pendingDeleteId = id;
    this.dom.modalMessage.textContent = "Tem certeza que deseja excluir esta transação?";
    this.dom.modalOverlay.style.display = "flex";
  },

  async executeDelete() {
    const id = this.pendingDeleteId;
    if (!id) return;

    const serverId = this.getServerId(id);
    Storage.deleteTransaction(id);
    this.closeModal();
    this.renderDashboard();

    if (serverId) {
      try {
        await Api.deleteTransaction(serverId);
      } catch {
        /* Silently fail — data removed locally */
      }
    }
  },

  closeModal() {
    this.dom.modalOverlay.style.display = "none";
    this.pendingDeleteId = null;
  },

  /* ---- Event Binding ---- */
  bindEvents() {
    this.dom.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.dom.cancelBtn.addEventListener("click", () => this.resetForm());

    this.dom.tableBody.addEventListener("click", (e) => {
      const editBtn = e.target.closest("[data-edit]");
      const deleteBtn = e.target.closest("[data-delete]");
      if (editBtn) this.showFormForEdit(editBtn.dataset.edit);
      if (deleteBtn) this.confirmDelete(deleteBtn.dataset.delete);
    });

    this.dom.filterCategory.addEventListener("change", () => this.renderDashboard());
    this.dom.filterType.addEventListener("change", () => this.renderDashboard());

    this.dom.modalConfirm.addEventListener("click", () => this.executeDelete());
    this.dom.modalCancel.addEventListener("click", () => this.closeModal());
    this.dom.modalOverlay.addEventListener("click", (e) => {
      if (e.target === this.dom.modalOverlay) this.closeModal();
    });

    [this.dom.description, this.dom.amount].forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("error"));
    });
  },

  /* ---- Init ---- */
  async init() {
    this.cacheDom();
    this.dom.date.value = this.getTodayISO();
    this.bindEvents();

    await Api.loadCategoriesFromServer();
    this.populateCategorySelects();
    this.renderDashboard();

    setInterval(() => Api.syncPendingTransactions(), 30000);
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
