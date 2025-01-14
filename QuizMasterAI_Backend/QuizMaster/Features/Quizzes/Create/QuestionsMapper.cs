using OpenAI.Chat;
using QuizMaster.Domain.Entities;
using System.Text.Json;

namespace QuizMaster.Features.Quizzes.Create;

public static class QuestionsMapper
{
    public static List<Question> DeserializeQuestions(ChatCompletion completion)
    {
        using JsonDocument structuredJson = JsonDocument.Parse(completion.Content[0].Text);

        var questions = structuredJson.RootElement.GetProperty("questions").EnumerateArray()
            .Select(q => new Question
            {
                Text = q.GetProperty("text").GetString()!,
                Answers = q.GetProperty("answers").EnumerateArray()
                    .Select(a => new Answer
                    {
                        Text = a.GetProperty("text").GetString()!,
                        IsCorrect = a.GetProperty("isCorrect").GetBoolean()
                    }).ToList()
            }).ToList();

        return questions;
    }
}
