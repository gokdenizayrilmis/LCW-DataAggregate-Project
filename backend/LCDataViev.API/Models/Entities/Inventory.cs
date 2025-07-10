using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LCDataViev.API.Models.Entities
{
    [Table("Inventory")]
    public class Inventory
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [ForeignKey("Store")]
        public int StoreId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;
        
        [Required]
        [Range(0, int.MaxValue)]
        public int CurrentStock { get; set; } = 0;
        
        [Range(0, int.MaxValue)]
        public int MinStockLevel { get; set; } = 10;
        
        [Range(0, int.MaxValue)]
        public int MaxStockLevel { get; set; } = 100;
        
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public int Quantity { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual Store Store { get; set; } = null!;
    }
}
