using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Common.Interfaces;
using QuizMaster.Common.ReturnTypes;
using QuizMaster.Infrastructure.Persistence;

namespace QuizMaster.Features.Quizzes.Update;

public class UpdateTitleEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("/quizzes/{quizId:int}/title", async(int quizId, [FromBody] UpdateTitle.UpdateTitleRequest request , ISender sender) =>
        {
            var result = await sender.Send(new UpdateTitle.UpdateTitleCommand(quizId, request.Title));

            return result.IsSuccess
                ? Results.NoContent()
                : Results.BadRequest(result.Error);
        })
        .RequireAuthorization()
        .WithTags("Quizzes");
    }
}


public static class UpdateTitle
{
    public record UpdateTitleRequest(string Title);
    public record UpdateTitleCommand(int QuizId, string Title) : IRequest<Result>;

    public class Validator : AbstractValidator<UpdateTitleCommand>
    {
        public Validator()
        {
            RuleFor(x => x.QuizId)
                .GreaterThan(0);

            RuleFor(x => x.Title)
                .NotEmpty();
        }
    }

    internal sealed class Handler(
        IValidator<UpdateTitleCommand> validator,
        ApplicationDbContext dbContext,
        ICurrentUserService currentUserService) : IRequestHandler<UpdateTitleCommand, Result>
    {
        public async Task<Result> Handle(UpdateTitleCommand request, CancellationToken cancellationToken)
        {

            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                return Result.Failure(
                    Error.Validation(validationResult.ToString()));
            }

            var userId = Guid.Parse(currentUserService.UserId!);

            var quiz = await dbContext.Quizzes
                .FirstOrDefaultAsync(q => q.Id == request.QuizId && q.UserId == userId, cancellationToken);

            if (quiz is null)
            {
                return Result.Failure(Error
                    .NotFound("Quiz not found or You have no access to this quiz."));
            }

            quiz.Title = request.Title;

            await dbContext.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
