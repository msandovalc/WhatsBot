//const config = require('../config');
const messages = require('./messages.json')

async function getData(text) { //Promise read data

    try {
        var out = ({
            getElement(text)
        })
        return out
    } catch (err) {
        return "read_error"
    } 
}

var element = messages.map(function(value) {
    return {
        contains: value.contains,
        exact: value.exact,
        response: value.response,
        file: value.file,
        youtube: value.youtube,
        link: value.link
    };
});

var getElement = function(text) {
    var data;
    element.forEach(function(value) {
      value.contains === text && (data = value);
    });
    return data;
  };

module.exports = {
    getData
}