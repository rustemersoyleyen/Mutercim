# 🏛️ Mütercim - Osmanlı Türkçesi Metin Çevirici

<p align="center">
  <img src="public/logo.jpg" alt="Mütercim Logo" width="150">
</p>

<p align="center">
  Yapay Zeka Destekli Osmanlı Türkçesi Metin Çevirici
</p>

---

## 📝 Proje Hakkında

**Mütercim**, Osmanlı Türkçesi metinlerin fotoğraflarını:
- 📖 **Latin harflerine** çeviren (Transkripsiyon)
- 🗣️ **Günümüz Türkçesine** tercüme eden
- 🌍 **İngilizceye** çeviren

yapay zeka destekli bir web uygulamasıdır.

## ✨ Özellikler

- 📷 Görsel yükleme (sürükle-bırak destekli)
- 🤖 Google Gemini AI ile metin tanıma ve çeviri
- 📋 Sonuçları kopyalama
- 📱 Mobil uyumlu (responsive) tasarım
- ⚡ Hızlı ve kullanıcı dostu arayüz

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **Node.js** | Backend sunucusu |
| **Express.js** | Web framework |
| **Google Gemini AI** | Metin tanıma ve çeviri |
| **Multer** | Dosya yükleme |
| **HTML5/CSS3/JS** | Frontend arayüzü |

## 🚀 Kurulum

### 1. Projeyi İndirin

```bash
git clone https://github.com/KULLANICI_ADI/mutercim.git
cd mutercim
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. API Anahtarı Alın

1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. Anahtarı kopyalayın

### 4. Ortam Değişkenlerini Ayarlayın

```bash
# env.sample dosyasını .env olarak kopyalayın
copy env.sample .env

# .env dosyasını açın ve API anahtarınızı ekleyin
# GEMINI_API_KEY=sizin_api_anahtariniz
```

### 5. Sunucuyu Başlatın

```bash
npm start
```

### 6. Tarayıcıda Açın

```
http://localhost:3000
```

## 📁 Proje Yapısı

```
mutercim/
├── 📄 server.js          # Ana sunucu dosyası
├── 📄 package.json       # Proje bağımlılıkları
├── 📄 env.sample         # Örnek ortam değişkenleri
├── 📄 .gitignore         # Git ignore listesi
├── 📄 README.md          # Bu dosya
└── 📁 public/            # Frontend dosyaları
    ├── 📄 index.html     # Ana sayfa
    ├── 📄 style.css      # Stiller
    ├── 📄 script.js      # JavaScript kodu
    └── 🖼️ logo.png       # Proje logosu
```

## 📖 Kullanım

1. **Görsel Yükle**: Osmanlıca metin içeren bir görsel seçin veya sürükleyip bırakın
2. **Çevir**: "Çevir" butonuna tıklayın
3. **Sonuçları Görün**: Transkripsiyon ve çeviri sonuçları ekranda görünecektir
4. **Kopyala**: İsterseniz sonuçları panoya kopyalayabilirsiniz

### ⌨️ Klavye Kısayolları

| Kısayol | İşlev |
|---------|-------|
| `Ctrl + Enter` | Çeviriyi başlat |
| `Escape` | Görseli kaldır |

## ⚠️ Önemli Notlar

- API anahtarınızı **asla** GitHub'a yüklemeyin
- `.env` dosyası `.gitignore` listesindedir
- Maksimum dosya boyutu: **10 MB**
- Desteklenen formatlar: **JPEG, PNG, WEBP**

## 🔒 Güvenlik

- API anahtarları `.env` dosyasında saklanır
- `.env` dosyası Git'e dahil edilmez
- Sunucu tarafında dosya türü ve boyut kontrolü yapılır

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b ozellik/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin ozellik/YeniOzellik`)
5. Pull Request açın

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekip

- **Proje Adı**: Mütercim
- **Proje Türü**: TÜBİTAK Öğrenci Projesi
- **Yıl**: 2025

---

<p align="center">
  <strong>🏛️ Mütercim</strong> - Tarihle Geleceği Buluşturuyoruz
</p>

