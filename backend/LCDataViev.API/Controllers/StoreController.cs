using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;
using System.ComponentModel.DataAnnotations;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/stores")]
    public class StoreController : ControllerBase
    {
        private readonly IStoreRepository _storeRepository;
        private readonly IUserRepository _userRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IInventoryRepository _inventoryRepository;
        private readonly ILogger<StoreController> _logger;

        public StoreController(IStoreRepository storeRepository, IUserRepository userRepository, INotificationRepository notificationRepository, IInventoryRepository inventoryRepository, ILogger<StoreController> logger)
        {
            _storeRepository = storeRepository;
            _userRepository = userRepository;
            _notificationRepository = notificationRepository;
            _inventoryRepository = inventoryRepository;
            _logger = logger;
        }

        // GET: api/stores
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
                    IsDomestic = s.IsDomestic,
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

        // GET: api/stores/active
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
                    IsDomestic = s.IsDomestic,
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

        // GET: api/stores/search?name={name}
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
                    IsDomestic = s.IsDomestic,
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

        // GET: api/stores/{id}
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
                    IsDomestic = store.IsDomestic,
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

        // POST: api/stores
        [HttpPost]
        [Authorize(Roles = "admin")]
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
                    IsDomestic = createStoreDto.IsDomestic,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdStore = await _storeRepository.AddAsync(store);

                // Mağaza ile birlikte kullanıcı oluştur
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(createStoreDto.Password);
                _logger.LogInformation($"Creating user for store: {createStoreDto.Name}, Email: {createStoreDto.Email}, Password: {createStoreDto.Password}, Hash: {passwordHash}");
                
                var user = new User
                {
                    Username = createStoreDto.Name,
                    Name = createStoreDto.Name,
                    Surname = "Yetkili",
                    Email = createStoreDto.Email ?? string.Empty,
                    PasswordHash = passwordHash,
                    Role = LCDataViev.API.Models.Enums.UserRole.User,
                    StoreId = createdStore.Id,
                    IsActive = createStoreDto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _userRepository.AddAsync(user);

                // Bildirim ekle
                await _notificationRepository.AddAsync(new Notification {
                    Message = $"Yeni mağaza eklendi: {createdStore.Name}",
                    Type = "Success",
                    StoreId = createdStore.Id,
                    CreatedAt = DateTime.UtcNow
                });

                var response = new StoreResponseDto
                {
                    Id = createdStore.Id,
                    Name = createdStore.Name,
                    Address = createdStore.Address,
                    Phone = createdStore.Phone,
                    Email = createdStore.Email,
                    IsActive = createdStore.IsActive,
                    IsDomestic = createdStore.IsDomestic,
                    CreatedAt = createdStore.CreatedAt,
                    UpdatedAt = createdStore.UpdatedAt,
                    UserCount = 1,
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

        // PUT: api/stores/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
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
                existingStore.IsDomestic = updateStoreDto.IsDomestic;
                existingStore.UpdatedAt = DateTime.UtcNow;

                await _storeRepository.UpdateAsync(existingStore);

                // Şifre güncelleme - sadece şifre girilmişse güncelle
                if (!string.IsNullOrWhiteSpace(updateStoreDto.Password))
                {
                    var user = await _userRepository.GetByEmailAsync(updateStoreDto.Email ?? string.Empty);
                    if (user != null)
                    {
                        // Mevcut kullanıcının şifresini güncelle
                        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateStoreDto.Password);
                        user.UpdatedAt = DateTime.UtcNow;
                        await _userRepository.UpdateAsync(user);
                        _logger.LogInformation($"Updated password for existing user: {user.Email}");
                    }
                    else
                    {
                        // Yeni kullanıcı oluştur
                        var newUser = new User
                        {
                            Username = updateStoreDto.Email?.Split('@')[0] ?? "user",
                            Name = existingStore.Name + " User",
                            Surname = "Kullanıcı",
                            Email = updateStoreDto.Email ?? string.Empty,
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateStoreDto.Password),
                            Role = LCDataViev.API.Models.Enums.UserRole.User,
                            StoreId = existingStore.Id,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        
                        await _userRepository.AddAsync(newUser);
                        _logger.LogInformation($"Created new user for store: {existingStore.Name}, Email: {newUser.Email}");
                    }
                }
                else
                {
                    // Şifre boşsa, sadece kullanıcının var olup olmadığını kontrol et
                    var user = await _userRepository.GetByEmailAsync(updateStoreDto.Email ?? string.Empty);
                    if (user == null)
                    {
                        _logger.LogWarning($"No password provided for store: {existingStore.Name}, but no user exists for email: {updateStoreDto.Email}");
                    }
                }

                // Bildirim ekle
                await _notificationRepository.AddAsync(new Notification {
                    Message = $"Mağaza güncellendi: {existingStore.Name}",
                    Type = "Info",
                    StoreId = existingStore.Id,
                    CreatedAt = DateTime.UtcNow
                });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating store with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/stores/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            try
            {
                var store = await _storeRepository.GetByIdAsync(id);
                if (store == null)
                {
                    return NotFound($"Store with ID {id} not found");
                }

                _logger.LogInformation($"Starting deletion of store: {store.Name} (ID: {id})");

                // Önce mağazaya bağlı inventory kayıtlarını sil
                var inventories = await _inventoryRepository.GetInventoriesByStoreIdAsync(id);
                _logger.LogInformation($"Found {inventories.Count()} inventory records associated with store {id}");
                
                foreach (var inventory in inventories)
                {
                    _logger.LogInformation($"Deleting inventory: {inventory.Product.Name} (ID: {inventory.Id})");
                    await _inventoryRepository.DeleteAsync(inventory);
                }

                // Sonra mağazaya bağlı kullanıcıları sil
                var users = await _userRepository.GetUsersByStoreIdAsync(id);
                _logger.LogInformation($"Found {users.Count()} users associated with store {id}");
                
                foreach (var user in users)
                {
                    _logger.LogInformation($"Deleting user: {user.Name} (ID: {user.Id})");
                    await _userRepository.DeleteAsync(user);
                }

                // Sonra mağazayı sil
                _logger.LogInformation($"Deleting store: {store.Name} (ID: {id})");
                await _storeRepository.DeleteAsync(id);

                // Bildirim ekle
                await _notificationRepository.AddAsync(new Notification {
                    Message = $"Mağaza silindi: {store.Name}",
                    Type = "Error",
                    StoreId = store.Id,
                    CreatedAt = DateTime.UtcNow
                });

                _logger.LogInformation($"Successfully deleted store: {store.Name} (ID: {id})");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting store with ID: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/stores/count/active
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

        // GET: api/stores/count/inactive
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