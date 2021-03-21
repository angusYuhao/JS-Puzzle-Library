// library class definitions
"use strict";
console.log("hello there!")

class Puzzle {

    constructor(num_pieces, puzzle_style) {

        let _puzzle_style = puzzle_style
        if (puzzle_style !== "grid" && puzzle_style !== "scattered") {
            console.log("invalid puzzle style, defaulting to grid")
            _puzzle_style = "grid"
        }

        let new_puzzle_container = document.createElement('div')
        let new_pieces_tray = document.createElement('div')
        let new_puzzle_area = document.createElement('div')
        let new_puzzle_container_close = document.createElement('span')

        // define styles for new_puzzle_container
        new_puzzle_container.setAttribute("class", "puzzle_window")
        new_puzzle_container.style.display = "none"
        new_puzzle_container.style.width = "100%"
        new_puzzle_container.style.height = "100%"
        new_puzzle_container.style.position = "fixed"
        new_puzzle_container.style.zIndex = "1"
        new_puzzle_container.style.top = "0"
        new_puzzle_container.style.left = "0"
        new_puzzle_container.style.backgroundColor = "rgba(100, 100, 100, 0.9)"

        // define styles for new_pieces_tray
        new_pieces_tray.setAttribute("class", "pieces_tray")
        new_pieces_tray.style.float = "right"
        new_pieces_tray.style.maxWidth = "20%"
        new_pieces_tray.style.width = "20%"
        new_pieces_tray.style.height = "80%"
        new_pieces_tray.style.margin = "55px 15px 15px 15px"
        new_pieces_tray.style.border = "2px solid"
        new_pieces_tray.style.display = "grid"
        new_pieces_tray.style.gridTemplateColumns = "repeat(1, 1fr)"
        new_pieces_tray.style.gridTemplateRows = "repeat(" + num_pieces.toString() + ", 1fr)"
        new_pieces_tray.style.gridGap = "10px"

        // define styles for new_puzzle_area
        new_puzzle_area.setAttribute("class", "puzzle_area")
        new_puzzle_area.style.float = "left"
        new_puzzle_area.style.maxWidth = "80%"
        new_puzzle_area.style.width = "70%"
        new_puzzle_area.style.height = "80%"
        new_puzzle_area.style.margin = "55px 15px 15px 15px"
        new_puzzle_area.style.border = "2px solid"
        new_puzzle_area.style.display = "grid"
        new_puzzle_area.style.gridTemplateColumns = "repeat(3, 1fr)"
        new_puzzle_area.style.gridTemplateRows = "repeat(3, 1fr)"
        new_puzzle_area.style.gridGap = "10px"
        // new_puzzle_area.style.display = "flex"
        // new_puzzle_area.style.flexWrap = "wrap"

        // define styles for new_puzzle_container_close
        new_puzzle_container_close.setAttribute("class", "close")
        new_puzzle_container_close.setAttribute("title", "Close")
        new_puzzle_container_close.addEventListener("click", () => { this.closePuzzleWindow() })
        new_puzzle_container_close.innerHTML = "x"
        new_puzzle_container_close.style.position = "absolute"
        new_puzzle_container_close.style.top = "0px"
        new_puzzle_container_close.style.right = "20px"
        new_puzzle_container_close.style.fontSize = "50px"
        new_puzzle_container_close.style.cursor = "pointer"
        new_puzzle_container_close.style.color = "rgba(255, 255, 255, 1)"

        // place new_pieces_tray and new_puzzle_container_close in new_puzzle_container
        new_puzzle_container.appendChild(new_puzzle_container_close)
        new_puzzle_container.appendChild(new_puzzle_area)
        new_puzzle_container.appendChild(new_pieces_tray)

        // place puzzle container in DOM
        const parent = document.querySelector('body')
        parent.appendChild(new_puzzle_container)

        // set fields of puzzle object
        this.num_pieces = num_pieces
        this.puzzle_style = _puzzle_style
        this.pieces = []
        this.slots = []
        this.complete = false
        this.puzzle_container = new_puzzle_container
        this.puzzle_area = new_puzzle_area
        this.pieces_tray = new_pieces_tray

    }

    openPuzzleWindow() {
        this.puzzle_container.style.display = "block"
    }

    closePuzzleWindow() {
        this.puzzle_container.style.display = "none"
    }

    // implement later
    definePuzzleArea(height, width) {

    }

    // create a new puzzle piece, put in pieces array and display it
    createPiece(piece_content, position) {

        // find new piece_id for the new piece
        const pieces = this.pieces
        let new_id = 0
        if (pieces.length !== 0) { new_id = pieces[pieces.length - 1].piece_id + 1 }

        // create a new Piece object and store in array
        let new_piece = new Piece(piece_content, new_id)
        this.pieces.push(new_piece)

        // create the piece in DOM
        let puzzle_piece = document.createElement('figure')
        puzzle_piece.style.gridColumnStart = "1"
        puzzle_piece.style.gridColumnEnd = "2"
        puzzle_piece.style.gridRowStart = position.toString()
        puzzle_piece.style.gridRowEnd = (position + 1).toString()
        puzzle_piece.style.margin = "0px"

        let puzzle_img = document.createElement('img')
        puzzle_img.setAttribute("id", "piece_" + new_id.toString())
        puzzle_img.setAttribute("src", "./test_img.jpg")
        puzzle_img.setAttribute("draggable", "true")
        puzzle_img.setAttribute("ondragstart", "drag(event)")

        puzzle_img.style.width = "100%"
        puzzle_img.style.height = "100%"
        puzzle_img.style.objectFit = "cover"

        puzzle_piece.appendChild(puzzle_img)
        let container = document.querySelector('.pieces_tray')
        // puzzle_piece.appendChild(content)
        container.appendChild(puzzle_piece)

        return new_id
    }

    // create a new puzzle slot
    createSlot(top_left_x, top_left_y, bottom_right_x, bottom_right_y) {

        // create the new slot
        const slots = this.slots
        let new_id = 0
        if (slots.length !== 0) { new_id = slots[slots.length - 1].slot_id + 1 }
        const new_slot = new Slot(new_id, top_left_x, top_left_y, bottom_right_x, bottom_right_y)

        // store slot into array
        this.slots.push(new_slot)

        // create the new slot in DOM
        let puzzle_slot = document.createElement('figure')
        puzzle_slot.setAttribute("id", "slot_" + new_id.toString())
        puzzle_slot.setAttribute("ondrop", "drop(event)")
        puzzle_slot.setAttribute("ondragover", "allowDrop(event)")
        puzzle_slot.addEventListener("drop", () => { this.updateValidity(event) })

        puzzle_slot.style.gridColumnStart = top_left_x.toString()
        puzzle_slot.style.gridColumnEnd = bottom_right_x.toString()
        puzzle_slot.style.gridRowStart = top_left_y.toString()
        puzzle_slot.style.gridRowEnd = bottom_right_y.toString()
        puzzle_slot.style.margin = "0px"
        puzzle_slot.style.backgroundColor = "white"

        // let puzzle_img = document.createElement('div')
        // puzzle_img.innerHTML = "hello"
        // puzzle_img.style.width = "100%"
        // puzzle_img.style.height = "100%"
        // puzzle_img.style.backgroundColor = "white"

        // // let puzzle_img = document.createElement('img')
        // // puzzle_img.setAttribute("src", "./test_img.jpg")
        // // puzzle_img.style.width = "100%"
        // // puzzle_img.style.height = "100%"
        // // puzzle_img.style.objectFit = "cover"

        // puzzle_piece.appendChild(puzzle_img)
        let container = document.querySelector('.puzzle_area')
        // puzzle_piece.appendChild(content)
        container.appendChild(puzzle_slot)

        return new_id
    }

    linkPieceToSlot(piece_id, slot_id) {

        let target_piece = null
        let target_slot = null
        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].piece_id === piece_id) { target_piece = this.pieces[i] }
        }

        for (let j = 0; j < this.slots.length; ++j) {
            if (this.slots[j].slot_id === slot_id) { target_slot = this.slots[j] }
        }

        if (target_piece === null) { console.log("cannot find piece in array") }
        if (target_slot === null) { console.log("cannot find slot in array") }

        target_piece.linked_slot = slot_id
    }

    updateValidity(event) {
        const target_slot = event.target
        const target_slot_id = parseInt(target_slot.id.substring(5), 10)
        const child_piece = target_slot.firstElementChild
        const child_piece_id = parseInt(child_piece.id.substring(6), 10)
        let piece_info = null

        // console.log(typeof target_slot_id)
        // console.log(typeof this.pieces[0].piece_id)

        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].piece_id === child_piece_id) {
                piece_info = this.pieces[i]
            }
        }

        if (piece_info.linked_slot === target_slot_id) { piece_info.correct = true }
        else { piece_info.correct = false }
        
        console.log(piece_info.correct)
    }

    checkIfCorrect(piece_id) {
        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].piece_id === piece_id) {
                return this.pieces[i].correct
            }
        }
        return false
    }
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault()
}

function drop(event) {
    event.preventDefault()
    var data = event.dataTransfer.getData("text")
    event.target.appendChild(document.getElementById(data))
}

// function test(event) {
//     console.log("dsfadsfafadfdsafdfasfd")
// }

class Piece {
    constructor(piece_content, piece_id) {
        this.piece_id = piece_id
        this.piece_content = piece_content
        this.linked_slot = null
        this.correct = false
    }
}

class Slot {
    constructor(slot_id, top_left_x, top_left_y, bottom_right_x, bottom_right_y) {
        this.slot_id = slot_id
        this.top_left_x = top_left_x
        this.top_left_y = top_left_y
        this.bottom_right_x = bottom_right_x
        this.bottom_right_y = bottom_right_y
    }
}

