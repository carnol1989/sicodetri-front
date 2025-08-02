// src/__tests__/unit/components/ReportTemplate.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportTemplate from '../../../components/ReportTemplate';

// ----- 1) Mock del hook useReport -----
import useReport from '../../../hooks/useReport';
jest.mock('../../../hooks/useReport');

// ----- 2) Mock de CustomDatePicker -----
jest.mock('../../../components/CustomDatePicker', () => {
  // recibe props: { selected, onChange, dateFormat }
  return ({ onChange, dateFormat }) => (
    <button
      data-testid={`datepicker-${dateFormat}`}
      onClick={() => onChange(`changed-${dateFormat}`)}
    >
      {dateFormat}
    </button>
  );
});

describe('ReportTemplate', () => {
  const mockSetYear = jest.fn();
  const mockSetMainCode = jest.fn();
  const mockSetAccountingAcc = jest.fn();
  const mockSetStartAcq = jest.fn();
  const mockSetEndAcq = jest.fn();
  const mockSetStartUse = jest.fn();
  const mockSetEndUse = jest.fn();
  const mockGenerate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // estado por defecto: disabled = true, progress = 42, un solo withYear = false
    useReport.mockReturnValue({
      progress: 42,
      year: 'initial-year',
      setYear: mockSetYear,
      mainCode: 'MC0',
      setMainCode: mockSetMainCode,
      accountingAccount: 'AC0',
      setAccountingAccount: mockSetAccountingAcc,
      startAcq: null,
      setStartAcq: mockSetStartAcq,
      endAcq: null,
      setEndAcq: mockSetEndAcq,
      startUse: null,
      setStartUse: mockSetStartUse,
      endUse: null,
      setEndUse: mockSetEndUse,
      disabled: true,
      generate: mockGenerate,
    });
  });

  it('1) renders without year picker and button disabled', () => {
    render(<ReportTemplate title="T" option="opt" withYear={false} />);
    // … tus aserciones existentes …
  });

  it('2) setters de texto y datepickers se disparan correctamente', () => {
    render(<ReportTemplate title="T" option="opt" withYear={false} />);

    // Inputs de texto…
    const [mainInput, accInput] = screen.getAllByRole('textbox');
    fireEvent.change(mainInput, { target: { value: 'nuevoMC' } });
    expect(mockSetMainCode).toHaveBeenCalledWith('nuevoMC');

    fireEvent.change(accInput, { target: { value: 'nuevoAC' } });
    expect(mockSetAccountingAcc).toHaveBeenCalledWith('nuevoAC');

    // Ahora sí recogemos los 4 pickers “yyyy-MM-dd”
    const datepickers = screen.getAllByTestId('datepicker-yyyy-MM-dd');
    expect(datepickers).toHaveLength(4);

    fireEvent.click(datepickers[0]);
    expect(mockSetStartAcq).toHaveBeenCalledWith('changed-yyyy-MM-dd');

    fireEvent.click(datepickers[1]);
    expect(mockSetEndAcq).toHaveBeenCalledWith('changed-yyyy-MM-dd');

    fireEvent.click(datepickers[2]);
    expect(mockSetStartUse).toHaveBeenCalledWith('changed-yyyy-MM-dd');

    fireEvent.click(datepickers[3]);
    expect(mockSetEndUse).toHaveBeenCalledWith('changed-yyyy-MM-dd');
  });

  it('3) withYear=true muestra year picker y setYear', () => {
    render(<ReportTemplate title="T" option="opt" withYear={true} />);
    const yearBtn = screen.getByTestId('datepicker-yyyy');
    expect(yearBtn).toBeInTheDocument();

    fireEvent.click(yearBtn);
    expect(mockSetYear).toHaveBeenCalledWith('changed-yyyy');
  });

  it('4) habilita botón Exportar cuando disabled=false y llama generate', () => {
    // forzamos sólo en este test disabled=false
    useReport.mockReturnValueOnce({
      progress: 42,
      year: 'initial-year',
      setYear: mockSetYear,
      mainCode: 'MC0',
      setMainCode: mockSetMainCode,
      accountingAccount: 'AC0',
      setAccountingAccount: mockSetAccountingAcc,
      startAcq: null,
      setStartAcq: mockSetStartAcq,
      endAcq: null,
      setEndAcq: mockSetEndAcq,
      startUse: null,
      setStartUse: mockSetStartUse,
      endUse: null,
      setEndUse: mockSetEndUse,
      disabled: false, // aquí
      generate: mockGenerate,
    });

    render(<ReportTemplate title="T" option="opt" withYear={false} />);
    const btn = screen.getByRole('button', { name: /exportar/i });
    expect(btn).not.toHaveClass('disabled');
    expect(btn).not.toBeDisabled();

    fireEvent.click(btn);
    expect(mockGenerate).toHaveBeenCalledTimes(1);
  });

  it('5) omitir withYear usa el valor por defecto (false) y no renderiza el selector de año', () => {
    // useReport ya está mockeado en el beforeEach con disabled=true, progress=42, etc.
    render(<ReportTemplate title="T" option="opt" />);
    // Como withYear === false, no debe haber botón para datepicker de "yyyy":
    expect(screen.queryByTestId('datepicker-yyyy')).toBeNull();
    // Todo lo demás debe seguir igual al caso explicit false:
    // – los inputs de código y cuenta
    const [mainInput, accInput] = screen.getAllByRole('textbox');
    expect(mainInput).toHaveValue('MC0');
    expect(accInput).toHaveValue('AC0');
    // – el progressbar
    const prog = screen.getByRole('progressbar');
    expect(prog).toHaveAttribute('aria-valuenow', '42');
    expect(prog.style.width).toBe('42%');
    // – y el botón "Exportar" sigue deshabilitado
    const btn = screen.getByRole('button', { name: /exportar/i });
    expect(btn).toBeDisabled();
  });
});
