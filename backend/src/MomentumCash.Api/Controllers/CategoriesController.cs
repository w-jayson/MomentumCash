using MomentumCash.Application.DTOs;
using MomentumCash.Application.Services;
using MomentumCash.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace MomentumCash.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CategoriesController : ControllerBase
{
    private readonly CategoryService _service;
    private readonly AppDbContext _context;

    public CategoriesController(CategoryService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetAll(CancellationToken ct)
    {
        var result = await _service.GetAllAsync(ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(dto, ct);
        await _context.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetAll), result);
    }
}
