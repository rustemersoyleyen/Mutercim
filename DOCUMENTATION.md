# 📜 Mütercim: Kültürel Mirasın Dijital Dönüşümü

## Teknik Dokümantasyon ve Proje Raporu

---

## 1. Proje Özeti

**Mütercim**, Osmanlı Türkçesi ile yazılmış tarihi belgelerin dijitalleştirilmesi ve günümüz diline çevrilmesi amacıyla geliştirilmiş yapay zeka destekli bir web uygulamasıdır. Uygulama, kullanıcıların mobil cihaz veya bilgisayar aracılığıyla yükledikleri Osmanlı Türkçesi metin görsellerini:

- **Latin harflerine** transkribe eder
- **Günümüz Türkçesine** çevirir
- **İngilizceye** tercüme eder

---

## 2. Metodoloji

### 2.1. Veri Toplama ve İşleme

#### 2.1.1. Veri Kaynakları

Projede kullanılan veriler, çeşitli kaynaklardan elde edilen Osmanlı Türkçesi belgelerden oluşmaktadır:
- Tarihi arşiv belgeleri
- El yazması metinler
- Matbu (basılı) Osmanlı Türkçesi dökümanlar
- Kitabe ve yazıt fotoğrafları

#### 2.1.2. Veri Formatları

Uygulama aşağıdaki görsel formatlarını desteklemektedir:
- JPEG/JPG
- PNG
- WebP
- HEIC/HEIF (iOS cihazlar için)

#### 2.1.3. Veri Toplama Süreci

Veriler, mobil cihaz kameralarıyla alınan yüksek çözünürlüklü fotoğraflardan elde edilmiştir. Görüntüler, uygulama tarafından otomatik olarak işlenmekte ve yapay zeka modeline aktarılmaktadır.

**Ön İşleme Aşamaları:**
- Görüntü boyutu optimizasyonu (maksimum 10 MB)
- Format dönüşümü (Base64 kodlama)
- MIME type doğrulama

---

### 2.2. Uygulama Geliştirme Süreci

Proje kapsamında geliştirilen uygulamada modern web teknolojileri kullanılmıştır:

#### 2.2.1. Backend Teknolojileri

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| Node.js | v18+ | Sunucu tarafı çalışma ortamı |
| Express.js | v4.21 | Web uygulama çerçevesi |
| Multer | v1.4.5 | Dosya yükleme işlemleri |
| dotenv | v16.4 | Ortam değişkenleri yönetimi |

#### 2.2.2. Frontend Teknolojileri

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| HTML5 | Sayfa yapısı |
| CSS3 | Stil ve responsive tasarım |
| Vanilla JavaScript | Dinamik etkileşimler |
| Google Fonts | Tipografi (Amiri, Crimson Pro, Inter) |

#### 2.2.3. Yapay Zeka Entegrasyonu

Uygulama, **Google Gemini 2.5 Pro** modelini kullanmaktadır. Bu model:
- Çok modlu (multimodal) yapay zeka yeteneklerine sahiptir
- Görsel ve metin verilerini birlikte işleyebilir
- Osmanlı Türkçesi karakterlerini yüksek doğrulukla tanıyabilir

---

### 2.3. Metin İşleme Bileşenleri

#### 2.3.1. Optik Karakter Tanıma (OCR)

Osmanlı Türkçesi harflerini tanımak amacıyla Google Gemini Vision API kullanılmıştır. Bu API:

- **Görsel Analiz:** Yüklenen görseldeki metin bölgelerini otomatik tespit eder
- **Karakter Tanıma:** Arap harfli Osmanlı Türkçesi karakterleri tanır
- **Bağlamsal Anlama:** Kelime ve cümle bağlamını değerlendirerek doğruluk oranını artırır

**Prompt Mühendisliği:**
```
Sen uzman bir Osmanlı tarihçisi ve dil bilimcisin.
Bu resimdeki Osmanlı Türkçesi metni dikkatli bir şekilde analiz et.
Metni satır satır oku, hiçbir kelimeyi atlama.
Transkripsiyon yaparken Osmanlı Türkçesi harflerin Latin karşılıklarını doğru kullan.
```

#### 2.3.2. Doğal Dil İşleme (NLP)

Tanınan metinler, yapay zeka modeli tarafından iki aşamada çevrilmektedir:

**Aşama 1: Türkçe Çeviri**
- Osmanlı Türkçesi kelimeler günümüz Türkçesine dönüştürülür
- Arkaik ifadeler modern karşılıklarıyla değiştirilir
- Dilbilgisi kuralları günümüz Türkçesine uyarlanır

**Aşama 2: İngilizce Çeviri**
- Türkçe metin İngilizceye çevrilir
- Kültürel bağlam korunarak anlam aktarımı sağlanır

---

## 3. Sistem Mimarisi

### 3.1. Genel Mimari

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Kullanıcı     │────▶│   Web Sunucu    │────▶│   Gemini API    │
│   (Tarayıcı)    │◀────│   (Express.js)  │◀────│   (Google AI)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 3.2. Veri Akışı

1. **Görsel Yükleme:** Kullanıcı fotoğraf yükler veya kamera ile çeker
2. **Ön İşleme:** Görsel Base64 formatına dönüştürülür
3. **API İsteği:** Görsel ve prompt Gemini API'ye gönderilir
4. **Yanıt İşleme:** JSON formatındaki yanıt ayrıştırılır
5. **Sonuç Gösterimi:** Transkripsiyon ve çeviriler kullanıcıya sunulur

---

## 4. Kullanıcı Arayüzü

### 4.1. Tasarım Prensipleri

- **Responsive Tasarım:** Mobil ve masaüstü cihazlarda uyumlu çalışma
- **Kullanıcı Dostu:** Sezgisel ve basit arayüz
- **Erişilebilirlik:** Farklı kullanıcı grupları için erişilebilir tasarım

### 4.2. Renk Paleti

| Renk | Kod | Kullanım |
|------|-----|----------|
| Krem | #dcdcc3 | Ana arka plan |
| Açık Krem | #f5f5e8 | Kartlar |
| Zeytin | #5c5c4a | Ana renk |
| Kahve | #8b7355 | Vurgu rengi |

### 4.3. Özellikler

- 📷 **Kamera Entegrasyonu:** Mobil cihazlardan doğrudan fotoğraf çekme
- 🖼️ **Galeri Seçimi:** Mevcut fotoğraflardan seçim yapma
- 📁 **Dosya Yükleme:** Sürükle-bırak destekli dosya yükleme
- 📋 **Kopyalama:** Sonuçları tek tıkla panoya kopyalama
- ⌨️ **Klavye Kısayolları:** Ctrl+Enter ile hızlı çeviri

---

## 5. Test ve Değerlendirme

### 5.1. Test Süreci

Uygulama, geliştirme sürecinde kapsamlı testlerden geçirilmiştir:

- **Birim Testleri:** API endpoint'leri ve fonksiyonlar
- **Entegrasyon Testleri:** Frontend-backend iletişimi
- **Kullanıcı Testleri:** Gerçek kullanıcılarla deneme

### 5.2. Performans Metrikleri

| Metrik | Değer |
|--------|-------|
| Ortalama Yanıt Süresi | 3-5 saniye |
| Maksimum Dosya Boyutu | 10 MB |
| Desteklenen Formatlar | 6 farklı format |

---

## 6. Güvenlik

### 6.1. Veri Güvenliği

- API anahtarları sunucu tarafında saklanır
- Kullanıcı verileri işlem sonrası saklanmaz
- HTTPS ile şifreli iletişim

### 6.2. Ortam Değişkenleri

Hassas bilgiler `.env` dosyasında saklanır ve versiyon kontrolüne dahil edilmez.

---

## 7. Dağıtım

### 7.1. Hosting

Uygulama **Vercel** platformunda barındırılmaktadır:
- Otomatik CI/CD pipeline
- Global CDN dağıtımı
- SSL sertifikası

### 7.2. Canlı Uygulama

🌐 **URL:** https://mutercim-theta.vercel.app

---

## 8. Gelecek Geliştirmeler

- [ ] Toplu belge işleme özelliği
- [ ] PDF çıktı alma
- [ ] Kelime sözlüğü entegrasyonu
- [ ] Offline çalışma modu
- [ ] Çoklu dil desteği (Arapça, Farsça)

---

## 9. Kaynaklar

1. Google Gemini API Documentation
2. Node.js Official Documentation
3. Express.js Guide
4. MDN Web Docs

---

## 10. İletişim

**Proje Adı:** Mütercim: Kültürel Mirasın Dijital Dönüşümü

**GitHub:** https://github.com/rustemersoyleyen/Mutercim

---

*Bu dokümantasyon, projenin teknik detaylarını ve geliştirme sürecini açıklamak amacıyla hazırlanmıştır.*

