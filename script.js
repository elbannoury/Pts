// في script.js
let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
  // منع المتصفح من عرض رسالة التثبيت التلقائية
  e.preventDefault();
  // حفظ الحدث ليتم استخدامه لاحقًا
  deferredPrompt = e;
  // إظهار زر التثبيت الخاص بك
  installButton.style.display = 'block';
  
  installButton.addEventListener('click', () => {
    // إخفاء زر التثبيت
    installButton.style.display = 'none';
    // عرض رسالة التثبيت
    deferredPrompt.prompt();
    // الانتظار حتى يختار المستخدم
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('قام المستخدم بتثبيت التطبيق');
      } else {
        console.log('رفض المستخدم تثبيت التطبيق');
      }
      deferredPrompt = null;
    });
  });
});
