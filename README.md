
# Global User Dashboard (Assignment 2)

A Node.js web application that integrates four different external APIs to create a dynamic user dashboard. The application fetches a random user identity, determines their location, and automatically retrieves relevant country data, exchange rates (USD & KZT), and local news headlines.

## 🚀 Features

* **Random User Generation:** Fetches a unique user identity with personal details (Name, Age, Gender, Address).
* **Country Intelligence:** Automatically detects the user's country and retrieves the capital, language, and flag.
* **Real-time Exchange Rates:** Displays the current value of the local currency against USD and Kazakhstani Tenge (KZT).
* **Local News Feed:** Fetches the top 5 English-language news headlines relevant to the user's specific country.
* **Secure Backend Logic:** All API requests are handled server-side to protect API keys and ensure security.
* **Responsive Design:** Features a modern, dark-themed UI that works on mobile and desktop.

## 🛠️ Technologies Used

* **Backend:** Node.js, Express.js
* **HTTP Client:** Axios
* **Frontend:** HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript
* **Environment Management:** Dotenv

## 🔌 API Usage

This project integrates the following services:

1. **Random User Generator API** (https://randomuser.me/api/)
    * *Role:* Provides the initial seed data (random person, location coordinates).
    * *Auth:* Public (No key required).

2. **CountryLayer API** (https://countrylayer.com/)
    * *Role:* Retrieves detailed country information (Capital, Currency, Region) based on the user's location.
    * *Auth:* API Key required.

3. **ExchangeRate-API** (https://www.exchangerate-api.com/)
    * *Role:* Calculates conversion rates from the user's local currency to USD and Kazakhstani Tenge (KZT).
    * *Auth:* API Key required.

4. **NewsAPI** (https://newsapi.org/)
    * *Role:* Fetches the latest 5 English-language news headlines for the specific country.
    * *Auth:* API Key required.

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

This project requires API keys to run. Create a file named `.env` in the root directory (same level as `server.js`) and add your keys:

```plaintext
COUNTRY_API_KEY=your_countrylayer_key_here
EXCHANGE_API_KEY=your_exchangerate_key_here
NEWS_API_KEY=your_newsapi_key_here
```

### 4. Run the Server
```bash
node server.js
```

### 5. Access the App

Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure
```plaintext
├── node_modules/       # Dependencies
├── public/             # Frontend Static Files
│   ├── index.html      # Main user interface
│   ├── style.css       # Dark mode styling
│   └── script.js       # Client-side UI logic
├── .env                # API Keys (Not shared on GitHub)
├── .gitignore          # Ignores node_modules and .env
├── package.json        # Project metadata and dependencies
├── server.js           # Main server logic & API chaining
└── README.md           # Documentation
```

## 💡 Key Design Decisions

### Server-Side Logic Implementation:
**Decision:** All API requests are chained and executed inside `server.js` rather than the browser.  
**Reason:** The assignment specifically required logic to be inside the core JS file. Furthermore, this hides the API keys from the client-side (browser inspection), preventing unauthorized use and quota theft.

### Secure Key Management (.env):
**Decision:** Storing sensitive keys in a `.env` file instead of hardcoding them.  
**Reason:** This is a security best practice. It ensures keys are not exposed if the source code is pushed to public repositories like GitHub.

### Sequential API Chaining:
**Decision:** The backend uses `await` to ensure strict data dependency. We wait for the "User" data to resolve so we have a country name before asking for "News".  
**Reason:** This prevents errors where the app might try to fetch news for an "undefined" country. It ensures data integrity across the pipeline.
