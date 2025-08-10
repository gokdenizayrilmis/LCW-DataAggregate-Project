# LCW-Project Test Senaryoları & Kapsamı

---

## 1. Admin Girişi
- **Amaç:** Admin'in sisteme güvenli girişini test etmek
- **Nerede?**: Login ekranı, UserController, JWT token üretimi
- **Nasıl?**: Doğru bilgilerle girişte admin paneline yönlendirme, yanlışta hata mesajı

## 2. Mağaza Kullanıcı Girişi
- **Amaç:** Mağaza kullanıcısının sadece kendi paneline erişimini test etmek
- **Nerede?**: Login ekranı, StoreController, rol kontrolü
- **Nasıl?**: Mağaza email/şifre ile giriş, sadece kendi mağaza dashboard'u açılır

## 3. Mağaza Ekleme
- **Amaç:** Admin'in yeni mağaza ekleyebilmesini test etmek
- **Nerede?**: Admin paneli, StoreController, Store entity
- **Nasıl?**: Form doldurulup kaydedildiğinde mağaza listesine eklenir

## 4. Mağaza Bilgisi Güncelleme
- **Amaç:** Admin'in mağaza bilgilerini güncelleyebilmesini test etmek
- **Nerede?**: Admin paneli, StoreController
- **Nasıl?**: Bilgiler güncellenip kaydedildiğinde değişiklikler yansır

## 5. Mağaza Silme
- **Amaç:** Admin'in mağaza silebilmesini test etmek
- **Nerede?**: Admin paneli, StoreController
- **Nasıl?**: Silinen mağaza ve kullanıcıya erişim engellenir, log kaydı oluşur

## 6. Kullanıcı Yönetimi
- **Amaç:** Kullanıcı ekleme, düzenleme, silme işlemlerini test etmek
- **Nerede?**: Kullanıcı yönetimi sayfası, UserController
- **Nasıl?**: Her işlem sonrası kullanıcı listesi güncellenir, bildirim/log oluşur

## 7. Yetkisiz Erişim Kontrolü
- **Amaç:** Yetkisiz kullanıcıların admin işlemlerine erişimini engellemek
- **Nerede?**: API endpoint'lerinde rol kontrolü
- **Nasıl?**: Yetkisiz erişimde 403 Forbidden hatası döner

## 8. Bildirim Sistemi
- **Amaç:** Önemli işlemler sonrası bildirimlerin oluştuğunu test etmek
- **Nerede?**: NotificationController, frontend snackbar
- **Nasıl?**: İşlem sonrası anlık ve kalıcı bildirim oluşur

## 9. Raporlama ve İstatistikler
- **Amaç:** Raporların ve istatistiklerin doğru gösterilmesini test etmek
- **Nerede?**: DashboardPage, StoreDetailPage, ReportController
- **Nasıl?**: API'den alınan veriler doğru şekilde görselleştirilir

## 10. Performans ve Güvenlik
- **Amaç:** Temel işlemlerin hızlı ve güvenli tamamlandığını test etmek
- **Nerede?**: Backend async işlemler, JWT, BCrypt
- **Nasıl?**: Her işlem 5 saniyeden kısa sürer, şifreler hash'li saklanır

## 11. Tarayıcı Uyumluluğu
- **Amaç:** Uygulamanın modern tarayıcılarda sorunsuz çalıştığını test etmek
- **Nerede?**: Frontend responsive tasarım, MUI
- **Nasıl?**: Chrome, Firefox, Edge'de tüm fonksiyonlar çalışır

## 12. Yedekleme ve Loglama
- **Amaç:** Sistem loglarının ve veritabanı yedeklerinin tutulduğunu test etmek
- **Nerede?**: Serilog, veritabanı backup
- **Nasıl?**: Log ve yedek dosyaları düzenli oluşur

---

**Not:** Her test, sistemin hem fonksiyonel hem de güvenlik, performans ve bakım gereksinimlerini karşıladığını doğrular. Detaylar için kod ve API dokümantasyonuna bakınız.