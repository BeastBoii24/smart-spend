const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Read data from a JSON file
 * @param {string} filename - Name of the JSON file
 * @returns {Array} - Parsed data or empty array
 */
function readData(filename) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

/**
 * Write data to a JSON file
 * @param {string} filename - Name of the JSON file
 * @param {Array} data - Data to write
 */
function writeData(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
    }
}

module.exports = {
    readData,
    writeData,
    DATA_DIR
};
