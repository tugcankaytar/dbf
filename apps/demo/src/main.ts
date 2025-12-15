import "./style.css";
import "./dbf-counter";
import "./dbf-input";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <dbf-counter></dbf-counter>
  <dbf-input placeholder="Adınızı girin"></dbf-input>
`;

