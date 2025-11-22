// استيراد بيانات المنتجات من الملف المنفصل
if (typeof productsData === 'undefined') {
    console.error('❌ بيانات المنتجات غير متوفرة. تأكد من تحميل ملف prd.js أولاً');
}

// وحدة إدارة تفاصيل المنتج
const ProductDetailManager = {
    // سلة التسوق
    cart: [],
    
    // متغيرات للتخصيص
    selectedSize: null,
    selectedFrame: null,
    selectedAddons: [],
    
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
        
        // عرض تفاصيل المنتج
        this.renderProductDetails(product);
        
        // عرض معرض صور المنتج
        this.renderProductGallery(product);
        
        // عرض المنتجات ذات الصلة
        this.renderRelatedProducts(product);
        
        // إعداد مستمعي الأحداث
        this.setupEventListeners(product);
        
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
    
    // عرض تفاصيل المنتج
    renderProductDetails(product) {
        // تحديث معلومات المنتج
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productDescription').textContent = product.description;
        
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
        if (product.tag) {
            productTag.textContent = product.tag;
            productTag.style.display = 'block';
        } else {
            productTag.style.display = 'none';
        }
        
        // عرض المواصفات
        const specGrid = document.getElementById('specGrid');
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
        
        // عرض خيارات التخصيص
        this.renderCustomizationOptions(product);
    },
    
    // عرض معرض صور المنتج
    renderProductGallery(product) {
        const mainImageContainer = document.getElementById('mainImageContainer');
        const thumbnailGallery = document.getElementById('thumbnailGallery');
        
        // مسح المحتوى الحالي
        mainImageContainer.innerHTML = '';
        thumbnailGallery.innerHTML = '';
        
        // إضافة الصور
        product.images.forEach((img, index) => {
            // الصورة الرئيسية (أول صورة)
            if (index === 0) {
                const mainImg = document.createElement('img');
                mainImg.src = img;
                mainImg.alt = product.name;
                mainImg.onerror = function() {
                    this.src = 'images/pit.png';
                };
                mainImageContainer.appendChild(mainImg);
            }
            
            // الصور المصغرة
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-item';
            const thumbImg = document.createElement('img');
            thumbImg.src = img;
            thumbImg.alt = `صورة ${index + 1}`;
            thumbImg.onerror = function() {
                this.src = 'images/pit.png';
            };
            thumbnail.appendChild(thumbImg);
            
            thumbnail.addEventListener('click', () => {
                document.querySelectorAll('.thumbnail-item').forEach(item => {
                    item.classList.remove('active');
                });
                thumbnail.classList.add('active');
                mainImageContainer.querySelector('img').src = img;
            });
            
            // تفعيل أول صورة مصغرة
            if (index === 0) {
                thumbnail.classList.add('active');
            }
            
            thumbnailGallery.appendChild(thumbnail);
        });
    },
    
    // عرض خيارات التخصيص
    renderCustomizationOptions(product) {
        // تعيين السعر الأساسي
        document.getElementById('basePrice').textContent = product.price.toFixed(2) + ' درهم';
        document.getElementById('optionsPrice').textContent = '0.00 درهم';
        document.getElementById('totalPrice').textContent = product.price.toFixed(2) + ' درهم';
        
        // عرض خيارات الحجم
        const sizeOptionsContainer = document.getElementById('sizeOptions');
        sizeOptionsContainer.innerHTML = '';
        
        product.sizes.forEach((size, index) => {
            const sizeElement = document.createElement('div');
            sizeElement.className = `option-item ${index === 0 ? 'selected' : ''}`;
            sizeElement.dataset.value = size.id;
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
                this.updateTotalPrice(product);
            });
            
            sizeOptionsContainer.appendChild(sizeElement);
        });
        
        // تعيين الحجم الافتراضي
        if (product.sizes.length > 0) {
            this.selectedSize = product.sizes[0];
        }
        
        // عرض خيارات الإطار مع الصور المصغرة
        const frameOptionsContainer = document.getElementById('frameOptions');
        frameOptionsContainer.innerHTML = '';
        
        product.frames.forEach((frame, index) => {
            const frameElement = document.createElement('div');
            frameElement.className = `option-item frame-option ${index === 0 ? 'selected' : ''}`;
            frameElement.dataset.value = frame.id;
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
                this.updateTotalPrice(product);
            });
            
            frameOptionsContainer.appendChild(frameElement);
        });
        
        // تعيين الإطار الافتراضي
        if (product.frames.length > 0) {
            this.selectedFrame = product.frames[0];
        }
        
        // عرض خيارات الإضافات
        const addonOptionsContainer = document.getElementById('addonOptions');
        addonOptionsContainer.innerHTML = '';
        
        product.addons.forEach(addon => {
            const addonElement = document.createElement('div');
            addonElement.className = 'option-item';
            addonElement.dataset.value = addon.id;
            addonElement.dataset.price = addon.price;
            addonElement.innerHTML = `
                ${addon.name}
                <div class="option-price">+${addon.price.toFixed(2)} درهم</div>
            `;
            
            addonElement.addEventListener('click', () => {
                addonElement.classList.toggle('selected');
                const addonId = addon.id;
                
                if (addonElement.classList.contains('selected')) {
                    this.selectedAddons.push(addon);
                } else {
                    this.selectedAddons = this.selectedAddons.filter(a => a.id !== addonId);
                }
                
                this.updateTotalPrice(product);
            });
            
            addonOptionsContainer.appendChild(addonElement);
        });
    },
    
    // تحديث السعر الإجمالي بناءً على الخيارات
    updateTotalPrice(product) {
        const basePrice = product.price;
        let optionsPrice = 0;
        
        // إضافة سعر الحجم
        if (this.selectedSize) {
            optionsPrice += this.selectedSize.price;
        }
        
        // إضافة سعر الإطار
        if (this.selectedFrame) {
            optionsPrice += this.selectedFrame.price;
        }
        
        // إضافة أسعار الإضافات
        this.selectedAddons.forEach(addon => {
            optionsPrice += addon.price;
        });
        
        const totalPrice = basePrice + optionsPrice;
        
        // تحديث العرض
        document.getElementById('basePrice').textContent = basePrice.toFixed(2) + ' درهم';
        document.getElementById('optionsPrice').textContent = optionsPrice.toFixed(2) + ' درهم';
        document.getElementById('totalPrice').textContent = totalPrice.toFixed(2) + ' درهم';
        
        console.log('💰 السعر المحدث:', { basePrice, optionsPrice, totalPrice });
    },
    
    // عرض المنتجات ذات الصلة
    renderRelatedProducts(currentProduct) {
        const relatedGrid = document.getElementById('relatedGrid');
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
    
    // إعداد مستمعي الأحداث
    setupEventListeners(product) {
        // أحداث تغيير الكمية
        document.querySelector('.decrease-btn').addEventListener('click', () => {
            const quantityInput = document.getElementById('quantityInput');
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            }
        });
        
        document.querySelector('.increase-btn').addEventListener('click', () => {
            const quantityInput = document.getElementById('quantityInput');
            let quantity = parseInt(quantityInput.value);
            quantityInput.value = quantity + 1;
        });
        
        // زر إضافة إلى السلة
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addToCart(product);
        });
    },
    
    // إضافة منتج إلى السلة مع التخصيصات
    addToCart(product) {
        const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
        
        // حساب السعر الإجمالي مع الخيارات
        let totalPrice = product.price;
        
        if (this.selectedSize) {
            totalPrice += this.selectedSize.price;
        }
        
        if (this.selectedFrame) {
            totalPrice += this.selectedFrame.price;
        }
        
        this.selectedAddons.forEach(addon => {
            totalPrice += addon.price;
        });
        
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
            this.cart[existingItemIndex].quantity += quantity;
            this.cart[existingItemIndex].finalPrice = totalPrice;
        } else {
            // إضافة منتج جديد إلى السلة
            const cartItem = {
                id: product.id,
                name: product.name,
                price: product.price, // السعر الأساسي
                finalPrice: totalPrice, // السعر بعد التخصيص
                image: product.images[0],
                quantity: quantity,
                options: options,
                optionsDetails: optionsDetails,
                size: this.selectedSize ? this.selectedSize.name : null // للحفاظ على التوافق
            };
            
            this.cart.push(cartItem);
        }
        
        // حفظ السلة
        this.saveCartToStorage();
        this.updateCartCount();
        
        console.log('🛒 تم إضافة المنتج إلى السلة:', {
            product: product.name,
            quantity: quantity,
            finalPrice: totalPrice,
            options: options,
            optionsDetails: optionsDetails
        });
        
        this.showToast(`تمت إضافة "${product.name}" إلى السلة`, 'success');
        
        // اهتزاز أيقونة السلة
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('shake');
            setTimeout(() => {
                cartIcon.classList.remove('shake');
            }, 500);
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
    
    // عرض إشعار
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
const descContainer = document.querySelector(".product-description");

product.description.forEach(paragraph => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    descContainer.appendChild(p);
});