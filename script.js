const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchBtn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");
const errorMsg = document.getElementById("error-msg");
const resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");
const audio = document.getElementById("audio");

// Search Trigger
searchBtn.addEventListener("click", searchWord);
inpWord.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchWord();
});

async function searchWord() {
    const word = inpWord.value.trim();
    if (!word) {
        errorMsg.textContent = "Type a word...";
        return;
    }

    // Reset State
    errorMsg.textContent = "";
    resultDiv.classList.add("hidden");
    loadingDiv.classList.remove("hidden");

    try {
        const response = await fetch(`${url}${word}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        updateUI(data[0]);
    } catch (error) {
        loadingDiv.classList.add("hidden");
        errorMsg.textContent = "Word not found.";
    }
}

function updateUI(data) {
    // 1. Data Parsing
    document.getElementById("word-text").textContent = data.word;
    
    // Get Phonetic
    const phoneticStr = data.phonetic || (data.phonetics.find(p => p.text)?.text) || "";
    document.getElementById("phonetic-text").textContent = phoneticStr;

    // Get Meaning
    const meaning = data.meanings[0];
    document.getElementById("part-of-speech").textContent = meaning.partOfSpeech;
    document.getElementById("definition").textContent = meaning.definitions[0].definition;

    // Get Example
    const ex = meaning.definitions[0].example;
    const exampleElem = document.getElementById("example");
    if(ex) {
        exampleElem.textContent = ex;
        document.querySelector(".example-box").classList.remove("hidden");
    } else {
        document.querySelector(".example-box").classList.add("hidden");
    }

    // Audio
    const audioSrc = data.phonetics.find(p => p.audio && p.audio !== "")?.audio;
    const playBtn = document.getElementById("play-sound-btn");
    
    if (audioSrc) {
        audio.src = audioSrc;
        playBtn.style.display = "inline-block";
    } else {
        playBtn.style.display = "none";
    }

    loadingDiv.classList.add("hidden");
    resultDiv.classList.remove("hidden");
}

function playSound() {
    audio.play();
}
