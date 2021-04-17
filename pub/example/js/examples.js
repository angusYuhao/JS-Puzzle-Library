// library examples
"use strict"
console.log("examples!")

const canvasContainer1 = document.querySelector('#canvas1')
const trayContainer1 = document.querySelector('#tray1')

const canvasContainer2 = document.querySelector('#canvas2')
const trayContainer2 = document.querySelector('#tray2')

const canvasContainer3 = document.querySelector('#canvas3')
const trayContainer3 = document.querySelector('#tray3')

const canvasContainer4 = document.querySelector('#canvas4')
const trayContainer4 = document.querySelector('#tray4')

const canvasContainer5 = document.querySelector('#canvas5')
const trayContainer5 = document.querySelector('#tray5')

const slotColor = "rgba(200, 30, 250, 0.4)"
const slotBorderRadius = "4px"

// ==================================

const orderMap1 = [
    [0, 3, 2, 1],
]

canvasContainer1.addEventListener('puzzleUpdated', function (e) {
    if (e.detail.puzzleStatus) {
        let popup = document.querySelector(".completeNotification")
        popup.addEventListener("click", () => { popup.style.display = "none" })
        popup.style.display = "block"
    }
})

const puzzle1 = new ImagePuzzle("grid")
puzzle1.bindImage("./image1.jpg")
puzzle1.createGridCanvas(canvasContainer1, 2, 2, 4, 
                            "grey", "white", "Soul of Cinder", 
                            "rgba(255, 59, 59, 0.5)", "4px", "rgba(25, 25, 25, 1)", "4px")
puzzle1.createTray(trayContainer1, 1, 4, 4, orderMap1, false, 
                            "cornflowerblue", "white", "Title Here", 
                            "rgba(255, 59, 59, 0.5)", "4px", "rgba(25, 25, 25, 1)", "4px")

// ==================================

const orderMap2 = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
]

canvasContainer2.addEventListener('puzzleUpdated', function (e) {
    if (e.detail.puzzleStatus) {
        let popup = document.querySelector(".completeNotification")
        popup.addEventListener("click", () => { popup.style.display = "none" })
        popup.style.display = "block"
    }
})

const puzzle2 = new ImagePuzzle("grid")
puzzle2.bindImage("./image2.jpg")
puzzle2.createGridCanvas(canvasContainer2, 4, 5, 3, 
                        "rgba(85, 158, 81, 1)", "white", "Foggy Forest", 
                        "rgba(85, 158, 81, 0.5)", "4px", "rgba(200, 200, 200, 1)", "4px")
puzzle2.createTray(trayContainer2, 2, 10, 3, orderMap2, true, 
                        "rgba(85, 158, 81, 1)", "white", "Foggy Forest Puzzle Tray", 
                        "rgba(85, 158, 81, 0.5)", "4px", "rgba(200, 200, 200, 1)", "4px")

// ==================================

let orderMap3 = [
    [0, 1, 2]
]

let slots = [
    { top: "41%", left: "22.7%", height: "9.5%", width: "10.3%"},
    { top: "40%", left: "74.9%", height: "9%", width: "20.4%"},
    { top: "74.8%", left: "59.9%", height: "9.1%", width: "16.6%"}
]

canvasContainer3.addEventListener('puzzleUpdated', function (e) {
    if (e.detail.puzzleStatus) {
        let popup = document.querySelector(".completeNotification")
        popup.addEventListener("click", () => { popup.style.display = "none" })
        popup.style.display = "block"
    }
})

let idArray = [0, 1, 2]
let imgArray = ["./image3_engine.jpg", "./image3_command.jpg", "image3_lunar.jpg"]


const puzzle3 = new ImagePuzzle("scatter")
puzzle3.bindImage("./image3.jpg")
puzzle3.createScatterCanvas(canvasContainer3, slots, 
                            "rgba(25, 25, 25, 1)", "white", "Apollo Diagram", 
                            "rgba(50, 50, 50, 0.5)", "4px", "grey", "4px")
puzzle3.createScatterMatchings(idArray, imgArray)
puzzle3.createTray(trayContainer3, 1, 3, 4, orderMap3, true, 
                            "rgba(25, 25, 25, 1)", "white", "Apollo Diagram Puzzle Tray", 
                            "rgba(50, 50, 50, 0.5)", "4px", "grey", "4px")

// ==================================

const orderMap4 = [
    [8, 1, 3],
    [2, 5, 4],
    [0, 7, 6]
]

canvasContainer4.addEventListener('puzzleUpdated', function (e) {
    if (e.detail.puzzleStatus) {
        let popup = document.querySelector(".completeNotification")
        popup.addEventListener("click", () => { popup.style.display = "none" })
        popup.style.display = "block"
    }
})

const puzzle4 = new ImagePuzzle("scramble")
puzzle4.bindImage("./image4.jpg")
puzzle4.createScrambleCanvas(canvasContainer4, 3, 3, 4, orderMap4, 
                            "rgba(44, 222, 207, 1)", "white", "The Persistence of Time", 
                            "grey", "4px", "rgba(200, 200, 200, 1)", "4px")

// ==================================

const orderMap5 = [
    [0, 1, 2]
]

const cutouts = [
    [
        { x: 1800, y: 700 },
        { x: 2160, y: 260 },
        { x: 2520, y: 700 }
    ],
    [
        { x: 1600, y: 2000 },
        { x: 1600, y: 2480 },
        { x: 2720, y: 2480 },
        { x: 2720, y: 2000 }
    ],
    [
        { x: 1600, y: 1000 },
        { x: 1800, y: 1380 },
        { x: 2220, y: 1780 },
        { x: 2720, y: 1400 }
    ]
]

canvasContainer5.addEventListener('puzzleUpdated', function (e) {
    if (e.detail.puzzleStatus) {
        let popup = document.querySelector(".completeNotification")
        popup.addEventListener("click", () => { popup.style.display = "none" })
        popup.style.display = "block"
    }
})

const puzzle5 = new ImagePuzzle("cutout")
puzzle5.bindImage("./image5.jpg")
puzzle5.createCutoutCanvas(canvasContainer5, cutouts, trayContainer5, 1, 3, 4, orderMap5, 
                            "rgba(235, 189, 26, 1)", "white", "Bioshock Rapture Poster", 
                            "rgba(200, 200, 200, 1)", "grey", "4px", 
                            "rgba(200, 200, 200, 1)", "grey", "4px")

// ==================================
