# GoWorking 四模块仓库与部署说明设计

## 目标

将高校毕业生招聘信息采集分析系统整理为一个包含四个独立模块的 GitHub 仓库，并提供明确的依赖安装和分别启动指令。此次不提供 Shell 一键启动脚本。

## 仓库结构

```text
FindWork/
├── client/             Vue 客户端
├── admin/              Vue 管理端
├── service/            Spring Boot 服务端
├── message-service/    Django 爬虫与定时任务服务
└── README.md           环境准备、依赖安装和启动教程
```

## Django 整理

- 将当前 `MessageService/MsgService` 项目复制到仓库的 `message-service/`。
- 不提交 `.idea/`、`__pycache__/`、`*.pyc`、本地 SQLite 数据库和真实 `.env`。
- 新增 `requirements.txt`，固定当前必要依赖 `Django==5.2.17` 和 `PyMySQL==1.2.0`。
- `SECRET_KEY`、数据库名称、用户名、密码、地址和端口全部从环境变量读取。
- 提交无真实凭据的 `.env.example` 作为配置模板。

## 启动方式

README 分别提供以下启动方式：

- 客户端：在 `client/` 安装 npm 依赖并以 `5173` 端口启动。
- 管理端：在 `admin/` 安装 npm 依赖并以 `5172` 端口启动。
- Spring Boot：在 `service/` 配置环境变量后通过 Maven Wrapper 启动，端口沿用项目配置。
- Django：进入 `message-service/`，激活 Conda `MessageService` 环境、安装 `requirements.txt`、执行迁移并以 `8000` 端口启动。

不新增 `start-all.sh`，并移除仓库中旧的双 Vue 启动脚本及对应测试，避免 README 和仓库行为不一致。

## 验证

- 两个 Vue 项目分别执行构建。
- Spring Boot 执行完整 Maven 测试。
- Django 在 `MessageService` 环境中执行 `manage.py check` 和测试。
- 检查 Git 暂存内容，确保不包含真实密钥、数据库密码、缓存或构建产物。
- 验证完成后将实现提交并推送到 `origin/feature/showcase-page`。
