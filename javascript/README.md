

# Getting started

```bash
npm install
```

# Run the tests

```bash
npm run test -s
```

# Files

- `test/scrabble_test.js`: The tests for the Scrabble logic.
- `index.js`: Implements game logic.
- `dictionary.js`: Helpers to test if words are valid.
- `score.js`: Helpers to calculate score.
- `rules.js`: Helpers to check if tile placements are valid.


# Solution

My solution uses a board(2d-matrix) to keep track of game state. All positions are initialized as zeros and letters are plotted by coordinates when placed. Helpers are broken into modules by functionality. The *rules module* handles validation of pieces based on physical location on the board. The *words module* handles validation reliant on words. The *score module* handles calculating points for tiles.

The most challenging problem was scoring multiple words; this was handled with *findWordByRow* and *findWordByColumn*. Depending on wether the new word is placed along a row, or down a column, *findWordByRow* or *findWordByColumn*  is called to generate a list of valid words for the turn. findWordByRow/findWordByColumn traverse the main axis and build up a string of the current word, it also checks to see if there are any tiles adjacent to tiles placed during that turn. If there are adjacent tiles, the function traverses the cross-axis to see if it's a valid word.

## findWordByRow Pseudocode
1. Start at the coordinates of first tile placed
2. While there are tiles to the left, for each tile:
    * Add the letter to the firstPartOfWord string
    * If the tile was placed this turn, check if there are tiles above or below
      * If there are tiles above or below and the first word is being traversed, call findWordByColumn
        * If findWordByColumn returns a valid word, add to allWordsForTurn array
3. While there are tiles to the right, for each tile:
    * Add the letter to the lastPartOfWord string
    * If the tile was placed this turn, check if there are tiles above or below
      * If there are tiles above or below and the first word is being traversed, call findWordByColumn
          * If findWordByColumn returns a valid word, add to allWordsForPlay array
4. Concat firstPartOfWord and lastPartOfWord to get currentWord
5. If currentWord is in the dictionary add it to the allWordsForTurn array
6. Return allWordsForTurn

findWordByColumn works the same way as findWordByRows. It was tempting to combine the functions into one that could be customized and called recursively, but it unnecessarily increased complexity and decreased readability. findWordByRow is commented and findWordByColumn explicitly defines its variables, making it longer but more intuitive.

This is a fun problem with lots of possible solutions! Another solution I briefly considered was to generate all words on each turn by traversing the board and comparing against a dictionary of words already played to determine which words were newly generated. Although I think it would be easier to code this solution, I opted against it because of its increased memory usage and quadratic run time. Arguably the board is a set size and only a relatively small number of words can be placed on the board, so it's not necessary to optimize for worst case scenarios with massive input, but my chosen approach lends itself more to logical separation of functionality.

Given more time I'd be keen to improve modularity and organization of the code. Also I'd like to write more tests for additional edge-cases and build out the game so it has players!

Mocha tests call *playTiles* which coordinates all of the other functions to generate the score.

## playTiles Pseudocode
1. Runs validation function *_arePlacementsValid* to make sure pieces are physically placed correctly (placed on board, in an open spot, all in one axis, first move is valid)
3. If *_arePlacementsValid* are valid, it places the tiles on the board with *_moveTiles* and scores the word by running *_scoreWords* (which calls *findWordByRow* or *findWordByColumn*)
4. If there are no valid words, it runs *_moveTiles* to remove tiles from board
5. Sets score in ScrabbleGame and returns score by running *_setScore*
