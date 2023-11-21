import { plugin,kernelApi } from "../asyncModules.js";
import { 保存 } from "../utils/files.js";
import './stylesWatcher.js'
import { openStyleDialog as openTextStyle } from "../UI/textStlyleEditor.js";
import { openStyleDialog as openBackgroundStyle } from "../UI/backgroundStyleEditor.js";
import { hasClosestBlock } from "../utils/DOMFinder.js";
const { eventBus } = plugin
function camelToKebab(string) {
    return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
eventBus.on('save-all',保存)
eventBus.on('css-props-change', (e) => {
    const data = e.detail;
    plugin.blockElements&& plugin.blockElements.forEach(element => {
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                let kebabProp = camelToKebab(prop);
                // 替换双引号为单引号
                let value = data[prop].replace(/\"/g, "'");
                element.style.setProperty(kebabProp, value);

                let newStyle = (element.getAttribute('style') || "").replace(/\"/g, "'");
                element.setAttribute('style', newStyle);
                kernelApi.setBlockAttrs({
                    id:element.getAttribute("data-node-id"),
                    attrs:{style:element.getAttribute("style")}
                })
            }
        }
    });
})

eventBus.on('css-backgroundImage-add', (e) => {
    const data = e.detail;
    plugin.blockElements&&plugin.blockElements.forEach(element => {
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                // 替换双引号为单引号
                let value = data[prop].replace(/\"/g, "'");
                let newStyle = (element.getAttribute('style') || "") + `;background-image:${value}`
                element.setAttribute('style', newStyle);
                kernelApi.setBlockAttrs({
                    id:element.getAttribute("data-node-id"),
                    attrs:{style:element.getAttribute("style")}
                })

            }
        }
    });
})
eventBus.on('clear-style', (e) => {
    const data = e.detail;
    if(data.props==='all'){
        plugin.blockElements&& plugin.blockElements.forEach(element => {
            element.setAttribute('style',"")
            kernelApi.setBlockAttrs({
                id:element.getAttribute("data-node-id"),
                attrs:{style:element.getAttribute("style")}
            })

        });
    
    }
    if(data.props==='background'){
        plugin.blockElements&&plugin.blockElements.forEach(element => {
            element.style.background = "";
            kernelApi.setBlockAttrs({
                id:element.getAttribute("data-node-id"),
                attrs:{style:element.getAttribute("style")}
            })

        });
    
    }
})
eventBus.on('click-editorcontent', (e) => {
    const event = e.detail.event;
    if(hasClosestBlock(event.srcElement)){
        if(!(document.querySelectorAll('.protyle-wysiwyg--select')[0])){
            let id =hasClosestBlock(event.srcElement).getAttribute('data-node-id')
            plugin.blockElements= []
            plugin.blockElements=plugin.blockElements.concat(Array.from(document.querySelectorAll(`.protyle-wysiwyg [data-node-id="${id}"]`)))
        }
    }
})
eventBus.on('dialog-open-backgroundEditor', (e) => {
    openBackgroundStyle()
})


document.addEventListener(
    "mouseup",()=>{
        const blockElements = document.querySelectorAll('.protyle-wysiwyg--select')
        if(blockElements[0]){
        plugin.blockElements= blockElements
        openTextStyle()
        }
    }
)