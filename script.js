const WORD_LENGTH = 5;
const TRIES = 6;
const QWERTY_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

const PALABRAS = ["GATOS", "PERRO", "VERDE", "CIELO", "FLOTA", "NUBES", "BLUSA", "MUNDO", "HOJAS", "ROCAS"];

let guessesRemaining = TRIES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = "";

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('restart-game').addEventListener('click', restartGame);
document.getElementById('random-word').addEventListener('click', startGameWithRandomWord);

document.getElementById('word-input').addEventListener('input', function() {
    document.getElementById('error-message').textContent = '';
});

function obtenerPalabraAleatoria() {
    return PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
}

function startGameWithRandomWord() {
    rightGuessString = obtenerPalabraAleatoria();
    document.getElementById('word-input-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    initBoard();
    initKeyboard();
}

function startGame() {
    let wordInput = document.getElementById('word-input');
    let errorMessage = document.getElementById('error-message');
    let word = wordInput.value.toUpperCase();

    // Resetear el mensaje de error
    errorMessage.textContent = '';

    if (word.length !== WORD_LENGTH) {
        errorMessage.textContent = `La palabra debe tener exactamente ${WORD_LENGTH} letras.`;
        return;
    }

    if (!/^[A-ZÑ]+$/.test(word)) {
        errorMessage.textContent = "La palabra solo debe contener letras.";
        return;
    }

    rightGuessString = word;
    document.getElementById('word-input-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    initBoard();
    initKeyboard();
}

function restartGame() {
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('word-input-container').style.display = 'block';
    document.getElementById('word-input').value = '';
    guessesRemaining = TRIES;
    currentGuess = [];
    nextLetter = 0;
}

function initBoard() {
    let board = document.getElementById("game-board");
    board.innerHTML = '';

    for (let i = 0; i < TRIES; i++) {
        for (let j = 0; j < WORD_LENGTH; j++) {
            let letter = document.createElement("div");
            letter.className = "letter-box";
            board.appendChild(letter);
        }
    }
}

function initKeyboard() {
    let keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = '';

    QWERTY_LAYOUT.forEach((row, rowIndex) => {
        let rowElement = document.createElement("div");
        rowElement.className = "keyboard-row";
        
        row.forEach(key => {
            let button = document.createElement("button");
            button.textContent = key;
            button.className = "keyboard-button";
            
            if (key === '⌫') {
                button.addEventListener("click", deleteLetter);
            } else if (key === 'ENTER') {
                button.addEventListener("click", checkGuess);
            } else {
                button.addEventListener("click", () => keyboardPress(key));
            }
            
            rowElement.appendChild(button);
        });
        
        keyboard.appendChild(rowElement);
    });
}

function keyboardPress(key) {
    if (nextLetter === WORD_LENGTH) {
        return;
    }
    let row = document.getElementsByClassName("letter-box")[WORD_LENGTH * (TRIES - guessesRemaining) + nextLetter];
    row.textContent = key;
    currentGuess.push(key);
    nextLetter += 1;
}

function deleteLetter() {
    if (nextLetter === 0) {
        return;
    }
    let row = document.getElementsByClassName("letter-box")[WORD_LENGTH * (TRIES - guessesRemaining) + nextLetter - 1];
    row.textContent = "";
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess() {
    if (nextLetter !== WORD_LENGTH) {
        return;
    }

    let guess = currentGuess.join("");
    if (guess === rightGuessString) {
        for (let i = 0; i < WORD_LENGTH; i++) {
            let box = document.getElementsByClassName("letter-box")[WORD_LENGTH * (TRIES - guessesRemaining) + i];
            box.classList.add("correct");
        }
        endGame(true);
        return;
    }
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        let box = document.getElementsByClassName("letter-box")[WORD_LENGTH * (TRIES - guessesRemaining) + i];
        let letter = currentGuess[i];
        
        if (rightGuessString[i] === letter) {
            box.classList.add("correct");
        } else if (rightGuessString.includes(letter)) {
            box.classList.add("present");
        } else {
            box.classList.add("absent");
        }
    }

    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
        endGame(false);
    }
}

function endGame(isWin) {
    document.getElementById('game-container').style.display = 'none';
    let resultContainer = document.getElementById('result-container');
    let resultMessage = document.getElementById('result-message');
    let correctWord = document.getElementById('correct-word');

    resultContainer.style.display = 'block';
    
    if (isWin) {
        resultMessage.textContent = "¡Felicidades! Has ganado.";
        resultMessage.className = "win-message";
    } else {
        resultMessage.textContent = "¡Lo siento! Has perdido.";
        resultMessage.className = "lose-message";
    }
    
    correctWord.textContent = `La palabra correcta era: ${rightGuessString}`;
}