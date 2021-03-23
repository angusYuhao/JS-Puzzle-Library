// library examples
"use strict"
console.log("examples!")

// create a 2 x 2 puzzle and set time to finish to 30 seconds
const puzzle1 = new imagePuzzle("./test_img.jpg", 2, 2)
puzzle1.display()

const openbutton = document.querySelector('#open_puzzle1')
openbutton.setAttribute('onClick', 'helper()')

function helper() {
    puzzle1.openPuzzleWindow();
    startTimer();
}

function startTimer() {
    var counter = 0
    var interval = setInterval( () => {
        let parent = document.querySelector('#status_container')
        let status_text = document.querySelector('#puzzle_status')
        if (counter === 30) {
    
            let status = puzzle1.checkIfCompleted()
            parent.removeChild(status_text)
            if (status === true) {
                status_text.innerHTML = "Finished in time!"
            }
            else {
                status_text.innerHTML = "Didn't finish in time!"
            }
            parent.appendChild(status_text)
            clearInterval(interval)
            return
        }
        parent.removeChild(status_text)
        status_text.innerHTML = (parseInt(status_text.innerHTML, 10) - 1).toString()
        parent.appendChild(status_text)
        counter += 1
    }, 1000)
}
