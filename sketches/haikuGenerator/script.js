let fiveSyllableLine = [
    'Delightful display',
    "To the sun's glory",
    'Like crunchy cornflakes',
    'Beauty in decay',
    'The chill, worming in',
    'Summer tongue awakes',
    'Warm fall afternoons',
    'Crickets singing tunes',
    'Calm as a river',
    'Blue summer skies reign',
    'Mellow, mild, May day',
    "Summer's on her way",
    'Beautiful sunrise',
    "I wait for day's start",
    'Coolness fills the air',
    'Fall weather is here',
    'Fresh spring morning time',
    'The presence of peace',
    'Glorious sunset',
    'Winter fights to stay',
    'Flowers bloomed today',
    'Spring brings happiness',
    'Golden rays of sun',
    "Perfect summer's day",
    'Warm midnight falling',
    'Peaceful all at once',
    'Peaceful, sunny day',
    'Water runs down stream',
    'The Darkness descends',
    'Watching the sunset',
    'The heat drains the body',
    'The pitter patter',
    'Sakura bloom strong',
    'Swaying leaves on the trees',
    'A misty morning',
    'Crunch on autumn leaves',
    'Sea breeze blows ahead',
    'Golden butterflies',
    'And rest till fall ends',
    'An old silent pond',
    'Hued ribbons adorn',
    'A world of dew',
    'An old silent pond...',
    'Autumn moonlight',
    'In the twilight rain',
    'Rainbows of the night',
    'When it snows, winter',
    'That wither in warmth',
    'Have you seen that red',
    'Like a sunset sky',
    'Trees wear floral wreaths',
    'Melody of spring',
    'They fill me with warmth',
    'Rain means gloomy days'
];

let sevenSyllableLine = [
    'Snowdrops bow their pure white heads',
    'And within every dewdrop',
    'Gold leaves rustle underfoot',
    'red roses bloom on cold cheeks',
    'Shock, pleasure, bursting within',
    'Crisp cool eves with harvest moons',
    'Light and tenderly expressed',
    'golden leaves paint the ground',
    'Tranquility in my heart',
    'On a warm summer morning',
    'The room was dark and somber',
    'Scarves and sweaters everywhere',
    'What will begin in its place?',
    'Shadows dance upon the wall',
    "That's the sound of solitude,",
    'Bonded by our hearts and souls',
    'Angels tap-dancing softly',
    'Decorating the night sky...',
    'Sweet Spring always wins her way',
    'Play acoustic rhythm and blues',
    'Flowers, songbirds, and green grass',
    'You work all day long',
    'Sweet breeze caresses softly',
    'Arching high above our heads',
    'Stars shining, dancing brightly',
    'That you can not let go of',
    'Scorching sun rays, blazing winds',
    'The book flows and the sun glows',
    'Float down to the soft, moist ground',
    'nocturnal beast come to feast',
    'my thoughts go to a calm place',
    'Bursting sweetness, hidden seed',
    'And forever twilight skies',
    'Sound of the heavenly rain',
    'Outstretch that shimmering sight',
    'the heavens; lustrous',
    'warmer air, blooming flowers,',
    "With memories and smile",
    'and birds sing the welcoming'
];


// Set lines using random function
let line1 = random(fiveSyllableLine);
let line2 = random(sevenSyllableLine);
let line3 = random(fiveSyllableLine);

// Gets the element ID from haiki section in the index.html (<p>)
let firstLine = document.getElementById('line-1')
let secondLine = document.getElementById('line-2')
let thridLine = document.getElementById('line-3')

// Assign ID text to new lines
firstLine.innerText = line1;
secondLine.innerText = line2;
thridLine.innerText = line3;
 
// Event listener for when user clicks a line
firstLine.addEventListener('click', lineClicked)
secondLine.addEventListener('click', lineClicked)
thridLine.addEventListener('click', lineClicked)

// When a line is clicked, a new line is generated and fades out
function lineClicked(event){
    fadeOut(event.target, 1);
}

// Text effect when clicked causes it to fade out
// calls once per frame until opacity is 0
function fadeOut(newLine, opacity){
    opacity -= 0.01;
    newLine.style['opacity'] = opacity;
    if(opacity > 0){
        requestAnimationFrame(function () {
            fadeOut(newLine, opacity);  
        });
    } else{
        setNewLine(newLine);
        fadeIn(newLine, 0)
    }
}

// Same as fadeOut but in reverse, calls once per frame until
// opacity is 1
function fadeIn(newLine, opacity){
    opacity += 0.01;
    newLine.style['opacity'] = opacity;
    if(opacity < 1){
        requestAnimationFrame(function(){
            fadeIn(newLine, opacity);
        });
    }
}

// Sets up function to change a line for a new one
function setNewLine(newLine) {
    if (newLine === firstLine || newLine === thridLine){
        newLine.innerText = random(fiveSyllableLine)
    } else if (newLine === secondLine){
        newLine.innerText = random(sevenSyllableLine)
    }
}

// Needed to make a random function since p5.js random
// can't work without setup() function -- caused problems
function random(array){
    let index = Math.floor(Math.random() * array.length);
    return array[index]
}