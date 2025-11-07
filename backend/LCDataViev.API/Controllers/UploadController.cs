using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/uploads")]
    [Authorize] // Sadece yetkili kullanıcılar dosya yükleyebilir
    public class UploadController : ControllerBase
    {
        private readonly ILogger<UploadController> _logger;
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private static readonly long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        public UploadController(ILogger<UploadController> logger)
        {
            _logger = logger;
        }

        [HttpPost("product-image")]
        [Authorize(Roles = "user")]
        [RequestSizeLimit(5 * 1024 * 1024)] // 5 MB
        public async Task<IActionResult> UploadProductImage([FromForm] IFormFile file, [FromForm] int storeId, [FromForm] string? category)
        {
            try
            {
                // ModelState validation'ı ignore et
                ModelState.Clear();
                
                // Token'daki storeId ile istek storeId'si eşleşmeli
                var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
                if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
                {
                    return Forbid();
                }
                if (storeId != userStoreId)
                {
                    return Forbid();
                }
                
                // Dosya varlık kontrolü
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Dosya bulunamadı");
                }

                // Dosya boyutu kontrolü
                if (file.Length > MaxFileSize)
                {
                    return BadRequest($"Dosya boyutu {MaxFileSize / (1024 * 1024)}MB'dan büyük olamaz");
                }

                // Dosya türü kontrolü
                if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("Sadece görsel dosyalar yüklenebilir");
                }

                // Dosya uzantısı kontrolü
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
                {
                    return BadRequest($"Geçersiz dosya uzantısı. İzin verilen uzantılar: {string.Join(", ", AllowedExtensions)}");
                }

                // Store ID validasyonu
                if (storeId <= 0)
                {
                    return BadRequest("Geçersiz mağaza ID'si");
                }

                // Güvenli dosya adı oluştur
                var safeFileName = GenerateSafeFileName(file.FileName);
                var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products", storeId.ToString());
                
                // Klasör oluştur
                Directory.CreateDirectory(uploadsRoot);

                var filePath = Path.Combine(uploadsRoot, safeFileName);

                // Dosya yükleme
                await using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }

                // Dosya bütünlüğü kontrolü (basit)
                if (!System.IO.File.Exists(filePath) || new FileInfo(filePath).Length == 0)
                {
                    return BadRequest("Dosya yükleme başarısız");
                }

                var relativeUrl = $"/images/products/{storeId}/{safeFileName}";
                
                _logger.LogInformation($"Product image uploaded successfully: {relativeUrl}");
                
                return Ok(new { imageUrl = relativeUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading product image");
                return StatusCode(500, "Dosya yükleme sırasında bir hata oluştu");
            }
        }

        private string GenerateSafeFileName(string originalFileName)
        {
            // Güvenli dosya adı oluştur
            var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var randomBytes = new byte[8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            var randomString = Convert.ToHexString(randomBytes).ToLowerInvariant();
            
            return $"product_{timestamp}_{randomString}{extension}";
        }
    }
}


