using MomentumCash.Domain.Entities;
using MomentumCash.Domain.Enums;
using MomentumCash.Domain.Interfaces;
using MomentumCash.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MomentumCash.Infrastructure.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Categories.FindAsync([id], cancellationToken);
    }

    public async Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Category>> GetByTypeAsync(TransactionTypeEnum type, CancellationToken cancellationToken = default)
    {
        return await _context.Categories
            .Where(c => c.Type == type)
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
    }

    public void Add(Category category)
    {
        _context.Categories.Add(category);
    }
}
