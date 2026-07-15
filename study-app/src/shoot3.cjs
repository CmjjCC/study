const puppeteer = require('puppeteer-core')
const path = require('path')
const CHROME = String.raw`C:\Users\chenr\AppData\Local\Google\Chrome\Application\chrome.exe`
const OUT = path.join(__dirname, 'screenshots')
const BASE = 'http://localhost:4173'
require('fs').mkdirSync(OUT, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const clickByText = async (page, text, tag = 'button') => {
  const h = await page.evaluateHandle((t, tg) => {
    const els = [...document.querySelectorAll(tg)]
    return els.find((e) => (e.textContent || '').includes(t)) || null
  }, text, tag)
  const el = h.asElement()
  if (el) await el.click()
  else console.log('  [warn] not found:', text)
  await h.dispose()
}
// SPA 导航：点击侧栏链接（不重载页面，state 保持）
const spaNav = async (page, href) => {
  await page.click(`a[href="${href}"]`)
  await sleep(500)
}
const has = async (page, t) => {
  const b = await page.evaluate(() => document.body.textContent)
  return b.includes(t)
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--force-device-scale-factor=1'],
    defaultViewport: { width: 1440, height: 1024 },
  })
  const page = await browser.newPage()
  let pass = 0, fail = 0
  const check = async (name, cond) => {
    console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`)
    cond ? pass++ : fail++
  }

  // ===== 默认空状态（未使用无虚假信息，各页独立加载本就空）=====
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' }); await sleep(500)
  await check('学情概况 弱点区空', await has(page, '未上传信息，暂无弱点诊断'))
  await check('学情概况 趋势空', await has(page, '暂无学习数据'))
  await page.screenshot({ path: path.join(OUT, 'd-empty.png'), fullPage: true })

  await page.goto(`${BASE}/training`, { waitUntil: 'networkidle2' }); await sleep(400)
  await check('靶向训练 无弱点不出题', await has(page, '暂无薄弱点，无法靶向出题'))
  await page.screenshot({ path: path.join(OUT, 't-empty.png'), fullPage: true })

  await page.goto(`${BASE}/stats`, { waitUntil: 'networkidle2' }); await sleep(400)
  await check('学习记录 空', await has(page, '暂无数据'))
  await page.goto(`${BASE}/mistakes`, { waitUntil: 'networkidle2' }); await sleep(400)
  await check('错题本 空', await has(page, '错题本为空'))
  await page.goto(`${BASE}/favorites`, { waitUntil: 'networkidle2' }); await sleep(400)
  await check('收藏 空', await has(page, '暂无收藏'))
  await page.goto(`${BASE}/subjects`, { waitUntil: 'networkidle2' }); await sleep(400)
  await check('学科掌握度 暂无', await has(page, '暂无数据'))

  // ===== 单词书选择 =====
  await page.goto(`${BASE}/vocab`, { waitUntil: 'networkidle2' }); await sleep(400)
  await check('单词 未选词书', await has(page, '请选择单词书'))
  await clickByText(page, '高考 3500 词'); await sleep(400)
  await check('单词 选书后显示词条', await has(page, 'comprehensive'))
  await page.screenshot({ path: path.join(OUT, 'v-book.png'), fullPage: true })

  // ===== 录入闭环（之后全部用 SPA 导航，保持 state）=====
  await page.goto(`${BASE}/paper-upload`, { waitUntil: 'networkidle2' }); await sleep(400)
  await clickByText(page, '选择文件并开始解析'); await sleep(2200)
  await check('试卷 解析完成', await has(page, '试卷解析完成'))
  await clickByText(page, '查看弱点报告'); await sleep(600)
  await check('录入后 弱点出现', await has(page, '补强判别式'))
  await check('弱点卡 渲染来源试卷', await has(page, '来源：'))
  await page.screenshot({ path: path.join(OUT, 'w-filled.png'), fullPage: true })

  // 靶向出题（SPA 导航到训练，state 保持）
  await spaNav(page, '/training'); await sleep(500)
  await check('靶向 按弱点出题', await has(page, '来源弱点'))
  await check('靶向 题干出现', await has(page, '已知'))
  // 选第一个选项并提交
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')]
    const opt = btns.find((b) => /^[A-E]/.test(b.textContent.trim()) && b.textContent.length > 3)
    if (opt) opt.click()
  })
  await sleep(200)
  await clickByText(page, '提交批改'); await sleep(500)
  await check('靶向 提交后解析', await has(page, '详细解析'))
  await page.screenshot({ path: path.join(OUT, 't-submit.png'), fullPage: true })

  // 学情概况有数据（SPA）
  await spaNav(page, '/'); await sleep(500)
  await check('学情概况 学习数据出现', !(await has(page, '暂无学习数据')))
  await check('学情概况 弱点卡出现', await has(page, '补强判别式'))
  await page.screenshot({ path: path.join(OUT, 'd-filled.png'), fullPage: true })

  await spaNav(page, '/stats'); await sleep(400)
  await check('学习记录 数据出现', !(await has(page, '暂无数据')))
  await page.screenshot({ path: path.join(OUT, 's-filled.png'), fullPage: true })

  // ===== 素材按学科切换 + 收藏（SPA）=====
  await spaNav(page, '/materials'); await sleep(400)
  await clickByText(page, '数学'); await sleep(300)
  await check('素材 切数学显示数学内容', await has(page, '数学思想') || await has(page, '分类讨论'))
  await page.screenshot({ path: path.join(OUT, 'm-math.png'), fullPage: true })
  await clickByText(page, '收藏'); await sleep(300)
  await check('素材 收藏成功', await has(page, '已收藏'))

  await spaNav(page, '/favorites'); await sleep(400)
  await check('收藏 出现收藏项', !(await has(page, '暂无收藏')))
  await page.screenshot({ path: path.join(OUT, 'f-filled.png'), fullPage: true })

  // ===== 年级隔离：切高一，弱点应空（录入的是高二）=====
  await spaNav(page, '/weakness'); await sleep(400)
  await clickByText(page, '高二'); await sleep(300)
  await clickByText(page, '高一'); await sleep(500)
  await check('切高一 弱点隔离空', await has(page, '暂无弱点诊断'))
  await page.screenshot({ path: path.join(OUT, 'w-g1-iso.png'), fullPage: true })

  // 切回高二，弱点恢复
  await clickByText(page, '高一'); await sleep(300)
  await clickByText(page, '高二'); await sleep(500)
  await check('切回高二 弱点恢复', await has(page, '补强判别式'))

  console.log(`\n=== ${pass} PASS / ${fail} FAIL ===`)
  await browser.close()
})().catch((e) => {
  console.error('ERR', e.message)
  process.exit(1)
})
