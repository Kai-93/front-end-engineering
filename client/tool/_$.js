/**
 * Created by Kaiser on 2017/9/16.
 */
function find (strClassNameOrIdOrTagName) {
    let arrDomObj = document.querySelectorAll(strClassNameOrIdOrTagName)
    let rt = arrDomObj
    if (rt.length === 1) {
        rt = arrDomObj[0]
    }
    return rt
}

module.exports = find
