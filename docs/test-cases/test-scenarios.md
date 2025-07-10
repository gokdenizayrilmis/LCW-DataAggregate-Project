\# Test Senaryoları Dokümanı



\## 📋 Test Stratejisi



\### Test Seviyeleri

1\. \*\*Unit Tests\*\*: Bireysel fonksiyon ve sınıf testleri

2\. \*\*Integration Tests\*\*: API endpoint ve veritabanı entegrasyon testleri

3\. \*\*Performance Tests\*\*: Yük ve performans testleri

4\. \*\*Security Tests\*\*: Güvenlik testleri

5\. \*\*UI Tests\*\*: Kullanıcı arayüzü testleri



\## 🧪 Unit Test Senaryoları



\### 1. Satış Servisi Testleri



\#### 1.1 Yeni Satış Oluşturma

```csharp

\[Test]

public void CreateSale\_ValidData\_ReturnsSuccess()

{

&nbsp;   // Arrange

&nbsp;   var saleRequest = new CreateSaleRequest

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       ProductName = "Test Ürün",

&nbsp;       Quantity = 5,

&nbsp;       UnitPrice = 100.00m

&nbsp;   };



&nbsp;   // Act

&nbsp;   var result = \_saleService.CreateSale(saleRequest);



&nbsp;   // Assert

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.AreEqual(500.00m, result.TotalPrice);

&nbsp;   Assert.AreEqual(1, result.StoreId);

}

```



\#### 1.2 Geçersiz Satış Verisi

```csharp

\[Test]

public void CreateSale\_InvalidData\_ThrowsValidationException()

{

&nbsp;   // Arrange

&nbsp;   var saleRequest = new CreateSaleRequest

&nbsp;   {

&nbsp;       StoreId = 0, // Geçersiz

&nbsp;       ProductName = "", // Boş

&nbsp;       Quantity = -1, // Negatif

&nbsp;       UnitPrice = 0 // Geçersiz

&nbsp;   };



&nbsp;   // Act \& Assert

&nbsp;   Assert.Throws<ValidationException>(() => 

&nbsp;       \_saleService.CreateSale(saleRequest));

}

```



\#### 1.3 Satış Listesi Getirme

```csharp

\[Test]

public void GetSales\_ValidParameters\_ReturnsSalesList()

{

&nbsp;   // Arrange

&nbsp;   var pagination = new PaginationRequest { Page = 1, PageSize = 10 };



&nbsp;   // Act

&nbsp;   var result = \_saleService.GetSales(pagination);



&nbsp;   // Assert

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.IsTrue(result.Items.Count <= 10);

&nbsp;   Assert.IsTrue(result.TotalCount > 0);

}

```



\### 2. İade Servisi Testleri



\#### 2.1 Yeni İade Oluşturma

```csharp

\[Test]

public void CreateReturn\_ValidData\_ReturnsSuccess()

{

&nbsp;   // Arrange

&nbsp;   var returnRequest = new CreateReturnRequest

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       SaleId = 1,

&nbsp;       ProductName = "Test Ürün",

&nbsp;       Quantity = 2,

&nbsp;       ReturnReason = "Kusurlu ürün"

&nbsp;   };



&nbsp;   // Act

&nbsp;   var result = \_returnService.CreateReturn(returnRequest);



&nbsp;   // Assert

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.AreEqual(1, result.StoreId);

&nbsp;   Assert.AreEqual("Kusurlu ürün", result.ReturnReason);

}

```



\#### 2.2 İade İstatistikleri

```csharp

\[Test]

public void GetReturnStatistics\_ValidStoreId\_ReturnsStatistics()

{

&nbsp;   // Arrange

&nbsp;   int storeId = 1;

&nbsp;   var dateRange = new DateRangeRequest

&nbsp;   {

&nbsp;       StartDate = DateTime.Now.AddDays(-30),

&nbsp;       EndDate = DateTime.Now

&nbsp;   };



&nbsp;   // Act

&nbsp;   var result = \_returnService.GetReturnStatistics(storeId, dateRange);



&nbsp;   // Assert

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.IsTrue(result.TotalReturns >= 0);

&nbsp;   Assert.IsTrue(result.AverageReturnRate >= 0);

}

```



\### 3. Stok Servisi Testleri



\#### 3.1 Stok Güncelleme

```csharp

\[Test]

public void UpdateInventory\_ValidData\_UpdatesStock()

{

&nbsp;   // Arrange

&nbsp;   var updateRequest = new UpdateInventoryRequest

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       ProductName = "Test Ürün",

&nbsp;       NewStock = 50

&nbsp;   };



&nbsp;   // Act

&nbsp;   var result = \_inventoryService.UpdateInventory(updateRequest);



&nbsp;   // Assert

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.AreEqual(50, result.CurrentStock);

&nbsp;   Assert.AreEqual(DateTime.Now.Date, result.LastUpdated.Date);

}

```



\#### 3.2 Düşük Stok Uyarısı

```csharp

\[Test]

public void CheckLowStock\_StockBelowMinimum\_ReturnsWarning()

{

&nbsp;   // Arrange

&nbsp;   int storeId = 1;



&nbsp;   // Act

&nbsp;   var result = \_inventoryService.CheckLowStock(storeId);



&nbsp;   // Assert

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.IsTrue(result.Any(x => x.CurrentStock < x.MinStockLevel));

}

```



\## 🔗 Integration Test Senaryoları



\### 1. API Endpoint Testleri



\#### 1.1 Satış API - POST /api/satis

```csharp

\[Test]

public async Task CreateSale\_ValidRequest\_Returns201Created()

{

&nbsp;   // Arrange

&nbsp;   var request = new CreateSaleRequest

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       ProductName = "Test Ürün",

&nbsp;       Quantity = 3,

&nbsp;       UnitPrice = 150.00m

&nbsp;   };



&nbsp;   // Act

&nbsp;   var response = await \_client.PostAsJsonAsync("/api/satis", request);



&nbsp;   // Assert

&nbsp;   Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);

&nbsp;   var result = await response.Content.ReadFromJsonAsync<SaleResponse>();

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.AreEqual(450.00m, result.TotalPrice);

}

```



\#### 1.2 Satış API - GET /api/satis

```csharp

\[Test]

public async Task GetSales\_ValidRequest\_Returns200Ok()

{

&nbsp;   // Act

&nbsp;   var response = await \_client.GetAsync("/api/satis?page=1\&pageSize=10");



&nbsp;   // Assert

&nbsp;   Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);

&nbsp;   var result = await response.Content.ReadFromJsonAsync<PagedResponse<SaleResponse>>();

&nbsp;   Assert.IsNotNull(result);

&nbsp;   Assert.IsTrue(result.Items.Count <= 10);

}

```



\#### 1.3 İade API - POST /api/iade

```csharp

\[Test]

public async Task CreateReturn\_ValidRequest\_Returns201Created()

{

&nbsp;   // Arrange

&nbsp;   var request = new CreateReturnRequest

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       SaleId = 1,

&nbsp;       ProductName = "Test Ürün",

&nbsp;       Quantity = 1,

&nbsp;       ReturnReason = "Müşteri memnuniyetsizliği"

&nbsp;   };



&nbsp;   // Act

&nbsp;   var response = await \_client.PostAsJsonAsync("/api/iade", request);



&nbsp;   // Assert

&nbsp;   Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);

}

```



\### 2. Veritabanı Entegrasyon Testleri



\#### 2.1 Satış Veritabanı İşlemleri

```csharp

\[Test]

public async Task SaveSale\_ValidData\_SavesToDatabase()

{

&nbsp;   // Arrange

&nbsp;   var sale = new Sale

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       ProductName = "Test Ürün",

&nbsp;       Quantity = 5,

&nbsp;       UnitPrice = 100.00m,

&nbsp;       TotalPrice = 500.00m,

&nbsp;       SaleDate = DateTime.Now

&nbsp;   };



&nbsp;   // Act

&nbsp;   \_context.Sales.Add(sale);

&nbsp;   await \_context.SaveChangesAsync();



&nbsp;   // Assert

&nbsp;   var savedSale = await \_context.Sales.FindAsync(sale.Id);

&nbsp;   Assert.IsNotNull(savedSale);

&nbsp;   Assert.AreEqual("Test Ürün", savedSale.ProductName);

}

```



\#### 2.2 İade Veritabanı İşlemleri

```csharp

\[Test]

public async Task SaveReturn\_ValidData\_SavesToDatabase()

{

&nbsp;   // Arrange

&nbsp;   var returnItem = new Return

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       SaleId = 1,

&nbsp;       ProductName = "Test Ürün",

&nbsp;       Quantity = 2,

&nbsp;       ReturnReason = "Kusurlu ürün",

&nbsp;       ReturnDate = DateTime.Now

&nbsp;   };



&nbsp;   // Act

&nbsp;   \_context.Returns.Add(returnItem);

&nbsp;   await \_context.SaveChangesAsync();



&nbsp;   // Assert

&nbsp;   var savedReturn = await \_context.Returns.FindAsync(returnItem.Id);

&nbsp;   Assert.IsNotNull(savedReturn);

&nbsp;   Assert.AreEqual("Kusurlu ürün", savedReturn.ReturnReason);

}

```



\## 🔐 Security Test Senaryoları



\### 1. Authentication Testleri



\#### 1.1 Geçersiz Token

```csharp

\[Test]

public async Task AccessProtectedEndpoint\_InvalidToken\_Returns401Unauthorized()

{

&nbsp;   // Arrange

&nbsp;   \_client.DefaultRequestHeaders.Authorization = 

&nbsp;       new AuthenticationHeaderValue("Bearer", "invalid-token");



&nbsp;   // Act

&nbsp;   var response = await \_client.GetAsync("/api/satis");



&nbsp;   // Assert

&nbsp;   Assert.AreEqual(HttpStatusCode.Unauthorized, response.StatusCode);

}

```



\#### 1.2 Geçersiz Role

```csharp

\[Test]

public async Task AccessAdminEndpoint\_UserRole\_Returns403Forbidden()

{

&nbsp;   // Arrange

&nbsp;   var userToken = await GetUserToken(); // User role

&nbsp;   \_client.DefaultRequestHeaders.Authorization = 

&nbsp;       new AuthenticationHeaderValue("Bearer", userToken);



&nbsp;   // Act

&nbsp;   var response = await \_client.GetAsync("/api/admin/users");



&nbsp;   // Assert

&nbsp;   Assert.AreEqual(HttpStatusCode.Forbidden, response.StatusCode);

}

```



\### 2. Input Validation Testleri



\#### 2.1 SQL Injection Testi

```csharp

\[Test]

public async Task SearchSales\_SqlInjectionAttempt\_ReturnsBadRequest()

{

&nbsp;   // Arrange

&nbsp;   var maliciousInput = "'; DROP TABLE Sales; --";



&nbsp;   // Act

&nbsp;   var response = await \_client.GetAsync($"/api/satis?search={maliciousInput}");



&nbsp;   // Assert

&nbsp;   Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);

}

```



\#### 2.2 XSS Testi

```csharp

\[Test]

public async Task CreateSale\_XssAttempt\_ReturnsBadRequest()

{

&nbsp;   // Arrange

&nbsp;   var request = new CreateSaleRequest

&nbsp;   {

&nbsp;       StoreId = 1,

&nbsp;       ProductName = "<script>alert('xss')</script>",

&nbsp;       Quantity = 1,

&nbsp;       UnitPrice = 100.00m

&nbsp;   };



&nbsp;   // Act

&nbsp;   var response = await \_client.PostAsJsonAsync("/api/satis", request);



&nbsp;   // Assert

&nbsp;   Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);

}

```



\## 📊 Performance Test Senaryoları



\### 1. Load Testing



\#### 1.1 Eşzamanlı Kullanıcı Testi

```csharp

\[Test]

public async Task LoadTest\_100ConcurrentUsers\_ResponseTimeUnder200ms()

{

&nbsp;   // Arrange

&nbsp;   var tasks = new List<Task<HttpResponseMessage>>();

&nbsp;   var stopwatch = Stopwatch.StartNew();



&nbsp;   // Act

&nbsp;   for (int i = 0; i < 100; i++)

&nbsp;   {

&nbsp;       tasks.Add(\_client.GetAsync("/api/satis"));

&nbsp;   }



&nbsp;   var responses = await Task.WhenAll(tasks);

&nbsp;   stopwatch.Stop();



&nbsp;   // Assert

&nbsp;   Assert.IsTrue(stopwatch.ElapsedMilliseconds < 200);

&nbsp;   Assert.IsTrue(responses.All(r => r.IsSuccessStatusCode));

}

```



\#### 1.2 Database Performance Testi

```csharp

\[Test]

public async Task DatabaseQuery\_1000Records\_ResponseTimeUnder100ms()

{

&nbsp;   // Arrange

&nbsp;   var stopwatch = Stopwatch.StartNew();



&nbsp;   // Act

&nbsp;   var result = await \_saleService.GetSales(new PaginationRequest 

&nbsp;   { 

&nbsp;       Page = 1, 

&nbsp;       PageSize = 1000 

&nbsp;   });

&nbsp;   stopwatch.Stop();



&nbsp;   // Assert

&nbsp;   Assert.IsTrue(stopwatch.ElapsedMilliseconds < 100);

&nbsp;   Assert.AreEqual(1000, result.Items.Count);

}

```



\### 2. Stress Testing



\#### 2.1 Yüksek Veri Yükleme

```csharp

\[Test]

public async Task StressTest\_10000Sales\_HandlesLoad()

{

&nbsp;   // Arrange

&nbsp;   var sales = new List<CreateSaleRequest>();

&nbsp;   for (int i = 0; i < 10000; i++)

&nbsp;   {

&nbsp;       sales.Add(new CreateSaleRequest

&nbsp;       {

&nbsp;           StoreId = 1,

&nbsp;           ProductName = $"Ürün {i}",

&nbsp;           Quantity = 1,

&nbsp;           UnitPrice = 100.00m

&nbsp;       });

&nbsp;   }



&nbsp;   // Act

&nbsp;   var tasks = sales.Select(s => \_client.PostAsJsonAsync("/api/satis", s));

&nbsp;   var responses = await Task.WhenAll(tasks);



&nbsp;   // Assert

&nbsp;   Assert.IsTrue(responses.All(r => r.IsSuccessStatusCode));

}

```



\##  UI Test Senaryoları



\### 1. Dashboard Testleri



\#### 1.1 Dashboard Yükleme

```csharp

\[Test]

public async Task Dashboard\_LoadsSuccessfully\_DisplaysAllComponents()

{

&nbsp;   // Act

&nbsp;   await \_page.GotoAsync("/dashboard");



&nbsp;   // Assert

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='active-stores']")).ToBeVisibleAsync();

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='total-sales']")).ToBeVisibleAsync();

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='total-returns']")).ToBeVisibleAsync();

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='total-inventory']")).ToBeVisibleAsync();

}

```



\#### 1.2 Grafik Güncelleme

```csharp

\[Test]

public async Task Dashboard\_DataUpdate\_ChartsRefresh()

{

&nbsp;   // Arrange

&nbsp;   await \_page.GotoAsync("/dashboard");

&nbsp;   var initialChartData = await \_page.Locator("\[data-testid='sales-chart']").TextContentAsync();



&nbsp;   // Act

&nbsp;   await \_page.ClickAsync("\[data-testid='refresh-button']");

&nbsp;   await \_page.WaitForTimeoutAsync(2000);



&nbsp;   // Assert

&nbsp;   var updatedChartData = await \_page.Locator("\[data-testid='sales-chart']").TextContentAsync();

&nbsp;   Assert.AreNotEqual(initialChartData, updatedChartData);

}

```



\### 2. Form Testleri



\#### 2.1 Satış Formu

```csharp

\[Test]

public async Task SalesForm\_ValidData\_SubmitsSuccessfully()

{

&nbsp;   // Arrange

&nbsp;   await \_page.GotoAsync("/sales/new");



&nbsp;   // Act

&nbsp;   await \_page.FillAsync("\[data-testid='product-name']", "Test Ürün");

&nbsp;   await \_page.FillAsync("\[data-testid='quantity']", "5");

&nbsp;   await \_page.FillAsync("\[data-testid='unit-price']", "100");

&nbsp;   await \_page.ClickAsync("\[data-testid='submit-button']");



&nbsp;   // Assert

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='success-message']")).ToBeVisibleAsync();

}

```



\#### 2.2 Form Validation

```csharp

\[Test]

public async Task SalesForm\_InvalidData\_ShowsValidationErrors()

{

&nbsp;   // Arrange

&nbsp;   await \_page.GotoAsync("/sales/new");



&nbsp;   // Act

&nbsp;   await \_page.ClickAsync("\[data-testid='submit-button']");



&nbsp;   // Assert

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='product-name-error']")).ToBeVisibleAsync();

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='quantity-error']")).ToBeVisibleAsync();

&nbsp;   await Assertions.Expect(\_page.Locator("\[data-testid='unit-price-error']")).ToBeVisibleAsync();

}

```



\## 📋 Test Çalıştırma Talimatları



\### 1. Unit Testleri Çalıştırma

```bash

\# Backend klasöründe

cd backend/LCDataViev.API

dotnet test

```



\### 2. Integration Testleri Çalıştırma

```bash

\# Test projesi klasöründe

dotnet test --filter Category=Integration

```



\### 3. Performance Testleri Çalıştırma

```bash

\# Performance test projesi klasöründe

dotnet test --filter Category=Performance

```



\### 4. UI Testleri Çalıştırma

```bash

\# Frontend klasöründe

npm test

```



\## ✅ Test Sonuçları Raporlama



\### 1. Test Coverage

\- Unit Test Coverage: %90+

\- Integration Test Coverage: %80+

\- UI Test Coverage: %70+



\### 2. Performance Metrikleri

\- API Response Time: < 200ms

\- Database Query Time: < 100ms

\- UI Load Time: < 2s



\### 3. Güvenlik Testleri

\- Authentication: %100

\- Authorization: %100

\- Input Validation: %100

\- SQL Injection Protection: %100

\- XSS Protection: %100



\## 🚀 Test Otomasyonu



\### 1. CI/CD Pipeline

```yaml

\# .github/workflows/test.yml

name: Test Pipeline

on: \[push, pull\_request]

jobs:

&nbsp; test:

&nbsp;   runs-on: ubuntu-latest

&nbsp;   steps:

&nbsp;     - uses: actions/checkout@v2

&nbsp;     - name: Setup .NET

&nbsp;       uses: actions/setup-dotnet@v1

&nbsp;       with:

&nbsp;         dotnet-version: 9.0.x

&nbsp;     - name: Run Unit Tests

&nbsp;       run: dotnet test --no-build --verbosity normal

&nbsp;     - name: Run Integration Tests

&nbsp;       run: dotnet test --filter Category=Integration

&nbsp;     - name: Run Performance Tests

&nbsp;       run: dotnet test --filter Category=Performance

```



\### 2. Test Raporlama

\- Test sonuçları HTML raporu olarak oluşturulur

\- Coverage raporu GitHub Actions'da görüntülenir

\- Performance metrikleri grafik olarak raporlanır

