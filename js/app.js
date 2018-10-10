// Variables to shorten code
const interface = document.getElementById('interface')
const guide = document.getElementById('guide')
const winnerTextDisplay = document.getElementById('winnerText')
const lossDisplay = document.getElementById('loss')
const winnerTextPhrases = ['HURRAY!!', 'You win', 'Awesome', 'There is no stopping you!!', 'You are GOOD!!', 'Bonkers!!', 'Sweet', 'How did you do that!', 'That was CLOSE!!', 'Congratultions!', 'Sweet Victory', 'Lose-a-phorbic!', 'Awesome. Keep at it', 'Winnerholic!', 'Positive vibes', 'Dodge Champion']
const lossPhrases = ['Get up', 'CRASH!!!', 'Comeon Champ', 'Wasted', 'Smashed!', 'Happens Yoh', 'Dont Give up!', 'Be Careful', 'Loser', 'Trashed', 'OWNED!!', 'Taken', 'Finished', 'How did you not see that Coming!']



// Enemy to be avoided by player
// Variables for Enemy instances
let Enemy = function(x, y, speed) {
    this.x = x
    this.y = y
    this.speed = speed
    // The image/sprite for our enemy
    this.sprite = 'images/rock.png'
}




// Updates the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // All movement multiplied by the dt parameter to ensure game runs at same speed for all comps
    this.x += this.speed * dt

    // Respawns enemy after moving out of the canvas
    if (this.x > 505) {
        // Enemy respawn (minimum speed, maximum speed, minimum starting position, maximum starting position) */
        this.respawn(100, 300, 50, 500)
        this.updateLevel()
    }

    this.crush()
}



// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}



// Randomizes enemy speed and position after respawn 
Enemy.prototype.respawn = function(minSpeed, maxSpeed, minPos, maxPos) {
    let randomSpeed = numberGenerator(minSpeed, maxSpeed)
    let randomStartingPoint = numberGenerator(minPos, maxPos)
    this.x = -randomStartingPoint
    this.speed = randomSpeed
}



// Moves player up one level after 5 successfull moves
// speed parameters (100 - slow, 1000 - very fast)
// Position parameters (50 - slightly offscreen to the left, 500 - slightly offscreen to the right)
Enemy.prototype.updateLevel = function() {
    let wins = winnerTextDisplay.innerText
    if (wins > 3) this.respawn(250, 400, 50, 400)
    if (wins > 6) this.respawn(250, 450, 50, 350)
    if (wins > 9) this.respawn(300, 500, 50, 300)
    if (wins > 12) this.respawn(250, 650, 50, 200)
    if (wins > 15) this.respawn(350, 600, 50, 100)
    if (wins > 18) this.respawn(400, 850, 50, 100)
    if (wins > 21) this.respawn(550, 1000, 50, 100)
    if (wins > 24) this.respawn(600, 1000, 50, 100)

}


// Resets player position after crush
Enemy.prototype.crush = function() {
     if (player.x < this.x + 70 &&
        player.x + 37 > this.x &&
        player.y < this.y + 25 &&
        30 + player.y > this.y) {
        player.reset()
        player.handleLoss()
    }
}



// Variables for Player instances
let Player = function(x, y, speed) {
    this.x = x
    this.y = y
    this.speed = speed
    this.sprite = 'images/char-princess-girl.png'
}



// Player update method
// Function to scope player within canvas
Player.prototype.update = function() {
    if (this.x < 0)  this.x = 0
    if (this.x > 400) this.x = 400
    if (this.y > 380)  this.y = 380

    // Winning condition
    if (this.y < 0) {
        this.reset()
        this.handleWin()
    }
}



// Player render method
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}



// handleInput method
Player.prototype.handleInput = function(keyPress) {
    switch (keyPress) {
        case 'left':
            this.x -= this.speed + 50
            break
        case 'up':
            this.y -= this.speed + 30
            break
        case 'right':
            this.x += this.speed + 50
            break
        case 'down':
            this.y += this.speed + 30
            break
    }
}



// Instantiate Objects

// Instantiates Player ((x,y)- the central block on canvas, speed))
// Place the player object in a variable called player
let player = new Player(200, 380, 50)

// Instantiates Enemy
// Place all enemy objects in an array called allEnemies
let allEnemies = []
let enemyLane = [60, 140, 220]


// Instantiates one enemy for each lane and speed
enemyLane.forEach( y => {
    let randomSpeed = numberGenerator(100, 300)
    let enemy = new Enemy(-150, y, randomSpeed)
    allEnemies.push(enemy)
})



// Function to reset player position on a random block
Player.prototype.reset = function() {
    let xArray = [0, 100, 200, 300, 400]
    let yArray = [300, 380]
    shuffle(xArray)
    shuffle(yArray)
    this.x = xArray[0]
    this.y = yArray[0]
}



// Loss Protocol
let loss = 0
Player.prototype.handleLoss = function() {
    shuffle(lossPhrases)
    loss++
    lossDisplay.innerText = loss
    guide.classList.add('lossProtocol')
    lossDisplay.classList.add('lossProtocol')
    guide.innerText = lossPhrases[0]
    setTimeout( () => {
        guide.classList.remove('lossProtocol')
        lossDisplay.classList.remove('lossProtocol')
    }, 1000)
}




// Winner Protocol
let winnerText = 0
Player.prototype.handleWin = function() {
    shuffle(winnerTextPhrases)
    winnerText++
    winnerTextDisplay.innerText = winnerText
    guide.classList.add('winnerProtocol')
    winnerTextDisplay.classList.add('winnerProtocol')
    guide.innerText = winnerTextPhrases[0]
    this.nextLevel()
    setTimeout( () => {
        guide.classList.remove('winnerProtocol')
        winnerTextDisplay.classList.remove('winnerProtocol')
    }, 1000)
}





// Player Winner Levels
Player.prototype.nextLevel = function() {
    let wins = winnerTextDisplay.innerText
    if (wins === '1') guide.innerText = 'Level: 1. Lets Warm-up'
    if (wins === '4') guide.innerText = 'Level: 2. Slight Run'
    if (wins === '7') guide.innerText = 'Level: 3. Beginner pro'
    if (wins === '10') guide.innerText = 'Level: 4. Intermediate Player'
    if (wins === '13') guide.innerText = 'Level: 5. Professional'
    if (wins === '16') guide.innerText = 'Level: 6. Legendary'
    if (wins === '19') guide.innerText = 'Level: 7. World Class'
    if (wins === '22') guide.innerText = 'Level: 8. BEAST MODE!'
    if (wins === '25') guide.innerText = 'Level: 9. KING!'

}





// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }

    player.handleInput(allowedKeys[e.keyCode])
})






// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}



// Generates random speed numbers 
function numberGenerator(min, max) {
    return min + Math.floor(Math.random() * max)
}



// sets 3d effect on Game Heading
jQuery(document).ready(function(){
    $('h1').mousemove(function(e){
    var rXP = (e.pageX - this.offsetLeft-$(this).width()/2);
    var rYP = (e.pageY - this.offsetTop-$(this).height()/2);
    $('h1').css('text-shadow', +rYP/10+'px '+rXP/80+'px rgba(227,6,19,.8), '+rYP/8+'px '+rXP/60+'px rgba(255,237,0,1), '+rXP/70+'px '+rYP/12+'px rgba(0,159,227,.7)');
    });
});