# 论文阅读后的 HTML 笔记提示词

把这段提示词和论文、自己的阅读记录一起交给 AI。写新文章时同时提供 `your-note.html`，修订时提供现有 HTML。

> 请将我的论文阅读记录整理成一篇可独立打开的 HTML 笔记。复用附带模板的 head、样式与脚本，只填写文章元信息及正文。保留我对论文的疑问和原有判断。用短段落说明研究问题、关键机制、证据、我增加的理解和下一步验证。区分论文原文、教学构造与个人推断。没有核对的数值或公式注明待验证，并附可核对的原文链接。
>
> 选择 paper、quicknote 或 synthesis。速记可以只写一条新认识和一个下一步。长文补充推导时用 details 折叠。display 公式把 TeX 放进 class=math-block 的 div，行内公式用 class=math-inline 的 span。图片使用内嵌 SVG 或 data URI，附替代文本与来源。
>
> 填写 note:title、note:summary、note:slug、note:directions、note:tags、note:kind、note:created、note:updated、note:status。方向使用 agentic-rl、reward-modeling、social-intelligence 或 game-agent，多个值用逗号分隔。slug 仅用小写英文字母、数字和连字符。文件名与 slug 相同。草稿状态默认 draft。创建日期与修订日期使用 YYYY-MM-DD。
>
> 修订旧文应保持 slug 和首次日期，只更新 note:updated 与相关正文。如果改了研究方向或类型，同时更新文章头部可见标签。保持 HTML 缩进清晰。只交付一个 HTML 文件。
