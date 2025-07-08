import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI()

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