/**
 * Custom date picker component for SICODETRI-FRONT. <br/>
 * Provides a wrapped {@link DatePicker} with customized headers, localized months,
 * and controlled formats for year, month-year, or full date selection. <br/>
 * Path: src/components/CustomDatePicker.js
 *
 * @module CustomDatePicker
 * @requires module: react
 * @requires module: react-datepicker
 * @requires module:date-fns
 *
 * <b>Component</b>: {@link CustomDatePicker} <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 * <b>Company</b>: EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
 *   <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>: <br/>
 * <ul>
 *   <li>Jun 06, 2025 (JSX) Component creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import React from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';

/**
 * Props for {@link CustomDatePicker}.
 *
 * @typedef {Object} CustomDatePickerProps
 * @property {?Date} selected - Selected date value.
 * @property {function(Date):void} onChange - Callback invoked when date changes.
 * @property {string} [dateFormat='yyyy-MM'] - Date format to display (`yyyy-MM`, `yyyy-MM-dd`, or `yyyy`).
 */

/**
 * CustomDatePicker component. <br/>
 * - Displays a date picker with configurable formats (`yyyy`, `yyyy-MM`, `yyyy-MM-dd`). <br/>
 * - Provides a custom header with year/month selectors and navigation buttons. <br/>
 * - Localizes months to Spanish. <br/>
 * - Disables manual keyboard input to ensure controlled selection. <br/>
 *
 * @function CustomDatePicker
 * @param {CustomDatePickerProps} props - Component props.
 * @returns {JSX.Element} Rendered date picker with custom UI.
 *
 * @example
 * import CustomDatePicker from '../components/CustomDatePicker';
 *
 * function Example() {
 *   const [date, setDate] = useState(new Date());
 *
 *   return (
 *     <CustomDatePicker
 *       selected={date}
 *       onChange={setDate}
 *       dateFormat="yyyy-MM"
 *     />
 *   );
 * }
 */
const CustomDatePicker = ({ selected, onChange, dateFormat = 'yyyy-MM' }) => {
  const years = Array.from({ length: getYear(new Date()) - 1990 + 1 }, (_, i) => 1990 + i);
  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const renderMonthContent = (month, shortMonth, longMonth, day) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
    return <span title={tooltipText}>{shortMonth}</span>;
  };

  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div
      style={{
        margin: 10,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {dateFormat === 'yyyy-MM-dd' && (
        <>
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {'<'}
          </button>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(Number(value))}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {'>'}
          </button>
        </>
      )}
      {dateFormat === 'yyyy-MM' && (
        <>
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {'<'}
          </button>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(Number(value))}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {'>'}
          </button>
        </>
      )}
      {dateFormat === 'yyyy' && (
        <>
          <span>{firstYear}</span>
          <span> - </span>
          <span>{lastYear}</span>
        </>
      )}
    </div>
  );

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showYearPicker={dateFormat === 'yyyy'}
      showMonthYearPicker={dateFormat === 'yyyy-MM'}
      dateFormat={dateFormat}
      renderMonthContent={(month, shortMonth, longMonth, day) =>
        renderMonthContent(month, shortMonth, longMonth, day)
      }
      renderCustomHeader={(props) => <CustomHeader {...props} />}
      className="form-control"
      placeholderText={
        dateFormat === 'yyyy-MM-dd'
          ? 'Seleccione una fecha'
          : dateFormat === 'yyyy'
            ? 'Seleccione un año'
            : 'Seleccione un mes y año'
      }
      onKeyDown={(e) => e.preventDefault()} // Deshabilita la entrada por teclado
      showYearDropdown={dateFormat !== 'yyyy-MM'}
      showMonthDropdown={dateFormat === 'yyyy-MM-dd'}
    />
  );
};

export default CustomDatePicker;
