# LCW-Project Gereksinimler & Karşılıkları

---

## 1. Kimlik Doğrulama ve Yetkilendirme
- **Nerede?**
  - Backend: .NET Core API, JWT Authentication, UserController
  - Frontend: Login ekranı, token kontrolü
- **Neden?**
  - Sisteme sadece yetkili kullanıcıların erişmesi için
- **Nasıl?**
  - Kullanıcılar girişte email/şifre girer, backend JWT token üretir, frontend localStorage'da saklar. API çağrılarında token ile kimlik doğrulama yapılır.

## 2. Mağaza Yönetimi
- **Nerede?**
  - Backend: StoreController, Store entity, StoreDto
  - Frontend: Admin paneli, mağaza ekle/düzenle/sil sayfaları
- **Neden?**
  - Mağazaların merkezi yönetimi ve takibi için
- **Nasıl?**
  - Admin yeni mağaza ekler, düzenler, siler. Tüm işlemler API üzerinden yapılır, değişiklikler anında frontend'de güncellenir.

## 3. Kullanıcı Yönetimi
- **Nerede?**
  - Backend: UserController, User entity
  - Frontend: Kullanıcı yönetimi sayfası
- **Neden?**
  - Her mağazanın ve adminin ayrı kullanıcı hesabı olması için
- **Nasıl?**
  - Admin kullanıcı ekler, mağazalara atar, şifreler BCrypt ile hash'lenir.

## 4. Satış ve Stok Yönetimi
- **Nerede?**
  - Backend: SaleController, InventoryController, ProductController
  - Frontend: Mağaza detayları, ürün ve stok sayfaları
- **Neden?**
  - Satış ve stok hareketlerinin izlenmesi için
- **Nasıl?**
  - Satış, iade, stok işlemleri API ile yapılır, veriler anlık güncellenir.

## 5. Bildirim Sistemi
- **Nerede?**
  - Backend: NotificationController, Notification entity
  - Frontend: Bildirim/snackbar bileşenleri
- **Neden?**
  - Kullanıcıya önemli işlemler sonrası bilgi vermek için
- **Nasıl?**
  - API işlemleri sonrası frontend'de anlık bildirim, backend'de kalıcı log kaydı oluşur.

## 6. Raporlama ve İstatistikler
- **Nerede?**
  - Backend: ReportController, WeeklySaleController
  - Frontend: DashboardPage, StoreDetailPage
- **Neden?**
  - Yönetimsel kararlar için özet ve detaylı veri sunmak için
- **Nasıl?**
  - API'den alınan veriler frontend'de grafik ve tablo olarak gösterilir.

## 7. Güvenlik
- **Nerede?**
  - Backend: JWT, BCrypt, rol bazlı endpoint koruması
  - Frontend: Token kontrolü, input validation
- **Neden?**
  - Yetkisiz erişimi ve veri sızıntısını önlemek için
- **Nasıl?**
  - Tüm hassas işlemler için kimlik doğrulama ve rol kontrolü yapılır.

## 8. Performans
- **Nerede?**
  - Backend: Optimize sorgular, async işlemler
  - Frontend: Lazy loading, memoization
- **Neden?**
  - Hızlı ve akıcı kullanıcı deneyimi için
- **Nasıl?**
  - Backend'de asenkron sorgular, frontend'de gereksiz render önlenir.

## 9. Yedekleme ve Loglama
- **Nerede?**
  - Backend: Serilog, günlük yedekleme
- **Neden?**
  - Veri kaybını ve hataları önlemek için
- **Nasıl?**
  - Tüm işlemler loglanır, veritabanı düzenli yedeklenir.

---

**Not:** Her gereksinim, ilgili controller, entity ve frontend sayfasında kod ile karşılanmıştır. Detaylar için kod ve API dokümantasyonuna bakınız.
