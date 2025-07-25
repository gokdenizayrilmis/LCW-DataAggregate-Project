using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<User>> GetActiveUsersAsync()
        {
            return await _dbSet.Where(u => u.IsActive).OrderBy(u => u.Name).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetUsersByStoreIdAsync(int storeId)
        {
            return await _dbSet.Where(u => u.StoreId == storeId).ToListAsync();
        }

        public async Task<User?> GetUserWithDetailsAsync(int id)
        {
            return await _dbSet.Include(u => u.Store).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<int> GetUserCountByStatusAsync(bool isActive)
        {
            return await _dbSet.CountAsync(u => u.IsActive == isActive);
        }
    }
} 