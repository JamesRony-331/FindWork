# GoWorking

高校毕业生招聘信息采集分析系统。仓库包含用户端、管理端、Spring Boot 业务服务和 Django 爬虫/定时任务服务，四个应用分别安装依赖、配置和启动。

## 项目结构

```text
GoWorking/
├── client/           # Vue 3 用户端，开发端口 5173
├── admin/            # Vue 3 管理端，开发端口 5172
├── service/          # Spring Boot API 服务，默认端口 5050
└── message-service/  # Django 爬虫与定时任务服务，开发端口 8000
```

## 环境要求

- Node.js 20 或更高版本、npm
- Java 21（Maven Wrapper 已包含在 `service/`）
- MySQL 8 或更高版本
- Conda；Django 使用名为 `MessageService` 的 Python 3.11 环境

## 首次配置

### Spring Boot

复制配置模板，并按本机数据库修改 `application.properties`：

```bash
cp service/src/main/resources/application-example.properties service/src/main/resources/application.properties
cp service/.env.example service/.env
```

在 `service/.env` 中填写长度不少于 32 字节的随机 `JWT_SECRET`。数据库也可通过 `DB_URL`、`DB_USERNAME`、`DB_PASSWORD` 环境变量覆盖。

### Django

创建环境、复制配置模板并填写真实值：

```bash
conda create -n MessageService python=3.11
cp message-service/.env.example message-service/.env
```

请修改 `message-service/.env` 中的 `DJANGO_SECRET_KEY` 和数据库配置。两个 `.env` 及 Spring 的本地 `application.properties` 均已忽略，不要提交真实密钥。

## 安装依赖

用户端：

```bash
cd client
npm install
```

管理端：

```bash
cd admin
npm install
```

Django：

```bash
cd message-service
conda activate MessageService
python -m pip install -r requirements.txt
```

Spring Boot 会在首次运行 Maven Wrapper 时自动下载 Maven 依赖。

## 启动命令

请分别打开终端运行以下应用。

用户端（`http://localhost:5173`）：

```bash
cd client
npm run dev -- --port 5173
```

管理端（`http://localhost:5172`）：

```bash
cd admin
npm run dev -- --port 5172
```

Spring Boot（默认 `http://localhost:5050`）：

```bash
cd service
./mvnw spring-boot:run
```

Django（`http://localhost:8000`）：

```bash
cd message-service
conda activate MessageService
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

如果不想激活 Conda 环境，也可以直接运行：

```bash
conda run -n MessageService python message-service/manage.py runserver 0.0.0.0:8000
```

## 构建与检查

```bash
npm --prefix client run build
npm --prefix admin run build
```

```bash
cd service
./mvnw test
./mvnw clean package
```

```bash
cd message-service
conda activate MessageService
python -m unittest discover -s tests -v
python manage.py check
python manage.py check --deploy
```

`python manage.py runserver` 仅适用于开发环境；正式部署 Django 时请使用 WSGI/ASGI 服务器，并将 `DJANGO_DEBUG` 设置为 `false`、配置实际域名及 HTTPS 安全选项。
