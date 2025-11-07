using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public interface IStoreRepository : IGenericRepository<Store>
    {
        // Store-specific operations
        Task<IEnumerable<Store>> GetActiveStoresAsync();
        Task<IEnumerable<Store>> GetStoresByNameAsync(string name);
        Task<Store?> GetStoreWithDetailsAsync(int id);
        Task<int> GetStoreCountByStatusAsync(bool isActive);
        Task ExecuteRawSqlAsync(string sql);
        Task<int> ForceDeleteStoreAsync(int storeId);
    }
} 