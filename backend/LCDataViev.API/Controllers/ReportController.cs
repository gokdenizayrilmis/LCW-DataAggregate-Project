using Microsoft.AspNetCore.Mvc;
using LCDataViev.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace LCDataViev.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReportController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalSales = await _context.Sales.CountAsync();
            var totalSalesAmount = await _context.Sales.SumAsync(s => (decimal?)s.TotalPrice) ?? 0;
            var totalUsers = await _context.Users.CountAsync();
            var totalStores = await _context.Stores.CountAsync();
            var totalInventory = await _context.Inventories.CountAsync();
            var activeStores = await _context.Stores.CountAsync(s => s.IsActive);
            var activeUsers = await _context.Users.CountAsync(u => u.IsActive);

            return Ok(new {
                totalSales,
                totalSalesAmount,
                totalUsers,
                totalStores,
                totalInventory,
                activeStores,
                activeUsers
            });
        }
    }
} 