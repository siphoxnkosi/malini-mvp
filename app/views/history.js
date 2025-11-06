import { bills } from '../mockApi.js';
import { formatCurrency } from '../utils.js';

function createTableRow(bill) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${new Date(bill.createdAt).toLocaleString()}</td>
        <td>${formatCurrency(bill.total)}</td>
        <td><span class="status status-${bill.status}">${bill.status}</span></td>
        <td><button><i data-lucide="more-vertical"></i></button></td>
    `;
    return tr;
}

export default function history() {
    const element = document.createElement('main');
    element.classList.add('history-container');

    element.innerHTML = `
        <h1>Past Bills</h1>
        <div class="history-controls">
            <input type="search" id="search-history" placeholder="Search by table or date...">
            <div class="filter-chips">
                <button data-status="all" class="active">All</button>
                <button data-status="settled">Settled</button>
                <button data-status="pending">Pending</button>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <div class="pagination"></div>
    `;

    const tableBody = element.querySelector('tbody');
    const pagination = element.querySelector('.pagination');

    let currentPage = 1;
    let currentStatus = 'all';
    let currentQuery = '';

    async function loadHistory() {
        const { bills: billList, total } = await bills.list({
            page: currentPage,
            status: currentStatus,
            q: currentQuery
        });

        tableBody.innerHTML = '';
        billList.forEach(bill => {
            tableBody.appendChild(createTableRow(bill));
        });

        // Render pagination controls
        pagination.innerHTML = '';
        const pageCount = Math.ceil(total / 10);
        for (let i = 1; i <= pageCount; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                loadHistory();
            });
            pagination.appendChild(pageBtn);
        }
    }

    element.querySelector('#search-history').addEventListener('input', (e) => {
        currentQuery = e.target.value;
        currentPage = 1;
        loadHistory();
    });

    element.querySelectorAll('.filter-chips button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentStatus = btn.dataset.status;
            currentPage = 1;
            loadHistory();
            // Update active chip style
        });
    });

    loadHistory();

    return element;
}
