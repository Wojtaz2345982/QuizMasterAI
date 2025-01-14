namespace QuizMaster.Features.Quizzes.GetDetails.DTOs;

public class AnswerDto
{
    public int Id { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}
