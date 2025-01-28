const infoNotFoundReply = "I cannot answer that based on the provided information.";

function validateRequestBody(helpdeskId, projectName, messages) {
    if (!helpdeskId || typeof helpdeskId !== 'number') {
        throw new Error('Invalid or missing helpdeskId. It must be a number.');
    }

    if (!projectName || typeof projectName !== 'string') {
        throw new Error('Invalid or missing projectName. It must be a string.');
    }

    //comentar que aqui poderiam ser feitas verificações mais complexas como verificar o conteudo das mensagens
    if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Invalid or missing messages. It must be a non-empty array.');
    }
}

function createPromptMessages(semanticResults, userMessages) {
    const lastUserMessage = userMessages.at(-1)?.content || "No user message available.";
    const faqEntries = semanticResults.map(result => `- ${result.content}`).join('\n');
    const previousUserMessages = userMessages.map(message => `- ${message.content}`).join('\n');

    return [
        {
            role: 'system',
            content: `You are a helpful assistant that answers user questions based strictly on the provided FAQ content. 
                        Your task is to combine and summarize information from the FAQ to answer questions comprehensively. 
                        Follow these rules:
                            1. Use only the information provided in the FAQ to craft your response.
                            2. Consider the context of previous user questions to better understand the main question.
                            3. If the FAQ does not explicitly answer the question, infer the best possible answer using only the provided FAQ content.
                            4. If you cannot infer an answer, respond with the exact string: "${infoNotFoundReply}".
                            5. Do not use external knowledge, make unsupported assumptions, or include information not present in the FAQ.`,
        },
        {
            role: 'user',
            content: `User's main question:
                        "${lastUserMessage}"
                        
                        Here is the FAQ content you must use to answer:
                        ${faqEntries}

                        Here are the user's previous questions that might provide context:
                        ${previousUserMessages}

                        Important: If the FAQ content does not allow you to infer an answer, you must respond with the exact string: "${infoNotFoundReply}". Do not translate it.`,
        },
    ];
}

function handleOpenAIResponse(openAIResponse, semanticResults, messages) {
    const sectionsRetrieved = semanticResults.map(item => ({
        score: item['@search.score'],
        content: item.content
    }));

    if (!openAIResponse || openAIResponse.trim() === '') {
        console.warn('OpenAI returned an empty or null response. Using the fallback answer.');
        return {
            messages: [...messages, { role: 'assistant', content: infoNotFoundReply }],
            handoverToHumanNeeded: true,
            sectionsRetrieved
        };
    }

    const newMessages = [...messages, { role: 'assistant', content: openAIResponse.trim() }];
    const hasTypeN2 = semanticResults.some(item => item.type === "N2");
    const lastThreeRelevantMessages = newMessages
        .filter(message => message.role === "assistant" || message.role === "AGENT")
        .slice(-3);
    const lastThreeAreNotFound = lastThreeRelevantMessages.length == 3 && 
        lastThreeRelevantMessages.every(message => message.content === infoNotFoundReply);
    const handoverToHumanNeeded = hasTypeN2 || lastThreeAreNotFound;

    return {
        messages: newMessages,
        handoverToHumanNeeded,
        sectionsRetrieved
    };
}

module.exports = {
    validateRequestBody,
    createPromptMessages,
    handleOpenAIResponse,
};
