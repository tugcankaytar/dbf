export function html(strings: TemplateStringsArray, ...values: any[]) {
    let out = "";
    for (let i = 0; i < strings.length; i++) out += strings[i] + (values[i] ?? "");
    return out;
  }
  