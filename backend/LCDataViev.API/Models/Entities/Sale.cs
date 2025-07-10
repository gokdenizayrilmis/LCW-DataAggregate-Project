using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LCDataViev.API.Models.Entities
{
    [Table("Sales")]
    public class Sale
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
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0.01, double.MaxValue)]
        public decimal UnitPrice { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPrice { get; set; }
        
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("CreatedByUser")]
        public int? CreatedBy { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual Store Store { get; set; } = null!;
        public virtual User? CreatedByUser { get; set; }
        public virtual ICollection<Return> Returns { get; set; } = new List<Return>();
    }
}
