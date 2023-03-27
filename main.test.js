import { test, expect, describe } from 'vitest'
import { shipFactory, gameboardFactory } from './main.js'

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
    let testShip = (shipFactory(3))
    let board = gameboardFactory()
    board.place(0, 0, testShip, 'h')
    expect(board.board[0][0]).toBe(testShip)
    expect(board.board[0][1]).toBe(testShip)
    expect(board.board[0][2]).toBe(testShip)
  })
  test('Check if a ship is placed at the coordinates vertically', () => {
    let testShip = (shipFactory(3))
    let board = gameboardFactory()
    board.place(0, 0, testShip, 'v')
    expect(board.board[0][0]).toBe(testShip)
    expect(board.board[1][0]).toBe(testShip)
    expect(board.board[2][0]).toBe(testShip)
  })
})