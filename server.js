require('dotenv').config(); // Load API keys from .env file
const express = require('express');
const axios = require('axios'); // Tool to call other APIs
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Main Route to serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// THE CORE LOGIC: Fetch all data in one go
// Source: "Logic must be implemented inside your core js file" [cite: 92]
app.post('/get-data', async (req, res) => {
    try {
        // 1. Random User API [cite: 44]
        const userRes = await axios.get('https://randomuser.me/api/');
        const user = userRes.data.results[0];
        const countryName = user.location.country;

        // 2. CountryLayer API [cite: 57]
        // We use the country name from Step 1 to get country details
        // Note: Free tier often requires http, not https. Using process.env for security [cite: 61]
        const countryRes = await axios.get(`http://api.countrylayer.com/v2/name/${countryName}?access_key=${process.env.COUNTRY_API_KEY}`);

        // Handle "missing or unavailable data" [cite: 63]
        const countryData = countryRes.data[0] || {};
        const currencyCode = countryData.currencies ? countryData.currencies[0].code : 'USD'; // Fallback to USD if not found

        // 3. Exchange Rate API [cite: 65]
        // We use the currency code from Step 2
        const exchangeRes = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${currencyCode}`);
        const rates = exchangeRes.data.conversion_rates;

        // 4. News API [cite: 69]
        // specific query: q=CountryName, language=en, pageSize=5 [cite: 71]
        const newsRes = await axios.get(`https://newsapi.org/v2/everything?q=${countryName}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`);

        // 5. Package everything and send to frontend [cite: 64]
        res.json({
            user: {
                first: user.name.first,
                last: user.name.last,
                gender: user.gender,
                pic: user.picture.large,
                age: user.dob.age,
                dob: new Date(user.dob.date).toLocaleDateString(),
                city: user.location.city,
                country: user.location.country,
                address: `${user.location.street.number} ${user.location.street.name}` // [cite: 54]
            },
            countryInfo: {
                name: countryData.name,
                capital: countryData.capital,
                language: countryData.languages ? countryData.languages[0].name : 'N/A',
                currency: currencyCode,
                flag: countryData.flag // Usually an image URL usually provided by API, or we can use alpha2Code
            },
            rates: {
                base: currencyCode,
                usd: rates.USD,
                kzt: rates.KZT // [cite: 66]
            },
            news: newsRes.data.articles // Array of 5 articles
        });

    } catch (error) {
        // This will print EXACTLY which URL failed in your terminal
        if (error.response) {
            console.error(`ERROR caused by: ${error.config.url}`);
            console.error(`Status Code: ${error.response.status}`);
            console.error(`Reason:`, error.response.data);
        } else {
            console.error("Error:", error.message);
        }
        res.status(500).json({ error: "Check terminal for error details." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});