"use strict";

const App = {
  editingId: null,
  pendingDeleteId: null,
  installmentValueEdited: false,

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
      installmentSection: document.getElementById("installmentSection"),
      isInstallment: document.getElementById("isInstallment"),
      installmentFields: document.getElementById("installmentFields"),
      installments: document.getElementById("installments"),
      installmentValue: document.getElementById("installmentValue"),
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

  populateCategorySelects(filterType) {
    const categories = Storage.getCategories();

    if (filterType) {
      const filtered = categories.filter((c) => c.type === filterType);
      this.dom.category.innerHTML = '<option value="">Sem categoria</option>' +
        filtered.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
    } else {
      this.dom.category.innerHTML = '<option value="">Sem categoria</option>' +
        categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
    }

    this.dom.filterCategory.innerHTML = '<option value="">Todas categorias</option>' +
      categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  },

  async onTypeChange() {
    const type = parseInt(this.dom.type.value);
    this.dom.category.value = "";
    this.populateCategorySelects(type);
    this.toggleInstallmentFields();
  },

  /* ---- Installment ---- */
  toggleInstallmentFields() {
    const type = parseInt(this.dom.type.value);
    if (type !== 2) {
      this.dom.installmentSection.style.display = "none";
      this.dom.isInstallment.checked = false;
      this.dom.installmentFields.style.display = "none";
      this.dom.installments.value = "";
      this.dom.installmentValue.value = "";
      this.installmentValueEdited = false;
    } else {
      this.dom.installmentSection.style.display = "";
    }
  },

  autoCalcInstallmentValue(source) {
    const amount = parseFloat(this.dom.amount.value);
    const installments = parseInt(this.dom.installments.value);

    if (!this.dom.isInstallment.checked || isNaN(amount) || amount <= 0 || isNaN(installments) || installments < 2)
      return;

    if (source === "installments" || source === "amount") {
      const calculated = Math.round((amount / installments) * 100) / 100;
      this.dom.installmentValue.value = calculated.toFixed(2);
      this.installmentValueEdited = false;
    }
  },

  onInstallmentToggle() {
    if (this.dom.isInstallment.checked) {
      this.dom.installmentFields.style.display = "";
      this.installmentValueEdited = false;
      this.autoCalcInstallmentValue("installments");
    } else {
      this.dom.installmentFields.style.display = "none";
      this.dom.installments.value = "";
      this.dom.installmentValue.value = "";
      this.installmentValueEdited = false;
      this.dom.installments.classList.remove("error");
      this.dom.installmentValue.classList.remove("error");
    }
  },

  onInstallmentValueInput() {
    this.installmentValueEdited = true;
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

        const installmentBadge = t.installments
          ? `<span class="installment-badge">1/${t.installments} parcelas</span>`
          : "";

        return `
          <tr>
            <td>${this.formatDate(t.date)}</td>
            <td>${this.escapeHtml(t.description)}${syncBadge}${installmentBadge}</td>
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
    this.dom.isInstallment.checked = false;
    this.dom.installmentFields.style.display = "none";
    this.dom.installments.value = "";
    this.dom.installmentValue.value = "";
    this.installmentValueEdited = false;
    this.toggleInstallmentFields();
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
    this.dom.formTitle.textContent = "Editar Transação";
    this.dom.submitBtn.textContent = "Atualizar";
    this.dom.cancelBtn.style.display = "inline-block";

    this.populateCategorySelects(t.type);
    this.dom.category.value = t.categoryId || "";

    if (t.installments && t.type === 2) {
      this.dom.installmentSection.style.display = "";
      this.dom.isInstallment.checked = true;
      this.dom.installmentFields.style.display = "";
      this.dom.installments.value = t.installments;
      this.dom.installmentValue.value = t.installmentValue ?? "";
      this.installmentValueEdited = true;
    } else {
      this.dom.installmentSection.style.display = "";
      this.dom.isInstallment.checked = false;
      this.dom.installmentFields.style.display = "none";
      this.dom.installments.value = "";
      this.dom.installmentValue.value = "";
      this.installmentValueEdited = false;
    }

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

    let installments = null;
    let installmentValue = null;

    if (this.dom.isInstallment.checked) {
      installments = parseInt(this.dom.installments.value);
      installmentValue = parseFloat(this.dom.installmentValue.value);

      if (!installments || installments < 2 || !installmentValue || installmentValue <= 0) {
        this.showFieldErrors();
        return;
      }
    }

    if (this.editingId) {
      this.updateExisting(description, amount, type, date, categoryId, installments, installmentValue);
    } else {
      this.createNew(description, amount, type, date, categoryId, installments, installmentValue);
    }
  },

  async createNew(description, amount, type, date, categoryId, installments, installmentValue) {
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
      installments,
      installmentValue,
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

  async updateExisting(description, amount, type, date, categoryId, installments, installmentValue) {
    const serverId = this.getServerId(this.editingId);

    Storage.updateTransaction(this.editingId, {
      description,
      amount,
      date: new Date(date + "T00:00:00").toISOString(),
      type,
      categoryId,
      syncStatus: "pending",
      installments,
      installmentValue,
    });

    this.resetForm();
    this.renderDashboard();

    if (serverId) {
      try {
        const data = { description, amount, type, date, categoryId, installments, installmentValue };
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

    if (this.dom.isInstallment.checked) {
      [this.dom.installments, this.dom.installmentValue].forEach((el) => {
        if (!el.value || (el.type === "number" && parseFloat(el.value) <= 0)) {
          el.classList.add("error");
        } else {
          el.classList.remove("error");
        }
      });
    }
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

    this.dom.type.addEventListener("change", () => this.onTypeChange());

    this.dom.modalConfirm.addEventListener("click", () => this.executeDelete());
    this.dom.modalCancel.addEventListener("click", () => this.closeModal());
    this.dom.modalOverlay.addEventListener("click", (e) => {
      if (e.target === this.dom.modalOverlay) this.closeModal();
    });

    [this.dom.description, this.dom.amount].forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("error"));
    });

    this.dom.isInstallment.addEventListener("change", () => this.onInstallmentToggle());
    this.dom.installments.addEventListener("input", () => {
      this.dom.installments.classList.remove("error");
      this.autoCalcInstallmentValue("installments");
    });
    this.dom.amount.addEventListener("input", () => {
      this.autoCalcInstallmentValue("amount");
    });
    this.dom.installmentValue.addEventListener("input", () => {
      this.dom.installmentValue.classList.remove("error");
      this.onInstallmentValueInput();
    });
  },

  /* ---- Init ---- */
  async init() {
    this.cacheDom();
    this.dom.date.value = this.getTodayISO();
    this.bindEvents();

    await Api.loadCategoriesFromServer();
    const defaultType = parseInt(this.dom.type.value);
    this.populateCategorySelects(defaultType);
    this.renderDashboard();

    setInterval(() => Api.syncPendingTransactions(), 30000);
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
