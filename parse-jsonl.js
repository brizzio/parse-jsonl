const fs = require('fs');
const readline = require('readline');
const flattenObjectAsync = require('./flatten')
const writeObjectToYamlFile = require('./yamlWriter');
const { log } = require('console');
const isEAN13 = require('./eanValidator');


// Replace 'your-large-file.jsonl' with the path to your JSONL file
const filePath = 'openfoodfacts-products.jsonl';

function updateConsoleLine(newLine) {
    process.stdout.clearLine();  // Clear the current line
    process.stdout.cursorTo(0); // Move the cursor to the beginning of the line
    process.stdout.write(newLine); // Write the new content
  }


function isValidJsonString(jsonString){
    
    if(!(jsonString && typeof jsonString === "string")){
        return false;
    }

    try{
       return JSON.parse(jsonString);
    }catch(error){
        return false;
    }

}

function flattenObject(obj, prefix = '') {
    const result = {};
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const flatKey = prefix ? `${prefix}_${key}` : key;
  
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively flatten nested objects
          Object.assign(result, flattenObject(obj[key], flatKey));
        } else {
          result[flatKey] = obj[key];
        }
      }
    }
  
    return result;
  }

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

let lineCount = 0;
let errorCount = 0;
let productWithEan = 0;
let products = []

let code =''

// Process each line as JSON
rl.on('line', (line) => {
  try {
    const jsonData = isValidJsonString(line);
    // Your logic to process each JSON object goes here

    if(jsonData){
    lineCount++;
   // console.log(jsonData.code?.split('').reduce((a,c)=>a+Number(c),0))
    code = jsonData.code?.split('').reduce((a,c)=>a+Number(c),0)>0?jsonData.code:false
    

    if (isEAN13(code)) {
        
        

        let prod = {}
        prod.ean = jsonData.code?jsonData.code:'';
        prod.brand = jsonData.product?.brands?jsonData.product.brands.toString().split(',')[0]:'';
        prod.image = jsonData.product?.image_front_url?jsonData.product.image_front_url:'';
        prod.manufacturer = jsonData.product?.manufacturing_places? jsonData.product.manufacturing_places.toString().split(',')[0]:'';
        prod.product = jsonData.product?.product_name?jsonData.product.product_name:'';
        prod.packaging = jsonData.product?.quantity?jsonData.product.quantity:'';
        prod.plu = jsonData.product?.sortkey?jsonData.product.sortkey.toString():'';
        prod.origin = jsonData.product?.teams?jsonData.product.teams:''
        prod.status = jsonData.status?jsonData.status:0
    
        if (prod.product) {
            products.push(prod)
            productWithEan++
        }
    
    }


       // writeObjectToYamlFile(await flattenObjectAsync(jsonData), 'file' + lineCount)
       //const flattenedObject = flattenObject(jsonData)
       //console.log(flattenedObject);
        
    }else{
        errorCount++;
    }
    
      
    if (lineCount) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`valid records: ${lineCount.toString()} / products: ${productWithEan}/ errors: ${errorCount.toString()} / ean: ${code}`)
    }

    // If you want to end the process after processing 10 lines
     if (lineCount == 100_000) {
      if(products.length) writeObjectToYamlFile(products, 'products.yaml')
      //if (Number(code)>0) writeObjectToYamlFile(jsonData, code + "-" + Number.parseInt(Math.random()*100)+'.yaml')
      rl.close(); // Close the readline interface
      readStream.close(); // Close the read stream
    } 
  } catch (error) {
    
    console.error('Error parsing JSON:', error);
  }
});

// Handle the end of the file
rl.on('close', () => {
  //process.stdout.write('\\n');
  console.log('Finished reading the JSONL file. ', lineCount);
});

// Handle stream errors
readStream.on('error', (error) => {
  //process.stdout.write('\\n');
  console.log('Error reading the JSONL file:', error);
});