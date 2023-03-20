/**
 * @ Author: hc
 * @ Create Time: 2022/12/27 14:15
 * @ Modified by: hc
 * @ Modified time: 2022/12/27 14:15
 * @ Description: chatgpt
 */
import { sendPicMsg, sendTxtMsg } from '../../utils/index.js'
import { ChatGPTAPIBrowser } from './chatgpt/build/index.js'
import prompts from './prompts-zh.js'
import cron from 'node-cron'
import pkg from '../../commonjs/index.js'
import path from 'path'
import {__dirname} from '../../bot.js'


const { download } = pkg

const api = new ChatGPTAPIBrowser({})

await api.initSession()

cron.schedule('1 * * * *',async ()=> {
    await api.initSession()
})
export default async function chatgpt() {
    if (this.content.toLowerCase() === 'g') {
        this.ws.send(sendTxtMsg(this.wxId, '回复gg查看GPT高级玩法'))
        return
    }
    if(this.content.toLowerCase() === 'gg') {
        let txt = '目前玩法指令如下：\n\n'
        prompts.forEach((v,i)=> {
            txt+= `g${i}：${v.act}\n`
        })
        this.ws.send(sendTxtMsg(this.wxId, txt))
        return
    }
    if (this.content) {
        this.opts = {
            conversationId: this.conversationId,
            parentMessageId: this.messageId,
            timeoutMs: 4 * 60 * 1000
        }
        if(this.content.startsWith('g')) {
           const num = this.content.replace('g','')
            const item = prompts[num]
            if(item && item.prompt) {
                this.content = item.prompt
            }
        }
        const func = async () =>
            await api.sendMessage(this.content, this.opts)
                .catch(async () => await func())
        const res = await func()
        // console.log(res)
        this.conversationId = res.conversationId
        this.messageId = res.messageId
        this.ws.send(sendTxtMsg(this.wxId, res.response))
        if(res.response.includes('https://') && !res.response.includes('QUERY')) {
            const img = res.response.match(/https:\/\/source.unsplash.com\/1280x720\/\S+\b/)[0]
            const timeStamp = Date.now()
            await download(img, path.resolve(__dirname, `./static/${timeStamp}`), {
                filename: '1.png'
            })
            this.ws.send(sendPicMsg(this.wxId, path.resolve(__dirname, `./static/${timeStamp}/1.png`)))
        }
    }
}
