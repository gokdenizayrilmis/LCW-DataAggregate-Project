using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public interface ISaleRepository : IGenericRepository<Sale>
    {
        // Sale-specific operations
        Task<IEnumerable<Sale>> GetSalesByStoreIdAsync(int storeId);
        Task<IEnumerable<Sale>> GetSalesByUserIdAsync(int userId);
        Task<Sale?> GetSaleWithDetailsAsync(int id);
        Task<int> GetSaleCountByStoreIdAsync(int storeId);
    }
} 