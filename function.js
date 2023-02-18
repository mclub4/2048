
const normal = 1;
const challenge = 2; 
const hard = 3;

let weight;
let score;
let gameboard_array; //게임판 좌표의 데이터가 저장되는 2차원 배열
const gameboard = document.createElement('table'); //시각적으로 보여지는 게임판

function gameStart(){
    // 난이도별 가중치 지정정
    weight = parseInt(document.querySelector('input[name="mode"]:checked').value);
    console.log(weight);

    // 게임판 생성
    gameboard_array = Array.from(Array(4), () => new Array(4).fill(0))
    console.table(gameboard_array);

    for(var i = 0; i<4; i++){
        const tr = document.createElement('tr');
        for(var j = 0; j<4; j++){
            const td = document.createElement('td');
            td.id = 4*i + j;
            tr.appendChild(td);
        }
        gameboard.appendChild(tr);
    }

    document.body.appendChild(gameboard);
    score = 0;

    randomXY();
}

function randomXY(){
    let rand = parseInt(Math.random()*16);
    let y = parseInt(rand/4);
    let x = rand % 4;
    if(gameboard_array[x][y] == 0) gameboard_array[x][y] = randomNumber();

    while(true){
        rand = parseInt(Math.random()*16);
        y = parseInt(rand/4);
        x = rand % 4;
        if(gameboard_array[x][y] == 0){
            gameboard_array[x][y] = randomNumber();
            return ;
        }
    }
}

function randomNumber(){
    let rand = parseInt(Math.random*10);
    if(rand == 0 && weight == 3) return 8;
    if(rand == 0) return 4;
    else return 2;
}

// 키보드 입력 처리
document.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'ArrowLeft': console.log(e.key); break;
        case 'ArrowRight': console.log(e.key); break;
        case 'ArrowUp' : console.log(e.key); break;
        case 'ArrowDown' : console.log(e.key); break;
    }
});

function left(){
    let isMoved ;    
}

function right(){
    let isMoved ;    
}

function up(){
    let isMoved ;    
}

function down(){
    let isMoved ;    
}