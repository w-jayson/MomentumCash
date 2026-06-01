export function useFormat() {
  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatDate(dateStr) {
    const parts = dateStr.split('T')[0].split('-')
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  function getTodayISO() {
    return new Date().toISOString().split('T')[0]
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  return { formatCurrency, formatDate, getTodayISO, escapeHtml }
}
