import { setDialog } from "@pinyinma/dialog"

export default () => {
    setDialog({
        message: "在线搜索",
        prompt: true,
        onConfirm: value => {
            window.open(
                `https://www.bing.com/images/search?q=${value}`,
                "window",
                "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=1200,height=600"
            )
        }
    })
}