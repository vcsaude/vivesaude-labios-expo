export type ExamParameter = {
  id: string;
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
};

export type Exam = {
  id: string;
  title: string;
  collectedAt: string; // ISO date
  lab?: string;
  parameters: ExamParameter[];
};

