using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public class SaleRepository : GenericRepository<Sale>, ISaleRepository
    {
        public SaleRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Sale>> GetSalesByStoreIdAsync(int storeId)
        {
            return await _dbSet.Where(s => s.StoreId == storeId).ToListAsync();
        }

        public async Task<IEnumerable<Sale>> GetSalesByUserIdAsync(int userId)
        {
            return await _dbSet.Where(s => s.UserId == userId).ToListAsync();
        }

        public async Task<Sale?> GetSaleWithDetailsAsync(int id)
        {
            return await _dbSet.Include(s => s.Store).Include(s => s.User).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<int> GetSaleCountByStoreIdAsync(int storeId)
        {
            return await _dbSet.CountAsync(s => s.StoreId == storeId);
        }
    }
} 