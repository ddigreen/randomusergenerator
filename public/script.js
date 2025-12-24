document.getElementById('fetch-btn').addEventListener('click', async () => {
    // 1. Get Elements based on the NEW HTML structure
    const loading = document.getElementById('loading');
    const userSection = document.getElementById('user-section');
    const mainContent = document.getElementById('main-content');

    // 2. UI State: Show Loading, Hide Content
    loading.classList.remove('hidden');
    userSection.classList.add('hidden');
    mainContent.classList.add('hidden');

    try {
        const response = await fetch('/get-data', { method: 'POST' });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // 3. Populate User Side (Left Sidebar)
        document.getElementById('user-img').src = data.user.pic;
        document.getElementById('user-name').innerText = `${data.user.first} ${data.user.last}`;
        document.getElementById('user-age').innerText = data.user.age;
        document.getElementById('user-gender').innerText = data.user.gender;
        document.getElementById('user-address').innerText = data.user.country; // Using country for residence label
        document.getElementById('user-dob').innerText = data.user.dob;

        // 4. Populate Main Content (Right Side)
        document.getElementById('country-name').innerText = data.countryInfo.name;
        document.getElementById('country-capital').innerText = data.countryInfo.capital;

        // 5. Populate Exchange Rates
        document.getElementById('base-curr').innerText = data.rates.base;
        document.getElementById('rate-usd').innerText = data.rates.usd;
        document.getElementById('rate-kzt').innerText = data.rates.kzt;

        // 6. Populate News (Clean List Style)
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';

        data.news.forEach(article => {
            if (!article.title || article.title === "[Removed]") return;

            // Simple Row Layout
            const newsItem = `
                <a href="${article.url}" target="_blank" class="news-item">
                    <img src="${article.urlToImage || 'https://via.placeholder.com/60'}" alt="News">
                    <div class="news-text">
                        <h4>${article.title}</h4>
                        <p>Read full story &rarr;</p>
                    </div>
                </a>
            `;
            newsContainer.innerHTML += newsItem;
        });

        // 7. UI State: Hide Loading, Show Content
        loading.classList.add('hidden');
        userSection.classList.remove('hidden');
        mainContent.classList.remove('hidden');

    } catch (err) {
        alert("Error fetching data: " + err.message);
        console.error(err);
        loading.classList.add('hidden');
    }
});