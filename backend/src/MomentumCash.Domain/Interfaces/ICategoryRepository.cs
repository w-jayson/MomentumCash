using MomentumCash.Domain.Entities;
using MomentumCash.Domain.Enums;

namespace MomentumCash.Domain.Interfaces;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Category>> GetByTypeAsync(TransactionTypeEnum type, CancellationToken cancellationToken = default);
    void Add(Category category);
}
