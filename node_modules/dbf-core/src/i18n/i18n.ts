/**
 * Basit bir i18n (internationalization) sistemi.
 * Kullanıcı dictionary'lerini register eder, dil değiştirir ve string'leri alır.
 */

export type LanguageCode = string;

type Dictionary = Record<string, any>;

type Listener = (lang: LanguageCode) => void;

/**
 * i18n manager instance'ı
 */
class I18nManager {
  private dictionaries: Map<LanguageCode, Dictionary> = new Map();
  private currentLang: LanguageCode = "";
  private listeners: Set<Listener> = new Set();
  private defaultLang: LanguageCode = "";

  /**
   * Bir dil için dictionary kaydet.
   * İlk kaydedilen dil otomatik olarak default ve current olur.
   */
  register(lang: LanguageCode, dict: Dictionary): void {
    this.dictionaries.set(lang, dict);
    if (!this.defaultLang) {
      this.defaultLang = lang;
      this.currentLang = lang;
    }
  }

  /**
   * Mevcut dili al.
   */
  getLanguage(): LanguageCode {
    return this.currentLang || this.defaultLang;
  }

  /**
   * Dili değiştir ve tüm listener'ları bilgilendir.
   */
  setLanguage(lang: LanguageCode): void {
    if (!this.dictionaries.has(lang)) {
      console.warn(`[dbf-core:i18n] Language "${lang}" not registered.`);
      return;
    }
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    this.listeners.forEach((fn) => fn(lang));
  }

  /**
   * Dil değişikliğini dinle. Cleanup fonksiyonu döner.
   */
  onLanguageChange(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /**
   * Mevcut dil için dictionary'yi al.
   */
  getStrings(): Dictionary {
    const lang = this.getLanguage();
    const dict = this.dictionaries.get(lang);
    if (!dict) {
      console.warn(`[dbf-core:i18n] No dictionary for language "${lang}".`);
      return {};
    }
    return dict;
  }

  /**
   * Belirli bir dil için dictionary'yi al.
   */
  getStringsFor(lang: LanguageCode): Dictionary {
    const dict = this.dictionaries.get(lang);
    if (!dict) {
      console.warn(`[dbf-core:i18n] No dictionary for language "${lang}".`);
      return {};
    }
    return dict;
  }

  /**
   * Kayıtlı tüm dilleri al.
   */
  getAvailableLanguages(): LanguageCode[] {
    return Array.from(this.dictionaries.keys());
  }
}

// Global singleton instance
const i18n = new I18nManager();

export { i18n };

/**
 * Convenience functions (global instance üzerinden)
 */
export function registerLanguage(lang: LanguageCode, dict: Dictionary): void {
  i18n.register(lang, dict);
}

export function getLanguage(): LanguageCode {
  return i18n.getLanguage();
}

export function setLanguage(lang: LanguageCode): void {
  i18n.setLanguage(lang);
}

export function onLanguageChange(fn: Listener): () => void {
  return i18n.onLanguageChange(fn);
}

export function getStrings(): Dictionary {
  return i18n.getStrings();
}

export function getStringsFor(lang: LanguageCode): Dictionary {
  return i18n.getStringsFor(lang);
}

export function getAvailableLanguages(): LanguageCode[] {
  return i18n.getAvailableLanguages();
}

