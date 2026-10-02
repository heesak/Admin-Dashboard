const defaultCards = [
    {
        id: 1,
        name: 'ETH',
        amount: 827199,
        date: '2024-08-18',
        holder: 'John Doe',
        expiry: '08/23',
        cvv: '123',
        brand: 'visa',
        color: 'red'
    },
    {
        id: 2,
        name: 'BTC',
        amount: 95623,
        date: '2024-06-12',
        holder: 'John Doe',
        expiry: '08/23',
        cvv: '123',
        brand: 'mastercard',
        color: 'dark'
    },
    {
        id: 3,
        name: 'ADA',
        amount: 74384,
        date: '2024-03-15',
        holder: 'John Doe',
        expiry: '08/24',
        cvv: '123',
        brand: 'visa',
        color: 'purple'
    }
];

const state = {
    cards: [...defaultCards],
    sortBy: 'date',
    searchTerm: '',
    dateFilter: ''
};

const cardsContainer = document.querySelector('#cards-container');
const searchInput = document.querySelector('#card-search');
const sortSelect = document.querySelector('#card-sort');
const dateFilterInput = document.querySelector('#card-date-filter');
const addCardBtn = document.querySelector('#add-card-btn');
const modal = document.querySelector('#card-modal');
const cardForm = document.querySelector('#card-form');
const closeButtons = document.querySelectorAll('.close-modal');

const paletteMap = {
    red: 'linear-gradient(#ff796f, #bd261b)',
    dark: 'linear-gradient(#7f8191, #27282f)',
    purple: 'linear-gradient(#5d70ff, #5719c2)',
    orange: 'linear-gradient(#ffb366, #ee7d00)',
    green: 'linear-gradient(#6bd08d, #1e7c48)'
};

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

const getCardIcon = (cardName) => {
    const normalizedName = cardName.toUpperCase();
    if (normalizedName.includes('BTC')) return './images/BTC.png';
    if (normalizedName.includes('ETH')) return './images/ETH.png';
    return './images/BTC.png';
};

const getBrandImage = (brand) => {
    if (brand === 'mastercard') return './images/master card.png';
    if (brand === 'amex') return './images/visa.png';
    return './images/visa.png';
};

const filterCards = (cards, searchTerm, dateFilter) => {
    return cards.filter((card) => {
        const matchesSearch = !searchTerm || [
            card.name,
            card.holder,
            card.brand,
            String(card.amount),
            card.date
        ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDate = !dateFilter || card.date >= dateFilter;

        return matchesSearch && matchesDate;
    });
};

const sortCards = (cards, sortBy) => {
    const sortedCards = [...cards];

    switch (sortBy) {
        case 'alphabet':
            sortedCards.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price':
            sortedCards.sort((a, b) => Number(b.amount) - Number(a.amount));
            break;
        case 'date':
        default:
            sortedCards.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }

    return sortedCards;
};

const createCardMarkup = (card, index) => {
    const background = paletteMap[card.color] || paletteMap.red;

    return `
        <article class="card" style="background: ${background};" data-name="${card.name}" data-date="${card.date}" data-price="${card.amount}">
            <div class="top">
                <div class="left">
                    <img src="${getCardIcon(card.name)}" alt="${card.name} icon">
                    <h2>${card.name}</h2>
                </div>
                <img src="${getBrandImage(card.brand)}" class="right" alt="${card.brand} logo">
            </div>
            <div class="middle">
                <h1>${formatCurrency(card.amount)}</h1>
                <div class="chip">
                    <img src="./images/card chip.png" alt="chip">
                </div>
            </div>
            <div class="bottom">
                <div class="left">
                    <small>Card Holder</small>
                    <h5>${card.holder}</h5>
                </div>
                <div class="right">
                    <div class="expiry">
                        <small>Expiry</small>
                        <h5>${card.expiry}</h5>
                    </div>
                    <div class="cvv">
                        <small>CVV</small>
                        <h5>${card.cvv}</h5>
                    </div>
                </div>
            </div>
        </article>
    `;
};

const renderCards = () => {
    const filteredCards = sortCards(
        filterCards(state.cards, state.searchTerm, state.dateFilter),
        state.sortBy
    );

    if (!filteredCards.length) {
        cardsContainer.innerHTML = '<div class="empty-state">No cards match your search.</div>';
        return;
    }

    cardsContainer.innerHTML = filteredCards
        .map((card, index) => createCardMarkup(card, index))
        .join('');
};

const openModal = () => {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    cardForm.reset();
};

const chart = document.querySelector('#chart');

if (chart) {
    const chartContext = chart.getContext('2d');

    new Chart(chartContext, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'BTC',
                    data: [29374, 33537, 49631, 59095, 57828, 36684, 36684, 39974, 48847, 48116, 61004],
                    borderColor: 'red',
                    borderWidth: '2'
                },
                {
                    label: 'ETH',
                    data: [31500, 41000, 88800, 26000, 46000, 32698, 5000, 3000, 18656, 24832, 36844],
                    borderColor: 'blue',
                    borderWidth: '2'
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}

searchInput.addEventListener('input', (event) => {
    state.searchTerm = event.target.value.trim();
    renderCards();
});

sortSelect.addEventListener('change', (event) => {
    state.sortBy = event.target.value;
    renderCards();
});

dateFilterInput.addEventListener('change', (event) => {
    state.dateFilter = event.target.value;
    renderCards();
});

addCardBtn.addEventListener('click', openModal);
closeButtons.forEach((button) => button.addEventListener('click', closeModal));

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

cardForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(cardForm);
    const name = String(formData.get('name') || '').trim().toUpperCase() || 'NEW';
    const amount = Number(formData.get('amount') || 0);
    const date = String(formData.get('date') || '').trim();
    const holder = String(formData.get('holder') || '').trim() || 'John Doe';
    const expiry = String(formData.get('expiry') || '').trim() || '08/30';
    const cvv = String(formData.get('cvv') || '').trim() || '123';
    const brand = String(formData.get('brand') || 'visa');

    state.cards.unshift({
        id: Date.now(),
        name,
        amount,
        date,
        holder,
        expiry,
        cvv,
        brand,
        color: ['red', 'dark', 'purple', 'orange', 'green'][state.cards.length % 5]
    });

    closeModal();
    renderCards();
});

const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-btn');
const sidebar = document.querySelector('aside');

if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
        sidebar.style.display = 'block';
    });
}

if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
        sidebar.style.display = 'none';
    });
}

const themeBtn = document.querySelector('.theme-btn');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeBtn.querySelector('span:first-child').classList.toggle('active');
        themeBtn.querySelector('span:last-child').classList.toggle('active');
    });
}

renderCards();
