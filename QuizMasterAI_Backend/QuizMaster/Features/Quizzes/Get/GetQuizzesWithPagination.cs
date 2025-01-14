using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Common.Interfaces;
using QuizMaster.Common.Mappers;
using QuizMaster.Common.Models;
using QuizMaster.Common.ReturnTypes;
using QuizMaster.Domain.Entities;
using QuizMaster.Infrastructure.Persistence;

namespace QuizMaster.Features.Quizzes.Get;

public class GetQuizzesWithPaginationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/quizzes", async (ISender sender, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10) =>
        {
            var result = await sender.Send(new GetQuizzesWithPagination.GetQuizzesWithPaginationQuery(pageNumber, pageSize));

            return result.IsSuccess
                ? Results.Ok(result.Value)
                : Results.BadRequest(result.Error);
        })
        .RequireAuthorization()
        .WithTags("Quizzes");
    }
}

public static class GetQuizzesWithPagination
{
    public record GetQuizzesWithPaginationQuery(int PageNumber = 1, int PageSize = 10) : IRequest<Result<PaginatedList<GetQuizzesResponse>>>;

    public record GetQuizzesResponse(int Id, string Title, string Topic, Difficulty Difficulty, int NumberOfQuestions);

    public class Validator : AbstractValidator<GetQuizzesWithPaginationQuery>
    {
        public Validator()
        {
            RuleFor(x => x.PageNumber)
           .GreaterThanOrEqualTo(1).WithMessage("PageNumber at least greater than or equal to 1.");

            RuleFor(x => x.PageSize)
                .GreaterThanOrEqualTo(1).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }

    internal sealed class Handler(
        ApplicationDbContext dbContext,
        IValidator<GetQuizzesWithPaginationQuery> validator,
        ICurrentUserService currentUserService) : IRequestHandler<GetQuizzesWithPaginationQuery, Result<PaginatedList<GetQuizzesResponse>>>
    {
        public async Task<Result<PaginatedList<GetQuizzesResponse>>> Handle(GetQuizzesWithPaginationQuery request, CancellationToken cancellationToken)
        {

            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                return Result.Failure<PaginatedList<GetQuizzesResponse>>(
                    Error.Validation(validationResult.ToString()));
            }

            var userId = Guid.Parse(currentUserService.UserId!);

            var quizzez = await dbContext.Quizzes
                .AsNoTracking()
                .Where(q => q.UserId == userId)
                .Select(q => new GetQuizzesResponse(q.Id, q.Title, q.Topic, q.Difficulty, q.NumberOfQuestions))
                .PaginatedListAsync(request.PageNumber, request.PageSize);

            return Result.Success(quizzez);
        }
    }
}

