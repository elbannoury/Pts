
// استيراد بيانات المنتجات من الملف المنفصل
if (typeof productsData === 'undefined') {
    console.error('❌ً حدث خطأ في التحميل ');
}

// وحدة إدارة المتجر
const StoreManager = {
    // سلة التسوق (مشتركة بين جميع الصفحات)
    cart: [],
    
    // تهيئة المتجر
    initStore() {
        console.log('🚀 تهيئة المتجر...');
        
        // تحميل السلة من localStorage
        this.loadCartFromStorage();
        
        // تحديث عداد السلة
        this.updateCartCount();
        
        // تحميل الفئة المختارة من localStorage
        const selectedCategory = localStorage.getItem('selectedCategory');
        
        // إذا كانت هناك فئة محددة، تطبيق التصفية
        if (selectedCategory) {
            // تعيين قيمة الفئة في القائمة المنسدلة
            document.getElementById('categoryFilter').value = selectedCategory;
  
// اجعلها كذا:
const filteredProducts = productsData.filter(product =>
  product.categories && product.categories.includes(selectedCategory)
);
            
            this.renderProducts(filteredProducts);
            
            // حذف الفئة من localStorage بعد استخدامها
            localStorage.removeItem('selectedCategory');
        } else {
            // عرض جميع المنتجات
            this.renderProducts(productsData);
        }
        
        // إعداد مستمعي الأحداث
        this.setupEventListeners();
        
        console.log('✅ تم تهيئة المتجر بنجاح');
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
    
    // تحديث عداد السلة
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const count = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = count;
            console.log('🔢 عداد السلة:', count);
        }
    },
    
    // عرض المنتجات
    renderProducts(products) {
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>لم يتم العثور على منتجات</h3>
                    <p>جرب تغيير كلمات البحث أو الفئة</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            productCard.dataset.category = product.category;

            // عرض السعر القديم إذا كان متوفراً
            const priceHTML = product.oldPrice 
                ? `<div class="price"><span class="old-price">${product.oldPrice.toFixed(2)} DH</span> ${product.price.toFixed(2)} DH</div>`
                : `<div class="price">${product.price.toFixed(2)} DH</div>`;

            productCard.innerHTML = `
                <div class="product-image-container">
                    ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ''}
                    <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='images/pit.png'">
                    <div class="quick-view">عرض سريع <i class="fas fa-eye"></i></div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    ${priceHTML}
                    <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i> أضف إلى السلة</button>
                </div>
            `;

            productGrid.appendChild(productCard);
        });

        // إضافة أحداث البطاقات
        this.setupProductCardEvents();
        
        console.log('🛍️ تم عرض المنتجات:', products.length, 'منتج');
    },
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // البحث
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e));
        
        // التصفية حسب الفئة
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e));
        
        // إغلاق العرض السريع
        document.getElementById('closeQuickView').addEventListener('click', () => this.closeQuickView());
        
        // إضافة إلى السلة من العرض السريع
        document.getElementById('quickViewAddToCart').addEventListener('click', () => this.addToCartFromQuickView());
        
        console.log('🎯 تم إعداد مستمعي الأحداث');
    },
    
    // إعداد أحداث بطاقات المنتج
    setupProductCardEvents() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // إضافة إلى السلة
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(card.dataset.id);
                this.addToCart(productId, 1, addToCartBtn);
            });
            
            // عرض سريع
            const quickViewBtn = card.querySelector('.quick-view');
            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(card.dataset.id);
                this.showQuickView(productId);
            });
            
            // فتح صفحة التفاصيل عند النقر على البطاقة
            card.addEventListener('click', () => {
                const productId = parseInt(card.dataset.id);
                this.openProductDetailPage(productId);
            });
        });
        
        console.log('🎯 تم إعداد أحداث بطاقات المنتج:', productCards.length, 'بطاقة');
    },
    
    // معالجة البحث
    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm.length < 1) {
            this.renderProducts(productsData);
            return;
        }
        
        const filteredProducts = productsData.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            (product.details && product.details.toLowerCase().includes(searchTerm))
        );
        
        this.renderProducts(filteredProducts);
        
        console.log('🔍 نتائج البحث:', filteredProducts.length, 'منتج');
    },
    handleCategoryFilter(e) {
  const category = e.target.value;
  if (category === 'all') {
    this.renderProducts(productsData);
    return;
  }
  
  // تدعم كلا النظامين: categories أولاً، ثم category كنسخة احتياطية
  const filteredProducts = productsData.filter(product => {
    // إذا كانت هناك مصفوفة categories، ابحث فيها
    if (product.categories && Array.isArray(product.categories)) {
      return product.categories.includes(category);
    }
    // إذا لم تكن، ابحث في category القديمة
    return product.category === category;
  });
  
  this.renderProducts(filteredProducts);
  
  console.log('🏷️ تصفية الفئة:', category, '-', filteredProducts.length, 'منتج');
},
    
    // فتح صفحة تفاصيل المنتج
    openProductDetailPage(productId) {
        window.location.href = `pdcdtl.html?id=${productId}`;
    },
    
    // عرض سريع للمنتج
    showQuickView(productId) {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;
        
        // تحديث محتوى العرض السريع
        document.getElementById('quickViewImage').src = product.images[0];
        document.getElementById('quickViewImage').onerror = function() {
            this.src = 'images/pit.png';
        };
        document.getElementById('quickViewTitle').textContent = product.name;
        
        // عرض السعر القديم إذا كان متوفراً
        const priceHTML = product.oldPrice 
            ? `<span class="old-price">${product.oldPrice.toFixed(2)} DH</span> ${product.price.toFixed(2)} DH`
            : `${product.price.toFixed(2)} DH`;
        
        document.getElementById('quickViewPrice').innerHTML = priceHTML;
        document.getElementById('quickViewDetails').textContent = product.details;
        document.getElementById('quickViewModal').dataset.productId = product.id;
        
        // إظهار النافذة
        document.getElementById('quickViewModal').classList.add('show');
        
        console.log('👁️ عرض سريع للمنتج:', product.name);
    },
    
    // إغلاق العرض السريع
    closeQuickView() {
        document.getElementById('quickViewModal').classList.remove('show');
        console.log('❌ إغلاق العرض السريع');
    },
    
    // إضافة إلى السلة من العرض السريع
    addToCartFromQuickView() {
        const productId = parseInt(document.getElementById('quickViewModal').dataset.productId);
        this.addToCart(productId, 1);
        this.closeQuickView();
    },
    
    // إضافة منتج إلى السلة
    addToCart(productId, quantity = 1, button = null) {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;
        
        // التحقق من وجود المنتج في السلة
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            });
        }
        
        // تحديث السلة
        this.saveCartToStorage();
        this.updateCartCount();
        this.showToast(`تمت إضافة ${product.name} إلى السلة`, 'success');
        
        // تأثير الزر إذا تم توفيره
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
            button.classList.add('added');
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> أضف إلى السلة';
                button.classList.remove('added');
            }, 2000);
        }
        
        console.log('🛒 تم إضافة المنتج إلى السلة:', {
            product: product.name,
            quantity: quantity,
            cartTotal: this.cart.length
        });
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
        
        console.log('📢 إشعار:', message);
    }
};

// تهيئة المتجر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 تم تحميل صفحة المتجر');
    
    // التحقق من توفر بيانات المنتجات
    if (typeof productsData === 'undefined') {
        console.error('❌ بيانات المنتجات غير متوفرة');
        StoreManager.showToast('بيانات المنتجات غير متوفرة. رجاءا حاول اعادة تحميل الصفحة ', 'error');
        return;
    }
    
    setTimeout(() => {
        StoreManager.initStore();
    }, 100);
});

// جعل الدوال متاحة عالمياً للتصحيح
window.storeManager = {
    cart: () => StoreManager.cart,
    products: () => productsData,
    testAddToCart: (productId) => {
        StoreManager.addToCart(productId, 1);
    },
    manager: StoreManager
};


