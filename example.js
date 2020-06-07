//Conway's Game of Life
// Sirrele (& Courtney)
//         - Single Array internals - wait for PR (product review?)
//         - how to stop auto makeTurn function ??? - Sirrele
//         - want to add boardSize selector in html but having hiccups


/*
NOTES:
- optimize makeTurn - consolidate same neighbors and pass as argument (set in for Loops).
- makeTurn - bc the func is split into 3 there are several heavy handed func calls (many params)
           - should I place them lexically w/in the main makeTurn function? Is that pointful/less?

- all board functionality in mini-framework comments:
    - then set up html/DOM code accessing the boardHTML thru those channels/methods (make button events easier)
    - ** some methods, like clearBoard, makemark, should auto call displayBoard ... or wrap in button event handlers ... ?
    - learning note: look into this.boardHTML in Cgol.init (was opening up that variable into the regular namespace)

- html board view
     - how to keep constant looking when X's pop up (how to insert html insturctions w/o it just printing as a string)

- think about implementing HTML makeMark. Could redraw board immediatetly or on delay or w/ makeTurn
    - maybe a button for each cell
    - or, better, a grid.

*/

;(function(global) {

  //like jQuery, function constructor is called from within the library so user doesn't have to type 'new'
  let Cgol = function(boardSize) {
    return new Cgol.init(boardSize);
  }

  let boardHTML_lineByLineRepresentation,  
    boardHTML,
    boardHTMLSize,          //is length of one side (ie square root of boardHTML array length - dependent on square board)
    boardHTMLTotalLength;   //total length of boardHTML single array

  Cgol.prototype = {
    //makeMark() - changes cell from dead to alive (for user to input starting positions)
    //if no third argument passed in, will place mark based on internal structure (snake/one-line):
    /*  0 1 2
        3 4 5
        6 7 8   */
    //if 2 params, will follow JavaScript nested array notation:
    /*  0,0  0,1  0,2
        1,0  1,1  1,2
        2,0  2,1, 2,2   */
    makeMark: function(index_singleLine_X, index_Y) {
      //marks board based on snake chart/one-line numbers 
      if(index_Y === undefined) boardHTML[index_singleLine_X] = "X";
  
      //XY passed in - marks board based on nested array coords (converts to snake/one-line)
      else {
  
        //"mark = board_length * x coord + y coord"
        let singleLineIndex = boardHTMLSize * index_singleLine_X + index_Y; 
        boardHTML[singleLineIndex] = "X";
      }
    },

    makeMarkRandom: function(markCount) {
      //create this many random marks
      for (let count = 0; count < markCount; count++) {

        const rMarkPostion = Math.floor(Math.random() * boardHTML.length);
        this.makeMark(rMarkPostion);
      }
      this.displayBoardHTML();
    },

    //set board back to all dead cells
    clearBoard: function() {

      boardHTML = boardHTML.map(boardArrayElement => {
        return boardArrayElement = '-';
      });
    },

    //returns boardSize 
    get boardSize() {
      return boardHTMLSize;
    },

    //returns total length (not size) of boardHTML single array
    get totalLength() {
      return boardHTMLTotalLength;
    },

    //updates text content of <p> elements in boardHTML_lineByLineRepresentation
    displayBoardHTML: function() {

      let singleArrayIndex = 0;

      //runs two for loops of board side size and keeps index of equivalent boardHTML (single array)
      for (let i = 0; i < boardHTMLSize; i++) {
  
        let htmlLineText = "";
        for (let j = 0; j < boardHTMLSize; j++) {

          htmlLineText = htmlLineText + ' ' + boardHTML[singleArrayIndex];
          singleArrayIndex++;
        }

        //actually changes HTML element's text
        boardHTML_lineByLineRepresentation[i].textContent = htmlLineText;
      }
    },

    //makeTurn's - advances state of board to next turn/tick - see CGoL's rules for cell life/death below:
    //number of neighbors to determine life/death
        //each cell has up to 8 neighbors. The following code tests them in three parts: 
        //1. the row above the cell, 2. the row of the cell (only 2 neighbors), 3. and the row below

    //makeTurn_setForLoopNums - takes a cell index 
    //sets value forLoops if cell is R/L edge, or interior
    //returns & called makeTurn_countTotNeighbors (ie tot neighbors alive)
    makeTurn_setForLoopNums: function(cellIndex) {

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
        
      return this.makeTurn_countTotNeighbors(forLoop_StartAboveRow, forLoop_StopAboveRow, forLoop_StartBelowRow, forLoop_StopBelowRow, totNeighborsAlive);
    },

    //returns final number of neighs alive - is evaluated in makeTurn
    makeTurn_countTotNeighbors: function (forLoop_StartAboveRow, forLoop_StopAboveRow, forLoop_StartBelowRow, forLoop_StopBelowRow, totNeighborsAlive) { 
      //Now run for loops to count neighbors in above & below rows:
      //sets range to row above 
      for (let j = forLoop_StartAboveRow; j <= forLoop_StopAboveRow; j++) {
      
        if (boardHTML[j] === 'X') totNeighborsAlive++;
      }
  
      //sets range to row below
      for (let j = forLoop_StartBelowRow; j <= forLoop_StopBelowRow; j++) {
      
        if (boardHTML[j] === 'X') totNeighborsAlive++;
      }
  
      return totNeighborsAlive;
    },

    //calls prev two makeTurn sub funcs
    //then checks # of neighbor hits (X's) and evaluates each cell's next condition (live or die)
    makeTurn: function () { 
      //create new array for resulting board (will replace boardHTML at end):
      const boardResult_singleArray = new Array(boardHTML.length).fill("-");

      //can't use forEach bc functions (and called funcs) use both index and element @ index
      for (let i = 0; i < boardHTML.length; i++) {
      
        //returns num of neighbors alive (eventually)
        const totNeighborsAlive = this.makeTurn_setForLoopNums(i);
    
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

      //set internal board equal to resulting array/board 
      //(have to create a temporary array lest copying over original before all cells are evaluated)
      boardHTML = boardResult_singleArray;

      }//end of makeTurn()

    } //end of Cgol.prototype set-up      

    //Cgol.init - creates board. Square only for now. Default board size is 5.
    Cgol.init = function(boardSize) {

      boardHTMLSize = boardSize;

      const board_singleArray = new Array(boardSize * boardSize);
      board_singleArray.fill("-");
  
      //creates HTML representation of board using p element for each row in board
      let lineRepresentation = "";
      for (let i = 0; i < boardSize; i++) {

        lineRepresentation += " -";    //would have to add html <pre> or something ... prob container wb best
      }

      boardHTML = board_singleArray;
      boardHTMLSize = Math.sqrt(boardHTML.length);
      //add HTML <p> board
      boardHTML_lineByLineRepresentation = new Array(boardSize);
      for (let i = 0; i < boardSize; i++) {

        boardHTML_lineByLineRepresentation[i] = document.createElement('p');
        boardHTML_lineByLineRepresentation[i].textContent = lineRepresentation;
        document.body.appendChild(boardHTML_lineByLineRepresentation[i]);
      }
        
      boardHTML = board_singleArray;
      boardHTMLTotalLength = boardHTML.length;
    }//end of Cgol.init

    Cgol.init.prototype = Cgol.prototype;
    global.Cgol = Cgol;

}(window));

//************************ */

//HTML event_handlers:
//when html button is pressed makeTurn func is called on boardHTML
document.getElementById("makeTurn").onclick = function() {
  
  board.makeTurn();
  board.displayBoardHTML();
}

document.getElementById("makeRandomMark").onclick = function() {
  //makes size of board # of random marks. Allows user to make turns 
  const markCount = board.boardSize;
  board.clearBoard();
  board.makeMarkRandom(markCount);
}

document.getElementById("makeRandomMarkAutoTurns").onclick = function() {
  //makes (currently) 8 random marks. Automates makeTurns
  const boardTotLength = board.totalLength;
  //sets # of marks to boardSideSize / mcLimiter (3) ... for a large amount of marks dynamic w/ board size
  const markCountLimiter = 3;
  const initialMarkCount = Math.floor(boardTotLength / (Math.sqrt(boardTotLength) / markCountLimiter));
  board.makeMarkRandom(initialMarkCount);
  // Every .3 second make a run to automate the cells
  const autoTurnInterval = window.setInterval(function() {

    board.makeTurn();
    board.displayBoardHTML()
  }, 300);
  // After 25 seconds stop the cell process
  setTimeout(function() {

    clearInterval(autoTurnInterval);
  }, 25000)
}

/*
//HTML selector issues ... same road block to createBoard w/ specific size
document.getElementById("rando-select").onclick = function() {

  let element = document.getElementById("rando-select");
  let randoAmount = element.options[element.selectedIndex].value;
  console.log(randoAmount);
}
*/

//end of html event_handlers setup 


//html testing 
const board = Cgol(15);

//make 5-cell vertical line
board.makeMark(2);
board.makeMark(7);
board.makeMark(12);
board.makeMark(17);
board.makeMark(22);
board.displayBoardHTML();





