using FluentValidation;
using MediatR;
using OpenAI.Chat;
using QuizMaster.Common.Interfaces;
using QuizMaster.Common.ReturnTypes;
using QuizMaster.Domain.Entities;
using QuizMaster.Infrastructure.Persistence;
using QuizMaster.Infrastructure.Services;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace QuizMaster.Features.Quizzes.Create;

public class CreateQuizEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/quizzes", async (CreateQuiz.CreateQuizCommand command, ISender sender) =>
        {
            var result = await sender.Send(command);

            return result.IsSuccess
                ? Results.Created("/quizzes", result)
                : Results.BadRequest(result.Error);
        })
        .RequireAuthorization()
        .WithTags("Quizzes");
    }
}

public static class CreateQuiz
{
    public record CreateQuizCommand(string Title, string Topic, Difficulty Difficulty, int NumberOfQuestions) : IRequest<Result<CreateQuizResponse>>;

    public record CreateQuizResponse(int Id);


    public class Validator : AbstractValidator<CreateQuizCommand>
    {
        public Validator()
        {
            RuleFor(RuleFor => RuleFor.Title).NotEmpty();
            RuleFor(RuleFor => RuleFor.Topic).NotEmpty();
            RuleFor(RuleFor => RuleFor.Difficulty)
                .IsInEnum()
                .NotEmpty();
            RuleFor(RuleFor => RuleFor.NumberOfQuestions)
                .GreaterThan(0)
                .LessThanOrEqualTo(25);
        }
    }

    internal sealed class Handler(
        ApplicationDbContext dbContext,
        ILogger<Handler> logger,
        ICurrentUserService currentUserService,
        IValidator<CreateQuizCommand> validator,
        IQuizCreator quizCreator
        ) : IRequestHandler<CreateQuizCommand, Result<CreateQuizResponse>>
    {
        
        public async Task<Result<CreateQuizResponse>> Handle(CreateQuizCommand request, CancellationToken cancellationToken)
        {

            logger.LogInformation("Creating new quiz");

            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                return Result.Failure<CreateQuizResponse>(
                    Error.Validation(validationResult.ToString()));
            }
            var userId = Guid.Parse(currentUserService.UserId!);

            var quiz = new Quiz
            {
                Title = request.Title,
                Topic = request.Topic,
                Difficulty = request.Difficulty,
                NumberOfQuestions = request.NumberOfQuestions,
                UserId = userId
            };

            try
            {
                var completion = await quizCreator.CreateQuizAsync(new 
                    CreateQuizRequest(request.Topic, (int)request.Difficulty, request.NumberOfQuestions));

                var questions = QuestionsMapper.DeserializeQuestions(completion);

                quiz.Questions = questions;

                await dbContext.Quizzes.AddAsync(quiz);

                await dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                logger.LogError("Error while asking OpenAI API.");

                return Result.Failure<CreateQuizResponse>(
                   Error.ThirdPartyReqeustError("Error while asking OpenAI API."));

            }

            logger.LogInformation("Quiz created");

            return Result.Success(new CreateQuizResponse(quiz.Id));

        }
    }
}
