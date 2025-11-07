using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public interface IEmployeeRepository : IGenericRepository<Employee>
    {
        Task<IEnumerable<Employee>> GetEmployeesByStoreAsync(int storeId);
        Task<IEnumerable<Employee>> GetActiveEmployeesAsync();
        Task<Employee?> GetEmployeeWithStoreAsync(int id);
    }
}
