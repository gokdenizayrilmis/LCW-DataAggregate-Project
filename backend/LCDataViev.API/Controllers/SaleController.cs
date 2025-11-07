using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SaleController : ControllerBase
    {
        private readonly ISaleRepository _saleRepository;
        private readonly ILogger<SaleController> _logger;

        public SaleController(ISaleRepository saleRepository, ILogger<SaleController> logger)
        {
            _saleRepository = saleRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sale>>> GetAll()
        {
            try
            {
                var sales = await _saleRepository.GetAllAsync();
                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all sales");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sale>> GetById(int id)
        {
            try
            {
                var sale = await _saleRepository.GetByIdAsync(id);
                if (sale == null)
                {
                    return NotFound();
                }
                return Ok(sale);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sale with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Sale/store/5
        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<Sale>>> GetSalesByStore(int storeId)
        {
            try
            {
                var sales = await _saleRepository.GetSalesByStoreAsync(storeId);
                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sales for store ID: {StoreId}", storeId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<Sale>> Create(Sale sale)
        {
            try
            {
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (sale.StoreId != userStoreId)
                {
                    return Forbid();
                }
                await _saleRepository.AddAsync(sale);
                return CreatedAtAction(nameof(GetById), new { id = sale.Id }, sale);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sale");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Update(int id, Sale sale)
        {
            if (id != sale.Id)
            {
                return BadRequest();
            }

            try
            {
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (sale.StoreId != userStoreId)
                {
                    return Forbid();
                }
                await _saleRepository.UpdateAsync(sale);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating sale with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var sale = await _saleRepository.GetByIdAsync(id);
                if (sale == null)
                {
                    return NotFound();
                }

                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (sale.StoreId != userStoreId)
                {
                    return Forbid();
                }

                await _saleRepository.DeleteAsync(sale);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting sale with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}