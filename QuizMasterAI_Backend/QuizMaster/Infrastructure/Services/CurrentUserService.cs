using QuizMaster.Common.Interfaces;
using System.Security.Claims;

namespace QuizMaster.Infrastructure.Services;

public class CurrentUserService(
    IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string? UserId => httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier);
}
