function base52(n) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const len = chars.length;
  const res = [];
  let div = n;
  let y;
  if (div === 0) {
    res.push(chars[0]);
  } else {
    while (div !== 0) {
      y = div % len;
      res.unshift(chars[y]);
      div = Math.floor(div / len);
    }
  }

  return res.join('');
}

let index = 0;

module.exports = () => base52(index++);
