using LCDataViev.API.Models.Entities;

namespace LCDataViev.API.Data
{
    public static class ProductSeedData
    {
        public static List<Product> GetProducts()
        {
            return new List<Product>
            {
                // Tişörtler
                new Product { 
                    Code = "T1001", 
                    Name = "Basic Beyaz Oversize T-Shirt",
                    Category = "Tişört",
                    Price = 199.99M,
                    ImageUrl = "/images/products/tisort/T1001.jpg",
                    Description = "Pamuklu kumaştan üretilen rahat kesim basic beyaz tişört"
                },
                new Product { 
                    Code = "T1002", 
                    Name = "Baskılı Siyah T-Shirt",
                    Category = "Tişört",
                    Price = 249.99M,
                    ImageUrl = "/images/products/tisort/T1002.jpg",
                    Description = "Özel tasarım baskılı siyah pamuklu tişört"
                },
                new Product { 
                    Code = "T1003", 
                    Name = "Slim Fit Lacivert T-Shirt",
                    Category = "Tişört",
                    Price = 179.99M,
                    ImageUrl = "/images/products/tisort/T1003.jpg",
                    Description = "Dar kesim lacivert basic tişört"
                },
                new Product { 
                    Code = "T1004", 
                    Name = "V Yaka Gri T-Shirt",
                    Category = "Tişört",
                    Price = 159.99M,
                    ImageUrl = "/images/products/tisort/T1004.jpg",
                    Description = "V yakalı gri melanj tişört"
                },
                new Product { 
                    Code = "T1005", 
                    Name = "Polo Yaka T-Shirt",
                    Category = "Tişört",
                    Price = 299.99M,
                    ImageUrl = "/images/products/tisort/T1005.jpg",
                    Description = "Klasik polo yaka pamuklu tişört"
                },

                // Pantolonlar
                new Product { 
                    Code = "P1001", 
                    Name = "Slim Fit Jean",
                    Category = "Pantolon",
                    Price = 499.99M,
                    ImageUrl = "/images/products/pantolon/P1001.jpg",
                    Description = "Dar kesim mavi kot pantolon"
                },
                new Product { 
                    Code = "P1002", 
                    Name = "Kargo Pantolon",
                    Category = "Pantolon",
                    Price = 399.99M,
                    ImageUrl = "/images/products/pantolon/P1002.jpg",
                    Description = "Çok cepli kargo pantolon"
                },
                new Product { 
                    Code = "P1003", 
                    Name = "Chino Pantolon",
                    Category = "Pantolon",
                    Price = 349.99M,
                    ImageUrl = "/images/products/pantolon/P1003.jpg",
                    Description = "Klasik kesim chino pantolon"
                },
                new Product { 
                    Code = "P1004", 
                    Name = "Yüksek Bel Jean",
                    Category = "Pantolon",
                    Price = 459.99M,
                    ImageUrl = "/images/products/pantolon/P1004.jpg",
                    Description = "Yüksek bel skinny jean"
                },
                new Product { 
                    Code = "P1005", 
                    Name = "Kumaş Pantolon",
                    Category = "Pantolon",
                    Price = 429.99M,
                    ImageUrl = "/images/products/pantolon/P1005.jpg",
                    Description = "Klasik kesim kumaş pantolon"
                },

                // Şortlar
                new Product { 
                    Code = "S1001", 
                    Name = "Denim Şort",
                    Category = "Şort",
                    Price = 299.99M,
                    ImageUrl = "/images/products/sort/S1001.jpg",
                    Description = "Rahat kesim denim şort"
                },
                new Product { 
                    Code = "S1002", 
                    Name = "Kargo Şort",
                    Category = "Şort",
                    Price = 259.99M,
                    ImageUrl = "/images/products/sort/S1002.jpg",
                    Description = "Cepli kargo şort"
                },
                new Product { 
                    Code = "S1003", 
                    Name = "Spor Şort",
                    Category = "Şort",
                    Price = 199.99M,
                    ImageUrl = "/images/products/sort/S1003.jpg",
                    Description = "Hafif kumaş spor şort"
                },
                new Product { 
                    Code = "S1004", 
                    Name = "Chino Şort",
                    Category = "Şort",
                    Price = 279.99M,
                    ImageUrl = "/images/products/sort/S1004.jpg",
                    Description = "Klasik kesim chino şort"
                },
                new Product { 
                    Code = "S1005", 
                    Name = "Plaj Şortu",
                    Category = "Şort",
                    Price = 229.99M,
                    ImageUrl = "/images/products/sort/S1005.jpg",
                    Description = "Hızlı kuruyan plaj şortu"
                },

                // Ayakkabılar
                new Product { 
                    Code = "A1001", 
                    Name = "Spor Ayakkabı",
                    Category = "Ayakkabı",
                    Price = 799.99M,
                    ImageUrl = "/images/products/ayakkabi/A1001.jpg",
                    Description = "Günlük spor ayakkabı"
                },
                new Product { 
                    Code = "A1002", 
                    Name = "Klasik Ayakkabı",
                    Category = "Ayakkabı",
                    Price = 899.99M,
                    ImageUrl = "/images/products/ayakkabi/A1002.jpg",
                    Description = "Siyah deri klasik ayakkabı"
                },
                new Product { 
                    Code = "A1003", 
                    Name = "Sneaker",
                    Category = "Ayakkabı",
                    Price = 699.99M,
                    ImageUrl = "/images/products/ayakkabi/A1003.jpg",
                    Description = "Rahat günlük sneaker"
                },
                new Product { 
                    Code = "A1004", 
                    Name = "Bot",
                    Category = "Ayakkabı",
                    Price = 999.99M,
                    ImageUrl = "/images/products/ayakkabi/A1004.jpg",
                    Description = "Kışlık deri bot"
                },
                new Product { 
                    Code = "A1005", 
                    Name = "Loafer",
                    Category = "Ayakkabı",
                    Price = 599.99M,
                    ImageUrl = "/images/products/ayakkabi/A1005.jpg",
                    Description = "Süet loafer ayakkabı"
                },

                // Hırkalar
                new Product { 
                    Code = "H1001", 
                    Name = "Düğmeli Hırka",
                    Category = "Hırka",
                    Price = 399.99M,
                    ImageUrl = "/images/products/hirka/H1001.jpg",
                    Description = "Klasik düğmeli hırka"
                },
                new Product { 
                    Code = "H1002", 
                    Name = "Fermuarlı Hırka",
                    Category = "Hırka",
                    Price = 449.99M,
                    ImageUrl = "/images/products/hirka/H1002.jpg",
                    Description = "Fermuarlı spor hırka"
                },
                new Product { 
                    Code = "H1003", 
                    Name = "Kapüşonlu Hırka",
                    Category = "Hırka",
                    Price = 499.99M,
                    ImageUrl = "/images/products/hirka/H1003.jpg",
                    Description = "Kapüşonlu kalın hırka"
                },
                new Product { 
                    Code = "H1004", 
                    Name = "İnce Hırka",
                    Category = "Hırka",
                    Price = 349.99M,
                    ImageUrl = "/images/products/hirka/H1004.jpg",
                    Description = "İnce örgü hırka"
                },
                new Product { 
                    Code = "H1005", 
                    Name = "Desenli Hırka",
                    Category = "Hırka",
                    Price = 549.99M,
                    ImageUrl = "/images/products/hirka/H1005.jpg",
                    Description = "Etnik desenli hırka"
                },

                // Gömlekler
                new Product { 
                    Code = "G1001", 
                    Name = "Slim Fit Gömlek",
                    Category = "Gömlek",
                    Price = 349.99M,
                    ImageUrl = "/images/products/gomlek/G1001.jpg",
                    Description = "Dar kesim pamuklu gömlek"
                },
                new Product { 
                    Code = "G1002", 
                    Name = "Kareli Gömlek",
                    Category = "Gömlek",
                    Price = 299.99M,
                    ImageUrl = "/images/products/gomlek/G1002.jpg",
                    Description = "Ekose desenli gömlek"
                },
                new Product { 
                    Code = "G1003", 
                    Name = "Oxford Gömlek",
                    Category = "Gömlek",
                    Price = 399.99M,
                    ImageUrl = "/images/products/gomlek/G1003.jpg",
                    Description = "Klasik oxford gömlek"
                },
                new Product { 
                    Code = "G1004", 
                    Name = "Keten Gömlek",
                    Category = "Gömlek",
                    Price = 449.99M,
                    ImageUrl = "/images/products/gomlek/G1004.jpg",
                    Description = "Yazlık keten gömlek"
                },
                new Product { 
                    Code = "G1005", 
                    Name = "Çizgili Gömlek",
                    Category = "Gömlek",
                    Price = 379.99M,
                    ImageUrl = "/images/products/gomlek/G1005.jpg",
                    Description = "Çizgili desenli gömlek"
                }
            };
        }

        public static List<Inventory> GetInitialInventory(List<Product> products, List<Store> stores)
        {
            var inventory = new List<Inventory>();
            var random = new Random();

            foreach (var store in stores)
            {
                foreach (var product in products)
                {
                    inventory.Add(new Inventory
                    {
                        StoreId = store.Id,
                        ProductId = product.Id,
                        Quantity = random.Next(10, 100), // Her ürün için rastgele stok (10-100 arası)
                        LastUpdated = DateTime.Now
                    });
                }
            }

            return inventory;
        }

        public static List<Sale> GetSampleSales(List<Product> products, List<Store> stores)
        {
            var sales = new List<Sale>();
            var random = new Random();
            var startDate = DateTime.Now.AddDays(-30); // Son 30 günlük satış verisi

            for (var date = startDate; date <= DateTime.Now; date = date.AddDays(1))
            {
                foreach (var store in stores)
                {
                    // Her gün için rastgele 3-8 satış
                    var dailySales = random.Next(3, 9);
                    for (var i = 0; i < dailySales; i++)
                    {
                        var product = products[random.Next(products.Count)];
                        var quantity = random.Next(1, 5);
                        sales.Add(new Sale
                        {
                            StoreId = store.Id,
                            ProductId = product.Id,
                            Quantity = quantity,
                            TotalPrice = product.Price * quantity,
                            SaleDate = date.AddHours(random.Next(9, 22)) // 09:00 - 22:00 arası
                        });
                    }
                }
            }

            return sales;
        }
    }
}