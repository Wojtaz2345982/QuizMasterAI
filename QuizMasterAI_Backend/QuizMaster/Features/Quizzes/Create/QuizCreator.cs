using OpenAI.Chat;
using QuizMaster.Domain.Entities;
using QuizMaster.Infrastructure.Services;

namespace QuizMaster.Features.Quizzes.Create;

public interface IQuizCreator
{
    Task<ChatCompletion> CreateQuizAsync(CreateQuizRequest request);
}

public class QuizCreator(
    ChatClientFactory chatClientFactory) : IQuizCreator
{
    readonly SystemChatMessage SystemChatMessage = new("You are a helpful assistant specialized in generating structured quizzes. " +
    "Your task is to create a collection of quiz questions and their corresponding answers based on the provided information: " +
    "\r\n\r\n- **Quiz Title**: The title of the quiz.\r\n- **Topic**: The subject or topic the quiz focuses on.\r\n- **Number of Questions**: " +
    "The number of questions to include in the quiz.\r\n- **Difficulty Level**: A scale from 1 to 3 where:" +
    "\r\n  - 1 = Easy\r\n  - 2 = Medium\r\n  - 3 = Hard\r\n\r\n**Instructions:**\r\n1. " +
    "Generate questions that align closely with the provided topic and difficulty level. " +
    "Do not create questions outside the given topic.\r\n2. " +
    "Each question must include **4 answers**:\r\n   - Exactly one correct answer.\r\n   - Three plausible but incorrect answers.\r\n3. " +
    "The format of your response is strictly defined and will be provided. " +
    "Do not deviate from this format.\r\n4. Avoid making up incorrect facts or hallucinating. " +
    "All content must be realistic, logical, and appropriate for the specified difficulty level." +
    "\r\n\r\nFocus on clarity, accuracy, and relevance for each question and answer. " +
    "Ensure that the generated quiz is engaging, educational, and suitable for the provided difficulty level.");


    public async Task<ChatCompletion> CreateQuizAsync(CreateQuizRequest request)
    {
        var client = chatClientFactory.Create();
        var userMessage = new UserChatMessage($"Generate a quiz about {request.Topic}. Difficulty: {request.Difficulty}. Number of questions: {request.NumberOfQuestions}.");

        ChatCompletionOptions options = new()
        {
            ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                jsonSchemaFormatName: "quiz_questions_schema",
                jsonSchema: BinaryData.FromBytes("""
                    {
                        "type": "object",
                        "properties": {
                            "questions": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "text": { "type": "string" },
                                        "answers": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "text": { "type": "string" },
                                                    "isCorrect": { "type": "boolean" }
                                                },
                                                "required": ["text", "isCorrect"],
                                                "additionalProperties": false
                                            }
                                        }
                                    },
                                    "required": ["text", "answers"],
                                    "additionalProperties": false
                                }
                            }
                        },
                        "required": ["questions"],
                        "additionalProperties": false
                    }
                """u8.ToArray()),
                jsonSchemaIsStrict: true)
                };

        var completion = await client.CompleteChatAsync([SystemChatMessage, userMessage], options);

        return completion;
    }
}

public record CreateQuizRequest(string Topic, int Difficulty, int NumberOfQuestions);