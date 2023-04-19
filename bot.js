/**
 * @ Author: hc
 * @ Create Time: 2022/9/7 15:29
 * @ Modified by: hc
 * @ Modified time: 2022/9/7 15:29
 * @ Description: wx机器人
 */
import WebSocket from 'ws'
import axios from 'axios'
import { getConcatList, getPersonalInfo } from './utils/index.js'
import {
    handleTxtMessageCenter,
    handleFriendMessageCenter,
    handleOtherFileMessageCenter,
    handlePicMessageCenter
} from './plugin/index.js'
import {
    PERSONAL_INFO,
    RECV_TXT_MSG,
    USER_LIST,
    AGREE_TO_FRIEND_REQUEST,
    OTHER_FILE,
    CHATROOM_MEMBER_NICK,
    RECV_PIC_MSG
} from './utils/constant.js'
import { fileURLToPath } from 'url'
import path from 'path'


const port = process.argv.find(v=> /\d+/.test(+v))
export const ws = new WebSocket(`ws://127.0.0.1:${port}`)
export const user = []
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
export let currentBotInfo = {}
export let wxUserList = []

export const axiosInstance = axios.create({
    baseURL: 'https://jd-bus.icu',
    timeout: 5 * 60 * 1000
})

export function bot() {
    // 打开ws连接微信
    ws.on('open', () => {
        // 获取个人信息
        ws.send(getPersonalInfo())
        // 获取所有联系人信息
        ws.send(getConcatList())
    })
    // 消息接收
    ws.on('message', (data) => {
        if (!data) return
        const item = JSON.parse(data)
        const type = item?.type
        if (item && JSON.stringify(item).includes('频繁')) return
        if (item && JSON.stringify(item).includes('开启了朋友验证')) return
        switch (type) {
            case PERSONAL_INFO:
                // 个人信息
                currentBotInfo = JSON.parse(item.content)
                break
            case USER_LIST:
                // 接收到微信所有用户列表
                console.log('wxUserList刷新完毕')
                wxUserList = item.content
                break
            case RECV_TXT_MSG:
                // 接收文本消息
                handleTxtMessageCenter(item)
                break
            case RECV_PIC_MSG:
                // 图片消息
                handlePicMessageCenter(item)
                break
            case AGREE_TO_FRIEND_REQUEST:
                // 同意好友请求
                handleFriendMessageCenter(item)
                break
            case OTHER_FILE:
                // 处理其他文件
                handleOtherFileMessageCenter(item)
                break
            case CHATROOM_MEMBER_NICK:
                // 处理nick为空的时候
                const info = JSON.parse(item.content)
                const obj = wxUserList.find((v) => v.wxid === info.wxid)
                if (!obj) {
                    wxUserList.push({
                        wxid: info.wxid,
                        name: info.nick
                    })
                } else {
                    obj.name = info.nick
                }
                break
        }
    })
    // 关闭ws断开微信链接
    ws.on('close', () => {
        console.log('disconnected')
    })

    return {
        ws,
        __dirname
    }
}

bot()
