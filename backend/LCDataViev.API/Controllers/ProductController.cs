using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

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
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Store'un var olup olmadığını kontrol et
            var store = await _context.Stores.FindAsync(product.StoreId);
            if (store == null)
            {
                return BadRequest("Geçersiz mağaza ID'si");
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
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
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
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
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