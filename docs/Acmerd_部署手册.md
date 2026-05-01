# Acmerd 企业平台 - 手把手复刻手册（从 0 到 1）

> 本手册专为**零基础小白**设计，详细记录了从注册账号到网站上线的每一步操作。
> 只要跟着点，就能拥有和 `acmerd.com` 一模一样的网站！

---

## 🛒 第一阶段：准备工作（注册与安装）

### 1. 注册 GitHub 账号（代码托管平台）
1.  访问 [github.com](https://github.com)，点击右上角 **Sign up**。
2.  输入邮箱、设置密码，按提示完成验证。
3.  **记住你的用户名和密码**。

### 2. 注册 Supabase 账号（数据库服务）
1.  访问 [supabase.com](https://supabase.com)，点击右上角 **Start your project**。
2.  选择 **Log in with GitHub**，授权连接刚才的 GitHub 账号。

### 3. 注册 Cloudflare 账号（网站托管服务）
1.  访问 [dash.cloudflare.com](https://dash.cloudflare.com)，点击 **Sign up**。
2.  输入邮箱，设置密码，完成验证。

### 4. 安装 Node.js（运行环境）
1.  下载 [Node.js LTS 版本](https://nodejs.org/)（绿色 Download 按钮那个）。
2.  下载后双击安装包，**一路点击 Next** 即可（保持默认设置）。
3.  安装完成后，按 `Win + R` 输入 `cmd` 回车，输入 `node -v`，如果出现版本号说明安装成功。

---

## 🗄️ 第二阶段：搭建数据库（Supabase）

### 1. 创建新项目
1.  登录 [Supabase 控制台](https://supabase.com/dashboard)。
2.  点击右上角 **New project**。
3.  **Organization**: 选择默认的 Personal。
4.  **Name**: 填 `Acmerd-DB`（或者你喜欢的名字）。
5.  **Database Password**: 设置一个强密码（**务必截图保存！后面要用**）。
6.  **Region**: 选择 **Southeast Asia (Singapore)**（离中国近，访问快）。
7.  点击 **Create new project**，等待 1-2 分钟初始化完成。

### 2. 配置邮箱验证（防止乱注册）
1.  左侧菜单点击 **Authentication** -> **Providers**。
2.  找到 **Email Auth**，点击展开。
3.  打开 **Confirm email** 开关（建议开启，防止恶意注册）。
4.  点击 **Save**。

### 3. 获取 API Key（连接钥匙）
1.  左侧菜单点击 **Project Settings** (齿轮图标 ⚙️)。
2.  点击 **API**。
3.  找到 **Project URL**: 复制下来（例如 `https://xxxxx.supabase.co`）。
4.  找到 **Project API keys**:
    *   **anon public**: 复制这个 Key（这是前端用的，**不要泄露 Service role key**）。

### 4. 执行建表 SQL（创建数据结构）
1.  左侧菜单点击 **SQL Editor**。
2.  点击 **New query**。
3.  把项目提供的建表 SQL 代码全部粘贴进去。
4.  点击右下角 **Run**。
5.  显示 `Success` 即成功。

---

## 💻 第三阶段：获取代码与配置

### 1. 获取项目源码
*   **方法 A（如果你有源码压缩包）**：
    1.  解压项目压缩包到任意文件夹，例如 `D:\projects\blog-vue`。
    2.  进入该文件夹，你会看到 `package.json`, `src` 等文件。

*   **方法 B（如果你 Fork 了 GitHub 仓库）**：
    1.  在 GitHub 打开项目仓库，点击右上角 **Fork**，创建一份你自己的副本。
    2.  在你的电脑上安装 Git。
    3.  打开终端（CMD），输入命令：`git clone <你的仓库地址>`。

### 2. 安装依赖
1.  在项目根目录打开终端（在文件夹空白处按住 Shift + 鼠标右键，选择“在此处打开 Powershell 窗口”）。
2.  输入命令：`npm install`
3.  等待跑完，看到 `added xxx packages` 即可。

### 3. 配置环境变量
1.  在项目根目录找到 `.env` 文件（如果没有，新建一个名为 `.env` 的文件）。
2.  打开文件，填入刚才在 Supabase 复制的信息：
    ```env
    VITE_SUPABASE_URL=刚才复制的 Project URL
    VITE_SUPABASE_ANON_KEY=刚才复制的 anon public Key
    ```
3.  **保存文件**。

---

## 🚀 第四阶段：本地测试与上线

### 1. 本地运行测试
1.  在终端输入：`npm run dev`
2.  看到 `Local: http://localhost:5173/` 后，按住 Ctrl 点击链接。
3.  如果浏览器能打开网页，说明配置完美！

### 2. 推送代码到 GitHub
1.  在终端依次输入（一行一行输）：
    ```bash
    git add -A
    git commit -m "init project"
    git push
    ```
2.  如果提示登录 GitHub，按提示授权即可。

### 3. 部署上线（Cloudflare Pages）
1.  登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2.  左侧点击 **Workers & Pages**。
3.  点击 **Create application** -> 选择 **Pages** 标签页 -> 点击 **Connect to Git**。
4.  授权 GitHub，选择你刚才的项目仓库。
5.  点击 **Begin setup**。

6.  **填写构建设置**：
    *   **Project name**: 填 `acmerd`（你的域名会是 `acmerd.pages.dev`）。
    *   **Framework preset**: 选择 `Vue`。
    *   **Production branch**: `main`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`

7.  **配置环境变量（重要）**：
    *   展开 **Environment variables (advanced)**。
    *   点击 **Add variable**，添加两个变量：
        1.  变量名：`VITE_SUPABASE_URL`，值：你的 Supabase URL
        2.  变量名：`VITE_SUPABASE_ANON_KEY`，值：你的 Supabase Key

8.  **保存并部署**
    *   点击 **Save and Deploy**。
    *   等待 1-2 分钟，状态变为 **Success**。
    *   点击 **Visit site**，你的网站正式上线了！

---

## 🔐 第五阶段：后台管理员初始化

### 1. 注册第一个管理员账号
1.  访问你的网站（例如 `https://acmerd.pages.dev`）。
2.  点击右上角 **登录/注册**。
3.  使用你想作为管理员的**邮箱**注册一个账号。
4.  **注意**：如果开启了邮箱验证，必须去邮箱收信并点击验证链接才能登录。

### 2. 在数据库赋予管理员权限
1.  回到 Supabase 控制台。
2.  左侧菜单 -> **Table Editor** -> 选择 **profiles** 表。
3.  找到你刚才注册的账号那一行。
4.  双击 **is_admin** 这一列的格子，将值改为 `true`。
5.  按回车保存。

### 3. 进入后台
1.  回到你的网站，刷新页面。
2.  你会看到右上角出现了蓝色的 **“后台”** 入口。
3.  点击进入，就可以管理文章、企业、用户和评论啦！

---

**恭喜你！你已经成功拥有了自己的企业信息平台！🎉**

如果有任何报错，请检查环境变量是否填错，或者数据库密码是否正确。
祝你的网站运营顺利！
