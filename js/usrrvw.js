// ملف js/usrrvw.js

// تعريف الكائنات والمتغيرات العامة
const audioPlayers = {
    player1: {
        id: 'playBtn1',
        progressBar: 'progressBar1',
        progress: 'progress1',
        currentTime: 'currentTime1',
        duration: 'duration1',
        audioIcon: null,
        interval: null,
        playing: false,
        durationSeconds: 105, // 1:45
        currentSeconds: 0
    },
    player2: {
        id: 'playBtn2',
        progressBar: 'progressBar2',
        progress: 'progress2',
        currentTime: 'currentTime2',
        duration: 'duration2',
        audioIcon: null,
        interval: null,
        playing: false,
        durationSeconds: 150, // 2:30
        currentSeconds: 0
    },
    player3: {
        id: 'playBtn3',
        progressBar: 'progressBar3',
        progress: 'progress3',
        currentTime: 'currentTime3',
        duration: 'duration3',
        audioIcon: null,
        interval: null,
        playing: false,
        durationSeconds: 75, // 1:15
        currentSeconds: 0
    }
};

// تهيئة المشغلات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل الفلاتر
    setupFilters();
    
    // تفعيل مشغلات الصوت
    setupAudioPlayers();
    
    // تفعيل تأثيرات ظهور البطاقات
    animateCards();
});

// وظيفة تفعيل الفلاتر
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mediaCards = document.querySelectorAll('.media-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // إزالة النشط من جميع الأزرار
            filterBtns.forEach(b => b.classList.remove('active'));
            // إضافة النشط للزر المحدد
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // تطبيق الفلتر
            mediaCards.forEach(card => {
                const type = card.getAttribute('data-type');
                const rating = card.getAttribute('data-rating');
                
                let show = false;
                
                switch(filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'screenshot':
                        show = type === 'screenshot';
                        break;
                    case 'audio':
                        show = type === 'audio';
                        break;
                    case '5':
                        show = rating === '5';
                        break;
                    default:
                        show = true;
                }
                
                if(show) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// وظيفة تفعيل مشغلات الصوت
function setupAudioPlayers() {
    // تهيئة كل مشغل صوتي
    for (const playerKey in audioPlayers) {
        const player = audioPlayers[playerKey];
        
        // العثور على عناصر المشغل في DOM
        const playBtn = document.getElementById(player.id);
        const progressBar = document.getElementById(player.progressBar);
        const progress = document.getElementById(player.progress);
        const currentTimeEl = document.getElementById(player.currentTime);
        const durationEl = document.getElementById(player.duration);
        
        // الحصول على أيقونة الصوت في البطاقة
        player.audioIcon = playBtn.closest('.media-card').querySelector('.audio-icon');
        
        // تعيين المدة الثابتة
        durationEl.textContent = formatTime(player.durationSeconds);
        
        // حدث النقر على زر التشغيل
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            if (player.playing) {
                // إيقاف التشغيل
                pausePlayer(player);
                icon.classList.replace('fa-pause', 'fa-play');
            } else {
                // بدء التشغيل
                playPlayer(player);
                icon.classList.replace('fa-play', 'fa-pause');
            }
        });
        
        // حدث النقر على شريط التقدم
        progressBar.addEventListener('click', function(e) {
            if (player.playing) {
                const rect = this.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                player.currentSeconds = Math.floor(pos * player.durationSeconds);
                updateProgress(player);
            }
        });
    }
}

// وظيفة تشغيل الصوت
function playPlayer(player) {
    player.playing = true;
    player.audioIcon.style.color = '#06d6a0';
    player.audioIcon.style.transform = 'scale(1.1)';
    
    // بدء تحديث التقدم
    player.interval = setInterval(() => {
        player.currentSeconds++;
        
        if (player.currentSeconds >= player.durationSeconds) {
            pausePlayer(player);
            player.currentSeconds = 0;
            const playBtn = document.getElementById(player.id);
            playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            return;
        }
        
        updateProgress(player);
    }, 1000);
    
    updateProgress(player);
}

// وظيفة إيقاف الصوت
function pausePlayer(player) {
    player.playing = false;
    player.audioIcon.style.color = '#ffd166';
    player.audioIcon.style.transform = 'scale(1)';
    clearInterval(player.interval);
}

// وظيفة تحديث شريط التقدم والوقت
function updateProgress(player) {
    const progress = document.getElementById(player.progress);
    const currentTimeEl = document.getElementById(player.currentTime);
    
    const progressPercent = (player.currentSeconds / player.durationSeconds) * 100;
    progress.style.width = `${progressPercent}%`;
    
    currentTimeEl.textContent = formatTime(player.currentSeconds);
}

// وظيفة تحويل الثواني إلى تنسيق الوقت (mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// وظيفة تأثيرات ظهور البطاقات
function animateCards() {
    const mediaCards = document.querySelectorAll('.media-card');
    
    mediaCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 200 * index);
    });
}