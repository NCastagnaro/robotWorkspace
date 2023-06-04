const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.legis.state.pa.us/cfdocs/legis/ha/public/HaCheck.cfm?txtType=HTM&syear=2023&sind=0&body=S&type=B&bn=459&pn=0380&ayear=2023&an=00088&aType=aic'; // Replace with the URL you want to fetch

const {Configuration, OpenAIApi} = require("openai")
require("dotenv").config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})

async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching HTML:', error);
    throw error
  }
}

function parseHTML(html, limit) {
    const $ = cheerio.load(html);
    let totalCharacters = 0;
    const desiredTextArray = [];
    $('div').each((index, element) => {
      const text = $(element).text().replace(/[\t\n]/g, '');
      const adjustedText = text.slice(0, limit - totalCharacters);
      const adjustedTextLength = adjustedText.length;
  
      if (adjustedTextLength > 0) {
        desiredTextArray.push(adjustedText);
        totalCharacters += adjustedTextLength;
      }
      if (totalCharacters >= limit) {
        return false;
      }
    });

    return desiredTextArray;
  }
  
  

const openai = new OpenAIApi(configuration)

async function callChatGPT(text){
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ` ${text} \n\nTl:dr `,
            temperature:0.4,
            max_tokens:200,
            frequency_penalty:0.0,
            presence_penalty:1,
        })
        return (completion.data.choices[0].text)
    }catch (e) {
        console.log(e)
    }  
}





fetchHTML(url)
  .then(html => {
     const data = parseHTML(html,3000);
     const dataString = data.join('')
    return dataString
  })

  .then(dataFromParse => {
    callChatGPT(dataFromParse)
      .then(response => {
        console.log(`The summary of bill: ${response}`);    
      })
      .catch(error => {
        console.error('Error:', error);
      });
})