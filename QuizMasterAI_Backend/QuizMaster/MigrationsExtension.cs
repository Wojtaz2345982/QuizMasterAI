using Microsoft.EntityFrameworkCore;
using QuizMaster.Infrastructure.Persistence;

namespace QuizMaster;

public static class MigrationsExtension
{
    public static void ApplyMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var quizMasterDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        quizMasterDbContext.Database.Migrate();

    }
}
