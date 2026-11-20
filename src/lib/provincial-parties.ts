import candidatures from '../../content/generated-provincial/congress.json' with { type: 'json' };

export function provincialPartyEntries(
  provinceId: string,
  programmes: { href: string; disabled?: boolean }[],
  topicId?: string,
) {
  return (
    candidatures.provinces.find((province) => province.id === provinceId)
      ?.parties ?? []
  ).map((entry) => {
    const destination = `/parties/${entry.programmeId}${topicId ? `/${topicId}` : ''}`;
    const programme = entry.programmeId
      ? programmes.find((party) => party.href === destination)
      : undefined;
    return {
      id: entry.id,
      label: entry.label,
      href: programme?.href ?? '',
      disabled: !programme || programme.disabled === true,
    };
  });
}
