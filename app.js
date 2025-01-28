const express = require('express');
const bodyParser = require('body-parser');
const { getTextEmbedding, generateChatCompletion } = require('./services/openAI');
const { getSemanticResults } = require('./services/azureSearch');
const { validateRequestBody, createPromptMessages, handleOpenAIResponse } = require('./utils/helpers');

const app = express();
app.use(bodyParser.json());

app.post('/conversations/completions', async (req, res) => {
    try {
        const { helpdeskId, projectName, messages } = req.body;

        validateRequestBody(helpdeskId, projectName, messages);

        const userMessages = messages.filter(msg => msg.role === 'USER');
        const lastUserMessage = userMessages.at(-1);

        const embedding = await getTextEmbedding(lastUserMessage.content);
        const semanticResults = await getSemanticResults(embedding, projectName);
        const promptMessages = createPromptMessages(semanticResults, userMessages);
        const openAIResponse = await generateChatCompletion(promptMessages);

        const finalResponse = handleOpenAIResponse(openAIResponse, semanticResults, messages);
        return res.json(finalResponse);
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
