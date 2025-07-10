using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public class InventoryRepository : GenericRepository<Inventory>, IInventoryRepository
    {
        public InventoryRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Inventory>> GetInventoriesByStoreIdAsync(int storeId)
        {
            return await _dbSet.Where(i => i.StoreId == storeId).ToListAsync();
        }

        public async Task<Inventory?> GetInventoryWithDetailsAsync(int id)
        {
            return await _dbSet.Include(i => i.Store).FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<int> GetInventoryCountByStoreIdAsync(int storeId)
        {
            return await _dbSet.CountAsync(i => i.StoreId == storeId);
        }
    }
} 