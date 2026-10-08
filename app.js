const usernameInput = document.getElementById('usernameInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsContainer = document.getElementById('resultsContainer');

const platformConfig = {
    tiktok: { label: 'TikTok', url: 'https://www.tiktok.com/@' },
    discord: { label: 'Discord', url: 'https://discord.com/users/' },
    twitter: { label: 'Twitter (X)', url: 'https://x.com/' },
    instagram: { label: 'Instagram', url: 'https://www.instagram.com/' },
    twitch: { label: 'Twitch', url: 'https://www.twitch.tv/' },
    snapchat: { label: 'Snapchat', url: 'https://www.snapchat.com/add/' },
    telegram: { label: 'Telegram', url: 'https://t.me/' },
    youtube: { label: 'YouTube', url: 'https://www.youtube.com/@' }
};

function getSelectedLengths() {
    return [...document.querySelectorAll('input[name="length"]:checked')].map(item => Number(item.value));
}

function getSelectedPlatforms() {
    return [...document.querySelectorAll('input[name="platform"]:checked')].map(item => item.value);
}

function generateNames(baseText) {
    const lengths = getSelectedLengths();
    const names = new Set();

    if (!baseText.trim()) {
        return [...names];
    }

    lengths.forEach(length => {
        const name = baseText.trim().slice(0, length);
        if (name.length === length) {
            names.add(name);
        }
    });

    return [...names];
}

function randomizeStatus() {
    const statuses = ['available', 'taken', 'unknown'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function renderResults(items) {
    resultsContainer.innerHTML = '';

    if (!items.length) {
        resultsContainer.innerHTML = `
            <div class="result-card">
                <div class="result-body">
                    <div class="user-value">No results</div>
                    <div class="meta">يرجى إدخال قيمة أولاً أو اختيار نوع البحث المناسب.</div>
                </div>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const statusClass = item.status === 'available' ? 'available' : item.status === 'taken' ? 'taken' : 'unknown';
        const statusText = item.status === 'available' ? 'متاح' : item.status === 'taken' ? 'مستخدم' : 'غير معروف';

        card.innerHTML = `
            <div class="result-header">
                <span class="platform-name">${item.platform}</span>
                <span class="status ${statusClass}">${statusText}</span>
            </div>
            <div class="result-body">
                <div class="user-value">${item.username}</div>
                <div class="meta">
                    الطول: ${item.length}<br>
                    الرابط: <a href="${item.link}" target="_blank" rel="noreferrer">فتح المنصة</a>
                </div>
            </div>
        `;

        resultsContainer.appendChild(card);
    });
}

function searchUsernames() {
    const baseText = usernameInput.value.trim();
    const selectedPlatforms = getSelectedPlatforms();
    const generatedNames = generateNames(baseText);

    if (!generatedNames.length || !selectedPlatforms.length) {
        renderResults([]);
        return;
    }

    loadingSpinner.style.display = 'block';

    setTimeout(() => {
        const results = [];

        generatedNames.forEach(username => {
            selectedPlatforms.forEach(platformKey => {
                const config = platformConfig[platformKey];
                const status = randomizeStatus();

                results.push({
                    username,
                    length: username.length,
                    platform: config.label,
                    status,
                    link: `${config.url}${username}`
                });
            });
        });

        loadingSpinner.style.display = 'none';
        renderResults(results);
    }, 600);
}

searchBtn.addEventListener('click', searchUsernames);
usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchUsernames();
    }
});

renderResults([]);
