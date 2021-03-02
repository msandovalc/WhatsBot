const messages = require('../messages.json')
const path = require('path');
const mime = require('mime');
var fs = require("fs");

function getMessage(text) { //Promise read data

    try {
        var out = getElement(text)
        return out
    } catch (err) {
        return "read_error"
    } 
}

var element = messages.map(function(value) {
  try {
        return {
        contains: value.contains,
        exact: value.exact,
        response: value.response,
        file: value.file,
        youtube: value.youtube,
        link: value.link
        };
    } catch (err) {
        return "read_error"
    } 
});

var getElement = function(text) {
  try {
        var data;
        element.forEach(function(value) {
          value.contains === text && (data = value);
        });
    return data;
    } catch (err) {
        return "read_error"
    } 
    
  };

  function getFileInBase64 (filename) {
    try {
        return {
          name: path.join(process.cwd(), filename),
            // get the mimetype
          mimetype: mime.getType(filename),
          data: fs.readFileSync(filename, { encoding: 'base64' })
          };
        } catch (error) {
            return(error);
        }
  };

module.exports = {
    getMessage,
    getFileInBase64
}