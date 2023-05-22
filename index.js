//This code helps acquire the xml file onto your local device
//This example is using the 'Floor Amendments' RSS feed

const https = require('https');
const fs = require('fs');

const fileUrl = 'https://www.legis.state.pa.us/WU01/LI/RSS/FA/SenateAmendments.xml';
const filePath = './file.xml';

https.get(fileUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download file: ${response.statusCode}`);
    return;
  }

  const fileStream = fs.createWriteStream(filePath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    console.log('File downloaded successfully.');
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        console.error(`Failed to read file: ${error}`);
        return;
      }
      console.log(data);
    });
  });
});




