using System.ComponentModel.DataAnnotations;

namespace LCDataViev.API.Models.DTOs
{
    // Create DTO
    public class CreateStoreDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Address { get; set; }
        
        [StringLength(20)]
        public string? Phone { get; set; }
        
        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }
        
        public bool IsActive { get; set; } = true;
        public bool IsDomestic { get; set; } = true; // true: Yurt içi, false: Yurt dışı
        [Required]
        [StringLength(100, MinimumLength = 4)]
        public string Password { get; set; } = string.Empty;
    }

    // Update DTO
    public class UpdateStoreDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Address { get; set; }
        
        [StringLength(20)]
        public string? Phone { get; set; }
        
        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }
        
        public bool IsActive { get; set; }
        public bool IsDomestic { get; set; } = true; // true: Yurt içi, false: Yurt dışı
        [StringLength(100)]
        public string? Password { get; set; } // opsiyonel - boş olabilir
    }

    // Response DTO
    public class StoreResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public bool IsDomestic { get; set; } = true; // true: Yurt içi, false: Yurt dışı
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UserCount { get; set; }
        public int SaleCount { get; set; }
        public int ReturnCount { get; set; }
        public int InventoryCount { get; set; }
        
        // Yeni mağaza oluşturulduğunda kullanıcı bilgilerini döndür
        public string? UserEmail { get; set; }
        public string? TempPassword { get; set; } // Sadece create işleminde dolu
    }

    // List Response DTO
    public class StoreListResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public bool IsDomestic { get; set; } = true; // true: Yurt içi, false: Yurt dışı
        public DateTime CreatedAt { get; set; }
    }
} 