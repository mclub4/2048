
const normal = 1;
const challenge = 2; 
const hard = 3;

let weight;
let score;
let restart = false;
let gameover = true;
let gameboard_array; //게임판 좌표의 데이터가 저장되는 2차원 배열
let gameboard; //시각적으로 보여지는 게임판

function gameStart(){
    if(restart){
        gameboard.remove();
    }
    gameboard = document.createElement('table');

    // 난이도별 가중치 지정정
    weight = parseInt(document.querySelector('input[name="mode"]:checked').value);
    // 게임판 생성
    gameboard_array = Array.from(Array(weight), () => new Array(weight).fill(0));

    const fragment = document.createDocumentFragment();
    for(var i = 0; i<weight; i++){
        const tr = document.createElement('tr');
        for(var j = 0; j<weight; j++){
            const td = document.createElement('td');
            td.className = "number";
            td.id = weight*i + j;
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    }
    
    gameboard.appendChild(fragment);
    document.body.appendChild(gameboard);
    score = 0;

    randomXY();
    randomXY();
    // gameboard_array = [[8,4,2,0],[4,0,0,2],[0,2,0,0],[0,0,0,0]]; //test 코드임

    update();

    restart = true;
    gameover = false;
    console.table(gameboard_array);
}

//변경사항 게임판에 반영
function update(){
    for(var i = 0; i<weight; i++){
        for(var j = 0; j<weight; j++){
        //  document.querySelector("[id='" + (i+j*4).toString() + "']").innerHTML = gameboard_array[i][j];
            let box = document.querySelector('#' + CSS.escape(i*weight +j)) //id의 첫번째 철자가 숫자면 이스케이프 문자 추가해줘야됨 
            box.innerHTML = gameboard_array[i][j];
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

// 마우스 입력 처리
let startPoint;

window.addEventListener('mousedown', (e)=> {
    startPoint = [e.clientX, e.clientY];
    // e.preventDefault();
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

// 방향별 이동 처리
let isMoved;
let isSummed;

function up(){
    //let check_array = Array.from(Array(weight), () => new Array(weight).fill(0));
    //console.time('check');
    //console.timeEnd('check');
    isMoved = false;
    isSummed = false;

    for(var i = 1; i<weight; i++){
        for(var j = 0; j<weight; j++){
            if(gameboard_array[i][j] == 0 || gameboard_array[i][j] == "X") continue;
                var temp = i-1; //사이에 빈칸이 있는지 체크용 변수
                while(temp>0 && gameboard_array[temp][j] == 0) temp --;
                // console.log("현재 " + [i,j] + "테스트 중, 체크용 변수는 " + temp + "임");
                if(gameboard_array[temp][j] == 0){
                    gameboard_array[temp][j] = gameboard_array[i][j];
                    gameboard_array[i][j]=0;
                    isMoved = true;
                }
                else if(gameboard_array[temp][j] != gameboard_array[i][j]){
                    if(temp + 1 == i) continue;
                    gameboard_array[temp+1][j] = gameboard_array[i][j];
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
                        gameboard_array[temp+1][j] = gameboard_array[i][j];
                        gameboard_array[i][j] = 0;
                        isMoved = true;
                    }
                }
        }
    }

    checkMove();
}

function down(){
    isMoved = false;
    isSummed = false;

    for(var i = weight - 2; i>=0; i--){
        for(var j = 0; j<weight; j++){
            if(gameboard_array[i][j] == 0 || gameboard_array[i][j] == "X") continue;
                var temp = i+1; //사이에 빈칸이 있는지 체크용 변수
                while(temp<(weight-1) && gameboard_array[temp][j] == 0) temp ++;
                // console.log("현재 " + [i,j] + "테스트 중, 체크용 변수는 " + temp + "임");
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

    checkMove();
}

function left(){
    isMoved = false;
    isSummed = false;

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

    checkMove();
}

function right(){
    isMoved = false;
    isSummed = false;

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

    checkMove();    
}

function checkMove(){
    if(isMoved){
        if(isSummed){
            for(var i = 0; i<weight; i++){
                for(var j = 0; j<weight; j++){
                    if(gameboard_array[i][j] < 0) gameboard_array[i][j] =  Math.abs(gameboard_array[i][j]);
                }
            }
        }
        randomXY();
        update();
    }
    else{
        if(!gameOver()) randomXY();
    }
}

function gameOver(){
    return false;
}

