// أنشئ ملف install.js في موقعك
const installButton = document.createElement('button');
installButton.textContent = '📲 تثبيت التطبيق';
installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    z-index: 1000;
`;

document.body.appendChild(installButton);

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                alert('✅ تم تثبيت التطبيق بنجاح!');
            }
            deferredPrompt = null;
        });
    }
});
