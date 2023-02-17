
function game_start(){
    alert("게임이 시작되었습니다!");
    

    // 게임판 생성
    const game_board = document.createElement('table');

    for(var i = 0; i<4; i++){
        const tr = document.createElement('tr');
        for(var j = 0; j<4; j++){
            const td = document.createElement('td');
            td.id = 4*i + j;
            tr.appendChild(td);
        }
        game_board.appendChild(tr);
    }

    document.body.appendChild(game_board);
}

function generate(){

}

function move(){
    
}