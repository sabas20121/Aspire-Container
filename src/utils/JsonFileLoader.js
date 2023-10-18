const fs = require('fs');

class JsonFileLoader {

    readJsonFile(fileName) {
        try {
            const data = fs.readFileSync(fileName, 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData;
          } catch (err) {
            console.error('Error reading or parsing the file:', err);
          }
    }

}

module.exports = JsonFileLoader;