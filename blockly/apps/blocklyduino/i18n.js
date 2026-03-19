var i18n = {
  currentLang: 'en',
  translations: {},
  
  availableLanguages: {
    'en': 'English',
    'de': 'Deutsch'
  },
  
  registerTranslations: function(lang, translations) {
    this.translations[lang] = translations;
  },
  
  t: function(key, params) {
    var keys = key.split('.');
    var value = this.translations[this.currentLang];
    
    for (var i = 0; i < keys.length; i++) {
      if (value && value[keys[i]] !== undefined) {
        value = value[keys[i]];
      } else {
        value = this.getFallback(keys);
        break;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    if (params) {
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          value = value.replace('{' + param + '}', params[param]);
        }
      }
    }
    
    return value;
  },
  
  getFallback: function(keys) {
    var value = this.translations['en'];
    for (var i = 0; i < keys.length; i++) {
      if (value && value[keys[i]] !== undefined) {
        value = value[keys[i]];
      } else {
        return keys.join('.');
      }
    }
    return typeof value === 'string' ? value : keys.join('.');
  },
  
  updateUI: function() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var params = el.getAttribute('data-i18n-params');
      var translation = i18n.t(key, params ? JSON.parse(params) : null);
      
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-title');
      el.title = i18n.t(key);
    });
  }
};

function initI18n() {
  var browserLang = navigator.language || navigator.userLanguage;
  browserLang = browserLang.split('-')[0];
  
  var savedLang = localStorage.getItem('blocklyduino_lang');
  var targetLang = 'en';
  
  if (savedLang && i18n.availableLanguages[savedLang]) {
    targetLang = savedLang;
  } else if (i18n.availableLanguages[browserLang]) {
    targetLang = browserLang;
  }
  
  if (targetLang !== 'en' && !i18n.translations[targetLang]) {
    loadLanguageScript(targetLang, function() {
      i18n.currentLang = targetLang;
      i18n.updateUI();
      updateLanguageSelector();
    });
  } else {
    i18n.currentLang = targetLang;
    i18n.updateUI();
    updateLanguageSelector();
  }
}

function setLanguage(lang) {
  if (!i18n.translations[lang]) {
    loadLanguageScript(lang, function() {
      i18n.currentLang = lang;
      localStorage.setItem('blocklyduino_lang', lang);
      i18n.updateUI();
      updateLanguageSelector();
    });
  } else {
    i18n.currentLang = lang;
    localStorage.setItem('blocklyduino_lang', lang);
    i18n.updateUI();
    updateLanguageSelector();
  }
}

function loadLanguageScript(lang, callback) {
  var script = document.createElement('script');
  script.src = 'lang/' + lang + '.js';
  script.onload = function() {
    if (callback) callback();
  };
  script.onerror = function() {
    console.warn('Failed to load language:', lang);
  };
  document.head.appendChild(script);
}

function updateLanguageSelector() {
  var selector = document.getElementById('languageSelector');
  if (selector) {
    selector.value = i18n.currentLang;
  }
}
