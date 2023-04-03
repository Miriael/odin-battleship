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
  let currentOrientation = ''
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
      currentHits.push([[y], [x]])
    }
    board.receiveAttack(y, x)
  }

  const makeAdjecentTargetsList = (y, x) => {
    let arr = [[], []];
    if(y == 0){
      arr[0].push(y+1);
    } else if(y == 9){
      arr[0].push(y-1);
    } else {
      arr[0].push(y-1);
      arr[0].push(y+1);
    }
    if(x == 0){
      arr[1].push(x+1);
    } else if(x == 9){
      arr[1].push(x-1);
    } else{
      arr[1].push(x-1);
      arr[1].push(x+1);
    }
    return arr;
  }

  const targetedAttack = (board, y, x) => {
    let targets = makeAdjecentTargetsList(y, x);
    for(let entry of targets[0]){
      if(board.board[entry][x] != 'X' || board.board[entry][x] != 'O'){
        if(typeof board.board[entry][x] === 'object'){
          currentHits.push([[entry], [x]])
        }
        currentOrientation = 'v'
        board.receiveAttack(entry, x)
      }
    }
    for(let entry of targets[1]){
      if(board.board[y][entry] != 'X' || board.board[y][entry] != 'O'){
        if(typeof board.board[y][entry] === 'object'){
          currentHits.push([[y],[entry]])
        }
        currentOrientation = 'h'
        board.receiveAttack(y, entry)
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