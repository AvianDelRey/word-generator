
let num = 5;
const numreset = 5;
let wordList = [];

async function translateText(text, targetLang) {
    try {
        console.log('Requesting translation for:', text, 'Target language:', targetLang); // Log input data

        const response = await fetch('http://localhost:3000/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'
         },
            body: JSON.stringify({ text, targetLang }),
        });

        console.log('Response status:', response.status); // Log the response status

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Log the full response
        console.log('Response JSON:', data);

        if (data && data.translatedText) {
            console.log('Translated Text:', data.translatedText);
            return data.translatedText;
        } else {
            console.error('Error: Translated text is undefined or missing in the response.');
            return undefined;
        }
    } catch (error) {
        console.error('Error:', error);
        return undefined;
    }
}


//countdown is a function that counts down from 10 to 0

function countdown() {
    document.getElementById('timer').innerHTML = num
    num--;
    if (num === -1){
    num = numreset;
    }
    return num
}
//get list of words from the api

function logWords() {
    
    return fetch("https://random-word-api.vercel.app/api?words=49")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        })
        .then((data) => { console.log("words fetched", data);
        return data;
    })
        .catch((error) => {
            console.error("error", error)
            return ["water","blue","play","floor"] ///list of random words
        })
    }

// Get a word, translate it, and display it in HTML
async function getWord() {
    try {
        // Fetch random words
        const words = await logWords();
        let randomNumber = Math.floor(Math.random() * words.length);
        let word = words[randomNumber];

        // Display the original word
        document.getElementById('pt-word').innerHTML = word;

        // Translate the word
        const translatedWord = await translateText(word, 'ES'); // Translate to French
        document.getElementById('en-word').innerHTML = translatedWord;
    } catch (error) {
        console.error("Error in getWord:", error);
    }
}

//reset button, time resets and new word is shown
function resetBttn(){
    
    if (num <= 5) {
       num = 5
       clearInterval(initialize)
    
    }
}

function pauseBttn(){
    
    if (num <= 5) {
       stop(initialize)
    
    }
}

//update word in list   
function initialize(){
    if (num === 5){
        getWord()
    }
    countdown();
}
setInterval(initialize,1000)
//TODO - keep record of previously used words, decide  how to keep record
//