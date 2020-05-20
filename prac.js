// let re = /(^Mr\\.[a-zA-Z])$|^Mrs\\.[a-zA-Z]|^Ms\\.[a-zA-Z]|^Dr\\.[a-zA-Z]|^Er\\.[a-zA-Z]|/g;
// let re = new RegExp('^(Mr|Mrs|Ms|Dr|Er)(\\.)([a-zA-Z])*$');

let re = /\d+/g;
let str = '102, 1948948 and 1.3 and 4.5';

console.log(re.exec(str));
