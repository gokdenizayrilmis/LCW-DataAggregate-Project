using System.ComponentModel.DataAnnotations;
using LCDataViev.API.Models.Validation;
using LCDataViev.API.Models.Utilities;

namespace LCDataViev.API.Models.DTOs
{
    public class WeeklySaleDto
    {
        public int Id { get; set; }
        
        [Required]
        public int StoreId { get; set; }
        
        [Required]
        [Range(1, 53, ErrorMessage = "Week number must be between 1 and 53")]
        public int WeekNumber { get; set; }
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Weekly revenue must be positive")]
        public decimal WeeklyRevenue { get; set; }
        
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Sold products count must be positive")]
        public int SoldProducts { get; set; }
        
        [Required]
        public DateTime WeekStartDate { get; set; }
        
        [Required]
        public DateTime WeekEndDate { get; set; }
        
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation property for Store
        public string? StoreName { get; set; }
    }

    public class CreateWeeklySaleDto
    {
        [Required]
        public int StoreId { get; set; }
        
        [Required]
        [Range(1, 53, ErrorMessage = "Week number must be between 1 and 53")]
        [WeekNumberValidation("WeekStartDate", "WeekNumber")]
        public int WeekNumber { get; set; }
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Weekly revenue must be positive")]
        public decimal WeeklyRevenue { get; set; }
        
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Sold products count must be positive")]
        public int SoldProducts { get; set; }
        
        [Required]
        public DateTime WeekStartDate { get; set; }
        
        [Required]
        [DateRangeValidation("WeekStartDate", "WeekEndDate")]
        [ValidWeekRange("WeekStartDate", "WeekEndDate")]
        public DateTime WeekEndDate { get; set; }
    }

    public class UpdateWeeklySaleDto
    {
        [Required]
        [Range(1, 53, ErrorMessage = "Week number must be between 1 and 53")]
        [WeekNumberValidation("WeekStartDate", "WeekNumber")]
        public int WeekNumber { get; set; }
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Weekly revenue must be positive")]
        public decimal WeeklyRevenue { get; set; }
        
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Sold products count must be positive")]
        public int SoldProducts { get; set; }
        
        [Required]
        public DateTime WeekStartDate { get; set; }
        
        [Required]
        [DateRangeValidation("WeekStartDate", "WeekEndDate")]
        [ValidWeekRange("WeekStartDate", "WeekEndDate")]
        public DateTime WeekEndDate { get; set; }
    }
}
