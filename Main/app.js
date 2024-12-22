let num = 5;
const numReset = 5; 
let isPaused = false
let intervalId
let sharedstate = { currentword: { original: null, 
                    translated: null }, 
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



// Get a random word, translate it
async function getWord() {
    try {
        const words = await logWords();
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];

        // Translate the word
        const translatedword = await translateText(word, 'ES'); // Translate to Spanish
        // Add the word to the history
        sharedstate.currentword = { original: word, translated: translatedword };
        sharedstate.History.push({ original: word, translated: translatedword });
        console.log(sharedstate)
    
    } catch (error) {
        console.error("Error in getWord:", error.message);
        sharedstate.currentword = { original: null, translated: null};
    }
    return sharedstate.currentword;
}


function Display(){
    let currentWord = sharedstate.currentword.original;
    let currTranslation = sharedstate.currentword.translated;

    document.getElementById('en-word').innerHTML = currTranslation;
    document.getElementById('pt-word').innerHTML = currentWord;

}

// Reset button: reset the timer and display a new word
function resetButton() {
    clearInterval(intervalId);
    setInterval(initialize, 1000);
}

// Pause button: stops the interval
function pauseButton() {
    if (!isPaused){
        isPaused = true
        clearInterval(intervalId);
        document.getElementById("pausePlayButton").innerText = "Play"
     }
            isPaused = false
            intervalId = setInterval(initialize, 1000);
            document.getElementById("pausePlayButton").innerText = "Pause"
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
    
    if (num === numReset) {
        await getWord();
        Display();
    }
    countdown();
}

// Start the timer
// intervalId = setInterval(initialize, 1000)

