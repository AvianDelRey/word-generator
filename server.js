const authKey = 'ff7e49fc-e61e-4295-9221-89b892ae7e61:fx'; 
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the 'main' directory
app.use(express.static(path.join(__dirname, 'Main')));

// DeepL API credentials
const DEEPL_API_KEY = 'ff7e49fc-e61e-4295-9221-89b892ae7e61:fx'; // Replace with your actual DeepL API key
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

// POST route for translation
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.post('/translate', async (req, res) => {
    const { text, targetLang, sourceLang } = req.body;

    // Validate required fields
    if (!text || !targetLang) {
        return res.status(400).json({ error: 'Missing required fields: text or targetLang' });
    }

    // Prepare DeepL API request parameters
    const params = new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text,
        target_lang: targetLang,
    });

    // Include sourceLang if provided
    if (sourceLang) {
        params.append('source_lang', sourceLang);
    }

    try {
        // Make the API request to DeepL
        const response = await fetch(DEEPL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        // Handle API response
        const responseBody = await response.text();

        if (!response.ok) {
            throw new Error(`DeepL API Error: Status ${response.status}, Response: ${responseBody}`);
        }

        // Parse the JSON response
        const data = JSON.parse(responseBody);
        const translatedText = data.translations[0]?.text;

        // Send the translated text back to the client
        res.json({ translatedText });
    } catch (error) {
        console.error('Error in translation request:', error.message);
        res.status(500).json({ error: 'Translation request failed', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
