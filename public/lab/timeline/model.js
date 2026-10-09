// Known ISO dates sort oldest first. Undated groups retain arrival order at the end.
export function chronologicalGroups(groups) {
  return [...groups].sort((a, b) => {
    const left = a.sortDate || '9999-12-31';
    const right = b.sortDate || '9999-12-31';
    return left < right ? -1 : left > right ? 1 : 0;
  });
}

export function receiveGroupDate(groups, id, sortDate) {
  // Reject malformed dates without displacing a group using incomplete metadata.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sortDate || '') || !Number.isFinite(Date.parse(sortDate))
    || new Date(sortDate).toISOString().slice(0, 10) !== sortDate) return groups;
  const group = groups.find(group => group.id === id);
  if (!group) return groups;
  group.sortDate = sortDate;
  return chronologicalGroups(groups);
}

// Stream a header before its items, without mutating the source fixture.
export function buildFromEmptyEvents(sourceGroups, lateEvents = []) {
  const initialEvents = sourceGroups.flatMap((group, index) => [
    { type: 'add_group', groupId: group.id, groupNumber: index + 1,
      group: { ...group, items: [], diff: 'added' } },
    ...group.items.slice(0, 2).map(item => ({ type: 'add_item', groupId: group.id,
      groupNumber: index + 1, itemId: item.id, item: { ...item } })),
  ]);
  return [...initialEvents, ...structuredClone(lateEvents)];
}
