import { config } from './config';
import { http } from './http';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { Exam, ExamParameter } from '../types/exam';

export type Crop = { page: number; rect: { x: number; y: number; width: number; height: number } };

const mockDb: Exam[] = [];

export const examsService = {
  async list(): Promise<Exam[]> {
    if (config.mode === 'mock') return mockDb;
    return http<Exam[]>('/exams');
  },

  async uploadPdf(localUri: string): Promise<{ examId: string }> {
    if (config.mode === 'mock') {
      // Simula upload e cria um registro básico em memória
      const id = `exam-${Date.now()}`;
      mockDb.unshift({
        id,
        title: 'Exame (PDF enviado)',
        collectedAt: new Date().toISOString(),
        lab: undefined,
        parameters: [],
      });
      return { examId: id };
    }
    // Exemplo para API real (multipart):
    // const form = new FormData();
    // form.append('file', { uri: localUri, name: 'exam.pdf', type: 'application/pdf' } as any);
    // return http<{ examId: string }>(`/exams/{id}/files`, { method: 'POST', body: form, headers: { 'Content-Type': 'multipart/form-data' }});
    return { examId: 'not-implemented' };
  },

  async analyzeCrop(input: Crop): Promise<ExamParameter[]> {
    if (config.mode === 'mock') {
      // Fake a parsed set of parameters from OCR crop
      return [
        { id: 'm1', name: 'Glicose', value: '94', unit: 'mg/dL', referenceRange: '70–99' },
        { id: 'm2', name: 'Ureia', value: '28', unit: 'mg/dL', referenceRange: '10–50' },
      ];
    }
    const res = await http<{ parameters: ExamParameter[] }>(`/exams/current/analyze`, { method: 'POST', body: input });
    return res.parameters;
  },

  async exportCsv(exam: Exam): Promise<string> {
    // Build CSV
    const rows = [
      ['Parametro', 'Valor', 'Unidade', 'Referencia'],
      ...exam.parameters.map((p) => [p.name, p.value, p.unit ?? '', p.referenceRange ?? '']),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const fileUri = `${FileSystem.cacheDirectory}exame_${exam.id}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Exportar CSV' });
    }
    return csv;
  },

  async exportPdf(examId: string): Promise<void> {
    if (config.mode === 'mock') {
      throw new Error('Exportação PDF mock não implementada');
    }
    // For real API, this would fetch a file stream; left as stub.
    await http<any>(`/exams/${examId}/export?type=pdf`);
  },
};
