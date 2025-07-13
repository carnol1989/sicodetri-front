// src/__tests__/views/ReportTaxBook.test.jsx
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('ReportTaxBook', () => {
  beforeEach(() => {
    cleanup();
    jest.resetModules();
  });

  it('debe renderizar ReportTemplate con los props correctos', () => {
    const mockReportTemplate = jest.fn();
    jest.doMock('../../components/ReportTemplate', () => ({
      __esModule: true,
      default: mockReportTemplate,
    }));

    const ReportTaxBook = require('../../views/ReportTaxBook')
      .default;

    render(<ReportTaxBook />);
    expect(mockReportTemplate).toHaveBeenCalledTimes(1);
    expect(mockReportTemplate).toHaveBeenCalledWith(
      {
        title: 'Reporte: Libro Tributario de Activo Fijos',
        option: '1',
        withYear: true
      },
      {}
    );
  });

  it('debe mostrar el componente mock de ReportTemplate en el DOM', () => {
    jest.doMock('../../components/ReportTemplate', () => ({
      __esModule: true,
      default: ({ title, option, withYear }) => (
        <div data-testid="report-template">
          {`${title}|${option}|${withYear}`}
        </div>
      )
    }));

    const ReportTaxBook = require('../../views/ReportTaxBook')
      .default;

    render(<ReportTaxBook />);
    const tpl = screen.getByTestId("report-template");
    expect(tpl).toBeInTheDocument();
    expect(tpl).toHaveTextContent(
      'Reporte: Libro Tributario de Activo Fijos'
    );
  });
});
