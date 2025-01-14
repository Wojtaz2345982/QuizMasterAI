using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Common.Interfaces;
using QuizMaster.Common.ReturnTypes;
using QuizMaster.Domain.Entities;
using QuizMaster.Infrastructure.Persistence;

namespace QuizMaster.Features.Quizzes.Delete;

public class DeleteQuizEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/quizzes/{quizId:int}", async (int quizId, ISender sender) =>
        {
            var result = await sender.Send(new DeleteQuiz.DeleteQuizCommand(quizId));

            return result.IsSuccess
                ? Results.NoContent()
                : Results.BadRequest(result.Error);
        })
        .RequireAuthorization()
        .WithTags("Quizzes");
    }
}

public static class DeleteQuiz
{
    public record class DeleteQuizCommand(int Id) : IRequest<Result>;

    internal sealed class Handler(
        ILogger<Handler> logger,
        ApplicationDbContext dbContext,
        ICurrentUserService currentUserService) : IRequestHandler<DeleteQuizCommand, Result>
    {
        public async Task<Result> Handle(DeleteQuizCommand request, CancellationToken cancellationToken)
        {
            var userid = Guid.Parse(currentUserService.UserId!);

            var quiz = await dbContext.Quizzes
                .FirstOrDefaultAsync(q => q.Id == request.Id, cancellationToken);

            if (quiz!.UserId != userid || quiz is null)
            {
                return Result.Failure(Error.NotFound("Quiz not found or You have no access to this quiz."));
            }

            dbContext.Quizzes.Remove(quiz);

            await dbContext.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Quiz {QuizId} deleted", request.Id);

            return Result.Success();
        }
    }


}
