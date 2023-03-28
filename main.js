import './style.css'

const shipFactory = (length) => {
  let hitCount = 0
  const hit = () => hitCount += 1
  const isSunk = () => {return (hitCount >= length) ? true: false}
  return { length, isSunk, hit }
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
        board[i][x] = ship
      }
    } else if(orientation == 'h' && (ship.length + x > 10)){
      for(let i = 10-ship.length; i < 10; i++){
        board[y][i] = ship
      }
    } else {
      for(let i = 0; i < ship.length; i++){
        if(orientation == 'h'){
          board[y][x+i] = ship
        } else if(orientation == 'v'){
          board[y+i][x] = ship
        }  
      }
    }
  }
  
  return { place, board }
}

export { shipFactory, gameboardFactory }