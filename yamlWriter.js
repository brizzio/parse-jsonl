const fs = require('fs').promises;
const yaml = require('js-yaml');
const path = require('path');

async function writeObjectToYamlFile(obj, fileName) {
  try {
    // Define the folder path (assuming "docs" folder at the root)
    const folderPath = path.join(__dirname, 'docs');

    // Check if the "docs" folder exists, and create it if not
    await fs.mkdir(folderPath, { recursive: true });

    // Convert the object to YAML format
    const yamlContent = yaml.dump(obj);

    // Define the file path within the "docs" folder
    const filePath = path.join(folderPath, fileName);

    // Write the YAML content to the file
    await fs.writeFile(filePath, yamlContent, 'utf8');

    process.stdout.cursorTo(0);
    process.stdout.write(`Object written to ${filePath} in YAML format.`)
    
  } catch (error) {
    console.error('Error writing to YAML file:', error);
  }
}

module.exports = writeObjectToYamlFile;
/* 
// Example usage:
const dataObject = {
  key1: 'value1',
  key2: {
    nestedKey: 'nestedValue',
  },
  // ... other key-value pairs
};

const fileName = 'output.yaml';

// Call the function with the object and file name
writeObjectToYamlFile(dataObject, fileName);
 */