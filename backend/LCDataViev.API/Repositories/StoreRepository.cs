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
                .Include(s => s.Employees)
                .Include(s => s.Products)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<int> GetStoreCountByStatusAsync(bool isActive)
        {
            return await _dbSet
                .CountAsync(s => s.IsActive == isActive);
        }

        public async Task ExecuteRawSqlAsync(string sql)
        {
            await _context.Database.ExecuteSqlRawAsync(sql);
        }

        // Güvenli SQL execution - sadece belirli işlemler için
        public async Task<int> ForceDeleteStoreAsync(int storeId)
        {
            try
            {
                // Foreign key kontrolünü geçici olarak devre dışı bırak
                await _context.Database.ExecuteSqlRawAsync("PRAGMA foreign_keys = OFF;");
                
                // Sıralı silme işlemleri
                var deletedCount = 0;
                
                // 1. Inventory kayıtlarını sil
                var inventoryCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Inventories WHERE StoreId = {0}", storeId);
                deletedCount += inventoryCount;
                
                // 2. Products kayıtlarını sil
                var productCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Products WHERE StoreId = {0}", storeId);
                deletedCount += productCount;
                
                // 3. Employees kayıtlarını sil
                var employeeCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Employees WHERE StoreId = {0}", storeId);
                deletedCount += employeeCount;
                
                // 4. Sales kayıtlarını sil
                var saleCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Sales WHERE StoreId = {0}", storeId);
                deletedCount += saleCount;
                
                // 5. Returns kayıtlarını sil
                var returnCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Returns WHERE StoreId = {0}", storeId);
                deletedCount += returnCount;
                
                // 6. WeeklySales kayıtlarını sil
                var weeklySaleCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM WeeklySales WHERE StoreId = {0}", storeId);
                deletedCount += weeklySaleCount;
                
                // 7. Users kayıtlarını sil
                var userCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Users WHERE StoreId = {0}", storeId);
                deletedCount += userCount;
                
                // 8. Notifications kayıtlarını sil
                var notificationCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Notifications WHERE StoreId = {0}", storeId);
                deletedCount += notificationCount;
                
                // 9. Son olarak Store'u sil
                var storeCount = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Stores WHERE Id = {0}", storeId);
                deletedCount += storeCount;
                
                // Foreign key kontrolünü tekrar aç
                await _context.Database.ExecuteSqlRawAsync("PRAGMA foreign_keys = ON;");
                
                return deletedCount;
            }
            catch (Exception)
            {
                // Hata durumunda foreign key kontrolünü tekrar aç
                await _context.Database.ExecuteSqlRawAsync("PRAGMA foreign_keys = ON;");
                throw;
            }
        }
    }
} 