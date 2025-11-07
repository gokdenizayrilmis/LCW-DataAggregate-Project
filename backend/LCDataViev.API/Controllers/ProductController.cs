using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                .Include(p => p.Store)
                .Where(p => p.IsActive)
                .ToListAsync();
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Store)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // GET: api/Product/store/5
        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByStore(int storeId)
        {
            return await _context.Products
                .Include(p => p.Store)
                .Where(p => p.StoreId == storeId && p.IsActive)
                .ToListAsync();
        }

        // GET: api/Product/category/tişört
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory(string category)
        {
            return await _context.Products
                .Include(p => p.Store)
                .Where(p => p.Category.ToLower() == category.ToLower() && p.IsActive)
                .ToListAsync();
        }

        // POST: api/Product
        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            // Token'dan mağaza kimliğini al
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }

            // Tüm navigation properties'yi ignore et
            ModelState.Clear();
            
            // Sadece gerekli field'ları validate et
            if (string.IsNullOrEmpty(product.Name))
            {
                return BadRequest("Ürün adı gerekli");
            }
            if (string.IsNullOrEmpty(product.Code))
            {
                return BadRequest("Ürün kodu gerekli");
            }
            if (string.IsNullOrEmpty(product.Category))
            {
                return BadRequest("Kategori gerekli");
            }
            if (product.Price <= 0)
            {
                return BadRequest("Geçerli bir fiyat girin");
            }

            // Store'un var olup olmadığını kontrol et
            var store = await _context.Stores.FindAsync(product.StoreId);
            if (store == null)
            {
                return BadRequest("Geçersiz mağaza ID'si");
            }

            // Kullanıcının mağazası ile istek mağazası aynı olmalı
            if (product.StoreId != userStoreId)
            {
                return Forbid();
            }

            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;
            product.IsActive = true;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            // Token'dan mağaza kimliğini al
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }

            if (id != product.Id)
            {
                return BadRequest();
            }

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            // Store'un var olup olmadığını kontrol et
            var store = await _context.Stores.FindAsync(product.StoreId);
            if (store == null)
            {
                return BadRequest("Geçersiz mağaza ID'si");
            }

            // Kullanıcının mağazası ile istek mağazası aynı olmalı
            if (product.StoreId != userStoreId)
            {
                return Forbid();
            }

            existingProduct.Name = product.Name;
            existingProduct.Code = product.Code;
            existingProduct.Category = product.Category;
            existingProduct.Price = product.Price;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.Description = product.Description;
            existingProduct.StockQuantity = product.StockQuantity;
            existingProduct.StoreId = product.StoreId;
            existingProduct.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            // Token'dan mağaza kimliğini al
            var storeIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
            if (!int.TryParse(storeIdClaim, out var userStoreId) || userStoreId <= 0)
            {
                return Forbid();
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Kullanıcının mağazası ile kaydın mağazası aynı olmalı
            if (product.StoreId != userStoreId)
            {
                return Forbid();
            }

            // Soft delete - sadece IsActive'i false yap
            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
} 