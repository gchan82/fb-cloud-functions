const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const os = require('os');
const path = require('path');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object().onFinalize((event) => {
  //const object = event.data; // deprecated and no longer available
  const bucket = event.bucket //object.bucket;
  const contentType = event.contentType;
  const filePath = event.name;
  console.log(event); // in firebase storage, access default bucket (object), get event data when triggered/onChange

  if (path.basename(filePath).startsWith('renamed-')) { //check to see if file is already renamed, prevent infinite loop
    console.log('We already renamed that file!');
    return;
  }

  const destBucket = gcs.bucket(bucket);
  const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const metadata = { contentType: contentType };
  return destBucket.file(filePath).download({
    destination: tmpFilePath
  }).then(() => {
    return destBucket.upload(tmpFilePath, {
      destination: 'renamed-' + path.basename(filePath),
      metadata: metadata
    })
  });
});
// run: "firebase deploy" in command line
//check functions in firebase.google.com
