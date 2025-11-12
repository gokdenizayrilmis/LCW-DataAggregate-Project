# LCW Data Aggregate Project

## 🚀 Proje Özeti

LC Waikiki mağazalarının satış, stok, kullanıcı ve mağaza yönetimini merkezi ve güvenli şekilde yöneten, modern web teknolojileriyle geliştirilmiş bir veri toplama ve yönetim sistemidir. Hem mağaza yöneticileri hem de adminler için dinamik dashboard ve detaylı raporlama sunar.

---

## 🏗️ Kullanılan Teknolojiler

| Katman    | Teknoloji                | Nerede & Neden Kullanıldı? |
|-----------|-------------------------|----------------------------|
| Backend   | **.NET Core 9.0**       | API geliştirme, yüksek performans, cross-platform destek |
|           | **Entity Framework Core 9.0.7** | ORM, migration, LINQ ile kolay veri erişimi |
|           | **SQLite**              | Hafif, serverless veritabanı, kolay kurulum |
|           | **BCrypt.Net-Next**     | Şifrelerin güvenli şekilde hash’lenmesi |
|           | **Serilog**             | Yapılandırılmış loglama ve hata takibi |
|           | **Repository Pattern**  | Veri erişim soyutlaması, test edilebilirlik |
|           | **JWT Authentication**  | Token tabanlı kimlik doğrulama ve rol yönetimi |
| Frontend  | **React 19.1.0**        | Modern, component tabanlı kullanıcı arayüzü |
|           | **TypeScript 4.9.5**    | Tip güvenliği, daha sağlam kod |
|           | **Material-UI (MUI) 7.2.0** | Hazır ve özelleştirilebilir UI bileşenleri, responsive tasarım |
|           | **React Router DOM 6.28.0** | SPA yönlendirme ve sayfa yönetimi |
|           | **Jest**                | Frontend birim testleri |
| DevOps    | **Git & GitHub**        | Sürüm kontrolü, işbirliği, CI/CD |
|           | **npm & NuGet**         | Paket yönetimi |

---

## 📦 Proje Klasör Yapısı

```
LCW-Project/
├── backend/LCDataViev.API/   # .NET Core Web API ve veri katmanı
├── frontend/lcw-frontend/    # Mağaza yönetim arayüzü (React)
├── frontend/lcw-admin-frontend/ # Admin paneli (React)
├── docs/                     # Gereksinimler, testler, teknoloji dokümantasyonu
```

---

## ⚙️ Kurulum & Çalıştırma

### Gereksinimler
- .NET 9 SDK
- Node.js 18+

### Backend Kurulumu
```bash
cd backend/LCDataViev.API
# Bağımlılıkları yükle
 dotnet restore
# Uygulamayı başlat
 dotnet run
```

### Frontend Kurulumu
```bash
cd frontend/lcw-frontend
npm install
npm start
```

Admin paneli için:
```bash
cd frontend/lcw-admin-frontend
npm install
npm start
```

---

## 🔑 Temel Özellikler
- Mağaza ve kullanıcı yönetimi (ekle, düzenle, sil)
- Satış, stok, iade işlemleri
- Gerçek zamanlı dashboard ve istatistikler
- JWT ile güvenli kimlik doğrulama
- Responsive ve modern kullanıcı arayüzü
- Bildirim ve loglama sistemi

---

## 📡 API Endpoint Örnekleri

| Endpoint                        | Açıklama                  |
|---------------------------------|---------------------------|
| `GET /api/stores`               | Tüm mağazaları listeler   |
| `POST /api/stores`              | Yeni mağaza ekler         |
| `GET /api/products/store/{id}`  | Mağazanın ürünlerini getir|
| `GET /api/employees/store/{id}` | Mağazanın çalışanlarını getir|
| `POST /api/auth/login`          | Kullanıcı girişi (JWT)    |

Daha fazla detay için: [`docs/`](./docs/) klasörüne bakınız.

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Yeni bir branch oluşturun (`git checkout -b feature/ozellik-adi`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'feat: açıklama'`)
4. Branch'i push'layın (`git push origin feature/ozellik-adi`)
5. Pull Request oluşturun

---

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

## 👨‍💻 Geliştirici

[Gökdeniz Ayrılmış](https://github.com/gokdenizayrilmis)

---

> **Not:** Proje ve teknolojiler hakkında detaylı açıklamalar için [`docs/tech-stack.md`](./docs/tech-stack.md) dosyasına göz atabilirsiniz.
