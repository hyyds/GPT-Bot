/**
 * @ Author: hc
 * @ Create Time: 2022/9/7 14:41
 * @ Modified by: hc
 * @ Modified time: 2022/9/7 14:41
 * @ Description: 微信bot方法
 */
import {
    CHATROOM_MEMBER_NICK,
    CHATROOM_MEMBER,
    ATTATCH_FILE,
    AT_MSG,
    TXT_MSG,
    PIC_MSG,
    PERSONAL_INFO,
    USER_LIST,
    DEBUG_SWITCH,
    PERSONAL_DETAIL
} from './constant.js'

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import net from 'net'

/**
 * 发送文本消息
 * @param {String} wxId 微信id或者roomId
 * @param {String} content 发送消息内容
 * @returns {string}
 */
export function sendTxtMsg(wxId, content) {
    const params = {
        id: getId(),
        type: TXT_MSG,
        wxid: wxId,
        roomid: 'null',
        content: content,
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * 发送图片消息
 * @param {String} wxId 微信id或者roomId
 * @param {String} filePath 图片路径
 * @returns {string}
 */
export function sendPicMsg(wxId, filePath) {
    const params = {
        id: getId(),
        type: PIC_MSG,
        wxid: wxId,
        roomid: 'null',
        content: filePath,
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * 发送@消息
 * @param {String} roomId 群id
 * @param {String} wxId 对方微信Id
 * @param {String} content 内容
 * @param {String} name 对方微信名
 * @returns {string}
 */
export function sendAtMsg(roomId, wxId, content, name) {
    const params = {
        id: getId(),
        type: AT_MSG,
        roomid: roomId,
        wxid: wxId,
        content: content,
        nickname: name,
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * 发送文件
 * @param {String} wxId 微信id
 * @param {String} filePath  文件路径
 * @returns {string}
 */
export function sendAttach(wxId, filePath) {
    const params = {
        id: getId(),
        type: ATTATCH_FILE,
        wxid: wxId, // roomId或wxId,必填
        roomid: 'null',
        content: filePath,
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * 获取联系人列表
 * @returns {string}
 */
export function getConcatList() {
    const params = {
        id: getId(),
        type: USER_LIST,
        roomid: 'null',
        wxid: 'null',
        content: 'null',
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * 获取自己微信信息
 * @returns {string}
 */
export function getPersonalInfo() {
    const params = {
        id: getId(),
        type: PERSONAL_INFO,
        wxid: 'null',
        roomid: 'null',
        content: 'null',
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * wxId获取其他人微信详细信息
 * @param {String} wxId 微信id
 * @returns {string}
 */
export function getPersonalDetail(wxId) {
    const params = {
        id: getId(),
        type: PERSONAL_DETAIL,
        content: 'op:personal detail',
        wxid: wxId
    }
    return JSON.stringify(params)
}

/**
 * 获取所有群组列表~
 * @returns {string}
 */
export function getAllChatRoomMemberList() {
    const params = {
        id: getId(),
        type: CHATROOM_MEMBER,
        roomid: 'null',
        wxid: 'null',
        content: 'null',
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * 获取某个群组列表~
 * @param {String} roomId 群组id
 * @returns {string}
 */
export function getChatRoomMemberList(roomId) {
    const params = {
        id: getId(),
        type: CHATROOM_MEMBER,
        roomid: roomId,
        wxid: 'null',
        content: 'op:list member',
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * 获取个人信息~(群组)
 * @param {String} wxId 微信id
 * @param {String} roomId 群组id
 * @returns {string}
 */
export function getOtherPersonalInfo(wxId = null, roomId = null) {
    const params = {
        id: getId(),
        type: CHATROOM_MEMBER_NICK,
        wxid: wxId,
        roomid: roomId,
        content: 'null',
        nickname: 'null',
        ext: 'null'
    }
    return JSON.stringify(params)
}

/**
 * debug
 * @returns {string}
 */
export function debugSwitch() {
    const params = {
        id: getId(),
        type: DEBUG_SWITCH,
        content: 'off',
        wxid: 'ROOT'
    }
    return JSON.stringify(params)
}

/**
 * 获取当前时间戳字符串
 * @returns {string}
 */
export function getId() {
    return Date.now().toString()
}

/**
 * wait
 * @param {Number} time
 * @returns {Promise<unknown>}
 */
export function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

/**
 * 随机表情
 * @returns {string}
 */
export function randomEmo() {
    const emo = `😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 ☺️ 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🤥 🤫 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾`
    const emoArr = emo.split(' ')
    return emoArr[Math.floor(Math.random() * emoArr.length)]
}

/**
 * 微信dat文件转码
 * @param {String} itemPath
 * @returns {Promise<string>} imgPath
 */
export async function wxDatConvert(itemPath) {
    let absPath = path.normalize(itemPath)
    let extname = '.jpg'

    const base = 0xff
    const next = 0xd8
    const gifA = 0x47
    const gifB = 0x49
    const pngA = 0x89
    const pngB = 0x50
    const bmpA = 0x42
    const bmpB = 0x4d
    // 判断文件是否存在，不存在继续等待文件出现
    const isExists = async () => await fs.access(absPath).catch(async () => await isExists())

    await isExists()

    try {
        const content = await fs.readFile(absPath)

        let firstV = content[0],
            nextV = content[1],
            jT = firstV ^ base,
            jB = nextV ^ next,
            gT = firstV ^ gifA,
            gB = nextV ^ gifB,
            pT = firstV ^ pngA,
            pB = nextV ^ pngB,
            bT = firstV ^ bmpA,
            bB = nextV ^ bmpB,
            v = firstV ^ base

        if (jT === jB) {
            v = jT
            extname = '.jpg'
        } else if (gT === gB) {
            v = gT
            extname = '.gif'
        } else if (pT === pB) {
            v = pT
            extname = '.png'
        } else if (bT === bB) {
            v = bT
            extname = '.bmp'
        }

        let imgPath = path.join(path.dirname(absPath), path.basename(absPath) + extname)

        let bb = content.map((br) => br ^ v)

        await fs.writeFile(imgPath, bb)

        return imgPath
    } catch (e) {
        console.log(e)
    }
}

/**
 * 图片转base64
 * @param url 图片路径
 */
export async function imgToBase64(url) {
    try {
        let bitmap = await fs.readFile(url)
        return Buffer.from(bitmap, 'binary').toString('base64')
    } catch (e) {
        console.log(e)
    }
}

/**
 * base64转图片
 * @param {string} base64
 */
export async function base64ToImg(base64) {
    try {
        const filePath = path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            '..',
            `./static/img/${Date.now()}.png`
        )
        const dataBuffer = Buffer.from(base64, 'base64') // 把base64码转成buffer对象，

        await fs.writeFile(filePath, dataBuffer)
        return filePath
    } catch (e) {
        console.log(e)
    }
}

/**
 * 检测端口占用
 * @param port
 * @param portAvailableCallback
 * @returns {Promise<void>}
 */
export async function tryUsePort(port, portAvailableCallback) {
    function portUsed(port) {
        return new Promise((resolve, reject) => {
            let server = net.createServer().listen(port)
            server.on('listening', function () {
                server.close()
                resolve(port)
            })
            server.on('error', function (err) {
                if (err.code === 'EADDRINUSE') {
                    resolve(err)
                }
            })
        })
    }

    let res = await portUsed(port)
    if (res instanceof Error) {
        console.log(`端口：${port}被占用\n`)
        port++
        await tryUsePort(port, portAvailableCallback)
    } else {
        if(portAvailableCallback) {
            portAvailableCallback(port)
        } else {
            return port
        }
    }
}
