/**
 * Created by Kaiser on 2017/9/16.
 */

module.exports = (dom, data) => {
    let container = dom.querySelector('.popup')
    container.querySelector('.cover').addEventListener('click', () => {
        container.style.display = 'none'
    })

    container.querySelector('.cancel').addEventListener('click', () => {
        data['cancel']['event']()
    })

    container.querySelector('.confirm').addEventListener('click', () => {
        data['confirm']['event']()
    })
}
