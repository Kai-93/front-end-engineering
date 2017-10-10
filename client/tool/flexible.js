/**
 * Created by Kaiser on 2017/6/9.
 */
module.exports = (win, lib) => {
    let doc = win.document
    let docEl = doc.documentElement
    let metaEl = doc.querySelector('meta[name="viewport"]')
    let flexibleEl = doc.querySelector('meta[name="flexible"]')
    let dpr = 0
    let scale = 0
    let tid
    let size = 7.5
    let flexible = lib.flexible || (lib.flexible = {})
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例')
        let match = metaEl.getAttribute('content').match(/initial\u002dscale=([\d\u002e]+)/)
        if (match) {
            scale = parseFloat(match[1])
            dpr = parseInt(1 / scale)
        }
        let numActualFontSize = parseFloat(window.getComputedStyle(document.querySelector('html'))['fontSize'])
        let fontSize = parseFloat(document.querySelector('html').style.fontSize)
        if (fontSize !== numActualFontSize) {
            document.querySelector('html').style.fontSize = fontSize * fontSize / numActualFontSize + 'px'
        }
    } else if (flexibleEl) {
        let content = flexibleEl.getAttribute('content')
        if (content) {
            let initialDpr = content.match(/initial\u002ddpr=([\d\u002e]+)/)
            let maximumDpr = content.match(/maximum\u002ddpr=([\d\u002e]+)/)
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1])
                scale = parseFloat((1 / dpr).toFixed(2))
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1])
                scale = parseFloat((1 / dpr).toFixed(2))
            }
        }
    }
    if (!dpr && !scale) {
        let isAndroid = win.navigator.appVersion.match(/android/gi)
        let isIPhone = win.navigator.appVersion.match(/iphone/gi)
        let devicePixelRatio = win.devicePixelRatio
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2
            } else {
                dpr = 1
            }
        } else if (isAndroid) {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1
        }
        scale = 1 / dpr
    }
    docEl.setAttribute('data-dpr', dpr)
    if (!metaEl) {
        metaEl = doc.createElement('meta')
        metaEl.setAttribute('name', 'viewport')
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl)
        } else {
            let wrap = doc.createElement('div')
            wrap.appendChild(metaEl)
            doc.write(wrap.innerHTML)
        }
    }
    function refreshRem () {
        let width = docEl.getBoundingClientRect().width
        if (width / dpr > 540) {
            width = 540 * dpr
        }
        let rem = width / size
        window.fontSize = rem
        docEl.style.fontSize = rem + 'px'
        flexible.rem = win.rem = rem
        let numActualFontSize = parseFloat(window.getComputedStyle(document.querySelector('html'))['fontSize'])
        if (rem !== numActualFontSize) {
            document.querySelector('html').style.fontSize = rem * rem / numActualFontSize + 'px'
        }
    }

    win.addEventListener('resize', () => {
        clearTimeout(tid)
        tid = setTimeout(refreshRem, 300)
    }, false)
    win.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            clearTimeout(tid)
            tid = setTimeout(refreshRem, 300)
        }
    }, false)

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px'
    } else {
        doc.addEventListener('DOMContentLoaded', (e) => {
            doc.body.style.fontSize = 12 * dpr + 'px'
        }, false)
    }
    refreshRem()
    flexible.dpr = win.dpr = dpr
    flexible.refreshRem = refreshRem
    flexible.rem2px = (d) => {
        let val = parseFloat(d) * this.rem
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px'
        }
        return val
    }
    flexible.px2rem = (d) => {
        let val = parseFloat(d) / this.rem
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem'
        }
        return val
    }
}
