import define from '../../utils/define.js';

const style = () => /*css*/`
  .navi-tabs-list {
    display: flex;
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: 38px;
    -webkit-app-region: no-drag;
  }

  .navi-tab {
    display: flex;
    align-items: center;
    padding: 0 10px;
    max-width: 200px;
    height: 100%;
    position: relative;
    border-radius: 5px 5px 0 0;
  }

  .navi-tab > .title {
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    overflow: hidden;
    width: 100%;
  }

  .navi-tab:hover {
    background-color: rgba(255, 255, 255, .1);
  }

  .navi-tab:not(.active) {
    border-right: 1px solid var(--titlebar-tab-border-color);
  }

  .navi-tab.active {
    background-color: var(--titlebar-tab-active-bg-color);
  }
`;

const template = ({ data }) => /*html*/`
<ul class="navi-tabs-list">
  <li class="navi-tab active"><span class="title">Tab title MMMMMMMMMMMMMMM</span></li>
  <li class="navi-tab"><span class="title">Tab title</span></li>
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
  }

  __events() {
  }
});