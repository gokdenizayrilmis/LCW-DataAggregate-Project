using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Repositories
{
    public interface IWeeklySaleRepository : IGenericRepository<WeeklySale>
    {
        Task<IEnumerable<WeeklySale>> GetWeeklySalesByStoreAsync(int storeId);
        Task<IEnumerable<WeeklySale>> GetWeeklySalesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<WeeklySale?> GetWeeklySaleByStoreAndWeekAsync(int storeId, int weekNumber, int year);
        Task<decimal> GetTotalRevenueByStoreAndPeriodAsync(int storeId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<WeeklySale>> GetWeeklySalesByYearAsync(int year);
        Task<decimal> GetAverageWeeklyRevenueByStoreAsync(int storeId, DateTime startDate, DateTime endDate);
        Task<bool> IsWeekNumberUniqueForStoreAsync(int storeId, int weekNumber, int year, int? excludeId = null);
    }
}
