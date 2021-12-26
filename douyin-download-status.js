// 哔哩哔哩粉丝数
// 作者：azoon
// 调用参数 bilibili@fans:446791792

class Im3xWidget {
    /**
    * 初始化
    * @param arg 外部传递过来的参数
    */
    constructor(arg) {
        this.arg = arg
        this.widgetSize = config.widgetFamily
    }

    //渲染组件
    async render() {
        return await this.renderSmall()

        if (this.widgetSize === 'medium') {
            return await this.renderSmall()
        } else if (this.widgetSize === 'large') {
            return await this.renderLarge()
        } else {
            return await this.renderSmall()
        }
    }

    //渲染小尺寸组件
    async renderSmall() {
        let data = await this.getData()
        let w = new ListWidget()

        let header = w.addStack()
        let icon = header.addImage(await this.getImage('https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico'))
        icon.imageSize = new Size(15, 15)
        let title = header.addText("抖音增量下载")
        title.textOpacity = 0.9
        title.font = Font.systemFont(15)
        w.addSpacer(20)

        //下载视频
        var videoCount=data['VIDEO_COUNT']
        var flTxt = w.addText("视频:"+videoCount+"个")
        flTxt.textColor = new Color("#20212c")
        flTxt.font = Font.boldRoundedSystemFont(30)
        flTxt.centerAlignText()
        
        //图片
        var photoCount=data['PHOTO_COUNT']
        var flTxt = w.addText("图片:"+photoCount+"个")
        flTxt.textColor = new Color("#20212c")
        flTxt.font = Font.boldRoundedSystemFont(30)
        flTxt.centerAlignText()

         //耗时
         var cost=(data['DOWNLOAD_TIME_COST']/60).toFixed(0);
         var flTxt = w.addText("耗时:"+cost+"分钟")
         flTxt.textColor = new Color("#20212c")
         flTxt.font = Font.boldRoundedSystemFont(30)
         flTxt.centerAlignText()
         
        
        w.addSpacer(20)

        let utTxt = w.addText('更新于:' + data['IMP_TIME'])
        utTxt.font = Font.systemFont(12)
        utTxt.centerAlignText()
        utTxt.textOpacity = 0.5

        w.url = 'bilibili://'
        return w
    }

    //渲染中尺寸组件
    async renderMedium() {
        let w = new ListWidget()
        w.addText("暂不支持该尺寸组件")
        return w
    }

    //渲染大尺寸组件
    async renderLarge() {
        let w = new ListWidget()
        w.addText("暂不支持该尺寸组件")
        return w
    }

    //加载B站数据
    async getData() {
        let api = 'http://192.168.1.11:9877/downloadHistory/latest'
        let req = new Request(api)
        let res = await req.loadJSON()
        return res
    }

    //加载远程图片
    async getImage(url) {
        let req = new Request(url)
        return await req.loadImage()
    }

    //格式化粉丝数量，加入千分号
    toThousands(num) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }

    //编辑测试使用
    async test() {
        if (config.runsInWidget) return
        this.widgetSize = 'small'
        let w1 = await this.render()
        await w1.presentSmall()
        this.widgetSize = 'medium'
        let w2 = await this.render()
        await w2.presentMedium()
        this.widgetSize = 'large'
        let w3 = await this.render()
        await w3.presentLarge()
    }

    //组件单独在桌面运行时调用
    async init() {
        if (!config.runsInWidget) return
        let widget = await this.render()
        Script.setWidget(widget)
        Script.complete()
    }
}

module.exports = Im3xWidget

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
//await new Im3xWidget().test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
//await new Im3xWidget(args.widgetParameter).init()