const axios = require('axios');
const { getSemanticResults } = require('../../services/azureSearch');

jest.mock('axios');

describe('AzureSearch', () => {
    it('should fetch semantic results successfully', async () => {
        const mockResponse = { data: { value: [{ content: 'FAQ content' }] } };
        axios.post.mockResolvedValueOnce(mockResponse);

        const embedding = [0.1, 0.2, 0.3];
        const projectName = 'project';

        const result = await getSemanticResults(embedding, projectName);

        expect(result).toEqual(mockResponse.data.value);
    });

    it('should throw an error if fetching fails', async () => {
        axios.post.mockRejectedValueOnce(new Error('Request failed'));

        const embedding = [0.1, 0.2, 0.3];
        const projectName = 'project';

        await expect(getSemanticResults(embedding, projectName)).rejects.toThrow('Failed to fetch semantic results from Azure AI Search');
    });
});
