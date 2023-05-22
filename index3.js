//This code takes uses axios to fetch the HTML from the URL. And from there, we are able to parse certain elements
//that we want, such as the text contained within the div element within the file

const axios = require('axios');
const cheerio = require('cheerio');


const url = 'https://www.legis.state.pa.us/cfdocs/legis/ha/public/HaCheck.cfm?txtType=HTM&syear=2023&sind=0&body=S&type=B&bn=459&pn=0380&ayear=2023&an=00088&aType=aic'; // Replace with the URL you want to fetch

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
  }
}
// End of function to fetch the HTML content from a URL======================================================================================================================================================================



// Function to parse HTML using Cheerio=================================================================================================================================================================
function parseHTML(html) {
  const $ = cheerio.load(html);

  // Extracting text from all div elements
  const desiredTextArray = [];
  $('div').each((index, element) => {
    const text = $(element).text();
    desiredTextArray.push(text);
  });
  return desiredTextArray
  
}

// End of function to parse HTML using Cheerio=================================================================================================================================================================



// Fetch the HTML content and parse it
fetchHTML(url)
//The 'html' variable in the '.then' block refers to the resolved value of 'response.data' in the 'fetchHTML(url)' function
//It represents the HTML content fetched from the specified URL. This value is then passed as an argument to the parseHTML(html) 
//function for further processing. 
  .then(html => {
    //when we return 'desiredTextArray' within parseHTML(html), it becomes the resolved value of the promise returned by parseHTML(html)
    //So, when this resolved promise value is returned, we assign it to a variable we call 'data'
    const data = parseHTML(html);
    console.log(data);
  })
 
  .catch(error => {
    console.error('Error:', error);
  });
