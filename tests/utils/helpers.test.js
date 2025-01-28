const { validateRequestBody, createPromptMessages, handleOpenAIResponse } = require('../../utils/helpers');

const infoNotFoundReply = "I cannot answer that based on the provided information.";

describe('Helpers', () => {
    describe('validateRequestBody', () => {
        it('should throw an error if helpdeskId is missing or invalid', () => {
            expect(() => validateRequestBody(null, 'project', [])).toThrow('Invalid or missing helpdeskId. It must be a number.');
        });

        it('should throw an error if projectName is missing or invalid', () => {
            expect(() => validateRequestBody(1, null, [])).toThrow('Invalid or missing projectName. It must be a string.');
        });

        it('should throw an error if messages are missing or not an array', () => {
            expect(() => validateRequestBody(1, 'project', null)).toThrow('Invalid or missing messages. It must be a non-empty array.');
        });

        it('should not throw if all inputs are valid', () => {
            expect(() => validateRequestBody(1, 'project', [{}])).not.toThrow();
        });
    });

    describe('createPromptMessages', () => {
        it('should format messages correctly for OpenAI', () => {
            const semanticResults = [{ content: 'FAQ content' }];
            const userMessages = [{ content: 'User question' }];

            const result = createPromptMessages(semanticResults, userMessages);

            expect(result).toHaveLength(2);
            expect(result[0].role).toBe('system');
            expect(result[1].role).toBe('user');
        });
    });

    describe('handleOpenAIResponse', () => {
        it('should return a fallback message if OpenAI response is empty', () => {
            const semanticResults = [{ '@search.score': 0.8, content: 'FAQ content', type: "N1"  }];
            const messages = [{ role: 'user', content: 'User question' }];

            const result = handleOpenAIResponse('', semanticResults, messages);

            expect(result.messages).toHaveLength(2);
            expect(result.messages[1].content).toBe(infoNotFoundReply);
            expect(result.handoverToHumanNeeded).toBe(true);
        });

        it('should append OpenAI response to messages', () => {
            const semanticResults = [];
            const messages = [{ role: 'user', content: 'User question' }];
            const openAIResponse = 'AI response';

            const result = handleOpenAIResponse(openAIResponse, semanticResults, messages);

            expect(result.messages).toHaveLength(2);
            expect(result.messages[1].content).toBe(openAIResponse);
        });

        it('should detect if last three messages are not found replies', () => {
            const semanticResults = [];
            const messages = [
                { role: 'user', content: 'User question' },
                { role: 'assistant', content: infoNotFoundReply },
                { role: 'user', content: 'User question' },
                { role: 'assistant', content: infoNotFoundReply },
                { role: 'user', content: 'User question' }
            ];
            const openAIResponse = infoNotFoundReply;

            const result = handleOpenAIResponse(openAIResponse, semanticResults, messages);

            expect(result.handoverToHumanNeeded).toBe(true);
        });

        it('should detect N2 semantic result', () => {
            const semanticResults = [{ '@search.score': 0.8, content: 'FAQ content', type: "N2" }];
            const messages = [
                { role: 'user', content: 'User question' },
            ];
            const openAIResponse = infoNotFoundReply;

            const result = handleOpenAIResponse(openAIResponse, semanticResults, messages);

            expect(result.handoverToHumanNeeded).toBe(true);
        });

        it('should continue conversation', () => {
            const semanticResults = [{ '@search.score': 0.8, content: 'FAQ content', type: "N1" }];
            const messages = [
                { role: 'user', content: 'User question' },
            ];
            const openAIResponse = infoNotFoundReply;

            const result = handleOpenAIResponse(openAIResponse, semanticResults, messages);

            expect(result.handoverToHumanNeeded).toBe(false);
        });
    });
});
