document.getElementById('fetch-btn').addEventListener('click', async () => {

    const loading = document.getElementById('loading');
    const content = document.getElementById('content');

    // 1. Show Loading
    loading.classList.remove('hidden');
    content.classList.add('hidden');

    try {
        const response = await fetch('/get-data', { method: 'POST' });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // 2. Populate User Info
        document.getElementById('user-img').src = data.user.pic;
        document.getElementById('user-name').innerText = `${data.user.first} ${data.user.last}`;
        document.getElementById('user-age').innerText = data.user.age;
        document.getElementById('user-gender').innerText = data.user.gender;
        document.getElementById('country-name').innerText = data.countryInfo.name;

        // 3. Populate Stats
        document.getElementById('country-capital').innerText = data.countryInfo.capital;
        document.getElementById('base-curr').innerText = data.rates.base;
        document.getElementById('rate-usd').innerText = data.rates.usd;
        document.getElementById('rate-kzt').innerText = data.rates.kzt;

        // 4. Populate News Grid with IMAGES
        const newsGrid = document.getElementById('news-grid');
        newsGrid.innerHTML = '';

        data.news.forEach(article => {
            if (!article.title || article.title === "[Removed]") return;

            // Use the API image, or a gray placeholder if image is missing
            const imageUrl = article.urlToImage ? article.urlToImage : 'https://via.placeholder.com/400x200?text=No+Image';

            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';

            newsCard.innerHTML = `
                <img src="${imageUrl}" alt="News Image" class="news-image" onerror="this.src='https://via.placeholder.com/400x200?text=Image+Error'">
                <div class="news-content">
                    <h4>${article.title}</h4>
                    <a href="${article.url}" target="_blank" class="read-more">Read Full Story &rarr;</a>
                </div>
            `;

            newsGrid.appendChild(newsCard);
        });

        // 5. Show Content
        loading.classList.add('hidden');
        content.classList.remove('hidden');

    } catch (err) {
        alert("Error: " + err.message);
        loading.classList.add('hidden');
    }
});