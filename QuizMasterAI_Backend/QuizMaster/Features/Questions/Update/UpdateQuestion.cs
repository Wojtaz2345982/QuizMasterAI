using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Common.Interfaces;
using QuizMaster.Common.ReturnTypes;
using QuizMaster.Domain.Entities;
using QuizMaster.Infrastructure.Persistence;

namespace QuizMaster.Features.Questions.Update;

public class UpdateQuestionEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/questions/{questionId:int}", async (int questionId, UpdateQuestion.UpdateQuestionCommand command, ISender sender) =>
        {
            if (questionId != command.Id)
                return Results.BadRequest("Mismatched question ID.");

            var result = await sender.Send(command);

            return result.IsSuccess
                ? Results.Ok()
                : Results.BadRequest(result.Error);
        })
        .RequireAuthorization()
        .WithTags("Questions");
    }
}

public static class UpdateQuestion
{
    public record UpdateQuestionCommand(
        int Id,
        string Text,
        ICollection<UpdateAnswerDto> Answers
    ) : IRequest<Result<UpdateQuestionResponse>>;

    public record UpdateAnswerDto(string Text, bool IsCorrect);

    public record UpdateQuestionResponse(int Id);

    public class Validator : AbstractValidator<UpdateQuestionCommand>
    {
        public Validator()
        {
            RuleFor(q => q.Text).NotEmpty();
            RuleFor(q => q.Answers)
                .NotEmpty()
                .Must(answers => answers.Count(a => a.IsCorrect) == 1)
                .WithMessage("Exactly one answer must be marked as correct.");
        }
    }

    internal sealed class Handler(
        ApplicationDbContext dbContext,
        ILogger<Handler> logger,
        IValidator<UpdateQuestionCommand> validator,
        ICurrentUserService currentUserService
    ) : IRequestHandler<UpdateQuestionCommand, Result<UpdateQuestionResponse>>
    {
        public async Task<Result<UpdateQuestionResponse>> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation($"Updating question with ID {request.Id}.");

            var userId = Guid.Parse(currentUserService.UserId!);

            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
                return Result.Failure<UpdateQuestionResponse>(
                    Error.Validation(validationResult.ToString()));

            var question = await dbContext.Questions
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == request.Id, cancellationToken);

            var quiz = await dbContext.Quizzes
                .FirstOrDefaultAsync(q => q.Questions.Any(q => q.Id == request.Id), cancellationToken);

            if (question is null || quiz is null)
            {
                return Result.Failure<UpdateQuestionResponse>(
                    Error.NotFound($"Question with ID {request.Id} not found or you have no access."));

            }
           
            question.Text = request.Text;
         
            dbContext.Answers.RemoveRange(question.Answers);

            var newAnswers = request.Answers.Adapt<ICollection<Answer>>();

            question.Answers = newAnswers;

            await dbContext.SaveChangesAsync(cancellationToken);

            return Result.Success(new UpdateQuestionResponse(question.Id));

        }
    }
}