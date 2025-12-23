/**
 * Controlled/Uncontrolled input davranışları
 * React-benzeri form input yönetimi
 */

/**
 * Input element'inin controlled mı uncontrolled mı olduğunu kontrol et
 */
export function isControlledInput(element: HTMLElement): boolean {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
    return false;
  }

  // value prop'u varsa controlled
  return element.hasAttribute("value") || element.hasAttribute("checked");
}

/**
 * Controlled input için value'yu güncelle
 */
export function updateControlledInput(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  value: string | number | boolean
): void {
  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox" || element.type === "radio") {
      element.checked = Boolean(value);
    } else {
      element.value = String(value);
    }
  } else if (element instanceof HTMLTextAreaElement) {
    element.value = String(value);
  } else if (element instanceof HTMLSelectElement) {
    element.value = String(value);
  }
}

/**
 * Input'un mevcut değerini al (controlled veya uncontrolled)
 */
export function getInputValue(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): string | boolean {
  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox" || element.type === "radio") {
      return element.checked;
    }
    return element.value;
  }
  return element.value;
}

/**
 * Form element'lerini controlled/uncontrolled modda yönet
 */
export function syncFormInputs(
  root: ShadowRoot | HTMLElement,
  controlledValues: Record<string, any>
): void {
  const inputs = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "input, textarea, select"
  );

  for (const input of inputs) {
    const name = input.name || input.id;
    if (name && controlledValues[name] !== undefined) {
      updateControlledInput(input, controlledValues[name]);
    }
  }
}

