\# Proje Gereksinim Dokümanı



\## 📋 Proje Genel Bakış



\### Proje Adı

LCW Data Aggregate Project



\### Proje Amacı

Mağazalardan veri toplayan, işleyen ve görselleştiren kapsamlı bir sistem geliştirmek.



\## 🎯 V1 Gereksinimleri



\### 1. Backend API Servisleri



\#### 1.1 Satış Servisi (`/api/satis`)

\- \*\*POST\*\* `/api/satis` - Yeni satış kaydetme

\- \*\*GET\*\* `/api/satis` - Satış listesi getirme

\- \*\*GET\*\* `/api/satis/{id}` - Belirli satış detayı

\- \*\*PUT\*\* `/api/satis/{id}` - Satış güncelleme

\- \*\*DELETE\*\* `/api/satis/{id}` - Satış silme

\- \*\*GET\*\* `/api/satis/istatistikler` - Satış istatistikleri



\#### 1.2 İade Servisi (`/api/iade`)

\- \*\*POST\*\* `/api/iade` - Yeni iade kaydetme

\- \*\*GET\*\* `/api/iade` - İade listesi getirme

\- \*\*GET\*\* `/api/iade/{id}` - Belirli iade detayı

\- \*\*PUT\*\* `/api/iade/{id}` - İade güncelleme

\- \*\*DELETE\*\* `/api/iade/{id}` - İade silme

\- \*\*GET\*\* `/api/iade/istatistikler` - İade istatistikleri



\#### 1.3 Stok Servisi (`/api/stok`)

\- \*\*POST\*\* `/api/stok` - Yeni stok kaydetme

\- \*\*GET\*\* `/api/stok` - Stok listesi getirme

\- \*\*GET\*\* `/api/stok/{id}` - Belirli stok detayı

\- \*\*PUT\*\* `/api/stok/{id}` - Stok güncelleme

\- \*\*DELETE\*\* `/api/stok/{id}` - Stok silme

\- \*\*GET\*\* `/api/stok/istatistikler` - Stok istatistikleri



\### 2. Loglama Sistemi



\#### 2.1 Loglanacak Bilgiler

\- Request \& Response verileri

\- Header bilgileri

\- Token bilgileri

\- Body içeriği

\- Timestamp

\- User bilgileri



\#### 2.2 Loglama Seviyeleri

\- \*\*INFO\*\*: Normal işlemler

\- \*\*WARNING\*\*: Uyarı durumları

\- \*\*ERROR\*\*: Hata durumları

\- \*\*DEBUG\*\*: Geliştirme bilgileri



\### 3. Dashboard Özellikleri



\#### 3.1 V1 - Aktif Mağaza Sayısı

\- Toplam aktif mağaza sayısı

\- Mağaza durumu (aktif/pasif)

\- Son güncelleme zamanı



\#### 3.2 V2 - Anlık Toplam Veriler

\- Anlık toplam stok miktarı

\- Anlık toplam satış sayısı

\- Anlık toplam iade sayısı

\- Grafik gösterimi



\#### 3.3 V3 - Mağaza Bazlı Veriler

\- Mağaza bazlı stok durumu

\- Mağaza bazlı satış verileri

\- Mağaza bazlı iade verileri

\- Karşılaştırmalı grafikler



\#### 3.4 V4 - Kümülatif Toplamlar

\- Son 1 haftalık toplam satış

\- Son 1 haftalık toplam iade

\- Son 1 haftalık stok değişimi

\- Trend analizi



\## 🔐 Güvenlik Gereksinimleri



\### 1. Authentication

\- OpenId Connect kullanımı

\- JWT token tabanlı authentication

\- Role-based authorization



\### 2. Authorization

\- \*\*Admin\*\*: Tüm işlemler

\- \*\*Manager\*\*: Mağaza bazlı işlemler

\- \*\*User\*\*: Sadece okuma işlemleri



\## 📊 Veritabanı Gereksinimleri



\### 1. PostgreSQL (Ana Veri)

\- Satış tablosu

\- İade tablosu

\- Stok tablosu

\- Mağaza tablosu

\- Kullanıcı tablosu



\### 2. MongoDB (Loglama)

\- API log tablosu

\- Error log tablosu

\- Performance log tablosu



\### 3. Redis (Cache)

\- Session cache

\- API response cache

\- Dashboard data cache



\## 🚀 Performans Gereksinimleri



\### 1. Response Time

\- API yanıt süresi: < 200ms

\- Dashboard yükleme: < 2 saniye

\- Grafik render: < 1 saniye



\### 2. Scalability

\- Eşzamanlı kullanıcı: 100+

\- Günlük API çağrısı: 10,000+

\- Veri boyutu: 1GB+



\## 📱 Kullanıcı Arayüzü Gereksinimleri



\### 1. Responsive Design

\- Desktop (1920x1080)

\- Tablet (768x1024)

\- Mobile (375x667)



\### 2. Browser Desteği

\- Chrome 90+

\- Firefox 88+

\- Safari 14+

\- Edge 90+



\## 🧪 Test Gereksinimleri



\### 1. Unit Tests

\- Her API endpoint için test

\- Business logic testleri

\- Repository testleri



\### 2. Integration Tests

\- API entegrasyon testleri

\- Database entegrasyon testleri

\- Authentication testleri



\### 3. Performance Tests

\- Load testing

\- Stress testing

\- Endurance testing



\## 📅 Proje Zaman Çizelgesi



\### Faz 1 (Hafta 1-2)

\- Backend temel yapı

\- Veritabanı kurulumu

\- İlk API endpoint'leri



\### Faz 2 (Hafta 3-4)

\- Authentication sistemi

\- Loglama sistemi

\- Temel dashboard



\### Faz 3 (Hafta 5-6)

\- Frontend geliştirme

\- Grafik entegrasyonu

\- UI/UX iyileştirmeleri



\### Faz 4 (Hafta 7-8)

\- Test ve optimizasyon

\- Deployment

\- Dokümantasyon



\## ✅ Kabul Kriterleri



\### 1. Fonksiyonel Gereksinimler

\- \[ ] Tüm API endpoint'leri çalışıyor

\- \[ ] Dashboard tüm özellikleri gösteriyor

\- \[ ] Authentication sistemi çalışıyor

\- \[ ] Loglama sistemi aktif



\### 2. Performans Kriterleri

\- \[ ] API response time < 200ms

\- \[ ] Dashboard load time < 2s

\- \[ ] 100+ eşzamanlı kullanıcı desteği



\### 3. Güvenlik Kriterleri

\- \[ ] JWT token doğrulama

\- \[ ] Role-based access control

\- \[ ] Input validation

\- \[ ] SQL injection koruması

