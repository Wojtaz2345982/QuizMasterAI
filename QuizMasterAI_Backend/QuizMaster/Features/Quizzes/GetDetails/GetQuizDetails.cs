using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Common.Interfaces;
using QuizMaster.Common.ReturnTypes;
using QuizMaster.Domain.Entities;
using QuizMaster.Features.Quizzes.GetDetails.DTOs;
using QuizMaster.Infrastructure.Persistence;

namespace QuizMaster.Features.Quizzes.GetDetails;

public class GetQuizDetailsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/quizzes/{quizId:int}", async (int quizId, ISender sender) =>
        {
            var result = await sender.Send(new GetQuizDetails.GetQuizDetailsQuery(quizId));

            return result.IsSuccess
                ? Results.Ok(result.Value)
                : Results.NotFound(result.Error);
        })
        .RequireAuthorization()
        .WithTags("Quizzes");
    }
}

public static class GetQuizDetails
{
    public record GetQuizDetailsQuery(int Id) : IRequest<Result<QuizDetailsResponse>>;

    public record QuizDetailsResponse(string Title, string Topic, Difficulty Difficulty, int NumberOfQuestions, List<QuestionDto> Questions);

    internal sealed class Handler(
        ApplicationDbContext dbContext,
        ICurrentUserService currentUserService
        ) : IRequestHandler<GetQuizDetailsQuery, Result<QuizDetailsResponse>>
    {
        public async Task<Result<QuizDetailsResponse>> Handle(GetQuizDetailsQuery request, CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(currentUserService.UserId!);

            var quiz = dbContext.Quizzes
                .AsNoTracking()
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefault(q => q.Id == request.Id && q.UserId == userId);

            if (quiz is null)
            {
                return Result.Failure<QuizDetailsResponse>(
                    Error.NotFound("Quiz not found."));
            }

            var questionsDtos = quiz.Questions.Adapt<List<QuestionDto>>();

            var response = new QuizDetailsResponse(
                quiz.Title,
                quiz.Topic,
                quiz.Difficulty,
                quiz.Questions.Count,
                questionsDtos
            );

            return Result.Success(response);
        }
    }
}
