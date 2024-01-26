function flattenObjectAsync(obj, prefix = '') {
    return new Promise(resolve => {
      const result = {};
  
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const flatKey = prefix ? `${prefix}_${key}` : key;
  
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Recursively flatten nested objects
            flattenObjectAsync(obj[key], flatKey).then(flattened => {
              Object.assign(result, flattened);
            });
          } else {
            result[flatKey] = obj[key];
          }
        }
      }
  
      resolve(result);
    });
  };
  
  module.exports = flattenObjectAsync;
/*   // Example usage:
  const nestedObject = {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001',
    },
    contact: {
      email: 'john@example.com',
      phone: {
        home: '123-456-7890',
        mobile: '987-654-3210',
      },
    },
  };
  
  (async () => {
    const flattenedObject = await flattenObjectAsync(nestedObject);
    console.log(flattenedObject);
  })(); */