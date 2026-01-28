
export interface ExamRecord {
  slNo: string | number;
  examDate: string;
  batch: string;
  subjectCode: string;
  subjectName: string;
  registerNumber: string;
  studentName: string;
}

export type ProcessingStatus = 'idle' | 'processing' | 'rendering' | 'extracting' | 'completed' | 'error';
