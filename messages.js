// Add values if you are not using env vars
const fs = require('fs');

module.exports = {
    data: JSON.parse(fs.readFileSync(__dirname + '/messages.json', { encoding: 'utf8' }))
}