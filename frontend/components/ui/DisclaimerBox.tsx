/**
 * Standard research-use disclaimer for the medical model pages. Lang-aware (reads the
 * `lang` cookie via getLang) and intentionally explicit, since these are sensitive
 * medical tools. Server component only — do not import from a client component.
 *
 * `note` is an optional model-specific line appended below the standard statement.
 */
import { getDict, getLang } from '@/lib/getLang';

export function DisclaimerBox({ note }: { note?: string }) {
  const dz = getDict(getLang()).disclaimer;
  return (
    <div
      role="note"
      className="rounded-card border border-blue-100 bg-blue-50/60 p-4 text-sm text-ink-secondary"
    >
      <p className="mb-1 font-semibold text-info">{dz.heading}</p>
      <p>{dz.lead}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {dz.points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      {note && <p className="mt-2 border-t border-blue-100 pt-2">{note}</p>}
    </div>
  );
}
