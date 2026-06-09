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
    missing: '—（缺失）',
    no: '否 / 0',
    yes: '是 / 1',
    predict: '计算风险',
    loading: '计算中…',
    example: '填入合成示例',
    reset: '清空',
    resultTitle: '预测结果',
    probability: 'IVIG 无应答预测概率',
    classification: '阈值判定',
    thresholdUsed: '所用阈值',
    completeness: '输入完整度',
    band: '概率区间',
    higher_risk: '高于阈值（提示较高风险）',
    lower_risk: '低于阈值（提示较低风险）',
    bands: {
      very_high: '很高概率区间',
      above_youden: '高风险阈值以上',
      above_sens80: '敏感性阈值以上',
      low: '低概率区间',
    },
    note: '本模型 NPV 高、PPV 低,适合“排除”而非“确诊”;阳性提示仅作临床复核参考。',
    error: '预测服务暂不可用,请稍后重试。',
  },
  en: {
    intro:
      'Enter de-identified pre-IVIG clinical variables to estimate IVIG non-response risk. Every field may be left blank; missing values are imputed by the locked pipeline.',
    threshold: 'Decision threshold',
    youden: 'Youden (balanced)',
    sens80: 'High-sensitivity (sens80)',
    missing: '— (missing)',
    no: 'No / 0',
    yes: 'Yes / 1',
    predict: 'Estimate risk',
    loading: 'Computing…',
    example: 'Load synthetic example',
    reset: 'Clear',
    resultTitle: 'Prediction',
    probability: 'Predicted IVIG non-response probability',
    classification: 'Threshold call',
    thresholdUsed: 'Threshold used',
    completeness: 'Input completeness',
    band: 'Probability band',
    higher_risk: 'Above threshold (higher predicted risk)',
    lower_risk: 'Below threshold (lower predicted risk)',
    bands: {
      very_high: 'Very high probability',
      above_youden: 'Above Youden threshold',
      above_sens80: 'Above sensitivity threshold',
      low: 'Low probability',
    },
    note: 'High NPV / low PPV — best for rule-out, not confirmation; a positive flag is only a prompt for clinical review.',
    error: 'Prediction service is temporarily unavailable. Please try again later.',
  },
} as const;

function label(f: KawasakiField, lang: Lang): string {
  const name = lang === 'zh' ? f.cn : f.en;
  return f.unit ? `${name} (${f.unit})` : name;
}

export function KawasakiPredictForm({ lang }: { lang: Lang }) {
  const t = T[lang];
  const empty = Object.fromEntries(KAWASAKI_FIELDS.map((f) => [f.key, ''])) as Record<string, string>;
  const [values, setValues] = useState<Record<string, string>>(empty);
  const [strategy, setStrategy] = useState<Strategy>('youden');
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
        {/* Threshold selector */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-primary">{t.threshold}:</span>
          <label className="flex items-center gap-1.5 text-sm text-ink-secondary">
            <input
              type="radio"
              name="strategy"
              checked={strategy === 'youden'}
              onChange={() => setStrategy('youden')}
            />
            {t.youden}
          </label>
          <label className="flex items-center gap-1.5 text-sm text-ink-secondary">
            <input
              type="radio"
              name="strategy"
              checked={strategy === 'sens80'}
              onChange={() => setStrategy('sens80')}
            />
            {t.sens80}
          </label>
        </div>

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
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-ink-muted">{t.probability}</div>
              <div className="mt-1 text-3xl font-semibold text-primary">
                {(result.probability * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-ink-muted">{t.classification}</div>
              <div className="mt-1 text-base font-medium text-primary">{t[result.risk_label]}</div>
              <div className="mt-1 text-sm text-ink-secondary">
                {t.band}: {t.bands[result.risk_band]}
              </div>
            </div>
            <div className="text-sm text-ink-secondary">
              {t.thresholdUsed}: {result.threshold_used.toFixed(3)} (
              {result.threshold_strategy === 'youden' ? t.youden : t.sens80})
            </div>
            <div className="text-sm text-ink-secondary">
              {t.completeness}: {result.n_provided}/{result.n_features} (
              {(result.completeness * 100).toFixed(0)}%)
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-secondary">{t.note}</p>
          <p className="mt-3 border-t border-border pt-3 text-xs text-ink-muted">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
