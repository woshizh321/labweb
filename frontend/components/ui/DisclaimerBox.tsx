/**
 * Standard research-use disclaimer for all medical model pages.
 * Bilingual (EN + ZH). Calm, non-alarming styling — informational, not a warning banner.
 */
const EN =
  'This tool is intended for research and educational use only. It is not a substitute for professional medical judgment, diagnosis, or treatment.';
const ZH =
  '本工具仅用于科研和教学展示，不构成临床诊断、治疗建议或个体化医疗决策依据。';

export function DisclaimerBox({ custom }: { custom?: string }) {
  return (
    <div
      role="note"
      className="rounded-card border border-blue-100 bg-blue-50/60 p-4 text-sm text-ink-secondary"
    >
      <p className="mb-1 font-semibold text-info">Research-use disclaimer / 研究用途声明</p>
      <p>{custom ?? EN}</p>
      {!custom && <p className="mt-1">{ZH}</p>}
    </div>
  );
}
