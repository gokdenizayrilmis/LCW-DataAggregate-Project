using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public class WeeklySaleRepository : GenericRepository<WeeklySale>, IWeeklySaleRepository
    {
        public WeeklySaleRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<WeeklySale>> GetWeeklySalesByStoreAsync(int storeId)
        {
            return await _context.WeeklySales
                .Include(w => w.Store)
                .Where(w => w.StoreId == storeId && w.IsActive)
                .OrderBy(w => w.WeekStartDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<WeeklySale>> GetWeeklySalesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.WeeklySales
                .Include(w => w.Store)
                .Where(w => w.WeekStartDate >= startDate && w.WeekEndDate <= endDate && w.IsActive)
                .OrderBy(w => w.WeekStartDate)
                .ToListAsync();
        }

        public async Task<WeeklySale?> GetWeeklySaleByStoreAndWeekAsync(int storeId, int weekNumber, int year)
        {
            return await _context.WeeklySales
                .Include(w => w.Store)
                .FirstOrDefaultAsync(w => w.StoreId == storeId && 
                                        w.WeekNumber == weekNumber && 
                                        w.WeekStartDate.Year == year && 
                                        w.IsActive);
        }

        public async Task<decimal> GetTotalRevenueByStoreAndPeriodAsync(int storeId, DateTime startDate, DateTime endDate)
        {
            return await _context.WeeklySales
                .Where(w => w.StoreId == storeId && 
                           w.WeekStartDate >= startDate && 
                           w.WeekEndDate <= endDate && 
                           w.IsActive)
                .SumAsync(w => w.WeeklyRevenue);
        }

        public async Task<IEnumerable<WeeklySale>> GetWeeklySalesByYearAsync(int year)
        {
            return await _context.WeeklySales
                .Include(w => w.Store)
                .Where(w => w.WeekStartDate.Year == year && w.IsActive)
                .OrderBy(w => w.StoreId)
                .ThenBy(w => w.WeekNumber)
                .ToListAsync();
        }

        public async Task<decimal> GetAverageWeeklyRevenueByStoreAsync(int storeId, DateTime startDate, DateTime endDate)
        {
            var weeklySales = await _context.WeeklySales
                .Where(w => w.StoreId == storeId && 
                           w.WeekStartDate >= startDate && 
                           w.WeekEndDate <= endDate && 
                           w.IsActive)
                .ToListAsync();

            if (!weeklySales.Any())
                return 0;

            return weeklySales.Average(w => w.WeeklyRevenue);
        }

        public async Task<bool> IsWeekNumberUniqueForStoreAsync(int storeId, int weekNumber, int year, int? excludeId = null)
        {
            var query = _context.WeeklySales
                .Where(w => w.StoreId == storeId && 
                           w.WeekNumber == weekNumber && 
                           w.WeekStartDate.Year == year && 
                           w.IsActive);

            if (excludeId.HasValue)
            {
                query = query.Where(w => w.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }
    }
}
