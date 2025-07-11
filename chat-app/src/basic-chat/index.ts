import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();
import { encoding_for_model } from 'tiktoken';
import { get } from 'http';


const openai = new OpenAI()

const encoding = encoding_for_model('gpt-4o');
const MAX_TOKENS = 1000; // Maximum tokens for the response

const context:OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
    role: 'system',
    content: 'You are a helpful assistant.'
}]

async function createChatCompletion() {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: context
    });
    const responseMessage = response.choices[0].message;
    context.push({
        role: "assistant",
        content: responseMessage.content
    });

if (response.usage  && response.usage.total_tokens > MAX_TOKENS) {
    deleteOlderMessages();
}

    console.log(`${response.choices[0].message.role}: ${response.choices[0].message.content}`);


}

process.stdin.on('data', async function (input) {
    const userMessage = input.toString().trim();
    if (userMessage.toLowerCase() === 'exit') {
        console.log('Exiting chat...');
        process.exit(0);
    }
    context.push({
        role: 'user',
        content: userMessage
    });
    await createChatCompletion();  
    
})

function deleteOlderMessages() {
    let contextLength = context.length;
    while (contextLength > MAX_TOKENS)
    {
        for (let i = 0; i < context.length; i++) {
            const message = context[i];
            if (message.role != 'system') {
                context.splice(i, 1);
                const currentTokenCount = getContextLength();
                console.log(`Deleted system message. Current token count: ${currentTokenCount}`);
                break
            }
        }      
    }
    }   

function getContextLength() {
    let totalTokens = 0;
    context.forEach(message => {
        if (typeof message.content === 'string') {
            totalTokens += encoding.encode(message.content).length;
        }   else if (Array.isArray(message.content)) {
            message.content.forEach(item => {
                if (item.type === 'text') {
                    totalTokens += encoding.encode(item.text).length;
                }
            });
        }
    });
    return totalTokens;
}