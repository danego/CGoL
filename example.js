//Conway's Game of Life
// Sirrele (& Courtney)
//         - Console is easeir to see larger boards (html visual board changes size) 
//            but html board is easier to see turns
//         - fyi, I used a single array to store the board rather than a nested array. Simplifies internal calcs 

//         - passing in many variables ... should i write functions lexically w/in one another??

/*
NOTES:
- would be good to wrap all board functionality in mini-framework
    - wrap JS boardHTML separately & place makeMark, clearMarks, etc on prototype. 
    - then set up html/DOM code accessing the boardHTML thru those channels/methods (make button events easier)

- html board view
     - how to keep constant looking when X's pop up (how to insert html insturctions w/o it just printing as a string)
     - how to align board to center when creating through JavaScript?

- think about implementing HTML makeMark. Could redraw board immediatetly or on delay or w/ makeTurn
    - maybe a button for each cell
    - or, better, a grid.

*/


//seems to fill the first-level array w/ references to the same array lol:
//const board = new Array(5).fill(new Array(5).fill("O"));


var boardHTML_lineByLineRepresentation;

var boardHTML;

// is length of one side (ie square root of boardHTML array length)
// boardSize (board length) is dependent on a square board/grid
var boardHTMLSize;

//when html button is pressed makeTurn func is called on boardHTML
document.getElementById("makeTurn").onclick = function() {

    //boardHTML = makeTurn(boardHTML);
    makeTurn();
    displayBoardHTML();
}

//creates board - Square only for now. Default board size is 5.
function createBoard(boardSize = 5, htmlEnable) {

    var board_singleArray = new Array(boardSize * boardSize);
    board_singleArray.fill("-");

    //creates HTML representation of board using p element for each row in board
    if(htmlEnable) {

        var lineRepresentation = "";
        for(var i = 0; i < boardSize; i++) {

            lineRepresentation += " -";    //would have to add html <pre> or something ... prob container wb best
        }

        boardHTML = board_singleArray;
        boardHTMLSize = Math.sqrt(boardHTML.length);
        //add HTML <p> board
        boardHTML_lineByLineRepresentation = new Array(boardSize);
        for(var i = 0; i<boardSize; i++) {

            boardHTML_lineByLineRepresentation[i] = document.createElement('p');
            boardHTML_lineByLineRepresentation[i].textContent = lineRepresentation;
            document.body.appendChild(boardHTML_lineByLineRepresentation[i]);
        }
    }
    return board_singleArray;
}



//makeMark() - changes cell from dead to alive (for user to input starting positions)
//if no third argument passed in, will place mark based on internal structure (snake/one-line):
/*  0 1 2
    3 4 5
    6 7 8   */
//if 2 params, will follow JavaScript nested array notation:
/*  0,0  0,1  0,2
    1,0  1,1  1,2
    2,0  2,1, 2,2   */

function makeMark(index_singleLine_X, index_Y) {

    //marks board based on snake chart/one-line numbers 
    if(index_Y === undefined) boardHTML[index_singleLine_X] = "X";

    //XY passed in - marks board based on nested array coords (converts to snake/one-line)
    else {

        //"mark = board_length * x coord + y coord"
        let singleLineIndex = boardHTMLSize*index_singleLine_X + index_Y; 
        boardHTML[singleLineIndex] = "X";
    }
}

//set board back to all dead cells
function clearBoard() {

    //I guess could use map() but then have to create new array (doesn't alter og array values otherwise)
    for (var i = 0; i < boardHTML.length; i++)  boardHTML[i] = '-';

}

//displays board - converts internal single line/array structure into grid/board
function displayBoardConsole(board_singleArray) {

    const boardSize = Math.sqrt(board_singleArray.length);

    var singleArrayIndex = 0;

    for(var i = 0; i < boardSize; i++) {

        var consoleLineRepresentation = "";
        for(var j = 0; j < boardSize; j++) {

            consoleLineRepresentation = consoleLineRepresentation + ' ' + board_singleArray[singleArrayIndex];
            singleArrayIndex ++;
        }
        console.log(consoleLineRepresentation);
    }
    //helps break up the boards:
    console.log('00000000000000');
}


function displayBoardHTML() {

    var singleArrayIndex = 0;

    for (var i = 0; i < boardHTMLSize; i++) {

        var htmlLineText = "";
        for(var j=0; j < boardHTMLSize; j++) {

            htmlLineText = htmlLineText + ' ' + boardHTML[singleArrayIndex];
            singleArrayIndex ++;
        }

        //actually changes HTML element's text
        boardHTML_lineByLineRepresentation[i].textContent = htmlLineText;
    }
}



//makeTurn - advances state of board to next turn/tick (see CGoL's rules for cell life/death)

//lets say it takes a cell index 
//sets value for if R/L edge, or interior
//calls countNeighsForLoops 
//return # neighs alive (evaluate in main makeTurn)
//number of neighbors to determine life/death
        //each cell has up to 8 neighbors. The following code tests them in three parts: 
        //1. the row above the cell, 2. the row of the cell (only 2 neighbors), 3. and the row below
function makeTurn_setForLoopNums(cellIndex) {

    boardHTML[cellIndex];
    let totNeighborsAlive = 0;

    //But first it must determine if current cell is on edge of board to adjust its neighbors
    //vars for for_loops, both for neighbors in above and below row
    let forLoop_StartAboveRow, 
        forLoop_StopAboveRow,
        forLoop_StartBelowRow,
        forLoop_StopBelowRow;

    //Edge Test & Prep: Set for_loop variables & count same-row neighbors
    //Left-Edge Case
    if (cellIndex % boardHTMLSize === 0) {

        forLoop_StartAboveRow = cellIndex - boardHTMLSize;
        forLoop_StopAboveRow = forLoop_StartAboveRow + 1;

        forLoop_StartBelowRow = cellIndex + boardHTMLSize;
        forLoop_StopBelowRow = forLoop_StartBelowRow + 1;

        if (boardHTML[cellIndex + 1] === 'X') totNeighborsAlive++;  //R neigh only
    }

    //Right-Edge Case
    else if ((cellIndex + 1) % boardHTMLSize === 0) {

        forLoop_StartAboveRow = cellIndex - boardHTMLSize - 1;
        forLoop_StopAboveRow = forLoop_StartAboveRow + 1;
        
        forLoop_StartBelowRow = cellIndex + boardHTMLSize -1;
        forLoop_StopBelowRow = forLoop_StartBelowRow + 1;

        if (boardHTML[cellIndex - 1] === 'X') totNeighborsAlive++;  //L neigh only
    }

    //Interior Case (all non-edge cells)
    else {

        forLoop_StartAboveRow = cellIndex - boardHTMLSize - 1;
        forLoop_StopAboveRow = forLoop_StartAboveRow + 2;
        
        forLoop_StartBelowRow = cellIndex + boardHTMLSize - 1;
        forLoop_StopBelowRow = forLoop_StartBelowRow + 2;

        if (boardHTML[cellIndex - 1] === 'X') totNeighborsAlive++;
        if (boardHTML[cellIndex + 1] === 'X') totNeighborsAlive++;  //both neighs
    }

    return makeTurn_countTotNeighbors(forLoop_StartAboveRow, forLoop_StopAboveRow, forLoop_StartBelowRow, forLoop_StopBelowRow, totNeighborsAlive);
}

//should return final number of neighs alive
function makeTurn_countTotNeighbors(forLoop_StartAboveRow, forLoop_StopAboveRow, forLoop_StartBelowRow, forLoop_StopBelowRow, totNeighborsAlive) { 
    //Now run for loops to count neighbors in above & below rows:
    //sets range to row above 
    for (var j = forLoop_StartAboveRow; j <= forLoop_StopAboveRow; j++) {

        if (boardHTML[j] === 'X') totNeighborsAlive ++;
    }

    //sets range to row below
    for (var j = forLoop_StartBelowRow; j <= forLoop_StopBelowRow; j++) {

        if (boardHTML[j] === 'X') totNeighborsAlive ++;
    }

    return totNeighborsAlive;
}

//check for hits (X's) and whether their next condition (live or die)
function makeTurn(board_singleArray) { 

    //create new array for resulting board (will replace boardHTML at end):
    const boardResult_singleArray = new Array(boardHTML.length).fill("-");

    for(var i = 0; i < boardHTML.length; i++) {

        //returns num of neighbors alive (eventually)
        let totNeighborsAlive = makeTurn_setForLoopNums(i);

        //Evaluate neighbor count to determine if cell lives or die:
        //case: if alive already
        if (boardHTML[i] === 'X') {

            if (totNeighborsAlive < 2 || totNeighborsAlive > 3) boardResult_singleArray[i] = "-";
            else boardResult_singleArray[i] = "X";
        }

        //case: dead cell
        else {

            if (totNeighborsAlive === 3) boardResult_singleArray[i] = "X";
            else boardResult_singleArray[i] = "-";
        }
    }

    //console.log(board_singleArray);                    //for testing
    //console.log(board_singleArray.length);
    //console.log(boardResult_singleArray);              //for testing 
    
    boardHTML = boardResult_singleArray;
}//end of makeTurn()




/*

//TESTING SECTION:
//create 5x5 board
var board = createBoard(5);
displayBoardConsole(board);

//create horizontal line pattern
makeMark(board, 6);
makeMark(board, 7);
makeMark(board, 8);
displayBoardConsole(board);

//make turn. Should be vertical line now
board = makeTurn(board);
displayBoardConsole(board);

//make turn, back to horizontal
board = makeTurn(board);
displayBoardConsole(board);
console.log('end of line switching.');


//testing makeMark w/ 2 params (2D array coords)
//let's add an X below our horizontal line & makeTurn two times
makeMark(board, 2, 2);
displayBoardConsole(board);

board = makeTurn(board);
displayBoardConsole(board);

board = makeTurn(board);
displayBoardConsole(board);

//clear board
console.log('clearing ...');
clearBoard(board);
displayBoardConsole(board);



//create 3x3 board
//var board3 = createBoard(3);
//displayBoardConsole(board3);


//at size board ... 12x12 & 10 cell line pattern
board12 = createBoard(12);
displayBoardConsole(board12);

//makeMarks for 10-cell line
for(var i =37; i<47; i++) {
    makeMark(board12, i);
}
displayBoardConsole(board12);

board12 = makeTurn(board12);
displayBoardConsole(board12);

board12 = makeTurn(board12);
displayBoardConsole(board12);

board12 = makeTurn(board12);
displayBoardConsole(board12);

*/

//html testing 
boardHTML = createBoard(5,true);

//make 5-cell vertical line
//note: turns will be handled through html button
makeMark(2);
makeMark(7);
makeMark(12);
makeMark(17);
makeMark(22);

displayBoardHTML();






