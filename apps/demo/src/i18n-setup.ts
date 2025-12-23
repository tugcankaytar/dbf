/**
 * Demo uygulaması için i18n dictionary'lerini register eder.
 * Bu dosya uygulama başlangıcında import edilir.
 */
import { registerLanguage } from "dbf-core";
import en from "./json/english.json";
import tr from "./json/turkish.json";

registerLanguage("en", en);
registerLanguage("tr", tr);

