const messages = require('../messages.json')
const path = require('path');
const mime = require('mime');
var fs = require("fs");

const getMessage = async function (text) { //Promise read data
    try {
        var out = await getElement(text);
        return out
    } catch (err) {
        return "read_error"
    } 
}

const element = messages.map(function(value) {
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

const getElement = async function(text) {
  try {
        var data;
        element.forEach(async function(value) {
          value.contains === text && (data = value);
        });
    return data;
    } catch (err) {
        return "read_error"
    } 
    
  };

  const getFileInBase64 = async function (filename) {
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