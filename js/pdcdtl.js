// استيراد بيانات المنتجات من الملف المنفصل
if (typeof productsData === 'undefined') {
    console.error('❌ بيانات المنتجات غير متوفرة. تأكد من تحميل ملف prd.js أولاً');
}

// وحدة إدارة تفاصيل المنتج
const ProductDetailManager = {
    // سلة التسوق
    cart: [],
    
    // متغيرات للتخصيص (من الكود الأول)
    basePrice: 0,
    selectedSize: null,
    selectedSizePrice: 0,
    selectedFrame: null,
    selectedFramePrice: 0,
    selectedAddons: [],
    addonsPrice: 0,
    quantity: 1,
    
    // تهيئة صفحة تفاصيل المنتج
    initProductDetailPage() {
        console.log('🚀 تهيئة صفحة تفاصيل المنتج...');
        
        // تحميل السلة من localStorage
        this.loadCartFromStorage();
        
        // تحديث عداد السلة
        this.updateCartCount();
        
        // الحصول على معرف المنتج من URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (!productId) {
            this.showError("لم يتم العثور على المنتج المطلوب");
            return;
        }
        
        // البحث عن المنتج
        const product = productsData.find(p => p.id === productId);
        
        if (!product) {
            this.showError("لم يتم العثور على المنتج المطلوب");
            return;
        }
        
        // تعيين السعر الأساسي
        this.basePrice = product.price;
        
        // عرض تفاصيل المنتج
        this.renderProductDetails(product);
        
        // عرض معرض صور المنتج
        this.renderProductGallery(product);
        
        // عرض المنتجات ذات الصلة
        this.renderRelatedProducts(product);
        
        // إعداد مستمعي الأحداث
        this.setupEventListeners(product);
        
        // تحديث السعر الإجمالي الأولي
        this.updateTotalPrice();
        
        // تهيئة معالجة أخطاء الصور
        this.setupImageErrorHandling();
        
        console.log('✅ تم تهيئة صفحة المنتج:', product.name);
    },
    
    // تحميل السلة من localStorage
    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('artGalleryCart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                console.log('📥 تم تحميل السلة:', this.cart.length, 'منتج');
            } else {
                this.cart = [];
                console.log('📥 السلة فارغة');
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل السلة:', error);
            this.cart = [];
        }
    },
    
    // تحديث عداد السلة
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const count = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = count;
            console.log('🔢 عداد السلة:', count);
        }
    },
    
    // تحديث السعر الإجمالي (من الكود الأول)
    updateTotalPrice() {
        const totalPrice = this.basePrice + this.selectedSizePrice + this.selectedFramePrice + this.addonsPrice;
        const totalWithQuantity = totalPrice * this.quantity;
        
        // تحديث العرض
        const sizePriceEl = document.getElementById('sizePrice');
        const framePriceEl = document.getElementById('framePrice');
        const addonsPriceEl = document.getElementById('addonsPrice');
        const totalPriceEl = document.getElementById('totalPrice');
        const currentPriceEl = document.getElementById('currentPrice');
        
        if (sizePriceEl) sizePriceEl.textContent = this.selectedSizePrice.toFixed(2) + ' DH';
        if (framePriceEl) framePriceEl.textContent = this.selectedFramePrice.toFixed(2) + ' DH';
        if (addonsPriceEl) addonsPriceEl.textContent = this.addonsPrice.toFixed(2) + ' DH';
        if (totalPriceEl) totalPriceEl.textContent = totalWithQuantity.toFixed(2) + ' DH';
        if (currentPriceEl) currentPriceEl.textContent = totalPrice.toFixed(2) + ' DH';
        
        // تحديث العرض في خيارات التخصيص
        document.getElementById('basePrice').textContent = this.basePrice.toFixed(2) + ' درهم';
        document.getElementById('optionsPrice').textContent = (this.selectedSizePrice + this.selectedFramePrice + this.addonsPrice).toFixed(2) + ' درهم';
        document.getElementById('totalPrice').textContent = totalWithQuantity.toFixed(2) + ' درهم';
    },
    
    // عرض تفاصيل المنتج
    renderProductDetails(product) {
        // تحديث معلومات المنتج
        document.getElementById('productName').textContent = product.name;
        
        // تحديث وصف المنتج
        const descContainer = document.querySelector(".product-description");
        if (descContainer) {
            descContainer.innerHTML = '';
            if (Array.isArray(product.description)) {
                product.description.forEach(paragraph => {
                    const p = document.createElement("p");
                    p.textContent = paragraph;
                    descContainer.appendChild(p);
                });
            } else {
                const p = document.createElement("p");
                p.textContent = product.description || '';
                descContainer.appendChild(p);
            }
        }
        
        // تحديث الأسعار
        document.getElementById('currentPrice').textContent = product.price.toFixed(2) + ' درهم';
        
        if (product.oldPrice) {
            document.getElementById('oldPrice').textContent = product.oldPrice.toFixed(2) + ' درهم';
            document.getElementById('oldPrice').style.display = 'block';
        } else {
            document.getElementById('oldPrice').style.display = 'none';
        }
        
        // تحديث العلامة
        const productTag = document.getElementById('productTag');
        if (product.tag && productTag) {
            productTag.textContent = product.tag;
            productTag.style.display = 'block';
        } else if (productTag) {
            productTag.style.display = 'none';
        }
        
        // عرض المواصفات
        const specGrid = document.getElementById('specGrid');
        if (specGrid && product.specifications) {
            specGrid.innerHTML = '';
            product.specifications.forEach(spec => {
                const specItem = document.createElement('div');
                specItem.className = 'spec-item';
                specItem.innerHTML = `
                    <div class="spec-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="spec-text">
                        <div class="spec-name">${spec.name}</div>
                        <div class="spec-value">${spec.value}</div>
                    </div>
                `;
                specGrid.appendChild(specItem);
            });
        }
        
        // عرض خيارات التخصيص
        this.renderCustomizationOptions(product);
    },
    
    // عرض معرض صور المنتج (دمج من الكود الأول)
    renderProductGallery(product) {
        const mainImageContainer = document.getElementById('mainImageContainer');
        const thumbnailGallery = document.getElementById('thumbnailGallery');
        
        if (!mainImageContainer || !thumbnailGallery) return;
        
        // مسح المحتوى الحالي
        mainImageContainer.innerHTML = '';
        thumbnailGallery.innerHTML = '';
        
        // إذا كان للمنتج صور
        if (product.images && product.images.length > 0) {
            // الصورة الرئيسية
            const mainImg = document.createElement('img');
            mainImg.src = product.images[0];
            mainImg.alt = product.name;
            mainImg.onerror = function() {
                this.src = 'images/pit.png';
            };
            mainImageContainer.appendChild(mainImg);
            
            // الصور المصغرة
            product.images.forEach((imgSrc, index) => {
                const thumbItem = document.createElement('div');
                thumbItem.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
                
                const thumbImg = document.createElement('img');
                thumbImg.src = imgSrc;
                thumbImg.alt = `${product.name} - ${index + 1}`;
                thumbImg.onerror = function() {
                    this.src = 'images/pit.png';
                };
                
                thumbItem.appendChild(thumbImg);
                thumbnailGallery.appendChild(thumbItem);
                
                // إضافة حدث النقر على الصورة المصغرة
                thumbItem.addEventListener('click', () => {
                    // تحديث الصورة الرئيسية
                    mainImg.src = imgSrc;
                    
                    // إزالة النشاط من جميع الصور المصغرة
                    document.querySelectorAll('.thumbnail-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // إضافة النشاط للصورة المصغرة المحددة
                    thumbItem.classList.add('active');
                });
            });
        } else {
            // صور افتراضية إذا لم توجد صور
            const defaultImages = [
                'images/pit.png',
                'images/pit.png',
                'images/pit.png',
                'images/pit.png'
            ];
            
            // الصورة الرئيسية
            const mainImg = document.createElement('img');
            mainImg.src = defaultImages[0];
            mainImg.alt = product.name || 'صورة المنتج';
            mainImageContainer.appendChild(mainImg);
            
            // الصور المصغرة
            for (let i = 1; i < Math.min(defaultImages.length, 4); i++) {
                const thumbItem = document.createElement('div');
                thumbItem.className = `thumbnail-item ${i === 1 ? 'active' : ''}`;
                
                const thumbImg = document.createElement('img');
                thumbImg.src = defaultImages[i];
                thumbImg.alt = `صورة مصغرة ${i}`;
                
                thumbItem.appendChild(thumbImg);
                thumbnailGallery.appendChild(thumbItem);
                
                // إضافة حدث النقر على الصورة المصغرة
                thumbItem.addEventListener('click', () => {
                    mainImg.src = defaultImages[i];
                    
                    document.querySelectorAll('.thumbnail-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    thumbItem.classList.add('active');
                });
            }
        }
    },
    
    // معالجة أخطاء الصور (من الكود الأول)
    setupImageErrorHandling() {
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
                // استبدال الصور التالفة بصور افتراضية
                if (e.target.parentElement.classList.contains('main-image-container') || 
                    e.target.parentElement.id === 'mainImageContainer') {
                    // صورة رئيسية
                    e.target.src = 'images/pit.png';
                } else if (e.target.parentElement.classList.contains('thumbnail-item') || 
                          e.target.closest('.thumbnail-item')) {
                    // صورة مصغرة
                    e.target.src = 'images/pit.png';
                }
            }
        }, true);
    },
    
    // عرض خيارات التخصيص (دمج مع الكود الأول)
    renderCustomizationOptions(product) {
        // تعيين السعر الأساسي
        this.basePrice = product.price;
        
        // عرض خيارات الحجم
        const sizeOptionsContainer = document.getElementById('sizeOptions');
        if (sizeOptionsContainer && product.sizes) {
            sizeOptionsContainer.innerHTML = '';
            
            product.sizes.forEach((size, index) => {
                const sizeElement = document.createElement('div');
                sizeElement.className = `option-item size-btn ${index === 0 ? 'selected' : ''}`;
                sizeElement.dataset.size = size.id;
                sizeElement.dataset.price = size.price;
                sizeElement.innerHTML = `
                    ${size.name}
                    ${size.price > 0 ? `<div class="option-price">+${size.price.toFixed(2)} درهم</div>` : ''}
                `;
                
                sizeElement.addEventListener('click', () => {
                    document.querySelectorAll('#sizeOptions .option-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    sizeElement.classList.add('selected');
                    this.selectedSize = size;
                    this.selectedSizePrice = size.price;
                    this.updateTotalPrice();
                });
                
                sizeOptionsContainer.appendChild(sizeElement);
            });
            
            // تعيين الحجم الافتراضي
            if (product.sizes.length > 0) {
                this.selectedSize = product.sizes[0];
                this.selectedSizePrice = product.sizes[0].price || 0;
            }
        }
        
        // عرض خيارات الإطار مع الصور المصغرة
        const frameOptionsContainer = document.getElementById('frameOptions');
        if (frameOptionsContainer && product.frames) {
            frameOptionsContainer.innerHTML = '';
            
            product.frames.forEach((frame, index) => {
                const frameElement = document.createElement('div');
                frameElement.className = `option-item frame-option ${index === 0 ? 'selected' : ''}`;
                frameElement.dataset.frame = frame.id;
                frameElement.dataset.price = frame.price;
                frameElement.innerHTML = `
                    <div class="frame-thumbnail">
                        <img src="${frame.thumbnail || 'images/frames/default-frame.jpg'}" alt="${frame.name}" onerror="this.src='images/frames/default-frame.jpg'">
                    </div>
                    <div class="frame-info">
                        <div class="frame-name">${frame.name}</div>
                        ${frame.price > 0 ? `<div class="option-price">+${frame.price.toFixed(2)} درهم</div>` : ''}
                    </div>
                `;
                
                frameElement.addEventListener('click', () => {
                    document.querySelectorAll('#frameOptions .option-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    frameElement.classList.add('selected');
                    this.selectedFrame = frame;
                    this.selectedFramePrice = frame.price;
                    this.updateTotalPrice();
                });
                
                frameOptionsContainer.appendChild(frameElement);
            });
            
            // تعيين الإطار الافتراضي
            if (product.frames.length > 0) {
                this.selectedFrame = product.frames[0];
                this.selectedFramePrice = product.frames[0].price || 0;
            }
        }
        
        // عرض خيارات الإضافات
        const addonOptionsContainer = document.getElementById('addonOptions');
        if (addonOptionsContainer && product.addons) {
            addonOptionsContainer.innerHTML = '';
            this.selectedAddons = [];
            this.addonsPrice = 0;
            
            product.addons.forEach(addon => {
                const addonElement = document.createElement('div');
                addonElement.className = 'option-item addon-item';
                addonElement.dataset.addon = addon.id;
                addonElement.dataset.price = addon.price;
                addonElement.innerHTML = `
                    ${addon.name}
                    <div class="option-price">+${addon.price.toFixed(2)} درهم</div>
                `;
                
                addonElement.addEventListener('click', () => {
                    const addonId = addon.id;
                    const addonPrice = parseFloat(addonElement.dataset.price);
                    
                    // التحقق إذا كان الإضافة مفعلة
                    const isActive = addonElement.classList.contains('active');
                    
                    if (isActive) {
                        // إلغاء التفعيل
                        addonElement.classList.remove('active');
                        const index = this.selectedAddons.findIndex(a => a.id === addonId);
                        if (index > -1) {
                            this.selectedAddons.splice(index, 1);
                            this.addonsPrice -= addonPrice;
                        }
                    } else {
                        // التفعيل
                        addonElement.classList.add('active');
                        this.selectedAddons.push(addon);
                        this.addonsPrice += addonPrice;
                    }
                    
                    this.updateTotalPrice();
                });
                
                addonOptionsContainer.appendChild(addonElement);
            });
        }
    },
    
    // عرض المنتجات ذات الصلة
    renderRelatedProducts(currentProduct) {
        const relatedGrid = document.getElementById('relatedGrid');
        if (!relatedGrid) return;
        
        relatedGrid.innerHTML = '';
        
        // تصفية المنتجات (نفس الفئة، باستثناء المنتج الحالي)
        const relatedProducts = productsData.filter(
            product => product.category === currentProduct.category && product.id !== currentProduct.id
        ).slice(0, 4);
        
        if (relatedProducts.length === 0) {
            relatedGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 20px;">لا توجد منتجات ذات صلة</p>';
            return;
        }
        
        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'related-product';
            productCard.innerHTML = `
                <div class="related-product-image">
                    <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='images/pit.png'">
                </div>
                <div class="related-product-info">
                    <h3 class="related-product-name">${product.name}</h3>
                    <div class="related-product-price">${product.price.toFixed(2)} درهم</div>
                </div>
            `;
            
            productCard.addEventListener('click', () => {
                window.location.href = `pdcdtl.html?id=${product.id}`;
            });
            
            relatedGrid.appendChild(productCard);
        });
    },
    
    // إعداد مستمعي الأحداث (دمج مع الكود الأول)
    setupEventListeners(product) {
        // التحكم في الكمية
        const decreaseBtn = document.querySelector('.decrease-btn');
        const increaseBtn = document.querySelector('.increase-btn');
        const quantityInput = document.getElementById('quantityInput');
        
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                    this.quantity = value - 1;
                    this.updateTotalPrice();
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value < 10) {
                    quantityInput.value = value + 1;
                    this.quantity = value + 1;
                    this.updateTotalPrice();
                }
            });
            
            quantityInput.addEventListener('change', () => {
                let value = parseInt(quantityInput.value);
                if (value < 1) {
                    quantityInput.value = 1;
                    this.quantity = 1;
                } else if (value > 10) {
                    quantityInput.value = 10;
                    this.quantity = 10;
                } else {
                    this.quantity = value;
                }
                this.updateTotalPrice();
            });
        }
        
        // زر إضافة إلى السلة
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(product);
            });
        }
    },
    
    // إضافة منتج إلى السلة مع التخصيصات (دمج مع الكود الأول)
    addToCart(product) {
        // حساب السعر الإجمالي مع الخيارات
        const totalPrice = this.basePrice + this.selectedSizePrice + this.selectedFramePrice + this.addonsPrice;
        
        // إنشاء كائن التخصيصات
        const options = {
            size: this.selectedSize,
            frame: this.selectedFrame,
            addons: [...this.selectedAddons]
        };
        
        // إنشاء تفاصيل التخصيص للرسالة
        const optionsDetails = this.generateOptionsDetails();
        
        // التحقق من وجود المنتج المماثل في السلة
        const existingItemIndex = this.cart.findIndex(item => 
            item.id === product.id && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (existingItemIndex !== -1) {
            // تحديث الكمية إذا كان المنتج موجوداً بنفس التخصيصات
            this.cart[existingItemIndex].quantity += this.quantity;
            this.cart[existingItemIndex].finalPrice = totalPrice;
        } else {
            // إضافة منتج جديد إلى السلة
            const cartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                finalPrice: totalPrice,
                image: product.images[0],
                quantity: this.quantity,
                options: options,
                optionsDetails: optionsDetails,
                size: this.selectedSize ? this.selectedSize.name : null
            };
            
            this.cart.push(cartItem);
        }
        
        // حفظ السلة
        this.saveCartToStorage();
        this.updateCartCount();
        
        console.log('🛒 تم إضافة المنتج إلى السلة:', {
            product: product.name,
            quantity: this.quantity,
            finalPrice: totalPrice,
            options: options
        });
        
        // عرض رسالة التأكيد
        this.showToast(`تمت إضافة "${product.name}" إلى السلة`, 'success');
        
        // اهتزاز أيقونة السلة
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('shake');
            setTimeout(() => {
                cartIcon.classList.remove('shake');
            }, 500);
        }
        
        // إضافة تأثير على الزر (من الكود الأول)
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                addToCartBtn.style.transform = '';
            }, 200);
        }
    },
    
    // إنشاء تفاصيل التخصيص للرسالة
    generateOptionsDetails() {
        const details = [];
        
        if (this.selectedSize) {
            details.push(`المقاس: ${this.selectedSize.name}`);
        }
        
        if (this.selectedFrame) {
            details.push(`الإطار: ${this.selectedFrame.name}`);
        }
        
        if (this.selectedAddons.length > 0) {
            this.selectedAddons.forEach(addon => {
                details.push(`إضافة: ${addon.name}`);
            });
        }
        
        return details;
    },
    
    // حفظ السلة في localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem('artGalleryCart', JSON.stringify(this.cart));
            console.log('💾 تم حفظ السلة:', this.cart);
            return true;
        } catch (error) {
            console.error('❌ خطأ في حفظ السلة:', error);
            return false;
        }
    },
    
    // عرض إشعار (دمج مع الكود الأول)
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
    },
    
    // عرض خطأ
    showError(message) {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 50px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #e74c3c; margin-bottom: 20px;"></i>
                <h2 style="color: #f8d568; margin-bottom: 15px;">حدث خطأ</h2>
                <p style="font-size: 1.2rem; margin-bottom: 30px;">${message}</p>
                <a href="pdc.html" class="continue-shopping-btn" style="display: inline-block; padding: 12px 30px; border-radius: 30px; background: linear-gradient(to right, green, lightgreen); color: #1a1a2e; text-decoration: none; font-weight: bold;">العودة إلى المتجر</a>
            </div>
        `;
    }
};

// تهيئة صفحة تفاصيل المنتج عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 تم تحميل صفحة تفاصيل المنتج');
    
    // التحقق من توفر بيانات المنتجات
    if (typeof productsData === 'undefined') {
        console.error('❌ بيانات المنتجات غير متوفرة');
        ProductDetailManager.showError('بيانات المنتجات غير متوفرة. تأكد من تحميل الملفات بشكل صحيح');
        return;
    }
    
    setTimeout(() => {
        ProductDetailManager.initProductDetailPage();
    }, 100);
});

// جعل الدوال متاحة عالمياً للتصحيح
window.productDetail = {
    cart: () => ProductDetailManager.cart,
    selectedOptions: () => ({
        size: ProductDetailManager.selectedSize,
        frame: ProductDetailManager.selectedFrame,
        addons: ProductDetailManager.selectedAddons
    }),
    testAddToCart: (productId) => {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            ProductDetailManager.addToCart(product);
        }
    },
    manager: ProductDetailManager
};
