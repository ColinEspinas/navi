import define from '../../utils/define.js';

import tabs from './navi-tabs.js';

const style = () => /*css*/`
.navi-window-titlebar {
  width: 100%;

  color: var(--titlebar-text-color);
  background-color: var(--titlebar-bg-color);

  border-bottom: var(--titlebar-border-bottom);

  display: flex;
  align-items: center;

  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.navi-window-titlebar > .title {
  padding: 0 0 0 10px;
  font-size: .8rem;
}

.navi-window-titlebar > .action-buttons {
  display: flex;
  margin-left: auto;
  -webkit-app-region: no-drag;
}

.navi-window-titlebar > .action-buttons > .titlebar-action-button {
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  border: none;
  outline: none;
  padding: 10px 15px;
}

.navi-window-titlebar > .action-buttons > .titlebar-action-button:hover {
  background-color: rgba(255, 255, 255, .1);
}

.navi-window-titlebar > .action-buttons > .titlebar-action-button:active {
  background-color: rgba(255, 255, 255, .3);
}

.navi-window-titlebar > .action-buttons > .titlebar-action-button > svg {
  height: 18px;
  width: auto;
  color: var(--titlebar-text-color) !important;
}
`;

const template = ({ data }) => /*html*/`
<header class="navi-window-titlebar">
  ${ data.tabbed ? tabs : '' }
  <div class="action-buttons">
    <button class="titlebar-action-button" id="minimize-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" stroke="none"></rect><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
    </button>
    <button class="titlebar-action-button" id="maximize-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" stroke="none"></rect><rect x="32.00781" y="80.00005" width="160" height="128" rx="8" stroke-width="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"></rect><path d="M64.00781,48.00005h152a8,8,0,0,1,8,8V176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
    </button>
    <button class="titlebar-action-button" id="close-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" stroke="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
    </button>
  </div>
</header>
`;

export default define('navi-titlebar', class extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.__setup(shadow);
  }

  async __setup(shadow) {
    // Title
    this.dataset.title = document.querySelector('title').textContent;

    // Styles
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(style());
    shadow.adoptedStyleSheets = [sheet];

    // DOM Template
    shadow.innerHTML = template({ data: this.dataset });

    this.__events();
  }

  __events() {
    this.shadowRoot.querySelector('#minimize-button').addEventListener('click', () => {
      window.electron.action.minimize();
    });

    this.shadowRoot.querySelector('#maximize-button').addEventListener('click', () => {
      window.electron.action.maximize();
    });

    this.shadowRoot.querySelector('#close-button').addEventListener('click', () => {
      window.electron.action.close();
    });
  }
});