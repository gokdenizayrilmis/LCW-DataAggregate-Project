using Microsoft.AspNetCore.Mvc;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/uploads")]
    public class UploadController : ControllerBase
    {
        [HttpPost("product-image")]
        [RequestSizeLimit(20_000_000)] // 20 MB
        public async Task<IActionResult> UploadProductImage([FromForm] IFormFile file, [FromForm] int storeId, [FromForm] string? category)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Dosya bulunamadı");
            }

            if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Sadece görsel dosyalar yüklenebilir");
            }

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products", storeId.ToString());
            Directory.CreateDirectory(uploadsRoot);

            var extension = Path.GetExtension(file.FileName);
            var safeExtension = string.IsNullOrWhiteSpace(extension) ? ".jpg" : extension;
            var fileName = $"{Guid.NewGuid():N}{safeExtension}";
            var filePath = Path.Combine(uploadsRoot, fileName);

            await using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/images/products/{storeId}/{fileName}";
            return Ok(new { imageUrl = relativeUrl });
        }
    }
}


