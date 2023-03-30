import './style.css'

const shipFactory = (length) => {
  let hitCount = 0;
  const hit = () => hitCount += 1;
  const isSunk = () => {return (hitCount >= length) ? true: false};
  return { length, isSunk, hit };
}

const gameboardFactory = () => {
  let board = [['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','',''],
               ['','','','','','','','','','']]
  const place = (y, x, ship, orientation) => {
    if(orientation == 'v' && (ship.length + y > 10)){
      for(let i = 10-ship.length; i < 10; i++){
        board[i][x] = ship;
      }
    } else if(orientation == 'h' && (ship.length + x > 10)){
      for(let i = 10-ship.length; i < 10; i++){
        board[y][i] = ship;
      }
    } else {
      for(let i = 0; i < ship.length; i++){
        if(orientation == 'h'){
          board[y][x+i] = ship;
        } else if(orientation == 'v'){
          board[y+i][x] = ship;
        }  
      }
    }
  }
  const receiveAttack = (y, x) => {
    if(board[y][x] == '') {
      board[y][x] = 'O';
    } else if (typeof board[y][x] === 'object') {
      board[y][x].hit();
      board[y][x] = 'X';
    } else if(board[y][x] == 'O' || board[y][x] == 'X'){
      return 'Invalid position!';
    }
  }
  const areAllShipsSunk = () => {
    for(let row of board){
      for(let entry of row){
        if(typeof entry === 'object'){
          return false;
        }
      }
    }
    return true;
  }
  
  return { place, receiveAttack, areAllShipsSunk, board }
}

const playerFactory = (active) => {
  return {
    get active() {
      return active;
    },

    set active(current) {
      active = current;
    }
  }
};

const aiFactory = () => {
  const aPlayer = playerFactory(false)
  const performAttack = (board) => {
    let y = Math.floor(Math.random() * 10)
    let x = Math.floor(Math.random() * 10)
    while(board.board[y][x] == 'O' || board.board[y][x] == 'X') {
      y = Math.floor(Math.random() * 10)
      x = Math.floor(Math.random() * 10)
    }
    board.receiveAttack(y, x)
  }

  return {
    ...aPlayer,
    performAttack
  }
}

export { shipFactory, gameboardFactory, playerFactory, aiFactory }