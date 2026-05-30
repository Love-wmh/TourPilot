# ClassTrack

## 前端启动方式

前端基于 React Router，默认开发服务地址为 `http://localhost:5173`。

### 1. 安装前端依赖

在项目根目录执行：

```bash
pnpm install
```

### 2. 启动前端开发服务

```bash
pnpm dev
```

如需生产构建和启动，可执行：

```bash
pnpm build
pnpm start
```

## 后端启动方式

后端代码位于 `backend/` 目录，基于 Flask 启动，默认监听 `http://localhost:5001`。

### 1. 创建并激活虚拟环境

```bash
python3 -m venv .venv
source .venv/bin/activate
```

.\.venv\Scripts\Activate.ps1

### 2. 安装后端依赖

```bash
pip install -r backend/requirements.txt
```

### 3. 配置环境变量（可选）

如果不配置环境变量，会使用 `backend/config.py` 中的默认值：

```bash
export SECRET_KEY=travel-agency-api
export DATABASE_HOST=localhost
export DATABASE_PORT=54321
export DATABASE_NAME=travel_agency
export DATABASE_USER=system
export DATABASE_PASSWORD=123456789
export CORS_ORIGINS=http://localhost:5173
```

### 4. 启动后端服务

在项目根目录执行：

```bash
python -m backend.app
```

启动成功后，可访问健康检查接口：

```bash
curl http://localhost:5001/api/health
```
