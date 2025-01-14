using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using QuizMaster.Common.Interfaces;
using QuizMaster.Features.Quizzes.Create;
using QuizMaster.Infrastructure.Persistence;
using QuizMaster.Infrastructure.Services;
using System.Reflection;

namespace QuizMaster;

public static class ConfigureServices
{
    public static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IQuizCreator, QuizCreator>();
        services.AddHttpContextAccessor();
        var assembly = Assembly.GetExecutingAssembly();
        services.AddMediatR(config => config.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);
    }

    public static IServiceCollection AddEndpoints(
      this IServiceCollection services,
      Assembly assembly)
    {
        ServiceDescriptor[] serviceDescriptors = assembly
            .DefinedTypes
            .Where(type => type is { IsAbstract: false, IsInterface: false } &&
                           type.IsAssignableTo(typeof(IEndpoint)))
            .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type))
            .ToArray();

        services.TryAddEnumerable(serviceDescriptors);

        return services;
    }

    public static void AddAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthorization();

        var bytes = System.Text.Encoding.UTF8.GetBytes(configuration["JWTSecretKey"]!);

        services.AddAuthentication().AddJwtBearer(opt =>
        {
            opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(bytes),
                ValidAudience = configuration["Auth:ValidAudience"],
                ValidIssuer = configuration["Auth:ValidIssuer"],
            };
        });
    }
}
