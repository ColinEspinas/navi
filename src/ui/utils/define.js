
/** Define a web component
 * @function define 
 * @param {string} name
 * @param {CustomElementConstructor} constructor
 * @param {ElementDefinitionOptions} [options]
 * @returns {string} Returns the element name ready for the DOM (.e.g `<navi-window></navi-window>`)
 */
export default (name, constructor, options) => { 
  if (!customElements.get(name)) customElements.define(name, constructor, options); 
  return `<${name}></${name}>`;
}