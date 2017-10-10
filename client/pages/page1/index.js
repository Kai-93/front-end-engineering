/**
 * Created by Kaiser on 2017/9/21.
 */
import tpl from '../../tool/tpl'
import _$ from '../../tool/_$'
import flexible from '../../tool/flexible'
(() => {
    flexible(window, window['lib'] || (window['lib'] = {}));
    /* popup */
    (() => {
        require('../../components/popup/popup.scss')
        let data = {
            'title': '提示',
            'content': '这是弹窗内容1',
            'cancel': {
                'text': '取消',
                'event': () => {
                    _$('.popup').style.display = 'none'
                    console.log('cancel')
                }
            },
            'confirm': {
                'text': '确定',
                'event': () => {
                    _$('.popup').style.display = 'none'
                    console.log('confirm')
                }
            }
        }
        let render = require('../../components/popup/popup1.art')
        let funEventRegister = require('../../components/popup/popup.js')
        let html = tpl(render, funEventRegister, data)
        _$('.plug').appendChild(html)
    })();
    /* header */
    (() => {
        require('../../components/header/header.scss')
        let data = {}
        let render = require('../../components/header/header.art')
        let funEventRegister = require('../../components/header/header.js')
        let html = tpl(render, funEventRegister, data)
        _$('.container').appendChild(html)
    })();
})()
