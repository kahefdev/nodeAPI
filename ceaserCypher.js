//Implementation of Ceaser Cypher

//Use the shift value, 3 => a = x  ; x = u ; z = w

//Decypher using same shift value

let decypher = (text, shift) => {
  let cypherText = [];
  for (let i = 0; i < text.length; i++) {
    let val = text.charCodeAt(i) + shift;
    val === 32 + shift
      ? cypherText.push(String.fromCharCode(32))
      : val > 122
      ? cypherText.push(String.fromCharCode(96 + (val - 122)))
      : cypherText.push(String.fromCharCode(val));
  }
  return cypherText.join('');
};

let cypher = (text, shift) => {
  let cypherText = [];
  for (let i = 0; i < text.length; i++) {
    let val = text.charCodeAt(i) - shift;
    val === 32 - shift
      ? cypherText.push(String.fromCharCode(32))
      : val < 97
      ? cypherText.push(String.fromCharCode(123 - (97 - val)))
      : cypherText.push(String.fromCharCode(val));
  }
  return cypherText.join('');
};
let names = ['john doe', 'mathew james', 'random text message'];
let usersObj = {};
names.forEach((val) => {
  usersObj[val] = cypher(val.toLowerCase(), 3);
});

console.log(usersObj);
