using MomentumCash.Application.DTOs;
using MomentumCash.Domain.Entities;
using MomentumCash.Domain.Enums;
using MomentumCash.Domain.Interfaces;

namespace MomentumCash.Application.Services;

public sealed class CategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync(int? type = null, CancellationToken ct = default)
    {
        IReadOnlyList<Category> categories;

        if (type.HasValue && Enum.IsDefined(typeof(TransactionTypeEnum), type.Value))
        {
            categories = await _repository.GetByTypeAsync((TransactionTypeEnum)type.Value, ct);
        }
        else
        {
            categories = await _repository.GetAllAsync(ct);
        }

        return categories.Select(c => new CategoryDto(c.Id, c.Name, (int)c.Type)).ToList();
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken ct = default)
    {
        var type = (TransactionTypeEnum)dto.Type;
        var category = new Category(dto.Name, type);
        _repository.Add(category);
        return new CategoryDto(category.Id, category.Name, (int)category.Type);
    }
}
