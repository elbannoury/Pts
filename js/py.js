// بيانات الدفع
const paymentMethods = {
    paypal: {
        name: "باي بال",
        instructions: `
            <div class="payment-info">
                <p>لإكمال عملية الدفع عبر باي بال، يرجى إرسال المبلغ إلى حسابنا:</p>
                <span class="highlight">pitsiky.store@gmail.com</span>
                <p>بعد إتمام الدفع، يرجى إرسال لقطة شاشة لإثبات الدفع عبر واتساب.</p>
                
                <div class="screenshot-upload">
                    <label>أرفق لقطة شاشة للدفع:</label>
                    <input type="file" id="screenshot" class="file-input" accept="image/*">
                    <label for="screenshot" class="file-label">
                        <i class="fas fa-upload"></i> اختيار صورة
                    </label>
                </div>
                
                <a href="https://wa.me/212700720490?text=مرحباً، لقد قمت بالدفع عبر باي بال" class="whatsapp-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> إرسال عبر واتساب
                </a>
            </div>
        `
    },
    binance: {
        name: "بينانس",
        instructions: `
            <div class="payment-info">
                <p>لإكمال عملية الدفع عبر بينانس، يرجى إرسال العملة المشفرة إلى محفظتنا:</p>
                <span class="highlight">محفظة USDT (TRC20): TQaR7Vk8o7gFjLp9zM2nBt3XcW6eEdS4h</span>
                <p>بعد إتمام التحويل، يرجى إرسال لقطة شاشة لإثبات التحويل عبر واتساب.</p>
                
                <div class="screenshot-upload">
                    <label>أرفق لقطة شاشة للتحويل:</label>
                    <input type="file" id="screenshot" class="file-input" accept="image/*">
                    <label for="screenshot" class="file-label">
                        <i class="fas fa-upload"></i> اختيار صورة
                    </label>
                </div>
                
                <a href="https://wa.me/212700720490?text=مرحباً، لقد قمت بالدفع عبر بينانس" class="whatsapp-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> إرسال عبر واتساب
                </a>
            </div>
        `
    },
    bank: {
        name: "تحويل بنكي",
        instructions: `
            <div class="payment-info">
                <p>لإكمال عملية الدفع عبر التحويل البنكي، يرجى استخدام المعلومات التالية:</p>
                
                <div class="bank-details">
                    <div><strong>اسم البنك:</strong> CIH Bank</div>
                    <div><strong>اسم المستفيد:</strong> PITSIKY STORE</div>
                    <div><strong>رقم الحساب:</strong> 020 780 000000000000 60</div>
                    <div><strong>رقم IBAN:</strong> MA64 002 078 000000000000000060 60</div>
                </div>
                
                <p>بعد إتمام التحويل، يرجى إرسال لقطة شاشة لإثبات التحويل عبر واتساب.</p>
                
                <div class="screenshot-upload">
                    <label>أرفق لقطة شاشة للتحويل:</label>
                    <input type="file" id="screenshot" class="file-input" accept="image/*">
                    <label for="screenshot" class="file-label">
                        <i class="fas fa-upload"></i> اختيار صورة
                    </label>
                </div>
                
                <a href="https://wa.me/212700720490?text=مرحباً، لقد قمت بالتحويل البنكي" class="whatsapp-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> إرسال عبر واتساب
                </a>
            </div>
        `
    },
    cod: {
        name: "الدفع عند الاستلام",
        instructions: `
            <div class="payment-info">
                <p>لقد اخترت الدفع عند الاستلام. سيدفع العميل المبلغ عند استلام الطلب.</p>
                <p>سيتم توصيل طلبك في أقرب وقت ممكن.</p>
            </div>
        `
    }
};

// تهيئة صفحة الدفع
function initPaymentPage() {
    // إنشاء الجسيمات المتحركة
    createParticles();
    
    // الحصول على معلمات URL
    const urlParams = new URLSearchParams(window.location.search);
    const method = urlParams.get('method');
    const orderId = urlParams.get('orderId');
    
    // تحديث اسم طريقة الدفع
    const paymentMethodName = document.getElementById('paymentMethodName');
    if (paymentMethods[method]) {
        paymentMethodName.textContent = paymentMethods[method].name;
    } else {
        paymentMethodName.textContent = "طريقة الدفع";
    }
    
    // تحديث نموذج الدفع
    const paymentForm = document.getElementById('paymentForm');
    if (paymentMethods[method]) {
        paymentForm.innerHTML = paymentMethods[method].instructions;
    } else {
        paymentForm.innerHTML = `
            <div class="payment-info">
                <p>طريقة الدفع غير معروفة. يرجى العودة إلى صفحة الدفع واختيار طريقة دفع صحيحة.</p>
            </div>
        `;
    }
    
    // تحديث ملخص الطلب
    updateOrderSummary(orderId);
    
    // إعداد مستمعي الأحداث
    setupEventListeners(method);
}

// إنشاء جسيمات متحركة للخلفية
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        const colors = ['var(--neon-blue)', 'var(--neon-purple)', 'var(--neon-pink)', 'var(--neon-green)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        particlesContainer.appendChild(particle);
    }
}

// تحديث ملخص الطلب
function updateOrderSummary(orderId) {
    // محاولة تحميل الطلب من localStorage
    let order = null;
    const orders = JSON.parse(localStorage.getItem('artGalleryOrders') || '[]');
    if (orderId) {
        order = orders.find(o => o.id == orderId);
    } else if (orders.length > 0) {
        order = orders[orders.length - 1];
    }
    
    if (order) {
        document.getElementById('subtotalAmount').textContent = order.subtotal.toFixed(2) + ' DH';
        document.getElementById('shippingAmount').textContent = order.shipping.toFixed(2) + ' DH';
        document.getElementById('totalAmount').textContent = order.total.toFixed(2) + ' DH';
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners(method) {
    // زر الدفع
    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            processPayment(method);
        });
    }
    
    // تغيير صورة لقطة الشاشة
    const screenshotInput = document.getElementById('screenshot');
    if (screenshotInput) {
        screenshotInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const fileName = e.target.files[0].name;
                const label = document.querySelector('.file-label');
                label.innerHTML = `<i class="fas fa-check"></i> ${fileName}`;
            }
        });
    }
}

// معالجة الدفع
function processPayment(method) {
    if (method === 'cod') {
        // الدفع عند الاستلام
        showToast('تم تأكيد طلبك بنجاح! سنتصل بك قريباً لتأكيد التفاصيل.', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        // طرق الدفع الأخرى
        const screenshotInput = document.getElementById('screenshot');
        if (screenshotInput && !screenshotInput.files[0]) {
            showToast('يرجى إرفاق لقطة شاشة لإثبات الدفع', 'error');
            return;
        }
        
        showToast('شكراً لك! سنتحقق من الدفع ونأكد طلبك في أقرب وقت.', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
}

// عرض إشعار
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add('show');
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.remove('error');
    }, 3000);
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', initPaymentPage);