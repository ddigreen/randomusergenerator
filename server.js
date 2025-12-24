require('dotenv').config();
const express = require('express');
const axios = require('axios'); // Tool to call other APIs
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/get-data', async (req, res) => {
    try {
        const userRes = await axios.get('https://randomuser.me/api/');
        const user = userRes.data.results[0];
        const countryName = user.location.country;


        const countryRes = await axios.get(`http://api.countrylayer.com/v2/name/${countryName}?access_key=${process.env.COUNTRY_API_KEY}`);

        const countryData = countryRes.data[0] || {};
        const currencyCode = countryData.currencies ? countryData.currencies[0].code : 'USD'; // Fallback to USD if not found

        const exchangeRes = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${currencyCode}`);
        const rates = exchangeRes.data.conversion_rates;

        const newsRes = await axios.get(`https://newsapi.org/v2/everything?q=${countryName}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`);

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
                address: `${user.location.street.number} ${user.location.street.name}`
            },
            countryInfo: {
                name: countryData.name,
                capital: countryData.capital,
                language: countryData.languages ? countryData.languages[0].name : 'N/A',
                currency: currencyCode,
                flag: countryData.flag
            },
            rates: {
                base: currencyCode,
                usd: rates.USD,
                kzt: rates.KZT
            },
            news: newsRes.data.articles
        });

    } catch (error) {
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