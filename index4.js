const {Configuration, OpenAIApi} = require("openai")
require("dotenv").config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})
	

const openai = new OpenAIApi(configuration)

async function callChatGPT(text){
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: text,
        })
        console.log(completion.data.choices[0].text)
    }catch (e) {
        console.log(e)
    }
    
}

callChatGPT("When was JavaScript invented")