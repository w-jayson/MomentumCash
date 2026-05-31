using MomentumCash.Application.Services;
using MomentumCash.Domain.Interfaces;
using MomentumCash.Infrastructure.Data;
using MomentumCash.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace MomentumCash.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMomentumCashServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<TransactionService>();
        services.AddScoped<CategoryService>();

        return services;
    }
}
