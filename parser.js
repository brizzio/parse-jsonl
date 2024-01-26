const fs = require('fs');
const csv = require('csv-parser');

let count = 0;
let maxLines = 3;

// Replace 'your-large-file.csv' with the path to your CSV file
const filePath = 'openfoodfacts.csv';

const readStream = fs.createReadStream(filePath);
let csvStream = csv();

// Use the csv-parser library to parse each row of the CSV file
readStream.pipe(csvStream)
    .on('headers', (headers) => {
        let arr = []
        headers[0].split('\t').map((h, i)=>console.log(`${h} :: ${i}`))
    })
  .on('data', (row) => {
    // Your logic to process each row goes here
    //console.log(row);
    readStream.unpipe(csvStream);
    csvStream.end();
    readStream.destroy();  
    
  })
  .on('end', () => {
    console.log('Finished reading the CSV file.');
  })
  .on('error', (error) => {
    console.error('Error reading the CSV file:', error);
  });