import type {
  Subject,
  Weakness,
  Question,
  Mistake,
  ExamPaper,
  VocabWord,
  Material,
  StudyStat,
  Grade,
} from '@/types'

// ====== 学科配置（含扩展学科接口预留）======
export const SUBJECTS: Subject[] = [
  { key: 'chinese', name: '语文', color: '#ef6c5a', icon: 'BookOpen', enabled: true, mastery: 72 },
  { key: 'math', name: '数学', color: '#3b82f6', icon: 'Sigma', enabled: true, mastery: 64 },
  { key: 'english', name: '英语', color: '#a855f7', icon: 'Languages', enabled: true, mastery: 80 },
  { key: 'physics', name: '物理', color: '#f59e0b', icon: 'Atom', enabled: true, mastery: 58 },
  { key: 'chemistry', name: '化学', color: '#10b981', icon: 'FlaskConical', enabled: false, mastery: 0 },
  { key: 'biology', name: '生物', color: '#84cc16', icon: 'Leaf', enabled: false, mastery: 0 },
  { key: 'history', name: '历史', color: '#b45309', icon: 'Scroll', enabled: false, mastery: 0 },
  { key: 'geography', name: '地理', color: '#0ea5e9', icon: 'Globe2', enabled: false, mastery: 0 },
  { key: 'politics', name: '政治', color: '#ec4899', icon: 'Scale', enabled: false, mastery: 0 },
]

export const GRADES: Grade[] = ['初三', '高一', '高二', '高三']

// ====== 诊断生成池：录入试卷后 AI 从中按学科抽取生成弱点（默认不展示）======
export const DIAGNOSTIC_POOL: Weakness[] = [
  {
    id: 'w1',
    subject: 'math',
    knowledge: '二次函数与一元二次方程',
    type: '基础漏洞',
    priority: '高',
    mastery: 38,
    loseRate: 62,
    suggestion: '补强判别式与根的分布，重做 5 道含参讨论题，规范书写步骤。',
  },
  {
    id: 'w2',
    subject: 'math',
    knowledge: '立体几何空间向量',
    type: '解题思路缺陷',
    priority: '高',
    mastery: 44,
    loseRate: 56,
    suggestion: '建立坐标系→求法向量→算夹角，固定三步法，避免几何法绕路。',
  },
  {
    id: 'w3',
    subject: 'physics',
    knowledge: '电磁感应中的能量守恒',
    type: '题型短板',
    priority: '高',
    mastery: 41,
    loseRate: 59,
    suggestion: '专项训练单棒切割磁感线模型，区分安培力做功与焦耳热。',
  },
  {
    id: 'w4',
    subject: 'physics',
    knowledge: '牛顿运动定律瞬时分析',
    type: '应试易错误区',
    priority: '中',
    mastery: 55,
    loseRate: 45,
    suggestion: '注意轻绳与弹簧瞬时力突变差异，审题先标「刚性/弹性」。',
  },
  {
    id: 'w5',
    subject: 'chinese',
    knowledge: '文言文翻译特殊句式',
    type: '基础漏洞',
    priority: '中',
    mastery: 48,
    loseRate: 52,
    suggestion: '整理被动/宾前/定后句标志词，逐字对译避免意译过度。',
  },
  {
    id: 'w6',
    subject: 'english',
    knowledge: '完形填空逻辑衔接',
    type: '解题思路缺陷',
    priority: '低',
    mastery: 66,
    loseRate: 34,
    suggestion: '先通读定主旨，关注 however/besides 等逻辑信号词。',
  },
]

// ====== 题库（按年级组织，切换年级时训练出题随之过滤）======
export const QUESTION_BANK: Question[] = [
  // ----- 初三 -----
  {
    id: 'q-c3-m1',
    subject: 'math',
    grade: '初三',
    knowledge: '一元二次方程的解法',
    type: '选择题',
    difficulty: 2,
    stem: '方程 x²-5x+6=0 的两根之和为？',
    options: ['5', '6', '-5', '-6'],
    answer: 'A',
    analysis: '由韦达定理 x₁+x₂=-b/a=5，选 A。',
    tags: ['一元二次方程', '韦达定理'],
  },
  {
    id: 'q-c3-p1',
    subject: 'physics',
    grade: '初三',
    knowledge: '欧姆定律',
    type: '计算题',
    difficulty: 2,
    stem: '某导体两端电压 6V 时电流 0.3A，求其电阻。',
    answer: '20Ω',
    analysis: 'R=U/I=6/0.3=20Ω，直接应用欧姆定律。',
    tags: ['欧姆定律', '电阻'],
  },
  {
    id: 'q-c3-e1',
    subject: 'english',
    grade: '初三',
    knowledge: '一般现在时',
    type: '选择题',
    difficulty: 1,
    stem: 'He ___ to school every day.',
    options: ['go', 'goes', 'going', 'went'],
    answer: 'B',
    analysis: '主语 He 为第三人称单数，动词加 -es。',
    tags: ['一般现在时', '单三'],
  },
  // ----- 高一 -----
  {
    id: 'q-g1-m1',
    subject: 'math',
    grade: '高一',
    knowledge: '集合的基本运算',
    type: '选择题',
    difficulty: 2,
    stem: '设 A={1,2,3}，B={2,3,4}，则 A∩B=',
    options: ['{1}', '{2,3}', '{1,2,3,4}', '{4}'],
    answer: 'B',
    analysis: '交集取公共元素 {2,3}。',
    tags: ['集合', '交集'],
  },
  {
    id: 'q-g1-p1',
    subject: 'physics',
    grade: '高一',
    knowledge: '匀变速直线运动',
    type: '计算题',
    difficulty: 3,
    stem: '物体由静止做匀加速直线运动，加速度 2m/s²，求 3s 末速度与位移。',
    answer: 'v=6m/s；s=9m',
    analysis: 'v=at=6m/s；s=½at²=½×2×9=9m。',
    tags: ['匀变速', '运动学'],
  },
  {
    id: 'q-g1-c1',
    subject: 'chinese',
    grade: '高一',
    knowledge: '现代文阅读主旨',
    type: '简答题',
    difficulty: 3,
    stem: '简述如何快速把握议论文的中心论点。',
    answer: '看标题、首段、各段首句与结论段，概括「论点+论据」结构。',
    analysis: '论点常在首段或结尾，抓总起句与总结句即可定位。',
    tags: ['现代文', '主旨', '议论文'],
  },
  // ----- 高二 -----
  {
    id: 'q1',
    subject: 'math',
    grade: '高二',
    knowledge: '二次函数与一元二次方程',
    type: '选择题',
    difficulty: 3,
    stem: '已知函数 f(x)=x²-2ax+3 在区间 [1,2] 上有零点，则实数 a 的取值范围是？',
    options: ['[√6/2, 2]', '[1, 2]', '[√6/2, +∞)', '[2, +∞)'],
    answer: 'A',
    analysis: '由 f(1)f(2)≤0 解得 a∈[√6/2,2]，注意端点验证；属零点分布基础题型。',
    tags: ['二次函数', '零点分布', '含参讨论'],
  },
  {
    id: 'q2',
    subject: 'physics',
    grade: '高二',
    knowledge: '电磁感应中的能量守恒',
    type: '计算题',
    difficulty: 4,
    stem: '质量为 m、电阻为 R 的导体棒在磁感应强度 B 的匀强磁场中由静止释放，下落 h 时达到最大速度。求最大速度与全过程产生的焦耳热。',
    answer: 'v=mgR/B²L²；Q=mgh-mv²/2',
    analysis: '安培力等于重力时达最大速度；能量守恒：重力势能=动能+焦耳热。',
    tags: ['电磁感应', '能量守恒', '安培力'],
  },
  {
    id: 'q3',
    subject: 'chinese',
    grade: '高二',
    knowledge: '文言文翻译特殊句式',
    type: '翻译题',
    difficulty: 3,
    stem: '将「句读之不知，惑之不解，或师焉，或不焉」译为现代汉语。',
    answer: '不理解句读，不能解除疑惑，（有的）向老师学习，（有的）不向老师学习……',
    analysis: '宾语前置句，「之」为标志词，注意「不」通「否」，主语省略。',
    tags: ['宾语前置', '通假字', '句读'],
  },
  {
    id: 'q4',
    subject: 'english',
    grade: '高二',
    knowledge: '完形填空逻辑衔接',
    type: '完形填空',
    difficulty: 3,
    stem: '... He worked hard, ___ he still failed the exam. (填连词)',
    options: ['however', 'therefore', 'besides', 'thus'],
    answer: 'A',
    analysis: '前后为转折关系，选 however；therefore/thus 表因果，besides 表递进。',
    tags: ['逻辑衔接', '转折', '完形'],
  },
  // ----- 高三 -----
  {
    id: 'q-g3-m1',
    subject: 'math',
    grade: '高三',
    knowledge: '导数的综合应用',
    type: '计算题',
    difficulty: 5,
    stem: 'f(x)=x³-3x+1，求单调区间与极值。',
    answer: '增区间(-∞,-1]∪[1,+∞)，减[-1,1]；极大3，极小-1',
    analysis: 'f′=3x²-3=3(x²-1)，零点 ±1；列表判断单调性，代入求极值。',
    tags: ['导数', '单调性', '极值'],
  },
  {
    id: 'q-g3-p1',
    subject: 'physics',
    grade: '高三',
    knowledge: '电磁感应综合',
    type: '计算题',
    difficulty: 5,
    stem: '导体棒在磁场中运动并接入含电容的回路，分析棒的运动性质与最终状态。',
    answer: '棒做加速度减小的加速运动，最终匀速',
    analysis: '安培力随速度增大而增大，合力减小，加速度减小；当 a=0 时匀速。',
    tags: ['电磁感应', '电容', '动态分析'],
  },
  {
    id: 'q-g3-c1',
    subject: 'chinese',
    grade: '高三',
    knowledge: '议论文立意与结构',
    type: '写作题',
    difficulty: 4,
    stem: '以「快与慢」为题，列出文章立意与分论点提纲。',
    answer: '立意：快慢相济方为大道；分论：快的效率/慢的沉淀/快慢结合',
    analysis: '辩证立意，避免单极；分论点并列递进，首尾呼应。',
    tags: ['作文', '立意', '结构'],
  },
  {
    id: 'q-g3-e1',
    subject: 'english',
    grade: '高三',
    knowledge: '书面表达应用文',
    type: '写作题',
    difficulty: 4,
    stem: '写一封邀请函，邀请外教参加学校英语角活动（约 100 词）。',
    answer: 'Dear ..., I\'m writing to invite you to ... 时间/地点/活动/期待',
    analysis: '应用文格式：称呼+目的+细节+期待+落款；时态用一般将来时。',
    tags: ['应用文', '邀请函', '写作'],
  },
]

// 注：试卷(ExamPaper)与错题(Mistake)属用户数据，默认为空，
// 由 DataContext 在用户录入试卷、AI 诊断后生成并按年级隔离，不在 mock 预置。


// ====== 单词记忆 ======
export const VOCAB: VocabWord[] = [
  { id: 'v1', word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃；遗弃', example: 'Never abandon your dreams.', stage: '复习中', nextReview: '今日' },
  { id: 'v2', word: 'comprehensive', phonetic: '/ˌkɒmprɪˈhensɪv/', meaning: 'adj. 全面的；综合的', example: 'a comprehensive review', stage: '学习中', nextReview: '今日' },
  { id: 'v3', word: 'inevitable', phonetic: '/ɪnˈevɪtəbl/', meaning: 'adj. 不可避免的', example: 'an inevitable result', stage: '新词', nextReview: '明日' },
  { id: 'v4', word: 'fluctuate', phonetic: '/ˈflʌktʃueɪt/', meaning: 'v. 波动；起伏', example: 'Prices fluctuate daily.', stage: '已掌握', nextReview: '本周' },
  { id: 'v5', word: 'substantial', phonetic: '/səbˈstænʃl/', meaning: 'adj. 大量的；实质的', example: 'substantial evidence', stage: '复习中', nextReview: '今日' },
  { id: 'v6', word: 'articulate', phonetic: '/ɑːˈtɪkjuleɪt/', meaning: 'v. 清楚地表达', example: 'She articulated her ideas well.', stage: '新词', nextReview: '明日' },
]

// ====== 素材库 ======
export const MATERIALS: Material[] = [
  { id: 'ma1', title: '坚持与积累：竹子定律', category: '议论文素材', excerpt: '竹子前四年仅长 3 厘米，第五年起每日疯长 30 厘米……', tags: ['坚持', '积累', '质变'], subject: 'chinese' },
  { id: 'ma2', title: '科技伦理：AI 双刃剑', category: '议论文素材', excerpt: '人工智能在医疗与隐私间寻找平衡，技术向善是底线……', tags: ['科技', '伦理', '边界'], subject: 'chinese' },
  { id: 'ma3', title: '环境类高级句式 5 则', category: '英语写作', excerpt: 'It is high time that we took action to...', tags: ['句式', '环境', '高级表达'], subject: 'english' },
  { id: 'ma4', title: '人物传记：袁隆平', category: '议论文素材', excerpt: '禾下乘凉梦，一稻济世心……', tags: ['人物', '奉献', '理想'], subject: 'chinese' },
  { id: 'ma5', title: '万能过渡衔接词组', category: '英语写作', excerpt: 'what is more, in addition, on the contrary...', tags: ['衔接', '过渡', '词组'], subject: 'english' },
]

// ====== 学习统计（近 14 天）======
export const STUDY_STATS: StudyStat[] = Array.from({ length: 14 }).map((_, i) => {
  const base = [45, 60, 30, 75, 50, 90, 40, 65, 80, 55, 35, 70, 85, 60]
  const acc = [82, 78, 88, 75, 80, 72, 85, 79, 74, 83, 90, 76, 71, 81]
  const qs = [18, 24, 12, 30, 20, 36, 16, 26, 32, 22, 14, 28, 34, 24]
  const d = new Date(2026, 5, 28 + i)
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    minutes: base[i],
    questions: qs[i],
    accuracy: acc[i],
  }
})

// ====== 各学科掌握度趋势 ======
export const MASTERY_TREND = [
  { date: '6/14', math: 50, physics: 40, english: 72, chinese: 65 },
  { date: '6/21', math: 54, physics: 45, english: 75, chinese: 68 },
  { date: '6/28', math: 58, physics: 48, english: 77, chinese: 69 },
  { date: '7/5', math: 61, physics: 52, english: 79, chinese: 70 },
  { date: '7/12', math: 64, physics: 58, english: 80, chinese: 72 },
]
