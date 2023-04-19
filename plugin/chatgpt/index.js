/**
 * @ Author: hc
 * @ Create Time: 2022/12/27 14:15
 * @ Modified by: hc
 * @ Modified time: 2022/12/27 14:15
 * @ Description: chatgpt
 */
import { sendTxtMsg } from '../../utils/index.js'
import prompts from './prompts-zh.js'



// const api = new ChatGPTAPIBrowser({})
//
// await api.initSession()
// cron.schedule('1 * * * *',async ()=> {
//     await api.initSession()
// })
export default async function chatgpt() {
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
            parentMessageId: this.messageId
        }
        if(this.content.startsWith('g')) {
           const num = this.content.replace('g','')
            const item = prompts[num]
            if(item && item.prompt) {
                this.content = item.prompt
            }
        }
        // const func = async () =>
        //     await api.sendMessage(this.content, this.opts)
        //         .catch(async () => await func())
        // const res = await func()
        const func = async ()=>
            await this.axiosInstance.post(
                '/api/chat-process',
                {
                    prompt: this.content,
                    options: { parentMessageId: this.messageId || 'chatcmpl-745uFSixxOFn9mIB1vKwAKFs8Kgfh'}
                },
                {
                    baseURL: 'https://chatbot.theb.ai',
                    headers: {
                        Accept: `application/json, text/plain, */*`,
                        Origin: `https://chatbot.theb.ai`,
                        'Accept-Encoding': `gzip, deflate, br`,
                        Cookie: ``,
                        'Content-Type': `application/json`,
                        Host: `chatbot.theb.ai`,
                        Connection: `keep-alive`,
                        'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.1`,
                        Referer: `https://chatbot.theb.ai/`,
                        'Accept-Language': `zh-CN,zh-Hans;q=0.9`
                    }
                }
            ).catch(async () => {
                this.index ++
                if(this.index < 3) {
                    return  await func()
                } else {
                    return Promise.resolve({})
                }
            })
        const res = await func()
        if(!res.data) return
        const msg = JSON.parse(res.data.split('\n').slice(-1)[0])
        this.messageId = msg.id
        // console.log(res)
        // this.conversationId = res.conversationId
        // this.messageId = res.messageId
        // this.ws.send(sendTxtMsg(this.wxId, res.response))
        this.ws.send(sendTxtMsg(this.wxId, msg.text))
        // if (res.response.includes('https://') && !res.response.includes('QUERY')) {
        //     const img = res.response.match(/https:\/\/source.unsplash.com\/1280x720\/\S+\b/)[0]
        //     const timeStamp = Date.now()
        //     await download(img, path.resolve(__dirname, `./static/${timeStamp}`), {
        //         filename: '1.png'
        //     })
        //     this.ws.send(
        //         sendPicMsg(this.wxId, path.resolve(__dirname, `./static/${timeStamp}/1.png`))
        //     )
        // }
    }
}
