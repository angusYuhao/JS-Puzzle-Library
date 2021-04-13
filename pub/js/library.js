// library class definitions
// NOTE: All styles will be tranferred to a CSS file
"use strict";

class imagePuzzle {

    // object constructor
    constructor(puzzleType) {

        this.type = puzzleType
        this.pieces = []
        this.slots = []
        this.puzzleWindow = null
        this.imgURL = null
        this.numRows = 1
        this.numCols = 1
        this.completed = false
    }

    // bind puzzle image
    bindImage(imgURL) {
        this.imgURL = imgURL
    }

    // set the dimension for puzzle
    setDimensions(numRows, numCols) {
        this.numRows = numRows
        this.numCols = numCols
    }

    // create the main canvas
    createCanvas(parentElement) {

        let height = parentElement.clientHeight
        let width = parentElement.clientWidth

        let puzzleCanvas = document.createElement('div')
        puzzleCanvas.setAttribute("class", "puzzleCanvas")
        puzzleCanvas.style.gridTemplateRows = "repeat(" + (this.numRows).toString() + ", 1fr)"
        puzzleCanvas.style.gridTemplateColumns = "repeat(" + (this.numCols).toString() + ", 1fr)"

        // create the slots
        for (let x = 0; x < this.numCols; ++x) {
            for (let y = 0; y < this.numRows; ++y) {

                let newID = x * this.numRows + y
                console.log("slotIDs", newID)

                // create slot in object array
                let slot = new Slot(newID, x + 1, y + 1, x + 2, y + 2)
                this.slots.push(slot)

                // create piece in object array
                let piece = new Piece(newID)
                this.pieces.push(piece)

                // create slot in DOM
                let canvasSlot = document.createElement('div')
                canvasSlot.setAttribute("id", "slot_" + newID.toString())
                canvasSlot.setAttribute("ondrop", "drop(event)")
                canvasSlot.setAttribute("ondragover", "allowDrop(event)")
                canvasSlot.addEventListener("drop", () => { this.checkValidity(event) })

                canvasSlot.style.gridColumnStart = (x + 1).toString()
                canvasSlot.style.gridColumnEnd = (x + 2).toString()
                canvasSlot.style.gridRowStart = (y + 1).toString()
                canvasSlot.style.gridRowEnd = (y + 2).toString()
                // canvasSlot.style.maxHeight = "100%"
                // canvasSlot.style.maxWidth = "100%"
                // console.log("this is the width", (Math.floor(width / this.numCols)))
                canvasSlot.style.minWidth = (Math.floor(width / this.numCols)).toString() + "px"
                canvasSlot.style.minHeight = (Math.floor(height / this.numRows)).toString() + "px"
                canvasSlot.style.margin = "0px"
                canvasSlot.style.backgroundColor = "grey"

                puzzleCanvas.appendChild(canvasSlot)
            }
        }

        parentElement.appendChild(puzzleCanvas)
    }

    createTray(parentElement, numRows, numCols, orderMap) {
        this.createTrayHelper(parentElement, numRows, numCols, orderMap, this.cutImage)
    }

    // create the pieces tray, orderMap takes in 2D array
    createTrayHelper(parentElement, numRows, numCols, orderMap, callback) {

        // create the pieces tray for the puzzle pieces
        let piecesTray = document.createElement('div')
        piecesTray.setAttribute("class", "piecesTray")
        piecesTray.style.gridTemplateRows = "repeat(" + (numRows).toString() + ", 1fr)"
        piecesTray.style.gridTemplateColumns = "repeat(" + (numCols).toString() + ", 1fr)"

        parentElement.appendChild(piecesTray)

        callback(this.imgURL, this.numRows, this.numCols, numRows, numCols, orderMap, parentElement.clientHeight, parentElement.clientWidth, this.displayTray)
    }

    cutImage(imgURL, cNumRows, cNumCols, tNumRows, tNumCols, orderMap, pHeight, pWidth, callback) {

        const img_element = new Image()
        img_element.setAttribute("id", "puzzle_image")
        img_element.setAttribute("src", imgURL)
        img_element.onload = () => {
            const width = Math.floor(img_element.naturalWidth / cNumCols)
            const height = Math.floor(img_element.naturalHeight / cNumRows)
    
            let image = new Image()
            image.src = imgURL
            // image.setAttribute("crossOrigin", "anonymous")
    
            let puzzlePiecesArr = []
            for (let x = 0; x < cNumCols; ++x) {
                for (let y = 0; y < cNumRows; ++y) {

                    let canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height

                    let context = canvas.getContext('2d')
                    context.drawImage(image, x * width, y * height, width, height, 0, 0, canvas.width, canvas.height)
                    
                    let newID = x * cNumRows + y
                    console.log("piece_ids", newID)

                    canvas.setAttribute("id", "piece_" + newID.toString())
                    canvas.setAttribute("draggable", "true")
                    canvas.setAttribute("ondragstart", "drag(event)")
                    puzzlePiecesArr.push(canvas)
                }
            }
            
            callback(puzzlePiecesArr, cNumCols, cNumRows, tNumCols, tNumRows, pHeight, pWidth, orderMap)
    
        }
    }

    displayTray(puzzlePiecesArr, cNumCols, cNumRows, tNumCols, tNumRows, pHeight, pWidth, orderMap) {
    
        const piecesTray = document.querySelector(".piecesTray")
        // const puzzleCanvas = document.querySelector(".puzzleCanvas")

        console.log(puzzlePiecesArr)
    
        // pieces tray slots
        for (let x = 0; x < tNumCols; ++x) {
            for (let y = 0; y < tNumRows; ++y) {

                let newID = x * cNumRows + y
                console.log("slotIDs", newID)

                let slot = document.createElement('div')
                slot.setAttribute("id", "tray_" + newID.toString())
                slot.setAttribute("ondrop", "drop(event)")
                slot.setAttribute("ondragover", "allowDrop(event)")
                slot.addEventListener("drop", () => { this.checkValidity(event) })

                slot.style.gridColumnStart = (x + 1).toString()
                slot.style.gridColumnEnd = (x + 2).toString()
                slot.style.gridRowStart = (y + 1).toString()
                slot.style.gridRowEnd = (y + 2).toString()
                slot.style.maxHeight = "100%"
                slot.style.maxWidth = "100%"
                slot.style.minHeight = (Math.floor(pHeight / tNumRows)).toString() + "px"
                slot.style.minWidth = (Math.floor(pWidth / tNumCols)).toString() + "px"
                slot.style.margin = "0px"
                slot.style.backgroundColor = "grey"

                puzzlePiecesArr[orderMap[y][x]].style.height = "100%"
                puzzlePiecesArr[orderMap[y][x]].style.width = "100%"

                slot.appendChild(puzzlePiecesArr[orderMap[y][x]])
                piecesTray.appendChild(slot)
            }
        }

        
    }

    // display() {
    //     this.loadWindow(this.imgURL, this.numRows, this.numCols, this.cutImage)
    // }

    // openPuzzleWindow() {
    //     this.puzzleWindow.style.display = "block"
    // }

    // closePuzzleWindow() {
    //     this.puzzleWindow.style.display = "none"
    // }

    // loadWindow(imgURL, numRows, numCols, callback) {

    //     // create the puzzle window
    //     let puzzleWindow = document.createElement('div')
    //     puzzleWindow.setAttribute("class", "puzzleWindow")
    //     puzzleWindow.style.display = "none"
    //     puzzleWindow.style.width = "100%"
    //     puzzleWindow.style.height = "100%"
    //     puzzleWindow.style.position = "fixed"
    //     puzzleWindow.style.zIndex = "1"
    //     puzzleWindow.style.top = "0"
    //     puzzleWindow.style.left = "0"
    //     puzzleWindow.style.backgroundColor = "rgba(210, 210, 210, 0.9)"
    
    //     // create the close button for the puzzle window
    //     let close_button = document.createElement('button')
    //     close_button.setAttribute("class", "close")
    //     close_button.setAttribute("title", "Close")
    //     close_button.addEventListener("click", () => { this.closePuzzleWindow() })
    //     close_button.innerHTML = "close"
    //     close_button.style.position = "absolute"
    //     close_button.style.top = "20px"
    //     close_button.style.right = "20px"
    //     close_button.style.fontSize = "20px"
    //     close_button.style.cursor = "pointer"
    //     close_button.style.color = "rgba(255, 50, 50, 1)"
    
    //     // create the puzzle area
    //     let puzzle_area = document.createElement('div')
    //     puzzle_area.setAttribute("class", "puzzle_area")
    //     puzzle_area.style.overflow = "scroll"
    //     puzzle_area.style.float = "left"
    //     puzzle_area.style.maxWidth = "80%"
    //     puzzle_area.style.width = "70%"
    //     puzzle_area.style.height = "80%"
    //     puzzle_area.style.margin = "55px 15px 15px 15px"
    //     puzzle_area.style.border = "2px solid"
    //     puzzle_area.style.display = "grid"
    //     puzzle_area.style.gridTemplateColumns = "repeat(" + numCols + ", 1fr)"
    //     puzzle_area.style.gridTemplateRows = "repeat(" + numRows + ", 1fr)"
    //     puzzle_area.style.gridGap = "10px"

    //     // create the slots
    //     for (let x = 0; x < numCols; ++x) {
    //         for (let y = 0; y < numRows; ++y) {
    //             let newID = x * numRows + y
    //             console.log("slot_ids", newID)

    //             // create slot in object array
    //             let slot = new Slot(newID, x + 1, y + 1, x + 2, y + 2)
    //             this.slots.push(slot)

    //             // create piece in object array
    //             let piece = new Piece(newID)
    //             this.pieces.push(piece)

    //             // create slot in DOM
    //             let canvasSlot = document.createElement('div')
    //             canvasSlot.setAttribute("id", "slot_" + newID.toString())
    //             canvasSlot.setAttribute("ondrop", "drop(event)")
    //             canvasSlot.setAttribute("ondragover", "allowDrop(event)")
    //             canvasSlot.addEventListener("drop", () => { this.checkValidity(event) })

    //             canvasSlot.style.gridColumnStart = (x + 1).toString()
    //             canvasSlot.style.gridColumnEnd = (x + 2).toString()
    //             canvasSlot.style.gridRowStart = (y + 1).toString()
    //             canvasSlot.style.gridRowEnd = (y + 2).toString()
    //             canvasSlot.style.maxHeight = "100%"
    //             canvasSlot.style.maxWidth = "100%"
    //             canvasSlot.style.margin = "0px"
    //             canvasSlot.style.backgroundColor = "white"

    //             puzzle_area.appendChild(canvasSlot)
    //         }
    //     }

    //     // create the pieces tray for the puzzle pieces
    //     let piecesTray = document.createElement('div')
    //     piecesTray.setAttribute("class", "piecesTray")
    //     // piecesTray.style.position = "relative"
    //     piecesTray.style.overflow = "scroll"
    //     piecesTray.style.float = "right"
    //     piecesTray.style.maxWidth = "20%"
    //     piecesTray.style.width = "20%"
    //     piecesTray.style.height = "80%"
    //     piecesTray.style.margin = "55px 15px 15px 15px"
    //     piecesTray.style.border = "2px solid"
    //     piecesTray.style.display = "grid"
    //     piecesTray.style.gridTemplateColumns = "repeat(1, 1fr)"
    //     piecesTray.style.gridTemplateRows = "repeat(" + (numRows * numCols).toString() + ", 1fr)"
    //     piecesTray.style.gridGap = "10px"

    //     // create the check button
    //     let check_button = document.createElement('button')
    //     check_button.setAttribute("class", "check")
    //     check_button.setAttribute("title", "Check Answer")
    //     check_button.addEventListener("click", () => { this.checkComplete() })
    //     check_button.innerHTML = "Submit"
    //     check_button.style.position = "absolute"
    //     check_button.style.bottom = "20px"
    //     check_button.style.left = "100px"
    //     check_button.style.fontSize = "20px"
    //     check_button.style.cursor = "pointer"
    //     // check_button.style.color = "rgba(255, 50, 50, 1)"

    //     // create the status text for checking if the puzzle has been completed
    //     let status_text = document.createElement('span')
    //     status_text.setAttribute("class", "status")
    //     // check_button.setAttribute("title", "Check Answer")
    //     status_text.innerHTML = "N/A"
    //     status_text.style.position = "absolute"
    //     status_text.style.bottom = "20px"
    //     status_text.style.right = "100px"
    //     status_text.style.fontSize = "40px"
    //     status_text.style.cursor = "pointer"
    //     status_text.style.color = "grey"
    
    //     puzzleWindow.appendChild(close_button)
    //     puzzleWindow.appendChild(puzzle_area)
    //     puzzleWindow.appendChild(piecesTray)
    //     puzzleWindow.appendChild(check_button)
    //     puzzleWindow.appendChild(status_text)

    //     const parent = document.querySelector('body')
    //     parent.appendChild(puzzleWindow)
    
    //     this.puzzleWindow = puzzleWindow
    
    //     callback(imgURL, numRows, numCols, this.displayTray)
    // }

    

    checkValidity(event) {
        const target_slot = event.target
        const target_slot_id = parseInt(target_slot.id.substring(5), 10)

        const child_piece = target_slot.firstElementChild
        const child_piece_id = parseInt(child_piece.id.substring(6), 10)

        let piece_info = null

        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].piece_id === child_piece_id) {
                piece_info = this.pieces[i]
            }
        }

        if (piece_info === null) { console.log("not found") }
        else if (target_slot.id.substring(0, 4) === "tray") { piece_info.correct = false }
        else if (child_piece_id === target_slot_id) { piece_info.correct = true }
        else { piece_info.correct = false }
        
        console.log(piece_info.correct)
    }

    checkComplete() {

        let parent = document.querySelector('.puzzleWindow')
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
        let new_piecesTray = document.createElement('div')
        let new_puzzle_area = document.createElement('div')
        let new_puzzle_container_close = document.createElement('span')
        let new_check_button = document.createElement('span')

        // define styles for new_puzzle_container
        new_puzzle_container.setAttribute("class", "puzzleWindow")
        new_puzzle_container.style.display = "none"
        new_puzzle_container.style.width = "100%"
        new_puzzle_container.style.height = "100%"
        new_puzzle_container.style.position = "fixed"
        new_puzzle_container.style.zIndex = "1"
        new_puzzle_container.style.top = "0"
        new_puzzle_container.style.left = "0"
        new_puzzle_container.style.backgroundColor = "rgba(210, 210, 210, 0.9)"

        // define styles for new_piecesTray
        new_piecesTray.setAttribute("class", "piecesTray")
        new_piecesTray.style.float = "right"
        new_piecesTray.style.maxWidth = "20%"
        new_piecesTray.style.width = "20%"
        new_piecesTray.style.height = "80%"
        new_piecesTray.style.margin = "55px 15px 15px 15px"
        new_piecesTray.style.border = "2px solid"
        new_piecesTray.style.display = "grid"
        new_piecesTray.style.gridTemplateColumns = "repeat(1, 1fr)"
        new_piecesTray.style.gridTemplateRows = "repeat(" + num_pieces.toString() + ", 1fr)"
        new_piecesTray.style.gridGap = "10px"

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

        // place new_piecesTray and new_puzzle_container_close in new_puzzle_container
        new_puzzle_container.appendChild(new_puzzle_container_close)
        new_puzzle_container.appendChild(new_puzzle_area)
        new_puzzle_container.appendChild(new_piecesTray)
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
        this.piecesTray = new_piecesTray

    }

    // ========== User Functions ========== //

    // implement later
    definepuzzleCanvas(height, width) {

    }

    // create a new puzzle piece, put in pieces array and display it
    createPiece(position) {

        // find new piece_id for the new piece
        const pieces = this.pieces
        let newID = 0
        if (pieces.length !== 0) { newID = pieces[pieces.length - 1].piece_id + 1 }

        // create a new Piece object and store in array
        let new_piece = new Piece(newID)
        this.pieces.push(new_piece)

        // create the piece in DOM
        let puzzle_piece = document.createElement('figure')
        puzzle_piece.setAttribute("id", "tray_" + newID.toString())
        puzzle_piece.setAttribute("ondrop", "drop(event)")
        puzzle_piece.setAttribute("ondragover", "allowDrop(event)")
        puzzle_piece.addEventListener("drop", () => { this.updateValidity(event) })

        puzzle_piece.style.gridColumnStart = "1"
        puzzle_piece.style.gridColumnEnd = "2"
        puzzle_piece.style.gridRowStart = position.toString()
        puzzle_piece.style.gridRowEnd = (position + 1).toString()
        puzzle_piece.style.margin = "0px"

        let puzzle_img = document.createElement('img')
        puzzle_img.setAttribute("id", "piece_" + newID.toString())
        puzzle_img.setAttribute("src", "./test_img.jpg")
        puzzle_img.setAttribute("draggable", "true")
        puzzle_img.setAttribute("ondragstart", "drag(event)")

        puzzle_img.style.width = "100%"
        puzzle_img.style.maxHeight = "100%"
        puzzle_img.style.objectFit = "cover"

        puzzle_piece.appendChild(puzzle_img)
        let container = document.querySelector('.piecesTray')
        // puzzle_piece.appendChild(content)
        container.appendChild(puzzle_piece)

        return newID
    }

    // create a new puzzle slot
    createSlot(top_left_x, top_left_y, bottom_right_x, bottom_right_y) {

        // create the new slot
        const slots = this.slots
        let newID = 0
        if (slots.length !== 0) { newID = slots[slots.length - 1].slot_id + 1 }
        const new_slot = new Slot(newID, top_left_x, top_left_y, bottom_right_x, bottom_right_y)

        // store slot into array
        this.slots.push(new_slot)

        // create the new slot in DOM
        let puzzle_slot = document.createElement('figure')
        puzzle_slot.setAttribute("id", "slot_" + newID.toString())
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

        return newID
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

