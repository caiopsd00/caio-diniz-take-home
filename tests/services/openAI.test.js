const axios = require('axios');
const { getTextEmbedding, generateChatCompletion } = require('../../services/openAI');

jest.mock('axios');

describe('OpenAI', () => {
    it('should fetch text embedding successfully', async () => {
        const mockResponse = { data: { data: [{ embedding: [0.1, 0.2, 0.3] }] } };
        axios.post.mockResolvedValueOnce(mockResponse);

        const inputText = 'Test text';
        const result = await getTextEmbedding(inputText);

        expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('should throw an error if embedding fetch fails', async () => {
        axios.post.mockRejectedValueOnce(new Error('Request failed'));

        const inputText = 'Test text';
        await expect(getTextEmbedding(inputText)).rejects.toThrow('Failed to fetch embedding from OpenAI');
    });

    it('should fetch chat completion successfully', async () => {
        const mockResponse = { data: { choices: [{ message: { content: 'Chat response' } }] } };
        axios.post.mockResolvedValueOnce(mockResponse);

        const messages = [{ role: 'user', content: 'Question' }];
        const result = await generateChatCompletion(messages);

        expect(result).toBe('Chat response');
    });

    it('should throw an error if chat completion fetch fails', async () => {
        axios.post.mockRejectedValueOnce(new Error('Request failed'));

        const messages = [{ role: 'user', content: 'Question' }];
        await expect(generateChatCompletion(messages)).rejects.toThrow('Failed to fetch chat completion from OpenAI');
    });
});
