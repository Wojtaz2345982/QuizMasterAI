using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Common.Interfaces;
using QuizMaster.Common.ReturnTypes;
using QuizMaster.Infrastructure.Persistence;

namespace QuizMaster.Features.Questions.Delete;

public class DeleteQuestionEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/questions/{questionId:int}", async (int questionId, ISender sender) =>
        {
            var result = await sender.Send(new DeleteQuestion.DeleteQuestionCommand(questionId));

            return result.IsSuccess
                ? Results.NoContent()
                : Results.BadRequest(result.Error);
        })
        .RequireAuthorization()
        .WithTags("Questions");
    }
}

public static class DeleteQuestion
{
    public record DeleteQuestionCommand(int Id) : IRequest<Result>;

    public class Validator : AbstractValidator<DeleteQuestionCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
        }
    }

    internal sealed class Handler(
        IValidator<DeleteQuestionCommand> validator,
        ApplicationDbContext dbContext) : IRequestHandler<DeleteQuestionCommand, Result>
    {
        public async Task<Result> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                return Result.Failure(
                    Error.Validation(validationResult.ToString()));
            }

            var question = await dbContext.Questions
                .FirstOrDefaultAsync(q => q.Id == request.Id, cancellationToken);

            var quiz = await dbContext.Quizzes
                .FirstOrDefaultAsync(q => q.Questions.Any(q => q.Id == request.Id), cancellationToken);

            if(quiz is null || question is null)
            {
                return Result.Failure(Error.NotFound("Question not found or You have no access to this question."));
            }

            dbContext.Questions.Remove(question);

            await dbContext.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
