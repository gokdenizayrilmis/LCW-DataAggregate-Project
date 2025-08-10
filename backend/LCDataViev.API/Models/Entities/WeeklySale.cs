using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LCDataViev.API.Models.Entities
{
    [Table("WeeklySales")]
    public class WeeklySale
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int StoreId { get; set; }
        
        [Required]
        public int WeekNumber { get; set; } // 1, 2, 3, 4
        
        [Required]
        public decimal WeeklyRevenue { get; set; }
        
        [Required]
        public int SoldProducts { get; set; }
        
        [Required]
        public DateTime WeekStartDate { get; set; }
        
        [Required]
        public DateTime WeekEndDate { get; set; }
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual Store Store { get; set; } = null!;
    }
} 