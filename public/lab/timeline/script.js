import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
import { copy, translations } from './content.js';
import { receiveGroupDate, buildFromEmptyEvents } from './model.js';
let language = readLocale();
saveLocale(language);
const t = (key, ...values) => values.reduce((text, value, index) => text.replace(`{${index}}`, value), copy[language][key] || key);
function tr(value) {
  if (language !== 'zh') return value;
  if (translations[value]) return translations[value];
  const date = /^(\d{2}) ([A-Za-z]{3}) (\d{4})$/.exec(value);
  const month = date && ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(date[2]) + 1;
  return month ? `${date[3]}/${String(month).padStart(2, "0")}/${date[1]}` : value;
}
// Entirely fictional garden project; no real people, organisations or records.
const PREVIEW_GROUPS = [
  {
    "id": "group-1",
    "dateLabel": "Jan\u2013Mar 2025",
    "summary": "Sketching a shared garden",
    "items": [
      {
        "id": "entry-1",
        "headline": "A first sketch sets aside space for a shared garden",
        "date": "08 Jan 2025"
      },
      {
        "id": "entry-2",
        "headline": "The plan includes four raised beds",
        "date": "22 Jan 2025"
      },
      {
        "id": "entry-3",
        "headline": "A storage shed is placed near the entrance",
        "date": "03 Feb 2025"
      },
      {
        "id": "entry-4",
        "headline": "A gravel path crosses the centre of the plot",
        "date": "17 Feb 2025"
      },
      {
        "id": "entry-5",
        "headline": "The planting list is ready for review",
        "date": "12 Mar 2025"
      }
    ]
  },
  {
    "id": "group-2",
    "dateLabel": "Jul\u2013Sep 2025",
    "summary": "Trying the first planting season",
    "items": [
      {
        "id": "entry-6",
        "headline": "The first planting day is pencilled in for July",
        "date": "04 Jul 2025"
      },
      {
        "id": "entry-7",
        "headline": "An evening watering rota is drafted",
        "date": "16 Jul 2025"
      },
      {
        "id": "entry-8",
        "headline": "Two trial beds are reserved for herbs",
        "date": "06 Aug 2025"
      },
      {
        "id": "entry-9",
        "headline": "A weekend workshop is proposed",
        "date": "21 Aug 2025"
      }
    ]
  },
  {
    "id": "group-4",
    "dateLabel": "Jan\u2013Mar 2026",
    "summary": "Planning another season",
    "items": [
      {
        "id": "entry-10",
        "headline": "The winter review collects notes from the trial",
        "date": "14 Jan 2026"
      },
      {
        "id": "entry-11",
        "headline": "A second season keeps the original layout",
        "date": "10 Feb 2026"
      },
      {
        "id": "entry-12",
        "headline": "New seed orders are prepared",
        "date": "03 Mar 2026"
      }
    ]
  }
];

const CHANGE_EVENTS = [
  {
    "type": "review_item",
    "groupId": "group-1",
    "itemId": "entry-1"
  },
  {
    "type": "change_item",
    "groupId": "group-1",
    "itemId": "entry-2",
    "item": {
      "id": "entry-2",
      "headline": "The revised plan makes room for six smaller beds",
      "date": "24 Jan 2025"
    }
  },
  {
    "type": "remove_item",
    "groupId": "group-1",
    "itemId": "entry-3"
  },
  {
    "type": "remove_item",
    "groupId": "group-1",
    "itemId": "entry-4"
  },
  {
    "type": "change_item",
    "groupId": "group-1",
    "itemId": "entry-5",
    "item": {
      "id": "entry-5",
      "headline": "The planting list adds shade-tolerant varieties",
      "date": "14 Mar 2025"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-1",
    "itemId": "entry-13",
    "item": {
      "id": "entry-13",
      "headline": "A narrow path now follows the edge of the garden",
      "date": "25 Mar 2025"
    }
  },
  {
    "type": "add_group",
    "groupId": "group-3",
    "afterGroupId": "group-1",
    "group": {
      "id": "group-3",
      "dateLabel": "Apr\u2013Jun 2025",
      "summary": "Testing soil and sunlight",
      "items": [
        {
          "id": "entry-14",
          "headline": "A soil trial identifies two areas needing compost",
          "date": "09 Apr 2025",
          "diff": "added"
        }
      ],
      "diff": "added"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-3",
    "itemId": "entry-15",
    "item": {
      "id": "entry-15",
      "headline": "Morning shade is mapped before the beds are built",
      "date": "07 May 2025"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-3",
    "itemId": "entry-16",
    "item": {
      "id": "entry-16",
      "headline": "A rainwater barrel is added beside the tool shelf",
      "date": "18 Jun 2025"
    }
  },
  {
    "type": "review_item",
    "groupId": "group-2",
    "itemId": "entry-6"
  },
  {
    "type": "change_item",
    "groupId": "group-2",
    "itemId": "entry-7",
    "item": {
      "id": "entry-7",
      "headline": "The watering rota moves to early mornings",
      "date": "18 Jul 2025"
    }
  },
  {
    "type": "remove_item",
    "groupId": "group-2",
    "itemId": "entry-8"
  },
  {
    "type": "remove_item",
    "groupId": "group-2",
    "itemId": "entry-9"
  },
  {
    "type": "add_item",
    "groupId": "group-2",
    "itemId": "entry-17",
    "item": {
      "id": "entry-17",
      "headline": "Herbs move into smaller pots along the path",
      "date": "15 Aug 2025"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-2",
    "itemId": "entry-18",
    "item": {
      "id": "entry-18",
      "headline": "A short open-garden afternoon replaces the workshop",
      "date": "06 Sep 2025"
    }
  },
  {
    "type": "add_group",
    "groupId": "group-5",
    "afterGroupId": "group-2",
    "group": {
      "id": "group-5",
      "dateLabel": "Oct\u2013Dec 2025",
      "summary": "Learning from the first harvest",
      "items": [
        {
          "id": "entry-19",
          "headline": "A harvest notebook records what grew well",
          "date": "11 Oct 2025",
          "diff": "added"
        }
      ],
      "diff": "added"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-5",
    "itemId": "entry-20",
    "item": {
      "id": "entry-20",
      "headline": "Fallen leaves become mulch for the winter beds",
      "date": "05 Nov 2025"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-5",
    "itemId": "entry-21",
    "item": {
      "id": "entry-21",
      "headline": "The tool shelf gains a weatherproof cover",
      "date": "02 Dec 2025"
    }
  },
  {
    "type": "review_item",
    "groupId": "group-4",
    "itemId": "entry-10"
  },
  {
    "type": "change_item",
    "groupId": "group-4",
    "itemId": "entry-11",
    "item": {
      "id": "entry-11",
      "headline": "The second season gives climbing plants their own bed",
      "date": "13 Feb 2026"
    }
  },
  {
    "type": "change_item",
    "groupId": "group-4",
    "itemId": "entry-12",
    "item": {
      "id": "entry-12",
      "headline": "Seed orders favour varieties that handled the shade",
      "date": "09 Mar 2026"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-4",
    "itemId": "entry-22",
    "item": {
      "id": "entry-22",
      "headline": "The new planting calendar is shared with the group",
      "date": "20 Mar 2026"
    }
  },
  {
    "type": "add_item",
    "groupId": "group-4",
    "itemId": "entry-23",
    "item": {
      "id": "entry-23",
      "headline": "A small seed exchange is set for the next open day",
      "date": "28 Mar 2026"
    }
  },
  {
    "type": "review_item",
    "groupId": "group-4",
    "itemId": "entry-23"
  }
];

const timelineList = document.querySelector("#timelineList");
const replayButton = document.querySelector("#replayButton");
const resetButton = document.querySelector("#resetButton");
const speedSelect = document.querySelector("#speedSelect");
const statusText = document.querySelector("#statusText");
const statusDot = document.querySelector("#statusDot");
const modeLabel = document.querySelector("#modeLabel");

let groups = [];
let playbackToken = 0;
let removedRun = [];
const scenarioControls = document.querySelector('.scenario-control');
const requestedScenario = new URLSearchParams(location.search).get('scenario');
let scenario = ['edits', 'regroup', 'empty'].includes(requestedScenario) ? requestedScenario : 'edits';
const emptyEvents = buildFromEmptyEvents(PREVIEW_GROUPS);
let status = { key: 'ready', state: '', values: [] };
const regroupEvents = [
  { type: 'add_group', groupId: 'late-spring', group: { id: 'late-spring', dateLabel: 'Date pending', summary: 'Testing soil and sunlight', diff: 'added', pending: true, items: [{ id: 'late-1', headline: 'A soil trial identifies two areas needing compost', date: 'Just received', diff: 'added' }] } },
  { type: 'group_date', groupId: 'late-spring', sortDate: '2025-04-09', dateLabel: 'Apr–Jun 2025', date: '09 Apr 2025' },
  { type: 'add_item', groupId: 'late-spring', itemId: 'late-2', item: { id: 'late-2', headline: 'Morning shade is mapped before the beds are built', date: '07 May 2025' } },
];
function initialGroups() {
  if (scenario === 'empty') return [];
  if (scenario !== 'regroup') return PREVIEW_GROUPS;
  return PREVIEW_GROUPS.map((group, index) => ({ ...group,
    sortDate: ['2025-01-08', '2025-07-04', '2026-01-14'][index], items: [group.items[0]],
  }));
}

function cloneGroups(value) {
  return value.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item })),
  }));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function diffTag(diff) {
  if (!diff) return "";
  return `<span class="diff-tag ${diff}">${escapeHtml(t(diff))}</span>`;
}

function rowHtml(item) {
  const diff = item.diff || "";
  return `<li class="timeline-row" data-item-id="${escapeHtml(item.id)}" data-diff="${escapeHtml(diff)}">
    <span class="row-marker" aria-hidden="true"></span>
    <span class="row-copy"><span class="row-headline diff-field">${escapeHtml(tr(item.headline))}</span>${diffTag(diff)}</span>
    <time class="row-date diff-field">${escapeHtml(tr(item.date))}</time>
  </li>`;
}

function removedClusterHtml(cluster) {
  const controlId = `removed-${cluster.id}`;
  const label = t("removedCount", cluster.items.length);
  return `<li class="removed-cluster" data-cluster-id="${escapeHtml(cluster.id)}" data-expanded="false">
    <button class="removed-cluster-toggle" type="button" aria-expanded="false" aria-controls="${controlId}">
      <span class="row-marker" aria-hidden="true"></span>
      <span class="removed-cluster-label">${label}${diffTag("removed")}</span>
      <span class="removed-cluster-action">${t("show")}</span>
    </button>
    <div class="removed-cluster-content" id="${controlId}" aria-hidden="true" inert>
      <div><ul class="removed-cluster-items">${cluster.items.map(rowHtml).join("")}</ul></div>
    </div>
  </li>`;
}

function groupHtml(group) {
  const rows = group.rows || group.items;
  return `<section class="timeline-group" data-group-id="${escapeHtml(group.id)}" data-diff="${escapeHtml(group.diff || "")}">
    <span class="timeline-group-dot" aria-hidden="true"></span>
    <div class="timeline-group-head">
      <span class="timeline-date">${escapeHtml(tr(group.dateLabel))}</span>
      <span class="timeline-summary">${escapeHtml(tr(group.summary))}</span>
      ${group.diff ? diffTag(group.diff) : ""}${group.pending ? `<span class="position-state">${t("pending")}</span>` : group.moved ? `<span class="position-state is-sorted">↥ ${t("moved")}</span>` : ""}
    </div>
    <ul class="timeline-items">
      ${rows.map((row) => row.type === "cluster" ? removedClusterHtml(row) : rowHtml(row)).join("")}
    </ul>
  </section>`;
}

function render() {
  const expanded = [...timelineList.querySelectorAll('[data-expanded="true"]')].map(node => node.dataset.clusterId);
  const focused = document.activeElement?.closest('.removed-cluster')?.dataset.clusterId;
  timelineList.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
  timelineList.dataset.empty = String(!groups.length);
  timelineList.innerHTML = groups.length ? groups.map(groupHtml).join("")
    : `<div class="timeline-empty"><span class="empty-mark" aria-hidden="true"></span><div><strong>${t('emptyReady')}</strong><p class="empty-prompt"></p></div></div>`;
  for (const id of expanded) {
    const node = timelineList.querySelector(`[data-cluster-id="${CSS.escape(id)}"]`);
    if (node) setExpanded(node, true);
  }
  if (focused) timelineList.querySelector(`[data-cluster-id="${CSS.escape(focused)}"] button`)?.focus({ preventScroll: true });
}
function paintStatus() {
  statusText.textContent = t(status.key, ...status.values);
  const state = status.state;
  const emptyPrompt = timelineList.querySelector('.empty-prompt');
  if (emptyPrompt) emptyPrompt.textContent = t(state === 'running' ? 'emptyWaiting' : 'emptyPrompt');
  statusDot.className = `status-dot${state ? ` is-${state}` : ""}`;
  modeLabel.className = `mode-label${state === "running" ? " is-running" : state === "complete" ? " is-complete" : ""}`;
  modeLabel.textContent = t(state === 'running' ? 'running' : state === 'complete' ? 'complete' : 'preview');
}
function updateStatus(key, state = "", ...values) {
  status = { key, state, values }; paintStatus();
}
function localize() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t('title')} · Su UI lab`;
  document.querySelector('meta[name="description"]').content = t('intro');
  document.querySelectorAll('[data-copy]').forEach(node => { node.textContent = t(node.dataset.copy); });
  document.querySelector('.sample-note').textContent = t(scenario === 'empty' ? 'emptySample' : scenario === 'regroup' ? 'regroupSample' : 'sample');
  document.querySelector('#scenarioHint').textContent = t(scenario === 'empty' ? 'emptyHint' : scenario === 'regroup' ? 'hint' : 'editsHint');
  scenarioControls.querySelectorAll('input').forEach(input => { input.checked = input.value === scenario; });
  document.querySelector('#language').textContent = language === 'zh' ? 'EN' : '中';
  document.querySelector('#language').setAttribute('aria-label', t('language'));
  document.querySelector('.lab-nav').setAttribute('aria-label', language === 'zh' ? '导航' : 'Breadcrumb');
  document.querySelector('.playback-bar').setAttribute('aria-label', language === 'zh' ? '播放控制' : 'Playback controls');
  document.querySelector('.legend').setAttribute('aria-label', language === 'zh' ? '变化图例' : 'Diff legend');
  render(); paintStatus();
}

function reset() {
  playbackToken += 1;
  removedRun = [];
  groups = cloneGroups(initialGroups()).map((group) => ({ ...group, rows: group.items }));
  render();
  updateStatus("ready");
  replayButton.disabled = false;
  resetButton.disabled = false;
}

function wait(milliseconds, token) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(token === playbackToken), milliseconds);
  });
}

function playbackDelay(base) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  // Local-only slow motion for inspecting intermediate frames, never a public setting.
  const qaScale = ['localhost', '127.0.0.1'].includes(location.hostname)
    ? Math.max(1, Math.min(8, Number(new URLSearchParams(location.search).get('motion')) || 1)) : 1;
  return Math.round(base * Number(speedSelect.value || 1) * qaScale);
}

function groupById(groupId) {
  return groups.find((group) => group.id === groupId);
}

function rowElement(groupId, itemId) {
  return timelineList.querySelector(
    `[data-group-id="${CSS.escape(groupId)}"] [data-item-id="${CSS.escape(itemId)}"]`,
  );
}

function animateClass(element, className) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function layoutSnapshot() {
  const positions = new Map();
  timelineList.querySelectorAll(".timeline-group").forEach((element) => {
    positions.set(element.dataset.groupId, element.getBoundingClientRect().top);
  });
  return positions;
}

function animateLayout(previousPositions, movingId = '') {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Batch every layout read before the first animation write.
  const entries = [...timelineList.querySelectorAll('.timeline-group')].map(element => ({ element, top: element.getBoundingClientRect().top }));
  for (const { element, top } of entries) {
    const previousTop = previousPositions.get(element.dataset.groupId);
    if (previousTop === undefined) continue;
    const offset = previousTop - top;
    if (Math.abs(offset) < 1) continue;
    const moving = element.dataset.groupId === movingId;
    const frames = moving ? [
      { transform: `translate(0, ${offset}px)`, offset: 0 },
      { transform: `translate(12px, ${offset * .7}px)`, offset: .25 },
      { transform: 'translate(0, 0)', offset: 1 },
    ] : [{ transform: `translateY(${offset}px)` }, { transform: 'translateY(0)' }];
    element.animate(frames, { duration: playbackDelay(movingId ? 640 : 180), easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}

async function receiveDate(event, token) {
  const group = groupById(event.groupId);
  const previous = layoutSnapshot();
  groups = receiveGroupDate(groups, event.groupId, event.sortDate);
  if (group?.sortDate !== event.sortDate) return true;
  group.dateLabel = event.dateLabel;
  group.rows[0].date = event.date;
  group.pending = false;
  group.moved = true;
  const node = timelineList.querySelector(`[data-group-id="${CSS.escape(group.id)}"]`);
  node.classList.remove('is-arriving');
  node.querySelector('.timeline-date').textContent = tr(group.dateLabel);
  node.querySelector('.row-date').textContent = tr(event.date);
  const badge = node.querySelector('.position-state');
  badge.textContent = `↥ ${t('moved')}`;
  badge.classList.add('is-sorted');
  node.classList.add('is-reordering');
  const orderedNodes = groups.map(group => timelineList.querySelector(`[data-group-id="${CSS.escape(group.id)}"]`));
  timelineList.append(...orderedNodes);
  updateStatus('correcting', 'running');
  animateLayout(previous, group.id);
  if (!(await wait(playbackDelay(640), token))) return false;
  node.classList.remove('is-reordering');
  return wait(playbackDelay(500), token);
}

function nextEventContinuesRemoval(event) {
  const last = removedRun.at(-1);
  return Boolean(
    last
      && event?.type === "remove_item"
      && event.groupId === last.groupId
      && event.itemId !== last.itemId,
  );
}

async function collapseRemovedRun(token) {
  if (removedRun.length < 2) {
    removedRun = [];
    return token === playbackToken;
  }

  const run = removedRun;
  removedRun = [];
  const group = groupById(run[0].groupId);
  if (!group) return token === playbackToken;

  const itemIds = new Set(run.map((entry) => entry.itemId));
  const removedItems = group.rows.filter((row) => row.type !== "cluster" && itemIds.has(row.id));
  const firstIndex = group.rows.findIndex((row) => row.type !== "cluster" && row.id === run[0].itemId);
  const rowElements = run.map((entry) => rowElement(entry.groupId, entry.itemId)).filter(Boolean);
  rowElements.forEach((element) => element.classList.add("is-collapsing"));
  if (!(await wait(playbackDelay(180), token))) return false;

  const previousPositions = layoutSnapshot();
  group.rows = group.rows.filter((row) => row.type === "cluster" || !itemIds.has(row.id));
  const cluster = {
    type: "cluster",
    id: `${group.id}-${run[0].itemId}-${run.at(-1).itemId}`,
    items: removedItems,
  };
  group.rows.splice(Math.max(firstIndex, 0), 0, cluster);
  render();
  animateLayout(previousPositions);
  const clusterElement = timelineList.querySelector(`[data-cluster-id="${CSS.escape(cluster.id)}"]`);
  animateClass(clusterElement, "is-arriving");
  return wait(playbackDelay(170), token);
}

async function applyEvent(event, token) {
  const group = groupById(event.groupId);
  if (event.type !== "add_group" && !group) return true;

  if (event.type === "group_date") return receiveDate(event, token);

  if (event.type === "review_item") {
    animateClass(rowElement(event.groupId, event.itemId), "is-reviewing");
    return wait(playbackDelay(230), token);
  }

  if (event.type === "change_item") {
    const row = group.rows.find((entry) => entry.id === event.itemId);
    if (row) Object.assign(row, event.item, { diff: "changed" });
    render();
    animateClass(rowElement(event.groupId, event.itemId), "is-changing");
    return wait(playbackDelay(320), token);
  }

  if (event.type === "remove_item") {
    const row = group.rows.find((entry) => entry.id === event.itemId);
    if (row) row.diff = "removed";
    removedRun.push(event);
    render();
    animateClass(rowElement(event.groupId, event.itemId), "is-removing");
    return wait(playbackDelay(280), token);
  }

  if (event.type === "add_item") {
    group.rows.push({ ...event.item, diff: "added" });
    render();
    animateClass(rowElement(event.groupId, event.item.id), "is-arriving");
    return wait(playbackDelay(scenario === 'empty' ? 650 : 360), token);
  }

  if (event.type === "add_group") {
    const previousPositions = layoutSnapshot();
    const afterIndex = groups.findIndex((entry) => entry.id === event.afterGroupId);
    const insertAt = afterIndex >= 0 ? afterIndex + 1 : groups.length;
    const nextGroup = {
      ...event.group,
      rows: event.group.items.map((item) => ({ ...item })),
    };
    groups.splice(insertAt, 0, nextGroup);
    render();
    animateLayout(previousPositions);
    const groupElement = timelineList.querySelector(`[data-group-id="${CSS.escape(event.groupId)}"]`);
    animateClass(groupElement, "is-arriving");
    return wait(playbackDelay(scenario === 'empty' ? 750 : scenario === 'regroup' ? 1100 : 420), token);
  }

  return true;
}

async function replay() {
  reset();
  const token = playbackToken;
  replayButton.disabled = true;
  resetButton.disabled = false;
  updateStatus(scenario === "empty" ? "emptyWaiting" : "reviewing", "running");
  if (!(await wait(playbackDelay(scenario === 'empty' ? 900 : 260), token))) return;

  const events = scenario === 'empty' ? emptyEvents : scenario === 'regroup' ? regroupEvents : CHANGE_EVENTS;
  for (const [index, event] of events.entries()) {
    if (scenario === 'empty') updateStatus(event.type === 'add_group' ? 'groupArriving' : 'itemArriving', 'running', event.groupNumber);
    else if (scenario === 'regroup') updateStatus(index === 0 ? 'arrival' : index === 1 ? 'correcting' : 'continuing', 'running');
    else updateStatus('progress', 'running', index + 1, events.length);
    if (removedRun.length && !nextEventContinuesRemoval(event)) {
      if (!(await collapseRemovedRun(token))) return;
    }
    if (!(await applyEvent(event, token))) return;
  }

  if (removedRun.length && !(await collapseRemovedRun(token))) return;
  updateStatus(scenario === 'empty' ? 'emptyDone' : scenario === 'regroup' ? 'ordered' : 'done', 'complete');
  replayButton.disabled = false;
}

function setExpanded(cluster, expanded) {
  const toggle = cluster.querySelector('.removed-cluster-toggle');
  const content = cluster.querySelector('.removed-cluster-content');
  cluster.dataset.expanded = String(expanded);
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.querySelector('.removed-cluster-action').textContent = t(expanded ? 'hide' : 'show');
  content.setAttribute('aria-hidden', String(!expanded));
  content.inert = !expanded;
}
timelineList.addEventListener('click', event => {
  const cluster = event.target.closest('.removed-cluster-toggle')?.closest('.removed-cluster');
  if (cluster) setExpanded(cluster, cluster.dataset.expanded !== 'true');
});
scenarioControls.addEventListener('change', event => {
  if (!event.target.matches('input[name="scenario"]')) return;
  scenario = event.target.value;
  const url = new URL(location.href); url.searchParams.set('scenario', scenario);
  history.replaceState(history.state, '', url);
  reset(); localize();
});
document.querySelector('#language').addEventListener('click', () => {
  language = language === 'zh' ? 'en' : 'zh'; saveLocale(language); localize();
});
followLocale(next => { if (next !== language) { language = next; localize(); } });
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
  if (event.matches) timelineList.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
});

replayButton.addEventListener("click", replay);
resetButton.addEventListener("click", reset);
reset();
localize();


// The lab hover mounts this document only while the entry is being previewed.
if (document.documentElement.dataset.preview === "true") {
  const still = new URLSearchParams(location.search).get("still") === "1"
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still) {
    async function previewLoop() {
      await new Promise(resolve => setTimeout(resolve, 350));
      await replay();
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!document.hidden) previewLoop();
    }
    previewLoop();
  }
}
