import define from '../../utils/define.js';
import app from '../../app.js';

import tab from './navi-tab.js';

const style = () => /*css*/`
  .navi-tabs-list {
    display: flex;
    overflow: hidden;
    margin: 0;
    padding: 5px;
    height: 48px;
    box-sizing: border-box;
    gap: 5px;
  }

  .navi-tab-action {
    display: flex;
    align-items: center;
    padding: 0 10px;
    max-width: 200px;
    height: 100%;
    position: relative;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, .05);
    cursor: pointer;
    transition: background-color 250ms ease-in-out;
    -webkit-app-region: no-drag;
  }

  .navi-tab-action > svg {
    height: 18px;
    width: auto;
    color: var(--titlebar-text-color) !important;
  }

  .navi-tab-action:hover {
    background-color: rgba(255, 255, 255, .1);
  }

  .navi-tab-action:active {
    background-color: rgba(255, 255, 255, .3);
  }

  .navi-tab-last-item {
    display: none;
  }

`;

const template = ({ data }) => /*html*/`
<ul class="navi-tabs-list">
  <li class="navi-tab-action" id="prev-tab-button">
  <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="80 152 32 104 80 56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><path d="M224,200a96,96,0,0,0-96-96H32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
  </li>
  <li class="navi-tab-action" id="next-tab-button">
  <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="176 152 224 104 176 56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><path d="M32,200a96,96,0,0,1,96-96h96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
  </li>
  <li class="navi-tab-last-item"></li>
  <li class="navi-tab-action" id="add-tab-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
  </li>
</ul>
`;

export default define('navi-tabs', class extends HTMLElement {
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

    this.initTabs();
  }

  __events() {
    // Add a new tab
    this.shadowRoot.querySelector('#add-tab-button').addEventListener('click', async () => {

      const newPageURL = 'https://www.youtube.com/watch?v=j8-H8GUMYMY&list=PLNdO3e3fKSGdvwCu9PXRpci264cBNEpex';

      const index = this.shadowRoot.querySelectorAll('navi-tab').length;
      const newTab = this.addTab({
        title: 'New Tab',
        url: newPageURL, 
        index 
      });
      app.emit('switch-tab', index);

      await window.electron.actions.addTab(newPageURL);
      // const tabs = await window.electron.getters.tabs();
      // newTab.title = tabs[index].title;
    });

    this.shadowRoot.querySelector('#prev-tab-button').addEventListener('click', async () => {
      await window.electron.actions.tabGoBack();
    });

    this.shadowRoot.querySelector('#next-tab-button').addEventListener('click', async () => {
      await window.electron.actions.tabGoForward();
    });

    app.on('close-tab', (event) => {
      this.indexTabs();
    });

    // Change tab URL
  }

  async initTabs() {
    for (const [index, tab] of (await window.electron.getters.tabs()).entries()) {
      this.addTab({...tab, index});
    }
    app.emit('switch-tab', await window.electron.getters.activeTab());
  }

  addTab(tabInfo) {
    const lastItem = this.shadowRoot.querySelector('.navi-tab-last-item');
    lastItem.insertAdjacentHTML('beforebegin', `<navi-tab data-title="${tabInfo.title}" data-index="${tabInfo.index}" />`);
    return lastItem.previousSibling;
  }

  indexTabs() {
    this.shadowRoot.querySelectorAll('navi-tab').forEach((tab, index) => {
      tab.index = index;
    });
  }
});