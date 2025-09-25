// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Game constants
const CELL_SIZE = 20;
const ROWS = canvas.height / CELL_SIZE;
const COLS = canvas.width / CELL_SIZE;

// Game state
let score = 0;
let lives = 3;
let gameRunning = true;

// PacMan object
const pacman = {
    x: 1,
    y: 1,
    direction: 'right',
    nextDirection: 'right'
};

// Simple maze layout (1 = wall, 0 = dot, 2 = empty, 3 = pacman start)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let totalDots = 0;
let dotsEaten = 0;

// Initialize game
function initGame() {
    // Count total dots and find pacman start position
    totalDots = 0;
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 0) {
                totalDots++;
            } else if (maze[row][col] === 3) {
                pacman.x = col;
                pacman.y = row;
                maze[row][col] = 2; // Convert to empty space
            }
        }
    }
    
    score = 0;
    lives = 3;
    dotsEaten = 0;
    gameRunning = true;
    updateUI();
}

// Draw functions
function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            
            if (maze[row][col] === 1) {
                // Wall
                ctx.fillStyle = '#0000ff';
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = '#4444ff';
                ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            } else if (maze[row][col] === 0) {
                // Dot
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    const x = pacman.x * CELL_SIZE + CELL_SIZE/2;
    const y = pacman.y * CELL_SIZE + CELL_SIZE/2;
    const radius = CELL_SIZE/2 - 2;
    
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    
    // Draw pacman with mouth opening based on direction
    let startAngle = 0;
    let endAngle = Math.PI * 2;
    
    switch(pacman.direction) {
        case 'right':
            startAngle = Math.PI * 0.2;
            endAngle = Math.PI * 1.8;
            break;
        case 'left':
            startAngle = Math.PI * 1.2;
            endAngle = Math.PI * 0.8;
            break;
        case 'up':
            startAngle = Math.PI * 1.7;
            endAngle = Math.PI * 1.3;
            break;
        case 'down':
            startAngle = Math.PI * 0.3;
            endAngle = Math.PI * 0.7;
            break;
    }
    
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.lineTo(x, y);
    ctx.fill();
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Game logic
function canMove(x, y) {
    if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) {
        return false;
    }
    return maze[y][x] !== 1;
}

function movePacman() {
    let newX = pacman.x;
    let newY = pacman.y;
    
    // Try to change direction if a new direction was requested
    switch(pacman.nextDirection) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
    }
    
    if (canMove(newX, newY)) {
        pacman.direction = pacman.nextDirection;
    } else {
        // Continue in current direction
        newX = pacman.x;
        newY = pacman.y;
        switch(pacman.direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }
    }
    
    if (canMove(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
        
        // Check if pacman ate a dot
        if (maze[pacman.y][pacman.x] === 0) {
            maze[pacman.y][pacman.x] = 2; // Convert to empty space
            score += 10;
            dotsEaten++;
            
            // Check win condition
            if (dotsEaten >= totalDots) {
                gameWin();
            }
        }
    }
}

function gameWin() {
    gameRunning = false;
    alert('Congratulations! You won! Score: ' + score);
    restartGame();
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

function updateUI() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    clearCanvas();
    drawMaze();
    movePacman();
    drawPacman();
    updateUI();
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            pacman.nextDirection = 'up';
            break;
        case 'ArrowDown':
            e.preventDefault();
            pacman.nextDirection = 'down';
            break;
        case 'ArrowLeft':
            e.preventDefault();
            pacman.nextDirection = 'left';
            break;
        case 'ArrowRight':
            e.preventDefault();
            pacman.nextDirection = 'right';
            break;
    }
});

// Restart function
function restartGame() {
    gameOverElement.style.display = 'none';
    
    // Reset maze
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 2) {
                maze[row][col] = 0; // Convert empty spaces back to dots
            }
        }
    }
    
    initGame();
}

// Start the game
initGame();
setInterval(gameLoop, 150); // Game runs at ~6.7 FPS for classic feel