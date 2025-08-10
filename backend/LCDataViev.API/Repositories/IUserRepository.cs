using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        // User-specific operations
        Task<IEnumerable<User>> GetActiveUsersAsync();
        Task<IEnumerable<User>> GetUsersByStoreIdAsync(int storeId);
        Task<User?> GetUserWithDetailsAsync(int id);
        Task<int> GetUserCountByStatusAsync(bool isActive);
        Task<User?> GetByEmailAsync(string email);
    }
} 