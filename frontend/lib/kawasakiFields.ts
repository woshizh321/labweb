/**
 * Field metadata for the Kawasaki_IVIG (v2, 44-feature) single-patient form. Chinese
 * labels are from the model's own variable dictionary; English labels and units are
 * standard clinical equivalents. `key` matches the backend KawasakiInput schema AND
 * the pipeline's column names. All fields are optional (the pipeline imputes missing).
 */
export type FieldKind = 'sex' | 'binary' | 'number';
export type GroupKey =
  | 'demographics'
  | 'clinical_course'
  | 'clinical_symptom'
  | 'cbc'
  | 'inflammation'
  | 'liver'
  | 'kidney'
  | 'electrolyte'
  | 'coagulation'
  | 'lymphocyte_subset'
  | 'myocardial_enzyme'
  | 'cardiac_injury';

export interface KawasakiField {
  key: string;
  cn: string;
  en: string;
  kind: FieldKind;
  group: GroupKey;
  unit?: string;
}

export const KAWASAKI_GROUP_ORDER: GroupKey[] = ['demographics', 'clinical_course', 'clinical_symptom', 'cbc', 'inflammation', 'liver', 'kidney', 'electrolyte', 'coagulation', 'lymphocyte_subset', 'myocardial_enzyme', 'cardiac_injury'];

export const KAWASAKI_GROUP_LABEL: Record<GroupKey, { cn: string; en: string }> = {
  demographics: { cn: '基本信息', en: 'Demographics' },
  clinical_course: { cn: '病程与体温', en: 'Course & temperature' },
  clinical_symptom: { cn: '临床症状', en: 'Symptoms' },
  cbc: { cn: '血常规', en: 'Complete blood count' },
  inflammation: { cn: '炎症指标', en: 'Inflammation markers' },
  liver: { cn: '肝功能 / 胆红素', en: 'Liver & bilirubin' },
  kidney: { cn: '肾功能', en: 'Kidney function' },
  electrolyte: { cn: '电解质', en: 'Electrolytes' },
  coagulation: { cn: '凝血', en: 'Coagulation' },
  lymphocyte_subset: { cn: '淋巴细胞亚群', en: 'Lymphocyte subsets' },
  myocardial_enzyme: { cn: '心肌酶', en: 'Myocardial enzymes' },
  cardiac_injury: { cn: '心肌损伤', en: 'Cardiac injury' },
};

export const KAWASAKI_FIELDS: KawasakiField[] = [
  { key: 'age_years', cn: '年龄', en: 'Age', kind: 'number', group: 'demographics', unit: 'years' },
  { key: 'sex', cn: '性别', en: 'Sex', kind: 'sex', group: 'demographics' },
  { key: 'max_temp_pre_ivig', cn: 'IVIG前最高体温', en: 'Max temperature before IVIG', kind: 'number', group: 'clinical_course', unit: '°C' },
  { key: 'fever_days_ivig', cn: 'IVIG时发热天数', en: 'Fever duration at IVIG', kind: 'number', group: 'clinical_course', unit: 'days' },
  { key: 'rash_days_ivig', cn: 'IVIG时皮疹天数', en: 'Rash duration at IVIG', kind: 'number', group: 'clinical_course', unit: 'days' },
  { key: 'rash', cn: '皮疹', en: 'Rash', kind: 'binary', group: 'clinical_symptom' },
  { key: 'conjunctival_injection', cn: '结膜充血', en: 'Conjunctival injection', kind: 'binary', group: 'clinical_symptom' },
  { key: 'strawberry_tongue', cn: '草莓舌', en: 'Strawberry tongue', kind: 'binary', group: 'clinical_symptom' },
  { key: 'cracked_lips', cn: '口唇皲裂', en: 'Cracked lips', kind: 'binary', group: 'clinical_symptom' },
  { key: 'oral_mucosal_change', cn: '口腔黏膜改变', en: 'Oral mucosal change', kind: 'binary', group: 'clinical_symptom' },
  { key: 'cervical_lymphadenopathy', cn: '颈部淋巴结肿大', en: 'Cervical lymphadenopathy', kind: 'binary', group: 'clinical_symptom' },
  { key: 'extremity_edema', cn: '手足硬肿', en: 'Extremity edema', kind: 'binary', group: 'clinical_symptom' },
  { key: 'periungual_desquamation', cn: '肢端脱皮', en: 'Periungual desquamation', kind: 'binary', group: 'clinical_symptom' },
  { key: 'extremity_change', cn: '指趾端改变', en: 'Extremity change', kind: 'binary', group: 'clinical_symptom' },
  { key: 'wbc', cn: 'IVIG前白细胞', en: 'White blood cell count', kind: 'number', group: 'cbc', unit: '10⁹/L' },
  { key: 'neutrophil_percent', cn: 'IVIG前中性粒细胞百分比', en: 'Neutrophil percentage', kind: 'number', group: 'cbc', unit: '%' },
  { key: 'lymphocyte_percent', cn: 'IVIG前淋巴细胞百分比', en: 'Lymphocyte percentage', kind: 'number', group: 'cbc', unit: '%' },
  { key: 'monocyte_percent', cn: '单核细胞百分数', en: 'Monocyte percentage', kind: 'number', group: 'cbc', unit: '%' },
  { key: 'hemoglobin', cn: 'IVIG前血红蛋白', en: 'Hemoglobin', kind: 'number', group: 'cbc', unit: 'g/L' },
  { key: 'platelet', cn: 'IVIG前血小板', en: 'Platelet count', kind: 'number', group: 'cbc', unit: '10⁹/L' },
  { key: 'crp', cn: 'IVIG前C反应蛋白', en: 'C-reactive protein', kind: 'number', group: 'inflammation', unit: 'mg/L' },
  { key: 'esr', cn: '血沉', en: 'Erythrocyte sedimentation rate', kind: 'number', group: 'inflammation', unit: 'mm/h' },
  { key: 'pct', cn: '降钙素原', en: 'Procalcitonin', kind: 'number', group: 'inflammation', unit: 'ng/mL' },
  { key: 'ferritin', cn: '铁蛋白', en: 'Ferritin', kind: 'number', group: 'inflammation', unit: 'ng/mL' },
  { key: 'alt', cn: '谷丙转氨酶', en: 'Alanine aminotransferase (ALT)', kind: 'number', group: 'liver', unit: 'U/L' },
  { key: 'ast', cn: '谷草转氨酶', en: 'Aspartate aminotransferase (AST)', kind: 'number', group: 'liver', unit: 'U/L' },
  { key: 'albumin', cn: '白蛋白', en: 'Albumin', kind: 'number', group: 'liver', unit: 'g/L' },
  { key: 'total_bilirubin', cn: '总胆红素', en: 'Total bilirubin', kind: 'number', group: 'liver', unit: 'µmol/L' },
  { key: 'direct_bilirubin', cn: '直接胆红素', en: 'Direct bilirubin', kind: 'number', group: 'liver', unit: 'µmol/L' },
  { key: 'creatinine', cn: '肌酐', en: 'Creatinine', kind: 'number', group: 'kidney', unit: 'µmol/L' },
  { key: 'urea_nitrogen', cn: '尿素氮', en: 'Urea nitrogen (BUN)', kind: 'number', group: 'kidney', unit: 'mmol/L' },
  { key: 'uric_acid', cn: '尿酸', en: 'Uric acid', kind: 'number', group: 'kidney', unit: 'µmol/L' },
  { key: 'sodium', cn: '钠', en: 'Sodium', kind: 'number', group: 'electrolyte', unit: 'mmol/L' },
  { key: 'potassium', cn: '钾', en: 'Potassium', kind: 'number', group: 'electrolyte', unit: 'mmol/L' },
  { key: 'pt', cn: '凝血酶原时间 (PT)', en: 'Prothrombin time (PT)', kind: 'number', group: 'coagulation', unit: 's' },
  { key: 'aptt', cn: '活化部分凝血活酶时间 (APTT)', en: 'Activated partial thromboplastin time (APTT)', kind: 'number', group: 'coagulation', unit: 's' },
  { key: 'fibrinogen', cn: '纤维蛋白原', en: 'Fibrinogen', kind: 'number', group: 'coagulation', unit: 'g/L' },
  { key: 'cd4_t_count', cn: 'CD4+T细胞绝对值', en: 'CD4+ T-cell count', kind: 'number', group: 'lymphocyte_subset', unit: 'cells/µL' },
  { key: 'cd8_t_count', cn: 'CD8+T细胞绝对值', en: 'CD8+ T-cell count', kind: 'number', group: 'lymphocyte_subset', unit: 'cells/µL' },
  { key: 'cd4_cd8_ratio', cn: 'CD4/CD8 比值', en: 'CD4/CD8 ratio', kind: 'number', group: 'lymphocyte_subset' },
  { key: 'cd19_b_count', cn: 'CD19+B细胞绝对值', en: 'CD19+ B-cell count', kind: 'number', group: 'lymphocyte_subset', unit: 'cells/µL' },
  { key: 'ldh', cn: '乳酸脱氢酶', en: 'Lactate dehydrogenase (LDH)', kind: 'number', group: 'myocardial_enzyme', unit: 'U/L' },
  { key: 'ck_mb', cn: '肌酸激酶同工酶 (CK-MB)', en: 'Creatine kinase-MB (CK-MB)', kind: 'number', group: 'myocardial_enzyme', unit: 'U/L' },
  { key: 'ntprobnp', cn: 'NT-proBNP', en: 'NT-proBNP', kind: 'number', group: 'cardiac_injury', unit: 'pg/mL' },
];

/** Fully SYNTHETIC demo case (not a real patient row). Plausible higher-risk pattern. */
export const KAWASAKI_SYNTHETIC_EXAMPLE: Record<string, string> = {
  age_years: '1.5',
  sex: 'male',
  max_temp_pre_ivig: '39.5',
  fever_days_ivig: '5',
  rash_days_ivig: '4',
  rash: '1',
  conjunctival_injection: '1',
  strawberry_tongue: '1',
  cracked_lips: '1',
  oral_mucosal_change: '1',
  cervical_lymphadenopathy: '1',
  extremity_edema: '1',
  periungual_desquamation: '0',
  extremity_change: '0',
  wbc: '16',
  neutrophil_percent: '80',
  lymphocyte_percent: '14',
  monocyte_percent: '6',
  hemoglobin: '100',
  platelet: '320',
  crp: '90',
  esr: '60',
  pct: '1.5',
  ferritin: '350',
  alt: '55',
  ast: '50',
  albumin: '32',
  total_bilirubin: '12',
  direct_bilirubin: '5',
  creatinine: '25',
  urea_nitrogen: '4',
  uric_acid: '200',
  sodium: '134',
  potassium: '4.2',
  pt: '13',
  aptt: '38',
  fibrinogen: '5',
  cd4_t_count: '900',
  cd8_t_count: '450',
  cd4_cd8_ratio: '2.0',
  cd19_b_count: '800',
  ldh: '320',
  ck_mb: '25',
  ntprobnp: '600',
};
