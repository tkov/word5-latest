// import { wordList } from '5list.js';

const WORD_SIZE = 5;
const GUESSES = 6;
const ZERO = 0;

var letterIndex = 0;
var guessIndex = 0;

var buttons = [];

var userWord = [];
// var testWord = ['q','u','i','e','t'];


var didEnd = false;

var targetWord = randomWord();
console.log(targetWord);
var dict = createTargetDict();
var t_dict = {};
// message node
var message = document.getElementById('message');

function randomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}



var guessRow = document.getElementById(`guess-${guessIndex + 1}`).children;
var letterCol = guessRow[letterIndex];

const keyboard = document.getElementById('keyboard');



document.addEventListener('keydown', function onPress(event) {
  event.preventDefault();
  const regex = /[a-z]/g;

  if (!didEnd && event.key[0].match(regex)){
    // console.log("A valid letter key!");
    handleLetterKey(event.key);
  }
  else if (!didEnd && event.key === 'Backspace'){
    // console.log('Backspace');
    handleBackKey();
  }
  else if (!didEnd && event.key === 'Enter'){
    // console.log('Enter');
    handleEnterKey();
  }
  else if (didEnd && event.key === ' '){
    // console.log('Space Bar'); 
    // event.preventDefault();
    document.getElementById('new-game-key').disabled = true;
    handleSpaceKey();
  }
  // console.log(event.keyCode);
});


keyboard.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  
  // console.dir(guessRow);
  letterCol = guessRow[letterIndex];
  const key = event.target.innerHTML;
  
  if (key == 'back'){ 
    handleBackKey();
  }
  else if (key == 'enter') {
    handleEnterKey();
  }
  else if (key == 'new game'){
    // console.log('Pressed the NEW GAME key');
    event.target.disabled = true;
    handleSpaceKey();
    return;
  }
  else { // pressed a 'letter' key 
      handleLetterKey(key);
    }
})


function handleLetterKey(key) {
  if (letterIndex < WORD_SIZE){
    letterCol = guessRow[letterIndex++];
    letterCol.innerHTML = key;

    for (var letter of document.getElementsByClassName('main-key')){
      if (letter.innerHTML === key) buttons.push(letter);
    }
    
    userWord.push(key);
  }
  return;
}

function handleBackKey() {
    // console.log('Pressed the BACK key...');
    if (!letterIndex) return;

    letterCol = guessRow[--letterIndex];
    letterCol.innerHTML = '';
    userWord.pop();
    buttons.pop();
    return;
}

var msg = '';

function handleEnterKey() {
  if (userWord.length < WORD_SIZE) return;

  if (!wordList.includes(userWord.join(''))){
    ouputMessage(true, 'Your word is not in the word list');
    return; 
  }

  // handle checking
  colors = checkWord();
  colors = colors.map((elem) => Object.values(elem)[0]);

  // console.log(colors);
  // console.log(Object.values(colors));
  if (colors.every((elem) => elem =='green')) {
    // game over (WIN) -- disable buttons, enable new game...
    ouputMessage(false, 'Good job!');
    // newGame();
    endGame();
    return;
  }


  // reset letter index
  letterIndex = 0;
  userWord = [];
  buttons = []
  // move to next guess row
  if ((guessIndex + 1) == GUESSES){
    // game over (LOSS) -- disable button, show word, enable new game
    ouputMessage(true, 'Sorry. You lose!');
    endGame();
    return;
  }

  guessRow = document.getElementById(`guess-${++guessIndex + 1}`).children;
}


function handleSpaceKey() {
  // handling the new game

  // grab our default button to copy styles for reset
  var clone = document.getElementById('clone');

  for (var key of document.getElementsByClassName('main-key')){
    key.style = clone.style;
    key.disabled = false;  
  }

  newGame();
}


function ouputMessage(isError, msg) {
    message.style.display = 'block';
    message.innerHTML = msg;

    var title = document.querySelector('h1');
    title.style.color = 'white';
    if (!isError) message.style.backgroundColor = '#357847';
    message.classList.add('fade');
    setTimeout(()=> {message.classList.remove('fade'); message.style.display = 'none'; title.style.color = '#2d2d2d';},3000);
}


function createTargetDict(){ 
  dict = {}
  for(var c of targetWord){
    if (dict[c]){
      dict[c] += 1;
    }
    else{
      dict[c] = 1;
    }
  }
  return dict;
}


function checkWord() {
  existFlag = false;
  colored = false;
  colors = []
  t_dict = {...dict};

  duplicate = false;

  var targetLetters = [...targetWord];
  
  var clone = document.getElementById('clone');

  for (var i = 0; i < WORD_SIZE; i++) {
    j = 0;
    if (userWord[i] === targetWord[i]) {
      colors.push({ [userWord[i]]: 'green'});
      colorGreen(i);
      t_dict[userWord[i]]--; 
      
      if (t_dict[userWord[i]] <= 0){
        for (var elem of colors){
           if (elem[userWord[i]] == 'yellow') {
            // console.log('Found yellow!');
            elem[userWord[i]] = 'grey';
            colorGray(j);
           }
           j++;
        }
      }
      
      continue;
    }
    else if (targetWord.includes(userWord[i])){
      colors.push({ [userWord[i]] : 'yellow'});
      colorYellow(i);
      if (t_dict[userWord[i]] == 0){
        for (var elem of colors){
           if (elem[userWord[i]] == 'green') {
            // console.log('Found green!');
            colors.pop();
            colors.push({ [userWord[i]] : 'grey'});
            colorGray(i);
           }
           else if (elem[userWord[i]] == 'yellow') {
            // console.log('Found yellow!');
            elem[userWord[i]] = 'grey';
            colorGray(j);
            continue;
           }

           j++;
        }
      }
      t_dict[userWord[i]]--; 
    }
    else {
      colors.push({ [userWord[i]]: 'grey'})
      colorGray(i);
    }

  }
  return colors;
}


function colorGreen(i){
  guessRow[i].style.color = 'white';
  guessRow[i].style.backgroundColor = '#357847';

  buttons[i].style = clone.style;
  buttons[i].style.color = 'white';
  buttons[i].style.backgroundColor = '#357847';
  buttons[i].style.border = 'none';
  buttons[i].style.borderRadius = '3px';
  buttons[i].style.border = '2px solid #357847';
}

function colorYellow(i){
  guessRow[i].style.color = 'white';
  guessRow[i].style.backgroundColor = '#b8a130';
  
  if (buttons[i].style.backgroundColor == 'rgb(53, 120, 71)') return;
  

  
  buttons[i].style.color = 'white';
  buttons[i].style.backgroundColor = '#b8a130';
  buttons[i].style.border = 'none';
  buttons[i].style.borderRadius = '3px';
  buttons[i].style.border = '2px solid #b8a130';
}

function colorGray(i){
  guessRow[i].style.color = 'white';
  guessRow[i].style.backgroundColor = '#2d2d2d';
  

  if (buttons[i].style.backgroundColor == 'rgb(53, 120, 71)' || buttons[i].style.backgroundColor == 'rgb(184, 161, 48)') return; 

  buttons[i].style.color = 'white';
  buttons[i].style.backgroundColor = '#2d2d2d';
  // buttons[i].style = clone.style;
  buttons[i].style.border = 'none';
  buttons[i].style.borderRadius = '3px';
  buttons[i].style.border = '2px solid #2d2d2d';
}


function endGame() {
  didEnd = true;
  for (var key of document.getElementsByClassName('main-key')){
    key.disabled = true;
  }

  document.getElementById('new-game-key').disabled = false;
  let targetArray = targetWord.split('');

  let answer = document.getElementById('answer').children;

  targetArray.forEach((letter , i) => {
    answer[i].innerHTML = letter;
    answer[i].style.backgroundColor = '#357847';
    answer[i].style.color = 'white';
    answer[i].style.border = '2px solid #2d2d2d';
  });
}


function newGame() {
  didEnd = false;
  letterIndex = 0;
  guessIndex = 0;
  buttons = [];
  userWord = [];
  // grab a new word
  targetWord = randomWord();
  console.log(targetWord);
  
  dict = createTargetDict();
  t_dict = {};
  message.style.backgroundColor = '#6e0202';

  for (var box of document.getElementsByClassName('box')){
    box.style.backgroundColor = 'white';
    box.style.color = 'black';
    box.innerHTML = '';
    // box.classList.toggle('dark-fg');
  }
  
  for (var child of document.getElementById('answer').children){ 
    child.style.backgroundColor = '#ddd';
  }
  
  // reset our rows (word guess) and coloumns (letter guess)
  guessRow = document.getElementById(`guess-${guessIndex + 1}`).children;
  letterCol = guessRow[letterIndex];

 
}

// const mode = document.getElementById('mode');

// mode.addEventListener('click', () => {
//   for (var box of document.getElementsByClassName('box')){
//     box.classList.toggle('dark-box');
//     box.classList.toggle('dark-fg');
//   }
//   document.querySelector('body').classList.toggle('dark-bg');
//   document.querySelector('h1').classList.toggle('dark-fg');
// })




