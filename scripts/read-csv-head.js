const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('excel/Population by Age and Sex - EDDs.csv');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  for await (const line of rl) {
    console.log(line);
    count++;
    if (count >= 10) break;
  }
}

processLineByLine();
