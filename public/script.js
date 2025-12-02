// =====================================================
// MÜTERCİM - OSMANLI METİN ÇEVİRMENİ
// TÜBİTAK Öğrenci Projesi
// =====================================================
// Bu dosya kullanıcı arayüzünü (frontend) yönetir.
// Resim yükleme, API iletişimi ve sonuç gösterme işlemleri.
// =====================================================

// =====================================================
// DOM ELEMENTLERİ
// =====================================================
// Sayfa yüklendiğinde tüm HTML elementlerini seçiyoruz
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const cameraInput = document.getElementById('cameraInput'); // Kamera inputu
const galleryInput = document.getElementById('galleryInput'); // Galeri inputu
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const translateBtn = document.getElementById('translateBtn');

// Sonuç alanları
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultsCards = document.getElementById('resultsCards');
const errorState = document.getElementById('errorState');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');

// Sonuç metinleri
const transcriptionText = document.getElementById('transcriptionText');
const translationText = document.getElementById('translationText');
const englishText = document.getElementById('englishText');

// Toast container
const toastContainer = document.getElementById('toastContainer');

// Seçilen dosyayı global olarak tutuyoruz
let selectedFile = null;

// =====================================================
// DOSYA YÜKLEME İŞLEMLERİ
// =====================================================

/**
 * Dosya seçildiğinde çalışan fonksiyon
 * @param {File} file - Seçilen dosya
 */
function handleFileSelect(file) {
    // DEBUG: Fonksiyon çağrıldığını göster
    console.log('🔵 handleFileSelect çağrıldı');
    
    // Dosya geçerli mi kontrol ediyoruz
    if (!file) {
        console.log('⚠️ Dosya seçilmedi');
        showToast('Dosya seçilemedi', 'error');
        return;
    }
    
    // DEBUG: Dosya bilgilerini göster
    const fileInfo = `Dosya: ${file.name}\nTür: ${file.type}\nBoyut: ${(file.size/1024).toFixed(1)} KB`;
    console.log('📷 Dosya bilgisi:', fileInfo);
    
    // Tüm resim türlerini kabul et - mobil uyumluluk için
    // Sadece boyut kontrolü yapalım
    
    // Dosya boyutu kontrolü (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showToast('Dosya boyutu 10 MB\'dan küçük olmalıdır', 'error');
        return;
    }
    
    // Dosya boyutu 0 ise hata
    if (file.size === 0) {
        showToast('Dosya boş görünüyor', 'error');
        return;
    }
    
    // Dosyayı kaydediyoruz
    selectedFile = file;
    showToast('Dosya alındı, yükleniyor...', 'success');
    
    // Önizleme gösteriyoruz
    const reader = new FileReader();
    
    reader.onload = function(e) {
        console.log('✅ Dosya okundu');
        
        try {
            previewImage.src = e.target.result;
            previewArea.classList.add('active');
            uploadArea.style.display = 'none';
            translateBtn.disabled = false;
            showToast('Görsel yüklendi!', 'success');
        } catch (err) {
            console.error('❌ Önizleme hatası:', err);
            showToast('Önizleme gösterilemedi: ' + err.message, 'error');
        }
    };
    
    reader.onerror = function(e) {
        console.error('❌ Dosya okuma hatası:', e);
        showToast('Dosya okunamadı: ' + (e.target.error?.message || 'Bilinmeyen hata'), 'error');
    };
    
    reader.onabort = function(e) {
        console.error('❌ Dosya okuma iptal edildi');
        showToast('Dosya okuma iptal edildi', 'error');
    };
    
    try {
        reader.readAsDataURL(file);
    } catch (err) {
        console.error('❌ readAsDataURL hatası:', err);
        showToast('Dosya işlenemedi: ' + err.message, 'error');
    }
    
    // Sonuç alanını temizliyoruz
    resetResultsArea();
}

/**
 * Dosyayı kaldırma fonksiyonu
 */
function removeFile() {
    selectedFile = null;
    fileInput.value = '';
    cameraInput.value = ''; // Kamera inputunu da temizle
    if (galleryInput) galleryInput.value = ''; // Galeri inputunu da temizle
    previewImage.src = '';
    previewArea.classList.remove('active');
    uploadArea.style.display = 'block';
    translateBtn.disabled = true;
    resetResultsArea();
}

/**
 * Sonuç alanını sıfırlama
 */
function resetResultsArea() {
    emptyState.style.display = 'flex';
    loadingState.classList.remove('active');
    resultsCards.classList.remove('active');
    errorState.classList.remove('active');
}

// =====================================================
// SÜRÜKLE-BIRAK İŞLEMLERİ
// =====================================================

// Dosya sürüklendiğinde alan stilini değiştiriyoruz
uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over');
});

// Dosya bırakıldığında işliyoruz
uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// Alana tıklanınca dosya seçme penceresini açıyoruz
uploadArea.addEventListener('click', function() {
    fileInput.click();
});

// Genel dosya işleme fonksiyonu
function processFileInput(e, source) {
    console.log(`📁 ${source} change eventi tetiklendi`);
    
    if (!e.target.files) {
        console.log('⚠️ files objesi yok');
        showToast(`${source}: Dosya alınamadı (files yok)`, 'error');
        return;
    }
    
    if (e.target.files.length === 0) {
        console.log('⚠️ Dosya seçilmedi veya iptal edildi');
        // İptal durumunda toast gösterme
        return;
    }
    
    const file = e.target.files[0];
    console.log(`📁 ${source} dosya:`, file.name, file.type, file.size);
    showToast(`${source}: Dosya algılandı`, 'success');
    
    handleFileSelect(file);
}

// Dosya seçme inputu
fileInput.addEventListener('change', function(e) {
    processFileInput(e, 'Dosya');
});

// Kamera inputu
cameraInput.addEventListener('change', function(e) {
    processFileInput(e, 'Kamera');
});

// Galeri inputu
if (galleryInput) {
    galleryInput.addEventListener('change', function(e) {
        processFileInput(e, 'Galeri');
    });
}

// Kaldır butonuna tıklama
removeBtn.addEventListener('click', removeFile);

// =====================================================
// MOBİL KAMERA YARDIMCI FONKSİYONLARI
// =====================================================

// Tüm input'ları temizleme fonksiyonu
function clearAllInputs() {
    fileInput.value = '';
    cameraInput.value = '';
    if (galleryInput) galleryInput.value = '';
}

// Kamera butonuna tıklandığında
const cameraBtnElement = document.querySelector('.camera-btn');
if (cameraBtnElement) {
    cameraBtnElement.addEventListener('click', function(e) {
        clearAllInputs();
        console.log('📷 Kamera butonu tıklandı');
    });
}

// Dosya seç butonuna tıklandığında  
const desktopBtnElement = document.querySelector('.desktop-only');
if (desktopBtnElement) {
    desktopBtnElement.addEventListener('click', function(e) {
        clearAllInputs();
        console.log('📁 Dosya seç butonu tıklandı');
    });
}

// =====================================================
// API İLETİŞİMİ
// =====================================================

/**
 * Çeviri işlemini başlatan fonksiyon
 */
async function startTranslation() {
    // Dosya seçili mi kontrol
    if (!selectedFile) {
        showToast('Lütfen önce bir resim seçin', 'error');
        return;
    }
    
    // Yükleniyor durumunu gösteriyoruz
    emptyState.style.display = 'none';
    errorState.classList.remove('active');
    resultsCards.classList.remove('active');
    loadingState.classList.add('active');
    translateBtn.disabled = true;
    
    console.log('🚀 Çeviri başlatılıyor...');
    
    try {
        // Form verisi oluşturuyoruz
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        // API'ye istek gönderiyoruz
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        // Yanıtı JSON olarak alıyoruz
        const result = await response.json();
        
        console.log('📨 API yanıtı:', result);
        
        // Sonucu işliyoruz
        if (result.success) {
            showResults(result.data);
        } else {
            showError(result.error || 'Bir hata oluştu');
        }
        
    } catch (error) {
        // Ağ hatası veya başka bir hata
        console.error('❌ Hata:', error);
        showError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
        translateBtn.disabled = false;
    }
}

/**
 * Sonuçları ekranda gösterme
 * @param {Object} data - API'den gelen veri
 */
function showResults(data) {
    loadingState.classList.remove('active');
    
    // Hata mesajı varsa
    if (data.error) {
        transcriptionText.textContent = data.error;
        translationText.textContent = data.error;
        englishText.textContent = data.error;
    } else {
        transcriptionText.textContent = data.transcription || 'Transkripsiyon bulunamadı';
        translationText.textContent = data.translation || 'Çeviri bulunamadı';
        englishText.textContent = data.english || 'English translation not available';
    }
    
    resultsCards.classList.add('active');
    
    showToast('Çeviri başarıyla tamamlandı!', 'success');
    console.log('✅ Sonuçlar gösterildi');
}

/**
 * Hata mesajı gösterme
 * @param {string} message - Hata mesajı
 */
function showError(message) {
    loadingState.classList.remove('active');
    resultsCards.classList.remove('active');
    
    errorText.textContent = message;
    errorState.classList.add('active');
    
    showToast(message, 'error');
    console.error('❌ Hata gösterildi:', message);
}

// Çevir butonuna tıklama
translateBtn.addEventListener('click', startTranslation);

// Tekrar dene butonuna tıklama
retryBtn.addEventListener('click', startTranslation);

// =====================================================
// KOPYALAMA İŞLEVİ
// =====================================================

// Tüm kopyala butonlarına olay dinleyici ekliyoruz
document.querySelectorAll('.copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        // Hangi metnin kopyalanacağını buluyoruz
        const targetId = this.getAttribute('data-target');
        const textElement = document.getElementById(targetId);
        
        if (textElement && textElement.textContent) {
            // Metni panoya kopyalıyoruz
            navigator.clipboard.writeText(textElement.textContent)
                .then(function() {
                    showToast('Metin panoya kopyalandı!', 'success');
                })
                .catch(function(err) {
                    console.error('Kopyalama hatası:', err);
                    showToast('Kopyalama başarısız oldu', 'error');
                });
        }
    });
});

// =====================================================
// TOAST BİLDİRİM SİSTEMİ
// =====================================================

/**
 * Ekranda toast bildirimi gösterme
 * @param {string} message - Gösterilecek mesaj
 * @param {string} type - Bildirim türü ('success' veya 'error')
 */
function showToast(message, type = 'success') {
    // Toast elementi oluşturuyoruz
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // İkon belirliyoruz
    const icon = type === 'success' ? '✓' : '⚠️';
    
    // Toast içeriği
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    
    // Toast'u container'a ekliyoruz
    toastContainer.appendChild(toast);
    
    // 3 saniye sonra kaldırıyoruz
    setTimeout(function() {
        toast.classList.add('removing');
        setTimeout(function() {
            toast.remove();
        }, 300); // Animasyon süresi
    }, 3000);
}

// =====================================================
// KLAVYE KISAYOLLARI
// =====================================================
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter ile çeviri başlat
    if (e.ctrlKey && e.key === 'Enter' && selectedFile && !translateBtn.disabled) {
        startTranslation();
    }
    
    // Escape ile dosyayı kaldır
    if (e.key === 'Escape' && selectedFile) {
        removeFile();
    }
});

// =====================================================
// SAYFA YÜKLENDİĞİNDE
// =====================================================
console.log('🏛️ Mütercim - Osmanlıca Çeviri Uygulaması yüklendi');
console.log('💡 İpucu: Ctrl + Enter ile hızlı çeviri yapabilirsiniz');

