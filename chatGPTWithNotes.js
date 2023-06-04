//This code takes uses axios to fetch the HTML from the URL. And from there, we are able to parse certain elements
//that we want, such as the text contained within the div element within the file


const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.legis.state.pa.us/cfdocs/legis/ha/public/HaCheck.cfm?txtType=HTM&syear=2023&sind=0&body=S&type=B&bn=459&pn=0380&ayear=2023&an=00088&aType=aic'; // Replace with the URL you want to fetch

//Open AI Information required =========================
const {Configuration, OpenAIApi} = require("openai")
require("dotenv").config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})


// Function to fetch the HTML content from a URL======================================================================================================================================================================
async function fetchHTML(url) {
  try {
    //when you call axios.get(url), it returns a Promise that will eventually be resolved with a response object. 
    //The response object contains various properties such as 'data', 'status', 'headers' etc.
    //The 'data' property specifically holds the response body, which in this case, represents the HTML content itself. 
    const response = await axios.get(url);
    //By returning response.data from the fetchHTML function, you ensure that the resolved value of the promise returned by fetchHTML()
    //is the HTML content itself. this allows you to access the HTML content as the argument in the sub
    return response.data;
  } catch (error) {
    console.error('Error fetching HTML:', error);
    throw error
  }
}
// End of function to fetch the HTML content from a URL======================================================================================================================================================================



// Function to parse HTML using Cheerio=================================================================================================================================================================
function parseHTML(html, limit) {
    const $ = cheerio.load(html);
  
    // Extracting text from all div elements
    let totalCharacters = 0;
    const desiredTextArray = [];
    $('div').each((index, element) => {
      const text = $(element).text().replace(/[\t\n]/g, '');
  
      // Calculate the length after removing symbols
      const adjustedText = text.slice(0, limit - totalCharacters);
      const adjustedTextLength = adjustedText.length;
  
      if (adjustedTextLength > 0) {
        desiredTextArray.push(adjustedText);
        totalCharacters += adjustedTextLength;
      }
  
      // Exit the loop if the limit is reached
      if (totalCharacters >= limit) {
        return false;
      }
    });

    return desiredTextArray;
  }
  
  
  
  
// End of function to parse HTML using Cheerio=================================================================================================================================================================

//Function to prompt ChatGPT ======================================================================================================================================================================
const openai = new OpenAIApi(configuration)

async function callChatGPT(text){
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ` ${text} \n\nTl:dr `,
            //temperature: Controls the randomness of the generated output. Higher values (e.g., 0.8) make the output more random and creative, while lower values (e.g., 0.2) make it more focused and deterministic.
            temperature:0.4,
            //max_tokens: Specifies the maximum number of tokens to be generated in the response. Tokens are chunks of text that can be as short as one character or as long as one word. 
            max_tokens:200,
            //(also known as nucleus sampling or "penalty for sampling from low-probability tokens"): It defines the cumulative probability threshold for selecting tokens during generation. Higher values (e.g., 0.9) make the model choose from a wider range of tokens, while lower values (e.g., 0.3) make it more focused on high-probability tokens. 
            top_p:1.0,
            // Adjusts the penalty for frequently generated tokens. Higher values (e.g., 1.2) make the model less likely to repeat the same phrases, while lower values (e.g., 0.0) allow more repetition. If you set it to 0, there will be no penalty
            frequency_penalty:0.0,
            //Controls the penalty for generating tokens that are not present in the input context. Higher values (e.g., 1.2) make the model more likely to stick to the input context, while lower values (e.g., 0.0) allow it to generate more novel content.
            presence_penalty:1,

        })
        return (completion.data.choices[0].text)
    }catch (e) {
        console.log(e)
    }  
}





// Fetch the HTML content and parse it
fetchHTML(url)
//The 'html' variable in the '.then' block refers to the resolved value of 'response.data' in the 'fetchHTML(url)' function
//It represents the HTML content fetched from the specified URL. This value is then passed as an argument to the parseHTML(html) 
//function for further processing. 
  .then(html => {
    //when we return 'desiredTextArray' within parseHTML(html), it becomes the resolved value of the promise returned by parseHTML(html)
    //So, when this resolved promise value is returned, we assign it to a variable we call 'data'
    //What we store in data is an array of all the text from the divs, which we extracted via cheerio 
     const data = parseHTML(html,3000);
     const dataString = data.join('')
    //need to include return keyword to pass the data to the next .then block
    
    return dataString
  })
  //We pass along 'data' to our next .then block
  .then(dataFromParse => {
    // Pass the 'answer' to callChatGPT function as the 'text' argument
    //console.log(dataFromParse)              //To showcase what text is extracted from the pdf
    callChatGPT(dataFromParse)
      .then(response => {
        console.log(`The summary of bill: ${response}`);    //outputs summary that ChatGPT created
      })
      .catch(error => {
        console.error('Error:', error);
      });
})