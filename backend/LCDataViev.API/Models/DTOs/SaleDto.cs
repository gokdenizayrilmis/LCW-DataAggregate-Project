using System.ComponentModel.DataAnnotations;

namespace LCDataViev.API.Models.DTOs
{
    public class CreateSaleDto
    {
        [Required]
        public int StoreId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DateTime SaleDate { get; set; }
    }

    public class UpdateSaleDto
    {
        [Required]
        public int StoreId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DateTime SaleDate { get; set; }
    }

    public class SaleResponseDto
    {
        public int Id { get; set; }
        public int StoreId { get; set; }
        public string? StoreName { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public decimal Amount { get; set; }
        public DateTime SaleDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 