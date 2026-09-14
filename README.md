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

## `.env` 配置详解

### Spring Boot：`service/.env`

进入项目根目录后执行：

```bash
cp service/.env.example service/.env
```

打开 `service/.env`，填写 JWT 签名密钥：

```dotenv
JWT_SECRET=请替换为至少32字节的随机密钥
```

| 变量 | 是否必填 | 说明 |
| --- | --- | --- |
| `JWT_SECRET` | 是 | 用于生成和验证登录 Token。修改后，使用旧密钥生成的 Token 将全部失效。生产环境不要使用简单密码。 |

在 macOS/Linux 中可以生成随机密钥：

```bash
openssl rand -base64 48
```

复制输出内容，填写到 `JWT_SECRET=` 后面。不要把真实输出粘贴到 README、Issue 或提交记录中。

Spring 的 `.env` 当前仅用于读取 `JWT_SECRET`，不会自动把数据库变量注入 Spring 配置。数据库连接有以下两种配置方式，选择一种即可。

方式一：修改本地 `service/src/main/resources/application.properties`：

```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/FindWorking?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=你的MySQL密码
server.port=5050
```

方式二：启动 Spring 前在当前终端设置环境变量：

```bash
export DB_URL='jdbc:mysql://127.0.0.1:3306/FindWorking?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai'
export DB_USERNAME='root'
export DB_PASSWORD='你的MySQL密码'
export SERVER_PORT='5050'

cd service
./mvnw spring-boot:run
```

| Spring 环境变量 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `DB_URL` | 否 | `jdbc:mysql://localhost:3306/FindWorking` | MySQL JDBC 地址，数据库名默认是 `FindWorking`。 |
| `DB_USERNAME` | 否 | `root` | MySQL 用户名。 |
| `DB_PASSWORD` | 是 | 空 | MySQL 密码；数据库无密码时才可留空。 |
| `SERVER_PORT` | 否 | `5050` | Spring Boot 服务端口。 |

### Django：`message-service/.env`

进入项目根目录后执行：

```bash
cp message-service/.env.example message-service/.env
```

打开 `message-service/.env`，按本机环境填写：

```dotenv
DJANGO_SECRET_KEY=请替换为随机密钥
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=FindWorking
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_HOST=127.0.0.1
DB_PORT=3306
```

| 变量 | 是否必填 | 推荐值/示例 | 说明 |
| --- | --- | --- | --- |
| `DJANGO_SECRET_KEY` | 是 | 随机长字符串 | Django 加密签名密钥。生产环境必须保密，不能与 JWT 密钥共用。 |
| `DJANGO_DEBUG` | 否 | 本地 `true`，生产 `false` | 是否显示调试信息；生产环境必须设为 `false`。 |
| `DJANGO_ALLOWED_HOSTS` | 是 | `localhost,127.0.0.1` | 允许访问 Django 的主机名或 IP，多个值用英文逗号分隔，不要带 `http://` 或端口。生产环境填写真实域名。 |
| `DB_NAME` | 否 | `FindWorking` | Django 连接的 MySQL 数据库名称。 |
| `DB_USER` | 否 | `root` | MySQL 用户名；生产环境建议创建权限受限的独立账号。 |
| `DB_PASSWORD` | 是 | 本机 MySQL 密码 | MySQL 密码。即使包含特殊字符，也直接写在等号后；不要提交该文件。 |
| `DB_HOST` | 否 | `127.0.0.1` | MySQL 主机地址。数据库在其他服务器或容器中时填写对应地址。 |
| `DB_PORT` | 否 | `3306` | MySQL 端口。 |

安装 Django 依赖后，可用下面的命令生成 `DJANGO_SECRET_KEY`：

```bash
conda run -n MessageService python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

将输出复制到 `DJANGO_SECRET_KEY=` 后面。配置完成后执行检查：

```bash
cd message-service
conda run -n MessageService python manage.py check
```

### 配置文件安全要求

- 可以提交：`service/.env.example`、`message-service/.env.example`、`application-example.properties`。
- 禁止提交：`service/.env`、`message-service/.env`、`application.properties` 以及任何真实密码或密钥。
- `.gitignore` 已忽略上述本地配置，但提交前仍建议执行 `git status` 检查。
- 如果密钥曾被提交到 GitHub，仅删除文件并不安全，应立即更换密钥和数据库密码。

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
