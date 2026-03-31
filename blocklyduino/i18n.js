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
    
    updateToolboxCategories();
    updateToolboxTree();
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
  
  i18n.currentLang = targetLang;
  updateToolboxCategories();
  updateLanguageSelector();
}

function setLanguage(lang) {
  if (!i18n.translations[lang]) {
    loadLanguageScript(lang, function() {
      i18n.currentLang = lang;
      localStorage.setItem('blocklyduino_lang', lang);
      i18n.updateUI();
      updateLanguageSelector();
      // Update toolbox tree after a small delay to ensure DOM is ready
      setTimeout(function() {
        updateToolboxTree();
        if (typeof addToolboxIcons === 'function') {
          addToolboxIcons();
        }
        // Re-apply board-specific toolbox if needed
        if (typeof updateToolboxForBoard === 'function' && typeof getSelectedBoard === 'function') {
          var board = getSelectedBoard();
          if (board) {
            updateToolboxForBoard(board);
          }
        }
      }, 100);
    });
  } else {
    i18n.currentLang = lang;
    localStorage.setItem('blocklyduino_lang', lang);
    i18n.updateUI();
    updateLanguageSelector();
    setTimeout(function() {
      updateToolboxTree();
      if (typeof addToolboxIcons === 'function') {
        addToolboxIcons();
      }
      // Re-apply board-specific toolbox if needed
      if (typeof updateToolboxForBoard === 'function' && typeof getSelectedBoard === 'function') {
        var board = getSelectedBoard();
        if (board) {
          updateToolboxForBoard(board);
        }
      }
    }, 100);
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

function updateToolboxCategories() {
  var toolboxXml = document.getElementById('toolbox');
  if (!toolboxXml) return;
  
  var categories = toolboxXml.querySelectorAll('category[data-i18n-name]');
  categories.forEach(function(category) {
    var key = category.getAttribute('data-i18n-name');
    var translation = i18n.t(key);
    category.setAttribute('name', translation);
  });
}

function updateToolboxTree() {
  // Update the DOM elements directly
  var labels = document.querySelectorAll('.blocklyTreeLabel');
  labels.forEach(function(label) {
    var currentText = label.textContent.trim();
    var translationKey = findTranslationKey(currentText);
    if (translationKey) {
      var translation = i18n.t(translationKey);
      label.textContent = translation;
    }
  });
}

function findTranslationKey(text) {
  var categories = i18n.translations['en'] && i18n.translations['en'].categories;
  if (!categories) return null;
  
  for (var key in categories) {
    if (categories[key] === text) {
      return 'categories.' + key;
    }
  }
  return null;
}
