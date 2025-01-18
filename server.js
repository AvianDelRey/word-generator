require('dotenv').config();
console.log(process.env)
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios') ;

// DeepL API credentials
const DEEPL_API_KEY = process.env.DEEPL_KEY; 
const DEEPL_API_URL = 'https://api-free.deepl.com/v2';

//random word api
const WORD_API = process.env.WORD_API;


if (!process.env.DEEPL_KEY || !process.env.WORD_API) {
    throw new Error('Missing required environment variables (deepl_key or word_api)');
}
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the 'main' directory
app.use(express.static(path.join(__dirname, 'Main')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/words', async (req,res) => {
    try {
        const response = await axios.get(WORD_API)
        res.json(response.data);
    }
    catch (error) {
        console.log('Error fetching words:', error.message);
        res.status(500).json({ error: 'failed to fetch words'})
    }
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
console.log('DEEPL API Key:', process.env.DEEPL_KEY);
console.log('RANDOM WORD API:', process.env.WORD_API);
