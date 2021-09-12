import app from '../app.js';
import define from '../utils/define.js';

const style = () => /*css*/`
  .navi-tab {
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    max-width: 200px;
    min-width: 200px;
    height: 100%;
    position: relative;
    border: 1px solid transparent;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, .05);
    overflow: hidden;
    transition: background-color 250ms ease-in-out;
    -webkit-app-region: no-drag;
  }

  .navi-tab > .title {
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    overflow: hidden;
    width: 100%;
    line-height: 2rem;
  }

  .navi-tab > .favicon.active {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }

  .navi-tab:hover {
    background-color: rgba(255, 255, 255, .1);
  }

  .navi-tab:not(.active) {
    /*border-right: 1px solid var(--titlebar-tab-border-color);*/
  }

  .navi-tab.active {
    background-color: var(--titlebar-tab-active-bg-color);
    border: 1px solid rgba(255, 255, 255, .1);
  }

  .close-button {
    position: relative;
    z-index: 1;
    display: flex;
    background-color: transparent;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, .1);
    padding: 2px;
    opacity: 0;
    cursor: pointer;
    transition: 
      opacity 250ms ease-in-out,
      background-color 250ms ease-in-out;
    outline: none;
  }

  .navi-tab:hover .close-button {
    opacity: 1;
  }

  .close-button:hover {
    background-color: rgba(255, 255, 255, .1);
  }

  .close-button > svg {
    height: 14px;
    width: auto;
    color: var(--titlebar-text-color) !important;
  }

  .background {
    position: absolute;
    right: 0;
    width: 50px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 8px 0 0;
  }

  .background:before {
    content: '';
    position: absolute;
    z-index: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: rgb(0,0,0);
    background: linear-gradient(-90deg, var(--titlebar-tab-active-bg-color) 20%, rgba(255,255,255,0) 100%);
    opacity: 0;
    transition: opacity 200ms ease-in-out;
  }

  .navi-tab:hover .background:before {
    background: linear-gradient(-90deg, var(--titlebar-tab-active-bg-color) 60%, rgba(255,255,255,0) 100%);
    opacity: 1;
  }
`;

const template = ({ data }) => /*html*/`
  <li class="navi-tab">
    <img class="favicon" src="">
    <span class="title">${data.title}</span>
    <div class="background">
      <button class="close-button">
        <!--<div class="background"></div>-->
        <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" stroke="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
      </button>
    </div>
  </li>
`;

export default define('navi-tab', class extends HTMLElement {
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

  __events() {
    this.shadowRoot.querySelector('.navi-tab').addEventListener('click', async () => {
      await window.electron.actions.switchTab(this.index);
      app.emit('switch-tab', this.index);
    });

    app.on('switch-tab', (event) => {
      this.active = event.detail === this.index;
    });

    this.shadowRoot.querySelector('.close-button').addEventListener('click', async (event) => {
      event.stopPropagation();
      await window.electron.actions.closeTab(this.index);
      this.parentElement.removeChild(this);
      app.emit('close-tab', this.index);
      app.emit('switch-tab', await window.electron.getters.activeTab());
    });

    window.electron.listeners.tabUpdate((event, { type, index, data }) => {
      if (index === this.index) {
        switch (type) {
          case 'in-page-navigation-done': {
            this.title = data.title;
            break;
          }
          case 'title-update': {
            this.title = data.title;
            break;
          }
          case 'favicon-update': {
            this.favicon = data.favicons[0] || '';
            break;
          }
        }
      }
    });
  }

  set title(value) {
    this.dataset['title'] = value;
    this.shadowRoot.querySelector('.title').textContent = value;
  }
  get title() { return this.dataset?.title; }

  set favicon(value) {
    this.dataset['favicon'] = value;
    const faviconElement = this.shadowRoot.querySelector('.favicon');
    faviconElement.src = value;
    faviconElement.classList.toggle('active', value !== '');
  }
  get favicon() { return this.dataset?.favicon; }

  set active(value) {
    this.dataset['active'] = value;
    this.shadowRoot.querySelector('.navi-tab').classList.toggle('active', value);
  }
  get active() { return this.dataset?.active; }

  set index(value) { this.dataset['index'] = value; }
  get index() { return Number.parseInt(this.dataset?.index, 10); }

});