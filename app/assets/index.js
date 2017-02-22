import 'pixi.js'
import '!!file?name=[path][name].[ext]!./sprite.png'
import spritesheet from './sprite.json'
import spritesheetURL from '!!file?name=[path][name].[ext]!./sprite.json'

var textures = {}

var loadPromise = new Promise(resolve => {
    PIXI.loader.add("sheet", spritesheetURL,{ xhrType: 'json'}).load(function (loader, resources) {
        resolve(resources.sheet.textures)
        textures = resources.sheet.textures
    });
})

const getTexture = function(path){
    var key = path.split('/').pop()
    return textures[key]
        || (spritesheet[key] && loadPromise.then(() => Promise.resolve(textures[key]) ))
        || null
}


export {getTexture}
