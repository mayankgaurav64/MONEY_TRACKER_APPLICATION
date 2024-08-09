let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

const expenseChartCtx = document.getElementById('expenseChart').getContext('2d');
const categoryChartCtx = document.getElementById('categoryChart').getContext('2d');

let expenseChart = new Chart(expenseChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Expenses Over Time',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

let categoryChart = new Chart(categoryChartCtx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Income vs Expense',
            data: [0, 0],
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

addBtn.addEventListener('click', function(event) {
    event.preventDefault();

    const category = categorySelect.value;
    const info = infoInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (info === '') {
        alert('Please enter valid info');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    expenses.push({ category, amount, info, date });
    if (category === 'Income') {
        totalAmount += amount;
    }
    if (category === 'Expense') {
        totalAmount -= amount;
    }
    totalAmountCell.textContent = totalAmount;

    const newRow = expenseTableBody.insertRow();
    newRow.classList.add('expense-row');

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        expenses.splice(expenses.indexOf(expense), 1);
        if (category === 'Income') {
            totalAmount -= amount;
        }
        if (category === 'Expense') {
            totalAmount += amount;
        }

        totalAmountCell.textContent = totalAmount;
        expenseTableBody.removeChild(newRow);
        updateCharts();
    });

    const expense = expenses[expenses.length - 1];
    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    infoCell.textContent = expense.info;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);

    updateCharts();
});

function updateCharts() {
    const dates = expenses.map(exp => exp.date);
    const amounts = expenses.map(exp => exp.amount);
    const incomeSum = expenses.filter(exp => exp.category === 'Income').reduce((sum, exp) => sum + exp.amount, 0);
    const expenseSum = expenses.filter(exp => exp.category === 'Expense').reduce((sum, exp) => sum + exp.amount, 0);

    expenseChart.data.labels = dates;
    expenseChart.data.datasets[0].data = amounts;
    expenseChart.update();

    categoryChart.data.datasets[0].data = [incomeSum, expenseSum];
    categoryChart.update();
}

for (const expense of expenses) {
    const newRow = expenseTableBody.insertRow();
    newRow.classList.add('expense-row');

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        expenses.splice(expenses.indexOf(expense), 1);
        if (expense.category === 'Income') {
            totalAmount -= expense.amount;
        }
        if (expense.category === 'Expense') {
            totalAmount += expense.amount;
        }

        totalAmountCell.textContent = totalAmount;
        expenseTableBody.removeChild(newRow);
        updateCharts();
    });

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    infoCell.textContent = expense.info;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);
}
