export function renderHome(root: HTMLElement) {
  root.innerHTML = `
    <home-hero></home-hero>
    <home-stats></home-stats>
    <home-features></home-features>
    <home-newsletter></home-newsletter>
  `;
}
