using LCDataViev.API.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LCDataViev.API.Repositories
{
    public interface INotificationRepository
    {
        Task AddAsync(Notification notification);
        Task<IEnumerable<Notification>> GetAllAsync();
        Task<IEnumerable<Notification>> GetLatestAsync(int count = 20);
    }
} 