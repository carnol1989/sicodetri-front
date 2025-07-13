// src/__tests__/router/GlobalRouter.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import GlobalRouter from '../../router/GlobalRouter';

// Mocks de todos los componentes importados en GlobalRouter
jest.mock('../../views/Home', () => () => <div>Home Component</div>);
jest.mock('../../components/NavBar', () => () => <div>NavBar Component</div>);
jest.mock('../../views/FileUpload', () => () => <div>FileUpload Component</div>);
jest.mock('../../views/TemporaryDeductions', () => () => <div>TemporaryDeductions Component</div>);
jest.mock('../../views/TemporaryAdditions', () => () => <div>TemporaryAdditions Component</div>);
jest.mock('../../views/PermanentAdditions', () => () => <div>PermanentAdditions Component</div>);
jest.mock('../../views/ReportTaxBook', () => () => <div>ReportTaxBook Component</div>);
jest.mock('../../views/ReportDetailDepreciation', () => () => <div>ReportDetailDepreciation Component</div>);

// Helper para renderizar GlobalRouter en una ruta concreta
const renderWithRoute = (path) => {
  window.history.pushState({}, 'Test page', path);
  return render(<GlobalRouter />);
};

describe('GlobalRouter', () => {
  it('siempre renderiza NavBar', () => {
    renderWithRoute('/');
    expect(screen.getByText('NavBar Component')).toBeInTheDocument();
  });

  it('renderiza Home en la ruta "/"', () => {
    renderWithRoute('/');
    expect(screen.getByText('Home Component')).toBeInTheDocument();
  });

  it('renderiza FileUpload en "/upload"', () => {
    renderWithRoute('/upload');
    expect(screen.getByText('FileUpload Component')).toBeInTheDocument();
  });

  it('renderiza TemporaryDeductions en "/temporary-deduction"', () => {
    renderWithRoute('/temporary-deduction');
    expect(screen.getByText('TemporaryDeductions Component')).toBeInTheDocument();
  });

  it('renderiza TemporaryAdditions en "/temporary-addition"', () => {
    renderWithRoute('/temporary-addition');
    expect(screen.getByText('TemporaryAdditions Component')).toBeInTheDocument();
  });

  it('renderiza PermanentAdditions en "/permanent-addition"', () => {
    renderWithRoute('/permanent-addition');
    expect(screen.getByText('PermanentAdditions Component')).toBeInTheDocument();
  });

  it('renderiza ReportTaxBook en "/report-tax-book"', () => {
    renderWithRoute('/report-tax-book');
    expect(screen.getByText('ReportTaxBook Component')).toBeInTheDocument();
  });

  it('renderiza ReportDetailDepreciation en "/report-detail-depreciation"', () => {
    renderWithRoute('/report-detail-depreciation');
    expect(screen.getByText('ReportDetailDepreciation Component')).toBeInTheDocument();
  });
});
