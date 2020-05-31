const fs = require('fs');

let lpt = fs.readFileSync(`${__dirname}/../public/lpt/overview.html`, 'utf-8');
let industry = fs.readFileSync(
  `${__dirname}/../public/industry/overview.html`,
  'utf-8'
);

// let overview = fs.readFileSync(`${__dirname}/../public/overview.html`, 'utf-8');

exports.getOverview = (req, res) => {
  return res.end(overview);
};

exports.getIndustry = (req, res) => {
  return res.end(industry);
};

exports.getLpt = (req, res) => {
  console.log(req.query);
  let replacedTemp = lpt.replace(/{%NAME%}/g, `${req.query.name}`);
  return res.end(replacedTemp);
};

exports.pgres = (v1, v2) => {
  let replacedTemp = lpt.replace(/{%NAME%}/g, `${v1} ${v2}`);
  return replacedTemp;
};
