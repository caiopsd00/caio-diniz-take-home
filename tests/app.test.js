const request = require('supertest');
const app = require('../app');

const openAI = require('../services/openAI');
const azureSearch = require('../services/azureSearch');

jest.mock('../services/openAI');
jest.mock('../services/azureSearch');

describe('API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    
        openAI.getTextEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
        azureSearch.getSemanticResults.mockResolvedValue([{ content: 'FAQ content' }]);
        openAI.generateChatCompletion.mockResolvedValue('AI response');
    });

    it('should return a valid response for valid inputs', async () => {
        const mockEmbedding = [0.1, 0.2, 0.3];
        const mockSemanticResults = [{ content: 'FAQ content' }];
        const mockCompletion = 'AI response';

        openAI.getTextEmbedding.mockResolvedValue(mockEmbedding);
        azureSearch.getSemanticResults.mockResolvedValue(mockSemanticResults);
        openAI.generateChatCompletion.mockResolvedValue(mockCompletion);

        const response = await request(app)
        .post('/conversations/completions')
        .send({
            helpdeskId: 1,
            projectName: 'project',
            messages: [{ role: 'USER', content: 'Question' }] // Certifique-se de que 'content' existe
        });
        expect(response.status).toBe(200);
        expect(response.body.messages).toHaveLength(2);
        expect(response.body.messages[1].content).toBe('AI response');
        expect(openAI.getTextEmbedding).toHaveBeenCalledWith('Question');
        expect(azureSearch.getSemanticResults).toHaveBeenCalledWith([0.1, 0.2, 0.3], 'project');
        expect(openAI.generateChatCompletion).toHaveBeenCalled();
    
    });

    it('should return 500 for invalid inputs', async () => {
        const response = await request(app)
            .post('/conversations/completions')
            .send({});

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Invalid or missing helpdeskId. It must be a number.');
    });
});
