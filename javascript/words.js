const fs = require('fs');

const Trie = require('trie-hard');

// https://github.com/BinaryMuse/trie-hard
const dictionary = new Trie();

const words = fs.readFileSync('../words.txt', 'utf8');
words.split('\n').map(word => word.trim()).forEach((word) => {
  if (word) {
    dictionary.add(word);
  }
});

const isWordValid = word => dictionary.isMatch(word);

exports.findWordByRow = (row, column, board, tiles = [], crossAxis) => {
  let allWordsForTurn = [];
  let firstPartOfWord = '';
  let secondPartOfWord = '';
  let traverseLeft = column;
  let traverseRight = column + 1;
  const [firstTile] = tiles;
  const lastTile = tiles[tiles.length - 1];

  // If there are characters to the left, traverse left and build string
  while (board[row][traverseLeft] !== 0) {
    firstPartOfWord += board[row][traverseLeft];

    // If there are tiles above or below current tile, call findWordByColumn to see if it's a new word along crossAxis
    // Only call findWordByColumn if current tile is a newly placed tile and you are traversing along the main axis
    if (traverseLeft <= firstTile.col && !crossAxis && board[row - 1][traverseLeft] !== 0 && !crossAxis || traverseLeft <= firstTile.col && board[row + 1][traverseLeft] !== 0 && !crossAxis) {
      allWordsForTurn = allWordsForTurn.concat(exports.findWordByColumn(row, traverseLeft, board, tiles, true));
    }
    traverseLeft -= 1;
  }
  // If there are characters to the right, traverse right and build string
  while (board[row][traverseRight] !== 0) {
    secondPartOfWord += board[row][traverseRight];

    // If there are tiles above or below current tile, call findWordByColumn to see if it's a new word along crossAxis
    // Only call findWordByColumn if current tile is a newly placed tile and you are traversing along the main axis
    if (traverseRight <= lastTile.col && board[row - 1][traverseRight] !== 0 && !crossAxis || traverseRight <= lastTile.col && board[row + 1][traverseRight] !== 0 && !crossAxis) {
      allWordsForTurn = allWordsForTurn.concat(exports.findWordByColumn(row, traverseRight, board, tiles, true));
    }
    traverseRight += 1;
  }

  // FirstPartOfWord was built from end to beginning; reverse to correct direction and concat with secondPartOfWord to make full word
  // If it's in the dictionary add to allWordsForTurn
  const currentWord = firstPartOfWord.split('').reverse().join('') + secondPartOfWord;
  if (!isWordValid(currentWord)) {
    return [];
  }
  allWordsForTurn.push(currentWord);

  return allWordsForTurn;
};

exports.findWordByColumn = (row, column, board, tiles = [], crossAxis) => {
  let allWordsForTurn = [];
  let firstPartOfWord = '';
  let secondPartOfWord = '';
  let spaceAbove = row;
  let spaceBelow = row + 1;
  const [firstTile] = tiles;
  const lastTile = tiles[tiles.length - 1];

  while (board[spaceAbove][column] !== 0) {
    const isNewlyPlacedTile = spaceAbove >= firstTile.row;
    const isTileAbove = board[spaceAbove][column - 1] !== 0;
    const isTileBelow = board[spaceAbove][column + 1] !== 0;

    firstPartOfWord += board[spaceAbove][column];

    if (isNewlyPlacedTile && isTileAbove && !crossAxis || isNewlyPlacedTile && isTileBelow && !crossAxis) {
      allWordsForTurn = allWordsForTurn.concat(exports.findWordByRow(row, column - 1, board, tiles, true));
    }
    spaceAbove -= 1;
  }

  while (board[spaceBelow][column] !== 0) {
    const isNewlyPlacedTile = spaceBelow <= firstTile.row;
    const isTileAbove = board[spaceBelow][column + 1] !== 0;
    const isTileBelow = board[spaceBelow][column + 1] !== 0;

    secondPartOfWord += board[spaceBelow][column];

    if (isNewlyPlacedTile && isTileAbove && !crossAxis || isNewlyPlacedTile && isTileBelow && !crossAxis) {
      allWordsForTurn = allWordsForTurn.concat(exports.findWordByRow(row, spaceAfter, board, tiles, true));
    }
    spaceBelow += 1;
  }

  const currentWord = firstPartOfWord.split('').reverse().join('') + secondPartOfWord;
  if (!isWordValid(currentWord)) {
    return [];
  }
  allWordsForTurn.push(currentWord);

  return allWordsForTurn;
};
