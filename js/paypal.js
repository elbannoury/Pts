// تهيئة صفحة الدفع
document.addEventListener('DOMContentLoaded', function() {
    // تعبئة نموذج الدفع تلقائياً إذا كانت هناك بيانات مسجلة
    loadSavedData();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
});

// تحميل البيانات المحفوظة
function loadSavedData() {
    const savedEmail = localStorage.getItem('paypalEmail');
    const rememberMe = localStorage.getItem('rememberPaypal') === 'true';
    
    if (savedEmail && rememberMe) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('remember').checked = true;
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر الدفع
    const payButton = document.getElementById('pay-now-btn');
    payButton.addEventListener('click', processPayment);
    
    // تذكر بياناتي
    const rememberCheckbox = document.getElementById('remember');
    rememberCheckbox.addEventListener('change', toggleRememberMe);
}

// معالجة عملية الدفع
function processPayment() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // التحقق من البيانات
    if (!validateForm(email, password)) {
        return;
    }
    
    // عرض حالة التحميل
    showLoading(true);
    
    // حفظ البيانات إذا طلب المستخدم ذلك
    if (rememberMe) {
        localStorage.setItem('paypalEmail', email);
        localStorage.setItem('rememberPaypal', 'true');
    } else {
        localStorage.removeItem('paypalEmail');
        localStorage.removeItem('rememberPaypal');
    }
    
    // محاكاة عملية الدفع (في الواقع سيكون اتصال بAPI باي بال)
    setTimeout(() => {
        // إخفاء حالة التحميل
        showLoading(false);
        
        // عرض رسالة النجاح
        showSuccessMessage();
        
        // توجيه المستخدم إلى صفحة التأكيد بعد 3 ثواني
        setTimeout(() => {
            window.location.href = 'confirmation.html?method=paypal';
        }, 3000);
    }, 2000);
}

// التحقق من صحة النموذج
function validateForm(email, password) {
    // إعادة تعليمات التحقق
    resetValidation();
    
    let isValid = true;
    
    // التحقق من البريد الإلكتروني
    if (!email) {
        showError('email', 'يرجى إدخال البريد الإلكتروني');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'البريد الإلكتروني غير صالح');
        isValid = false;
    }
    
    // التحقق من كلمة المرور
    if (!password) {
        showError('password', 'يرجى إدخال كلمة المرور');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        isValid = false;
    }
    
    return isValid;
}

// التحقق من صيغة البريد الإلكتروني
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// إعادة تعليمات التحقق
function resetValidation() {
    const inputs = document.querySelectorAll('.input-with-icon input');
    inputs.forEach(input => {
        input.parentElement.classList.remove('error');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
}

// عرض خطأ في الحقل
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const parent = field.parentElement;
    
    // إضافة فئة الخطأ
    parent.classList.add('error');
    
    // إزالة أي رسائل خطأ سابقة
    const existingError = parent.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // إنشاء رسالة الخطأ
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger)';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '5px';
    
    // إضافة رسالة الخطأ بعد الحقل
    parent.appendChild(errorElement);
}

// عرض حالة التحميل
function showLoading(isLoading) {
    const button = document.getElementById('pay-now-btn');
    
    if (isLoading) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
        button.disabled = true;
    } else {
        button.innerHTML = '<i class="fab fa-paypal"></i> الدفع الآن';
        button.disabled = false;
    }
}

// عرض رسالة النجاح
function showSuccessMessage() {
    // إنشاء عنصر رسالة النجاح
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>تمت عملية الدفع بنجاح!</h3>
            <p>شكراً لشرائك من PITSIKY. سيتم تحويلك إلى صفحة التأكيد خلال لحظات.</p>
        </div>
    `;
    
    // إضافة التنسيقات
    const style = document.createElement('style');
    style.textContent = `
        .success-message {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.5s;
        }
        
        .success-content {
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .success-content i {
            font-size: 4rem;
            color: var(--success);
            margin-bottom: 20px;
        }
        
        .success-content h3 {
            color: var(--success);
            margin-bottom: 15px;
            font-size: 1.8rem;
        }
        
        .success-content p {
            color: var(--text);
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(successMessage);
}

// إدارة خيار "تذكرني"
function toggleRememberMe() {
    const rememberMe = document.getElementById('remember').checked;
    
    if (!rememberMe) {
        localStorage.removeItem('paypalEmail');
        localStorage.removeItem('rememberPaypal');
    }
}