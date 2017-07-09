const _ = require('lodash');
const rules = require('./rules');
const getScore = require('./score');
const board = require('./board');
const words = require('./words');

class ScrabbleGame {
  constructor() {
    this.board = board.makeBoard();
    this.score = { valid: false, score: 0 };
    this.isFirstMove = true;
  }


  /**
   * @param tiles - Array<{ letter: String, row: Int, col: Int }>
   * @param board - 2D-Matrix<[[0, 0, 0], [0, 0, 0], [0, 0, 0]]>
   *
   * @return Boolean
   * true if placements are valid and false if invalid
   */

  _arePlacementsValid(tiles, board) {
    return tiles.every((tile) => {
      if (!rules.isOnBoard(tile, board)) {
        console.error('Not Valid: please place piece on board!');
        return false;
      }

      if (!rules.isSpotOpen(tile, board)) {
        console.error('Not Valid: there is another piece already there!');
        return false;
      }

      if (!rules.isAllOneAxis(tiles, tiles)) {
        console.error('Not Valid: all pieces must be place on one axis!');
        return false;
      }

      if (this.isFirstMove && !rules.isFirstMoveValid(tiles, this.board)) {
        console.error('Not Valid: you must place on middle of board in first move!');
        return false;
      }
      return true;
    });
  }


  /**
   * @param tiles - Array<{ letter: String, row: Int, col: Int }>
   * @param isPlacingOrRemoving - Boolean that determines if pieces are placed or removed from board
   * This function places and removes tiles from board
   */

  _moveTiles(tiles, isPlaceOrRemove) {
    tiles.forEach((tile) => {
      const tileToPlace = tile;
      const letter = tileToPlace.letter;
      const row = tileToPlace.row;
      const column = tileToPlace.col;
      isPlaceOrRemove ? this.board[row][column] = letter : this.board[row][column] = 0;
    });
  }


  /**
   * @param tiles - Array<{ letter: String, row: Int, col: Int }>
   *
   * @return points - Int
   *
   *  Calculates and returns the numeric score of words for turn
   */

  _scoreWords(tiles) {
    const [firstTile] = tiles;

    let validWordsThisRound = [];

    // determines main axis of word; if it runs along a row or a column
    if (rules.getMainAxis(tiles, tiles) === 'col') {
      validWordsThisRound = words.findWordByColumn(firstTile.row, firstTile.col, this.board, tiles);
    } else {
      validWordsThisRound = words.findWordByRow(firstTile.row, firstTile.col, this.board, tiles);
    }

    let points = getScore.scoreTiles(validWordsThisRound);

    // No valid words generated
    if (validWordsThisRound.length === 0) {
      points = 0;
    }

    const [firstWord] = validWordsThisRound;

    // If only one word is generated and word length equals tile length, new word is not adjacent
    if (validWordsThisRound.length === 1 && firstWord.length <= tiles.length && !this.isFirstMove) {
      points = 0;
    }

    // If first move is valid set isFirstMove to false
    if (this.isFirstMove && validWordsThisRound.length > 0) {
      this.isFirstMove = false;
    }

    return points;
  }


  /**
   * @param tiles - Array<{ letter: String, row: Int, col: Int }>
   *
   *  an array of objects; each object contains a `letter` (the letter
   *  of the tile to play), a `row` (the row to play the tile in) and
   *  a `col` (the column to play the tile in).
   *
   * @return score - { valid: Boolean, score: Int }
   *
   *  `valid` is whether or not the set of tiles represent a valid game
   *  move. If so, `score` is the value of the play to be added to the
   *  score, and if not, `score` is 0.
   */
  playTiles(tiles) {
    let score = 0;

    // If placements are valid, place tiles on board and score words
    if (this._arePlacementsValid(tiles, this.board)) {
      this._moveTiles(tiles, true);
      score = this._scoreWords(tiles);
    }

    // If no valid words and score is 0, remove tiles from board
    if (score === 0) {
      this._moveTiles(tiles, false);
    }

    return this._setScore(score);
  }

  _setScore(points) {
    return points > 0 ? this.score = { valid: true, score: points } : this.score = { score: 0, valid: false };
  }
}

module.exports = ScrabbleGame;
