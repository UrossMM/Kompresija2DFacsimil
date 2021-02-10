var whiteCodes = []; // tabela koja ima kodove u zavisnosti od duzine belih polja Table 2/T.4 – Terminating codes iz literature
var blackCodes = []; // tabela koja ima kodove u zavisnosti od duzine crnih polja

whiteCodes.push("00110101");
whiteCodes.push("000111");
whiteCodes.push("0111");
whiteCodes.push("1000");
whiteCodes.push("1011");
whiteCodes.push("1100");
whiteCodes.push("1110");
whiteCodes.push("1111");
whiteCodes.push("10011");
whiteCodes.push("10100");
whiteCodes.push("00111");
whiteCodes.push("01000");
whiteCodes.push("001000");
whiteCodes.push("000011");

blackCodes.push("0000110111");
blackCodes.push("010");
blackCodes.push("11");
blackCodes.push("10");
blackCodes.push("011");
blackCodes.push("0011");
blackCodes.push("0010");
blackCodes.push("00011");
blackCodes.push("000101");
blackCodes.push("000100");
blackCodes.push("0000100");
blackCodes.push("0000101");
blackCodes.push("0000111");
blackCodes.push("00000100");
// dodato prvih 10 duzina i njihovi kodovi za crne i bele
const EOL = "000000000001";

var modeTable = [];
modeTable.push("0001"); //Pass mode index 0
modeTable.push("001"); // Horizontal mode index 1
modeTable.push("1"); //Vertical mode od ovog pa do kraja index 2-9
modeTable.push("011");
modeTable.push("000011");
modeTable.push("0000011");
modeTable.push("010");
modeTable.push("000010");
modeTable.push("0000010");
modeTable.push("0000001000");

let input = null;
let result = "";
input = [
  //primer testa za pass mode
 // ["White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "Black", "Black", "White", "White", "White", "White", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White"]
];
/*input = [
  // primer testa za vertikalni mode
  //["White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "White", "Black", "Black", "Black", "Black", "Black", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "White", "White", "White", "White", "Black", "Black", "Black", "Black", "White"]
];*/
/*input = [
  // primer testa za horizontal mode
  //["White","White", "White","White","White","White","White","White","White","White","White","White","White","White"],
  ["White","White","White","White","White","White","Black","Black","White","White","White","White","White","White"],
  ["White","Black","Black","Black","Black","Black","Black","White","White","White","White","Black","Black","White"]
];*/

/*input = [
  // primer testa za horizontal mode
  //["White","White", "White","White","White","White","White","White","White","White","White","White","White","White"],
  ["White","White","White","White","White","White","Black","Black","White","White","White","White","White","White"],
  ["White","Black","Black","Black","Black","Black","Black","White","White","White","White","Black","Black","White"],
  ["White", "White", "White", "White", "White", "White", "Black", "Black", "Black", "Black", "Black", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "White", "White", "White", "White", "Black", "Black", "Black", "Black", "White"],
   ["White", "White", "White", "White", "White", "Black", "Black", "White", "White", "White", "White", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White"],
   ["White", "White", "White", "White", "White", "Black", "Black", "White", "White", "White", "White", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White", "White"],
   ["White","Black","Black","Black","Black","Black","Black","White","White","White","White","Black","Black","White"],
  ["White", "White", "White", "White", "White", "White", "Black", "Black", "Black", "Black", "Black", "White", "White", "White"],
  ["White", "White", "White", "White", "White", "White", "White", "White", "White", "Black", "Black", "Black", "Black", "White"],
   ["White", "White", "White", "White", "White", "Black", "Black", "White", "White", "White", "White", "White", "White", "White"]
];*/

let position = 1;
let referentLine = null;
let codingLine = null;
let a0,a1,a2,b1,b2;

function compression() {
  while (position < input.length) {
     a0 = 0;
     a1 = -1;
     a2 = -2;
     b1 = -3;
     b2 = -4;
    referentLine = input[position - 1];
    codingLine = input[position];
    console.log(referentLine);
    console.log(codingLine);
    a0 = findFirstWhite(codingLine);
    let lineResult = "";
    while ( a1!= 13 && b1!=13 && b2!=13 ) {
      // dok ne dodjes do kraja linije
      a1 = findFirstDifferent(codingLine, a0, codingLine[a0]);
      b1 = findFirstDifferent(referentLine, a0 + 1, codingLine[a0]);
      b2 = findFirstDifferent(referentLine, b1, referentLine[b1]);
      console.log("a0 " + a0);
      console.log("a1 " + a1);
      console.log("b1 " + b1);
      console.log("b2 " + b2);
      let lengthBetween = null;
      let code = null;
      if (b2 < a1) {
        //pass mode
        console.log("pass mode");
        lengthBetween = b2 - b1;
        //console.log("codingline[b1] " + codingLine[b1]);
        if (codingLine[b1] == "Black") {
          //console.log("BLACK");
          code = modeTable[0] + blackCodes[lengthBetween];
        } else {
          // console.log("WHITE");
          code = modeTable[0] + whiteCodes[lengthBetween];
        }
        a0 = b2;
      } // hozizontalni ili vertikalni mod
      else {
        if (Math.abs(a1 - b1) <= 3) {
          //vertikalni
          console.log("vertical mode");
          if (a1 >= b1) {
            lengthBetween = a1 - b1;
            code = modeTable[lengthBetween + 2]; // + whiteCodes[lengthBetween]; //+2 zbog pass i horizontalnog moda u tabeli
            a0 = a1;
          } else if (a1 < b1) {
            lengthBetween = b1 - a1;
            code = modeTable[lengthBetween + 2 + 3]; // + blackCodes[lengthBetween]; // +3 zbog tabele
            a0 = a1;
          }
        } else {
          //horizontalni
          console.log("horizontal mode");
          let a2 = findFirstDifferent(codingLine, a1, codingLine[a1]);
          console.log("a2: " + a2);
          lengthBetween = a1 - a0;
          let lengthBetween2 = a2 - a1;
          console.log("Length between a2 a1 : " + lengthBetween2);
          code =
            modeTable[1] +
            whiteCodes[lengthBetween] +
            blackCodes[lengthBetween2];
          a0 = a2;
        }
      }
      console.log("Lenghbetween: " + lengthBetween);
      console.log("Dodaje se " + code);
      lineResult += code;
    }
    console.log(
      "Obrada linije zavrsena, pretvorena je u kod: " + lineResult + EOL
    );
    result += lineResult + EOL + "\n";
    // console.log("trenutni result\n " + result);
    position++;
  }
  return result;
}

function findFirstWhite(array) {
  let i = 0;
  while (array[i] != "White") i++;
  return i;
}

function findFirstDifferent(array, start, currentSymbol) {
  //let startSymbol = array[start];
  while (array[start] == currentSymbol && start < array.length) start++;
  if (start < array.length) return start;
  else return array.length-1;
}
console.log("Kraj algoritma, rezultat je:\n " + compression());
