// library use examples
"use strict"
console.log("examples!")

// const puzzle = new Puzzle(3, 'grid')
// puzzle.createSlot(1, 1, 2, 2)
// puzzle.createSlot(2, 1, 3, 2)
// puzzle.createSlot(2, 2, 4, 4)
// puzzle.createPiece("lmao", 1)
// puzzle.createPiece("ok", 2)
// puzzle.createPiece("lol", 3)
// puzzle.linkPieceToSlot(0, 1)
// puzzle.linkPieceToSlot(2, 2)

// puzzle.deletePiece(1)

const puzzle = new imagePuzzle("./test_img.jpg", 3, 3)
puzzle.display()
// puzzle.checkIfCorrect(0)
// puzzle.definePuzzleArea(100, 100)
// puzzle.createPiece("nice")
// puzzle.createPiece("great")

const openbutton = document.querySelector('#open_puzzle')
openbutton.addEventListener('click', function () { puzzle.openPuzzleWindow() })
