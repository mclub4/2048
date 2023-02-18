
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

    // 게임판 생성
    gameboard_array = Array.from(Array(4), () => new Array(4).fill(0))

    for(var i = 0; i<weight; i++){
        const tr = document.createElement('tr');
        for(var j = 0; j<weight; j++){
            const td = document.createElement('td');
            td.className = "number";
            td.id = weight*i + j;
            tr.appendChild(td);
        }
        gameboard.appendChild(tr);
    }
    
    document.body.appendChild(gameboard);
    score = 0;

    randomXY();
    randomXY();
    update();
    console.table(gameboard_array);
}

//변경사항 게임판에 반영
function update(){
    for(var i = 0; i<weight; i++){
        for(var j = 0; j<weight; j++){
        //  document.querySelector("[id='" + (i+j*4).toString() + "']").innerHTML = gameboard_array[i][j];
            console.log([i, j]);
            console.log("#\\3" + (i+j*4).toString());
            document.querySelector('#' + CSS.escape(i+j*4)).innerHTML = gameboard_array[i][j]; //id의 첫번째 철자가 숫자면 이스케이프 문자 추가해줘야됨
        }
    }
}

//랜덤 
function randomXY() {
    while(true){
        let rand = parseInt(Math.random() * (weight*weight));
        let x = parseInt(rand / weight);
        let y = rand % weight;
        if (gameboard_array[x][y] == 0){
            gameboard_array[x][y] = randomNumber();
            return;
        }
    }
}

function randomNumber(){
    let rand = parseInt(Math.random*10);
    if(rand == 0 && weight == 3) return 8;
    if(rand == 0) return 4;
    else return 2;
}

// 키보드 입력 처리 + 방향키 스크롤 방지
document.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'ArrowLeft': left(); e.preventDefault(); break;
        case 'ArrowRight': right(); e.preventDefault(); break;
        case 'ArrowUp' : up(); e.preventDefault(); break;
        case 'ArrowDown' : down(); e.preventDefault(); break;
    }
});

// 방향별 이동 처리
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