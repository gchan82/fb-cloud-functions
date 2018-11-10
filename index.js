const functions = require("firebase-funtions");

exports.onFileChange = functions.storage.object().onChange(event => {
console.log(event);
return;
});
