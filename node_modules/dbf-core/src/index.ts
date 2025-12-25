export { DBFComponent } from "./component/Component";
export { define } from "./component/define";
export { defineComponent } from "./component/defineComponent";
export { html } from "./dom/html";
export { render } from "./dom/render";
export {
  isControlledInput,
  updateControlledInput,
  getInputValue,
  syncFormInputs,
} from "./dom/controlled";
export { on } from "./events/on";
export {
  installGlobalErrorHandler,
  type GlobalErrorHandlerOptions,
  type GlobalErrorSource,
} from "./errors/global";
export {
  ErrorBoundaryComponent,
  createErrorBoundary,
  type ErrorBoundaryState,
  type ErrorBoundaryProps,
} from "./errors/ErrorBoundary";
export {
  parseProp,
  defineProps,
  type PropSchema,
  type PropType,
  type PropsFromSchema,
} from "./component/props";
export {
  i18n,
  registerLanguage,
  getLanguage,
  setLanguage,
  onLanguageChange,
  getStrings,
  getStringsFor,
  getAvailableLanguages,
  type LanguageCode,
} from "./i18n/i18n";
export {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  useReducer,
  type Reducer,
} from "./hooks";
export { createContext, useContext, provideContext, type Context } from "./context";

