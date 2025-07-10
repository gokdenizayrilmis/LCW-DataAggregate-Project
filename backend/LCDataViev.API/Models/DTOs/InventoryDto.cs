using System.ComponentModel.DataAnnotations;

namespace LCDataViev.API.Models.DTOs
{
    public class CreateInventoryDto
    {
        [Required]
        public int StoreId { get; set; }
        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;
        [Required]
        public int Quantity { get; set; }
    }

    public class UpdateInventoryDto
    {
        [Required]
        public int StoreId { get; set; }
        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;
        [Required]
        public int Quantity { get; set; }
    }

    public class InventoryResponseDto
    {
        public int Id { get; set; }
        public int StoreId { get; set; }
        public string? StoreName { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 