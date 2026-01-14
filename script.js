const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchBtn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");
const statusMsg = document.getElementById("status-msg");
const resultDiv = document.getElementById("result");
const audio = document.getElementById("audio");

// Play Sound function must be global or attached to the element
function playSound() {
    audio.play();
}

searchBtn.addEventListener("click", searchWord);
inpWord.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchWord();
});

async function searchWord() {
    const word = inpWord.value.trim();
    if (!word) {
        setStatus("Please enter a word", "error");
        return;
    }

    // Reset UI before fetch
    resultDiv.classList.add("hidden");
    setStatus("Searching...", "loading");

    try {
        const response = await fetch(`${url}${word}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        // Clear loading, show data
        setStatus(""); 
        updateUI(data[0]);
    } catch (error) {
        setStatus(`Could not find "${word}"`, "error");
    }
}

function setStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.style.color = type === "error" ? "var(--error-color)" : "var(--accent-color)";
}

function updateUI(data) {
    // 1. Basic Word Info
    document.getElementById("word-text").textContent = data.word;
    
    // 2. Phonetics
    const phoneticStr = data.phonetic || (data.phonetics.find(p => p.text)?.text) || "";
    document.getElementById("phonetic-text").textContent = phoneticStr;

    // 3. Meaning (Handle if meanings array is empty)
    const meaning = data.meanings[0];
    if(meaning) {
        document.getElementById("part-of-speech").textContent = meaning.partOfSpeech;
        document.getElementById("definition").textContent = meaning.definitions[0].definition;

        // 4. Example
        const ex = meaning.definitions[0].example;
        const exBox = document.querySelector(".example-box");
        if(ex) {
            document.getElementById("example").textContent = `"${ex}"`;
            exBox.classList.remove("hidden");
        } else {
            exBox.classList.add("hidden");
        }
    }

    // 5. Audio Logic
    const audioSrc = data.phonetics.find(p => p.audio && p.audio !== "")?.audio;
    const playBtn = document.getElementById("play-sound-btn");
    
    if (audioSrc) {
        audio.src = audioSrc;
        playBtn.style.display = "flex"; // Changed from inline-block to flex for centering
    } else {
        playBtn.style.display = "none";
    }

    // Show Result
    resultDiv.classList.remove("hidden");
}
