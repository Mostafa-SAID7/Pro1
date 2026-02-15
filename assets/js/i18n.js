/*==================== INTERNATIONALIZATION (i18n) ====================*/

// Get the current language
let currentLanguage = 'en';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function () {
    initLanguage();
    setupLanguageSelector();
});

// Initialize language
function initLanguage() {
    const savedLanguage = getSavedLanguage();
    const browserLanguage = getBrowserLanguage();
    const languageToUse = savedLanguage || browserLanguage || 'en';

    setLanguage(languageToUse);
}

// Get saved language from localStorage
function getSavedLanguage() {
    return localStorage.getItem('preferred-language');
}

// Get browser language
function getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    // Extract the language code (e.g., 'en' from 'en-US')
    const langCode = browserLang.split('-')[0];
    // Check if we support this language
    return translations[langCode] ? langCode : null;
}

// Save language preference
function saveLanguage(lang) {
    localStorage.setItem('preferred-language', lang);
}

// Set up language selector
function setupLanguageSelector() {
    const languageSelect = document.getElementById('language-select');

    if (languageSelect) {
        // Set the current language in the selector
        languageSelect.value = currentLanguage;

        // Add event listener for language change
        languageSelect.addEventListener('change', function () {
            const newLanguage = this.value;
            setLanguage(newLanguage);
            saveLanguage(newLanguage);
        });
    }
}

// Set the language
function setLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not supported`);
        return;
    }

    currentLanguage = lang;

    // Update the language selector if it exists
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = lang;
    }

    // Set the HTML direction (RTL for Arabic)
    setDirection(lang);

    // Translate the page
    translatePage(lang);
}

// Set text direction (LTR or RTL)
function setDirection(lang) {
    const html = document.documentElement;

    if (lang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', lang);
    }
}

// Translate the page with smooth fade transition
function translatePage(lang) {
    // Add smooth fade-out effect
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.2s ease';

    setTimeout(() => {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getTranslation(key, lang);

            if (translation) {
                // Check if we should translate placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Fade back in
        document.body.style.opacity = '1';
    }, 100);
}

// Get translation by key
function getTranslation(key, lang) {
    const keys = key.split('.');
    let translation = translations[lang];

    for (const k of keys) {
        if (translation && translation[k]) {
            translation = translation[k];
        } else {
            console.warn(`Translation not found for key: ${key} in language: ${lang}`);
            return null;
        }
    }

    return translation;
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}
