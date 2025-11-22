// sidebar.js - ملف JavaScript للتحكم في القائمة الجانبية

// تهيئة القائمة الجانبية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-open');
    const closeBtn = document.getElementById('sidebar-close');
    const overlay = document.getElementById('overlay');
    
    // التحقق من وجود العناصر قبل إضافة الأحداث
    if (sidebar && openBtn && closeBtn && overlay) {
        // فتح القائمة
        openBtn.addEventListener('click', openSidebar);
        
        // إغلاق القائمة
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);
        
        // إغلاق بالزر ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        });
    } else {
        console.error('عناصر القائمة الجانبية غير موجودة!');
    }
});

// وظيفة فتح القائمة
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // منع التمرير عند فتح القائمة
}

// وظيفة إغلاق القائمة
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // استعادة التمرير
}

// (اختياري) ديناميكية تحميل محتوى القائمة
export function loadSidebarContent(content) {
    const contentArea = document.getElementById('sidebar-content');
    if (contentArea) {
        contentArea.innerHTML = content;
    }
}