/**
 * Created by Kaiser on 2017/9/16.
 * render and translate string to html
 *
 */

module.exports = (render, funEventRegister, data) => {
    let html = render(data)
    let container = document.createElement('div')
    container.innerHTML = html
    funEventRegister(container, data)
    return container.firstChild
}
