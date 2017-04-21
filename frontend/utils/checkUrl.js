/**
 * 测试 nginx location url是否合法，并检测是否有包含关系
 * @param url
 * @param urls
 */
const checkUrl = module.exports = function checkUrl(url, urls) {
    let reg = /^((=|\^~|~|~\*)\s+|\/)/g;
    let match = url.match(reg);
    let result = true;

    if (!!match) {
        let p = url.split(/\s+/);
        let pathReg = /\w+/g;
        if (p.length == 1) {
            if (!!url.match(pathReg)) {
                result = true;
            } else {
                result = false;
            }
        } else if (p.length == 2) {
            if (!!p[1].match(pathReg)) {
                result = true;
            } else {
                result = false;
            }
        } else {
            return false;
        }
    } else {
        result = false
    }

    console.log(result ? '验证通过' : '验证未通过');

    return result;

};

//正确情况
// checkUrl('= /index.html');
// checkUrl('^~ /index.html');
// checkUrl('~ /vplay_*.html');
// checkUrl('~* /index.html');
// checkUrl('/index.html');
// checkUrl('/');
//
// 错误情况
// checkUrl('$');
// checkUrl('index');
// checkUrl('*index.html');
// checkUrl('$ index.html');
// checkUrl('/index.html\\*');
//
//
// 验证包含情况
// checkUrl('= /index.html', ['/']);
// checkUrl('/index/subdir?a=1#22', ['/']);
// checkUrl('^~ /index.html', ['/']);
// checkUrl('^~ /index.html', ['/']);
