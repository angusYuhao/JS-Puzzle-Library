// library class definitions
// NOTE: All styles will be tranferred to a CSS file
"use strict";

class imagePuzzle {

    // object constructor
    constructor(puzzleType) {

        if (puzzleType !== "grid" && puzzleType !== "matching") {
            console.log("invalid puzzle type, defaulting to grid")
            puzzleType = "grid"
        }

        this.type = puzzleType
        // class Piece object array
        this.pieces = []
        // class Slot object array
        this.canvasSlots = []
        // DOM arrays
        this.piecesDOM = []
        this.canvasSlotsDOM = []
        this.traySlotsDOM = []
        this.canvasParentDOM = null
        this.trayParentDOM = null
        // Others
        this.canvasParentWidth = null
        this.imgURL = null
        this.imgWidth = null
        this.imgHeight = null
        this.backgroundImgURL = null
        this.backgroundImgWidth = null
        this.backgroundImgHeight = null
        this.canvas = null
        this.tray = null
        this.numRows = 1
        this.numCols = 1
        this.gridGapSize = 4
        this.trayGapSize = 4
        this.completed = false
    }

    // ==================================== //
    // ========== USER FUNCTIONS ========== //
    // ==================================== //

    // bind puzzle image
    bindImage(imgURL) {
        if (this.type !== "grid") {
            return false
        }
        this.imgURL = imgURL
        return true
    }

    // bind background image for canvas
    bindBackgroundImage(imgURL) {
        this.backgroundImgURL = imgURL
    }

    // set the dimension for puzzle
    setGridDimensions(numRows, numCols, gapSize) {
        if (this.type !== "grid") {
            return false
        }
        this.numRows = numRows
        this.numCols = numCols
        this.gridGapSize = gapSize
        return true
    }

    // create the main canvas
    createGridCanvas(parentElement) {

        let windowWidth = parentElement.clientWidth

        this.canvasParentWidth = windowWidth

        let puzzleCanvas = document.createElement('div')
        puzzleCanvas.setAttribute("class", "puzzleGridCanvas")
        puzzleCanvas.style.gridTemplateRows = "repeat(" + (this.numRows).toString() + ", 1fr)"
        puzzleCanvas.style.gridTemplateColumns = "repeat(" + (this.numCols).toString() + ", 1fr)"
        // puzzleCanvas.style.backgroundSize = "100% 100%"

        if (this.backgroundImgURL != null) {
            puzzleCanvas.style.backgroundImage = "url(" + this.backgroundImgURL + ")"
        }

        const img_element = new Image()
        img_element.setAttribute("id", "testPuzzleImage")
        img_element.setAttribute("src", this.imgURL)
        img_element.onload = () => {

            const imgWidth = img_element.naturalWidth
            const imgHeight = img_element.naturalHeight

            this.imgWidth = imgWidth
            this.imgHeight = imgHeight

            const width = Math.floor((img_element.naturalWidth / this.numCols) * (windowWidth / img_element.naturalWidth) - (this.gridGapSize * (this.numCols - 1)))
            const height = Math.floor((img_element.naturalHeight / this.numRows) * (windowWidth / img_element.naturalWidth) - (this.gridGapSize * (this.numRows - 1)))

            // create the slots
            for (let y = 0; y < this.numRows; ++y) {
                for (let x = 0; x < this.numCols; ++x) {

                    let newID = y * this.numCols + x
                    console.log("slotIDs", newID)

                    // create slot in object array
                    let slot = new Slot(newID, x + 1, y + 1, x + 2, y + 2)
                    this.canvasSlots.push(slot)

                    // create piece in object array
                    let piece = new Piece(newID, newID, null)
                    this.pieces.push(piece)

                    // create slot in DOM
                    let canvasSlot = document.createElement('div')
                    canvasSlot.setAttribute("class", "canvasGridSlots")
                    canvasSlot.setAttribute("id", "slot_" + newID.toString())
                    canvasSlot.ondrop = () => { this.drop(event) }
                    canvasSlot.ondragover = () => { this.allowDrop(event) }
                    canvasSlot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                    canvasSlot.style.gridColumnStart = (x + 1).toString()
                    canvasSlot.style.gridColumnEnd = (x + 2).toString()
                    canvasSlot.style.gridRowStart = (y + 1).toString()
                    canvasSlot.style.gridRowEnd = (y + 2).toString()
                    canvasSlot.style.minWidth = width.toString() + "px"
                    canvasSlot.style.minHeight = height.toString() + "px"
                    // canvasSlot.style.margin = "0px"
                    // canvasSlot.style.backgroundColor = "rgba(210, 210, 210, 0.5)"

                    puzzleCanvas.appendChild(canvasSlot)
                    this.canvasSlotsDOM.push(canvasSlot)
                }
            }

            parentElement.appendChild(puzzleCanvas)
            this.canvas = puzzleCanvas
            this.canvasParentDOM = parentElement
        }
        
    }

    createTray(parentElement, numRows, numCols, gapSize, orderMap) {
        this.trayGapSize = gapSize
        this.createTrayHelper(parentElement, numRows, numCols, orderMap)
    }

    createMatchingCanvas(parentElement, slotsArray) {

        let windowWidth = parentElement.clientWidth

        this.canvasParentWidth = windowWidth

        const img_element = new Image()
        img_element.setAttribute("id", "testPuzzleImage")
        img_element.setAttribute("src", this.backgroundImgURL)
        img_element.onload = () => {

            const imgWidth = img_element.naturalWidth
            const imgHeight = img_element.naturalHeight

            this.backgroundImgWidth = imgWidth
            this.backgroundImgHeight = imgHeight

            const width = Math.floor(imgWidth * (windowWidth / imgWidth))
            const height = Math.floor(imgHeight * (windowWidth / imgWidth))

            let matchingCanvas = document.createElement('div')
            matchingCanvas.setAttribute("class", "puzzleMatchingCanvas")
            matchingCanvas.style.width = width.toString() + "px"
            matchingCanvas.style.height = height.toString() + "px"

            if (this.backgroundImgURL != null) {
                matchingCanvas.style.backgroundImage = "url(" + this.backgroundImgURL + ")"
            }

            parentElement.appendChild(matchingCanvas)
            this.canvas = matchingCanvas
            this.canvasParentDOM = parentElement

            for (let i = 0; i < slotsArray.length; i++) {

                let newID = this.canvasSlots.length

                let canvasSlot = document.createElement('div')
                canvasSlot.setAttribute("class", "canvasMatchingSlot")
                canvasSlot.setAttribute("id", "slot_" + newID.toString())
                canvasSlot.ondrop = () => { this.drop(event) }
                canvasSlot.ondragover = () => { this.allowDrop(event) }
                canvasSlot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                canvasSlot.style.top = slotsArray[i].top
                canvasSlot.style.left = slotsArray[i].left
                canvasSlot.style.width = slotsArray[i].width
                canvasSlot.style.height = slotsArray[i].height

                let slot = new Slot(newID, slotsArray[i].left, slotsArray[i].top, slotsArray[i].left + slotsArray[i].width, slotsArray[i].top + slotsArray[i].height)
                this.canvasSlots.push(slot)

                this.canvas.appendChild(canvasSlot)
            }
        }
        
    }

    createMatchings(slotArray, imgURLArray) {

        for (let i = 0; i < slotArray.length; i++) {
            let piece = new Piece(i, slotArray[i], imgURLArray[i])
            this.pieces.push(piece)
        }
    }


    // =============================================== //
    // ========== NON-USER HELPER FUNCTIONS ========== //
    // =============================================== //

    // create the pieces tray, orderMap takes in 2D array
    createTrayHelper(parentElement, numRows, numCols, orderMap) {

        // create the pieces tray for the puzzle pieces
        let piecesTray = document.createElement('div')
        piecesTray.setAttribute("class", "piecesTray")
        piecesTray.style.gridTemplateRows = "repeat(" + (numRows).toString() + ", 1fr)"
        piecesTray.style.gridTemplateColumns = "repeat(" + (numCols).toString() + ", 1fr)"

        parentElement.appendChild(piecesTray)
        this.tray = piecesTray
        this.trayParentDOM = parentElement

        if (this.type === "grid") {
            this.cutImage(piecesTray, this.imgURL, this.numRows, this.numCols, numRows, numCols, orderMap, parentElement.clientHeight, parentElement.clientWidth)
        }
        else {
            this.displayMatchingTray(numRows, numCols, orderMap, parentElement.clientHeight, parentElement.clientWidth)
        }
    }

    displayMatchingTray(tNumRows, tNumCols, orderMap, pHeight, pWidth) {

        let imgArray = []
        for (let i = 0; i < this.pieces.length; i++) {
            let image = document.createElement('img')
            image.setAttribute("src", this.pieces[i].imgURL)

            let newID = i
            console.log("piece_ids", newID)

            image.setAttribute("id", "piece_" + newID.toString())
            image.setAttribute("draggable", "true")
            image.ondragstart = () => { this.drag(event) }

            imgArray.push(image)
            this.piecesDOM.push(image)
        }

        for (let y = 0; y < tNumRows; ++y) {
            for (let x = 0; x < tNumCols; ++x) {

                let newID = y * tNumCols + x
                console.log("slotIDs!", newID)

                let slot = document.createElement('div')
                slot.setAttribute("class", "traySlot")
                slot.setAttribute("id", "tray_" + newID.toString())
                slot.ondrop = () => { this.drop(event) }
                slot.ondragover = () => { this.allowDrop(event) }
                slot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                slot.style.gridColumnStart = (x + 1).toString()
                slot.style.gridColumnEnd = (x + 2).toString()
                slot.style.gridRowStart = (y + 1).toString()
                slot.style.gridRowEnd = (y + 2).toString()
                slot.style.minWidth = (Math.floor(pWidth / tNumCols)).toString() + "px"
                slot.style.minHeight = (Math.floor(pWidth / (3 * tNumCols))).toString() + "px"

                imgArray[orderMap[y][x]].style.height = "100%"
                imgArray[orderMap[y][x]].style.width = "100%"

                slot.appendChild(imgArray[orderMap[y][x]])
                this.tray.appendChild(slot)
                this.traySlotsDOM.push(slot)
            }
        }
    }

    cutImage(piecesTray, imgURL, cNumRows, cNumCols, tNumRows, tNumCols, orderMap, pHeight, pWidth) {

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
            for (let y = 0; y < this.numRows; ++y) {
                for (let x = 0; x < this.numCols; ++x) {

                    let canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height

                    let context = canvas.getContext('2d')
                    context.drawImage(image, x * width, y * height, width, height, 0, 0, canvas.width, canvas.height)
                    
                    let newID = y * cNumCols + x
                    console.log("piece_ids", newID)

                    canvas.setAttribute("id", "piece_" + newID.toString())
                    canvas.setAttribute("draggable", "true")
                    canvas.ondragstart = () => { this.drag(event) }
                    puzzlePiecesArr.push(canvas)
                    this.piecesDOM.push(canvas)
                }
            }
            
            this.displayGridTray(piecesTray, puzzlePiecesArr, cNumCols, cNumRows, tNumCols, tNumRows, pHeight, pWidth, orderMap)
    
        }
    }

    displayGridTray(piecesTray, puzzlePiecesArr, cNumCols, cNumRows, tNumCols, tNumRows, pHeight, pWidth, orderMap) {

        console.log(puzzlePiecesArr)

        const width = Math.floor((this.imgWidth / cNumCols) * (this.canvasParentWidth / this.imgWidth) - (this.trayGapSize * (tNumCols - 1)))
        const height = Math.floor((this.imgHeight / cNumRows) * (this.canvasParentWidth / this.imgWidth) - (this.trayGapSize * (tNumRows - 1)))
    
        // pieces tray slots
        for (let y = 0; y < tNumRows; ++y) {
            for (let x = 0; x < tNumCols; ++x) {

                let newID = y * tNumCols + x
                console.log("slotIDs!", newID)

                let slot = document.createElement('div')
                slot.setAttribute("class", "traySlot")
                slot.setAttribute("id", "tray_" + newID.toString())
                slot.ondrop = () => { this.drop(event) }
                slot.ondragover = () => { this.allowDrop(event) }
                slot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                slot.style.gridColumnStart = (x + 1).toString()
                slot.style.gridColumnEnd = (x + 2).toString()
                slot.style.gridRowStart = (y + 1).toString()
                slot.style.gridRowEnd = (y + 2).toString()
                slot.style.minHeight = height.toString() + "px"
                slot.style.minWidth = width.toString() + "px"

                puzzlePiecesArr[orderMap[y][x]].style.height = "100%"
                puzzlePiecesArr[orderMap[y][x]].style.width = "100%"

                slot.appendChild(puzzlePiecesArr[orderMap[y][x]])
                piecesTray.appendChild(slot)
                this.traySlotsDOM.push(slot)
            }
        }
    }    

    checkPieceCorrectness(event) {

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
        else if (piece_info.linked_slot === target_slot_id) { piece_info.correct = true }
        else { piece_info.correct = false }
        
        console.log(piece_info.correct)

        let puzzleCompleted = true

        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].correct === false) {
                this.completed = false
                puzzleCompleted = false
            }
        }

        if (puzzleCompleted) { this.completed = true }

        const parentElement = this.canvasParentDOM

        const updateEvent = new CustomEvent('puzzleUpdated', { 
            detail: { pieceStatus: piece_info.correct, puzzleStatus: this.completed } 
        })

        parentElement.dispatchEvent(updateEvent)
    }

    drag(event) {
        console.log("draging")
        event.dataTransfer.setData("text", event.target.id);
    }
    
    allowDrop(event) {
        event.preventDefault()
    }
    
    drop(event) {

        console.log("dropping")
        event.preventDefault()
        let data = event.dataTransfer.getData("text")
        let element = null

        for (let i = 0; i < this.piecesDOM.length; i++) {
            if (this.piecesDOM[i].id === data) {
                element = this.piecesDOM[i]
            }
        }

        if (element !== null) {
            console.log("dropped!")
            event.target.appendChild(element)
        }
        else {
            console.log("cannot find piece, what is going on?")
        }
    }

}

class Piece {
    constructor(piece_id, linked_slot, imgURL) {
        this.piece_id = piece_id
        this.linked_slot = linked_slot
        this.imgURL = imgURL
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
