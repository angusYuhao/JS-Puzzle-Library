// library class definitions
"use strict";
console.log("hello there!")

class Puzzle {
    constructor() {
        this.pieces = []
        this.slots = []
        this.complete = false
    }

    addPiece(piece) {
        
        const puzzle_piece = document.createElement('div')
        const content = document.createTextNode(piece.piece_content)
        puzzle_piece.style = 'width: 60px; height: 60px; border-radius: 50%; margin: 10px; background-color: Aqua;'

        const container = document.querySelector('body')
        puzzle_piece.appendChild(content)
        container.appendChild(puzzle_piece)
    }
}

class Piece {
    constructor(piece_content, slot_id) {
        this.piece_content = piece_content
        this.linked_slot = slot_id
        this.correct = false
    }
}

class Slot {
    constructor(slot_id) {
        this.slot_id = slot_id
    }
}
