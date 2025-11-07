using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.Enums;
using BCrypt.Net;

namespace LCDataViev.API.Data
{
    public static class DbInitializer
    {
        public static void SeedData(ApplicationDbContext context)
        {
            try
            {
                // Admin kullanıcısı (sadece ADB için)
                var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@lcwaikiki.com");
                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        Username = "admin",
                        Name = "Admin",
                        Surname = "Kullanıcı",
                        Email = "admin@lcwaikiki.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                        Role = UserRole.Admin,
                        StoreId = null, // Admin için mağaza yok
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(adminUser);
                    context.SaveChanges();
                    Console.WriteLine("✅ Admin kullanıcısı oluşturuldu (ADB)");
                }
                else
                {
                    Console.WriteLine("ℹ️ Admin kullanıcısı zaten mevcut (ADB)");
                }

                // Test mağazası (DB tarafı giriş için)
                var testStoreEmail = "test@lcwaikiki.com";
                var testStore = context.Stores.FirstOrDefault(s => s.Email == testStoreEmail);
                if (testStore == null)
                {
                    testStore = new Store
                    {
                        Name = "Test Mağaza",
                        Address = "test",
                        Phone = "0542894304",
                        Email = testStoreEmail,
                        IsActive = true,
                        IsDomestic = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    context.Stores.Add(testStore);
                    context.SaveChanges();
                    Console.WriteLine("✅ Test mağazası oluşturuldu");
                }
                else
                {
                    Console.WriteLine("ℹ️ Test mağazası zaten mevcut");
                }

                // Test mağazası kullanıcısı (User rolü)
                var testUser = context.Users.FirstOrDefault(u => u.Email == testStoreEmail);
                if (testUser == null)
                {
                    testUser = new User
                    {
                        Username = "test",
                        Name = "Test",
                        Surname = "Kullanıcı",
                        Email = testStoreEmail,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
                        Role = UserRole.User,
                        StoreId = testStore.Id,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(testUser);
                    context.SaveChanges();
                    Console.WriteLine("✅ Test mağazası kullanıcısı oluşturuldu (DB)");
                }
                else
                {
                    Console.WriteLine("ℹ️ Test mağazası kullanıcısı zaten mevcut (DB)");
                }

                Console.WriteLine("✅ Database başlatma tamamlandı");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Database başlatma hatası: {ex.Message}");
                // Hata durumunda uygulama çalışmaya devam etsin
            }
        }
    }
}