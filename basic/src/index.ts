import dotenv from 'dotenv'
dotenv.config()
import { OpenAI } from 'openai'
import { encoding_for_model } from 'tiktoken'

const openai = new OpenAI()

async function main( ) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
            role: 'assistant',
            content: 'You are a helpful assistant.'
        },{
            role: 'user',
            content: 'How many continents we have?'
            
        }]
    })
    console.log(response.choices[0].message.content)
}
main();


function encodePrompt()
{
    const model = 'gpt-3.5-turbo'
    const tokenizer = encoding_for_model(model)
    const prompt = 'How many continents we have?'
    const encoded = tokenizer.encode(prompt)
    console.log(encoded)
    console.log(encoded.length)
    console.log(tokenizer.decode(encoded))
    console.log(tokenizer.decode(encoded.slice(0, 10)))
}
encodePrompt()
