/**
 * Field metadata for the Kawasaki_IVIG single-patient form. Sourced verbatim from
 * the model's own feature dictionary (display_name_cn / display_name_en / unit /
 * reasonable range). The `key` matches the backend KawasakiInput schema (ascii),
 * which the backend maps to the pipeline's column names. Bilingual labels live here;
 * all fields are optional (the saved pipeline imputes missing values).
 */
export type FieldKind = 'sex' | 'binary' | 'number';
export type GroupKey = 'demographics' | 'vitals' | 'symptoms' | 'labs';

export interface KawasakiField {
  key: string;
  cn: string;
  en: string;
  kind: FieldKind;
  group: GroupKey;
  unit?: string;
  min?: number;
  max?: number;
}

export const KAWASAKI_GROUP_ORDER: GroupKey[] = ['demographics', 'vitals', 'symptoms', 'labs'];

export const KAWASAKI_GROUP_LABEL: Record<GroupKey, { cn: string; en: string }> = {
  demographics: { cn: '人口学', en: 'Demographics' },
  vitals: { cn: '生命体征', en: 'Vital signs' },
  symptoms: { cn: '症状（病历提取）', en: 'Symptoms (note-derived)' },
  labs: { cn: '实验室检查', en: 'Laboratory tests' },
};

export const KAWASAKI_FIELDS: KawasakiField[] = [
  // Demographics
  { key: 'sex', cn: '性别', en: 'Sex', kind: 'sex', group: 'demographics' },
  { key: 'age_years', cn: '年龄', en: 'Age', kind: 'number', group: 'demographics', unit: 'years', min: 0, max: 18 },
  { key: 'body_weight_kg', cn: '体重', en: 'Body weight', kind: 'number', group: 'demographics', unit: 'kg', min: 1, max: 120 },
  { key: 'height_cm', cn: '身高', en: 'Height', kind: 'number', group: 'demographics', unit: 'cm', min: 30, max: 220 },
  // Vital signs
  { key: 'pre_ivig_max_temp', cn: 'IVIG前最高体温', en: 'Max temperature before IVIG', kind: 'number', group: 'vitals', unit: '°C', min: 35, max: 43 },
  { key: 'pre_ivig_fever_ge_38', cn: 'IVIG前体温≥38°C', en: 'Fever ≥38°C before IVIG', kind: 'binary', group: 'vitals' },
  // Symptoms (note-derived)
  { key: 'fever_duration_days', cn: '发热时间', en: 'Fever duration', kind: 'number', group: 'symptoms', unit: 'days', min: 0, max: 30 },
  { key: 'rash_duration_days', cn: '皮疹持续时间', en: 'Rash duration', kind: 'number', group: 'symptoms', unit: 'days', min: 0, max: 30 },
  { key: 'conjunctival_injection', cn: '结膜充血', en: 'Conjunctival injection', kind: 'binary', group: 'symptoms' },
  { key: 'cracked_lips', cn: '口唇皲裂', en: 'Cracked lips', kind: 'binary', group: 'symptoms' },
  { key: 'strawberry_tongue', cn: '杨梅舌', en: 'Strawberry tongue', kind: 'binary', group: 'symptoms' },
  { key: 'oral_mucosal_change', cn: '口腔黏膜改变', en: 'Oral mucosal change', kind: 'binary', group: 'symptoms' },
  { key: 'cervical_lymphadenopathy', cn: '颈部淋巴结肿大', en: 'Cervical lymphadenopathy', kind: 'binary', group: 'symptoms' },
  { key: 'extremity_edema', cn: '手足硬肿', en: 'Extremity edema', kind: 'binary', group: 'symptoms' },
  { key: 'periungual_desquamation', cn: '肢端脱皮', en: 'Periungual desquamation', kind: 'binary', group: 'symptoms' },
  { key: 'extremity_change', cn: '指趾端改变', en: 'Extremity change', kind: 'binary', group: 'symptoms' },
  { key: 'rash', cn: '皮疹', en: 'Rash', kind: 'binary', group: 'symptoms' },
  { key: 'classic_symptom_count', cn: '经典症状数量', en: 'Classic KD symptom count', kind: 'number', group: 'symptoms', unit: 'count', min: 0, max: 6 },
  // Laboratory tests
  { key: 'crp', cn: 'C反应蛋白', en: 'C-reactive protein', kind: 'number', group: 'labs', unit: 'mg/L', min: 0 },
  { key: 'wbc', cn: '白细胞计数', en: 'White blood cell count', kind: 'number', group: 'labs', unit: '10⁹/L', min: 0 },
  { key: 'neutrophil_pct', cn: '中性粒细胞百分比', en: 'Neutrophil percentage', kind: 'number', group: 'labs', unit: '%', min: 0, max: 100 },
  { key: 'lymphocyte_pct', cn: '淋巴细胞百分比', en: 'Lymphocyte percentage', kind: 'number', group: 'labs', unit: '%', min: 0, max: 100 },
  { key: 'hemoglobin', cn: '血红蛋白', en: 'Hemoglobin', kind: 'number', group: 'labs', unit: 'g/L', min: 0 },
  { key: 'platelet', cn: '血小板计数', en: 'Platelet count', kind: 'number', group: 'labs', unit: '10⁹/L', min: 0 },
  { key: 'albumin', cn: '白蛋白', en: 'Albumin', kind: 'number', group: 'labs', unit: 'g/L', min: 0 },
  { key: 'alt', cn: '谷丙转氨酶', en: 'Alanine aminotransferase', kind: 'number', group: 'labs', unit: 'U/L', min: 0 },
  { key: 'ast', cn: '谷草转氨酶', en: 'Aspartate aminotransferase', kind: 'number', group: 'labs', unit: 'U/L', min: 0 },
  { key: 'total_bilirubin', cn: '总胆红素', en: 'Total bilirubin', kind: 'number', group: 'labs', unit: 'µmol/L', min: 0 },
  { key: 'sodium', cn: '钠', en: 'Sodium', kind: 'number', group: 'labs', unit: 'mmol/L', min: 100, max: 180 },
  { key: 'procalcitonin', cn: '降钙素原', en: 'Procalcitonin', kind: 'number', group: 'labs', unit: 'ng/mL', min: 0 },
  { key: 'esr', cn: '血沉', en: 'Erythrocyte sedimentation rate', kind: 'number', group: 'labs', unit: 'mm/h', min: 0 },
  { key: 'fibrinogen', cn: '纤维蛋白原', en: 'Fibrinogen', kind: 'number', group: 'labs', unit: 'g/L', min: 0 },
];

/**
 * A fully SYNTHETIC demo case (not a real patient row). Plausible values illustrating
 * a higher-risk pattern; used only to populate the form for demonstration.
 */
export const KAWASAKI_SYNTHETIC_EXAMPLE: Record<string, string> = {
  sex: 'male',
  age_years: '0.8',
  body_weight_kg: '9',
  height_cm: '72',
  pre_ivig_max_temp: '39.8',
  pre_ivig_fever_ge_38: '1',
  fever_duration_days: '4',
  rash_duration_days: '3',
  conjunctival_injection: '1',
  cracked_lips: '1',
  strawberry_tongue: '0',
  oral_mucosal_change: '1',
  cervical_lymphadenopathy: '1',
  extremity_edema: '1',
  periungual_desquamation: '0',
  extremity_change: '0',
  rash: '1',
  classic_symptom_count: '4',
  crp: '95',
  wbc: '17.5',
  neutrophil_pct: '82',
  lymphocyte_pct: '12',
  hemoglobin: '98',
  platelet: '300',
  albumin: '31',
  alt: '60',
  ast: '55',
  total_bilirubin: '12',
  sodium: '133',
  procalcitonin: '1.8',
  esr: '65',
  fibrinogen: '5.5',
};
