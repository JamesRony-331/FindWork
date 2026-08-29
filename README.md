# GoWorking

高校毕业生招聘信息采集分析系统，仓库按客户端、管理端和服务端分为三个独立目录。

## 目录结构

- `client/`：Vue 3 客户端
- `admin/`：Vue 3 管理端
- `service/`：Spring Boot 服务端

## 本地运行

### 客户端

```bash
cd client
npm install
npm run dev
```

### 管理端

```bash
cd admin
npm install
npm run dev
```

### 服务端

先将 `service/src/main/resources/application-example.properties` 复制为 `application.properties`，通过环境变量配置数据库连接，并设置长度足够的 `JWT_SECRET` 签名密钥。

```bash
cd service
./mvnw spring-boot:run
```
