using MomentumCash.Application.DTOs;
using MomentumCash.Domain.Entities;
using MomentumCash.Domain.Interfaces;

namespace MomentumCash.Application.Services;

public sealed class CategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken ct = default)
    {
        var categories = await _repository.GetAllAsync(ct);
        return categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList();
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken ct = default)
    {
        var category = new Category(dto.Name);
        _repository.Add(category);
        return new CategoryDto(category.Id, category.Name);
    }
}
