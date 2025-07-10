using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LCDataViev.API.Models.Entities
{
    [Table("Returns")]
    public class Return
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [ForeignKey("Store")]
        public int StoreId { get; set; }
        
        [ForeignKey("Sale")]
        public int? SaleId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        [StringLength(500)]
        public string? ReturnReason { get; set; }
        
        public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
        
        public decimal Amount { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("CreatedByUser")]
        public int? CreatedBy { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual Store Store { get; set; } = null!;
        public virtual Sale? Sale { get; set; }
        public virtual User? CreatedByUser { get; set; }
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
