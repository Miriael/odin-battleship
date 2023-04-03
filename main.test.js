import { test, expect, describe } from 'vitest'
import { shipFactory, gameboardFactory, playerFactory, aiFactory } from './main.js'

function countFunc(board){
  let counter = 0
  for(let row of board){
    for(let entry of row){
      if(entry == 'O' || entry == 'X'){
        counter += 1
      }
    }
  }
  return counter
}

describe('Ship object factory tests', () => {
  test('Length', () => {
    expect(shipFactory(3).length).toBe(3)
  })
  test('Is it sunk when hits match length', () => {
    let testShip = shipFactory(3)
    testShip.hit()
    testShip.hit()
    testShip.hit()
    expect(testShip.isSunk()).toBe(true)
  })
  test('Is it sunk when not damaged enough', () => {
    let testShip = shipFactory(3)
    testShip.hit()
    testShip.hit()
    expect(testShip.isSunk()).toBe(false)
  })
})

describe('Gameboard factory tests', () => {
  test('Check if a ship is placed at the coordinates horizontally', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    board.place(0, 0, testShip, 'h')
    expect(board.board[0][0]).toBe(testShip)
    expect(board.board[0][1]).toBe(testShip)
    expect(board.board[0][2]).toBe(testShip)
  })
  test('Check if a ship is placed at the coordinates vertically', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    board.place(0, 0, testShip, 'v')
    expect(board.board[0][0]).toBe(testShip)
    expect(board.board[1][0]).toBe(testShip)
    expect(board.board[2][0]).toBe(testShip)
  })
  test('Check if a ship is placed correctly when at the end of a column', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    board.place(10, 0, testShip, 'v')
    expect(board.board[7][0]).toBe(testShip)
    expect(board.board[8][0]).toBe(testShip)
    expect(board.board[9][0]).toBe(testShip)
  })
  test('Check if a ship is placed correctly when at the end of a row', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    board.place(0, 10, testShip, 'h')
    expect(board.board[0][7]).toBe(testShip)
    expect(board.board[0][8]).toBe(testShip)
    expect(board.board[0][9]).toBe(testShip)
  })
  test('Check if a ship gets correctly damaged on receiveAttack()', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    board.place(0, 0, testShip, 'h')
    board.receiveAttack(0, 0)
    expect(board.board[0][0]).toBe('X')
  })
  test('Check if a ship gets correctly sunk on correct amount of receiveAttack() calls', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    board.place(0, 0, testShip, 'h')
    board.receiveAttack(0, 0)
    board.receiveAttack(0, 1)
    board.receiveAttack(0, 2)
    expect(board.board[0][0]).toBe('X')
    expect(board.board[0][1]).toBe('X')
    expect(board.board[0][2]).toBe('X')
    expect(testShip.isSunk()).toBe(true)
  })
  test('Check if gameboard records misses correctly', () => {
    let board = gameboardFactory()
    board.receiveAttack(0, 0)
    board.receiveAttack(5, 4)
    board.receiveAttack(9, 9)
    expect(board.board[0][0]).toBe('O')
    expect(board.board[5][4]).toBe('O')
    expect(board.board[9][9]).toBe('O')
  })
  test('Check if the gameboard is able to determine if all ships are sunk', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    expect(board.areAllShipsSunk()).toBe(true)
    board.place(0, 0, testShip, 'h')
    board.receiveAttack(0, 0)
    board.receiveAttack(0, 1)
    expect(board.areAllShipsSunk()).toBe(false)
    board.receiveAttack(0, 2)
    expect(board.areAllShipsSunk()).toBe(true)
  })
  test('Check if selecting a coordinate that was already fired at is properly recognized', () => {
    let testShip = shipFactory(3)
    let board = gameboardFactory()
    board.place(0, 0, testShip, 'h')
    board.receiveAttack(0, 0)
    expect(board.receiveAttack(0, 0)).toBe('Invalid position!')
  })
})

describe('Player factory tests', () => {
  test('Check if active status can be set and read properly', () => {
    let player = playerFactory(true)
    expect(player.active).toBe(true)
    player.active = false
    expect(player.active).toBe(false)
  })
})

describe('AI Factory tests', () => {
  test('Check if active status can be set and read properly', () => {
    let ai = aiFactory();
    expect(ai.active).toBe(false);
    ai.active = true;
    expect(ai.active).toBe(true);
  })
  test('Check if AI can attack a random space on the board', () => {
    let ai = aiFactory();
    let board = gameboardFactory();
    ai.performAttack(board);
    ai.performAttack(board);
    ai.performAttack(board);
    ai.performAttack(board);
    ai.performAttack(board);
    expect(countFunc(board.board)).toBe(5);
  })
  test('Check if AI can tell if it made a hit', () => {
    let ai = aiFactory();
    let board = gameboardFactory();
    let ship = shipFactory(3);
    board.place(0, 0, ship, 'h');
    ai.performAttack(board, 0, 0);
    expect(ai.currentHits).toEqual([[[0], [0]]]);
  })
  test('Check if AI will follow up on a hit', () => {
    let ai = aiFactory();
    let board = gameboardFactory();
    let ship = shipFactory(3);
    board.place(0, 0, ship, 'h');
    ai.performAttack(board, 0, 0);
    ai.performAttack(board);
    ai.performAttack(board);
    expect(ship.isSunk()).toBe(true);
  })
  test('Check if AI will follow up on a hit in the most optimal way possible THIS SHOULD FAIL', () => {
    let ai = aiFactory();
    let board = gameboardFactory();
    let ship = shipFactory(7);
    board.place(4, 4, ship, 'v');
    ai.performAttack(board, 4, 4);
    ai.performAttack(board);
    ai.performAttack(board);
    ai.performAttack(board);
    ai.performAttack(board);
    ai.performAttack(board);
    expect(ship.isSunk()).toBe(true);
  })
})
