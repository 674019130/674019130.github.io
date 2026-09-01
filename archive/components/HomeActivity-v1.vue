<!-- Archived: superseded by the bilingual monochrome activity calendar. -->
<script setup lang="ts">
import activity from '../data/activity.json'
import { computed } from 'vue'

interface ActivityDay {
  date: string
  count?: number
  level: number
}

interface GridDay extends ActivityDay {
  empty?: boolean
}

const sourceLabel = computed(() => activity.source === 'tokdash' ? 'Tokdash activity' : 'GitHub activity')
const sourceUrl = computed(() => activity.source === 'github' && activity.username
  ? `https://github.com/${activity.username}`
  : undefined)

const gridDays = computed<GridDay[]>(() => {
  const byDate = new Map((activity.days as ActivityDay[]).map(day => [day.date, day]))
  const start = new Date(`${activity.period.from}T00:00:00Z`)
  const end = new Date(`${activity.period.to}T00:00:00Z`)
  const days: GridDay[] = Array.from({ length: start.getUTCDay() }, () => ({
    date: '',
    level: 0,
    empty: true,
  }))

  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = cursor.toISOString().slice(0, 10)
    days.push(byDate.get(date) || { date, level: 0 })
  }

  return days
})

const weekCount = computed(() => Math.ceil(gridDays.value.length / 7))
const monthLabels = computed(() => {
  const labels: Array<{ label: string, column: number }> = []
  let previousMonth = -1

  gridDays.value.forEach((day, index) => {
    if (day.empty || index % 7 !== 0)
      return
    const month = new Date(`${day.date}T00:00:00Z`).getUTCMonth()
    if (month === previousMonth)
      return
    previousMonth = month
    labels.push({
      label: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(`${day.date}T00:00:00Z`)),
      column: Math.floor(index / 7) + 1,
    })
  })

  return labels
})

const summary = computed(() => {
  if (activity.source === 'github' && 'total' in activity.summary)
    return `${activity.summary.total.toLocaleString()} contributions in the last year`
  return `${activity.summary.activeDays.toLocaleString()} active days in the last year`
})

function dayTitle(day: GridDay) {
  if (day.empty)
    return ''
  if (typeof day.count === 'number')
    return `${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`
  return `${day.date}: activity level ${day.level}`
}
</script>

<template>
  <section class="home-section activity-section" aria-labelledby="activity-title">
    <div class="section-heading">
      <div>
        <p class="section-kicker">
          SIGNAL / 01
        </p>
        <h2 id="activity-title">
          Activity
        </h2>
      </div>
      <a
        v-if="sourceUrl"
        class="section-link"
        :href="sourceUrl"
        target="_blank"
        rel="noreferrer"
      >
        {{ sourceLabel }}
        <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
      </a>
      <span v-else class="section-link section-link--static">{{ sourceLabel }}</span>
    </div>

    <div class="activity-scroll" role="img" :aria-label="summary">
      <div class="activity-calendar" :style="{ '--activity-weeks': weekCount }">
        <div class="activity-months" aria-hidden="true">
          <span
            v-for="month in monthLabels"
            :key="`${month.label}-${month.column}`"
            :style="{ gridColumn: month.column }"
          >{{ month.label }}</span>
        </div>
        <div class="activity-grid" aria-hidden="true">
          <span
            v-for="(day, index) in gridDays"
            :key="day.date || `empty-${index}`"
            class="activity-cell"
            :class="[`level-${day.level}`, { 'is-empty': day.empty }]"
            :title="dayTitle(day)"
          />
        </div>
      </div>
    </div>

    <div class="activity-meta">
      <span>{{ summary }}</span>
      <span>Updated {{ activity.generatedAt.slice(0, 10) }}</span>
    </div>
  </section>
</template>

<style scoped>
.home-section {
  padding: 70px 0 0;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.section-heading h2 {
  margin: 5px 0 0;
  font-size: 21px;
  font-weight: 650;
  line-height: 1.3;
}

.section-kicker {
  margin: 0;
  color: var(--home-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--home-muted);
  font-size: 13px;
  text-decoration: none;
  transition: color 180ms ease;
}

.section-link:hover {
  color: var(--home-accent);
}

.activity-scroll {
  margin: 24px -2px 0;
  overflow-x: auto;
  padding: 0 2px 8px;
  scrollbar-width: thin;
}

.activity-calendar {
  --activity-cell: 10px;
  --activity-gap: 3px;

  min-width: calc(var(--activity-weeks) * (var(--activity-cell) + var(--activity-gap)) - var(--activity-gap));
}

.activity-months,
.activity-grid {
  display: grid;
  grid-template-columns: repeat(var(--activity-weeks), var(--activity-cell));
  column-gap: var(--activity-gap);
}

.activity-months {
  height: 18px;
  color: var(--home-muted);
  font-size: 11px;
  line-height: 1;
}

.activity-months span {
  white-space: nowrap;
}

.activity-grid {
  grid-auto-flow: column;
  grid-template-rows: repeat(7, var(--activity-cell));
  gap: var(--activity-gap);
}

.activity-cell {
  width: var(--activity-cell);
  height: var(--activity-cell);
  border: 1px solid color-mix(in srgb, var(--home-rule) 76%, transparent);
  border-radius: 2px;
  background: var(--activity-0);
}

.activity-cell.is-empty {
  border-color: transparent;
  background: transparent;
}

.activity-cell.level-1 { background: var(--activity-1); }
.activity-cell.level-2 { background: var(--activity-2); }
.activity-cell.level-3 { background: var(--activity-3); }
.activity-cell.level-4 { background: var(--activity-4); }

.activity-meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--home-muted);
  font-size: 12px;
}

@media (max-width: 640px) {
  .home-section {
    padding-top: 58px;
  }

  .activity-scroll {
    margin-right: -20px;
    padding-right: 20px;
  }

  .activity-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
