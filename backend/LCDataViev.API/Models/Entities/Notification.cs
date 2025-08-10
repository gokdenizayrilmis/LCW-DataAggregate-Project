using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LCDataViev.API.Models.Entities
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Message { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Type { get; set; } // ör: Info, Success, Error

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? UserId { get; set; }
        public int? StoreId { get; set; }
    }
} 