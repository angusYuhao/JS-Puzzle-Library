// library use examples
"use strict"
console.log("examples!")

const puzzle = new Puzzle(3, 'grid')
puzzle.createPiece("lol", 1, 1, 2, 2)
puzzle.createPiece("lmao", 2, 1, 3, 2)
puzzle.createPiece("great", 2, 2, 4, 4)
// puzzle.definePuzzleArea(100, 100)
// puzzle.createPiece("nice")
// puzzle.createPiece("great")

const openbutton = document.querySelector('#open_puzzle')
openbutton.addEventListener('click', function () { puzzle.openPuzzleWindow() })
