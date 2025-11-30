// unm.js - نظام إدارة طلبات PITSIKY
const ordersDatabase = {
    // يمكنك إضافة الطلبات هنا بالشكل: "الطابع الزمني-PTS"
    "1764422791768-PTS": {
        status: "delivered", // delivered, shipped, processing, confirmed
        date: "2025-05-10",
        products: "لوحة BMW M4 GT3 و لوحة SIMPSON × AUDI",
        address: "الدار البيضاء، حي السلام، شارع محمد السادس، رقم 45",
        phone: "+212 612-345678",
        customer: "أحمد محمد",
        timeline: [
            { step: "confirmed", title: "تم تأكيد الطلب", date: "2025-05-10", completed: true },
            { step: "processing", title: "قيد التجهيز", date: "2025-05-11", completed: true },
            { step: "shipped", title: "تم الشحن", date: "2025-05-12", completed: true },
            { step: "delivered", title: "تم التسليم", date: "2025-05-13", completed: true }
        ]
    },
    "1764522891869-PTS": {
        status: "shipped",
        date: "2025-05-15",
        products: "لوحة Maybach SL680",
        address: "الرباط، حي الرياض، شارع الحسن الثاني، رقم 12",
        phone: "+212 623-456789",
        customer: "فاطمة الزهراء",
        timeline: [
            { step: "confirmed", title: "تم تأكيد الطلب", date: "2025-05-15", completed: true },
            { step: "processing", title: "قيد التجهيز", date: "2025-05-16", completed: true },
            { step: "shipped", title: "تم الشحن", date: "2025-05-17", completed: true },
            { step: "delivered", title: "تم التسليم", date: "", completed: false }
        ]
    },
    "1764622991960-PTS": {
        status: "processing",
        date: "2025-05-18",
        products: "لوحة BMW M4 Competition",
        address: "مراكش، حي الكرامة، شارع محمد الخامس، رقم 8",
        phone: "+212 634-567890",
        customer: "يوسف أحمد",
        timeline: [
            { step: "confirmed", title: "تم تأكيد الطلب", date: "2025-05-18", completed: true },
            { step: "processing", title: "قيد التجهيز", date: "2025-05-19", completed: true },
            { step: "shipped", title: "تم الشحن", date: "", completed: false },
            { step: "delivered", title: "تم التسليم", date: "", completed: false }
        ]
    },
    "1764723092061-PTS": {
        status: "confirmed",
        date: "2025-05-20",
        products: "لوحة WANTED | مطلوب",
        address: "طنجة، حي المصلى، شارع فلسطين، رقم 25",
        phone: "+212 645-678901",
        customer: "سارة العبد",
        timeline: [
            { step: "confirmed", title: "تم تأكيد الطلب", date: "2025-05-20", completed: true },
            { step: "processing", title: "قيد التجهيز", date: "", completed: false },
            { step: "shipped", title: "تم الشحن", date: "", completed: false },
            { step: "delivered", title: "تم التسليم", date: "", completed: false }
        ]
    }
};

// دالة للتحقق من وجود طلب
function checkOrder(orderNumber) {
    return ordersDatabase[orderNumber] || null;
}

// دالة لإضافة طلب جديد
function addOrder(orderNumber, orderData) {
    if (!ordersDatabase[orderNumber]) {
        ordersDatabase[orderNumber] = orderData;
        return true;
    }
    return false;
}

// دالة لتحديث حالة الطلب
function updateOrderStatus(orderNumber, newStatus) {
    if (ordersDatabase[orderNumber]) {
        ordersDatabase[orderNumber].status = newStatus;
        return true;
    }
    return false;
}

// دالة للحصول على جميع الطلبات (لأغراض الإدارة)
function getAllOrders() {
    return ordersDatabase;
}