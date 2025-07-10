using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.Enums;

namespace LCDataViev.API.Data
{
    public static class DbInitializer
    {
        public static void SeedData(ApplicationDbContext context)
        {
            if (!context.Stores.Any())
            {
                var stores = new List<Store>
                {
                    new Store
                    {
                        Name = "Merkez Mağaza",
                        Address = "İstanbul, Türkiye",
                        Phone = "+90 212 555 0001",
                        Email = "merkez@lcw.com",
                        IsActive = true
                    },
                    new Store
                    {
                        Name = "Ankara Şube",
                        Address = "Ankara, Türkiye",
                        Phone = "+90 312 555 0002",
                        Email = "ankara@lcw.com",
                        IsActive = true
                    },
                    new Store
                    {
                        Name = "İzmir Şube",
                        Address = "İzmir, Türkiye",
                        Phone = "+90 232 555 0003",
                        Email = "izmir@lcw.com",
                        IsActive = true
                    }
                };

                context.Stores.AddRange(stores);
                context.SaveChanges();
            }

            if (!context.Users.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        Username = "admin",
                        Email = "admin@lcw.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                        Role = UserRole.Admin,
                        StoreId = 1,
                        IsActive = true
                    },
                    new User
                    {
                        Username = "manager1",
                        Email = "manager1@lcw.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager123!"),
                        Role = UserRole.Manager,
                        StoreId = 1,
                        IsActive = true
                    },
                    new User
                    {
                        Username = "user1",
                        Email = "user1@lcw.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                        Role = UserRole.User,
                        StoreId = 1,
                        IsActive = true
                    }
                };

                context.Users.AddRange(users);
                context.SaveChanges();
            }

            if (!context.Inventories.Any())
            {
                var inventories = new List<Inventory>
                {
                    new Inventory
                    {
                        StoreId = 1,
                        ProductName = "Laptop",
                        CurrentStock = 50,
                        MinStockLevel = 10,
                        MaxStockLevel = 100
                    },
                    new Inventory
                    {
                        StoreId = 1,
                        ProductName = "Mouse",
                        CurrentStock = 100,
                        MinStockLevel = 20,
                        MaxStockLevel = 200
                    },
                    new Inventory
                    {
                        StoreId = 1,
                        ProductName = "Keyboard",
                        CurrentStock = 75,
                        MinStockLevel = 15,
                        MaxStockLevel = 150
                    }
                };

                context.Inventories.AddRange(inventories);
                context.SaveChanges();
            }
        }
    }
}