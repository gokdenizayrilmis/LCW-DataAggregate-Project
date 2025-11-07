using Microsoft.EntityFrameworkCore;
using LCDataViev.API.Data;
using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Employee>> GetEmployeesByStoreAsync(int storeId)
        {
            return await _dbSet
                .Where(e => e.StoreId == storeId && e.IsActive)
                .OrderBy(e => e.Position)
                .ThenBy(e => e.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Employee>> GetActiveEmployeesAsync()
        {
            return await _dbSet
                .Where(e => e.IsActive)
                .Include(e => e.Store)
                .OrderBy(e => e.Store.Name)
                .ThenBy(e => e.Position)
                .ToListAsync();
        }

        public async Task<Employee?> GetEmployeeWithStoreAsync(int id)
        {
            return await _dbSet
                .Include(e => e.Store)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}
