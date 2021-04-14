// library examples
"use strict"
console.log("examples!")

const canvasContainer1 = document.querySelector('#canvasContainer1')
const trayContainer1 = document.querySelector('#trayContainer1')

// ==================================

let orderMap = [
    [0, 1]
]

let slots = [
    { top: "50px", left: "50px", height: "40px", width: "40px"},
    { top: "50px", left: "100px", height: "40px", width: "40px"}
]

canvasContainer1.addEventListener('puzzleUpdated', function (e) {
    console.log("puzzle is completed:", e.detail.puzzleStatus)
})

let idArray = [0, 1]
let imgArray = ["./rapture.jpg", "./test_img.jpg"]


const puzzle3 = new imagePuzzle("matching")
puzzle3.bindBackgroundImage("./test_img.jpg")
puzzle3.createMatchingCanvas(canvasContainer1, slots)
// let firstPiece = puzzle3.createMatchingCanvasSlot("50px", "50px", "40px", "40px")
// idArray.push(firstPiece)
// let secondPiece = puzzle3.createMatchingCanvasSlot("50px", "100px", "40px", "40px")
// idArray.push(secondPiece)

puzzle3.createMatchings(idArray, imgArray)
puzzle3.createTray(trayContainer1, 1, 2, 4, orderMap)

// ==================================

// const canvasContainer2 = document.querySelector('#canvasContainer2')
// const trayContainer2 = document.querySelector('#trayContainer2')

// const orderMap = [
//     [0, 1, 2, 3, 4, 5],
//     [6, 7, 8, 9, 10, 11]
// ]

// canvasContainer1.addEventListener('puzzleUpdated', function (e) {
//     console.log("puzzle is completed:", e.detail.puzzleStatus)
// })

// const puzzle1 = new imagePuzzle("grid")
// puzzle1.bindImage("./test_img.jpg")
// puzzle1.bindBackgroundImage("./reddit.png")
// puzzle1.setGridDimensions(3, 4, 4)
// puzzle1.createGridCanvas(canvasContainer1)
// puzzle1.createTray(trayContainer1, 2, 6, 4, orderMap)

// ==================================

// const puzzle2 = new imagePuzzle("grid")
// puzzle2.bindImage("./rapture.jpg")
// // puzzle1.bindBackgroundImage("./test_img.jpg")
// puzzle2.setGridDimensions(3, 3)
// puzzle2.createGridCanvas(canvasContainer2)
// puzzle2.createTray(trayContainer2, 3, 3, orderMap)

// const openbutton = document.querySelector('#open_puzzle1')
// openbutton.setAttribute('onClick', 'helper()')

// function helper() {
//     puzzle1.openPuzzleWindow();
//     startTimer();
// }

// function startTimer() {
//     var counter = 0
//     var interval = setInterval( () => {
//         let parent = document.querySelector('#status_container')
//         let status_text = document.querySelector('#puzzle_status')
//         if (counter === 30) {
    
//             let status = puzzle1.checkIfCompleted()
//             parent.removeChild(status_text)
//             if (status === true) {
//                 status_text.innerHTML = "Finished in time!"
//             }
//             else {
//                 status_text.innerHTML = "Didn't finish in time!"
//             }
//             parent.appendChild(status_text)
//             clearInterval(interval)
//             return
//         }
//         parent.removeChild(status_text)
//         status_text.innerHTML = (parseInt(status_text.innerHTML, 10) - 1).toString()
//         parent.appendChild(status_text)
//         counter += 1
//     }, 1000)
// }
