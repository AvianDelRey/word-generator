const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // If you prefer axios, install it and use it instead
const cors = require('cors')
const path = require('path');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://127.0.0.1:5501' })); // Allow only this origin

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'main')));

// DeepL API Credentials
const authKey = 'ff7e49fc-e61e-4295-9221-89b892ae7e61:fx'; // Replace with your key

app.post('/translate', async (req, res) => {
    const { text, targetLang, sourceLang } = req.body;

    if (!text || !targetLang) {
        return res.status(400).json({ error: 'Missing required fields: text or targetLang' });
    }

    const url = 'https://api-free.deepl.com/v2/translate';
    const params = new URLSearchParams();
    params.append('auth_key', authKey);  // Your DeepL API key
    params.append('text', text);
    params.append('target_lang', targetLang);

    // Optional: Only include sourceLang if it exists
    if (sourceLang) {
        params.append('source_lang', sourceLang);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        // Log the status and response body for debugging
        console.log('DeepL API Response Status:', response.status);
        const responseBody = await response.text(); // Get raw response body as text
        console.log('DeepL API Response Body:', responseBody); // Log raw response body

        if (!response.ok) {
            // If the response is not ok, log the error details
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${responseBody}`);
        }

        // Parse the JSON response if everything is okay
        const data = JSON.parse(responseBody);
        console.log('DeepL API JSON Response:', data); // Log the parsed JSON response

        res.json({ translatedText: data.translations[0].text }); // Send translated text to client
    } catch (error) {
        console.error('Error in translation request:', error.message);
        res.status(500).json({ error: 'Failed to fetch translation', message: error.message });
    }
});


// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
