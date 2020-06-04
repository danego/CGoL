//Conway's Game of Life
// Sirrele (& Courtney)
//         - Console is easeir to see larger boards (html visual board changes size) 
//            but html board is easier to see turns
//         - fyi, I used a single array to store the board rather than a nested array. Simplifies internal calcs 

/*
NOTES:
- what about making board var and board.length^1/2 global variables ??? would simplify func calls

- would be good to wrap all board functionality in mini-framework

- html board view
     - how to keep constant looking when X's pop up (how to insert html insturctions w/o it just printing as a string)
     - how to align board to center when creating through JavaScript?

- think about implementing HTML makeMark. Could redraw board immediatetly or on delay or w/ makeTurn
    - maybe a button for each cell
    - or, better, a grid.

*/


//seems to fill the first-level array w/ references to the same array lol:
//const board = new Array(5).fill(new Array(5).fill("O"));

var elementNamesArray;
var boardHTML;

document.getElementById("makeTurn").onclick = function() {
    boardHTML = makeTurn(boardHTML);
    displayB_HTML();
}

//creates board - Square only for now. Default b size is 5.
function createBoard(size = 5, htmlEnable) {
    var arrayLine = new Array(size*size);
    arrayLine.fill("-");

    if(htmlEnable) {
        var lineString = "";
        for(var i = 0; i<size; i++) {
            lineString += " -";    //would have to add html <pre> or something ... prob container wb best
        }
        elementNamesArray = new Array(size);
        for(var i = 0; i<size; i++) {
            elementNamesArray[i] = document.createElement('p');
            elementNamesArray[i].textContent = lineString;
            document.body.appendChild(elementNamesArray[i]);
        }
    }
    return arrayLine;
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
function makeMark(board, index, indexY) {

    //marks board based on snake chart/one-line numbers 
    if(indexY === undefined) board[index] = "X";

    //XY passed in - marks board based on nested array coords (converts to snake/one-line)
    else {
        const bl = Math.sqrt(board.length);
        //"mark = board_length * x coord + y coord"
        let markIdx = bl*index + indexY;
        board[markIdx] = "X";
    }
}

//set board back to all dead cells
function clearBoard(board) {

    //I guess could use map() but then have to create new array (doesn't alter og array values otherwise)
    for(var i =0; i<board.length; i++) {
        board[i] = '-';
    }
}

//displays board - converts internal single line/array structure into grid/board
function displayB(arrayLine) {

    const bl = Math.sqrt(arrayLine.length);

    var aLindex = 0;
    for(var i =0; i<bl; i++) {
        var line = "";
        for(var j=0; j<bl; j++) {
            line = line + ' ' + arrayLine[aLindex];
            aLindex ++;
        }
        console.log(line);
    }
    //helps break up the boards:
    console.log('00000000000000');
}

function displayB_HTML() {
    const bl = Math.sqrt(boardHTML.length);

    var aLindex = 0;
    var elemIndex = 0;
    for(var i =0; i<bl; i++) {
        var line = "";
        for(var j=0; j<bl; j++) {
            line = line + ' ' + boardHTML[aLindex];
            aLindex ++;
        }
        elementNamesArray[i].textContent = line;
        elemIndex ++;
    }
}


//advances state of board to next turn/tick (see CGoL's rules for cell life/death)
//returns new board to be assigned to original (could be improved upon for performance sake)
function makeTurn(arrayLine) { 

    //check for hits (X's) and whether their next condition (live or die)
    // - checking each square for now ... brute force
    // - bl (board length) is dependent on a square board/grid
    const bl = Math.sqrt(arrayLine.length);

    //create new array for resulting board:
    const arrayLineResult = new Array(arrayLine.length).fill("-");


    for(var i =0; i<arrayLine.length; i++) {

        //number of neighbors to determine life/death
        //each cell has up to 8 neighbors. The following code tests them in three parts: 
        //1. the row above the cell, 2. the row of the cell (only 2 neighbors), 3. and the row below
        var totNeighs = 0;

        //But first it must determine if current cell is on edge of board to adjust its neighbors
        //vars for for_loops, both for neighbors in above and below row
        var forStartAbove, 
            forStopAbove,
            forStartBelow,
            forStopBelow;

        //Edge Test & Prep: Set for_loop variables & count same-row neighbors
        //Left-Edge Case
        if (i % bl === 0) {
            forStartAbove = i - bl;
            forStopAbove = forStartAbove + 1;

            forStartBelow = i + bl;
            forStopBelow = forStartBelow + 1;

            if (arrayLine[i+1] === 'X') totNeighs ++;  //R neigh only
        }
        //Right-Edge Case
        else if((i+1) % bl === 0) {
            forStartAbove = i - bl - 1;
            forStopAbove = forStartAbove + 1;
            
            forStartBelow = i + bl -1;
            forStopBelow = forStartBelow + 1;

            if (arrayLine[i-1] === 'X') totNeighs++;  //L neigh only
        }
        //Interior Case (all non-edge cells)
        else {
            forStartAbove = i - bl - 1;
            forStopAbove = forStartAbove + 2;
            
            forStartBelow = i + bl - 1;
            forStopBelow = forStartBelow + 2;

            if (arrayLine[i-1] === 'X') totNeighs++;
            if (arrayLine[i+1] === 'X') totNeighs ++;  //both neighs
        }

        //Now run for loops to count neighbors in above & below rows:
        //sets range to row above 
        for(var j = forStartAbove; j <= forStopAbove; j++) {
            if (arrayLine[j] === 'X') totNeighs ++;
        }
        //sets range to row below
        for(var j = forStartBelow; j <= forStopBelow; j++) {
            if (arrayLine[j] === 'X') totNeighs ++;
        }

        //Evaluate neighbor count to determine if cell lives or die:
        //case: if alive already
        if (arrayLine[i] === 'X') {
            if (totNeighs < 2 || totNeighs > 3) arrayLineResult[i] = "-";
            else arrayLineResult[i] = "X";
        }
        //case: dead cell
        else {
            if (totNeighs === 3) arrayLineResult[i] = "X";
            else arrayLineResult[i] = "-";
        }

    } //end of arrayLine for Loop

    //console.log(arrayLine);                    //for testing
    //console.log(arrayLine.length);
    //console.log(arrayLineResult);              //for testing 
    

    return arrayLineResult;
    
}//end of makeTurn()





//TESTING SECTION:
//create 5x5 board
var board = createBoard(5);
displayB(board);

//create horizontal line pattern
makeMark(board, 6);
makeMark(board, 7);
makeMark(board, 8);
displayB(board);

//make turn. Should be vertical line now
board = makeTurn(board);
displayB(board);

//make turn, back to horizontal
board = makeTurn(board);
displayB(board);
console.log('end of line switching.');


//testing makeMark w/ 2 params (2D array coords)
//let's add an X below our horizontal line & makeTurn two times
makeMark(board, 2, 2);
displayB(board);

board = makeTurn(board);
displayB(board);

board = makeTurn(board);
displayB(board);

//clear board
console.log('clearing ...');
clearBoard(board);
displayB(board);



//create 3x3 board
//var board3 = createBoard(3);
//displayB(board3);


//at size board ... 12x12 & 10 cell line pattern
board12 = createBoard(12);
displayB(board12);

//makeMarks for 10-cell line
for(var i =37; i<47; i++) {
    makeMark(board12, i);
}
displayB(board12);

board12 = makeTurn(board12);
displayB(board12);

board12 = makeTurn(board12);
displayB(board12);

board12 = makeTurn(board12);
displayB(board12);



//html testing 
boardHTML = createBoard(5,true); 

//make 5-cell vertical line
//note: turns will be handled through html button
makeMark(boardHTML, 2);
makeMark(boardHTML, 7);
makeMark(boardHTML, 12);
makeMark(boardHTML, 17);
makeMark(boardHTML, 22);

displayB_HTML();






