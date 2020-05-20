const fs = require('fs');

let lpt = fs.readFileSync(`${__dirname}/../public/dvdrental/users/index.html`, 'utf-8');

exports.pgres = (v1, v2) => {
  let replacedTemp = lpt.replace(/{%NAME%}/g, `${v1} ${v2}`);
  return replacedTemp;
};
