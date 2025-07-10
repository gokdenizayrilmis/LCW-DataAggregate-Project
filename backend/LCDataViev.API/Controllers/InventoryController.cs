using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryRepository _inventoryRepository;
        private readonly IStoreRepository _storeRepository;
        private readonly ILogger<InventoryController> _logger;

        public InventoryController(IInventoryRepository inventoryRepository, IStoreRepository storeRepository, ILogger<InventoryController> logger)
        {
            _inventoryRepository = inventoryRepository;
            _storeRepository = storeRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryResponseDto>>> GetInventories()
        {
            var inventories = await _inventoryRepository.GetAllAsync();
            var response = inventories.Select(i => new InventoryResponseDto
            {
                Id = i.Id,
                StoreId = i.StoreId,
                StoreName = i.Store?.Name,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<InventoryResponseDto>>> GetInventoriesByStore(int storeId)
        {
            var inventories = await _inventoryRepository.GetInventoriesByStoreIdAsync(storeId);
            var response = inventories.Select(i => new InventoryResponseDto
            {
                Id = i.Id,
                StoreId = i.StoreId,
                StoreName = i.Store?.Name,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryResponseDto>> GetInventory(int id)
        {
            var inventory = await _inventoryRepository.GetInventoryWithDetailsAsync(id);
            if (inventory == null)
                return NotFound();
            var response = new InventoryResponseDto
            {
                Id = inventory.Id,
                StoreId = inventory.StoreId,
                StoreName = inventory.Store?.Name,
                ProductName = inventory.ProductName,
                Quantity = inventory.Quantity,
                CreatedAt = inventory.CreatedAt,
                UpdatedAt = inventory.UpdatedAt
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<InventoryResponseDto>> CreateInventory(CreateInventoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
            var inventory = new Inventory
            {
                StoreId = dto.StoreId,
                ProductName = dto.ProductName,
                Quantity = dto.Quantity,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var created = await _inventoryRepository.AddAsync(inventory);
            var response = new InventoryResponseDto
            {
                Id = created.Id,
                StoreId = created.StoreId,
                StoreName = store.Name,
                ProductName = created.ProductName,
                Quantity = created.Quantity,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };
            return CreatedAtAction(nameof(GetInventory), new { id = created.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventory(int id, UpdateInventoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var inventory = await _inventoryRepository.GetByIdAsync(id);
            if (inventory == null)
                return NotFound();
            var store = await _storeRepository.GetByIdAsync(dto.StoreId);
            if (store == null)
                return BadRequest("Store not found");
            inventory.StoreId = dto.StoreId;
            inventory.ProductName = dto.ProductName;
            inventory.Quantity = dto.Quantity;
            inventory.UpdatedAt = DateTime.UtcNow;
            await _inventoryRepository.UpdateAsync(inventory);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            var inventory = await _inventoryRepository.GetByIdAsync(id);
            if (inventory == null)
                return NotFound();
            await _inventoryRepository.DeleteAsync(id);
            return NoContent();
        }
    }
} 