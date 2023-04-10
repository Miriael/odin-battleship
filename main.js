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
  //Inherit from player factory
  let currentHits = []
  const aPlayer = playerFactory(false)

  const randomAttack = (board, y, x) => {
    if(x == null || y == null){
      y = Math.floor(Math.random() * 10);
      x = Math.floor(Math.random() * 10);
    }
    while(board.board[y][x] == 'O' || board.board[y][x] == 'X') {
      y = Math.floor(Math.random() * 10);
      x = Math.floor(Math.random() * 10);
    }
    //If coordinate had a ship, add it to the list of currently known hits
    if(typeof board.board[y][x] === 'object'){
      currentHits.push([y, x])
    }
    board.receiveAttack(y, x)
  }

  const makeAdjecentTargetsList = (y, x) => {
    let arr = [];
    if(y == 0){
      arr.push([y+1, x]);
    } else if(y == 9){
      arr.push([y-1, x]);
    } else {
      arr.push([y-1, x]);
      arr.push([y+1, x]);
    }
    if(x == 0){
      arr.push([y, x+1]);
    } else if(x == 9){
      arr.push([y, x-1]);
    } else{
      arr.push([y, x-1]);
      arr.push([y, x+1]);
    }
    return arr;
  }

  const targetedAttack = (board, y, x) => {
    let targets = makeAdjecentTargetsList(y, x);
    for(let entry of targets){
      if(board.board[entry[0]][entry[1]] != 'O' && board.board[entry[0]][entry[1]] != 'X'){
        let fuckface = board.board[entry[0]][entry[1]]
        if(typeof fuckface === "object"){
          board.receiveAttack(entry[0], entry[1]);
          currentHits.pop();
          currentHits.push([entry[0], entry[1]]);
          break;
        } else{
          board.receiveAttack(entry[0], entry[1]);
          break;
        }
      }
    }
  }

  const performAttack = (board, y = null, x = null) => {
    //Attack a random coordinate if no damaged but still functional ships on the board
    if(currentHits.length > 0){
      y = currentHits[currentHits.length-1][0]
      x = currentHits[currentHits.length-1][1]
      targetedAttack(board, parseInt(y), parseInt(x))
    } else {
      randomAttack(board, y, x)
    }
  }

  function main() {

  }

  return {
    //Inherit from player factory
    ...aPlayer,
    performAttack,
    get currentHits() {
      return currentHits;
    }
  }
}

export { shipFactory, gameboardFactory, playerFactory, aiFactory }