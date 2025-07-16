// src/__tests__/unit/views/ReportDetailDepreciation.test.jsx
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('ReportDetailDepreciation', () => {
  afterEach(() => {
    // Limpiamos el DOM y la caché de módulos para el siguiente it
    cleanup();
    jest.resetModules();
  });

  it('debería llamar a ReportTemplate con las props correctas', () => {
    const mockReportTemplate = jest.fn();
    jest.doMock('../../../components/ReportTemplate', () => ({
      __esModule: true,
      default: mockReportTemplate,
    }));

    const ReportDetailDepreciation = require('../../../views/ReportDetailDepreciation')
      .default;

    render(<ReportDetailDepreciation />);
    expect(mockReportTemplate).toHaveBeenCalledTimes(1);
    expect(mockReportTemplate).toHaveBeenCalledWith(
      {
        title: 'Reporte: Detalle de Depreciación Financiera y Tributaria',
        option: '2',
        withYear: false,
      },
      {}
    );
  });

  it('debería renderizar el componente ReportTemplate en el DOM', () => {
    jest.doMock('../../../components/ReportTemplate', () => ({
      __esModule: true,
      default: ({ title, option, withYear }) => (
        <div data-testid="report-template">
          {`${title}|${option}|${withYear}`}
        </div>
      ),
    }));

    const ReportDetailDepreciation = require('../../../views/ReportDetailDepreciation')
      .default;

    render(<ReportDetailDepreciation />);
    const tpl = screen.getByTestId('report-template');
    expect(tpl).toBeInTheDocument();
    expect(tpl).toHaveTextContent(
      'Reporte: Detalle de Depreciación Financiera y Tributaria|2|false'
    );
  });
});
