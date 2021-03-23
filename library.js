// library class definitions
// NOTE: All styles will be tranferred to a CSS file
"use strict";
console.log("hello there!")

class imagePuzzle {

    // object constructor
    constructor(img_url, num_rows, num_cols) {

        this.pieces = []
        this.slots = []
        this.puzzle_window = null
        this.img_url = img_url
        this.num_rows = num_rows
        this.num_cols = num_cols
        this.completed = false
        console.log("please kill me")
        
    }

    display() {
        console.log(this.pieces)
        this.loadWindow(this.img_url, this.num_rows, this.num_cols, this.cutImage)
    }

    openPuzzleWindow() {
        this.puzzle_window.style.display = "block"
    }

    closePuzzleWindow() {
        this.puzzle_window.style.display = "none"
    }

    loadWindow(img_url, num_rows, num_cols, callback) {

        console.log("loadWindow", this.pieces)
        console.log("adfsa efwhifh ehaifu he", img_url)

        let puzzle_window = document.createElement('div')
        puzzle_window.setAttribute("class", "puzzle_window")
        puzzle_window.style.display = "none"
        puzzle_window.style.width = "100%"
        puzzle_window.style.height = "100%"
        puzzle_window.style.position = "fixed"
        puzzle_window.style.zIndex = "1"
        puzzle_window.style.top = "0"
        puzzle_window.style.left = "0"
        puzzle_window.style.backgroundColor = "rgba(210, 210, 210, 0.9)"
    
        let close_button = document.createElement('button')
        close_button.setAttribute("class", "close")
        close_button.setAttribute("title", "Close")
        close_button.addEventListener("click", () => { this.closePuzzleWindow() })
        close_button.innerHTML = "close"
        close_button.style.position = "absolute"
        close_button.style.top = "20px"
        close_button.style.right = "20px"
        close_button.style.fontSize = "20px"
        close_button.style.cursor = "pointer"
        close_button.style.color = "rgba(255, 50, 50, 1)"
    
        let puzzle_area = document.createElement('div')
        puzzle_area.setAttribute("class", "puzzle_area")
        puzzle_area.style.overflow = "scroll"
        puzzle_area.style.float = "left"
        puzzle_area.style.maxWidth = "80%"
        puzzle_area.style.width = "70%"
        puzzle_area.style.height = "80%"
        puzzle_area.style.margin = "55px 15px 15px 15px"
        puzzle_area.style.border = "2px solid"
        puzzle_area.style.display = "grid"
        puzzle_area.style.gridTemplateColumns = "repeat(" + num_cols + ", 1fr)"
        puzzle_area.style.gridTemplateRows = "repeat(" + num_rows + ", 1fr)"
        puzzle_area.style.gridGap = "10px"

        for (let x = 0; x < num_cols; ++x) {
            for (let y = 0; y < num_rows; ++y) {
                let new_id = x * num_rows + y
                console.log("slot_ids", new_id)

                // create slot in object array
                let slot = new Slot(new_id, x + 1, y + 1, x + 2, y + 2)
                this.slots.push(slot)

                // create piece in object array
                let piece = new Piece(new_id)
                this.pieces.push(piece)

                // create slot in DOM
                let puzzle_area_slot = document.createElement('div')
                puzzle_area_slot.setAttribute("id", "slot_" + new_id.toString())
                puzzle_area_slot.setAttribute("ondrop", "drop(event)")
                puzzle_area_slot.setAttribute("ondragover", "allowDrop(event)")
                puzzle_area_slot.addEventListener("drop", () => { this.checkValidity(event) })

                puzzle_area_slot.style.gridColumnStart = (x + 1).toString()
                puzzle_area_slot.style.gridColumnEnd = (x + 2).toString()
                puzzle_area_slot.style.gridRowStart = (y + 1).toString()
                puzzle_area_slot.style.gridRowEnd = (y + 2).toString()
                puzzle_area_slot.style.maxHeight = "100%"
                puzzle_area_slot.style.maxWidth = "100%"
                puzzle_area_slot.style.margin = "0px"
                puzzle_area_slot.style.backgroundColor = "white"

                puzzle_area.appendChild(puzzle_area_slot)
            }
        }

        let pieces_tray = document.createElement('div')
        pieces_tray.setAttribute("class", "pieces_tray")
        // pieces_tray.style.position = "relative"
        pieces_tray.style.overflow = "scroll"
        pieces_tray.style.float = "right"
        pieces_tray.style.maxWidth = "20%"
        pieces_tray.style.width = "20%"
        pieces_tray.style.height = "80%"
        pieces_tray.style.margin = "55px 15px 15px 15px"
        pieces_tray.style.border = "2px solid"
        pieces_tray.style.display = "grid"
        pieces_tray.style.gridTemplateColumns = "repeat(1, 1fr)"
        pieces_tray.style.gridTemplateRows = "repeat(" + (num_rows * num_cols).toString() + ", 1fr)"
        pieces_tray.style.gridGap = "10px"

        let check_button = document.createElement('button')
        check_button.setAttribute("class", "check")
        check_button.setAttribute("title", "Check Answer")
        check_button.addEventListener("click", () => { this.checkComplete() })
        check_button.innerHTML = "Submit"
        check_button.style.position = "absolute"
        check_button.style.bottom = "20px"
        check_button.style.left = "100px"
        check_button.style.fontSize = "20px"
        check_button.style.cursor = "pointer"
        // check_button.style.color = "rgba(255, 50, 50, 1)"

        let status_text = document.createElement('span')
        status_text.setAttribute("class", "status")
        // check_button.setAttribute("title", "Check Answer")
        status_text.innerHTML = "N/A"
        status_text.style.position = "absolute"
        status_text.style.bottom = "20px"
        status_text.style.right = "100px"
        status_text.style.fontSize = "40px"
        status_text.style.cursor = "pointer"
        status_text.style.color = "grey"
    
        puzzle_window.appendChild(close_button)
        puzzle_window.appendChild(puzzle_area)
        puzzle_window.appendChild(pieces_tray)
        puzzle_window.appendChild(check_button)
        puzzle_window.appendChild(status_text)

        const parent = document.querySelector('body')
        parent.appendChild(puzzle_window)
    
        this.puzzle_window = puzzle_window
    
        callback(img_url, num_rows, num_cols, this.displayTray)
    }

    cutImage(img_url, num_rows, num_cols, callback) {
        // console.log("cutImage", this.pieces)

        // console.log("asdf", num_cols)
    
        const img_element = new Image()
        img_element.setAttribute("id", "puzzle_image")
        img_element.setAttribute("src", img_url)
        img_element.onload = () => {
            const width = Math.floor(img_element.naturalWidth / num_cols)
            const height = Math.floor(img_element.naturalHeight / num_rows)
            // console.log(width)
            // console.log(height)
    
            let image = new Image()
            image.src = img_url
            // image.setAttribute("crossOrigin", "anonymous")
    
            let puzzle_pieces = []
            for (let x = 0; x < num_cols; ++x) {
                for (let y = 0; y < num_rows; ++y) {

                    let canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height

                    let context = canvas.getContext('2d')
                    context.drawImage(image, x * width, y * height, width, height, 0, 0, canvas.width, canvas.height)
                    
                    let new_id = x * num_rows + y
                    console.log("piece_ids", new_id)

                    canvas.setAttribute("id", "piece_" + new_id.toString())
                    canvas.setAttribute("draggable", "true")
                    canvas.setAttribute("ondragstart", "drag(event)")
                    puzzle_pieces.push(canvas)
                }
            }
            console.log("bbbb", puzzle_pieces)
            
            callback(puzzle_pieces, num_cols, num_rows, height, width)
    
        }
    }

    displayTray(puzzle_pieces, num_cols, num_rows, height, width) {
        // console.log(puzzle_pieces)
        // console.log("displayTray", this.pieces)
    
        const pieces_tray = document.querySelector(".pieces_tray")
    
        // pieces tray slots
        for (let i = 0; i < (num_cols * num_rows); ++i) {
            let slot = document.createElement('div')
            slot.setAttribute("id", "tray_" + i.toString())
            slot.setAttribute("ondrop", "drop(event)")
            slot.setAttribute("ondragover", "allowDrop(event)")
            slot.addEventListener("drop", () => { this.checkValidity(event) })
    
            slot.style.gridColumnStart = "1"
            slot.style.gridColumnEnd = "2"
            slot.style.gridRowStart = (i + 1).toString()
            slot.style.gridRowEnd = (i + 2).toString()
            slot.style.margin = "0px"
            slot.style.backgroundColor = "white"

            // slot.style.minHeight = "50px"
            // console.log("pelase", height)
            slot.style.minHeight = (160).toString() + "px"
            // slot.style.width = width.toString() + "px"
    
            puzzle_pieces[i].style.height = "100%"
            puzzle_pieces[i].style.width = "100%"
    
            slot.appendChild(puzzle_pieces[i])
            pieces_tray.appendChild(slot)
        }
    
        const parent = document.querySelector('.puzzle_window')
        parent.appendChild(pieces_tray)
    }

    checkValidity(event) {
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

        if (piece_info === null) { console.log("god help me") }
        else if (target_slot.id.substring(0, 4) === "tray") { piece_info.correct = false }
        else if (child_piece_id === target_slot_id) { piece_info.correct = true }
        else { piece_info.correct = false }
        
        console.log(piece_info.correct)
    }

    checkComplete() {

        let parent = document.querySelector('.puzzle_window')
        let status = document.querySelector('.status')

        parent.removeChild(status)

        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].correct === false) {
                console.log("incomplete!")
                status.innerHTML = "Incorrect!"
                status.style.color = "red"

                parent.appendChild(status)
                this.completed = false
                return false
            }
        }
        console.log("complete!")
        status.innerHTML = "Correct!"
        status.style.color = "green"
        parent.appendChild(status)
        this.completed = true
        return true
    }

    checkIfCompleted() {
        return this.completed
    }

}


class Puzzle {

    // object constructor
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
        let new_check_button = document.createElement('span')

        // define styles for new_puzzle_container
        new_puzzle_container.setAttribute("class", "puzzle_window")
        new_puzzle_container.style.display = "none"
        new_puzzle_container.style.width = "100%"
        new_puzzle_container.style.height = "100%"
        new_puzzle_container.style.position = "fixed"
        new_puzzle_container.style.zIndex = "1"
        new_puzzle_container.style.top = "0"
        new_puzzle_container.style.left = "0"
        new_puzzle_container.style.backgroundColor = "rgba(210, 210, 210, 0.9)"

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

        // define styles for new_check_button
        new_check_button.setAttribute("class", "check")
        new_check_button.setAttribute("title", "check")
        new_check_button.addEventListener("click", () => { this.checkIfComplete() })
        new_check_button.innerHTML = "check"
        new_check_button.style.position = "absolute"
        new_check_button.style.bottom = "0px"
        new_check_button.style.left = "100px"
        new_check_button.style.fontSize = "40px"
        new_check_button.style.cursor = "pointer"
        new_check_button.style.color = "rgba(255, 255, 255, 1)"

        // place new_pieces_tray and new_puzzle_container_close in new_puzzle_container
        new_puzzle_container.appendChild(new_puzzle_container_close)
        new_puzzle_container.appendChild(new_puzzle_area)
        new_puzzle_container.appendChild(new_pieces_tray)
        new_puzzle_container.appendChild(new_check_button)

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

    // ========== User Functions ========== //

    // implement later
    definePuzzleArea(height, width) {

    }

    // create a new puzzle piece, put in pieces array and display it
    createPiece(position) {

        // find new piece_id for the new piece
        const pieces = this.pieces
        let new_id = 0
        if (pieces.length !== 0) { new_id = pieces[pieces.length - 1].piece_id + 1 }

        // create a new Piece object and store in array
        let new_piece = new Piece(new_id)
        this.pieces.push(new_piece)

        // create the piece in DOM
        let puzzle_piece = document.createElement('figure')
        puzzle_piece.setAttribute("id", "tray_" + new_id.toString())
        puzzle_piece.setAttribute("ondrop", "drop(event)")
        puzzle_piece.setAttribute("ondragover", "allowDrop(event)")
        puzzle_piece.addEventListener("drop", () => { this.updateValidity(event) })

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
        puzzle_img.style.maxHeight = "100%"
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
        puzzle_slot.style.maxHeight = "100%"
        puzzle_slot.style.maxWidth = "100%"
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

    deletePiece(piece_id) {

        // check if the piece exists
        let target_piece = null

        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].piece_id === piece_id) { target_piece = this.pieces[i] }
        }

        if (target_piece === null) {
            console.log("cannot find piece")
            return false
        }

        // delete in object array
        let index = this.pieces.indexOf(target_piece)
        if (index !== -1) { this.pieces.splice(index, 1) }
        
        // delete in DOM
        const target_DOM_id = "tray_" + piece_id.toString()
        const target_element = document.querySelector("#" + target_DOM_id)
        const parent_element = target_element.parentElement
        parent_element.removeChild(target_element)

        return true
    }

    deleteSlot(slot_id) {
        // check if the slot exists
        let target_slot = null

        for (let i = 0; i < this.slots.length; ++i) {
            if (this.slots[i].slot_id === slot_id) { target_slot = this.slots[i] }
        }

        if (target_slot === null) {
            console.log("cannot find slot")
            return false
        }

        // unlink linked pieces
        for (let i = 0; i <this.pieces.length; ++i) {
            if (this.pieces[i].linked_slot === slot_id) {
                this.pieces[i].linked_slot = null
            }
        }

        //delete in object array
        let index = this.slots.indexOf(target_slot)
        if (index !== -1) { this.slots.splice(index, 1) }

        // delete in DOM
        const target_DOM_id = "slot_" + piece_id.toString()
        const target_element = document.querySelector("#" + target_DOM_id)
        const parent_element = target_element.parentElement
        parent_element.removeChild(target_element)

        return true
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

    // ========== Non-User Functions ========== //

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

        if (target_slot.id.substring(0, 4) === "tray") { piece_info.correct = false }
        else if (piece_info.linked_slot === target_slot_id) { piece_info.correct = true }
        else { piece_info.correct = false }
        
        console.log(piece_info.correct)
    }

    checkIfPieceCorrect(piece_id) {

        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].piece_id === piece_id) { return this.pieces[i].correct }
        }

        return false
    }

    checkIfComplete() {

        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].correct === false) {
                console.log("incomplete!")
                return false
            }
        }

        console.log("complete!")
        return true
    }

    openPuzzleWindow() {
        this.puzzle_container.style.display = "block"
    }

    closePuzzleWindow() {
        this.puzzle_container.style.display = "none"
    }
}

function drag(event) {
    console.log("draging")
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault()
}

function drop(event) {
    console.log("dropping")
    event.preventDefault()
    var data = event.dataTransfer.getData("text")
    event.target.appendChild(document.getElementById(data))
}

// function test(event) {
//     console.log("dsfadsfafadfdsafdfasfd")
// }

class Piece {
    constructor(piece_id) {
        this.piece_id = piece_id
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

