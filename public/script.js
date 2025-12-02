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
    // Dosya geçerli mi kontrol ediyoruz
    if (!file) return;
    
    // Dosya türü kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showToast('Sadece resim dosyaları yüklenebilir (JPEG, PNG, WEBP)', 'error');
        return;
    }
    
    // Dosya boyutu kontrolü (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showToast('Dosya boyutu 10 MB\'dan küçük olmalıdır', 'error');
        return;
    }
    
    // Dosyayı kaydediyoruz
    selectedFile = file;
    
    // Önizleme gösteriyoruz
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewArea.classList.add('active');
        uploadArea.style.display = 'none';
        translateBtn.disabled = false;
    };
    reader.readAsDataURL(file);
    
    // Sonuç alanını temizliyoruz
    resetResultsArea();
    
    console.log('📷 Dosya seçildi:', file.name);
}

/**
 * Dosyayı kaldırma fonksiyonu
 */
function removeFile() {
    selectedFile = null;
    fileInput.value = '';
    cameraInput.value = ''; // Kamera inputunu da temizle
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

// Dosya seçme inputu değiştiğinde
fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Kamera inputu değiştiğinde (mobil için)
cameraInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Kaldır butonuna tıklama
removeBtn.addEventListener('click', removeFile);

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

