'use client';

import { useState } from 'react';
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
type Strategy = 'youden' | 'sens80';

interface PredictResult {
  model_version: string;
  probability: number;
  threshold_strategy: Strategy;
  threshold_used: number;
  risk_label: 'higher_risk' | 'lower_risk';
  risk_band: 'very_high' | 'above_youden' | 'above_sens80' | 'low';
  n_provided: number;
  n_features: number;
  completeness: number;
  disclaimer: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

const T = {
  zh: {
    intro:
      '输入首次 IVIG 治疗前的去标识临床变量,估计 IVIG 无应答风险。所有字段均可留空,缺失值由锁定模型按训练集规则插补。',
    threshold: '判定阈值',
    youden: 'Youden(平衡)',
    sens80: '高敏感(sens80)',
    recommended: '推荐',
    thresholdHelp:
      '高敏感(sens80):阈值更低、尽量不漏,会多标记几个待复核——适合“宁可错标、不能漏”的筛查;Youden(平衡):误报更少,但可能漏掉更多无应答。同一患儿在两个阈值下结论可能不同。',
    missing: '—（缺失）',
    no: '否 / 0',
    yes: '是 / 1',
    predict: '计算风险',
    loading: '计算中…',
    example: '填入合成示例',
    reset: '清空',
    resultTitle: '预测结果',
    probLabel: '模型估计的 IVIG 无应答概率',
    probSub: '模型估计值,非确诊概率',
    // scale
    scaleThreshold: '预警阈值',
    scaleYou: '该患儿',
    // stratification
    stratTitle: '风险分层',
    higher_risk: '超过预警阈值 · 建议加强监测',
    lower_risk: '未超过预警阈值 · 风险相对较低',
    bands: {
      very_high: '明显高于阈值(重点关注)',
      above_youden: '高于预警阈值(需关注)',
      above_sens80: '介于两阈值之间(临界)',
      low: '低风险区间',
    },
    completeness: '输入完整度',
    howTitle: '如何解读',
    how: (thPct: string) => [
      `预警阈值约 ${thPct}%,与川崎病 IVIG 无应答的人群基线率(约 9–10%)接近。超过阈值并不代表“很可能无应答”,只表示该患儿风险高于一般患儿。`,
      '在锁定模型的留出测试集中:被标记(阈值以上)的患儿约每 4 人有 1 人最终 IVIG 无应答(阳性预测值≈25%);未被标记者约 95% 会应答(阴性预测值≈95%)。',
      '因此本工具更适合“排除低风险”,而非“确诊高风险”。阳性结果仅作为加强监测与临床复核的提示。',
    ],
    caveat:
      '该概率为模型基于回顾性、单中心数据的估计值,校准并不完美且未经外部验证,可能与真实世界发生率存在偏差。仅供科研与教学参考,不作为诊疗依据。',
    error: '预测服务暂不可用,请稍后重试。',
  },
  en: {
    intro:
      'Enter de-identified pre-IVIG clinical variables to estimate IVIG non-response risk. Every field may be left blank; missing values are imputed by the locked pipeline.',
    threshold: 'Decision threshold',
    youden: 'Youden (balanced)',
    sens80: 'High-sensitivity (sens80)',
    recommended: 'recommended',
    thresholdHelp:
      'High-sensitivity (sens80): lower threshold, catches as many non-responders as possible while flagging a few extra for review — suited to a "don\'t-miss" screen; Youden (balanced): fewer false alarms, but misses more non-responders. The same patient may be called differently under the two thresholds.',
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
      very_high: 'Well above threshold (priority review)',
      above_youden: 'Above alert threshold (attention)',
      above_sens80: 'Between the two thresholds (borderline)',
      low: 'Low-risk range',
    },
    completeness: 'Input completeness',
    howTitle: 'How to read this',
    how: (thPct: string) => [
      `The alert threshold is ~${thPct}%, close to the population IVIG non-response rate in Kawasaki disease (~9–10%). Being above it does NOT mean "likely to fail IVIG" — only that this patient's risk is higher than average.`,
      'In the locked model\'s held-out test set: of patients flagged (above threshold), only about 1 in 4 actually fail IVIG (PPV ≈ 25%); of those not flagged, ~95% respond (NPV ≈ 95%).',
      'So the tool is better at ruling out low risk than confirming high risk. A positive flag is only a prompt for closer monitoring and clinical review.',
    ],
    caveat:
      'This probability is a model estimate from retrospective, single-centre data; calibration is imperfect and it has not been externally validated, so it may differ from real-world frequencies. For research and education only — not a basis for diagnosis or treatment.',
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
        {/* filled portion up to the patient's probability */}
        <div
          className={`absolute inset-y-0 left-0 rounded-sm ${above ? 'bg-primary' : 'bg-secondary'}`}
          style={{ width: pos(p) }}
        />
        {/* alert threshold marker */}
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
  // Default to the high-sensitivity (sens80) operating point: this is a "don't-miss"
  // rule-out aid, so prefer catching non-responders over minimizing false alarms.
  const [strategy, setStrategy] = useState<Strategy>('sens80');
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: string, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const payload: Record<string, unknown> = { threshold_strategy: strategy };
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

      <form onSubmit={onSubmit} className="mt-6">
        {/* Threshold selector — sens80 first (default / recommended don't-miss point) */}
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm font-medium text-primary">{t.threshold}:</span>
          <label className="flex items-center gap-1.5 text-sm text-ink-secondary">
            <input
              type="radio"
              name="strategy"
              checked={strategy === 'sens80'}
              onChange={() => setStrategy('sens80')}
            />
            {t.sens80}
            <span className="rounded-sm bg-secondary/10 px-1.5 py-0.5 text-[11px] font-medium text-secondary">
              {t.recommended}
            </span>
          </label>
          <label className="flex items-center gap-1.5 text-sm text-ink-secondary">
            <input
              type="radio"
              name="strategy"
              checked={strategy === 'youden'}
              onChange={() => setStrategy('youden')}
            />
            {t.youden}
          </label>
        </div>
        <p className="mb-6 max-w-3xl text-xs leading-relaxed text-ink-muted">{t.thresholdHelp}</p>

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
                      min={f.min}
                      max={f.max}
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

          {/* Probability, framed as a model estimate */}
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

          {/* Risk stratification */}
          <div className="mt-6 border-t border-border pt-4">
            <div className="text-xs uppercase tracking-wide text-ink-muted">{t.stratTitle}</div>
            <div className="mt-1 text-base font-medium text-primary">{t[result.risk_label]}</div>
            <div className="mt-1 text-sm text-ink-secondary">
              {t.bands[result.risk_band]} ·{' '}
              {result.threshold_strategy === 'youden' ? t.youden : t.sens80} · {t.completeness}{' '}
              {result.n_provided}/{result.n_features}
            </div>
          </div>

          {/* How to read this — natural-frequency interpretation */}
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
