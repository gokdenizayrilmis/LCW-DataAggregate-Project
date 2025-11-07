using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryRepository _inventoryRepository;

        public InventoryController(IInventoryRepository inventoryRepository)
        {
            _inventoryRepository = inventoryRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetAll()
        {
            try
            {
                var inventories = await _inventoryRepository.GetAllAsync();
                return Ok(inventories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Inventory>> GetById(int id)
        {
            try
            {
                var inventory = await _inventoryRepository.GetByIdAsync(id);
                if (inventory == null)
                {
                    return NotFound();
                }
                return Ok(inventory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<Inventory>> Create(Inventory inventory)
        {
            try
            {
                // Token'dan mağaza kimliğini al ve istek ile eşleştiğini doğrula
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (inventory.StoreId != userStoreId)
                {
                    return Forbid();
                }

                await _inventoryRepository.AddAsync(inventory);
                return CreatedAtAction(nameof(GetById), new { id = inventory.Id }, inventory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Update(int id, Inventory inventory)
        {
            if (id != inventory.Id)
            {
                return BadRequest();
            }

            try
            {
                // Token'dan mağaza kimliğini al ve istek ile eşleştiğini doğrula
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (inventory.StoreId != userStoreId)
                {
                    return Forbid();
                }

                await _inventoryRepository.UpdateAsync(inventory);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var inventory = await _inventoryRepository.GetByIdAsync(id);
                if (inventory == null)
                {
                    return NotFound();
                }

                // Token'dan mağaza kimliği ile kaydın mağaza kimliğini eşleştir
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (inventory.StoreId != userStoreId)
                {
                    return Forbid();
                }

                await _inventoryRepository.DeleteAsync(inventory);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}