const isValidISODate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
};

const calculateDueDate = (borrowedAt) => {
    const date = new Date(borrowedAt);
    date.setDate(date.getDate() + 14);
    return date.toISOString();
};

// New helper to calculate overdue days
const calculateOverdueDays = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const now = new Date();
    const dueDate = new Date(dueDateStr);
    const diff = now - dueDate; // milliseconds
    const days = Math.floor(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
};

module.exports = { isValidISODate, calculateDueDate, calculateOverdueDays };


