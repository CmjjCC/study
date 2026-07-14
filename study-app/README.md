# 学情闭环 · AI 智能试卷分析与弱点靶向训练系统

面向初三至高三学段的全学科一站式升学备考学习网站。以「试卷录入 → 弱点诊断 → 分析总结 → 靶向出题 → 刷题训练 → 二次复盘」AI 闭环为核心，实现个性化查漏补缺与精准提分。

## 快速开始

```bash
npm install
npm run dev      # 开发服务器 http://localhost:5173
npm run build    # 类型检查 + 生产构建
npm run preview  # 预览构建产物 http://localhost:4173
```

## 技术栈

- **React 18 + TypeScript + Vite** —— 组件化、类型安全
- **TailwindCSS** —— 原子化样式 + 自定义设计 token
- **React Router v6** —— 多页面路由
- **Recharts** —— 数据可视化（趋势/雷达/柱状/面积图）
- **Lucide React** —— 图标库

## 设计系统（整齐间距的关键）

间距与样式统一由 `src/index.css` 的设计 token 约束：

| 类 | 用途 |
|----|------|
| `.page` | 页面容器：`max-w-[1280px] mx-auto px-6 py-6` |
| `.card` | 卡片：`rounded-2xl p-6 border shadow-card` |
| `.grid-cards` | 卡片网格：`grid gap-4 sm:grid-cols-2 lg:grid-cols-3` |
| `.page-head / .page-title / .page-subtitle` | 页头区 |
| `.section-title` | 区块标题 |
| `.input-base` | 表单控件统一圆角与聚焦 |

- 区块间距统一 `space-y-6`，卡片内 `p-6`，网格 `gap-4`
- 文字三级层级：`.text-main / .text-sub / .text-muted`
- 护眼模式：`.eye-care` 切换暖米色 token（顶栏一键开关）
- 品牌主色 `brand-*` 成长绿，学科各自配色

## 页面结构

```
src/
├── components/
│   ├── ui.tsx                 # Button/Card/Badge/Progress/StatTile 等通用组件
│   └── layout/                # AppLayout + Sidebar + Topbar
├── context/AppContext.tsx     # 年级/护眼模式/学科全局状态
├── data/mock.ts               # 演示数据（学科/弱点/题目/试卷/单词/素材/统计）
├── pages/                     # 12 个页面
└── types/index.ts             # 全局类型
```

### 页面清单

| 页面 | 路由 | 说明 |
|------|------|------|
| 学情概览 | `/` | Hero 闭环引导、统计 Tile、趋势图、雷达图、急补弱点、近期试卷 |
| 分科学习 | `/subjects` | 已上线学科卡片 + 待开放学科（接口预留） |
| 试卷录入 | `/paper-upload` | 三种录入方式 + AI 解析状态 + 闭环步骤条 |
| 弱点分析报告 | `/weakness` | 四类归因、优先级、掌握度/失分率、可落地提升方案 |
| 靶向出题训练 | `/training` | 变式题作答、即时批改、详细解析、闭环进度 |
| 错题本 | `/mistakes` | 学科/类型筛选、错因分析、重做归档 |
| 单词记忆 | `/vocab` | 艾宾浩斯复习卡片、翻转释义、阶段管理 |
| 素材库 | `/materials` | 议论文素材、写作句式、分类筛选、收藏 |
| 模板库 | `/templates` | 作文/解题模板、展开收起、复制收藏 |
| 我的收藏 | `/favorites` | 聚合收藏的素材/模板/题目 |
| 学习记录 | `/stats` | 时长柱状图、正确率面积图、热力图、学科掌握度 |
| 设置 | `/settings` | 个人信息、年级切换、护眼模式、学科管理、隐私 |

## 闭环能力（核心）

1. **试卷录入** —— 上传图片 / 粘贴错题 / 录入得分，AI 自动结构化
2. **弱点诊断** —— 区分「基础漏洞 / 题型短板 / 解题思路缺陷 / 应试易错误区」，杜绝笼统评价
3. **分析总结** —— 生成专属弱点档案，标注优先级与提升方案
4. **靶向出题** —— 同考点 / 同难度 / 同题型变式题生成
5. **刷题训练** —— 即时批改纠错
6. **二次复盘** —— 更新弱点档案，动态优化训练方向

## 学科扩展

架构通过 `SUBJECTS` 配置 + `SubjectIcon` 适配层抽象学科接口。新增学科只需：
1. 在 `src/data/mock.ts` 的 `SUBJECTS` 中开启 `enabled: true`
2. 补充该学科知识图谱与题目

无需改动主干流程。当前已上线语数英物，化学/生物/历史/地理/政治接口已预留。

## 数据说明

当前为前端演示，数据来自 `src/data/mock.ts`。接入后端时替换数据层即可，UI 与类型已就绪。
