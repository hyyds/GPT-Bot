/**
 * @ Author: hc
 * @ Create Time: 2022/9/7 15:49
 * @ Modified by: hc
 * @ Modified time: 2022/9/7 15:49
 * @ Description: 所有插件处理中心
 */
import { user, ws, wxUserList, __dirname, currentBotInfo,axiosInstance } from '../bot.js'
import { getOtherPersonalInfo, getConcatList, wait, randomEmo } from '../utils/index.js'
import { sendTxtMsg } from '../utils/index.js'
import chatgpt from './chatgpt/index.js'


/**
 * 插件应用
 * @param {Function} plugin
 */
class App {
    constructor(wxId, wxId1, content) {
        this.command = {
            g: chatgpt
        }
        this.interactionFunc = ['chatgpt']
        this.root = []
        this.wxId = wxId
        this.roomUserId = wxId1 || wxId
        this.nick = (wxUserList.find((v) => v.wxid === (wxId1 ? wxId1 : wxId)) || {}).name
        this.content = content
        console.log(wxId, wxId1, this.nick, this.content)
    }

    async registerPlugin() {
        const wxId = this.roomUserId ? this.roomUserId : this.wxId

        if (!this.nick) {
            // 处理有些人昵称为空的问题引发的bug
            ws.send(getOtherPersonalInfo(wxId))
            await wait(1000)
            this.nick = wxUserList.find((v) => v.wxid === wxId).name
        }

        if (
            !this.root.includes(wxId) &&
            (wxUserList.find((v) => v.wxid === wxId)?.ban || currentBotInfo.ban)
        )
            return

        const currentUser = user.find((v) => {
            const flagId = v.roomUserId ? v.roomUserId : v.wxId
            return wxId === flagId
        })

        const func = this.command[this.content]

        if (func && !currentUser) {
            // 用户第一次发起指令操作
            const item = {
                wxId: this.wxId,
                roomUserId: this.roomUserId,
                selfId: this.wxId.includes('room') ? this.roomUserId : this.wxId,
                nick: this.nick,
                content: this.content,
                callback: func,
                root: this.root,
                ws,
                __dirname,
                axiosInstance,
                currentBotInfo,
                wxUserList
            }
            user.push(item)
            func.call(item)
        } else if (currentUser && func) {
            // 用户需要执行其它指令函数
            currentUser.content = this.content
            currentUser.callback = func
            currentUser.roomUserId = this.roomUserId
            currentUser.wxId = this.wxId
            func.call(currentUser)
        } else if (currentUser && this.interactionFunc.includes(currentUser.callback?.name)) {
            // 继续调用执行指令函数完成之后操作
            currentUser.content = this.content.replace('@bot', '')
            currentUser.roomUserId = this.roomUserId
            currentUser.wxId = this.wxId
            await currentUser.callback.call(currentUser)
        } else {
            // 无需用户发送指令自执行
            const params = {
                ws,
                wxUserList,
                currentBotInfo,
                __dirname,
                axiosInstance,
                wxId: this.wxId,
                roomUserId: this.roomUserId,
                content: this.content,
                root: this.root
            }
            await chatgpt.call(params)
        }
    }
}

/**
 * 文本消息处理中心
 * @param {Object} item
 */
export function handleTxtMessageCenter(item) {
    const wxId = item.wxid
    const wxId1 = item.id1
    const content = item.content

    const app = new App(wxId, wxId1, content)
    // 注册插件
    app.registerPlugin()
}

/**
 * 图片消息处理中心
 * @param {Object} item
 */
export function handlePicMessageCenter(item) {
    const { detail, id1, id2 } = item.content

    const app = new App(id1, id2, detail)

    // 注册插件
    app.registerPlugin()
}

/**
 * 其它文件消息处理中心
 * @param {Object} item
 */
export function handleOtherFileMessageCenter(item) {
    const { content, id1, id2 } = item.content

    const text = content.match(/<title>(.*)<\/title>/) && content.match(/<title>(.*)<\/title>/)[1]

    const app = new App(id1, id2, text)
    // 注册插件
    app.registerPlugin()
}

/**
 * 处理加好友
 * @param {Object} item
 */
export function handleFriendMessageCenter(item) {
    // const wxId = item.wxid
    const wxId = item.content.id1
    const content = item.content.content

    if (content.includes('红包')) {
        ws.send(sendTxtMsg(wxId, `发红包🧧啦~快抢快抢${randomEmo()}`))
        return
    }

    const text = content.match(/"(.*?)"/) ? content.match(/"(.*?)"/)[1] : ''

    console.log(content, '打印')

    if (content.includes('拍了拍')) {
        if (content.includes('我')) {
            ws.send(sendTxtMsg(wxId, `${text}别拍我、我怕疼😭`))
        } else {
            ws.send(sendTxtMsg(wxId, `${text}能别乱拍了嘛${randomEmo()}`))
        }
        return
    }

    ws.send(sendTxtMsg(wxId, `Hello！${text}\n我是文心~获取更多高级玩法可以回复指令'gg'查看详情`))
    // 刷新 wxUserList
    console.log('开始刷新wxUserList')

    ws.send(getConcatList())
}
