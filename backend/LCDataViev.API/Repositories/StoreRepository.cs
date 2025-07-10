using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public class StoreRepository : GenericRepository<Store>, IStoreRepository
    {
        public StoreRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Store>> GetActiveStoresAsync()
        {
            return await _dbSet
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Store>> GetStoresByNameAsync(string name)
        {
            return await _dbSet
                .Where(s => s.Name.Contains(name))
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<Store?> GetStoreWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(s => s.Users)
                .Include(s => s.Sales)
                .Include(s => s.Returns)
                .Include(s => s.Inventories)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<int> GetStoreCountByStatusAsync(bool isActive)
        {
            return await _dbSet
                .CountAsync(s => s.IsActive == isActive);
        }
    }
} 