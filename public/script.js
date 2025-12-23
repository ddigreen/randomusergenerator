document.getElementById('fetch-btn').addEventListener('click', async () => {
    const dashboard = document.getElementById('dashboard');
    const loading = document.getElementById('loading');

    // Show loading, hide dashboard
    loading.classList.remove('hidden');
    dashboard.classList.add('hidden');

    try {
        const response = await fetch('/get-data', { method: 'POST' }); // Call our Node server
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // 1. Populate User Info
        document.getElementById('user-img').src = data.user.pic;
        document.getElementById('user-name').innerText = `${data.user.first} ${data.user.last}`;
        document.getElementById('user-gender').innerText = data.user.gender;
        document.getElementById('user-age').innerText = data.user.age;
        document.getElementById('user-dob').innerText = data.user.dob;
        document.getElementById('user-location').innerText = `${data.user.city}, ${data.user.country}`;
        document.getElementById('user-address').innerText = data.user.address;

        // 2. Populate Country Info
        document.getElementById('country-name').innerText = data.countryInfo.name;
        document.getElementById('country-capital').innerText = data.countryInfo.capital;
        document.getElementById('country-lang').innerText = data.countryInfo.language;

        // 3. Populate Exchange Rates
        document.getElementById('base-curr').innerText = data.rates.base;
        document.getElementById('rate-usd').innerText = data.rates.usd;
        document.getElementById('rate-kzt').innerText = data.rates.kzt;

        // 4. Populate News [cite: 72-76]
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = ''; // Clear old news

        data.news.forEach(article => {
            if (!article.title || article.title === "[Removed]") return; // Skip broken articles

            const newsCard = `
                <div class="news-card">
                    <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="News Image">
                    <div class="news-content">
                        <h3>${article.title}</h3>
                        <p>${article.description || 'No description available.'}</p>
                        <a href="${article.url}" target="_blank">Read More</a>
                    </div>
                </div>
            `;
            newsContainer.innerHTML += newsCard;
        });

        // Show dashboard
        loading.classList.add('hidden');
        dashboard.classList.remove('hidden');

    } catch (err) {
        alert("Error fetching data: " + err.message);
        loading.classList.add('hidden');
    }
});