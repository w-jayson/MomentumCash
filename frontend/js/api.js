"use strict";

const API_BASE = "/api";

const Api = {
  async apiFetch(url, options = {}) {
    const defaultHeaders = { "Content-Type": "application/json" };
    const config = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${url}`, config);

    if (!response.ok) {
      const errorBody = await response.text();
      let message;
      try {
        const parsed = JSON.parse(errorBody);
        message = parsed.error || parsed.title || errorBody;
      } catch {
        message = errorBody || `HTTP ${response.status}`;
      }
      throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
  },

  async fetchCategories(type) {
    const query = type ? `?type=${type}` : "";
    return this.apiFetch(`/categories${query}`);
  },

  async createCategory(name, type) {
    return this.apiFetch("/categories", { method: "POST", body: { name, type } });
  },

  async createTransaction(transaction) {
    return this.apiFetch("/transactions", {
      method: "POST",
      body: {
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        categoryId: transaction.categoryId || null,
        installments: transaction.installments || null,
        installmentValue: transaction.installmentValue || null,
      },
    });
  },

  async updateTransaction(id, transaction) {
    return this.apiFetch(`/transactions/${id}`, {
      method: "PUT",
      body: {
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        categoryId: transaction.categoryId || null,
        installments: transaction.installments || null,
        installmentValue: transaction.installmentValue || null,
      },
    });
  },

  async deleteTransaction(id) {
    return this.apiFetch(`/transactions/${id}`, { method: "DELETE" });
  },

  syncPendingTransactions() {
    const transactions = Storage.getTransactions();
    const pending = transactions.filter((t) => t.syncStatus === "pending");

    pending.forEach(async (t) => {
      try {
        if (t.serverId) {
          await this.updateTransaction(t.serverId, t);
        } else {
          const result = await this.createTransaction(t);
          Storage.updateTransaction(t.id, {
            serverId: result.id,
            syncStatus: "synced",
          });
          return;
        }
        Storage.updateTransaction(t.id, { syncStatus: "synced" });
      } catch {
        /* Retry on next cycle */
      }
    });
  },

  async loadCategoriesFromServer(type) {
    try {
      const categories = await this.fetchCategories(type);
      Storage.saveCategories(categories);
      return categories;
    } catch {
      return Storage.getCategories();
    }
  },
};
