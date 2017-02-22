import 'pixi.js'
import 'pixi-display'
import { getTexture } from '../assets'
import './pixi-cocoontext'
import backgroundImage from '../img/background.png'
import backgroundImage2 from '../img/background2.png'
import {getTheme} from './toggleDarkMode'

// const getTexture = () => 0
PIXI.cocoontext.CONST.TEXT_RESOLUTION = 1

const textuteCache = {}

const ObjectGroup = new  PIXI.DisplayGroup(1,true)
const TextGroup = new PIXI.DisplayGroup(2,false)


const LightGroundTexture = new PIXI.Texture.fromImage(backgroundImage)
const DarkGroundTexture = new PIXI.Texture.fromImage(backgroundImage2)

export default class Rendered {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = PIXI.autoDetectRenderer(innerWidth,innerHeight, { view: canvas,transparent : true,antialias : false })
        this.container = new PIXI.Container();
        this.stage = new PIXI.Container()
        this.graph = new PIXI.Graphics()
        this.graphInfo = new PIXI.Graphics()
        this.ground = new PIXI.extras.TilingSprite(LightGroundTexture)
        this.ground.anchor.set(0.5,0.5)
        this.container.addChild(this.ground)
        this.container.addChild(this.graph)
        this.container.addChild(this.stage)
        this.container.addChild(this.graphInfo)
        this.stage.displayList = new PIXI.DisplayList();
        this._sprite = this.graphInfo
        this.zoom = 1
        this.render()
    }
    setText(...args){
        SpriteProxyPrototype.setText.bind(this)(...args)
        for(var i in this) {
            if(i.startsWith('_text@') && this[i]){
                var textSprite = this[i]
                textSprite.scale.set(1)
                textSprite.resolution = 1
                textSprite.position.x = this.renderer.width / 2
                textSprite.position.y = this.renderer.height / 2
            }
        }
    }
    render() {
        this._updateZoom()
        this.renderer.render(this.container)
    }

    static createSpriteFromeImage(src) {
        if (!textuteCache[src]) {
            var tmp = getTexture(src)
            if (tmp instanceof PIXI.Texture) {
                // console.log('MATCH SPRITE ' ,src)
                textuteCache[src] = tmp
                return new PIXI.Sprite(tmp)
            } else if (tmp instanceof Promise) {
                // console.log('MATCH ASYNC SPRITE ' ,src)

                var sprite = new PIXI.Sprite()
                tmp.then(e => (textuteCache[src] = sprite.texture = e))
                return sprite
            }else{
                // console.warn('MISSING SPRITE ALTATS:' +src)

                textuteCache[src] = PIXI.Texture.fromImage(src)
                return new PIXI.Sprite(textuteCache[src])
            }
        }else
            return new PIXI.Sprite(textuteCache[src])
    }

    set scale(value){
        this._scale = value
        this.stage.scale.set(this._scale)
    }

    get scale(){
        return this._scale
    }

    set zoom(zoom){
        if (this._zoom === undefined) {
            this.__zoom = this.___zoom = zoom;
        }
        this._zoom = zoom
    }
    get zoom(){
        return this.___zoom || 1
    }
    updateSkin(){
        var theme = getTheme()
        this.ground.texture = {
            'light': LightGroundTexture,
            'dark': DarkGroundTexture,
        }[theme] || LightGroundTexture
    }

    _updateZoom(){
        this.___zoom += (this.__zoom - this.___zoom) * 0.5;
        this.__zoom += (this._zoom - this.__zoom) * 0.5;

        var zoom = this.zoom || 1

        this.container.scale.set(zoom)
        this.container.position.set(
            this.renderer.width*(1 - zoom)* 0.5,
            this.renderer.height*(1 - zoom) *0.5
        )
        this.ground.width = this.renderer.width / zoom
        this.ground.height = this.renderer.height / zoom
        this.ground.position.set(
            this.renderer.width * 0.5,
            this.renderer.height * 0.5,
        )
    }

}

const SpriteProxyPrototype = {
    render(x, y, width, height) {
        this._sprite.position.set(x,y)
        this._sprite.zOrder = -width - height
        // this._spriteImage.zOrder = -width - height
        if(this._spriteImage.width != width || this._spriteImage.height != height){
            // console.log('setWidthHeight Run')
            this._spriteImage.width = width;
            this._spriteImage.height = height;
        }
    },
    setSrc(src) {
        if (!textuteCache[src]){
            var tmp = getTexture(src)
            if (tmp instanceof PIXI.Texture) {
                // console.log('MATCH SPRITE ' ,src)
                textuteCache[src] = tmp
                this._spriteImage.texture = tmp
            } else if (tmp instanceof Promise) {
                // console.log('MATCH ASYNC SPRITE ' ,src)
                tmp.then(e => (textuteCache[src] = this._spriteImage.texture  = e))
            }else{
                // console.warn('MISSING SPRITE ALTATS:' +src)
                this._spriteImage.texture = textuteCache[src] = PIXI.Texture.fromImage(src)
            }
        }else if(this._spriteImage.texture != textuteCache[src]){
            this._spriteImage.texture = textuteCache[src];
            // console.log('setSrc Run')
        }
    },
    setText(text, key, {font = 'bold 20px Arial', fill = '#ffffff', align = 'center', stroke = '#000000', thin = 1, x = 0, y = 0, } = {}) {
        const scale = (this._stage || this.stage).scale.x
        var sym = '_text@' + key
        var textStyle = { font , fill, align, stroke, strokeThickness: thin }
        if(!text){
            if(this[sym]){
                this._sprite && this._sprite.removeChild(this[sym])
                this[sym] = null;
            }
        }else if (!this[sym]) {
            var textSprite = new  PIXI.cocoontext.CocoonText(text, textStyle)
            // var textSprite = new  PIXI.Text(text, textStyle)
            textSprite.resolution = scale * devicePixelRatio
            textSprite.anchor.set(0.5, 0.5)
            // textSprite.displayGroup = TextGroup
            textSprite.position.set(x,y)
            this[sym] = textSprite
            textSprite.scale.set(1 / scale)
            this._sprite && this._sprite.addChild(textSprite)
        } else {
            var textSprite = this[sym]
            var changeStyle = false
            if(textSprite.text != text)
                textSprite.text = text;
            textSprite.position.set(x,y)
            for(var i in textStyle)
                changeStyle = changeStyle || (textStyle[i] != textSprite.style[i])

            textSprite.style = textStyle

            textSprite.scale.set(1 / scale)
            textSprite.resolution = scale * devicePixelRatio

        }

    }
}

/**
 * @param {PIXI.Container} stage
 * @param {String} imageSrc
 */
export function SpriteProxy(stage, imageSrc = '') {

    function onDel(e){
        if(e && e.ceilDatas && Object.keys(e.ceilDatas).length){
            for(var i in e.ceilDatas)
                onDel(e.ceilDatas[i])
        }
        if(e){
            e._sprite && stage.removeChild(e._sprite)
            e._sprite = null
            e._spriteImage = null
        }
    }

    return {
        onNew(e) {
            const sprite = new PIXI.Sprite()

            const imageSprite =  Rendered.createSpriteFromeImage( (e.sprite + '').endsWith('.png') ? e.sprite : imageSrc)
            imageSprite.anchor.set(0.5, 0.5);
            sprite.addChild(imageSprite)
            stage.addChild(sprite)
            for(var i in SpriteProxyPrototype)
                e[i] = SpriteProxyPrototype[i].bind(e)
            e._stage = stage
            e._sprite = sprite
            e._spriteImage = imageSprite
            e._sprite.displayGroup = ObjectGroup
        },
        onDel(e) {
            onDel (e);
        },
        onChage(e) { }
    }
}
