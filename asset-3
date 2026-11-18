# 奶茶周记

使用 Vite、React、Tailwind CSS v4、React Router 的纯前端奶茶记录工具。

在线访问：[奶茶周记](https://aaaa0718.github.io/Miketea-recording/)。

## 开发

使用 Node.js 24、pnpm 11.25.0：

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm preview
```

访问终端输出的地址（包含 /Miketea-recording/ 前缀）。dist 是生成目录，不直接修改或提交。

## 路由与结构

HashRouter 无需服务器重写，刷新子页面可直接访问。

- #/：每周统计、3 杯额度、每日打卡和品类分布。
- #/calendar：照片贴纸月历、每日详情与月度统计。
- #/records：全部记录和搜索。
- #/collection：杯杯集章册，默认展示品牌纪念章，可切换饮品贴纸；底部保留备份导入导出。
- #/backup：JSON 备份导入导出。
- src/pages：路由页面；src/components：表单、照片编辑、插画和列表。
- src/state：数据、弹窗与通知；src/lib：日期、统计、校验和备份。
- src/services：图片处理和可取消 AI 客户端。
- src/styles.css：Tailwind 主题和自动播放动画。
- public/ai：Worker 与续传下载器；public/vendor：固定模型、WASM 和许可。
- tests：旧数据、备份、存储失败和日期边界测试。

## 数据

沿用 localStorage 的 tea-diary-v1 键和 {version:1,records} 备份格式，旧照片和记录无需迁移。导入按 ID 合并且保留已有内容。损坏数据不会被空列表覆盖；存储满时明确报错并保留表单。

记录仅在当前浏览器，不自动跨设备同步。清理浏览器前请导出备份，照片也包含在备份中。

## 抠图

照片在本机压缩和处理，不上传服务器。支持 AI 自动抠图、纯色背景去除、恢复原图和取消。U²-Netp 与 ONNX Runtime Web 1.20.1 使用单线程 WASM Worker，兼容 GitHub Pages。

首次约下载 16MB；512KiB 分段下载、SHA-256 校验和缓存，失败可复用完整分段，不设两分钟总下载时限。浏览器禁止缓存时无法续传。复杂背景、透明杯和设备性能会影响效果与速度。

来源与许可见 public/vendor-notices.txt。更新模型后运行 python3 scripts/split-ai-assets.py 重建分段。assemble-ai-assets.py 供维护者从临时下载文件组装固定版本资源，日常构建无需运行。

## 部署

main 推送后，GitHub Actions 安装锁定依赖、测试、构建并部署 dist 到 GitHub Pages。修改仓库名时同步修改 vite.config.js 的 base。模型按需加载，不加入首页 JS 包。

重构计划见 REFACTOR_PLAN.md。
