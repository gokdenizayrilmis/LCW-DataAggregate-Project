# Teknik Analiz Dokümanı

## ��️ Sistem Mimarisi

### 1. Genel Mimari

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Frontend │ │ Backend │ │ Database │
│ (React) │◄──►│ (.NET 9) │◄──►│ (PostgreSQL) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│
▼
┌─────────────────┐
│ Cache │
│ (Redis) │
└─────────────────┘
│
▼
┌─────────────────┐
│ Logging │
│ (MongoDB) │
└─────────────────┘


### 2. Backend Katman Mimarisi

┌─────────────────────────────────────────────────────────────┐
│ Presentation Layer │
│ (Controllers) │
├─────────────────────────────────────────────────────────────┤
│ Business Layer │
│ (Services) │
├─────────────────────────────────────────────────────────────┤
│ Data Access Layer │
│ (Repositories) │
├─────────────────────────────────────────────────────────────┤
│ Database Layer │
│ (Entity Framework) │
└─────────────────────────────────────────────────────────────┘


## 🗄️ Veritabanı Tasarımı

### 1. PostgreSQL Ana Veritabanı

#### 1.1 Mağaza Tablosu (Stores)
```sql
CREATE TABLE Stores (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address TEXT,
    Phone VARCHAR(20),
    Email VARCHAR(100),
    IsActive BOOLEAN DEFAULT true,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.2 Kullanıcı Tablosu (Users)
```sql
CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) DEFAULT 'User',
    StoreId INTEGER REFERENCES Stores(Id),
    IsActive BOOLEAN DEFAULT true,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.3 Satış Tablosu (Sales)
```sql
CREATE TABLE Sales (
    Id SERIAL PRIMARY KEY,
    StoreId INTEGER REFERENCES Stores(Id) NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    Quantity INTEGER NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    SaleDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER REFERENCES Users(Id),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.4 İade Tablosu (Returns)
```sql
CREATE TABLE Returns (
    Id SERIAL PRIMARY KEY,
    StoreId INTEGER REFERENCES Stores(Id) NOT NULL,
    SaleId INTEGER REFERENCES Sales(Id),
    ProductName VARCHAR(100) NOT NULL,
    Quantity INTEGER NOT NULL,
    ReturnReason TEXT,
    ReturnDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INTEGER REFERENCES Users(Id),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.5 Stok Tablosu (Inventory)
```sql
CREATE TABLE Inventory (
    Id SERIAL PRIMARY KEY,
    StoreId INTEGER REFERENCES Stores(Id) NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    CurrentStock INTEGER NOT NULL DEFAULT 0,
    MinStockLevel INTEGER DEFAULT 10,
    MaxStockLevel INTEGER DEFAULT 100,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. MongoDB Loglama Veritabanı

#### 2.1 API Log Koleksiyonu
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "level": "INFO|WARNING|ERROR|DEBUG",
  "endpoint": "/api/satis",
  "method": "POST",
  "userId": "user123",
  "storeId": 1,
  "request": {
    "headers": {},
    "body": {},
    "query": {}
  },
  "response": {
    "statusCode": 200,
    "body": {}
  },
  "executionTime": 150,
  "ipAddress": "192.168.1.1"
}
```

#### 2.2 Error Log Koleksiyonu
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "level": "ERROR",
  "message": "Database connection failed",
  "stackTrace": "...",
  "userId": "user123",
  "endpoint": "/api/satis",
  "requestData": {}
}
```

## 🔐 Authentication & Authorization

### 1. JWT Token Yapısı
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user123",
    "name": "John Doe",
    "role": "Manager",
    "storeId": 1,
    "iat": 1516239022,
    "exp": 1516242622
  },
  "signature": "..."
}
```

### 2. Role-Based Authorization
```csharp
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase { }

[Authorize(Roles = "Manager,Admin")]
public class ManagerController : ControllerBase { }

[Authorize(Roles = "User,Manager,Admin")]
public class UserController : ControllerBase { }
```

## �� API Endpoint Tasarımı

### 1. Satış API Endpoints

POST /api/satis - Yeni satış oluştur
GET /api/satis - Satış listesi getir
GET /api/satis/{id} - Belirli satış getir
PUT /api/satis/{id} - Satış güncelle
DELETE /api/satis/{id} - Satış sil
GET /api/satis/istatistikler - Satış istatistikleri
GET /api/satis/mağaza/{storeId} - Mağaza bazlı satışlar


### 2. İade API Endpoints

POST /api/iade - Yeni iade oluştur
GET /api/iade - İade listesi getir
GET /api/iade/{id} - Belirli iade getir
PUT /api/iade/{id} - İade güncelle
DELETE /api/iade/{id} - İade sil
GET /api/iade/istatistikler - İade istatistikleri
GET /api/iade/mağaza/{storeId} - Mağaza bazlı iadeler

### 3. Stok API Endpoints

POST /api/stok - Yeni stok kaydı oluştur
GET /api/stok - Stok listesi getir
GET /api/stok/{id} - Belirli stok getir
PUT /api/stok/{id} - Stok güncelle
DELETE /api/stok/{id} - Stok sil
GET /api/stok/istatistikler - Stok istatistikleri
GET /api/stok/mağaza/{storeId} - Mağaza bazlı stok


### 4. Dashboard API Endpoints

GET /api/dashboard/aktif-mağaza - Aktif mağaza sayısı
GET /api/dashboard/anlık-toplam - Anlık toplam veriler
GET /api/dashboard/mağaza-bazlı - Mağaza bazlı veriler
GET /api/dashboard/kümülatif - Kümülatif toplamlar

## �� Veri Akış Diyagramları

### 1. Satış İşlemi Akışı

Kullanıcı → Frontend → API → Service → Repository → Database
↑ ↓
←────────── Response ←──────────←──────────←──────────←


### 2. Dashboard Veri Akışı

Dashboard → API → Service → Repository → Database → Cache
↑ ↓
←────────── Response ←──────────←──────────←──────────←

### 3. Loglama Akışı

API Request → Middleware → Log Service → MongoDB
↓
API Response → Middleware → Log Service → MongoDB


## 🚀 Performance Optimizasyonu

### 1. Caching Stratejisi
- **Redis Cache**: API response'ları, dashboard verileri
- **Memory Cache**: Sık kullanılan veriler
- **Database Cache**: Query sonuçları

### 2. Database Optimizasyonu
- **Indexing**: Sık sorgulanan alanlar
- **Connection Pooling**: Veritabanı bağlantı yönetimi
- **Query Optimization**: Efektif SQL sorguları

### 3. API Optimizasyonu
- **Pagination**: Büyük veri setleri için
- **Compression**: Response sıkıştırma
- **Async/Await**: Asenkron işlemler

## 🔧 Teknik Gereksinimler

### 1. Backend Gereksinimleri
- **.NET 9 SDK**
- **Entity Framework Core 9**
- **PostgreSQL 15+**
- **Redis 7+**
- **MongoDB 6+**

### 2. Frontend Gereksinimleri
- **Node.js 18+**
- **React 18+**
- **TypeScript 5+**
- **Material-UI veya Ant Design**

### 3. DevOps Gereksinimleri
- **Docker 20+**
- **GitHub Actions**
- **Azure/AWS Cloud**

## 📊 Monitoring & Logging

### 1. Application Insights
- Performance monitoring
- Error tracking
- User analytics

### 2. Custom Logging
- Request/Response logging
- Business logic logging
- Security event logging

### 3. Health Checks
- Database connectivity
- External service health
- Application status

## �� Güvenlik Analizi

### 1. Authentication
- JWT token validation
- Password hashing (BCrypt)
- Session management

### 2. Authorization
- Role-based access control
- Resource-based permissions
- API endpoint protection

### 3. Data Security
- SQL injection prevention
- XSS protection
- CSRF protection
- Input validation

## 🧪 Test Stratejisi

### 1. Unit Tests
- Service layer testing
- Repository layer testing
- Business logic testing

### 2. Integration Tests
- API endpoint testing
- Database integration testing
- External service testing

### 3. Performance Tests
- Load testing (100+ concurrent users)
- Stress testing
- Endurance testing

## �� Scalability Plan

### 1. Horizontal Scaling
- Load balancer implementation
- Multiple API instances
- Database clustering

### 2. Vertical Scaling
- Server resource optimization
- Database performance tuning
- Cache optimization

### 3. Microservices Migration
- Service decomposition
- API gateway implementation
- Event-driven architecture
