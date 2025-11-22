// chkt.js - كود صفحة التأكيد المحسّن
let cart = [];
let appliedCoupon = null;

// تهيئة صفحة التأكيد
function initCheckoutPage() {
    console.log('🚀 تهيئة صفحة التأكيد...');
    loadCartFromStorage();
    loadCouponData();
    updateCartCount();
    renderOrderItems();
    updateOrderSummary();
    setupEventListeners();
    console.log('📦 محتويات السلة:', cart);
}

// تحميل السلة من localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('artGalleryCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('🛒 تم تحميل السلة:', cart.length, 'منتج');
        } else {
            cart = [];
            console.log('🛒 السلة فارغة');
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل السلة:', error);
        cart = [];
    }
}

// تحميل بيانات الكوبون
function loadCouponData() {
    try {
        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCoupon) {
            appliedCoupon = JSON.parse(savedCoupon);
            console.log('🎫 تم تحميل الخصم:', appliedCoupon);
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل الخصم:', error);
        appliedCoupon = null;
    }
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

// عرض عناصر الطلب مع تفاصيل كاملة
function renderOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">سلة التسوق فارغة</p>';
        return;
    }
    
    cart.forEach((item, index) => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        const itemPrice = item.finalPrice || item.price;
        const itemTotal = itemPrice * (item.quantity || 1);
        
        orderItem.innerHTML = `
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/pit.png'">
            </div>
            <div class="order-item-details">
                <div class="order-item-title">${item.name}</div>
                <div class="order-item-price">${itemPrice.toFixed(2)} درهم × ${item.quantity || 1}</div>
                <div class="order-item-total">المجموع: ${itemTotal.toFixed(2)} درهم</div>
                ${getCustomizationHTML(item)}
            </div>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
}

// HTML لتفاصيل التخصيص
function getCustomizationHTML(item) {
    let html = '';
    
    if (item.optionsDetails && item.optionsDetails.length > 0) {
        html = '<div class="order-item-customization">';
        item.optionsDetails.forEach(detail => {
            html += `<div class="customization-detail">📍 ${detail}</div>`;
        });
        html += '</div>';
    } else if (item.options) {
        html = '<div class="order-item-customization">';
        if (item.options.size) {
            const sizeText = item.options.size.name || item.options.size;
            html += `<div class="customization-detail">📏 المقاس: ${sizeText}</div>`;
        }
        if (item.options.frame) {
            const frameText = item.options.frame.name || item.options.frame;
            html += `<div class="customization-detail">🖼️ الإطار: ${frameText}</div>`;
        }
        if (item.options.addons && item.options.addons.length > 0) {
            const addonsText = item.options.addons.map(a => a.name || a).join('، ');
            html += `<div class="customization-detail">✨ الإضافات: ${addonsText}</div>`;
        }
        html += '</div>';
    } else if (item.size) {
        html = `<div class="order-item-customization">
            <div class="customization-detail">📏 المقاس: ${item.size}</div>
        </div>`;
    }
    
    return html;
}

// تحديث ملخص الطلب
function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => {
        const itemPrice = item.finalPrice || item.price;
        return sum + (itemPrice * (item.quantity || 1));
    }, 0);
    
    const shipping = subtotal > 0 ? 30 : 0;
    let discount = 0;
    
    if (appliedCoupon) {
        if (appliedCoupon.code === "FREESHIP") {
            discount = shipping;
        } else {
            discount = (subtotal * appliedCoupon.discount) / 100;
        }
    }
    
    const total = Math.max(0, subtotal + shipping - discount);
    
    document.getElementById('subtotalAmount').textContent = subtotal.toFixed(2) + ' درهم';
    document.getElementById('shippingAmount').textContent = shipping.toFixed(2) + ' درهم';
    
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');
    
    if (appliedCoupon && discount > 0) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = '-' + discount.toFixed(2) + ' درهم';
    } else {
        discountRow.style.display = 'none';
    }
    
    document.getElementById('totalAmount').textContent = total.toFixed(2) + ' درهم';
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // اختيار طريقة الدفع
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // تطبيق كوبون الخصم
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    // تأكيد الطلب
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', processOrder);
    }
}

// تطبيق كوبون الخصم
function applyCoupon() {
    const couponCodeInput = document.getElementById('couponCode');
    if (!couponCodeInput) return;
    
    const couponCode = couponCodeInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showToast('الرجاء إدخال كود الخصم', 'error');
        return;
    }
    
    const coupons = [
        { code: "WELCOME10", discount: 10, valid: true },
        { code: "FREESHIP", discount: 30, valid: true },
        { code: "ARTLOVER", discount: 15, valid: true }
    ];
    
    const coupon = coupons.find(c => c.code === couponCode && c.valid);
    
    if (!coupon) {
        showToast('كود الخصم غير صالح أو منتهي الصلاحية', 'error');
        return;
    }
    
    appliedCoupon = coupon;
    localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    updateOrderSummary();
    showToast(`تم تطبيق كوبون الخصم: ${coupon.code}`);
}

// التحقق من صحة النموذج
function validateOrderForm() {
    const requiredFields = [
        { id: 'firstName', name: 'الاسم الأول' },
        { id: 'lastName', name: 'الاسم الأخير' },
        { id: 'email', name: 'البريد الإلكتروني' },
        { id: 'phone', name: 'رقم الهاتف' },
        { id: 'address', name: 'العنوان' },
        { id: 'city', name: 'المدينة' },
        { id: 'postalCode', name: 'الرمز البريدي' }
    ];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            showToast(`يرجى ملء حقل ${field.name}`, 'error');
            return false;
        }
    }
    
    // التحقق من صحة البريد الإلكتروني
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return false;
    }
    
    // التحقق من وجود منتجات في السلة
    if (cart.length === 0) {
        showToast('السلة فارغة، يرجى إضافة منتجات', 'error');
        return false;
    }
    
    // التحقق من طريقة الدفع
    const paymentMethod = document.querySelector('.payment-option.selected');
    if (!paymentMethod) {
        showToast('يرجى اختيار طريقة دفع', 'error');
        return false;
    }
    
    return true;
}

// إنشاء كائن الطلب
function createOrderObject() {
    const citySelect = document.getElementById('city');
    const cityText = citySelect.options[citySelect.selectedIndex].text;
    const paymentMethod = document.querySelector('.payment-option.selected');
    
    // حساب التكاليف
    const subtotal = cart.reduce((sum, item) => {
        const itemPrice = item.finalPrice || item.price;
        return sum + (itemPrice * (item.quantity || 1));
    }, 0);
    
    const shipping = calculateShippingCost();
    const discount = calculateDiscount(subtotal, shipping);
    const total = subtotal + shipping - discount;
    
    const order = {
        id: 'PTS-' + Date.now(),
        date: new Date().toISOString(),
        customer: {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value,
            cityText: cityText,
            postalCode: document.getElementById('postalCode').value.trim(),
            notes: document.getElementById('notes').value.trim()
        },
        paymentMethod: paymentMethod ? paymentMethod.dataset.method : 'cod',
        items: JSON.parse(JSON.stringify(cart)), // نسخ عميق
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        coupon: appliedCoupon ? appliedCoupon.code : null
    };
    
    console.log('📋 تفاصيل الطلب المُنشأ:', order);
    return order;
}

// حساب تكلفة الشحن
function calculateShippingCost() {
    const city = document.getElementById('city').value;
    const shippingCosts = {
        'casablanca': 30, 'rabat': 35, 'marrakech': 40, 'fes': 45,
        'tanger': 50, 'agadir': 55, 'meknes': 45, 'oujda': 60,
        'other': 70
    };
    return shippingCosts[city] || shippingCosts.other;
}

// حساب الخصم
function calculateDiscount(subtotal, shipping) {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.code === "FREESHIP") {
        return shipping;
    } else if (appliedCoupon.discount) {
        return (subtotal * appliedCoupon.discount) / 100;
    }
    
    return 0;
}

// حفظ الطلب
function saveOrderToStorage(order) {
    try {
        const orders = JSON.parse(localStorage.getItem('pitsikyOrders') || '[]');
        orders.push(order);
        localStorage.setItem('pitsikyOrders', JSON.stringify(orders));
        console.log('💾 تم حفظ الطلب في localStorage');
        return true;
    } catch (error) {
        console.error('❌ خطأ في حفظ الطلب:', error);
        return false;
    }
}

// تفريغ السلة بعد الطلب
function clearCartAfterOrder() {
    cart = [];
    appliedCoupon = null;
    localStorage.removeItem('artGalleryCart');
    localStorage.removeItem('appliedCoupon');
    updateCartCount();
    console.log('🔄 تم تفريغ السلة بعد الطلب');
}

// دالة تنسيق الرسالة المحسّنة بشكل نهائي
function formatOrderMessage(order) {
    const orderDate = new Date(order.date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let message = `🛒 *طلب جديد من PITSIKY* 🛒\n\n`;
    message += `📋 *رقم الطلب:* ${order.id}\n`;
    message += `📅 *التاريخ والوقت:* ${orderDate}\n\n`;
    
    message += `👤 *معلومات العميل:*\n`;
    message += `   • الاسم: ${order.customer.firstName} ${order.customer.lastName}\n`;
    message += `   • الهاتف: ${order.customer.phone}\n`;
    message += `   • البريد: ${order.customer.email}\n`;
    message += `   • العنوان: ${order.customer.address}\n`;
    message += `   • المدينة: ${order.customer.cityText}\n`;
    
    if (order.customer.postalCode) {
        message += `   • الرمز البريدي: ${order.customer.postalCode}\n`;
    }
    
    if (order.customer.notes) {
        message += `   • الملاحظات: ${order.customer.notes}\n`;
    }
    
    message += `\n💳 *طريقة الدفع:* ${order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'الدفع الإلكتروني'}\n\n`;
    
    message += `🖼️ *المنتجات المطلوبة:*\n`;
    message += `══════════════════════════\n`;
    
    if (order.items && order.items.length > 0) {
        order.items.forEach((item, index) => {
            message += `\n${index + 1}. *${item.name}*\n`;
            message += `   • الكمية: ${item.quantity || 1} قطعة\n`;
            message += `   • السعر: ${(item.finalPrice || item.price || 0).toFixed(2)} درهم\n`;
            message += `   • المجموع: ${((item.finalPrice || item.price || 0) * (item.quantity || 1)).toFixed(2)} درهم\n`;
            
            // تفاصيل التخصيص - جميع الطرق الممكنة
            let customizationDetails = [];
            
            // الطريقة 1: optionsDetails (المباشرة)
            if (item.optionsDetails && item.optionsDetails.length > 0) {
                customizationDetails = [...item.optionsDetails];
            }
            // الطريقة 2: options object (من صفحة التفاصيل)
            else if (item.options) {
                if (item.options.size) {
                    const sizeText = item.options.size.name || item.options.size;
                    customizationDetails.push(`المقاس: ${sizeText}`);
                }
                if (item.options.frame) {
                    const frameText = item.options.frame.name || item.options.frame;
                    customizationDetails.push(`الإطار: ${frameText}`);
                }
                if (item.options.addons && item.options.addons.length > 0) {
                    const addonsText = item.options.addons.map(a => a.name || a).join('، ');
                    customizationDetails.push(`الإضافات: ${addonsText}`);
                }
            }
            // الطريقة 3: size مباشر (للتوافق)
            else if (item.size) {
                customizationDetails.push(`المقاس: ${item.size}`);
            }
            
            // إضافة التفاصيل إلى الرسالة
            if (customizationDetails.length > 0) {
                message += `   • التخصيص:\n`;
                customizationDetails.forEach(detail => {
                    message += `     📍 ${detail}\n`;
                });
            }
            
            message += `   ──────────────────`;
        });
    } else {
        message += `\n⚠️ *لا توجد منتجات في الطلب*\n`;
    }
    
    message += `\n\n💰 *الفاتورة:*\n`;
    message += `══════════════════════════\n`;
    message += `   • المجموع الفرعي: ${order.subtotal.toFixed(2)} درهم\n`;
    message += `   • الشحن: ${order.shipping.toFixed(2)} درهم\n`;
    
    if (order.discount > 0) {
        message += `   • الخصم: -${order.discount.toFixed(2)} درهم\n`;
    }
    
    message += `   • *الإجمالي: ${order.total.toFixed(2)} درهم*\n\n`;
    
    if (order.coupon) {
        message += `🎫 *كود الخصم المستخدم:* ${order.coupon}\n\n`;
    }
    
    message += `📞 للاستفسار: 212-700-720-490+\n`;
    message += `⏰ وقت التجهيز: 1-3 أيام عمل\n\n`;
    message += `شكراً لثقتكم بنا! ❤️`;
    
    console.log('📝 رسالة الطلب المُنشأة:', message);
    return message;
}

// إرسال رسالة واتساب (نسخة مبسطة)
async function sendWhatsAppMessage(message) {
    const CALLMEBOT_API_KEY = "5396056";
    const WHATSAPP_NUMBER = "212702382376";
    
    console.log('📤 محاولة إرسال الرسالة إلى واتساب...');
    
    try {
        const encodedMessage = encodeURIComponent(message);
        const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}&apikey=${CALLMEBOT_API_KEY}`;
        
        // استخدام صورة للإرسال (أكثر موثوقية)
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                console.log('✅ تم الإرسال بنجاح');
                resolve(true);
            };
            img.onerror = function() {
                console.log('❌ فشل الإرسال');
                resolve(false);
            };
            img.src = apiUrl;
            
            // احتياطي بعد 3 ثوان
            setTimeout(() => {
                console.log('⏰ تم الإرسال (افتراضي)');
                resolve(true);
            }, 3000);
        });
    } catch (error) {
        console.error('❌ خطأ في الإرسال:', error);
        return false;
    }
}

// الدالة الرئيسية لمعالجة الطلب
async function processOrder() {
    console.log('🚀 بدء معالجة الطلب...');
    
    // التحقق من صحة البيانات
    if (!validateOrderForm()) {
        return false;
    }
    
    // إنشاء كائن الطلب
    const order = createOrderObject();
    
    // حفظ الطلب
    const saved = saveOrderToStorage(order);
    if (!saved) {
        showToast('حدث خطأ في حفظ الطلب', 'error');
        return false;
    }
    
    // إرسال الإشعار إلى واتساب
    const message = formatOrderMessage(order);
    console.log('✉️ محتوى الرسالة:', message);
    
    const sent = await sendWhatsAppMessage(message);
    
    // معالجة ما بعد الطلب
    if (order.paymentMethod === 'cod') {
        clearCartAfterOrder();
        if (sent) {
            showToast('✅ تم تأكيد الطلب وإرساله إلى واتساب!', 'success');
        } else {
            showToast('✅ تم تأكيد الطلب! (لم يتم الإرسال إلى واتساب)', 'success');
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        window.location.href = `py.html?orderId=${order.id}&method=${order.paymentMethod}`;
    }
    
    return true;
}

// عرض الإشعارات
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add('show');
    
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.remove('error');
    }, 4000);
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 تم تحميل صفحة التأكيد');
    setTimeout(initCheckoutPage, 500);
});