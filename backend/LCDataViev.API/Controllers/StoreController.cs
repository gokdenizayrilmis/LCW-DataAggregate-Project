using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Repositories;
using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.DTOs;
using System.ComponentModel.DataAnnotations;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.Extensions.DependencyInjection;

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
        private readonly IProductRepository _productRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ISaleRepository _saleRepository;
        private readonly IReturnRepository _returnRepository;
        private readonly IWeeklySaleRepository _weeklySaleRepository;
        private readonly ILogger<StoreController> _logger;

        public StoreController(
            IStoreRepository storeRepository, 
            IUserRepository userRepository, 
            INotificationRepository notificationRepository, 
            IInventoryRepository inventoryRepository,
            IProductRepository productRepository,
            IEmployeeRepository employeeRepository,
            ISaleRepository saleRepository,
            IReturnRepository returnRepository,
            IWeeklySaleRepository weeklySaleRepository,
            ILogger<StoreController> logger)
        {
            _storeRepository = storeRepository;
            _userRepository = userRepository;
            _notificationRepository = notificationRepository;
            _inventoryRepository = inventoryRepository;
            _productRepository = productRepository;
            _employeeRepository = employeeRepository;
            _saleRepository = saleRepository;
            _returnRepository = returnRepository;
            _weeklySaleRepository = weeklySaleRepository;
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
                _logger.LogInformation($"Creating user for store: {createStoreDto.Name}, Email: {createStoreDto.Email}");
                _logger.LogInformation($"Generated password hash for verification");
                
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

                var createdUser = await _userRepository.AddAsync(user);
                _logger.LogInformation($"✅ Successfully created user: ID={createdUser.Id}, Email={createdUser.Email}, StoreId={createdUser.StoreId}");

                // Otomatik veri ekleme kaldırıldı: Çalışan/Ürün vb. manuel eklenecek

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
                    InventoryCount = 0,
                    UserEmail = createdUser.Email,
                    TempPassword = createStoreDto.Password // Sadece create işleminde döndür
                };

                return CreatedAtAction(nameof(GetStore), new { id = createdStore.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating store: {StoreName}", createStoreDto.Name);
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

                // Güvenli silme işlemi - ForceDeleteStoreAsync kullan
                var deletedCount = await _storeRepository.ForceDeleteStoreAsync(id);
                
                _logger.LogInformation($"Successfully deleted store: {store.Name} (ID: {id}) - {deletedCount} records deleted");

                return Ok(new { 
                    message = $"Mağaza başarıyla silindi: {store.Name}",
                    deletedRecords = deletedCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting store with ID: {Id}", id);
                return StatusCode(500, new { 
                    message = "Mağaza silinirken bir hata oluştu",
                    error = ex.Message 
                });
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

        // POST: api/stores/fix-product-codes - ÜRÜN KODLARINI DÜZELT (SADECE ADMIN)
        [HttpPost("fix-product-codes")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> FixProductCodes()
        {
            try
            {
                _logger.LogInformation("ADMIN: Starting to fix product codes");
                
                var productRepository = HttpContext.RequestServices.GetRequiredService<IProductRepository>();
                var allProducts = await productRepository.GetAllAsync();
                
                var fixedCount = 0;
                foreach (var product in allProducts)
                {
                    // Yanlış format: T07001 -> Doğru format: T1001
                    if (product.Code.Length == 6 && product.Code[1] == '0' && product.Code[2] == '7')
                    {
                        var newCode = product.Code.Substring(0, 1) + "100" + product.Code.Substring(5, 1);
                        product.Code = newCode;
                        
                        // Kategori isimlerini düzelt
                        var categoryMap = new Dictionary<string, string>
                        {
                            ["Tişört"] = "tisort",
                            ["Pantolon"] = "pantolon", 
                            ["Ayakkabı"] = "ayakkabi",
                            ["Hırka"] = "hirka",
                            ["Gömlek"] = "gomlek",
                            ["Şort"] = "sort"
                        };
                        
                        var categoryFolder = categoryMap.ContainsKey(product.Category) 
                            ? categoryMap[product.Category] 
                            : product.Category.ToLower();
                            
                        product.ImageUrl = $"/images/products/{categoryFolder}/{newCode}.jpg";
                        await productRepository.UpdateAsync(product);
                        fixedCount++;
                        _logger.LogInformation($"Fixed product code: {product.Name} -> {newCode}, category: {product.Category} -> {categoryFolder}");
                    }
                }
                
                _logger.LogInformation($"ADMIN: Fixed {fixedCount} product codes");
                
                return Ok(new { 
                    message = $"{fixedCount} ürün kodu düzeltildi", 
                    fixedCount = fixedCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fixing product codes");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/stores/force-delete/{id} - MAĞAZAYI ZORLA SİL (SADECE ADMIN)
        [HttpDelete("force-delete/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ForceDeleteStore(int id)
        {
            try
            {
                _logger.LogWarning($"🔍 ADMIN: Force delete request received for store ID: {id}");
                
                // Foreign key kontrolünü geçici olarak devre dışı bırak
                _logger.LogInformation("🔍 Disabling foreign key constraints");
                await _storeRepository.ExecuteRawSqlAsync("PRAGMA foreign_keys = OFF;");
                
                // Tüm bağlı kayıtları sil
                _logger.LogInformation($"🔍 Deleting related records for store ID: {id}");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Inventories WHERE StoreId = {id};");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Products WHERE StoreId = {id};");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Employees WHERE StoreId = {id};");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Sales WHERE StoreId = {id};");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Returns WHERE StoreId = {id};");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM WeeklySales WHERE StoreId = {id};");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Users WHERE StoreId = {id};");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Notifications WHERE StoreId = {id};");
                
                // Son olarak mağazayı sil
                _logger.LogInformation($"🔍 Deleting store ID: {id}");
                await _storeRepository.ExecuteRawSqlAsync($"DELETE FROM Stores WHERE Id = {id};");
                
                // Foreign key kontrolünü tekrar aç
                _logger.LogInformation("🔍 Re-enabling foreign key constraints");
                await _storeRepository.ExecuteRawSqlAsync("PRAGMA foreign_keys = ON;");
                
                _logger.LogWarning($"✅ ADMIN: Successfully force deleted store ID: {id}");
                
                return Ok(new { 
                    message = $"Mağaza ID {id} zorla silindi", 
                    deletedStoreId = id,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error force deleting store with ID: {Id}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // DELETE: api/stores/clear-all - TÜM MAĞAZALARI SİL (SADECE ADMIN)
        [HttpDelete("clear-all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ClearAllStores()
        {
            try
            {
                _logger.LogWarning("ADMIN: Starting to clear ALL stores from database");
                
                // Tüm mağazaları al
                var allStores = await _storeRepository.GetAllAsync();
                var storeCount = allStores.Count();
                
                if (storeCount == 0)
                {
                    return Ok(new { message = "Veritabanında silinecek mağaza bulunamadı", deletedCount = 0 });
                }

                _logger.LogWarning($"ADMIN: Found {storeCount} stores to delete");

                // Her mağaza için cascade silme işlemi
                foreach (var store in allStores)
                {
                    try
                    {
                        // 1. Mağazaya bağlı inventory kayıtlarını sil
                        var inventories = await _inventoryRepository.GetInventoriesByStoreIdAsync(store.Id);
                        foreach (var inventory in inventories)
                        {
                            await _inventoryRepository.DeleteAsync(inventory);
                        }

                        // 2. Mağazaya bağlı kullanıcıları sil
                        var users = await _userRepository.GetUsersByStoreIdAsync(store.Id);
                        foreach (var user in users)
                        {
                            await _userRepository.DeleteAsync(user);
                        }

                        // 3. Mağazayı sil
                        await _storeRepository.DeleteAsync(store.Id);
                        
                        _logger.LogInformation($"Successfully deleted store: {store.Name} (ID: {store.Id})");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error deleting store: {store.Name} (ID: {store.Id})");
                        // Hata durumunda diğer mağazaları silmeye devam et
                    }
                }

                _logger.LogWarning($"ADMIN: Successfully cleared {storeCount} stores from database");
                
                return Ok(new { 
                    message = $"Tüm mağazalar başarıyla silindi", 
                    deletedCount = storeCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing all stores");
                return StatusCode(500, "Internal server error");
            }
        }

        // Otomatik varsayılan veri ekleme metodları kaldırıldı
    }
}