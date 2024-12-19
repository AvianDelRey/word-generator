let num = 5;
const numReset = 5; 
let wordList = []; // Stores previously used words

// Function to translate text using the DeepL API
async function translateText(text, targetLang) {
    try {
        console.log('Requesting translation for:', text, 'Target language:', targetLang);

        const response = await fetch('http://localhost:3000/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, targetLang }),
        },5000);

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.translatedText) {
            // console.log('Translated Text:', data.translatedText);
            return data.translatedText;
        } else {
            // console.error('Error: Translated text is undefined or missing in the response.');
            return undefined;
        }
    } catch (error) {
        // console.error('Error in translateText:', error.message);
        return undefined;
    }
}

// Countdown timer function
function countdown() {
    document.getElementById('timer').innerHTML = num;
    num--;

    if (num < 0) {
        num = numReset; // Reset the timer
    }
}

// Fetch a list of random words from an API
async function logWords() {
    try {
        const response = await fetch("https://random-word-api.vercel.app/api?words=49");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Words fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching words:", error.message);
        return ["water", "blue", "play", "floor"]; // Default list of words
    }
}

// Get a random word, translate it, and display it in the HTML
async function getWord() {
    try {
        const words = await logWords();
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];

        // Display the original word
        document.getElementById('pt-word').innerHTML = word;

        // Translate the word
        const translatedWord = await translateText(word, 'ES'); // Translate to Spanish
        document.getElementById('en-word').innerHTML = translatedWord;

        // Add the word to the history
        wordList.push({ original: word, translated: translatedWord });
        console.log('Word List:', wordList);
    } catch (error) {
        console.error("Error in getWord:", error.message);
    }
}

// Reset button: reset the timer and display a new word
function resetButton() {
    num = numReset; // Reset the timer
    getWord(); // Fetch a new word
}

// Pause button: stops the interval
function pauseButton() {
    clearInterval(intervalId);
}

// Initialize the timer and fetch words at regular intervals
function initialize() {
    if (num === numReset) {
        getWord();
    }
    countdown();
}

// Start the timer
const intervalId = setInterval(initialize, 1000);


