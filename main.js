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
  const place = (x, y, ship, orientation) => {
    for(let i = 0; i < ship.length; i++){
      if(orientation == 'h'){
        board[x][y+i] = ship
      } else if(orientation == 'v'){
        board[x+i][y] = ship
      }  
    }
  }
  
  return { place, board }
}

export { shipFactory, gameboardFactory }