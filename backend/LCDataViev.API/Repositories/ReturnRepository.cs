using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public class ReturnRepository : GenericRepository<Return>, IReturnRepository
    {
        public ReturnRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Return>> GetReturnsByStoreIdAsync(int storeId)
        {
            return await _dbSet.Where(r => r.StoreId == storeId).ToListAsync();
        }

        public async Task<IEnumerable<Return>> GetReturnsByUserIdAsync(int userId)
        {
            return await _dbSet.Where(r => r.UserId == userId).ToListAsync();
        }

        public async Task<Return?> GetReturnWithDetailsAsync(int id)
        {
            return await _dbSet.Include(r => r.Store).Include(r => r.User).FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<int> GetReturnCountByStoreIdAsync(int storeId)
        {
            return await _dbSet.CountAsync(r => r.StoreId == storeId);
        }
    }
} 