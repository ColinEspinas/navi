import define from '../utils/define.js';
import titlebar from './navi-titlebar.js';

const style = () => /*css*/`
  .navi-window {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    border: var(--window-border);
    border-radius: var(--window-border-radius);
    overflow: hidden;
  }

  .navi-window-body {
    width: 100%;
    height: 100%;

    color: var(--window-text-color);
    background-color: var(--window-bg-color);
  }
`;

const template = ({ data }) => /*html*/`
<div class="navi-window">
  <navi-titlebar data-tabbed="${data.tabbed}"></navi-titlebar>
  <main class="navi-window-body">
    <slot></slot>
  </main>
</div>
`;

export default define('navi-window', class extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.__setup(shadow);
  }

  async __setup(shadow) {
    // Styles
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(style());
    shadow.adoptedStyleSheets = [sheet];

    // DOM Template
    shadow.innerHTML = template({ data: this.dataset });

    this.__events();
  }

  __events() {}
});