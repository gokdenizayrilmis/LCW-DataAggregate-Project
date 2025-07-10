using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;
using System.ComponentModel.DataAnnotations;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreController : ControllerBase
    {
        private readonly IStoreRepository _storeRepository;
        private readonly ILogger<StoreController> _logger;

        public StoreController(IStoreRepository storeRepository, ILogger<StoreController> logger)
        {
            _storeRepository = storeRepository;
            _logger = logger;
        }

        // GET: api/store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreListResponseDto>>> GetStores()
        {
            try
            {
                var stores = await _storeRepository.GetAllAsync();
                var response = stores.Select(s => new StoreListResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address,
                    Phone = s.Phone,
                    Email = s.Email,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all stores");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/store/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<StoreListResponseDto>>> GetActiveStores()
        {
            try
            {
                var stores = await _storeRepository.GetActiveStoresAsync();
                var response = stores.Select(s => new StoreListResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address,
                    Phone = s.Phone,
                    Email = s.Email,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active stores");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/store/search?name={name}
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<StoreListResponseDto>>> SearchStores([FromQuery] string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                {
                    return BadRequest("Name parameter is required");
                }

                var stores = await _storeRepository.GetStoresByNameAsync(name);
                var response = stores.Select(s => new StoreListResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address,
                    Phone = s.Phone,
                    Email = s.Email,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching stores by name: {Name}", name);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/store/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreResponseDto>> GetStore(int id)
        {
            try
            {
                var store = await _storeRepository.GetStoreWithDetailsAsync(id);
                if (store == null)
                {
                    return NotFound($"Store with ID {id} not found");
                }

                var response = new StoreResponseDto
                {
                    Id = store.Id,
                    Name = store.Name,
                    Address = store.Address,
                    Phone = store.Phone,
                    Email = store.Email,
                    IsActive = store.IsActive,
                    CreatedAt = store.CreatedAt,
                    UpdatedAt = store.UpdatedAt,
                    UserCount = store.Users.Count,
                    SaleCount = store.Sales.Count,
                    ReturnCount = store.Returns.Count,
                    InventoryCount = store.Inventories.Count
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting store with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/store
        [HttpPost]
        public async Task<ActionResult<StoreResponseDto>> CreateStore(CreateStoreDto createStoreDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var store = new Store
                {
                    Name = createStoreDto.Name,
                    Address = createStoreDto.Address,
                    Phone = createStoreDto.Phone,
                    Email = createStoreDto.Email,
                    IsActive = createStoreDto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdStore = await _storeRepository.AddAsync(store);

                var response = new StoreResponseDto
                {
                    Id = createdStore.Id,
                    Name = createdStore.Name,
                    Address = createdStore.Address,
                    Phone = createdStore.Phone,
                    Email = createdStore.Email,
                    IsActive = createdStore.IsActive,
                    CreatedAt = createdStore.CreatedAt,
                    UpdatedAt = createdStore.UpdatedAt,
                    UserCount = 0,
                    SaleCount = 0,
                    ReturnCount = 0,
                    InventoryCount = 0
                };

                return CreatedAtAction(nameof(GetStore), new { id = createdStore.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating store");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/store/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStore(int id, UpdateStoreDto updateStoreDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingStore = await _storeRepository.GetByIdAsync(id);
                if (existingStore == null)
                {
                    return NotFound($"Store with ID {id} not found");
                }

                existingStore.Name = updateStoreDto.Name;
                existingStore.Address = updateStoreDto.Address;
                existingStore.Phone = updateStoreDto.Phone;
                existingStore.Email = updateStoreDto.Email;
                existingStore.IsActive = updateStoreDto.IsActive;
                existingStore.UpdatedAt = DateTime.UtcNow;

                await _storeRepository.UpdateAsync(existingStore);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating store with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/store/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            try
            {
                var store = await _storeRepository.GetByIdAsync(id);
                if (store == null)
                {
                    return NotFound($"Store with ID {id} not found");
                }

                await _storeRepository.DeleteAsync(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting store with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/store/count/active
        [HttpGet("count/active")]
        public async Task<ActionResult<int>> GetActiveStoreCount()
        {
            try
            {
                var count = await _storeRepository.GetStoreCountByStatusAsync(true);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active store count");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/store/count/inactive
        [HttpGet("count/inactive")]
        public async Task<ActionResult<int>> GetInactiveStoreCount()
        {
            try
            {
                var count = await _storeRepository.GetStoreCountByStatusAsync(false);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting inactive store count");
                return StatusCode(500, "Internal server error");
            }
        }
    }
} 