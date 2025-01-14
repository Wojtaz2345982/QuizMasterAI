namespace QuizMaster.Domain.Entities;

public class Quiz
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } 
    public string Topic { get; set; }
    public Difficulty Difficulty { get; set; }   
    public int NumberOfQuestions { get; set; }


    public ICollection<Question> Questions { get; set; } = [];
}

public enum Difficulty
{
    Easy = 1,
    Medium = 2,
    Hard = 3
}