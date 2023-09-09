// Desc: Main game file for Circus Purin
// Author: David_ca6
// Date: 20 July 2023
// Version: 1.0

// set up canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let state = 0;
let frame = 0;
let debug = false;

let gameOver = false;

let gravity = 0.4;
let ground = 0;
let offset = 0;
let speed= 1;

let fireRings = [];
let firePots = [];

// key event object
keyEvt = {
    state: {
        left : false,
        right: false,
        up   : false,
        down : false,
        space: false,
        enter: false,
        esc  : false,
        shift: false,
        z    : false,
        x    : false,
        a    : false,
        s    : false,
    },
    pressed: {
        left : false,
        right: false,
        up   : false,
        down : false,
        space: false,
        enter: false,
        esc  : false,
        shift: false,
        z    : false,
        x    : false,
        a    : false,
        s    : false,
    },
    pressedNow: {
        left : false,
        right: false,
        up   : false,
        down : false,
        space: false,
        enter: false,
        esc  : false,
        shift: false,
        z    : false,
        x    : false,
        a    : false,
        s    : false,
    },
}

player = {
    x: 200,
    y: 0,
    width: 0,
    height: 0,

    frame: 0,

    dir: 0, // moving direction
    isJumping: false,
    jumpForce: 13,

    speed: 0,
    walkSpeed: 3,
    runSpeed: 3,
    jumpSpeed: 0,

    sprite: null,

    colider: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },

    walking0: new Image(),
    walking1: new Image(),
    jumping0: new Image(),
    jumping1: new Image(),
    dead0: new Image(),
    dead1: new Image(),
}

fireRing = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,

    colider: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },

    sprite: null,
    frame0: new Image(),
    frame1: new Image(),
}

firePot = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,

    colider: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },

    sprite: null,
    frame0: new Image(),
    frame1: new Image(),
}

podium = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,

    colider: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },

    sprite: null,
    frame0: new Image(),
    frame1: new Image(),
}


// load bg image
const startImage = new Image();
startImage.src = "./assets/ui/start.png";
startImage.onload = () => { 
    canvas.width = startImage.width;
    canvas.height = startImage.height;
    startGame();
};
const bgImage = new Image();

// read key input press
document.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.key === "ArrowLeft") { keyEvt.state.left  = true;}
    if (e.key === "ArrowRight") { keyEvt.state.right = true; }
    if (e.key === "ArrowUp") { keyEvt.state.up    = true; }
    if (e.key === "ArrowDown") { keyEvt.state.down  = true; }
    if (e.key === " ") { keyEvt.state.space  = true; }
    if (e.key === "Enter") { keyEvt.state.enter  = true; }
    if (e.key === "z" || e.key === "Z") { keyEvt.state.z  = true; }
    if (e.key === "x" || e.key === "X") { keyEvt.state.x  = true; }
    if (e.key === "a" || e.key === "A") { keyEvt.state.a  = true; }
    if (e.key === "s" || e.key === "S") { keyEvt.state.s  = true; }
});

// read key input release
document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowLeft") { keyEvt.state.left  = false;  keyEvt.pressed.left  = false; }
    if (e.key === "ArrowRight") { keyEvt.state.right = false;  keyEvt.pressed.right  = false; }
    if (e.key === "ArrowUp") { keyEvt.state.up    = false;  keyEvt.pressed.up  = false; }
    if (e.key === "ArrowDown") { keyEvt.state.down  = false;  keyEvt.pressed.down  = false; }
    if (e.key === " ") { keyEvt.state.space  = false;  keyEvt.pressed.space  = false; }
    if (e.key === "Enter") { keyEvt.state.enter  = false;  keyEvt.pressed.enter  = false; }
    if (e.key === "z" || e.key === "Z") { keyEvt.state.z  = false;  keyEvt.pressed.z  = false; }
    if (e.key === "x" || e.key === "X") { keyEvt.state.x  = false;  keyEvt.pressed.x  = false; }
    if (e.key === "a" || e.key === "A") { keyEvt.state.a  = false;  keyEvt.pressed.a  = false; }
    if (e.key === "s" || e.key === "S") { keyEvt.state.s  = false;  keyEvt.pressed.s  = false; }
});

// start game and initialize game objects
function startGame() { 

    // load images
    bgImage.src = "./assets/ui/bg.png";
    player.walking0.src = "./assets/player/walking/frame0.png";
    player.walking1.src = "./assets/player/walking/frame1.png";
    player.jumping0.src = "./assets/player/jumping/frame0.png";
    player.jumping1.src = "./assets/player/jumping/frame1.png";
    player.dead0.src    = "./assets/player/dead/frame0.png";
    player.dead1.src    = "./assets/player/dead/frame1.png";

    fireRing.frame0.src = "./assets/fireRing/frame0.png";
    fireRing.frame1.src = "./assets/fireRing/frame1.png";

    firePot.frame0.src = "./assets/firePot/frame0.png";
    firePot.frame1.src = "./assets/firePot/frame1.png";

    podium.frame0.src = "./assets/podium/frame0.png";
    podium.frame1.src = "./assets/podium/frame1.png";

    setTimeout(() => {
        setupStage();
    }, 1000);

}

function setupStage() {
    gameOver = false;

    offset = 0;

    input();

    // set player values
    player.sprite = player.walking0;
    player.width = player.sprite.width;
    player.height = player.sprite.height;
    player.y = canvas.height - player.height - 76;
    ground = player.y;

    // set fire ring values
    fireRing.sprite = fireRing.frame0;
    fireRing.x = 800;
    fireRing.y = 283;
    fireRing.width = fireRing.sprite.width;
    fireRing.height = fireRing.sprite.height;

    fireRing.colider.x = fireRing.x;
    fireRing.colider.y = fireRing.y+fireRing.sprite.height-15;
    fireRing.colider.width = fireRing.width;
    fireRing.colider.height = canvas.height-fireRing.colider.y;

    if(fireRings.length > 0){
        fireRings = [];
    }

    for (let i = 0; i < 30; i++) {
        const newFireRing = {
            x: 800+(i * 600), // Set x position for each fire ring (you can adjust the value as per your game's requirement)
            y: fireRing.y,
            width: fireRing.width,
            height: fireRing.height,
            sprite: fireRing.frame0, // Use the first frame of the fire ring as the default sprite

            colider: {
                x: fireRing.colider.x,
                y: fireRing.colider.y,
                width: fireRing.colider.width,
                height: fireRing.colider.height,
            },
        };
        fireRings.push(newFireRing); // Add the new fire ring to the fireRings array
    }

    // set fire pot values
    firePot.sprite = firePot.frame0;
    firePot.x = 800;
    firePot.y = 517;
    firePot.width = firePot.sprite.width;
    firePot.height = firePot.sprite.height;

    firePot.colider.x = firePot.x;
    firePot.colider.y = firePot.y+30;
    firePot.colider.width = firePot.width;
    firePot.colider.height = canvas.height-firePot.colider.y;

    if(fireRings.length > 0){
        firePots = [];
    }

    for (let i = 0; i < 30; i++) {
        const newFirePots = {
            x: 800+(i * 600), // Set x position for each fire ring (you can adjust the value as per your game's requirement)
            y: firePot.y,
            width: firePot.width,
            height: firePot.height,
            sprite: firePot.frame0, // Use the first frame of the fire ring as the default sprite

            colider: {
                x: firePot.colider.x,
                y: firePot.colider.y,
                width: firePot.colider.width,
                height: firePot.colider.height,
            },
        };
        firePots.push(newFirePots); // Add the new fire ring to the fireRings array
    }

    // set podium values
    podium.sprite = podium.frame0;
    podium.x = 800+(31 * 600);
    podium.y = 0;
    podium.width = podium.sprite.width;
    podium.height = podium.sprite.height;
    podium.colider.x = podium.x;
    podium.colider.y = podium.y;
    podium.colider.width = podium.width;
    podium.colider.height = podium.height;


   drawSplashScreen("");

   // start game loop
   setTimeout(() => {
       startScreenLoop();
       //gameLoop();
   }, 1500);
}

function startScreenLoop() {
    // get input
    input();

    drawSplashScreen("Press Space to Start");

    if(keyEvt.pressedNow.space){
        gameLoop();
    } else {
        requestAnimationFrame(startScreenLoop);
    }
}

function gameOverScreenLoop() {
    // get input
    input();

    //drawSplashScreen("Press Space to Start");

    // start game loop
    setTimeout(() => {
        setupStage();
    //gameLoop();
    }, 1500);

}

// main game loop
function gameLoop() { 
    
    // get input
    input();

    // Update stuff from input
    update();

    frame++;

    // Draw graphics to screen
    draw();


    // Repeat gameLoop function
    if(gameOver){
        gameOverScreenLoop();
        //setupStage();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// update key event sync with game loop
function input() { 
    // update keyEvt.pressedNow
    keyEvt.pressedNow.left  = keyEvt.state.left  && !keyEvt.pressed.left;
    if(keyEvt.pressedNow.left){
        keyEvt.pressed.left  = true; 
    }

    keyEvt.pressedNow.right = keyEvt.state.right && !keyEvt.pressed.right;
    if(keyEvt.pressedNow.right){
        keyEvt.pressed.right  = true; 
    }

    keyEvt.pressedNow.up    = keyEvt.state.up    && !keyEvt.pressed.up;
    if(keyEvt.pressedNow.up){
        keyEvt.pressed.up  = true; 
    }
    
    keyEvt.pressedNow.down  = keyEvt.state.down  && !keyEvt.pressed.down;
    if(keyEvt.pressedNow.down){
        keyEvt.pressed.down  = true; 
    }
    
    keyEvt.pressedNow.space  = keyEvt.state.space  && !keyEvt.pressed.space;
    if(keyEvt.pressedNow.space){
        keyEvt.pressed.space  = true; 
    }
    
    keyEvt.pressedNow.enter  = keyEvt.state.enter  && !keyEvt.pressed.enter;
    if(keyEvt.pressedNow.enter){
        keyEvt.pressed.enter  = true; 
    }
    
    keyEvt.pressedNow.z  = keyEvt.state.z  && !keyEvt.pressed.z;
    if(keyEvt.pressedNow.z){
        keyEvt.pressed.z  = true; 
    }
    
    keyEvt.pressedNow.x  = keyEvt.state.x  && !keyEvt.pressed.x;
    if(keyEvt.pressedNow.x){
        keyEvt.pressed.x  = true; 
    }
    
    keyEvt.pressedNow.a  = keyEvt.state.a  && !keyEvt.pressed.a;
    if(keyEvt.pressedNow.a){
        keyEvt.pressed.a  = true; 
    }
    
    keyEvt.pressedNow.s  = keyEvt.state.s  && !keyEvt.pressed.s;
    if(keyEvt.pressedNow.s){
        keyEvt.pressed.s  = true; 
    }
}

// update game state
function update() { 

    if(keyEvt.pressedNow.a){
        debug = !debug;
    }

    // update player direction and speed
    if(!player.isJumping){
        if(keyEvt.state.left && offset > 0){
            player.dir = -1;
            player.speed = player.walkSpeed;
        } else if(keyEvt.state.right){
            player.dir = 1;
            player.speed = player.runSpeed;
        } else {
            player.dir = 0;
            player.speed = 0;
        }
    }

    // make player jump
    if(keyEvt.pressedNow.up && !(player.isJumping)){
        player.isJumping = true;
        player.jumpSpeed = player.jumpForce;
        player.sprite = player.jumping0;
    }

    // ground player when jumping
    if(player.isJumping){
        state = 1;
        player.y -= player.jumpSpeed;
        player.jumpSpeed -= gravity;
        if(player.y >= ground){
            player.isJumping = false;
            player.y = ground;
            player.sprite = player.walking0;
        }
    } else {
        state = 0;
    }

    // update player sprite
    if(frame%8 === 0){

        // if(!(player.isJumping)){
        //     if(player.dir === 0){
        //         player.frame = 0;
        //         player.sprite = player.walking0;
        //     } else {
        //         if(player.frame === 0) {
        //             player.frame = 1;
        //             player.sprite = player.walking1;
        //         } else {
        //             player.frame = 0;
        //             player.sprite = player.walking0;
        //         }
        //     }
        // } else {
        //     if(player.frame === 0) {
        //         player.frame = 1;
        //         player.sprite = player.jumping1;
        //     } else {
        //         player.frame = 0;
        //         player.sprite = player.jumping0;
        //     }
        // }
    } 

    // update player position
    if(player.dir === -1){
        //player.x -= player.speed;
        offset -= player.speed;
    } else if(player.dir === 1){
        //player.x += player.speed;
        offset += player.speed;
    }

    // update object animation
    if(frame%8 === 0){
        if(player.sprite === player.dead0){
            player.sprite = player.dead1;
        } else if(player.sprite === player.dead1){
            player.sprite = player.dead0;
        }

        if(player.sprite === player.walking0){
            player.sprite = player.walking1;
        } else if(player.sprite === player.walking1){
            player.sprite = player.walking0;
        }

        if(player.sprite === player.jumping0){
            player.sprite = player.jumping1;
        } else if(player.sprite === player.jumping1){
            player.sprite = player.jumping0;
        }

        if(fireRing.sprite === fireRing.frame0){
            fireRing.sprite = fireRing.frame1;
        } else {
            fireRing.sprite = fireRing.frame0;
        }

        if(firePot.sprite === firePot.frame0){
            firePot.sprite = firePot.frame1;
        } else {
            firePot.sprite = firePot.frame0;
        }
    }

    for (let i = 0; i < fireRings.length; i++) {
        const fireObj = fireRings[i];
        fireObj.x -= speed+(player.dir*(player.speed));
        fireObj.sprite = fireRing.sprite;
    }

    for (let i = 0; i < firePots.length; i++) {
        const fireObj = firePots[i];
        fireObj.x -= (player.dir*(player.speed));
        fireObj.sprite = firePot.sprite;
    }

    podium.x -= (player.dir*(player.speed));

    player.colider.x = player.x+25;
    player.colider.y = player.y;
    player.colider.width = player.width-50;
    player.colider.height = player.height-10;

    // check for collision with fire ring colider
    for (let i = 0; i < fireRings.length; i++) {
        const fireRingObj = fireRings[i];
        
        // update fire ring colider position to match fire ring position
        fireRingObj.colider.x = fireRingObj.x+20;
        fireRingObj.colider.width = fireRingObj.width-40;
        //fireRingObj.colider.y = fireRingObj.height-200;

        if(coliderCheck(player.colider, fireRingObj.colider)){
            gameOver = true;
        }
    }

    for (let i = 0; i < firePots.length; i++) {
        const fireObj = firePots[i];
        
        // update fire ring colider position to match fire ring position
        fireObj.colider.x = fireObj.x+20;
        fireObj.colider.width = fireObj.width-40;
        //fireRingObj.colider.y = fireRingObj.height-200;

        if(coliderCheck(player.colider, fireObj.colider)){
            gameOver = true;
        }
    }

    // check for collision with podium colider
    podium.colider.x = podium.x+20;
    podium.colider.width = podium.width-40;
    if(coliderCheck(player.colider, podium.colider)){
        gameOver = true;
    }

    // if(debug){
    //     gameOver = false;
    // }

    if(gameOver){
        player.sprite = player.dead0;
    }
}

function coliderCheck(obj1, obj2) {
    if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y){
        return true;
    } else {
        return false;
    }
}

function drawSplashScreen(text) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0);

    if(text !== ""){
        //ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "purple";
        ctx.fillStyle = "pink";
        ctx.lineWidth = 2;
        ctx.font = "100px Arial";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    }
}

// main draw function
function draw() { 
    // Clear canvas
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    ctx.drawImage(bgImage, 0, 0);

    // Draw player
    ctx.drawImage(player.sprite, player.x, player.y);

    // Draw fire ring
    for (let i = 0; i < fireRings.length; i++) {
        const fireObj = fireRings[i];
        ctx.drawImage(fireObj.sprite, fireObj.x, fireObj.y);
    }

    // Draw fire pot
    for (let i = 0; i < firePots.length; i++) {
        const fireObj = firePots[i];
        ctx.drawImage(fireObj.sprite, fireObj.x, fireObj.y);
    }

    // Draw podium
    ctx.drawImage(podium.sprite, podium.x, podium.y);

    // Draw score Text
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    //ctx.fillText("Line 1", 225, 70);
    //ctx.fillText("Line 2", 225, 100);

    ctx.font = "40px Arial";
    ctx.fillText("Stage 1", 300, 85);

    let distance = Math.floor(offset/25);
    ctx.font = "40px Arial";
    ctx.fillText("Distance " + distance, 800, 85);



    // Draw debug

    debugDraw();
}

function debugDraw() {

    if(debug){
        // Draw fire ring
        for (let i = 0; i < fireRings.length; i++) {
            const fireObj = fireRings[i];
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(fireObj.colider.x, fireObj.colider.y, fireObj.colider.width, fireObj.colider.height);
        }

        // Draw fire pot
        for (let i = 0; i < firePots.length; i++) {
            const fireObj = firePots[i];
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(fireObj.colider.x, fireObj.colider.y, fireObj.colider.width, fireObj.colider.height);
        }

        // Draw podium colider
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(podium.colider.x, podium.colider.y, podium.colider.width, podium.colider.height);
        
        // draw player colider
        ctx.fillStyle = "rgba(0, 255, 0, 0.5)";   
        ctx.fillRect(player.colider.x, player.colider.y, player.colider.width, player.colider.height);


        if(state === 0){
            ctx.fillStyle = "green";
        } else if(state === 1){
            ctx.fillStyle = "blue";
        } else if(state === 2){
            ctx.fillStyle = "yellow";
        } else if(state === 3){
            ctx.fillStyle = "red";
        }
        ctx.fillRect(0, 0, 15, 15);

    }
}