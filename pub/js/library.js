// library class definitions
// NOTE: All styles will be tranferred to a CSS file
"use strict";


(function(global, document) {

    class imagePuzzle {

        // object constructor
        constructor(puzzleType) {

            if (puzzleType !== "grid" && puzzleType !== "scatter" && puzzleType !== "scramble" && puzzleType !== "cutout") {
                console.log("invalid puzzle type, defaulting to grid")
                puzzleType = "grid"
            }

            this.type = puzzleType
            // class Piece object array
            this.pieces = []
            // class Slot object array
            this.canvasSlots = []
            // DOM elements
            this.piecesDOM = []
            this.backCanvasDOM = null
            this.backTrayDOM = null
            this.canvasSlotsDOM = []
            this.traySlotsDOM = []
            this.canvasParentDOM = null
            this.trayParentDOM = null
            this.titleBarDOM = null
            // Others
            this.canvasParentWidth = null
            this.trayParentWidth = null
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
            this.tNumRows = 1
            this.tNumCols = 1
            this.gridGapSize = 4
            this.trayGapSize = 4
            this.completed = false
        }

        // ==================================== //
        // ========== USER FUNCTIONS ========== //
        // ==================================== //

        // bind puzzle image
        bindImage(imgURL) {
            if (this.type !== "grid" && this.type !== "scramble" && this.type !== "cutout") {
                return false
            }
            this.imgURL = imgURL
            return true
        }

        // bind background image for canvas
        bindBackgroundImage(imgURL) {
            this.backgroundImgURL = imgURL
        }

        // create the main canvas
        createGridCanvas(parentElement, numRows, numCols, gapSize, titleBarColor="cornflowerblue", titleTextColor="white", titleText="", slotColor="grey", slotBorderRadius="0px", backgroundColor="white", canvasBorderRadius="0px") {

            this.numRows = numRows
            this.numCols = numCols
            this.gridGapSize = gapSize

            // get the parent's width and store it in object
            let windowWidth = parentElement.clientWidth
            this.canvasParentWidth = windowWidth

            // create the backCanvas
            let backCanvas = document.createElement('div')
            backCanvas.setAttribute("class", "backCanvas")
            backCanvas.style.backgroundColor = backgroundColor
            backCanvas.style.borderRadius = canvasBorderRadius

            // create the titleBar
            let titleBar = document.createElement('div')
            titleBar.setAttribute("class", "canvasTitleBar")
            titleBar.innerHTML = titleText
            titleBar.style.color = titleTextColor
            titleBar.style.backgroundColor = titleBarColor
            titleBar.style.borderRadius = canvasBorderRadius + " " + canvasBorderRadius + " 0%" + " 0%"

            // create canvas DOM element
            let puzzleCanvas = document.createElement('div')
            puzzleCanvas.setAttribute("class", "gridCanvas")
            puzzleCanvas.style.gridTemplateRows = "repeat(" + (this.numRows).toString() + ", 1fr)"
            puzzleCanvas.style.gridTemplateColumns = "repeat(" + (this.numCols).toString() + ", 1fr)"
            // puzzleCanvas.style.backgroundColor = backgroundColor
            puzzleCanvas.style.borderRadius = "0% " + "0% " + canvasBorderRadius + " " + canvasBorderRadius

            if (this.backgroundImgURL != null) {
                puzzleCanvas.style.backgroundImage = "url(" + this.backgroundImgURL + ")"
            }

            // get image dimensions
            const img_element = new Image()
            img_element.setAttribute("id", "testPuzzleImage")
            img_element.setAttribute("src", this.imgURL)
            img_element.onload = () => {

                const imgWidth = img_element.naturalWidth
                const imgHeight = img_element.naturalHeight

                this.imgWidth = imgWidth
                this.imgHeight = imgHeight

                const width = Math.floor((imgWidth / this.numCols) * (windowWidth / imgWidth) - (this.gridGapSize * (this.numCols - 1)))
                const height = Math.floor((imgHeight / this.numRows) * (windowWidth / imgWidth) - (this.gridGapSize * (this.numRows - 1)))

                // create the canvas slots
                for (let y = 0; y < this.numRows; ++y) {
                    for (let x = 0; x < this.numCols; ++x) {

                        // get the slot id
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
                        // canvasSlot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                        canvasSlot.style.gridColumnStart = (x + 1).toString()
                        canvasSlot.style.gridColumnEnd = (x + 2).toString()
                        canvasSlot.style.gridRowStart = (y + 1).toString()
                        canvasSlot.style.gridRowEnd = (y + 2).toString()
                        canvasSlot.style.minWidth = width.toString() + "px"
                        canvasSlot.style.minHeight = height.toString() + "px"
                        canvasSlot.style.backgroundColor = slotColor
                        canvasSlot.style.borderRadius = slotBorderRadius

                        puzzleCanvas.appendChild(canvasSlot)
                        this.canvasSlotsDOM.push(canvasSlot)
                        
                    }
                }

                backCanvas.appendChild(titleBar)
                backCanvas.appendChild(puzzleCanvas)
                parentElement.appendChild(backCanvas)
                this.titleBarDOM = titleBar
                this.canvas = puzzleCanvas
                this.backCanvasDOM = backCanvas
                this.canvasParentDOM = parentElement
            }
            
        }

        createScatterCanvas(parentElement, slotsArray, titleBarColor="cornflowerblue", titleTextColor="white", titleText="", slotColor="grey", slotBorderRadius="0px", backgroundColor="white", canvasBorderRadius="0px") {

            let windowWidth = parentElement.clientWidth
            this.canvasParentWidth = windowWidth

            // create the backCanvas
            let backCanvas = document.createElement('div')
            backCanvas.setAttribute("class", "backCanvas")
            backCanvas.style.backgroundColor = backgroundColor
            backCanvas.style.borderRadius = canvasBorderRadius

            // create the titleBar
            let titleBar = document.createElement('div')
            titleBar.setAttribute("class", "canvasTitleBar")
            titleBar.innerHTML = titleText
            titleBar.style.color = titleTextColor
            titleBar.style.backgroundColor = titleBarColor
            titleBar.style.borderRadius = canvasBorderRadius + " " + canvasBorderRadius + " 0%" + " 0%"

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

                let scatterCanvas = document.createElement('div')
                scatterCanvas.setAttribute("class", "scatterCanvas")
                // scatterCanvas.style.width = width.toString() + "px"
                scatterCanvas.style.height = height.toString() + "px"
                scatterCanvas.style.borderRadius = "0% " + "0% " + canvasBorderRadius + " " + canvasBorderRadius

                if (this.backgroundImgURL != null) {
                    scatterCanvas.style.backgroundImage = "url(" + this.backgroundImgURL + ")"
                }

                for (let i = 0; i < slotsArray.length; i++) {

                    let newID = this.canvasSlots.length

                    let canvasSlot = document.createElement('div')
                    canvasSlot.setAttribute("class", "canvasScatterSlot")
                    canvasSlot.setAttribute("id", "slot_" + newID.toString())
                    canvasSlot.ondrop = () => { this.drop(event) }
                    canvasSlot.ondragover = () => { this.allowDrop(event) }
                    // canvasSlot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                    canvasSlot.style.top = slotsArray[i].top
                    canvasSlot.style.left = slotsArray[i].left
                    canvasSlot.style.width = slotsArray[i].width
                    canvasSlot.style.height = slotsArray[i].height
                    canvasSlot.style.backgroundColor = slotColor
                    canvasSlot.style.borderRadius = slotBorderRadius

                    let slot = new Slot(newID, slotsArray[i].left, slotsArray[i].top, slotsArray[i].left + slotsArray[i].width, slotsArray[i].top + slotsArray[i].height)
                    this.canvasSlots.push(slot)

                    scatterCanvas.appendChild(canvasSlot)
                    this.canvasSlotsDOM.push(canvasSlot)
                }

                backCanvas.appendChild(titleBar)
                backCanvas.appendChild(scatterCanvas)
                parentElement.appendChild(backCanvas)
                this.titleBarDOM = titleBar
                this.canvas = scatterCanvas
                this.backCanvasDOM = backCanvas
                this.canvasParentDOM = parentElement
            }
            
        }

        createScrambleCanvas(parentElement, numRows, numCols, gapSize, orderMap, titleBarColor="cornflowerblue", titleTextColor="white", titleText="", slotColor="grey", slotBorderRadius="0px", backgroundColor="white", canvasBorderRadius="0px") {

            if (!this.checkOrderMapValidity(orderMap)) {
                console.log("Invalid orderMap, scrambleCanvas not created!")
                return
            }

            this.numRows = numRows
            this.numCols = numCols
            this.gridGapSize = gapSize
            
            // get the parent's width and store it in object
            let windowWidth = parentElement.clientWidth
            this.canvasParentWidth = windowWidth

            // create the backCanvas
            let backCanvas = document.createElement('div')
            backCanvas.setAttribute("class", "backCanvas")
            backCanvas.style.backgroundColor = backgroundColor
            backCanvas.style.borderRadius = canvasBorderRadius

            // create the titleBar
            let titleBar = document.createElement('div')
            titleBar.setAttribute("class", "canvasTitleBar")
            titleBar.innerHTML = titleText
            titleBar.style.color = titleTextColor
            titleBar.style.backgroundColor = titleBarColor
            titleBar.style.borderRadius = canvasBorderRadius + " " + canvasBorderRadius + " 0%" + " 0%"

            // create canvas DOM element
            let puzzleCanvas = document.createElement('div')
            puzzleCanvas.setAttribute("class", "scrambleCanvas")
            puzzleCanvas.style.gridTemplateRows = "repeat(" + (this.numRows).toString() + ", 1fr)"
            puzzleCanvas.style.gridTemplateColumns = "repeat(" + (this.numCols).toString() + ", 1fr)"
            puzzleCanvas.style.borderRadius = "0% " + "0% " + canvasBorderRadius + " " + canvasBorderRadius

            if (this.backgroundImgURL != null) {
                puzzleCanvas.style.backgroundImage = "url(" + this.backgroundImgURL + ")"
            }

            backCanvas.appendChild(titleBar)
            backCanvas.appendChild(puzzleCanvas)
            parentElement.appendChild(backCanvas)
            this.titleBarDOM = titleBar
            this.canvas = puzzleCanvas
            this.backCanvasDOM = backCanvas
            this.canvasParentDOM = parentElement

            this.cutImage(null, puzzleCanvas, 0, 0, slotColor, slotBorderRadius, orderMap)
        }

        createCutoutCanvas(canvasParentElement, cutoutsArray, trayParentElement, numRows, numCols, gapSize, orderMap, 
            cTitleBarColor="cornflowerblue", cTitleTextColor="white", cTitleText="", cSlotColor="grey", cSlotBorderRadius="0px", cBackgroundColor="white", canvasBorderRadius="0px",
            titleBarColor="cornflowerblue", titleTextColor="white", titleText="", slotColor="grey", slotBorderRadius="0px", backgroundColor="white", trayBorderRadius="0px") {
            
            let windowWidth = canvasParentElement.clientWidth
            this.canvasParentWidth = windowWidth

            // create the backCanvas
            let backCanvas = document.createElement('div')
            backCanvas.setAttribute("class", "backCanvas")
            backCanvas.style.backgroundColor = cBackgroundColor
            backCanvas.style.borderRadius = canvasBorderRadius

            // create the titleBar
            let titleBar = document.createElement('div')
            titleBar.setAttribute("class", "canvasTitleBar")
            titleBar.innerHTML = cTitleText
            titleBar.style.color = cTitleTextColor
            titleBar.style.backgroundColor = cTitleBarColor
            titleBar.style.borderRadius = canvasBorderRadius + " " + canvasBorderRadius + " 0%" + " 0%"

            const img_element = new Image()
            img_element.setAttribute("id", "testPuzzleImage")
            img_element.setAttribute("src", this.imgURL)
            img_element.onload = () => {

                let image = new Image()
                image.src = this.imgURL

                const imgWidth = img_element.naturalWidth
                const imgHeight = img_element.naturalHeight

                this.imgWidth = imgWidth
                this.imgHeight = imgHeight

                const width = Math.floor(imgWidth * (windowWidth / imgWidth))
                const height = Math.floor(imgHeight * (windowWidth / imgWidth))

                let cutoutCanvas = document.createElement('div')
                cutoutCanvas.setAttribute("class", "scatterCanvas")
                cutoutCanvas.style.height = height.toString() + "px"
                cutoutCanvas.style.borderRadius = "0% " + "0% " + canvasBorderRadius + " " + canvasBorderRadius
                cutoutCanvas.style.backgroundImage = "url(" + this.imgURL + ")"

                let cutoutPiecesArray = []

                for (let i = 0; i < cutoutsArray.length; i++) {

                    let newID = i
                    let newPiece = new Piece(newID, newID, null)
                    this.pieces.push(newPiece)

                    // making slots
                    let canvasSlot = document.createElement('div')
                    canvasSlot.setAttribute("class", "canvasScatterSlot")
                    canvasSlot.setAttribute("id", "slot_" + newID.toString())
                    canvasSlot.ondrop = () => { this.drop(event) }
                    canvasSlot.ondragover = () => { this.allowDrop(event) }

                    let slot = new Slot(newID, null, null, null, null)
                    this.canvasSlots.push(slot)

                    cutoutCanvas.appendChild(canvasSlot)
                    this.canvasSlotsDOM.push(canvasSlot)

                    // making images
                    let canvas = document.createElement("canvas")
                    let context = canvas.getContext("2d")
                    let minx = cutoutsArray[i][0].x
                    let miny = cutoutsArray[i][0].y
                    let maxx = cutoutsArray[i][0].x
                    let maxy = cutoutsArray[i][0].y

                    for (let j = 0; j < cutoutsArray[i].length; j++) {
                        if (cutoutsArray[i][j].x < minx) { minx = cutoutsArray[i][j].x }
                        if (cutoutsArray[i][j].y < miny) { miny = cutoutsArray[i][j].y }
                        if (cutoutsArray[i][j].x > maxx) { maxx = cutoutsArray[i][j].x }
                        if (cutoutsArray[i][j].y > maxy) { maxy = cutoutsArray[i][j].y }
                    }

                    canvas.width = maxx - minx
                    canvas.height = maxy - miny

                    // slot styles
                    let path = "polygon("

                    for (let j = 0; j < cutoutsArray[i].length; j++) {
                        let front = " "
                        let back = ","
                        if (j === 0) { front = "" }
                        if (j === cutoutsArray[i].length - 1) { back = ")" }
                        path = path + front + (Math.floor((cutoutsArray[i][j].x - minx) * (width / this.imgWidth))).toString() + "px " + (Math.floor((cutoutsArray[i][j].y - miny) * (height / this.imgHeight))).toString() + "px" + back
                    }

                    console.log(path)

                    canvasSlot.style.clipPath = path
                    canvasSlot.style.backgroundColor = cSlotColor
                    canvasSlot.style.width = (Math.floor((maxx - minx) * (width / this.imgWidth))).toString() + "px"
                    canvasSlot.style.height = (Math.floor((maxy - miny) * (height / this.imgHeight))).toString() + "px"
                    canvasSlot.style.top = (Math.floor(miny * (height / this.imgHeight))).toString() + "px"
                    canvasSlot.style.left = (Math.floor(minx * (width / this.imgWidth))).toString() + "px"
                    // canvasSlot.style.width = "100%"
                    // canvasSlot.style.height = "100%"
                    // canvasSlot.style.bottom = (Math.floor(maxy * (height / this.imgHeight))).toString() + "px"
                    // canvasSlot.style.right = (Math.floor(maxx * (width / this.imgWidth))).toString() + "px"

                    // continue images
                    context.translate(-minx, -miny)
                    context.drawImage(image, 0, 0)
                    context.beginPath()
                    context.moveTo(cutoutsArray[i][0].x, cutoutsArray[i][0].y)
                    
                    for (let j = 0; j < cutoutsArray[i].length; j++) {
                        context.lineTo(cutoutsArray[i][j].x, cutoutsArray[i][j].y)
                    }
                    context.closePath()

                    context.globalCompositeOperation = "destination-atop";
                    context.fill()

                    console.log("piece_ids", newID)
                    console.log(context)

                    canvas.setAttribute("id", "piece_" + newID.toString())
                    canvas.setAttribute("draggable", "true")
                    canvas.ondragstart = () => { this.drag(event) }
                    cutoutPiecesArray.push(canvas)
                    this.piecesDOM.push(canvas)
                }

                // console.log("hhh", this.piecesDOM)

                backCanvas.appendChild(titleBar)
                backCanvas.appendChild(cutoutCanvas)
                canvasParentElement.appendChild(backCanvas)
                this.titleBarDOM = titleBar
                this.canvas = cutoutCanvas
                this.backCanvasDOM = backCanvas
                this.canvasParentDOM = canvasParentElement

                // start tray here
                this.tNumRows = numRows
                this.tNumCols = numCols
                this.trayGapSize = gapSize
                this.trayParentWidth = trayParentElement.clientWidth
                this.createTrayHelper(trayParentElement, numRows, numCols, slotColor, "0px", orderMap, backgroundColor, trayBorderRadius, titleText, titleTextColor, titleBarColor, cutoutPiecesArray)
            }
        }

        createScatterMatchings(slotArray, imgURLArray) {

            for (let i = 0; i < slotArray.length; i++) {
                let piece = new Piece(i, slotArray[i], imgURLArray[i])
                this.pieces.push(piece)
            }
        }
        
        createTray(parentElement, numRows, numCols, gapSize, orderMap, titleBarColor="cornflowerblue", titleTextColor="white", titleText="", slotColor="grey", slotBorderRadius="0px", backgroundColor="white", trayBorderRadius="0px") {
            
            if (!this.checkOrderMapValidity(orderMap)) {
                console.log("Invalid orderMap, tray not created!")
                return
            }

            this.tNumRows = numRows
            this.tNumCols = numCols
            this.trayGapSize = gapSize
            this.trayParentWidth = parentElement.clientWidth
            this.createTrayHelper(parentElement, numRows, numCols, slotColor, slotBorderRadius, orderMap, backgroundColor, trayBorderRadius, titleText, titleTextColor, titleBarColor, null)
        }


        // =============================================== //
        // ========== NON-USER HELPER FUNCTIONS ========== //
        // =============================================== //

        // create the pieces tray, orderMap takes in 2D array
        createTrayHelper(parentElement, numRows, numCols, slotColor, slotBorderRadius, orderMap, backgroundColor, trayBorderRadius, titleText, titleTextColor, titleBarColor, cutoutPiecesArray) {

            // create the backTray
            let backTray = document.createElement('div')
            backTray.setAttribute("class", "backCanvas")
            backTray.style.backgroundColor = backgroundColor
            backTray.style.borderRadius = trayBorderRadius

            // create the titleBar
            let titleBar = document.createElement('div')
            titleBar.setAttribute("class", "canvasTitleBar")
            titleBar.innerHTML = titleText
            titleBar.style.color = titleTextColor
            titleBar.style.backgroundColor = titleBarColor
            titleBar.style.borderRadius = trayBorderRadius + " " + trayBorderRadius + " 0%" + " 0%"

            // create the pieces tray for the puzzle pieces
            let piecesTray = document.createElement('div')
            piecesTray.setAttribute("class", "piecesTray")
            piecesTray.style.gridTemplateRows = "repeat(" + (numRows).toString() + ", 1fr)"
            piecesTray.style.gridTemplateColumns = "repeat(" + (numCols).toString() + ", 1fr)"
            piecesTray.style.backgroundColor = backgroundColor
            piecesTray.style.borderRadius = trayBorderRadius

            backTray.appendChild(titleBar)
            backTray.appendChild(piecesTray)
            parentElement.appendChild(backTray)
            this.tray = piecesTray
            this.backTrayDOM = backTray
            this.trayParentDOM = parentElement

            if (this.type === "grid") {
                this.cutImage(piecesTray, null, numRows, numCols, slotColor, slotBorderRadius, orderMap)
            }
            else if (this.type === "scatter") {
                this.displayScatterTray(numRows, numCols, orderMap, slotColor, slotBorderRadius, parentElement.clientWidth)
            }
            else if (this.type === "cutout") {
                this.displayCutoutTray(numRows, numCols, orderMap, slotColor, slotBorderRadius, parentElement.clientWidth, cutoutPiecesArray)
            }
        }

        displayCutoutTray(tNumRows, tNumCols, orderMap, slotColor, slotBorderRadius, pWidth, cutoutPiecesArray) {

            // let imgArray = []
            // for (let i = 0; i < this.pieces.length; i++) {
            //     let image = document.createElement('img')
            //     image.setAttribute("src", this.pieces[i].imgURL)

            //     let newID = i
            //     console.log("piece_ids", newID)

            //     image.setAttribute("id", "piece_" + newID.toString())
            //     image.setAttribute("draggable", "true")
            //     image.ondragstart = () => { this.drag(event) }
            //     image.style.borderRadius = slotBorderRadius

            //     imgArray.push(image)
            //     this.piecesDOM.push(image)
            // }

            console.log("wtf", cutoutPiecesArray)
            console.log("ftw", orderMap)

            for (let y = 0; y < tNumRows; ++y) {
                for (let x = 0; x < tNumCols; ++x) {

                    let newID = y * tNumCols + x
                    console.log("slotIDs!", newID)

                    let slot = document.createElement('div')
                    slot.setAttribute("class", "traySlot")
                    slot.setAttribute("id", "tray_" + newID.toString())
                    slot.ondrop = () => { this.drop(event) }
                    slot.ondragover = () => { this.allowDrop(event) }
                    // slot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                    slot.style.gridColumnStart = (x + 1).toString()
                    slot.style.gridColumnEnd = (x + 2).toString()
                    slot.style.gridRowStart = (y + 1).toString()
                    slot.style.gridRowEnd = (y + 2).toString()
                    // slot.style.minWidth = (Math.floor((pWidth - (this.trayGapSize * (tNumCols - 1))) / tNumCols)).toString() + "px"
                    slot.style.minHeight = (Math.floor(pWidth / (3 * tNumCols))).toString() + "px"
                    slot.style.backgroundColor = slotColor
                    slot.style.borderRadius = slotBorderRadius

                    cutoutPiecesArray[orderMap[y][x]].style.height = "100%"
                    cutoutPiecesArray[orderMap[y][x]].style.width = "100%"

                    slot.appendChild(cutoutPiecesArray[orderMap[y][x]])
                    this.tray.appendChild(slot)
                    this.traySlotsDOM.push(slot)
                }
            }
        }

        displayScatterTray(tNumRows, tNumCols, orderMap, slotColor, slotBorderRadius, pWidth) {

            let imgArray = []
            for (let i = 0; i < this.pieces.length; i++) {
                let image = document.createElement('img')
                image.setAttribute("src", this.pieces[i].imgURL)

                let newID = i
                console.log("piece_ids", newID)

                image.setAttribute("id", "piece_" + newID.toString())
                image.setAttribute("draggable", "true")
                image.ondragstart = () => { this.drag(event) }
                image.style.borderRadius = slotBorderRadius

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
                    // slot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                    slot.style.gridColumnStart = (x + 1).toString()
                    slot.style.gridColumnEnd = (x + 2).toString()
                    slot.style.gridRowStart = (y + 1).toString()
                    slot.style.gridRowEnd = (y + 2).toString()
                    // slot.style.minWidth = (Math.floor((pWidth - (this.trayGapSize * (tNumCols - 1))) / tNumCols)).toString() + "px"
                    slot.style.minHeight = (Math.floor(pWidth / (3 * tNumCols))).toString() + "px"
                    slot.style.backgroundColor = slotColor
                    slot.style.borderRadius = slotBorderRadius

                    imgArray[orderMap[y][x]].style.height = "100%"
                    imgArray[orderMap[y][x]].style.width = "100%"

                    slot.appendChild(imgArray[orderMap[y][x]])
                    this.tray.appendChild(slot)
                    this.traySlotsDOM.push(slot)
                }
            }
        }

        cutImage(piecesTray, canvas, tNumRows, tNumCols, slotColor, slotBorderRadius, orderMap) {

            const img_element = new Image()
            img_element.setAttribute("id", "puzzle_image")
            img_element.setAttribute("src", this.imgURL)
            img_element.onload = () => {

                this.imgWidth = img_element.naturalWidth
                this.imgHeight = img_element.naturalHeight

                const width = Math.floor(img_element.naturalWidth / this.numCols)
                const height = Math.floor(img_element.naturalHeight / this.numRows)
        
                let image = new Image()
                image.src = this.imgURL
                // image.setAttribute("crossOrigin", "anonymous")
        
                let puzzlePiecesArr = []
                for (let y = 0; y < this.numRows; ++y) {
                    for (let x = 0; x < this.numCols; ++x) {

                        let canvas = document.createElement('canvas')
                        canvas.width = width
                        canvas.height = height

                        let context = canvas.getContext('2d')
                        context.drawImage(image, x * width, y * height, width, height, 0, 0, canvas.width, canvas.height)
                        
                        let newID = y * this.numCols + x
                        console.log("piece_ids", newID)

                        canvas.setAttribute("id", "piece_" + newID.toString())
                        canvas.setAttribute("draggable", "true")
                        canvas.ondragstart = () => { this.drag(event) }
                        canvas.style.borderRadius = slotBorderRadius
                        puzzlePiecesArr.push(canvas)
                        this.piecesDOM.push(canvas)
                    }
                }

                console.log("test", puzzlePiecesArr)
                
                if (piecesTray !== null) {
                    this.displayGridTray(piecesTray, puzzlePiecesArr, tNumCols, tNumRows, slotColor, slotBorderRadius, orderMap)
                }
                else {
                    this.displayScrambleCanvas(canvas, puzzlePiecesArr, slotColor, slotBorderRadius, orderMap)
                }
            }
        }

        displayScrambleCanvas(canvas, puzzlePiecesArr, slotColor, slotBorderRadius, orderMap) {

            const width = Math.floor((this.imgWidth / this.numCols) * (this.trayParentWidth / this.imgWidth) - (this.gridGapSize * (this.numCols - 1)))
            const height = Math.floor((this.imgHeight / this.numRows) * (this.trayParentWidth / this.imgWidth) - (this.gridGapSize * (this.numRows - 1)))

            // create the canvas slots
            for (let y = 0; y < this.numRows; ++y) {
                for (let x = 0; x < this.numCols; ++x) {

                    // get the slot id
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
                    canvasSlot.setAttribute("class", "canvasScrambleSlots")
                    canvasSlot.setAttribute("id", "slot_" + newID.toString())
                    canvasSlot.ondrop = () => { this.drop(event) }
                    canvasSlot.ondragover = () => { this.allowDrop(event) }
                    // canvasSlot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                    canvasSlot.style.gridColumnStart = (x + 1).toString()
                    canvasSlot.style.gridColumnEnd = (x + 2).toString()
                    canvasSlot.style.gridRowStart = (y + 1).toString()
                    canvasSlot.style.gridRowEnd = (y + 2).toString()
                    canvasSlot.style.minWidth = width.toString() + "px"
                    canvasSlot.style.minHeight = height.toString() + "px"
                    canvasSlot.style.backgroundColor = slotColor
                    canvasSlot.style.borderRadius = slotBorderRadius

                    puzzlePiecesArr[orderMap[y][x]].style.height = "100%"
                    puzzlePiecesArr[orderMap[y][x]].style.width = "100%"

                    canvasSlot.appendChild(puzzlePiecesArr[orderMap[y][x]])
                    this.canvas.appendChild(canvasSlot)
                    this.canvasSlotsDOM.push(canvasSlot)
                    
                }
            }

            for (let i = 0; i < this.numRows * this.numCols; ++i) {
                    this.checkDirectPieceCorrectness(this.canvasSlotsDOM[i], i, "initial")
            }


        }

        displayGridTray(piecesTray, puzzlePiecesArr, tNumCols, tNumRows, slotColor, slotBorderRadius, orderMap) {

            console.log(puzzlePiecesArr)

            const originalPieceWidth = (this.imgWidth / this.numCols)
            const originalPieceHeight = (this.imgHeight / this.numRows)

            const heightOverWidth = originalPieceHeight / originalPieceWidth

            const trayPieceWidth = Math.floor((this.trayParentWidth - (this.trayGapSize * (tNumCols - 1))) / tNumCols)
            const trayPieceHeight = Math.floor(heightOverWidth * (this.trayParentWidth - (this.trayGapSize * (tNumCols - 1))) / tNumCols)

            console.log("hello book=====", this.trayParentWidth)
            console.log("hello jack=====", trayPieceWidth)

            // const width = Math.floor(originalPieceWidth * (this.canvasParentWidth / this.imgWidth) - (this.trayGapSize * (tNumCols - 1)))
            // const height = Math.floor(originalPieceHeight * (this.canvasParentWidth / this.imgWidth) - (this.trayGapSize * (tNumRows - 1)))
        
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
                    // slot.addEventListener("drop", () => { this.checkPieceCorrectness(event) })

                    slot.style.gridColumnStart = (x + 1).toString()
                    slot.style.gridColumnEnd = (x + 2).toString()
                    slot.style.gridRowStart = (y + 1).toString()
                    slot.style.gridRowEnd = (y + 2).toString()
                    slot.style.minHeight = trayPieceHeight.toString() + "px"
                    // slot.style.minWidth = trayPieceWidth.toString() + "px"
                    slot.style.backgroundColor = slotColor
                    slot.style.borderRadius = slotBorderRadius

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

            // console.log("check", target_slot)

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
                detail: { pieceStatus: piece_info.correct, puzzleStatus: this.completed, targetSlotID: target_slot_id, action: "drop" } 
            })

            parentElement.dispatchEvent(updateEvent)
        }

        checkDirectPieceCorrectness(element, sequence, actionType) {

            const target_slot = element
            const target_slot_id = parseInt(target_slot.id.substring(5), 10)

            // console.log("check", target_slot)

            const child_piece = target_slot.firstElementChild
            const child_piece_id = parseInt(child_piece.id.substring(6), 10)

            // console.log(child_piece_id)
            // console.log(this.pieces)

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
                detail: { pieceStatus: piece_info.correct, puzzleStatus: this.completed, targetSlotID: target_slot_id, action: actionType + sequence.toString() } 
            })

            parentElement.dispatchEvent(updateEvent)
        }

        checkOrderMapValidity(orderMap) {

            let tempArray = []
            for (let i = 0; i < this.tNumRows; i++) {
                for (let j = 0; j < this.tNumCols; j++) {
                    tempArray[i * this.numCols + j] = orderMap[i][j]
                }
            }

            tempArray.sort((a, b) => a - b)

            for (let k = 0; k < tempArray.length; k++) {
                if (tempArray[k] !== k) {
                    return false;
                }
            }
            return true;
        }

        drag(event) {
            console.log("draging")
            // console.log("OGGGGGG", event.target.parentElement.id)
            let dataHolder = { id: event.target.id, parent: event.target.parentElement.id }
            event.dataTransfer.setData("text/plain", JSON.stringify(dataHolder));
        }
        
        allowDrop(event) {
            event.preventDefault()
        }
        
        drop(event) {

            console.log("dropping")
            event.preventDefault()
            let data = event.dataTransfer.getData("text/plain")
            data = JSON.parse(data)
            let id = data.id
            let originalParentID = data.parent
            let originalParent = null

            // console.log("original parent:", originalParentID)

            if (originalParentID.substring(0, 4) === "tray") {
                originalParent = (this.traySlotsDOM.filter((traySlot) => traySlot.id === originalParentID))[0]
                // console.log("here we go", originalParent)
            }
            else {
                originalParent = (this.canvasSlotsDOM.filter((canvasSlot) => canvasSlot.id === originalParentID))[0]
                // console.log("here we go", originalParent)
            }

            let element = null

            for (let i = 0; i < this.piecesDOM.length; i++) {
                if (this.piecesDOM[i].id === id) {
                    element = this.piecesDOM[i]
                }
            }

            if (element !== null && event.target.id.substring(0, 4) !== "tray" && event.target.id.substring(0, 4) !== "slot") {

                console.log("switched!")
                const targetParent = event.target.parentElement
                targetParent.removeChild(event.target)
                targetParent.appendChild(element)
                originalParent.appendChild(event.target)
                this.checkDirectPieceCorrectness(targetParent, 1, "switch")
                this.checkDirectPieceCorrectness(originalParent, 2, "switch")
            }
            else if (element !== null) {

                console.log("dropped!")
                event.target.appendChild(element)
                this.checkPieceCorrectness(event)
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

    global.ImagePuzzle = global.ImagePuzzle || imagePuzzle

})(window, window.document);
