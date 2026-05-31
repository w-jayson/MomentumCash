"use strict";

const STORAGE_KEYS = {
  TRANSACTIONS: "cf_transactions",
  CATEGORIES: "cf_categories",
};

const Storage = {
  getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  addTransaction(transaction) {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
    return transaction;
  },

  updateTransaction(id, data) {
    const transactions = this.getTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    transactions[index] = { ...transactions[index], ...data };
    this.saveTransactions(transactions);
    return transactions[index];
  },

  deleteTransaction(id) {
    const transactions = this.getTransactions().filter((t) => t.id !== id);
    this.saveTransactions(transactions);
  },

  getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
};
