# Node.js Backend API for Chatbot Responses

This project is developed as part of the Cloud Humans take-home assignment. The goal is to create an API endpoint that generates appropriate chatbot responses based on content tailored for specific companies. In this instance, the mock client is Tesla Motors, but the solution is designed to be adaptable for other companies as well. The API employs Retrieval Augmented Generation (RAG) techniques, integrating OpenAI's GPT models with Azure Search to provide accurate and contextually relevant responses. The architecture emphasizes clean code practices, automated testing, and environment-based configurations to ensure scalability and maintainability.

---

## 🚀 Run with Docker

You can run this project entirely using Docker, without the need to install Node.js or npm on your machine. Follow these steps:

### Prerequisites
1. Install [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/).
2. Ensure Docker is running.

### Steps to Run the Application

1. **Build the Docker Image**:
   ```bash
   docker-compose build

1. **Start the Application**:
   ```bash
   docker-compose up

1. **Access the Application:** The API will be available at:
   ```bash
   http://localhost:3000

1. **Run Tests:** To run the automated tests within the container:
   ```bash
   docker-compose run --rm app npm test

1. **Stop the Application:** To stop and remove the running containers:
   ```bash
   docker-compose down

## 🚀 How to Run the Project (without docker)

### Prerequisites

1. **Install Node.js**:
   - Ensure you have Node.js version `v22.13.1` installed.
   - You can download it [here](https://nodejs.org/en/).

2. **Clone this Repository**:
   ```bash
   git clone https://github.com/caiopsd00/caio-diniz-take-home.git
   cd caio-diniz-take-home

3. **Install Dependencie**:
   ```bash
   npm install

4. **Run Automated Tests**:
   ```bash
   npm start

5. **Start the Application**:
   ```bash
   npm run test

## 🛠️ Technical Decisions

### Why Node.js?
- Node.js was chosen due to my strong foundation in the language and experience building projects from scratch to production with it.
### Why Express?
- Express is a natural choice for building APIs with Node.js. It is lightweight, widely used, and has excellent community support.
### Why Axios?
- Axios is a trusted HTTP client that pairs well with Node.js for making external API requests.
### Project Structure
- Core Logic: The app.js file orchestrates calls to services and utilities.
- Services: Handle external integrations (e.g., OpenAI and Azure Search).
- Utilities: Contain reusable functions, such as validation and response processing, located in the utils folder.
### Why Jest for Testing?
- Jest was chosen for its seamless integration with Node.js, simplicity, and robust support for mocking and assertions. It is well-suited for unit and integration testing.
### Constants for Clarity
- Key values (e.g., strings used across the application) are extracted into constants to avoid "magic values," ensuring code clarity and maintainability.
### Environment Variables
- Sensitive configurations, such as API keys, are stored in a .env file, keeping the codebase secure and clean.
### Minimal Communication Overhead
- Functions are designed to process only the necessary parameters and return exactly what is needed, avoiding excessive data exchange.
### Test Coverage
- Tests focus on validating the core logic and error handling, with only essential cases covered for simplicity and reliability.

## 📋 Areas for Improvement

### 1. Input Validation:
- Enhance the validation of incoming requests, particularly for message content and structure.

### 2. Default Chat Responses:
- Improve the validation logic for fallback responses to ensure alignment with user intent.

### 3. Testing Coverage:
- Expand test cases to include edge cases and more detailed API behavior validations.