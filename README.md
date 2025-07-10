cat > README.md << 'EOF'
# LCW Data Aggregate Project

## �� Proje Açıklaması

Client-Side Data Aggregate sistemi - Mağazalardan veri toplayan, işleyen ve görselleştiren kapsamlı bir sistem.

## ��️ Teknoloji Stack'i

### Backend
- **.NET 9** - Web API
- **Entity Framework Core** - ORM
- **PostgreSQL** - Ana veritabanı
- **MongoDB** - Loglama
- **Redis** - Cache
- **OpenId Connect** - Authentication

### Frontend
- **React** - UI Framework
- **TypeScript** - Type Safety
- **Material-UI/Ant Design** - UI Components
- **Chart.js/Recharts** - Grafikler

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Elasticsearch** - Log Analytics (Opsiyonel)
- **Kibana** - Monitoring (Opsiyonel)

## 🚀 Kurulum

### Gereksinimler
- .NET 9 SDK
- Node.js 18+
- PostgreSQL
- Redis
- MongoDB

### Backend Kurulumu
```bash
cd backend/LCDataViev.API
dotnet restore
dotnet run
```

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

## �� API Endpoints

### V1 Özellikleri
- `/api/satis` - Satış işlemleri
- `/api/iade` - İade işlemleri
- `/api/stok` - Stok işlemleri
- `/api/dashboard` - Dashboard verileri

## 📈 Dashboard Özellikleri

- **V1:** Aktif Mağaza Sayısı
- **V2:** Anlık Toplam Stok, İade, Satış
- **V3:** Mağaza bazlı veriler
- **V4:** Son 1 haftalık kümülatif toplamlar

## �� Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## �� Geliştirici

- **Ayrıl Gökdeniz** - *İlk Geliştirici*
EOF