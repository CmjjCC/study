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

// ====== 弱点档案（诊断结果）======
export const WEAKNESSES: Weakness[] = [
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

// ====== 试题库 ======
export const QUESTIONS: Question[] = [
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
]

// ====== 错题本 ======
export const MISTAKES: Mistake[] = [
  {
    id: 'm1',
    question: QUESTIONS[0],
    wrongAnswer: 'B',
    reason: '未验证端点 f(1)=0 时单独成立，导致区间取宽。',
    type: '应试易错误区',
    addedAt: '2026-07-05',
    reviewed: false,
  },
  {
    id: 'm2',
    question: QUESTIONS[1],
    wrongAnswer: 'Q=mgh',
    reason: '漏减最大速度对应的动能，能量守恒未算全。',
    type: '解题思路缺陷',
    addedAt: '2026-07-06',
    reviewed: false,
  },
  {
    id: 'm3',
    question: QUESTIONS[2],
    wrongAnswer: '不懂得断句，不理解句读……',
    reason: '宾语前置未识别，「不」通假未注出。',
    type: '基础漏洞',
    addedAt: '2026-07-08',
    reviewed: true,
  },
]

// ====== 试卷列表 ======
export const EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'e1',
    name: '高二数学期中统测试卷',
    subject: 'math',
    grade: '高二',
    date: '2026-05-08',
    score: 98,
    total: 150,
    questionCount: 22,
    status: '已解析',
  },
  {
    id: 'e2',
    name: '高二物理单元检测（电磁感应）',
    subject: 'physics',
    grade: '高二',
    date: '2026-05-20',
    score: 72,
    total: 100,
    questionCount: 16,
    status: '已解析',
  },
  {
    id: 'e3',
    name: '语文月考试卷',
    subject: 'chinese',
    grade: '高二',
    date: '2026-06-12',
    score: 108,
    total: 150,
    questionCount: 20,
    status: '已解析',
  },
  {
    id: 'e4',
    name: '英语期末模拟卷',
    subject: 'english',
    grade: '高二',
    date: '2026-07-10',
    score: 0,
    total: 150,
    questionCount: 25,
    status: '解析中',
  },
]

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
