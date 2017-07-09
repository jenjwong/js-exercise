const _ = require('lodash');

exports.isSpotOpen = ({ col, row }, board) => board[col] && board[col][row] === 0;

exports.isFirstMoveValid = tiles => tiles.some(tile => tile.col === 7 && tile.row === 7);

exports.isAllOneAxis = ([{ col, row }] = tiles, tiles) => _.every(tiles, ['col', col]) || _.every(tiles, ['row', row]);

exports.getMainAxis = ([{ col, row }] = tiles, tiles) => tiles.every(tile => tile.col === col) ? 'col' : 'row';

const _isInRange = (num, max) => num >= 0 && num <= max;

exports.isOnBoard = (tile, board) => _isInRange(tile.col, board.length - 1) && _isInRange(tile.row, board.length - 1);
