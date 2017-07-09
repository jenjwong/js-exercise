const _ = require('lodash');

// https://github.com/BinaryMuse/trie-hard
const dictionary = require('./words');

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const scores = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];
const scoresByLetter = _.zipObject(letters, scores); // { 'a': 1, 'b': 3, ... }

const _scoreTiles = letters => _.sum(letters.map(letter => scoresByLetter[letter]));

exports.scoreTiles = (words) => {
  const letters = words.reduce((acc, item) => {
    acc = [...acc, ...item.split('')];
    return acc;
  }, []);
  return _scoreTiles(letters);
};

