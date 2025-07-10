using System.ComponentModel.DataAnnotations;

namespace LCDataViev.API.Models.DTOs
{
    public class CreateReturnDto
    {
        [Required]
        public int StoreId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DateTime ReturnDate { get; set; }
    }

    public class UpdateReturnDto
    {
        [Required]
        public int StoreId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DateTime ReturnDate { get; set; }
    }

    public class ReturnResponseDto
    {
        public int Id { get; set; }
        public int StoreId { get; set; }
        public string? StoreName { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public decimal Amount { get; set; }
        public DateTime ReturnDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 