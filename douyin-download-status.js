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
        if (this.widgetSize === 'small') {
            return await this.renderSmall()
        } else if (this.widgetSize === 'large') {
            return await this.renderLarge()
        } else {
            return await this.renderMedium()
        }
    }

    async renderUI(fontSize, spacer, titleFontSize, footerFontSize) {
        let data = await this.getData()
        let w = new ListWidget()

        let header = w.addStack()
        let icon = header.addImage(await this.getImage('https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico'))
        icon.imageSize = new Size(titleFontSize, titleFontSize)
        let title = header.addText("抖音增量下载")
        title.textOpacity = 0.9
        title.font = Font.systemFont(titleFontSize)
        w.addSpacer(spacer)

        //下载视频
        var videoCount = data['VIDEO_COUNT']
        var flTxt = w.addText("视频:" + videoCount + "个")
        flTxt.textColor = new Color("#20212c")
        flTxt.font = Font.boldRoundedSystemFont(fontSize)
        flTxt.centerAlignText()

        //图片
        var photoCount = data['PHOTO_COUNT']
        var flTxt = w.addText("图片:" + photoCount + "个")
        flTxt.textColor = new Color("#20212c")
        flTxt.font = Font.boldRoundedSystemFont(fontSize)
        flTxt.centerAlignText()

        //耗时
        var cost = (data['DOWNLOAD_TIME_COST'] / 60).toFixed(0);
        var flTxt = w.addText("耗时:" + cost + "分钟")
        flTxt.textColor = new Color("#20212c")
        flTxt.font = Font.boldRoundedSystemFont(fontSize)
        flTxt.centerAlignText()


        w.addSpacer(spacer)

        let utTxt = w.addText('更新于:' + data['IMP_TIME'])
        utTxt.font = Font.systemFont(footerFontSize)
        utTxt.centerAlignText()
        utTxt.textOpacity = 0.5

        return w
    }

    //渲染小尺寸组件
    async renderSmall() {
        return this.renderUI(15, 5, 12, 9)
    }

    //渲染中尺寸组件
    async renderMedium() {
        return this.renderUI(20, 10, 15, 12);
    }

    //渲染大尺寸组件
    async renderLarge() {
        return this.renderUI(30, 20, 15, 12)
    }

    //加载下载数据
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
await new Im3xWidget(args.widgetParameter).init()