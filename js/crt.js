// كائن سلة التسوق المحسّن والمتكامل
const cart = {
    items: [],
    appliedCoupon: null,
    coupons: [
        { code: "WELCOME10", discount: 10, valid: true },
        { code: "FREESHIP", discount: 30, valid: true },
        { code: "ARTLOVER", discount: 15, valid: true }
    ],
    
    // تهيئة السلة
    init() {
        console.log('🛒 تهيئة سلة التسوق...');
        this.loadFromStorage();
        this.updateCartCount();
        this.renderCartItems();
        this.setupEventListeners();
        this.createParticles();
        console.log('✅ تم تهيئة السلة:', this.items);
    },
    
    // تحميل السلة من التخزين المحلي مع تحسينات
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem('artGalleryCart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
                console.log('📥 تم تحميل السلة:', this.items.length, 'منتج');
                
                // التأكد من وجود الكمية لكل عنصر
                this.items = this.items.map(item => {
                    if (!item.quantity) item.quantity = 1;
                    if (!item.finalPrice) item.finalPrice = item.price;
                    return item;
                });
            } else {
                this.items = [];
                console.log('📥 السلة فارغة');
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل السلة:', error);
            this.items = [];
        }
    },
    
    // حفظ السلة في التخزين المحلي
    saveToStorage() {
        try {
            localStorage.setItem('artGalleryCart', JSON.stringify(this.items));
            console.log('💾 تم حفظ السلة:', this.items);
            return true;
        } catch (error) {
            console.error('❌ خطأ في حفظ السلة:', error);
            return false;
        }
    },
    
    // تحديث عداد السلة
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const count = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = count;
            console.log('🔢 عداد السلة:', count);
        }
    },
    
    // إنشاء جسيمات متحركة
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer || particlesContainer.children.length > 0) return;
        
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 5 + 5}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            const colors = ['#00d4ff', '#b537f2', '#ff006e', '#FF5A00'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            particlesContainer.appendChild(particle);
        }

        // إضافة animation إذا لم تكن موجودة
        if (!document.querySelector('#particles-animation')) {
            const style = document.createElement('style');
            style.id = 'particles-animation';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-20px) translateX(15px); }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // عرض عناصر السلة مع تفاصيل كاملة
    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        if (!cartItemsContainer) return;
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = this.getEmptyCartHTML();
            this.hideCartSummary();
            return;
        }
        
        this.showCartSummary();
        cartItemsContainer.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const cartItemElement = this.createCartItemElement(item, index);
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        this.updateSummary();
    },
    
    // HTML للسلة الفارغة
    getEmptyCartHTML() {
        return `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>سلة التسوق فارغة</h3>
                <p>ابدأ رحلتك الفنية مع PITSIKY واستكشف مجموعتنا المميزة من القطع الفنية</p>
                <a href="pdc.html" class="continue-shopping-btn">
                    <i class="fas fa-palette"></i> استمر في التسوق
                </a>
            </div>
        `;
    },
    
    // إخفاء ملخص الطلب
    hideCartSummary() {
        const summary = document.querySelector('.cart-summary');
        if (summary) summary.style.display = 'none';
    },
    
    // إظهار ملخص الطلب
    showCartSummary() {
        const summary = document.querySelector('.cart-summary');
        if (summary) summary.style.display = 'block';
    },
    
    // إنشاء عنصر سلة مع تفاصيل كاملة
    createCartItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'cart-item';
        element.dataset.id = item.id;
        element.dataset.index = index;
        
        const itemPrice = item.finalPrice || item.price;
        const itemTotal = itemPrice * (item.quantity || 1);
        
        element.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/pit.png'">
            </div>
            <div class="item-details">
                <h3 class="item-title">${item.name}</h3>
                <div class="item-price">${itemPrice.toFixed(2)} درهم</div>
                ${this.getCustomizationHTML(item)}
                <div class="quantity-control">
                    <button class="quantity-btn decrease-btn">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity || 1}" min="1">
                    <button class="quantity-btn increase-btn">+</button>
                </div>
            </div>
            <div class="item-actions">
                <button class="remove-item" title="إزالة المنتج"><i class="fas fa-trash"></i></button>
                <div class="item-total">${itemTotal.toFixed(2)} درهم</div>
            </div>
        `;
        
        return element;
    },
    
    // HTML لخيارات التخصيص المحسّن
    getCustomizationHTML(item) {
        let customizationHTML = '';
        
        // معالجة خيارات التخصيص القديمة والجديدة
        if (item.optionsDetails && item.optionsDetails.length > 0) {
            customizationHTML = '<div class="item-customization" style="margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px; font-size: 0.9em;">';
            item.optionsDetails.forEach(detail => {
                customizationHTML += `<div style="margin: 3px 0; color: #bbb;">📍 ${detail}</div>`;
            });
            customizationHTML += '</div>';
        } else if (item.options) {
            customizationHTML = '<div class="item-customization" style="margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px; font-size: 0.9em;">';
            
            if (item.options.size) {
                const sizeText = item.options.size.name || item.options.size;
                customizationHTML += `<div style="margin: 3px 0; color: #bbb;">📏 المقاس: ${sizeText}</div>`;
            }
            if (item.options.frame) {
                const frameText = item.options.frame.name || item.options.frame;
                customizationHTML += `<div style="margin: 3px 0; color: #bbb;">🖼️ الإطار: ${frameText}</div>`;
            }
            if (item.options.addons && item.options.addons.length > 0) {
                const addonsText = item.options.addons.map(a => a.name || a).join('، ');
                customizationHTML += `<div style="margin: 3px 0; color: #bbb;">✨ الإضافات: ${addonsText}</div>`;
            }
            
            customizationHTML += '</div>';
        } else if (item.size) {
            customizationHTML = `<div class="item-customization" style="margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px; font-size: 0.9em;">
                <div style="margin: 3px 0; color: #bbb;">📏 المقاس: ${item.size}</div>
            </div>`;
        }
        
        return customizationHTML;
    },
    
    // تحديث ملخص الطلب
    updateSummary() {
        let subtotal = 0;
        
        this.items.forEach(item => {
            const itemPrice = item.finalPrice || item.price;
            subtotal += itemPrice * (item.quantity || 1);
        });
        
        const shipping = subtotal > 0 ? 30 : 0;
        let discount = 0;
        
        if (this.appliedCoupon) {
            if (this.appliedCoupon.code === "FREESHIP") {
                discount = shipping;
            } else {
                discount = (subtotal * this.appliedCoupon.discount) / 100;
            }
        }
        
        const total = Math.max(0, subtotal + shipping - discount);
        
        // تحديث الواجهة
        document.getElementById('subtotalAmount').textContent = subtotal.toFixed(2) + ' درهم';
        document.getElementById('shippingAmount').textContent = shipping.toFixed(2) + ' درهم';
        document.getElementById('totalAmount').textContent = total.toFixed(2) + ' درهم';
        
        const discountRow = document.getElementById('discountRow');
        const discountAmount = document.getElementById('discountAmount');
        
        if (this.appliedCoupon && discount > 0) {
            discountRow.style.display = 'flex';
            discountAmount.textContent = '-' + discount.toFixed(2) + ' درهم';
        } else {
            discountRow.style.display = 'none';
        }
    },
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // أحداث السلة
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.increase-btn, .decrease-btn, .remove-item');
            if (!target) return;
            
            const itemElement = e.target.closest('.cart-item');
            if (!itemElement) return;
            
            const itemId = parseInt(itemElement.dataset.id);
            
            if (target.closest('.increase-btn')) {
                this.changeQuantity(itemId, 1);
            } else if (target.closest('.decrease-btn')) {
                this.changeQuantity(itemId, -1);
            } else if (target.closest('.remove-item')) {
                this.removeItem(itemId);
            }
        });
        
        // حدث إدخال الكمية
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const itemElement = e.target.closest('.cart-item');
                if (itemElement) {
                    const itemId = parseInt(itemElement.dataset.id);
                    const newQuantity = parseInt(e.target.value) || 1;
                    this.updateQuantity(itemId, newQuantity);
                }
            }
        });
        
        // تطبيق الكوبون
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => this.applyCoupon());
        }
        
        // إدخال الكوبون عند الضغط على Enter
        const couponInput = document.getElementById('couponCode');
        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.applyCoupon();
            });
        }
        
        // إتمام الشراء
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    },
    
    // تغيير الكمية
    changeQuantity(itemId, change) {
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;
        
        const newQuantity = (item.quantity || 1) + change;
        
        if (newQuantity < 1) {
            this.removeItem(itemId);
        } else {
            this.updateQuantity(itemId, newQuantity);
        }
    },
    
    // تحديث الكمية
    updateQuantity(itemId, newQuantity) {
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;
        
        item.quantity = newQuantity;
        this.saveToStorage();
        this.updateCartCount();
        this.updateSummary();
        this.updateItemDisplay(itemId);
    },
    
    // تحديث عرض العنصر
    updateItemDisplay(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;
        
        const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
        if (!itemElement) return;
        
        const itemPrice = item.finalPrice || item.price;
        const itemTotal = itemPrice * (item.quantity || 1);
        
        // تحديث المجموع
        const totalElement = itemElement.querySelector('.item-total');
        if (totalElement) {
            totalElement.textContent = itemTotal.toFixed(2) + ' درهم';
        }
        
        // تحديث حقل الإدخال
        const inputElement = itemElement.querySelector('.quantity-input');
        if (inputElement) {
            inputElement.value = item.quantity || 1;
        }
    },
    
    // إزالة العنصر
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveToStorage();
        this.updateCartCount();
        this.renderCartItems();
        this.showToast('تم إزالة المنتج من السلة');
    },
    
    // تطبيق الكوبون
    applyCoupon() {
        const couponInput = document.getElementById('couponCode');
        if (!couponInput) return;
        
        const couponCode = couponInput.value.trim().toUpperCase();
        
        if (!couponCode) {
            this.showToast('الرجاء إدخال كود الخصم', 'error');
            return;
        }
        
        const coupon = this.coupons.find(c => c.code === couponCode && c.valid);
        
        if (!coupon) {
            this.showToast('كود الخصم غير صالح أو منتهي الصلاحية', 'error');
            return;
        }
        
        this.appliedCoupon = coupon;
        this.updateSummary();
        this.showToast(`تم تطبيق كوبون الخصم: ${coupon.code}`);
        
        // حفظ الكوبون
        localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    },
    
    // إتمام الشراء
    checkout() {
        if (this.items.length === 0) {
            this.showToast('السلة فارغة، أضف بعض المنتجات أولاً', 'error');
            return;
        }
        
        // حفظ بيانات السلة الحالية للتأكد من وصولها لصفحة الدفع
        this.saveToStorage();
        
        this.showToast('جاري توجيهك إلى صفحة الدفع...');
        setTimeout(() => {
            window.location.href = 'chkt.html';
        }, 1500);
    },
    
    // عرض الإشعارات
    showToast(message, type = 'success') {
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
        }, 3000);
    }
};

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});

// جعل الكائن متاحاً عالمياً للتصحيح
window.cartSystem = cart;