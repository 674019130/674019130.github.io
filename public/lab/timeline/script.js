const PREVIEW_GROUPS = [
  {
    id: "group-1",
    dateLabel: "Jan–Mar 2025",
    summary: "Proposal enters public review",
    items: [
      { id: "article-1", headline: "Draft terms open for public consultation", date: "12 Jan 2025" },
      { id: "article-2", headline: "Committee schedules its first review session", date: "04 Feb 2025" },
      { id: "article-3", headline: "Early market response remains cautious", date: "18 Feb 2025" },
      { id: "article-4", headline: "Second consultation round is announced", date: "08 Mar 2025" },
    ],
  },
  {
    id: "group-2",
    dateLabel: "Jul–Sep 2025",
    summary: "Revised framework moves forward",
    items: [
      { id: "article-6", headline: "Revised framework receives final committee support", date: "21 Jul 2025" },
      { id: "article-7", headline: "Implementation timetable is published", date: "03 Sep 2025" },
    ],
  },
];

const CHANGE_EVENTS = [
  { type: "review_item", groupId: "group-1", itemId: "article-1" },
  {
    type: "change_item",
    groupId: "group-1",
    itemId: "article-2",
    item: {
      id: "article-2",
      headline: "Committee expands review after receiving new evidence",
      date: "06 Feb 2025",
    },
  },
  { type: "remove_item", groupId: "group-1", itemId: "article-3" },
  { type: "remove_item", groupId: "group-1", itemId: "article-4" },
  {
    type: "add_item",
    groupId: "group-1",
    item: {
      id: "article-5",
      headline: "Updated evidence changes the shape of the proposal",
      date: "26 Mar 2025",
    },
  },
  {
    type: "add_group",
    groupId: "group-3",
    afterGroupId: "group-1",
    group: {
      id: "group-3",
      dateLabel: "Apr–Jun 2025",
      summary: "New evidence creates an intermediate phase",
      items: [
        {
          id: "article-8",
          headline: "Independent assessment prompts a mid-year revision",
          date: "19 May 2025",
          diff: "added",
        },
      ],
      diff: "added",
    },
  },
  { type: "review_item", groupId: "group-2", itemId: "article-6" },
  {
    type: "add_item",
    groupId: "group-2",
    item: {
      id: "article-9",
      headline: "Delivery teams publish the first implementation update",
      date: "26 Sep 2025",
    },
  },
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
  return `<span class="diff-tag ${diff}">${escapeHtml(diff)}</span>`;
}

function rowHtml(item) {
  const diff = item.diff || "";
  return `<li class="timeline-row" data-item-id="${escapeHtml(item.id)}" data-diff="${escapeHtml(diff)}">
    <span class="row-marker" aria-hidden="true"></span>
    <span class="row-copy"><span class="row-headline diff-field">${escapeHtml(item.headline)}</span>${diffTag(diff)}</span>
    <time class="row-date diff-field">${escapeHtml(item.date)}</time>
  </li>`;
}

function removedClusterHtml(cluster) {
  const controlId = `removed-${cluster.id}`;
  const label = `${cluster.items.length} removed articles`;
  return `<li class="removed-cluster" data-cluster-id="${escapeHtml(cluster.id)}" data-expanded="false">
    <button class="removed-cluster-toggle" type="button" aria-expanded="false" aria-controls="${controlId}">
      <span class="row-marker" aria-hidden="true"></span>
      <span class="removed-cluster-label">${label}${diffTag("removed")}</span>
      <span class="removed-cluster-action">Show</span>
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
      <span class="timeline-date">${escapeHtml(group.dateLabel)}</span>
      <span class="timeline-summary">${escapeHtml(group.summary)}</span>
      ${group.diff ? diffTag(group.diff) : ""}
    </div>
    <ul class="timeline-items">
      ${rows.map((row) => row.type === "cluster" ? removedClusterHtml(row) : rowHtml(row)).join("")}
    </ul>
  </section>`;
}

function render() {
  timelineList.innerHTML = groups.map(groupHtml).join("");
}

function updateStatus(text, state = "") {
  statusText.textContent = text;
  statusDot.className = `status-dot${state ? ` is-${state}` : ""}`;
  modeLabel.className = `mode-label${state === "running" ? " is-running" : state === "complete" ? " is-complete" : ""}`;
  modeLabel.textContent = state === "running" ? "Updating" : state === "complete" ? "Updated" : "Preview";
}

function reset() {
  playbackToken += 1;
  removedRun = [];
  groups = cloneGroups(PREVIEW_GROUPS).map((group) => ({ ...group, rows: group.items }));
  render();
  updateStatus("Preview ready");
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
  return Math.round(base * Number(speedSelect.value || 1));
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

function animateLayout(previousPositions) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timelineList.querySelectorAll(".timeline-group").forEach((element) => {
    const previousTop = previousPositions.get(element.dataset.groupId);
    if (previousTop === undefined) return;
    const offset = previousTop - element.getBoundingClientRect().top;
    if (Math.abs(offset) < 1) return;
    element.animate(
      [{ transform: `translateY(${offset}px)` }, { transform: "translateY(0)" }],
      { duration: 180, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  });
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
    return wait(playbackDelay(360), token);
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
    return wait(playbackDelay(420), token);
  }

  return true;
}

async function replay() {
  reset();
  const token = playbackToken;
  replayButton.disabled = true;
  resetButton.disabled = false;
  updateStatus("Reviewing timeline changes", "running");
  if (!(await wait(playbackDelay(260), token))) return;

  for (const event of CHANGE_EVENTS) {
    if (removedRun.length && !nextEventContinuesRemoval(event)) {
      if (!(await collapseRemovedRun(token))) return;
    }
    if (!(await applyEvent(event, token))) return;
  }

  if (removedRun.length && !(await collapseRemovedRun(token))) return;
  updateStatus("Timeline update complete", "complete");
  replayButton.disabled = false;
}

timelineList.addEventListener("click", (event) => {
  const toggle = event.target.closest(".removed-cluster-toggle");
  if (!toggle) return;
  const cluster = toggle.closest(".removed-cluster");
  const content = cluster?.querySelector(".removed-cluster-content");
  if (!cluster || !content) return;
  const expanded = cluster.dataset.expanded !== "true";
  cluster.dataset.expanded = String(expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  toggle.querySelector(".removed-cluster-action").textContent = expanded ? "Hide" : "Show";
  content.setAttribute("aria-hidden", String(!expanded));
  if (expanded) content.removeAttribute("inert");
  else content.setAttribute("inert", "");
});

replayButton.addEventListener("click", replay);
resetButton.addEventListener("click", reset);
reset();

