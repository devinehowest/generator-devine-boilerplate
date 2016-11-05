module.exports = file => {
  if (file === `index.js` || !file.endsWith(`.js`) || file.startsWith(`_`)) return false;
  return true;
};
