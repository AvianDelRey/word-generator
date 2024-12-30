let num = 5;
const numReset = 5; 
const random_word_api = 'https://random-word-api.vercel.app/api?words=10&length=8&type=capitalized'
let isPaused = false
let intervalId
let sharedstate = { set: [],
                    currentword: [], 
                    History: [] };

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


// Fetch a list of random words from an API
async function logWords() {
    try {
        const response = await fetch(random_word_api);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Words fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching words:", error.message);
        return ["water", "blue", "play", "floor"]; // Default list of words
    }
}



// Get a random word, translate it
async function getWords() {
    try {
        const words = await logWords();



        // Translate the words
        const translations = await Promise.all(words.map(word => translateText(word,'es')))
        sharedstate.set = translations.map((translatedword,index) => ({
            original: words[index],
            translated: translatedword,
        }));

    } catch (error) {
        console.error("Error in getWord:", error.message);
        sharedstate.set = { original: null, translated: null};
    }

}

function wordcount() {
    const threshold = 3;
    return sharedstate.set.length < threshold;
}

async function replenishword() {
    const newwords = await getWords();
    sharedstate.set.push(...newwords)
}

async function Display(){
    const nextword = sharedstate.set.shift()

    if(sharedstate.set.length === 0) {
        document.getElementById('en-word').innerHTML = "Fetching...";
        document.getElementById('pt-word').innerHTML = "Fetching...";
        console.error("Fetching words!?", sharedstate.set);
        await replenishword();
        return;
    }

    if (wordcount()) {
        await replenishword();
    }

    let currentWord = nextword.original;
    let currTranslation = nextword.translated;

    document.getElementById('en-word').innerHTML = currTranslation;
    document.getElementById('pt-word').innerHTML = currentWord;
    sharedstate.History.push(nextword);

}

// Reset button: reset the timer and display a new word
async function resetButton() {
    clearInterval(intervalId);
    num = numReset;
    intervalId = setInterval(initialize, 1000);
}

// Pause button: stops the interval
function pauseButton() {
    if (!isPaused) {
        clearInterval(intervalId);
        isPaused = true;
        document.getElementById("pausePlayButton").innerText = "Resume";
    } else {
        intervalId = setInterval(initialize, 1000);
        isPaused = false;
        document.getElementById("pausePlayButton").innerText = "Pause";
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

// Initialize the timer and fetch words at regular intervals
async function initialize() {
    if (sharedstate.set.length < 3) {
        replenishword();
    }

    if (num === numReset) {
        await Display();
    }
    countdown();
}

// Start the timer
intervalId = setInterval(initialize, 1000)

