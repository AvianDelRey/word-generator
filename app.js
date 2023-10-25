
let num = 10
const numreset = 10
const dictionaryAPI = fetch("https://www.dictionaryapi.com/api/v3/references/collegiate/json/test?key=a17a492a-48ce-4264-b076-c9471a5f2029")

//countdown is a function that counts down from 10 to 0

function countdown() {
    document.getElementById('timer').innerHTML = num
    num--;
    if (num < 0){
        num = numreset;
    }
    return num
}
setInterval(initialize,1000)



//get list of words from the api

function logWords() {
    
    return fetch("https://random-word-api.vercel.app/api?words=500&type=capitalized")
        .then((response) => {
            const data = response.json();
            return data
        })
        .catch((error) => {
            console.log(error)
        })
}

// get a word from list then return that word in html
async function getWord(){
    const words =  await logWords();
    
    let randomNumber = Math.floor(Math.random() * words.length);
    let word = words[randomNumber];
    document.getElementById('pt-word').innerHTML = word

    return word
}
console.log(getWord())

//update word in list   
function initialize(){

    if (num === 10){
        getWord()
    }
    countdown();
}

console.log(updateWord)


//TODO - keep record of previously used words, decide  how to keep record