/**
 * 说明：此为公共组件，比如警告框等
 */
import {  notification } from 'antd';

module.exports = {
    showNotification: function (type, title, content, duration) {
        console.log(duration)
        notification[type]({
            message: title,
            description: content,
            duration: duration || 3
        });
    }
}
