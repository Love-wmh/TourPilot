# TourPilot（ClassTrack）项目架构与功能说明文档

> 一款面向旅行社业务全流程的轻量级管理系统，覆盖客户、线路、导游、团组、订单、费用、报表等核心模块，采用前后端分离架构，支持基于角色的权限控制（RBAC）。

---

## 一、项目概览

| 项 | 内容 |
| --- | --- |
| 项目名称 | ClassTrack / TourPilot |
| 项目定位 | 旅行社业务管理系统（SaaS 形态） |
| 架构模式 | 前后端分离 + RESTful API |
| 前端技术 | React 19 + React Router v7 + TypeScript + TailwindCSS + shadcn/ui |
| 后端技术 | Python + Flask + psycopg2 + PostgreSQL |
| 包管理器 | pnpm（前端）/ pip（后端） |
| 部署形态 | Dockerfile 镜像构建，前端 SSR/SPA + 后端 API 独立部署 |

---

## 二、整体架构

### 2.1 架构图（逻辑分层）

```
┌────────────────────────────────────────────────────────────┐
│                      浏览器 (Client)                        │
│  React 19 + React Router v7 (SSR/SPA) + TailwindCSS        │
│  ├─ UI 组件层（shadcn/ui + Radix UI + lucide-react）       │
│  ├─ 路由层（app/routes 文件式路由）                         │
│  ├─ 数据加载层（loader + data-loader.ts）                   │
│  └─ API 客户端层（axios + lib/api.ts）                      │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTP / JSON (withCredentials)
                           ▼
┌────────────────────────────────────────────────────────────┐
│                  Flask 后端 (RESTful API)                   │
│  ├─ 路由层 (backend/routes)  auth / api 两套 Blueprint     │
│  ├─ 鉴权与权限 (backend/auth.py + permissions.py)          │
│  ├─ 服务层 (backend/services)  crud / orders / groups      │
│  ├─ 数据访问层 (backend/repositories/queries.py)           │
│  └─ 数据库连接与事务 (backend/database.py)                  │
└──────────────────────────┬─────────────────────────────────┘
                           │ psycopg2
                           ▼
┌────────────────────────────────────────────────────────────┐
│                     PostgreSQL 数据库                       │
│  users / customers / routes / guides /                     │
│  tour_groups / orders / expenses                           │
└────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
TourPilot/
├── app/                     # 前端源代码（React Router v7）
│   ├── components/          # 通用业务组件 + ui/ shadcn 基础组件
│   ├── lib/                 # API 客户端、数据加载、表单工具、actions
│   ├── routes/              # 文件式路由（业务页面）
│   ├── welcome/             # 欢迎页资源
│   ├── root.tsx             # 应用根组件
│   ├── routes.ts            # 路由表声明
│   └── app.css              # 全局样式 (Tailwind)
├── backend/                 # 后端源代码（Flask）
│   ├── routes/              # auth.py / api.py 两个 Blueprint
│   ├── services/            # 业务编排（订单、团组、CRUD）
│   ├── repositories/        # SQL 查询聚合层
│   ├── auth.py              # 登录态、装饰器（login_required/permission_required）
│   ├── permissions.py       # RBAC 角色权限矩阵
│   ├── database.py          # 连接池/事务/序列化
│   ├── responses.py         # 统一响应封装
│   ├── config.py            # 配置项（环境变量驱动）
│   └── app.py               # Flask 应用工厂
├── schema.sql               # PostgreSQL DDL
├── seed_data.py             # 数据种子脚本
├── Dockerfile               # 容器化构建
├── react-router.config.ts   # React Router 配置
├── vite.config.ts           # Vite + Tailwind 配置
└── package.json
```

---

## 三、技术栈说明

### 3.1 前端

- **React 19**：使用最新的 React 19，享受 Concurrent 与 Actions 等新特性。
- **React Router v7 (framework mode)**：基于文件式约定的路由系统，支持 SSR、loader/action 数据流。
- **TypeScript**：全量类型，`app/lib/api.ts` 中集中维护实体类型与 API 客户端。
- **TailwindCSS v4 + @tailwindcss/vite**：原子化样式，构建零运行时。
- **shadcn/ui + Radix UI + lucide-react**：高质量、无障碍、可拼装的 UI 组件库。
- **axios**：统一的 HTTP 客户端，启用 `withCredentials`，支持 Cookie 会话。
- **next-themes**：暗色模式切换。
- **sonner**：轻量 Toast 通知。

### 3.2 后端

- **Flask + Flask-CORS**：极简 Web 框架，应用工厂模式 `create_app()`。
- **psycopg2 + RealDictCursor**：与 PostgreSQL 交互，返回 dict 行。
- **Session-based Auth**：基于 Flask `session` 的登录态。
- **RBAC 权限矩阵**：`backend/permissions.py` 维护「角色 → 权限集合」映射，由 `permission_required` 装饰器自动校验。
- **统一响应**：`responses.py` 提供 `success/error` 包装，约定 `{code, message, data}` 协议。

### 3.3 数据库

- **PostgreSQL**：7 张核心业务表（users / customers / routes / guides / tour_groups / orders / expenses）。
- 外键完整性约束 + 级联删除策略，保证数据一致性。

---

## 四、功能模块介绍

系统按角色（管理员 / 销售 / 计调 / 财务 / 导游）划分访问权限，主要业务模块如下：

### 4.1 登录与权限（auth）
- `POST /api/auth/login`：用户名密码登录，写入 Session。
- `POST /api/auth/logout`：退出。
- `GET /api/auth/me`：获取当前登录用户与权限集合。
- 前端通过 `withCredentials` 携带 Cookie，按 `permissions` 动态渲染菜单。

### 4.2 仪表盘（home）
- `GET /api/dashboard`：聚合返回 **计数指标 + 最近订单 + 团组预警**。
- 角色概览，所有登录用户可见。

### 4.3 用户管理（users）
- 角色：仅管理员。
- 支持用户创建、删除（禁止删除自身）、角色统计。

### 4.4 客户管理（customers）
- 角色：管理员 / 销售。
- 维护客户档案：身份证、电话、紧急联系人、旅行偏好等；同时返回客户的历史订单。

### 4.5 线路管理（routes-page）
- 角色：管理员 / 计调。
- 维护旅游线路：目的地、天数、景点、成人/儿童价、上下架状态。
- 关联展示该线路下的所有出团信息。

### 4.6 导游管理（guides）
- 角色：管理员 / 计调 / 导游。
- 维护导游档案（姓名、电话、从业年限、简介）以及导游正在带的团组。

### 4.7 团组管理（groups）
- 角色：管理员 / 计调 / 导游（只读）。
- 创建出团计划：选择线路 + 导游 + 出发/返程日期 + 人数。
- 业务动作：
  - **取消团组**（`POST /groups/<id>/cancel`）
  - **更换导游**（`POST /groups/<id>/change-guide`）
- 状态汇总：按状态统计团数与人数。

### 4.8 订单管理（orders）
- 角色：管理员 / 销售 / 财务（只读）。
- 创建订单（客户 × 团组 × 人数 × 应收/已付/余额）。
- **订单取消**：可指定扣费金额。
- **未付清订单**单独聚合，便于催收。

### 4.9 费用管理（expenses）
- 角色：管理员 / 财务。
- 记录团组运营费用（交通、住宿、餐饮、门票等），按目的地 × 费用类型汇总。

### 4.10 报表中心（reports）
- 角色：所有人。
- 综合数据看板：业务运营、财务统计、团组动态等。

---

## 五、关键设计与亮点

> 本章节按「前端架构 → 后端架构 → 数据层 → 安全与权限 → 工程化与部署 → UX 细节」六个维度详细展开，附上对应代码位置以便溯源。

---

### 5.1 现代化的前端技术栈与渲染架构

#### 5.1.1 React Router v7 Framework Mode
- 采用 **React Router v7** 的 framework mode（即原 Remix 的运行时），结合 [react-router.config.ts](file:///f:/B_FrontEnd_Project/TourPilot/react-router.config.ts) 与 [app/routes.ts](file:///f:/B_FrontEnd_Project/TourPilot/app/routes.ts) 实现**集中式声明 + 嵌套路由**：
  - 顶层 `login` 独立路由
  - 业务页面统一挂载在 `layout('components/layout.tsx', [...])` 之下，自动复用侧边栏与导航壳
- 通过 `clientLoader` 在路由层加载数据，配合 `useNavigation()` 暴露的全局状态，原生支持「**页面切换 Loading**」反馈，无需自行实现路由守卫。
- 例：[app/routes/groups.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/routes/groups.tsx#L26-L33) 中 `clientLoader` 直接返回数据，组件用 `loaderData` 接收，**告别 useState + useEffect + fetch 的三件套**。

#### 5.1.2 React 19 + Vite + TailwindCSS v4 极速开发链路
- **React 19** 提供更先进的并发渲染与 Actions API，配合 React Router v7 的 `useRevalidator` 实现「**变更后自动重新拉取数据**」（见 [app/lib/actions.ts](file:///f:/B_FrontEnd_Project/TourPilot/app/lib/actions.ts#L21-L42)）。
- **Vite 7 + @tailwindcss/vite**（[vite.config.ts](file:///f:/B_FrontEnd_Project/TourPilot/vite.config.ts)）：原子化样式编译速度极快，零运行时开销；`tsconfigPaths` 内联实现 `~/` 路径别名。
- **TypeScript 严格模式 + react-router typegen**：路由参数与 loaderData 类型自动生成，做到端到端类型安全。

#### 5.1.3 设计系统：shadcn/ui + Radix UI + lucide-react
- 不依赖运行时组件库，而是**把无障碍交互逻辑（Radix UI）+ Tailwind 样式**直接复制到 [app/components/ui/](file:///f:/B_FrontEnd_Project/TourPilot/app/components/ui)，可任意定制。
- 在 [app/components/page.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/components/page.tsx) 中进一步封装出业务级原语：`PageHeader / StatCard / DataTable / SectionTitle / FormGrid / TextInput / SelectInput`，每个页面只需关注数据与字段，**视觉风格高度一致**。
- 主题切换由 `next-themes` 接管；Toast 通知由 `sonner` 提供（在 [app/root.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/root.tsx#L20-L34) 中以 `<Toaster position="top-center" />` 注入）。

#### 5.1.4 mock-fallback 与离线开发能力
- [app/lib/data-loader.ts](file:///f:/B_FrontEnd_Project/TourPilot/app/lib/data-loader.ts#L29-L41) 中实现的 `withFallback` 高阶函数：
  - 优先调用真实接口
  - 检测到 `请先登录` 自动跳转 `/login`
  - 其他异常自动降级到 [app/data.ts](file:///f:/B_FrontEnd_Project/TourPilot/app/data.ts) 中的演示数据
- 即使后端尚未启动，前端依然可以**完整跑通界面演示**，对设计评审、新成员上手非常友好。

---

### 5.2 清晰分层的后端架构

#### 5.2.1 Flask Application Factory + Blueprint 拆分
- [backend/app.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/app.py) 采用工厂模式 `create_app()`：
  - 统一注册配置、CORS（支持 `withCredentials` 的 cookie 鉴权）、Session 加载钩子
  - 拆分 `auth_bp`（`/api/auth/*`）与 `api_bp`（`/api/*`）两个 Blueprint
  - 注册全局 `errorhandler(Exception)` 兜底所有未捕获异常，统一返回 `error()` 响应
- 健康检查 `/api/health` 内置，方便 K8s/容器编排做 liveness 探针。

#### 5.2.2 路由 → 服务 → 仓储 → 数据访问 四层解耦
```
routes/    （HTTP 边界：参数解析、装饰器鉴权、响应包装）
   ↓
services/  （业务编排：跨表/跨实体的事务逻辑）
   ↓
repositories/queries.py  （SQL 聚合：所有查询的单一来源）
   ↓
database.py  （连接 / 事务 / 序列化）
```
- 路由层只做"协议翻译"，例如 [backend/routes/api.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/routes/api.py#L31-L40) 中 `create_user` 只是 `success(crud.create_user(get_json()))`。
- 业务编排归 services：
  - [backend/services/orders.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/services/orders.py#L4-L46) 的 `create_order` 在同一事务里完成「写订单 + 更新团组人数 + 自动切换团组状态为已成团」。
  - [backend/services/groups.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/services/groups.py#L4-L16) 的 `cancel_group` 同步把关联订单全部置为已取消。
- SQL 聚合层 [backend/repositories/queries.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/repositories/queries.py) 集中维护所有 JOIN 查询，**避免 SQL 散落到业务逻辑中**，未来切换 ORM 也只需替换该层。

#### 5.2.3 统一响应协议
- [backend/responses.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/responses.py)：所有接口必须经 `success(data, message)` / `error(message, status)` 出口，约定 `{code, message, data}` 三元组。
- 前端 [app/lib/api.ts](file:///f:/B_FrontEnd_Project/TourPilot/app/lib/api.ts#L24-L33) 通过 axios 拦截器 **自动拆包**：
  - 成功：`response.data.data` 直接返回业务数据
  - 失败：将 `response.data.message` 转化为 `Error.message`，业务代码只需 `try/catch` 即可拿到友好错误信息
- 这一约定让前端业务函数（如 `customersApi.list()`）的返回值就是业务实体本身，不需要再做 `if (res.code === 0)` 的样板判断。

---

### 5.3 数据访问层亮点

#### 5.3.1 显式事务上下文
- [backend/database.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/database.py#L34-L44) 用 `@contextmanager` 包装事务：
  ```
  with transaction() as conn:
      with conn.cursor() as cur:
          ...
  ```
  自动 commit；任何异常都会 rollback；最终 close 连接，杜绝连接泄漏。
- 所有 services 层的多步写操作都基于该上下文，**保证业务级一致性**（订单与团组人数不会"半步成功"）。

#### 5.3.2 RealDictCursor + 自定义序列化
- 使用 `psycopg2.extras.RealDictCursor`：查询直接返回 `dict`，省掉手工字段映射。
- 自定义 `serialize()` 递归处理 `Decimal → float`、`date/datetime → ISO string`，**让 JSON 序列化"零特例"**，前端拿到的就是干净的 JSON。

#### 5.3.3 复杂 JOIN 聚合
- 例如 [route_groups](file:///f:/B_FrontEnd_Project/TourPilot/backend/repositories/queries.py#L60-L70)、[guides 带统计](file:///f:/B_FrontEnd_Project/TourPilot/backend/repositories/queries.py#L73-L82)、客户订单关联等，所有聚合 SQL 都写在仓储层，配合 `LEFT JOIN + COUNT/GROUP BY` 一次性返回前端需要的视图模型，**减少前端的二次加工**。

---

### 5.4 严格而可扩展的 RBAC 权限模型

#### 5.4.1 权限即数据
- [backend/permissions.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/permissions.py#L1-L60) 用一张 Python 字典声明 5 种角色 × N 种权限：
  - 角色：`管理员 / 销售 / 计调 / 财务 / 导游`
  - 权限粒度细化到「**资源 + 动作**」，例如 `customers` 是访问权限，`delete_customer` 是删除权限，`cancel_order` / `change_guide` 等是业务动作权限
- 新增功能时**只需要在矩阵里新增一个键值**，无需散布 if-else 判断。

#### 5.4.2 装饰器式服务端强制校验
- [backend/auth.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/auth.py#L29-L51) 提供 `login_required` 与 `permission_required(perm)` 两个装饰器：
  - `before_request` 钩子统一把 `session['user']` 注入 `g.user`
  - `permission_required` 装饰器在每个路由前**强制校验权限集合**
- 一个端点对应一个权限项，路由签名即权限契约（例：[create_user](file:///f:/B_FrontEnd_Project/TourPilot/backend/routes/api.py#L31-L34) 用 `@permission_required("users")`）。

#### 5.4.3 前后端权限同源
- 登录响应 `current_user_payload` 中下发 `permissions` 数组（见 [auth.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/auth.py#L9-L17)）。
- 前端 [app/components/layout.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/components/layout.tsx#L60) 用 `visibleNavigation = navigation.filter(item => user?.permissions?.includes(item.permission))` 动态渲染菜单：
  - **菜单按权限隐藏**
  - 即使用户手动猜 URL，服务端依然会返回 403
  - 做到「**前端体验 + 后端兜底**」双重保障

---

### 5.5 端到端的类型与契约一致性

- 前端实体类型集中维护在 [app/lib/api.ts](file:///f:/B_FrontEnd_Project/TourPilot/app/lib/api.ts#L3-L18)（`User / Customer / TravelRoute / Guide / TourGroup / Order / Expense` 等），**与数据库 schema 一一对应**。
- 每个业务模块对应一个 `*Api` 对象（`customersApi / routesApi / guidesApi / groupsApi / ordersApi / expensesApi / reportsApi / usersApi / dashboardApi`），方法签名统一：`list / create / remove / 业务动作`。
- 配合 `withCredentials: true` 与 `import.meta.env.VITE_API_BASE_URL`：开发/生产环境切换零成本。

---

### 5.6 业务级原子操作设计

后端**不暴露通用 PATCH**，而是把业务动作显式建模为独立端点：

| 端点 | 设计要点 |
| --- | --- |
| `POST /orders` | 写订单同时累加团组人数，**触达 `min_people` 自动切换为「已成团」** |
| `POST /orders/<id>/cancel` | 支持 `deduct_fee` 扣费参数，订单状态、余额、团组人数三者联动 |
| `POST /groups/<id>/cancel` | 团组取消时，**关联订单自动级联取消并清零余额** |
| `POST /groups/<id>/change-guide` | 单独的换导游端点，避免把不相关字段写花 |

好处：
- **意图清晰**：每个 URL 就是一个业务动作，便于审计、埋点、限流。
- **服务端权威**：人数、状态等派生数据由后端计算，避免前端篡改。
- **测试友好**：业务动作可以单独单元测试。

---

### 5.7 表单与变更的统一范式

#### 5.7.1 useMutation Hook
- [app/lib/actions.ts](file:///f:/B_FrontEnd_Project/TourPilot/app/lib/actions.ts#L20-L42) 中的 `useMutation()` 抽象了所有"提交→反馈→重拉数据"的流程：
  - `busy` 状态自动管理
  - 成功后调用 `revalidator.revalidate()` 触发 loader 重跑
  - 成功 `toast.success(...)`、失败 setError，统一错误展示
- 任何业务页都只需要：
  ```
  const mutation = useMutation()
  mutation.run(() => groupsApi.create(data), '团队新增成功', form)
  ```
  写一行就完成"加载态 + 通知 + 数据刷新"。

#### 5.7.2 FormData 工具集
- `formDataToObject / numberValue / optionalNumberValue` 三个工具消除原生 FormData 的字符串/空串/null 处理样板。
- 表单字段直接通过 [page.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/components/page.tsx) 的 `TextInput / SelectInput / FormGrid` 渲染，保证视觉一致。

---

### 5.8 工程化、规范化与可部署性

| 维度 | 说明 |
| --- | --- |
| 代码规范 | ESLint（[.eslintrc.cjs](file:///f:/B_FrontEnd_Project/TourPilot/.eslintrc.cjs)） + Prettier（[.prettierrc](file:///f:/B_FrontEnd_Project/TourPilot/.prettierrc)），`pnpm lint:fix` / `pnpm format` 一键修复 |
| 类型检查 | `pnpm typecheck` = `react-router typegen && tsc`，路由产物先生成再编译 |
| 包管理 | pnpm + [pnpm-workspace.yaml](file:///f:/B_FrontEnd_Project/TourPilot/pnpm-workspace.yaml)，节省磁盘与 CI 时间 |
| 配置注入 | [backend/config.py](file:///f:/B_FrontEnd_Project/TourPilot/backend/config.py) 全部通过环境变量覆盖（12-Factor 风格） |
| 容器化 | [Dockerfile](file:///f:/B_FrontEnd_Project/TourPilot/Dockerfile) **多阶段构建**：development-deps → production-deps → build → 最终镜像，仅保留运行所需依赖，镜像更小 |
| 数据初始化 | [schema.sql](file:///f:/B_FrontEnd_Project/TourPilot/schema.sql) + [seed_data.py](file:///f:/B_FrontEnd_Project/TourPilot/seed_data.py) 一键重建数据库 + 种子数据 |
| 健康检查 | `/api/health` 内置，配合容器编排做存活检测 |

---

### 5.9 用户体验细节

- **全局加载遮罩**：[app/components/global-loading-overlay.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/components/global-loading-overlay.tsx) 在 [layout.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/components/layout.tsx#L60-L68) 接入 `useNavigation()`，**路由切换时自动显示**。
- **统一反馈组件**：`StatusMessage` 把表单错误/成功消息标准化，避免每个页面自行实现。
- **响应式布局**：基于 Tailwind 的 `lg:` / `xl:` 断点，侧边栏在桌面端常驻、小屏自动隐藏。
- **Inter 字体 + 预连接**：[app/root.tsx](file:///f:/B_FrontEnd_Project/TourPilot/app/root.tsx#L7-L18) 通过 `preconnect` 提前握手 Google Fonts，**减少首屏字体渲染抖动**。
- **暗色模式**：`next-themes` + Tailwind `dark:` 变体，**所有 shadcn/ui 组件自动跟随**。
- **图标语义化**：业务菜单全部使用 lucide-react 图标（Home/Bus/Map/...），界面更易扫描。

---

## 六、数据模型（核心表）

| 表 | 关键字段 | 关系 |
| --- | --- | --- |
| `users` | `username`, `password`, `role` | — |
| `customers` | `name`, `id_card`, `phone`, `travel_preference` | 1—N → `orders` |
| `routes` | `destination`, `days`, `adult_price`, `child_price`, `status` | 1—N → `tour_groups` |
| `guides` | `name`, `phone`, `experience_years` | 1—N → `tour_groups` |
| `tour_groups` | `route_id`, `guide_id`, `departure_date`, `total_people`, `status` | N—1 → `routes` / `guides`；1—N → `orders` / `expenses` |
| `orders` | `customer_id`, `group_id`, `people_count`, `amount_receivable/paid/balance`, `order_status` | 多对一聚合 |
| `expenses` | `group_id`, `expense_type`, `amount` | N—1 → `tour_groups` |

外键统一启用 `ON DELETE CASCADE` 或 `SET NULL`，保证级联清理与悬空引用最小化。

---

## 七、本地运行

### 7.1 前端
```bash
pnpm install
pnpm dev          # 默认 http://localhost:5173
pnpm build && pnpm start  # 生产构建
```

### 7.2 后端
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1     # Windows
pip install -r backend/requirements.txt
python -m backend.app            # 默认 http://localhost:5001
```

健康检查：`GET http://localhost:5001/api/health`

### 7.3 环境变量（可选）
| 变量 | 默认值 |
| --- | --- |
| `SECRET_KEY` | `travel-agency-api` |
| `DATABASE_HOST` | `localhost` |
| `DATABASE_PORT` | `54321` |
| `DATABASE_NAME` | `travel_agency` |
| `DATABASE_USER` | `system` |
| `DATABASE_PASSWORD` | `123456789` |
| `CORS_ORIGINS` | `http://localhost:5173` |

---

## 八、可演进方向

- **接入 ORM**（SQLAlchemy）替代手写 SQL，进一步降低维护成本。
- **JWT + Refresh Token** 替代 Session，支持移动端与多端同步。
- **审计日志**：记录敏感操作（删除、取消、改派导游）。
- **报表引擎**：接入 ECharts/AntV，提供同比 / 环比分析。
- **多租户支持**：支持多家旅行社共享部署。
- **CI/CD**：GitHub Actions 自动化 lint / typecheck / build。

---

> 文档版本：v1.0 ｜ 适用于当前主分支代码快照
