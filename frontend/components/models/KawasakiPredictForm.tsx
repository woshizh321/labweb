'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  KAWASAKI_FIELDS,
  KAWASAKI_GROUP_ORDER,
  KAWASAKI_GROUP_LABEL,
  KAWASAKI_SYNTHETIC_EXAMPLE,
  type KawasakiField,
  type GroupKey,
} from '@/lib/kawasakiFields';

type Lang = 'zh' | 'en';

interface PredictResult {
  model_version: string;
  probability: number;
  threshold_used: number;
  risk_label: 'higher_risk' | 'lower_risk';
  risk_band: 'high' | 'elevated' | 'low';
  n_provided: number;
  n_features: number;
  completeness: number;
  disclaimer: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

const T = {
  zh: {
    intro:
      '输入首次 IVIG 治疗前的去标识临床变量（共 44 项），估计 IVIG 无应答风险。所有字段均可留空，缺失值由锁定模型按训练集规则插补。',
    importHint: '变量较多？可上传单个患儿的表格快速导入，自动填入下方表单，核对后再计算。',
    importBtn: '上传 Excel / CSV 导入',
    importTemplate: '下载导入模板',
    importOk: (n: number) => `已导入 ${n} 项，请核对后再计算。`,
    importErr: '导入失败：请使用下载的模板，并确认文件为 .xlsx 或 .csv。',
    importNote: '请勿在表格中填写姓名、住院号等可识别信息；此类列会被忽略。',
    missing: '—（缺失）',
    no: '否 / 0',
    yes: '是 / 1',
    predict: '计算风险',
    loading: '计算中…',
    example: '填入合成示例',
    reset: '清空',
    resultTitle: '预测结果',
    probLabel: '模型估计的 IVIG 无应答概率',
    probSub: '模型估计值，非确诊概率',
    scaleThreshold: '预警阈值',
    scaleYou: '该患儿',
    stratTitle: '风险分层',
    higher_risk: '超过预警阈值 · 建议加强监测',
    lower_risk: '未超过预警阈值 · 风险相对较低',
    bands: {
      high: '概率很高（重点关注）',
      elevated: '高于预警阈值（需关注）',
      low: '低于阈值（相对较低）',
    },
    completeness: '输入完整度',
    howTitle: '如何解读',
    how: (thPct: string) => [
      `预警阈值约 ${thPct}%（Youden，取自训练 nested OOF）。超过阈值表示该患儿无应答风险高于阈值水平，并非“很可能无应答”。`,
      '本工具基于回顾性、单中心数据，尚未外部或前瞻性验证，本版本未随附 PPV/NPV 等工作点指标；阳性结果仅作为加强监测与临床复核的提示。',
      '请务必结合完整临床信息与医师判断使用，不得作为独立诊疗依据。',
    ],
    caveat:
      '该概率为模型基于回顾性、单中心数据的估计值，未经外部验证，可能与真实世界发生率存在偏差。仅供科研与教学参考，不作为诊疗依据。',
    error: '预测服务暂不可用，请稍后重试。',
  },
  en: {
    intro:
      'Enter de-identified pre-IVIG clinical variables (44 in total) to estimate IVIG non-response risk. Every field may be left blank; missing values are imputed by the locked pipeline.',
    importHint: 'Many variables? Upload a single patient\'s table to autofill the form below, then review before computing.',
    importBtn: 'Import Excel / CSV',
    importTemplate: 'Download template',
    importOk: (n: number) => `Imported ${n} value(s) — please review before computing.`,
    importErr: 'Import failed: use the downloaded template and a .xlsx or .csv file.',
    importNote: 'Do not include names, medical record numbers, or other identifiers; such columns are ignored.',
    missing: '— (missing)',
    no: 'No / 0',
    yes: 'Yes / 1',
    predict: 'Estimate risk',
    loading: 'Computing…',
    example: 'Load synthetic example',
    reset: 'Clear',
    resultTitle: 'Prediction',
    probLabel: 'Model-estimated IVIG non-response probability',
    probSub: 'A model estimate, not a confirmed probability',
    scaleThreshold: 'Alert threshold',
    scaleYou: 'This patient',
    stratTitle: 'Risk stratification',
    higher_risk: 'Above the alert threshold · closer monitoring advised',
    lower_risk: 'Below the alert threshold · relatively lower risk',
    bands: {
      high: 'Very high probability (priority review)',
      elevated: 'Above alert threshold (attention)',
      low: 'Below threshold (lower)',
    },
    completeness: 'Input completeness',
    howTitle: 'How to read this',
    how: (thPct: string) => [
      `The alert threshold is ~${thPct}% (Youden, from training nested OOF). Being above it means this patient's risk is higher than the threshold level — not that non-response is "likely".`,
      'The tool is built on retrospective, single-centre data, has not been externally or prospectively validated, and this release does not ship operating-point metrics (PPV/NPV); a positive result is only a prompt for closer monitoring and clinical review.',
      'Always use it together with the full clinical picture and clinician judgment — never as a standalone basis for care.',
    ],
    caveat:
      'This probability is a model estimate from retrospective, single-centre data; it has not been externally validated and may differ from real-world frequencies. For research and education only — not a basis for diagnosis or treatment.',
    error: 'Prediction service is temporarily unavailable. Please try again later.',
  },
} as const;

function label(f: KawasakiField, lang: Lang): string {
  const name = lang === 'zh' ? f.cn : f.en;
  return f.unit ? `${name} (${f.unit})` : name;
}

function RiskScale({ result, t }: { result: PredictResult; t: (typeof T)[Lang] }) {
  const p = result.probability;
  const th = result.threshold_used;
  const scaleMax = Math.max(0.3, p * 1.15, th * 1.5);
  const pos = (x: number) => `${Math.min(100, Math.max(0, (x / scaleMax) * 100))}%`;
  const above = p >= th;
  return (
    <div className="mt-2">
      <div className="relative h-3 w-full rounded-sm bg-border/50">
        <div
          className={`absolute inset-y-0 left-0 rounded-sm ${above ? 'bg-primary' : 'bg-secondary'}`}
          style={{ width: pos(p) }}
        />
        <div className="absolute inset-y-[-3px] w-px bg-ink" style={{ left: pos(th) }} />
      </div>
      <div className="relative mt-1 h-4 text-[11px] text-ink-muted">
        <span className="absolute -translate-x-1/2" style={{ left: pos(th) }}>
          {t.scaleThreshold} {(th * 100).toFixed(1)}%
        </span>
        <span className="absolute -translate-x-1/2 font-medium text-primary" style={{ left: pos(p) }}>
          {t.scaleYou} {(p * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export function KawasakiPredictForm({ lang }: { lang: Lang }) {
  const t = T[lang];
  const empty = Object.fromEntries(KAWASAKI_FIELDS.map((f) => [f.key, ''])) as Record<string, string>;
  const [values, setValues] = useState<Record<string, string>>(empty);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: string, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg(null);
    setResult(null);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(`${API_BASE}/api/predict/kawasaki-ivig/import`, { method: 'POST', body });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { values: Record<string, unknown>; n_parsed: number };
      const next = { ...empty };
      for (const [k, v] of Object.entries(data.values)) next[k] = String(v);
      setValues(next);
      setImportMsg({ ok: true, text: t.importOk(data.n_parsed) });
    } catch {
      setImportMsg({ ok: false, text: t.importErr });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const payload: Record<string, unknown> = {};
    for (const f of KAWASAKI_FIELDS) {
      const raw = values[f.key];
      if (raw === '' || raw == null) continue;
      payload[f.key] = f.kind === 'sex' ? raw : Number(raw);
    }
    try {
      const res = await fetch(`${API_BASE}/api/predict/kawasaki-ivig`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setResult((await res.json()) as PredictResult);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  const byGroup = (g: GroupKey) => KAWASAKI_FIELDS.filter((f) => f.group === g);

  return (
    <div className="border border-border bg-card p-6">
      <p className="max-w-3xl text-sm text-ink-secondary">{t.intro}</p>

      {/* Excel/CSV import → autofill (single patient). */}
      <div className="mt-5 border border-border bg-muted/40 p-4">
        <p className="text-sm text-ink-secondary">{t.importHint}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xlsm,.csv,.tsv"
            onChange={onImport}
            className="hidden"
          />
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
            {t.importBtn}
          </Button>
          <a href="/kawasaki-import-template.csv" download className="link-quiet text-sm font-medium">
            {t.importTemplate}
          </a>
          {importMsg && (
            <span className={`text-sm ${importMsg.ok ? 'text-secondary' : 'text-ink-secondary'}`}>
              {importMsg.text}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-ink-muted">{t.importNote}</p>
      </div>

      <form onSubmit={onSubmit} className="mt-6">
        {KAWASAKI_GROUP_ORDER.map((g) => (
          <fieldset key={g} className="mb-6">
            <legend className="mb-3 text-sm font-semibold text-primary">
              {lang === 'zh' ? KAWASAKI_GROUP_LABEL[g].cn : KAWASAKI_GROUP_LABEL[g].en}
            </legend>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {byGroup(g).map((f) => (
                <label key={f.key} className="flex flex-col gap-1 text-sm">
                  <span className="text-ink-secondary">{label(f, lang)}</span>
                  {f.kind === 'sex' ? (
                    <select
                      value={values[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="border border-border bg-white px-2 py-1.5 text-ink"
                    >
                      <option value="">{t.missing}</option>
                      <option value="male">{lang === 'zh' ? '男性' : 'Male'}</option>
                      <option value="female">{lang === 'zh' ? '女性' : 'Female'}</option>
                    </select>
                  ) : f.kind === 'binary' ? (
                    <select
                      value={values[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="border border-border bg-white px-2 py-1.5 text-ink"
                    >
                      <option value="">{t.missing}</option>
                      <option value="0">{t.no}</option>
                      <option value="1">{t.yes}</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      step="any"
                      value={values[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={t.missing}
                      className="border border-border bg-white px-2 py-1.5 text-ink"
                    />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t.loading : t.predict}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setValues(KAWASAKI_SYNTHETIC_EXAMPLE)}>
            {t.example}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setValues(empty);
              setResult(null);
              setError(null);
            }}
          >
            {t.reset}
          </Button>
        </div>
      </form>

      {error && <p className="mt-6 border border-border bg-muted/50 p-4 text-sm text-ink-secondary">{error}</p>}

      {result && (
        <div className="mt-8 border border-border bg-muted/40 p-6">
          <h3 className="text-h3 text-primary">{t.resultTitle}</h3>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-ink-muted">{t.probLabel}</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-semibold text-primary">
                {(result.probability * 100).toFixed(1)}%
              </span>
              <span className="text-sm text-ink-muted">({t.probSub})</span>
            </div>
            <RiskScale result={result} t={t} />
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <div className="text-xs uppercase tracking-wide text-ink-muted">{t.stratTitle}</div>
            <div className="mt-1 text-base font-medium text-primary">{t[result.risk_label]}</div>
            <div className="mt-1 text-sm text-ink-secondary">
              {t.bands[result.risk_band]} · {t.completeness} {result.n_provided}/{result.n_features}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <div className="text-sm font-semibold text-primary">{t.howTitle}</div>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-secondary">
              {t.how((result.threshold_used * 100).toFixed(1)).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <p className="mt-4 border-t border-border pt-3 text-xs text-ink-muted">{t.caveat}</p>
          <p className="mt-2 text-xs text-ink-muted">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
