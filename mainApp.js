const list = document.querySelector('.list');

fetch("./projects.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        updateUI(data);
    });

function updateUI(projects) {
    projects.forEach(({ name, code, index }) => {

        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <span class="project-number">${index}</span>
            <a href="/${name}/index.html" class="project-name">
                ${projectNameFormater(name)}
            </a>
            <a href=${code} class="container-links">
                Code
            </a>
        `;
        list.appendChild(listItem);
    });
}

function projectNameFormater(name) {
    return name
        .split('-')
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');
}










const hexValueElement = document.querySelector('.hex-value');

function generateHEX() {
    let randomHex =
        Math.random() //random number between 0 and 1
        .toString(16) //convert that number to hexadecimal string (i.e, base 16)
        .substr(-6); //grab last 6 digit string
    let randomHexColor = `#${randomHex}`;
    hexValueElement.textContent = randomHexColor;
    document.body.style.background = randomHexColor;
}

function keybord(event) {
    if (event.code == 'Space') {
        generateHEX();
    }
}

//when user clicks on HEX value
hexValueElement.addEventListener('click', generateHEX);

//when user clicks on spacebar
window.addEventListener('keydown', keybord);







const btn = document.querySelector('.btn');

btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});









//Cureeny converter
const currency1InputElem = document.getElementById('currency-1');
const selectCurrency1 = document.getElementById('select-currency-1');
const currency2InputElem = document.getElementById('currency-2');
const selectCurrency2 = document.getElementById('select-currency-2');
const rateDetail = document.getElementById('rate-detail');

calc();

function calc() {

    const selectCurrency1value = selectCurrency1.value;
    const selectCurrency2value = selectCurrency2.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${selectCurrency1value}`)
        .then(response => {
            //if promise wasn't resolved
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            const val = data.rates[selectCurrency2value];
            currency2InputElem.value = (currency1InputElem.value * val).toFixed(3);

            rateDetail.innerText = `1 ${selectCurrency1value} = ${val.toFixed(3)} ${selectCurrency2value}`;
        })
        .catch(error => {
            console.log('problem : ', error);
        });
}

currency1InputElem.addEventListener('input', calc);
currency2InputElem.addEventListener('input', calc);

selectCurrency1.addEventListener('change', calc);
selectCurrency2.addEventListener('change', calc);





















//Api  codemusic
const api = 'https://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio';

//DOM Elements
const songTitleElement = document.querySelector('.track-title');
const songArtistElement = document.querySelector('.track-artist');
const playerElement = document.getElementById('player');
const selectBitrateElement = document.getElementById('select-bitrate');

const song = {
    bitrate: {},
    url: {}
};

function getSong() {
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            song.title = data.now_playing.song.title;
            song.artist = data.now_playing.song.artist;

            song.bitrate.high = data.station.mounts[0].bitrate;
            song.url.high = data.station.mounts[0].url;

            song.bitrate.low = data.station.mounts[1].bitrate;
            song.url.low = data.station.mounts[1].url;
        })
        .then(() => {
            displayInfo();
        })
        .catch(error => {
            songTitleElement.innerText = error.message;
        });
}

function displayInfo() {
    songTitleElement.innerText = song.title;
    songArtistElement.innerText = song.artist;
    let link = changeBitrate();
    if (playerElement.getAttribute('src') != link) {
        playerElement.pause();
        playerElement.setAttribute('src', link);
        playerElement.load();
        playerElement.play();
    }
}

function changeBitrate() {
    switch (selectBitrateElement.value) {
        case 'normal-128':
            return song.url.high;
        case 'normal-64':
            return song.url.low;
        default:
            return;
    }
}
getSong();
selectBitrateElement.addEventListener('change', getSong);






























class Calculator {
    constructor(calcElement, resultElement) {
        this.calcElement = calcElement;
        this.resultElement = resultElement;
        this.clear();
    }

    clear() {
        this.currentOperant = '';
        this.previousOperant = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperant = this.currentOperant.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperant.includes('.'))
            return;
        this.currentOperant = this.currentOperant.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.operation === '')
            return;
        if (this.previousOperant !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperant = this.currentOperant;
        this.currentOperant = '';
    }

    compute() {
        let computation;
        let prev = parseFloat(this.previousOperant);
        let current = parseFloat(this.currentOperant);

        if (isNaN(prev) || isNaN(current))
            return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperant = computation;
        this.operation = undefined;
        this.previousOperant = '';
    }

    updateDisplay() {
        this.resultElement.innerText = this.currentOperant;
        if (this.operation != null) {
            this.calcElement.innerText = `${this.previousOperant} ${this.operation}`;
        }

    }
}

//DOM Elements

const calcElement = document.querySelector('[data-calc]');
const resultElement = document.querySelector('[data-result]');
const operationElement = document.querySelectorAll('[data-operation]'); //AC, %, /, *, -, +, ←, =
const numberElement = document.querySelectorAll('[data-number]'); //0-9, .

const calculator = new Calculator(calcElement, resultElement);

numberElement.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationElement.forEach(button => {
    if (button.dataset.operation === 'plus' || button.dataset.operation === 'minus' || button.dataset.operation === 'multiply' || button.dataset.operation === 'divide') {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        });
    }

    if (button.dataset.operation === 'equals') {
        button.addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });
    }

    if (button.dataset.operation === 'all-clear') {
        button.addEventListener('click', () => {
            calculator.clear();
            calculator.updateDisplay();
        });
    }

    if (button.dataset.operation === 'back') {
        button.addEventListener('click', () => {
            calculator.delete();
            calculator.updateDisplay();
        });
    }
});