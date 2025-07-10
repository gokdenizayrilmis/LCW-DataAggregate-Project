using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public interface IInventoryRepository : IGenericRepository<Inventory>
    {
        // Inventory-specific operations
        Task<IEnumerable<Inventory>> GetInventoriesByStoreIdAsync(int storeId);
        Task<Inventory?> GetInventoryWithDetailsAsync(int id);
        Task<int> GetInventoryCountByStoreIdAsync(int storeId);
    }
} 