using LCDataViev.API.Models.Entities;
using LCDataViev.API.Models.Enums;

namespace LCDataViev.API.Data
{
    public static class DbInitializer
    {
        public static void SeedData(ApplicationDbContext context)
        {
            // Örnek mağazaları ekle
            if (!context.Stores.Any())
            {
                var stores = new List<Store>
                {
                    new Store
                    {
                        Name = "LCW İstanbul Avrupa",
                        Address = "Bağdat Caddesi No:123, Kadıköy/İstanbul",
                        Phone = "+90 212 555 0101",
                        Email = "istanbul.avrupa@lcwaikiki.com",
                        IsActive = true,
                        IsDomestic = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Store
                    {
                        Name = "LCW Ankara Kızılay",
                        Address = "Kızılay Meydanı No:45, Çankaya/Ankara",
                        Phone = "+90 312 555 0202",
                        Email = "ankara.kizilay@lcwaikiki.com",
                        IsActive = true,
                        IsDomestic = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Store
                    {
                        Name = "LCW İzmir Alsancak",
                        Address = "Alsancak Mahallesi No:67, Konak/İzmir",
                        Phone = "+90 232 555 0303",
                        Email = "izmir.alsancak@lcwaikiki.com",
                        IsActive = true,
                        IsDomestic = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Store
                    {
                        Name = "LCW Berlin Mitte",
                        Address = "Unter den Linden 89, 10117 Berlin, Germany",
                        Phone = "+49 30 555 0404",
                        Email = "berlin.mitte@lcwaikiki.de",
                        IsActive = true,
                        IsDomestic = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Store
                    {
                        Name = "LCW Paris Champs-Élysées",
                        Address = "Avenue des Champs-Élysées 156, 75008 Paris, France",
                        Phone = "+33 1 555 0505",
                        Email = "paris.champs@lcwaikiki.fr",
                        IsActive = true,
                        IsDomestic = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Store
                    {
                        Name = "LCW London Oxford Street",
                        Address = "Oxford Street 234, W1C 1AP London, UK",
                        Phone = "+44 20 555 0606",
                        Email = "london.oxford@lcwaikiki.co.uk",
                        IsActive = true,
                        IsDomestic = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                context.Stores.AddRange(stores);
                context.SaveChanges();

                // Her mağaza için kullanıcı oluştur
                foreach (var store in stores)
                {
                    var user = new User
                    {
                        Username = store.Name.ToLower().Replace(" ", ".").Replace("-", "."),
                        Name = store.Name,
                        Surname = "Yetkili",
                        Email = store.Email,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("store123456"),
                        Role = UserRole.User,
                        StoreId = store.Id,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(user);
                }
                context.SaveChanges();
            }

            // Mağazalar admin tarafından manuel olarak eklenir

            // Admin kullanıcısını kontrol et ve yoksa ekle
            var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@lcwaikiki.com");
            if (adminUser == null)
            {
                adminUser = new User
            {
                Username = "admin",
                Name = "LCW Admin",
                Surname = "Yönetici",
                Email = "admin@lcwaikiki.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123456"),
                Role = UserRole.Admin,
                StoreId = null, // Admin için mağaza yok
                IsActive = true
            };
            context.Users.Add(adminUser);
                context.SaveChanges();
            }

            // Çalışanları, ürünleri ve satışları ekle (sadece mağaza varsa)
            var existingStores = context.Stores.ToList();
            if (existingStores.Any())
            {
                // Çalışanları ekle
                if (!context.Employees.Any())
                {
                    var employees = GetEmployees(existingStores);
                    context.Employees.AddRange(employees);
                    context.SaveChanges();
                }

                // Ürünleri ekle
                if (!context.Products.Any())
                {
                    var products = GetProducts(existingStores);
                    context.Products.AddRange(products);
                    context.SaveChanges();

                    // Stok bilgilerini ekle
                    var inventory = GetInitialInventory(products, existingStores);
                    context.Inventories.AddRange(inventory);
                    context.SaveChanges();

                    // Örnek satış verilerini ekle
                    var sales = GetSampleSales(products, existingStores);
                    context.Sales.AddRange(sales);
            context.SaveChanges();

                    // Haftalık satış verilerini ekle
                    var weeklySales = GetWeeklySales(existingStores);
                    context.WeeklySales.AddRange(weeklySales);
                    context.SaveChanges();
                }
            }
        }

        private static List<Employee> GetEmployees(List<Store> stores)
        {
            var employees = new List<Employee>();
            var names = new[] { "Ahmet", "Mehmet", "Ayşe", "Fatma", "Ali", "Veli", "Zeynep", "Elif", "Mustafa", "Hasan", "Hüseyin", "İbrahim", "Emine", "Hatice", "Meryem" };
            var surnames = new[] { "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aydın", "Öztürk", "Erdoğan", "Koç", "Kurt" };
            var random = new Random();

            foreach (var store in stores)
            {
                // Her mağaza için sabit 10 çalışan: 1 müdür, 1 müdür yardımcısı, 8 satış danışmanı
                for (int i = 1; i <= 10; i++)
                {
                    string position;
                    int salary;
                    
                    if (i == 1)
                    {
                        position = "Mağaza Müdürü";
                        salary = random.Next(25000, 35000);
                    }
                    else if (i == 2)
                    {
                        position = "Müdür Yardımcısı";
                        salary = random.Next(20000, 28000);
                    }
                    else
                    {
                        position = "Satış Danışmanı";
                        salary = random.Next(15000, 22000);
                    }
                    
                    var name = names[random.Next(names.Length)];
                    var surname = surnames[random.Next(surnames.Length)];
                    
                    employees.Add(new Employee
                    {
                        Name = name,
                        Surname = surname,
                        Position = position,
                        Salary = salary,
                        HireDate = DateTime.Now.AddYears(-random.Next(1, 5)).AddMonths(-random.Next(0, 12)),
                        Email = $"{name.ToLower()}.{surname.ToLower()}@{store.Name.ToLower().Replace(" ", "").Replace("Şube", "").Replace("Mağaza", "")}.com",
                        Phone = $"+90 5{random.Next(30, 60)} {random.Next(100, 999)} {random.Next(1000, 9999)}",
                        Avatar = $"https://images.unsplash.com/photo-{1500000000000 + random.Next(1000000, 9999999)}?w=100&h=100&fit=crop",
                        StoreId = store.Id,
                        IsActive = true
                    });
                }
            }

            return employees;
        }

        private static List<Product> GetProducts(List<Store> stores)
        {
            var products = new List<Product>();
            var categories = new[] { "Tişört", "Pantolon", "Ayakkabı", "Hırka", "Gömlek", "Şort" };
            var productNames = new Dictionary<string, string[]>
            {
                { "Tişört", new[] { "Basic Tişört", "Vintage Tişört", "Spor Tişört", "Polo Tişört", "Uzun Kollu Tişört" } },
                { "Pantolon", new[] { "Kot Pantolon", "Kargo Pantolon", "Spor Pantolon", "Slim Fit Pantolon", "Wide Leg Pantolon" } },
                { "Ayakkabı", new[] { "Spor Ayakkabı", "Günlük Ayakkabı", "Sandalet", "Bot", "Loafer" } },
                { "Hırka", new[] { "Kazak", "Sweatshirt", "Cardigan", "Hoodie", "Blazer" } },
                { "Gömlek", new[] { "Günlük Gömlek", "Resmi Gömlek", "Polo Gömlek", "Uzun Kollu Gömlek", "Kısa Kollu Gömlek" } },
                { "Şort", new[] { "Spor Şort", "Günlük Şort", "Kot Şort", "Yüzme Şortu", "Bisiklet Şortu" } }
            };
            var random = new Random();

            foreach (var store in stores)
            {
                foreach (var category in categories)
                {
                    for (int i = 1; i <= 5; i++) // Her kategori için 5 ürün (her resim bir ürün)
                    {
                        var productCode = $"{category[0]}{store.Id:D2}{i:D3}"; // A0101, A0102 gibi
                        var price = random.Next(150, 800);
                        var productName = productNames[category][i - 1];
                        var imageIndex = i + 1000; // 1001, 1002, 1003, 1004, 1005
                        
                                                 // Kategori bazında resim dosya isimlerini belirle
                         string imageFileName;
                         string folderName;
                         switch (category.ToLower())
                         {
                             case "tişört":
                                 imageFileName = $"T{imageIndex}.jpg";
                                 folderName = "tisort";
                                 break;
                             case "pantolon":
                                 imageFileName = $"P{imageIndex}.jpg";
                                 folderName = "pantolon";
                                 break;
                             case "ayakkabı":
                                 imageFileName = $"A{imageIndex}.jpg";
                                 folderName = "ayakkabi";
                                 break;
                             case "hırka":
                                 imageFileName = $"H{imageIndex}.jpg";
                                 folderName = "hirka";
                                 break;
                             case "gömlek":
                                 imageFileName = $"G{imageIndex}.jpg";
                                 folderName = "gomlek";
                                 break;
                             case "şort":
                                 imageFileName = $"S{imageIndex}.jpg";
                                 folderName = "sort";
                                 break;
                             default:
                                 imageFileName = $"T{imageIndex}.jpg";
                                 folderName = "tisort";
                                 break;
                         }
                         
                         products.Add(new Product
                         {
                             Name = productName,
                             Code = productCode,
                             Category = category,
                             Price = price,
                             ImageUrl = $"/images/products/{folderName}/{imageFileName}",
                             Description = $"LCW {productName} - Kaliteli ve şık tasarım",
                             StockQuantity = random.Next(750, 1500),
                             StoreId = store.Id,
                             IsActive = true
                         });
                    }
                }
            }

            return products;
        }

        private static List<Inventory> GetInitialInventory(List<Product> products, List<Store> stores)
        {
            var inventory = new List<Inventory>();
            var random = new Random();

            foreach (var product in products)
            {
                inventory.Add(new Inventory
                {
                    StoreId = product.StoreId,
                    ProductId = product.Id,
                    Quantity = random.Next(50, 200),
                    LastUpdated = DateTime.Now.AddDays(-random.Next(0, 30))
                });
            }

            return inventory;
        }

        private static List<Sale> GetSampleSales(List<Product> products, List<Store> stores)
        {
            var sales = new List<Sale>();
            var random = new Random();
            var users = new List<User>(); // Gerçek kullanıcılar olmadığı için boş liste

            foreach (var product in products)
            {
                // Her ürün için 1-5 satış
                var saleCount = random.Next(1, 6);
                for (int i = 0; i < saleCount; i++)
                {
                    var quantity = random.Next(1, 5);
                    sales.Add(new Sale
                    {
                        StoreId = product.StoreId,
                        ProductId = product.Id,
                        UserId = 1, // Admin user ID
                        Quantity = quantity,
                        TotalPrice = product.Price * quantity,
                        SaleDate = DateTime.Now.AddDays(-random.Next(0, 30))
                    });
                }
            }

                         return sales;
         }

         private static List<WeeklySale> GetWeeklySales(List<Store> stores)
         {
             var weeklySales = new List<WeeklySale>();
             var random = new Random();

             foreach (var store in stores)
             {
                 // Her mağaza için aylık gelir hesapla (30M-60M arası)
                 var monthlyRevenue = random.Next(30000000, 60000000);
                 
                 // 4 hafta için veri oluştur
                 for (int week = 1; week <= 4; week++)
                 {
                     // Haftalık gelir: aylık gelirin %20-30'u arası
                     var weeklyRevenue = monthlyRevenue * random.Next(20, 31) / 100;
                     
                     // Haftalık satılan ürün sayısı: gelire oranla hesapla
                     var soldProducts = (int)(weeklyRevenue / random.Next(150, 800)); // Ortalama ürün fiyatına böl
                     
                     // Hafta tarihlerini hesapla (bu ayın 1-4. haftaları)
                     var currentDate = DateTime.Now;
                     var firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
                     var weekStartDate = firstDayOfMonth.AddDays((week - 1) * 7);
                     var weekEndDate = weekStartDate.AddDays(6);
                     
                     weeklySales.Add(new WeeklySale
                     {
                         StoreId = store.Id,
                         WeekNumber = week,
                         WeeklyRevenue = weeklyRevenue,
                         SoldProducts = soldProducts,
                         WeekStartDate = weekStartDate,
                         WeekEndDate = weekEndDate,
                         IsActive = true
                     });
                 }
             }

             return weeklySales;
        }
    }
}