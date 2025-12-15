import { DBFComponent, define, html, render, on } from "dbf-core";
import imageUrl from "../public/vite.svg";

interface CounterState {
  count: number;
}

class DbfCounter extends DBFComponent<CounterState> {
  state: CounterState = { count: 1 };

  // Event listener'ı her render'da değil, sadece bir kez mount olduğunda bağla
  protected override componentDidMount(): void {
    on(this.root, "click", "[data-action='inc']", () => {
      this.setState({ count: this.state.count + 1 });
    });
  }

  render() {
    render(this.root, html`
      <style>
        :host{display:block;font:14px system-ui;padding:12px}
        button{padding:8px 12px;border:1px solid #ddd;border-radius:10px;cursor:pointer}
      </style>

      <h2>DBF Core Demo</h2>
      <img src="${imageUrl}">
      <p>Count: <b>${this.state.count}</b></p>
      <button data-action="inc">+1</button>
    `);
  }
}

define("dbf-counter", DbfCounter);
