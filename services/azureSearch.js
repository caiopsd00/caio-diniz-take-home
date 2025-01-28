const axios = require('axios');

const urlBase = 'https://claudia-db.search.windows.net/indexes/claudia-ids-index-large/docs/search?api-version=2023-11-01';
const embeddingsNumber = 3;
const headers = {
    headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_AI_SEARCH_KEY,
    },
};

async function getSemanticResults(embedding, projectName) {
    try {
        const response = await axios.post(urlBase, {
            count: true,
            select: 'content, type',
            top: 10,
            filter: `projectName eq '${projectName}'`,
            vectorQueries: [
                {
                    vector: embedding,
                    k: embeddingsNumber,
                    fields: 'embeddings',
                    kind: 'vector',
                },
            ],
        }, headers);
        return response.data.value;
    } catch (error) {
        console.error('Error fetching semantic results:', error.message);
        throw new Error('Failed to fetch semantic results from Azure AI Search');
    }
}

module.exports = {
    getSemanticResults,
};
