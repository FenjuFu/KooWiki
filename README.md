# KooWiki MVP

这是一个“AI 代码知识站”最小可运行版本，目标是融合 DeepWiki / CodeWiki / Zread 的优势：

- 输入仓库地址后自动生成项目概览与文档章节。
- 支持 Ask Repo 问答，并显示代码引用（模拟）。
- 展示仓库到解析、索引、问答与前端展示的架构关系图。
- 仓库地址支持 `github.com`、`gitee.com`、`atomgit.com`、`gitlink.org.cn`。

## 本地运行

```bash
python3 -m http.server 8000
```

然后打开：<http://localhost:8000>

## 当前范围（MVP）

- 前端静态站点（HTML + CSS + JS）
- 使用模拟数据展示交互和信息架构
- 便于后续替换为真实后端（Parser / Embedding / RAG / Auth）
