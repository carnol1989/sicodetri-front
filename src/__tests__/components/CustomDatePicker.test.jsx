// src/__tests__/components/CustomDatePicker.test.jsx
import React from 'react';
import { render, screen, createEvent, fireEvent, within } from '@testing-library/react';

// ----- MOCK de react-datepicker con mocks internos -----
jest.mock('react-datepicker', () => {
  const React = require('react');

  // Mocks definidos y exportados en el mismo factory
  const changeYearMock = jest.fn();
  const changeMonthMock = jest.fn();
  const decreaseMonthMock = jest.fn();
  const increaseMonthMock = jest.fn();

  return {
    __esModule: true,
    changeYearMock,
    changeMonthMock,
    decreaseMonthMock,
    increaseMonthMock,
    default: ({
      renderMonthContent,
      renderCustomHeader,
      className,
      placeholderText,
      onKeyDown,
    }) => {
      // 1) Simula renderMonthContent
      const monthSpan = renderMonthContent(0, 'Sh', 'Long', new Date(2021, 0, 1));
      // 2) Simula renderCustomHeader con los mocks
      const header = renderCustomHeader({
        date: new Date(2021, 0, 1),
        changeYear: changeYearMock,
        changeMonth: changeMonthMock,
        decreaseMonth: decreaseMonthMock,
        increaseMonth: increaseMonthMock,
        prevMonthButtonDisabled: false,
        nextMonthButtonDisabled: false,
      });
      // 3) Devuelve el HTML mínimo
      return (
        <div>
          {header}
          {monthSpan}
          <input
            data-testid="datepicker"
            className={className}
            placeholder={placeholderText}
            onKeyDown={onKeyDown}
          />
        </div>
      );
    },
  };
});

// Importamos los spies para poder asertar sus llamadas
import {
  changeYearMock,
  changeMonthMock,
  decreaseMonthMock,
  increaseMonthMock,
} from 'react-datepicker';

import CustomDatePicker from '../../components/CustomDatePicker';

describe('CustomDatePicker', () => {
  const currentYear = new Date().getFullYear();
  const defaultPlaceholder = 'Seleccione un mes y año';
  const yearCount = currentYear - 1990 + 1;

  beforeEach(() => {
    changeYearMock.mockClear();
    changeMonthMock.mockClear();
    decreaseMonthMock.mockClear();
    increaseMonthMock.mockClear();
  });

  it('1) default ("yyyy-MM") placeholder, clase, opciones de año y flechas funcionan', () => {
    render(<CustomDatePicker selected={null} onChange={() => {}} />);

    const input = screen.getByPlaceholderText(defaultPlaceholder);
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('form-control');

    // Un solo <select> de años
    const [yearSelect] = screen.getAllByRole('combobox');
    const options = within(yearSelect).getAllByRole('option');
    expect(options).toHaveLength(yearCount);

    // Cambio de año
    fireEvent.change(yearSelect, { target: { value: options[1].value } });
    expect(changeYearMock).toHaveBeenCalledWith(Number(options[1].value));

    // Flechas de mes
    fireEvent.click(screen.getByText('<'));
    expect(decreaseMonthMock).toHaveBeenCalled();
    fireEvent.click(screen.getByText('>'));
    expect(increaseMonthMock).toHaveBeenCalled();
  });

  it('2) renderMonthContent construye <span> con title y contenido', () => {
    render(<CustomDatePicker selected={null} onChange={() => {}} />);
    const span = screen.getByTitle('Tooltip for month: Long 2021');
    expect(span).toHaveTextContent('Sh');
  });

  it('3) dateFormat="yyyy-MM-dd" placeholder, cambio de año y de mes', () => {
    const placeholder = 'Seleccione una fecha';
    render(
      <CustomDatePicker
        selected={new Date(2020, 1, 10)}
        onChange={() => {}}
        dateFormat="yyyy-MM-dd"
      />,
    );
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();

    // Dos <select>: año y mes
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);

    // 3a) Cambio de año en el primer <select>
    const yearSelect = selects[0];
    const yearOptions = within(yearSelect).getAllByRole('option');
    expect(yearOptions).toHaveLength(yearCount);
    fireEvent.change(yearSelect, { target: { value: yearOptions[1].value } });
    expect(changeYearMock).toHaveBeenCalledWith(Number(yearOptions[1].value));

    // 3b) Cambio de mes en el segundo <select>
    const monthSelect = selects[1];
    const monthOptions = within(monthSelect).getAllByRole('option');
    expect(monthOptions).toHaveLength(12);
    fireEvent.change(monthSelect, { target: { value: monthOptions[2].value } });
    expect(changeMonthMock).toHaveBeenCalledWith(2);
  });

  it('4) dateFormat="yyyy" placeholder y header estático sin <select>', () => {
    const placeholder = 'Seleccione un año';
    render(<CustomDatePicker selected={null} onChange={() => {}} dateFormat="yyyy" />);
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();

    expect(screen.getByText('1990')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getAllByText(String(currentYear)).length).toBeGreaterThan(0);

    // No debe haber <select> alguno
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('5) onKeyDown previene default', () => {
    render(<CustomDatePicker selected={null} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(defaultPlaceholder);
    const ev = createEvent.keyDown(input, { key: 'A' });
    input.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
  });
});
