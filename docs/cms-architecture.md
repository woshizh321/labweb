# CMS 后台架构方案（Directus + PostgreSQL）

> 状态：**方案存档（草案）**，待前端信息固定后再进入实施。
> 本文档不含已落地的代码改动；现有 `docker-compose.yml`、`frontend/`、`lib/data.ts`、
> `frontend/data/*.json` 数据结构锁在本方案任何阶段均**不改动**。
> 最后更新：2026-06-09

## 目标

为非 IT 人士（PI / 技术员）提供一个类似 WordPress/PageAdmin 的可视化后台，用于编辑实验室
文字内容、成员信息、论文、新闻，并上传成员照片。优先采用 **Directus（Headless CMS）+
PostgreSQL**，不从零自研 CMS。

## 约束（硬性）

- 不修改现有代码、不影响当前线上网站。
- 不接入真实患者数据 / PII。
- 不开放 3000（frontend）/ 8000（backend）/ 8055（Directus）到公网——仅内网 `expose`，
  唯一对外的是 nginx。
- 后台上线前**必须有 HTTPS**。
- 服务器资源有限：4 GB RAM / 8 vCPU / 70 GB SSD。

---

## 一句话结论

**Directus + PostgreSQL 适合本项目。** 但前端读取方式**不走"运行时直连 CMS API"**，而采用
**"Directus 当后台、构建期导出回 JSON"** 的混合模式（见 §7），以同时保住三个核心资产：
SSG 静态渲染、`frontend/data/*.json` 数据结构锁、以及"CMS 宕机主站照常在线"的韧性。

---

## 1. Directus 是否适合本项目

适合，且是当前最优解。

| 诉求 | Directus |
|---|---|
| 非 IT 人士可视化编辑 | ✅ 按数据表自动生成增删改查界面，所见即所得 |
| 成员/论文/新闻/文字管理 | ✅ Collections + 字段编辑器，无需写代码 |
| 上传成员照片 | ✅ 内置文件库 + 自动缩略图 |
| 不从零自研 | ✅ 开源、成熟、自托管、不强制联网 |
| 权限分级（PI vs 学生） | ✅ 内置 Roles & Permissions |
| 4G/70G 小服务器 | ⚠️ 可行但偏紧，见 §2、§9 |

**与 WordPress/PageAdmin 的区别**：WordPress 是"自带前端的整站系统"，会与现有 Next.js
前端冲突；Directus 是**纯后台（headless）**，只管数据，前端保持现状——正合"只加后台、不动
前端体验"的诉求。Directus 编辑界面可切中文；对结构化内容（成员/论文）比 WordPress 更顺手，
长文排版靠富文本（WYSIWYG）字段满足。

## 2. 推荐 Docker Compose 架构

在现有 `frontend / backend / nginx` 之外，新增两个容器，**均仅内网、绝不发布公网端口**：

```
现有（不动）：
  nginx      :80/:443   (唯一对外)
  frontend   :3000      (仅 expose，内网)
  backend    :8000      (仅 expose，内网)

新增：
  directus   :8055      (仅 expose，内网；由 nginx 反代)
  cms-db     PostgreSQL :5432  (仅 expose，内网；只有 directus 能连)
```

落地要点：
- `directus`、`cms-db` 用 `expose:` 而非 `ports:`，**不映射宿主机**。
- 新增 `cms_db_data`、`directus_uploads` 两个 named volume 做持久化。
- **不改现有 `docker-compose.yml`**，改用新建的 `docker-compose.cms.yml`（override），
  以 `docker compose -f docker-compose.yml -f docker-compose.cms.yml up -d` 启动。
  CMS 成为**可插拔叠加层**，出问题随时 `down`，主站不受影响。

**内存预算（4G 现实评估）：**

| 服务 | 大致常驻内存 |
|---|---|
| nginx | ~20 MB |
| frontend (Next standalone) | ~150–250 MB |
| backend (FastAPI) | ~120 MB |
| PostgreSQL | ~150–250 MB |
| Directus (Node) | ~250–400 MB |
| 系统/Docker 守护 | ~400 MB |
| **合计峰值** | **~1.4–1.6 GB** |

够用但无富余。两条硬建议：① 服务器加 **2 GB swap**（防上传大图/构建期 OOM）；
② 给 `directus`、`cms-db` 设 `mem_limit`（如 Directus 512M、PG 384M），防单容器吃爆内存
拖垮主站。

## 3. Nginx 路由：子域名 vs `/admin/`

**推荐子域名 `admin.lab.xxx.edu`，不推荐 `/admin/`。**

| | 子域名 `admin.lab.xxx.edu` ✅ | 路径 `/admin/` ❌ |
|---|---|---|
| Cookie/会话隔离 | 完全独立 | 与主站同源，混在一起 |
| Directus 资源路径 | 干净，默认按根路径工作 | 需改 `PUBLIC_URL` + 大量 rewrite，易踩坑 |
| 安全收口 | 可整段加 IP 白名单 / Basic Auth / 单独 TLS | 难单独保护一个子路径 |
| 主站缓存 | 互不干扰 | 后台动态请求污染主站缓存规则 |

落地：`nginx/lab.conf` **新增一个 server 块**（不动现有 `/`、`/api/` 块），
`server_name admin.lab.xxx.edu;` 反代到 `directus:8055`；DNS 加一条 A 记录指向同一服务器。

## 4. 需要建立哪些 Collections

对应现有 5 个 JSON + 站点配置，共 **6 个内容 Collection + 1 个单例配置**：

1. `members` — 成员
2. `publications` — 论文
3. `news` — 新闻
4. `alumni` — 毕业去向
5. `models` — 模型卡片（**慎重**，见下）
6. `research_areas` — 研究方向（目前在 `lib/site.ts`，可选纳入）
7. `site_settings`（**Singleton 单例**）— 实验室名称、机构、邮箱、地址、首页 banner 文字等

> **`models` 慎重**：模型卡片牵涉 `route`、`MODEL_EMBEDS` 代码映射、iframe 嵌入等技术细节，
> 不建议交非 IT 人士在后台编辑（改错 route 会导致模型页 404）。建议 `models` 不纳入 CMS、
> 继续走代码管理，或在后台设为只读展示。守住"模型页安全约束"。

## 5. 每个 Collection 的字段（严格对齐现有 JSON / `lib/types.ts`）

**`members`**（对应 `Member`，字段名保持一致以便零摩擦导出）
- `name` (string)、`role` (string)、`degree` (string)
- `group`（**dropdown 单选**，锁死 7 个枚举：PI / Faculty / Technical Staff /
  PhD Students / Master Students / Joint-Training PhD / Visiting Students）——用下拉锁枚举，
  防止打错字破坏分组
- `researchFocus` (text)、`email` (string)、`bio` (textarea)
- `avatar`（**File 类型**，关联文件库）+ `sort`（手动排序）

**`publications`**（对应 `Publication`）
- `title` (text)、`authors` (text)、`journal` (string)、`year` (integer)
- `doi` (string)、`pubmed` (string)、`tags` (JSON/标签数组)、`featured` (boolean)

**`news`**（对应 `NewsItem`）
- `title`、`date` (date)、`summary` (textarea)、`category` (string，可做下拉)

**`alumni`**（对应 `Alumni`）
- `name`、`degree`、`period` (string，如 "2018–2023")、`currentPosition`、
  `currentInstitution`、`researchFocus`

**`research_areas`**（对应 `ResearchArea`，双语，可选）
- `id` (slug)、`title`、`summary`、`highlights` (JSON 数组)；双语则每字段分 `_zh`/`_en`

**`site_settings`**（Singleton）
- `lab_name_zh`、`lab_name_en`、`institution_zh/en`、`email`、`address`、
  `banner_headline_zh/en`、`banner_subtext_zh/en` 等

> 每个 Collection 加 Directus 自带的 `status`（draft/published）、`sort`、`date_updated`；
> 导出时只取 `published`。

## 6. 从现有 JSON 迁移到 CMS

一次性导入，不手工录入：
1. 用 Directus REST API + 一次性脚本 `scripts/seed-cms.mjs` 读现有 `frontend/data/*.json`
   逐条 `POST` 到对应 Collection（字段名一致，基本直通映射）。
2. `avatar` 现为空串，首批留空；PI 后续在后台上传，无需迁移历史图片。
3. 导入后人工核对（13 成员、11 论文，量小，约 5 分钟）。
4. 迁移脚本只读不写现有 JSON，不触碰线上。

## 7. 前端如何读取（核心架构决策）

**不建议**"前端运行时直连 CMS API"。两方案对比，推荐 B：

**方案 A：前端运行时直连 Directus API**
- 前端每次渲染调 `directus:8055/items/...`。
- 代价：① 须从 SSG 改 SSR/ISR；② CMS 宕机主站跟着挂；③ 破坏 `lib/data.ts → JSON` 数据流和
  数据结构锁；④ 4G 内存多一层运行时依赖。

**方案 B：Directus 当后台，构建期/Webhook 导出回 JSON（✅ 推荐）**
- PI 后台点"发布" → Directus Webhook/Flow → 跑 `scripts/export-cms.mjs` 把各 Collection
  拉成 `frontend/data/*.json`（**格式与现状一致**）→ 触发前端重新 `build`（或 `git commit`
  + `deploy.sh`）。
- 好处：
  - 前端**完全不改**：仍读 `frontend/data/*.json`，`lib/data.ts`、数据结构锁、SSG 原封不动。
  - **CMS 与主站解耦**：Directus 平时可关闭省内存，仅编辑时启动；主站永远纯静态、零运行时
    依赖、最快最稳。
  - 符合 CLAUDE.md"数据流只走 `lib/data.ts`""数据结构锁"两条硬约束。
- 代价：内容更新非即时，"发布后跑一次构建（约 1–2 分钟）"。对实验室官网完全可接受，且可审阅、
  可回滚、有 git 历史。

> 一句话：**把 Directus 当"给非 IT 人士用的 JSON 编辑器 + 图床"，而非"网站运行时数据库"。**

## 8. 图片上传与访问路径

- 上传：PI 在 Directus 文件库上传，存到 `directus_uploads` volume，自动生成缩略图。
- 导出：`export-cms.mjs` 把选中头像**复制到 `frontend/public/avatars/<slug>.jpg`**，
  并把 `avatar` 字段写成 `/avatars/<slug>.jpg`——对接现有 `Member.avatar`（"path under
  /public"）约定，`PlaceholderImage` 的 fallback 无需改。
- 访问：照片由前端容器/nginx 当静态资源直出，不经 Directus，主站不依赖 CMS 在线。
- 好处：图片随网站进 git/部署，有版本、可回滚；Directus 仅作"上传入口"。

## 9. 权限、备份、安全（4G 公网机器命门）

**权限**
- 角色两级：`Editor`（PI/技术员，改全部）、`Contributor`（学生，仅改自己条目，可选）。
- 关掉 public 角色对外读权限（前端不直连，API 无需对公网开放）。

**安全**
- `directus`、`cms-db` **绝不 `ports:` 映射**，仅内网 `expose`。
- 后台子域名**上线前必须 HTTPS**：certbot 给 `admin.lab.xxx.edu` 单独签证书。
- 后台子域名**额外加一层**：nginx IP 白名单（`allow <实验室IP>; deny all;`）或 Basic Auth；
  Directus 自身登录为第二道门。
- `KEY`/`SECRET`/`ADMIN_PASSWORD`/`DB_PASSWORD` 全走 `.env`，绝不进 git（沿用 `.env.example`
  占位符约定）。
- 5432 只对 `directus` 容器可见。

**备份**
- 每天 `pg_dump cms-db` → `backups/cms-YYYYMMDD.sql.gz`（cron），保留 7–14 天。
- `directus_uploads` volume 定期 `tar` 备份；因导出后图片已进 `frontend/public/` 随 git 走，
  **git 仓库本身即一份内容副本**（方案 B 的韧性红利）。
- 70G SSD 对这些备份绰绰有余。

## 10. 最小可行实施计划（分阶段、每步可回滚、不影响线上）

**阶段 0 — 本地验证（不碰服务器）**
1. 写 `docker-compose.cms.yml`（override）+ `.env.example` 增补占位符。
2. 本地起 Directus + PG，建 6 个 Collection + 字段（用 Directus schema snapshot 导出成文件
   纳入 git，便于复制到服务器）。
3. 写并跑 `scripts/seed-cms.mjs`，灌入现有 JSON，人工校验。

**阶段 1 — 导出闭环（核心）**
4. 写 `scripts/export-cms.mjs`：Directus → `frontend/data/*.json` + `frontend/public/avatars/`，
   **diff 验证导出结果与现有 JSON 完全一致**（验收关键：导出须能 1:1 复现当前数据）。
5. 配 Directus Flow/Webhook："发布" → 触发导出 → 触发 `deploy.sh`（或人工一键）。

**阶段 2 — 服务器上线**
6. 服务器加 swap；`nginx/lab.conf` 加 `admin.` server 块；DNS 加 A 记录。
7. certbot 给 `admin.` 子域名签 HTTPS；加 IP 白名单/Basic Auth。
8. `docker compose -f docker-compose.yml -f docker-compose.cms.yml up -d` 起 CMS；
   导入 schema + 数据；配每日 `pg_dump` cron。

**阶段 3 — 交付 PI**
9. 建角色账号，写一页**中文图文操作手册**（改成员、传照片、发新闻、点发布）。
10. 陪 PI 走完整流程：改一条 → 发布 → 看主站生效 → 确认无误。

> 全程现有 `docker-compose.yml`、`frontend/`、`lib/data.ts`、数据结构锁**一行不改**；
> CMS 为叠加层，任何阶段出问题 `down` 掉即回到今天的纯静态站。

---

## 待拍板的决策（前端信息固定后再定）

1. **`models` 是否纳入后台**？倾向**不纳入**（留代码管理），保护模型页安全。
2. **是否要双语内容编辑**？若 PI 只维护中文内容，Collection 可先单语，省一半字段。
3. 前端内容字段一旦固定，回头核对本文档 §5 的 Collection 字段是否需要增减。

## 现有数据结构参照（实施时对齐用）

字段定义来源：`frontend/lib/types.ts`（`Member` / `Publication` / `NewsItem` / `Alumni` /
`ResearchArea` / `ModelCard`）。数据来源：`frontend/data/*.json`。数据访问层：`frontend/lib/data.ts`
（分组顺序 `MEMBER_GROUP_ORDER`、排序规则集中于此）。站点配置：`frontend/lib/site.ts`。
