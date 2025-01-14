using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain.Entities;
using System.Reflection;

namespace QuizMaster.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> opt) : DbContext(opt)
{
    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);
    }

}
