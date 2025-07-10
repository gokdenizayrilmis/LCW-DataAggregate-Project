using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public interface IReturnRepository : IGenericRepository<Return>
    {
        // Return-specific operations
        Task<IEnumerable<Return>> GetReturnsByStoreIdAsync(int storeId);
        Task<IEnumerable<Return>> GetReturnsByUserIdAsync(int userId);
        Task<Return?> GetReturnWithDetailsAsync(int id);
        Task<int> GetReturnCountByStoreIdAsync(int storeId);
    }
} 