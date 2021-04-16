// library examples
"use strict"
console.log("examples!")

const canvasContainer1 = document.querySelector('#canvasContainer1')
const trayContainer1 = document.querySelector('#trayContainer1')

const canvasContainer2 = document.querySelector('#canvasContainer2')
const trayContainer2 = document.querySelector('#trayContainer2')

const slotColor = "rgba(200, 30, 250, 0.4)"
const slotBorderRadius = "10px"

// ==================================

// let orderMap = [
//     [0, 1]
// ]

// let slots = [
//     { top: "50px", left: "50px", height: "100px", width: "100px"},
//     { top: "50px", left: "500px", height: "150px", width: "150px"}
// ]

// canvasContainer1.addEventListener('puzzleUpdated', function (e) {
//     console.log("puzzle is completed:", e.detail.puzzleStatus)
// })

// let idArray = [0, 1]
// let imgArray = ["./reddit.png", "./test_img.jpg"]


// const puzzle3 = new ImagePuzzle("scatter")
// puzzle3.bindBackgroundImage("./rapture.jpg")
// puzzle3.createScatterCanvas(canvasContainer1, slots, "cornflowerblue", "white", "this is title", slotColor, slotBorderRadius, "red", slotBorderRadius)
// puzzle3.createScatterMatchings(idArray, imgArray)
// puzzle3.createTray(trayContainer1, 1, 2, 4, orderMap, "cornflowerblue", "white", "Title Here", slotColor, slotBorderRadius, "green", slotBorderRadius)

// ==================================

// const orderMap1 = [
//     [0, 1, 2, 3, 4, 5],
//     [6, 7, 8, 9, 10, 11]
// ]

// canvasContainer1.addEventListener('puzzleUpdated', function (e) {
//     console.log("action:", e.detail.action)
//     console.log("puzzle1 is completed:", e.detail.puzzleStatus)
// })

// const puzzle1 = new ImagePuzzle("grid")
// puzzle1.bindImage("./test_img.jpg")
// puzzle1.bindBackgroundImage("./reddit.png")
// puzzle1.createGridCanvas(canvasContainer1, 3, 4, 4, "cornflowerblue", "white", "this is title", slotColor, slotBorderRadius, "yellow", slotBorderRadius)
// puzzle1.createTray(trayContainer1, 2, 6, 4, orderMap1, "cornflowerblue", "white", "Title Here", slotColor, slotBorderRadius, "green", slotBorderRadius)

// ==================================

// const orderMap2 = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8]
// ]

// canvasContainer2.addEventListener('puzzleUpdated', function (e) {
//     console.log("action:", e.detail.action)
//     console.log("puzzle2 is completed:", e.detail.puzzleStatus)
// })

// const puzzle2 = new ImagePuzzle("grid")
// puzzle2.bindImage("./image1.jpg")
// // puzzle1.bindBackgroundImage("./test_img.jpg")
// puzzle2.createGridCanvas(canvasContainer2, 3, 3, 4, "cornflowerblue", "black", "this is title", slotColor, slotBorderRadius, "yellow", slotBorderRadius)
// puzzle2.createTray(trayContainer2, 3, 3, 4, orderMap2, "cornflowerblue", "white", "Title Here", slotColor, slotBorderRadius, "green", slotBorderRadius)

// ==================================

// const orderMap3 = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8]
// ]

// canvasContainer1.addEventListener('puzzleUpdated', function (e) {
//     console.log("action:", e.detail.action)
//     console.log("puzzle2 is completed:", e.detail.puzzleStatus)
// })

// const puzzle4 = new ImagePuzzle("scramble")
// puzzle4.bindImage("./rapture.jpg")
// puzzle4.createScrambleCanvas(canvasContainer1, 3, 3, 4, orderMap3, "cornflowerblue", "black", "this is title", slotColor, slotBorderRadius, "yellow", slotBorderRadius)

// ==================================

const orderMap4 = [
    [0, 1, 2]
]

const cutouts = [
    [
        { x: 10, y: 10 },
        { x: 70, y: 10 },
        { x: 70, y: 70 }
    ],
    [
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 400, y: 300 }
    ],
    [
        { x: 500, y: 500 },
        { x: 900, y: 500 },
        { x: 1000, y: 600 },
        { x: 700, y: 750 }
    ]
]

canvasContainer1.addEventListener('puzzleUpdated', function (e) {
    console.log("action:", e.detail.action)
    console.log("puzzle2 is completed:", e.detail.puzzleStatus)
})

const puzzle5 = new ImagePuzzle("cutout")
puzzle5.bindImage("./image1.jpg")
puzzle5.createCutoutCanvas(canvasContainer1, cutouts, trayContainer1, 1, 3, 4, orderMap4, "cornflowerblue", "white", "this is title", slotColor, slotBorderRadius, "white", slotBorderRadius, 
                        "cornflowerblue", "white", "Title Here", slotColor, slotBorderRadius, "green", slotBorderRadius)

// ==================================

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