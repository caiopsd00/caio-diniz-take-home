const axios = require('axios');
require('dotenv').config();

const urlBase = 'https://api.openai.com/v1';
const embeddingModel = 'text-embedding-3-large';
const generalCompletionModel = 'gpt-4o';
const headers = {
    headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
    },
};

async function getTextEmbedding(inputText) {
    try {
        const response = await axios.post(`${urlBase}/embeddings`, {
            model: embeddingModel,
            input: inputText,
        }, headers);
        return response.data.data[0].embedding;
    } catch (error) {
        console.error('Error fetching embedding:', error.message);
        throw new Error('Failed to fetch embedding from OpenAI');
    }
}

async function generateChatCompletion(messages) {
    try {
        const response = await axios.post(`${urlBase}/chat/completions`, {
            model: generalCompletionModel,
            messages,
        }, headers);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating chat completion:', error.message);
        throw new Error('Failed to fetch chat completion from OpenAI');
    }
}

module.exports = {
    getTextEmbedding,
    generateChatCompletion,
};
