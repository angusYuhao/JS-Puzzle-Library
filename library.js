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
    createPiece(piece_content, top_left_x, top_left_y, bottom_right_x, bottom_right_y) {

        // find new piece_id for the new piece
        const pieces = this.pieces
        let new_id = 0
        if (pieces.length !== 0) { new_id = pieces[pieces.length - 1].piece_id + 1 }

        // create a new Piece object and store in array
        let new_piece = new Piece(piece_content, new_id, top_left_x, top_left_y, bottom_right_x, bottom_right_y)
        this.pieces.push(new_piece)

        // create the new piece in DOM
        let puzzle_piece = document.createElement('figure')
        puzzle_piece.style.gridColumnStart = top_left_x.toString()
        puzzle_piece.style.gridColumnEnd = bottom_right_x.toString()
        puzzle_piece.style.gridRowStart = top_left_y.toString()
        puzzle_piece.style.gridRowEnd = bottom_right_y.toString()
        puzzle_piece.style.margin = "0px"

        // let puzzle_img = document.createElement('div')
        // puzzle_img.style.width = "100%"
        // puzzle_img.style.height = "100%"
        // puzzle_img.style.objectFit = "cover"
        // puzzle_img.style.color = "black"

        let puzzle_img = document.createElement('img')
        puzzle_img.setAttribute("src", "./test_img.jpg")
        puzzle_img.style.width = "100%"
        puzzle_img.style.height = "100%"
        puzzle_img.style.objectFit = "cover"

        puzzle_piece.appendChild(puzzle_img)

        // let content = document.createTextNode(piece_content)

        let container = document.querySelector('.puzzle_area')
        // puzzle_piece.appendChild(content)
        container.appendChild(puzzle_piece)

        return new_id
    }

    // create a new puzzle slot
    createSlot() {

        // create the new slot
        const pieces = this.pieces
        let new_id = 0
        if (pieces.length !== 0) { new_id = pieces[pieces.length - 1].slot_id + 1 }
        const new_slot = new Slot(new_id)

        // store slot into array
        this.slots.push(new_slot)
    }
}

class Piece {
    constructor(piece_content, piece_id, top_left_x, top_left_y, bottom_right_x, bottom_right_y) {
        this.piece_id = piece_id
        this.piece_content = piece_content
        this.top_left_x = top_left_x
        this.top_left_y = top_left_y
        this.bottom_right_x = bottom_right_x
        this.bottom_right_y = bottom_right_y
        this.linked_slot = null
        this.correct = false
    }
}

class Slot {
    constructor(slot_id) {
        this.slot_id = slot_id
    }
}

