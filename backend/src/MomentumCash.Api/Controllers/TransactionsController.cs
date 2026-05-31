using MomentumCash.Application.DTOs;
using MomentumCash.Application.Services;
using MomentumCash.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace MomentumCash.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TransactionsController : ControllerBase
{
    private readonly TransactionService _service;
    private readonly AppDbContext _context;

    public TransactionsController(TransactionService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create([FromBody] CreateTransactionDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(dto, ct);
        await _context.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetAll(CancellationToken ct)
    {
        var result = await _service.GetDashboardAsync(ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransactionDto>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TransactionDto>> Update(Guid id, [FromBody] UpdateTransactionDto dto, CancellationToken ct)
    {
        var result = await _service.UpdateAsync(id, dto, ct);
        if (result is null)
            return NotFound();

        await _context.SaveChangesAsync(ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _service.DeleteAsync(id, ct);
        if (!deleted)
            return NotFound();

        await _context.SaveChangesAsync(ct);
        return NoContent();
    }
}
