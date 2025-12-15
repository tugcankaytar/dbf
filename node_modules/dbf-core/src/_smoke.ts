import { DBFComponent, define, html, render, on } from "./index";

interface CounterState {
  count: number;
}

interface CounterProps {
  initial: number;
}

class DbfCounter extends DBFComponent<CounterState, CounterProps> {
  static props = { initial: "number" } as const;

  state: CounterState = {
    count: this.props.initial ?? 0,
  };

  protected override componentDidMount(): void {
    on(this.root, "click", "[data-action='inc']", () => {
      this.setState({ count: this.state.count + 1 });
    });
  }

  render() {
    render(this.root, html`
      <style>
        button{padding:8px 12px;border:1px solid #ddd;border-radius:10px;cursor:pointer}
      </style>
      <p>Count: <b>${this.state.count}</b></p>
      <button data-action="inc">+1</button>
    `);
  }
}
define("dbf-counter", DbfCounter);
