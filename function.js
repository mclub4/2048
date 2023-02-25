
let weight, level;
let score;
let time, timer;
let restart = false;
let gameover = true;
let gameboard_array; //게임판 좌표의 데이터가 저장되는 2차원 배열
let gameboard; //시각적으로 보여지는 게임판

function gameStart(){
    if(restart){
        gameboard.remove();
    }
    gameboard = document.createElement('table');
    clearInterval(timer);

    // 난이도별 가중치 지정정
    weight = parseInt(document.querySelector('input[name="mode"]:checked').value);
    level = document.querySelector('input[name="mode"]:checked').dataset.mode;

    // 게임판 생성
    gameboard_array = Array.from(Array(weight), () => new Array(weight).fill(0));

    const fragment = document.createDocumentFragment();


    // class => 칸을 분류하기 위한 class
    // id => 2048 게임판의 좌표 값
    // data-number => 칸에 담긴 숫자 (CSS에서 색깔 변경용)
    for(var i = 0; i<weight; i++){
        const tr = document.createElement('tr');
        for(var j = 0; j<weight; j++){
            const td = document.createElement('td');
            td.className = "cell";
            td.id = weight*i + j;
            td.dataset.number = "0";
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    }
    
    gameboard.appendChild(fragment);
    document.body.appendChild(gameboard);
    score = 0;

    if(level == "hard") gameboard_array[2][2] = "X";

    randomXY();
    randomXY();

    // gameboard_array =  [[8,4,2,4],
    //                     [4,16,8,2],
    //                     [16,2,4,8],
    //                     [32,64,128,2]]; //test 코드임
 
    update();

    restart = true;
    gameover = false;

    if(level == "challenge"){
        time = 5;
        let displayTime = document.querySelector('#time');
        displayTime.innerHTML = "남은 시간 : " + time + "초";
        timer = setInterval(() => {
            time --;
            displayTime.innerHTML = "남은 시간 : " + time + "초";
            if(time == 0){
                gameOver();
                clearInterval(timer);
            }
        }, 1000);
    }
}

// 변경사항 게임판에 반영
function update(){
    for(var i = 0; i<weight; i++){
        for(var j = 0; j<weight; j++){
            let box = document.getElementById(i*weight +j); //id의 첫번째 철자가 숫자면 이스케이프 문자 추가해줘야됨 
            box.innerHTML = gameboard_array[i][j];
            box.dataset.number = gameboard_array[i][j].toString();
        }
    }
    document.querySelector('#score').innerHTML = score;
}

//랜덤 좌표 및 숫자 생성
function randomXY() {
    while(true){
        let rand = parseInt(Math.random() * (weight*weight));
        let x = parseInt(rand / weight);
        let y = rand % weight;
        if (gameboard_array[x][y] == 0){
            gameboard_array[x][y] = randomNumber();
            animation(document.getElementById(x*weight + y), created=true);
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

// 마우스, 키보드 입력 처리

let startPoint;

window.addEventListener('mousedown', (e)=> {
    startPoint = [e.clientX, e.clientY];
});

window.addEventListener('mouseup', (e)=> {
    if(restart && !gameover){
        const endPoint = [e.clientX, e.clientY];
        const diffX = endPoint[0]-startPoint[0];
        const diffY = endPoint[1]-startPoint[1];
        if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
            left();
        } else if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
            right();
        } else if (diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)) {
            down();
        } else if (diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)) {
            up();
        }
    }
});

window.addEventListener('keydown', (e) => {
    if(restart && !gameover){
        switch(e.key){
            case 'ArrowLeft': left(); e.preventDefault(); break;
            case 'ArrowRight': right(); e.preventDefault(); break;
            case 'ArrowUp' : e.preventDefault(); up(); break;
            case 'ArrowDown' :  e.preventDefault(); down(); break;
        }
    }
});


// 방향별 이동 처리

function up(){
    //let check_array = Array.from(Array(weight), () => new Array(weight).fill(0));
    //console.time('check');
    //console.timeEnd('check');
    var isMoved = false;
    var isSummed = false;

    for(var i = 1; i<weight; i++){
        for(var j = 0; j<weight; j++){
            if(gameboard_array[i][j] == 0 || gameboard_array[i][j] == "X") continue;
                var temp = i-1; //사이에 빈칸이 있는지 체크용 변수
                while(temp>0 && gameboard_array[temp][j] == 0) temp --;
                if(gameboard_array[temp][j] == 0){
                    // 사이에 다 빈칸이면 끝까지 땡김
                    gameboard_array[temp][j] = gameboard_array[i][j];
                    gameboard_array[i][j]=0;
                    isMoved = true;
                }
                else if(gameboard_array[temp][j] != gameboard_array[i][j]){
                    // 다른 숫자에 걸리면 앞에 둠
                    if(temp + 1 == i) continue;
                    gameboard_array[temp+1][j] = gameboard_array[i][j];
                    gameboard_array[i][j] = 0;
                    isMoved = true;                }
                else{
                    // 같은 숫자에 걸리면 합칠 수 있는지 여부 확인
                    if(gameboard_array[temp][j] > 0){
                        gameboard_array[temp][j] *= -2;
                        gameboard_array[i][j] = 0;
                        score += Math.abs(gameboard_array[temp][j]);
                        isMoved = true;
                        isSummed = true;
                    }
                    else{
                        gameboard_array[temp+1][j] = gameboard_array[i][j];
                        gameboard_array[i][j] = 0;
                        isMoved = true;
                    }
                }
        }
    }

    checkMove(isMoved, isSummed);
}

function down(){
    var isMoved = false;
    var isSummed = false;

    for(var i = weight - 2; i>=0; i--){
        for(var j = 0; j<weight; j++){
            if(gameboard_array[i][j] == 0 || gameboard_array[i][j] == "X") continue;
                var temp = i+1; //사이에 빈칸이 있는지 체크용 변수
                while(temp<(weight-1) && gameboard_array[temp][j] == 0) temp ++;
                if(gameboard_array[temp][j] == 0){
                    gameboard_array[temp][j] = gameboard_array[i][j];
                    gameboard_array[i][j]=0;
                    isMoved = true;
                }
                else if(gameboard_array[temp][j] != gameboard_array[i][j]){
                    if(temp-1 == i) continue;
                    gameboard_array[temp-1][j] = gameboard_array[i][j];
                    gameboard_array[i][j] = 0;
                    isMoved = true;
                }
                else{
                    if(gameboard_array[temp][j] > 0){
                        gameboard_array[temp][j] *= -2;
                        gameboard_array[i][j] = 0;
                        score += Math.abs(gameboard_array[temp][j]);
                        isMoved = true;
                        isSummed = true;
                    }
                    else{
                        gameboard_array[temp-1][j] = gameboard_array[i][j];
                        gameboard_array[i][j] = 0;
                        isMoved = true;
                    }
                }
        }
    }

    checkMove(isMoved, isSummed);
}

function left(){
    var isMoved = false;
    var isSummed = false;

    for(var i = 0; i<weight; i++){
        for(var j = 1; j<weight; j++){
            if(gameboard_array[i][j] == 0 || gameboard_array[i][j] == "X") continue;
                var temp = j-1; //사이에 빈칸이 있는지 체크용 변수
                while(temp>0 && gameboard_array[i][temp] == 0) temp --;
                if(gameboard_array[i][temp] == 0){
                    gameboard_array[i][temp] = gameboard_array[i][j];
                    gameboard_array[i][j]=0;
                    isMoved = true;
                }
                else if(gameboard_array[i][temp] != gameboard_array[i][j]){
                    if(temp + 1 == j) continue;
                    gameboard_array[i][temp+1] = gameboard_array[i][j];
                    gameboard_array[i][j] = 0;
                    isMoved = true;
                }
                else{
                    if(gameboard_array[i][temp] > 0){
                        gameboard_array[i][temp] *= -2;
                        gameboard_array[i][j] = 0;
                        score += Math.abs(gameboard_array[i][temp]);
                        isMoved = true;
                        isSummed = true;
                    }
                    else{
                        gameboard_array[i][temp+1] = gameboard_array[i][j];
                        gameboard_array[i][j] = 0;
                        isMoved = true;
                    }
                }
        }
    }

    checkMove(isMoved, isSummed);
}

function right(){
    var isMoved = false;
    var isSummed = false;

    for(var i = 0; i<weight; i++){
        for(var j = weight-2; j>=0; j--){
            if(gameboard_array[i][j] == 0 || gameboard_array[i][j] == "X") continue;
                var temp = j+1; //사이에 빈칸이 있는지 체크용 변수
                while(temp<(weight-1) && gameboard_array[i][temp] == 0) temp ++;
                if(gameboard_array[i][temp] == 0){
                    gameboard_array[i][temp] = gameboard_array[i][j];
                    gameboard_array[i][j]=0;
                    isMoved = true;
                }
                else if(gameboard_array[i][temp] != gameboard_array[i][j]){
                    if(temp-1 == j) continue;
                    gameboard_array[i][temp-1] = gameboard_array[i][j];
                    gameboard_array[i][j] = 0;
                    isMoved = true;
                }
                else{
                    if(gameboard_array[i][temp] > 0){
                        gameboard_array[i][temp] *= -2;
                        gameboard_array[i][j] = 0;
                        score += Math.abs(gameboard_array[i][temp]);
                        isMoved = true;
                        isSummed = true;
                    }
                    else{
                        gameboard_array[i][temp-1] = gameboard_array[i][j];
                        gameboard_array[i][j] = 0;
                        isMoved = true;
                    }
                }
        }
    }

    checkMove(isMoved, isSummed);    
}

function checkMove(isMoved, isSummed){
    if(isMoved){
        if(isSummed){
            for(var i = 0; i<weight; i++){
                for(var j = 0; j<weight; j++){
                    if(gameboard_array[i][j] < 0) gameboard_array[i][j] =  Math.abs(gameboard_array[i][j]);
                    animation
                }
            }
        }
        randomXY();
        update();
    }
    else{
        if(!checkGameOver()) randomXY();
        else gameOver();
    }
}

// 게임오버 체크

function checkGameOver(){
    // 가로로 합쳐질 수 있는지 확인
    for(var i = 0; i<weight; i++){
        var temp = gameboard_array[i][0];
        if(temp == 0) return false;
        for(var j = 1; j<weight; j++){
            if(gameboard_array[i][j] == 0 || gameboard_array[i][j] == temp) return false;
            else temp = gameboard_array[i][j];
        }
    }
    
    // 세로로 합쳐질 수 있는지 확인
    for(var i = 0; i<weight; i++){
        var temp = gameboard_array[0][i];
        if(temp == 0) return false;
        for(var j = 1; j<weight; j++){
            if(gameboard_array[j][i] == 0 || gameboard_array[j][i] == temp) return false;
            else temp = gameboard_array[j][i];
        }
    }

    return true;
}

function gameOver(){
    gameover = true;
    const max = getMax();
    time = 0;
    alert("[ 게임 오버 ]\n당신의 점수는 " + score + "이고, 가장 큰 숫자는 " + max + "입니다.");

}

// 최고 점수 계산

function getMax(){
    let max = 0;
    for(var i = 0; i<weight; i++){
        for(var j = 0; j<weight; j++){
            if(gameboard_array[i][j] > max) max = gameboard_array[i][j];
        }
    }

    return max;
}


// 애니메이션 주기
async function animation(cell, created){
    if (created) {
        console.log("애니메");
        cell.animate(
            {
                transform: [
                    'scale(0.5)', // 시작 값
                    'scale(1)' // 종료 값
                ]
            },
            {
                duration: 200, // 밀리초 지정
                fill: 'forwards', // 종료 시 속성을 지님
                easing: 'ease' // 가속도 종류
            }
        );
    }
}