# js-library-wang1046

# Link To Landing Page
https://sheltered-inlet-02042.herokuapp.com/

# Getting Started
### Include Files
"library/js/library.js"
"library/styles.css"

### Example Include Files HTML
&lt;link rel="stylesheet" type="text/css" href="./library/styles.css"&gt;
&lt;script defer type="text/javascript" src='./library/js/library.js'&gt;

### 2 x 2 Grid Puzzle Complete Working Example

##### example.html:

&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8"&gt;
        &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
        
        &lt;title&gt;Puzzles&lt;/title&gt;
    
        &lt;link rel="stylesheet" type="text/css" href="./library/styles.css"&gt;
        &lt;link rel="stylesheet" type="text/css" href="./puzzleExamplesStyles.css"&gt;
    
        &lt;script defer type="text/javascript" src='./library/js/library.js'&gt;&lt;/script&gt;
        &lt;script defer type="text/javascript" src='./js/example.js'&gt;&lt;/script&gt;
    
    &lt;/head&gt;
    &lt;body class="body"&gt;
        &lt;div class="content"&gt;
            &lt;div class="contentBlock"&gt;
                &lt;h1&gt;Example:&lt;/h1&gt;
                &lt;div class="puzzleCanvasContainer" id="canvas1"&gt;&lt;/div&gt;
                &lt;div class="puzzleTrayContainer" id="tray1"&gt;&lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/body&gt;
&lt;/html&gt;

##### example.html:

.body {
    padding-top: 50px;
    margin: 0px;
    display: block;
}

.content {
    display: block;
}

.contentBlock {
    margin-bottom: 75px;
    width: 80%;
    height: auto;
    padding: 0px 15px 0px 15px;
    margin: 0% 10% 0% 10%;
    box-sizing: border-box;
    display: block;
}

.puzzleCanvasContainer {
    position: relative;
    width: 100%;
    border: solid 2px #eee;
}

.puzzleTrayContainer {
    position: relative;
    width: 100%;
    border: solid 2px #eee;
}

##### example.js:

"use strict"

const canvasContainer1 = document.querySelector('#canvas1')
const trayContainer1 = document.querySelector('#tray1')

const orderMap1 = [
    [0, 3, 2, 1],
]

canvasContainer1.addEventListener('puzzleUpdated', function (e) {
    if (e.detail.puzzleStatus) {
        console.log("puzzle completed!")
    }
})

const puzzle1 = new ImagePuzzle("grid")
puzzle1.bindImage("./image1.jpg")
puzzle1.createGridCanvas(canvasContainer1, 2, 2, 4, 
                            "grey", "white", "Title Name", 
                            "rgba(255, 59, 59, 0.5)", "4px", "rgba(25, 25, 25, 1)", "4px")
puzzle1.createTray(trayContainer1, 1, 4, 4, orderMap1, false, 
                            "cornflowerblue", "white", "Title Name", 
                            "rgba(255, 59, 59, 0.5)", "4px", "rgba(25, 25, 25, 1)", "4px")

# Link to Documentation
https://sheltered-inlet-02042.herokuapp.com/APIDescription.html
