exports.makeBoard = (height = 14, width = 14) => {
  const board = [];
  for (let i = 0; i < height; i++) {
    board.push(Array(width).fill(0));
  }
  return board;
};
