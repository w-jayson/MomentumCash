using System.ComponentModel.DataAnnotations;

namespace MomentumCash.Application.DTOs;

public record CreateCategoryDto(
    string Name,
    [property: Range(1, 2)] int Type
);
