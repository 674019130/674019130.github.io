<script setup lang="ts">
import { computed } from 'vue'
import githubActivity from '../data/activity.json'
import tokenActivity from '../data/token-activity.json'

type HomeLocale = 'en' | 'zh'
type ActivityKind = 'github' | 'token'

interface ActivityDay {
  date: string
  count?: number
  level: number
}

interface GridDay extends ActivityDay {
  empty?: boolean
}

interface ActivitySnapshot {
  source: string
  generatedAt: string
  username?: string
  period: { from: string, to: string }
  summary: {
    activeDays: number
    total?: number
    totalTokens?: number
    averageTokensPerActiveDay?: number
  }
  days: ActivityDay[]
}

interface ActivityStat {
  label: string
  value: string
  primary?: boolean
}

interface ActivityPanel {
  id: ActivityKind
  label: string
  url: string
  summary: string
  period: string
  updated: string
  stats: ActivityStat[]
  days: GridDay[]
  weekCount: number
  months: Array<{ label: string, column: number }>
}

const props = defineProps<{
  locale: HomeLocale
  heading: string
}>()

function buildGrid(snapshot: ActivitySnapshot) {
  const byDate = new Map(snapshot.days.map(day => [day.date, day]))
  const start = new Date(`${snapshot.period.from}T00:00:00Z`)
  const lastSnapshotDay = snapshot.days.at(-1)?.date
  const displayEnd = snapshot.source === 'tokdash' && lastSnapshotDay
    ? lastSnapshotDay
    : snapshot.period.to
  const end = new Date(`${displayEnd}T00:00:00Z`)
  const days: GridDay[] = Array.from({ length: start.getUTCDay() }, () => ({
    date: '',
    level: 0,
    empty: true,
  }))

  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = cursor.toISOString().slice(0, 10)
    days.push(byDate.get(date) || { date, level: 0 })
  }

  const labels: Array<{ label: string, column: number }> = []
  let previousMonth = -1
  days.forEach((day, index) => {
    if (day.empty || index % 7 !== 0)
      return
    const date = new Date(`${day.date}T00:00:00Z`)
    const month = date.getUTCMonth()
    if (month === previousMonth)
      return
    previousMonth = month
    labels.push({
      label: new Intl.DateTimeFormat(props.locale === 'en' ? 'en' : 'zh-CN', {
        month: 'short',
        timeZone: 'UTC',
      }).format(date),
      column: Math.floor(index / 7) + 1,
    })
  })

  return {
    days,
    weekCount: Math.ceil(days.length / 7),
    months: labels,
  }
}

function formatTokens(value = 0) {
  if (value >= 1_000_000_000)
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (value >= 1_000)
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return value.toLocaleString()
}

const panels = computed<ActivityPanel[]>(() => {
  const github = githubActivity as ActivitySnapshot
  const tokens = tokenActivity as ActivitySnapshot
  const githubGrid = buildGrid(github)
  const tokenGrid = buildGrid(tokens)
  const updated = props.locale === 'en' ? 'Updated' : '更新于'

  const period = props.locale === 'en' ? 'Past six months' : '最近半年'
  const totalTokens = tokens.summary.totalTokens || 0
  const averageTokens = tokens.summary.averageTokensPerActiveDay || 0

  return [
    {
      id: 'token',
      label: props.locale === 'en' ? 'Token activity' : 'Token 活动',
      url: 'https://github.com/JingbiaoMei/Tokdash',
      summary: props.locale === 'en'
        ? `${formatTokens(totalTokens)} tokens across ${tokens.summary.activeDays.toLocaleString()} active days`
        : `${formatTokens(totalTokens)} Token，${tokens.summary.activeDays.toLocaleString()} 个活跃日`,
      period,
      updated: `${updated} ${tokens.generatedAt.slice(0, 10)}`,
      stats: [
        {
          label: props.locale === 'en' ? 'Total tokens' : 'Token 总量',
          value: formatTokens(totalTokens),
          primary: true,
        },
        {
          label: props.locale === 'en' ? 'Active days' : '活跃天数',
          value: tokens.summary.activeDays.toLocaleString(),
        },
        {
          label: props.locale === 'en' ? 'Avg. active day' : '活跃日均',
          value: formatTokens(averageTokens),
        },
      ],
      ...tokenGrid,
    },
    {
      id: 'github',
      label: props.locale === 'en' ? 'GitHub activity' : 'GitHub 动态',
      url: `https://github.com/${github.username || '674019130'}`,
      summary: props.locale === 'en'
        ? `${(github.summary.total || 0).toLocaleString()} contributions`
        : `${(github.summary.total || 0).toLocaleString()} 次贡献`,
      period,
      updated: `${updated} ${github.generatedAt.slice(0, 10)}`,
      stats: [
        {
          label: props.locale === 'en' ? 'Contributions' : '贡献次数',
          value: (github.summary.total || 0).toLocaleString(),
          primary: true,
        },
        {
          label: props.locale === 'en' ? 'Active days' : '活跃天数',
          value: github.summary.activeDays.toLocaleString(),
        },
      ],
      ...githubGrid,
    },
  ]
})

const tokenTierLabels = ['<100M', '100M+', '300M+', '500M+', '1B+']

function dayTitle(panel: ActivityPanel, day: GridDay) {
  if (day.empty)
    return ''
  if (panel.id === 'github' && typeof day.count === 'number') {
    return props.locale === 'en'
      ? `${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`
      : `${day.date}：${day.count} 次贡献`
  }
  if (day.level === 0) {
    return props.locale === 'en'
      ? `${day.date}: no recorded token activity`
      : `${day.date}：无 Token 活动记录`
  }

  const tier = tokenTierLabels[Math.max(0, day.level - 1)]
  return props.locale === 'en'
    ? `${day.date}: ${tier} tokens`
    : `${day.date}：${tier} Token`
}
</script>

<template>
  <section class="home-section activity-section" aria-labelledby="activity-title">
    <div class="section-heading">
      <h2 id="activity-title">
        {{ heading }}
      </h2>
    </div>

    <div class="activity-stack">
      <article v-for="panel in panels" :key="panel.id" class="activity-panel" :class="`activity-panel--${panel.id}`">
        <div class="panel-heading">
          <a :href="panel.url" target="_blank" rel="noreferrer">
            {{ panel.label }}
            <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
          </a>
          <span>{{ panel.period }}</span>
        </div>

        <div class="activity-body">
          <dl class="activity-stats">
            <div v-for="stat in panel.stats" :key="stat.label" :class="{ 'stat-primary': stat.primary }">
              <dt>{{ stat.label }}</dt>
              <dd>{{ stat.value }}</dd>
            </div>
          </dl>

          <div class="activity-visual">
            <div class="activity-scroll" role="img" :aria-label="`${panel.label}: ${panel.summary}`">
              <div class="activity-calendar" :style="{ '--activity-weeks': panel.weekCount }">
                <div class="activity-months" aria-hidden="true">
                  <span
                    v-for="month in panel.months"
                    :key="`${month.label}-${month.column}`"
                    :style="{ gridColumn: month.column }"
                  >{{ month.label }}</span>
                </div>
                <div class="activity-grid" aria-hidden="true">
                  <span
                    v-for="(day, index) in panel.days"
                    :key="day.date || `empty-${index}`"
                    class="activity-cell"
                    :class="[
                      `level-${day.level}`,
                      { 'is-empty': day.empty },
                    ]"
                    :title="dayTitle(panel, day)"
                  />
                </div>
              </div>
            </div>

            <div class="activity-meta">
              <span>{{ panel.summary }}</span>
              <span>{{ panel.updated }}</span>
            </div>

            <div v-if="panel.id === 'token'" class="token-scale" :aria-label="locale === 'en' ? 'Daily token scale' : '每日 Token 分级'">
              <span>{{ locale === 'en' ? 'Daily total' : '每日总量' }}</span>
              <span v-for="(label, index) in tokenTierLabels" :key="label" class="token-scale-item">
                <i class="scale-swatch" :class="`level-${index + 1}`" aria-hidden="true" />
                {{ label }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-section {
  padding-top: 48px;
}

.section-heading,
.panel-heading,
.activity-meta,
.token-scale,
.token-scale-item {
  display: flex;
  align-items: center;
}

.section-heading {
  min-height: 24px;
  gap: 20px;
}

.section-heading h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.activity-stack {
  margin-top: 16px;
}

.activity-panel {
  min-width: 0;
}

.activity-panel + .activity-panel {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--home-rule);
}

.panel-heading {
  justify-content: space-between;
  gap: 20px;
  min-height: 20px;
}

.panel-heading > span {
  color: var(--home-muted);
  font-size: 10px;
  line-height: 16px;
}

.panel-heading a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--home-text);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  transition: color 160ms ease;
}

.panel-heading a:hover {
  color: var(--home-muted);
}

.activity-body {
  display: grid;
  grid-template-columns: 164px minmax(0, 1fr);
  align-items: start;
  gap: 24px;
  margin-top: 12px;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
}

.activity-stats > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.activity-stats > div:nth-child(3) {
  padding-left: 12px;
  border-left: 1px solid var(--home-rule);
}

.activity-stats .stat-primary {
  grid-column: 1 / -1;
  margin-bottom: 9px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--home-rule);
}

.activity-stats dt {
  order: 2;
  color: var(--home-muted);
  font-size: 9px;
  line-height: 14px;
}

.activity-stats dd {
  order: 1;
  margin: 0 0 1px;
  color: var(--home-text);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.activity-stats .stat-primary dd {
  font-size: 20px;
  font-weight: 500;
  line-height: 26px;
}

.activity-visual {
  min-width: 0;
}

.activity-scroll {
  overflow-x: auto;
  padding: 0 2px 8px;
  scrollbar-width: none;
}

.activity-scroll::-webkit-scrollbar {
  display: none;
}

.activity-months,
.activity-grid {
  display: grid;
  grid-template-columns: repeat(var(--activity-weeks), 13px);
  column-gap: 2px;
}

.activity-months {
  height: 14px;
  color: var(--home-muted);
  font-size: 9px;
  line-height: 10px;
}

.activity-months span {
  white-space: nowrap;
}

.activity-grid {
  grid-auto-flow: column;
  grid-template-rows: repeat(7, auto);
  gap: 2px;
}

.activity-cell {
  width: 13px;
  height: 13px;
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--home-rule) 72%, transparent);
  border-radius: 1px;
  background: var(--activity-0);
}

.activity-cell.is-empty {
  border-color: transparent;
  background: transparent;
}

.activity-cell.level-1,
.scale-swatch.level-1 { background: var(--activity-1); }

.activity-cell.level-2,
.scale-swatch.level-2 { background: var(--activity-2); }

.activity-cell.level-3,
.scale-swatch.level-3 { background: var(--activity-3); }

.activity-cell.level-4,
.scale-swatch.level-4 { background: var(--activity-4); }

.activity-cell.level-5,
.scale-swatch.level-5 { background: var(--activity-5); }

.activity-meta {
  justify-content: space-between;
  gap: 16px;
  color: var(--home-muted);
  font-size: 10px;
  line-height: 16px;
}

.token-scale {
  flex-wrap: wrap;
  gap: 4px 8px;
  min-height: 20px;
  margin-top: 2px;
  color: var(--home-muted);
  font-size: 9px;
  line-height: 14px;
}

.token-scale-item {
  gap: 3px;
}

.scale-swatch {
  width: 6px;
  height: 6px;
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--home-rule) 72%, transparent);
  border-radius: 1px;
}

@media (max-width: 760px) {
  .home-section {
    padding-top: 44px;
  }

  .activity-body {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .activity-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .activity-stats .stat-primary {
    grid-column: auto;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .activity-stats > div:nth-child(2),
  .activity-stats > div:nth-child(3) {
    padding-left: 10px;
    border-left: 1px solid var(--home-rule);
  }

  .activity-stats .stat-primary dd {
    font-size: 16px;
    line-height: 22px;
  }

  .activity-months,
  .activity-grid {
    grid-template-columns: repeat(var(--activity-weeks), 11px);
    column-gap: 1px;
  }

  .activity-grid {
    gap: 1px;
  }

  .activity-cell {
    width: 11px;
    height: 11px;
  }

  .activity-meta {
    gap: 12px;
  }
}

</style>
