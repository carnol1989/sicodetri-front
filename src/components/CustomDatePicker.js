import React from 'react';
import DatePicker from 'react-datepicker';
import { getYear } from 'date-fns';

const CustomDatePicker = ({ selected, onChange }) => {
    const years = Array.from({ length: getYear(new Date()) - 1990 + 1 }, (_, i) => 1990 + i);
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const renderMonthContent = (month, shortMonth, longMonth, day) => {
        const fullYear = new Date(day).getFullYear();
        const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
        return <span title={tooltipText}>{shortMonth}</span>;
    };

    const CustomHeader = ({
                              date,
                              changeYear,
                              decreaseMonth,
                              increaseMonth,
                              prevMonthButtonDisabled,
                              nextMonthButtonDisabled,
                          }) => (
        <div
            style={{
                margin: 10,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                {"<"}
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
                {">"}
            </button>
        </div>
    );

    return (
        <DatePicker
            selected={selected}
            onChange={onChange}
            showMonthYearPicker
            dateFormat="yyyy-MM"
            renderMonthContent={(month, shortMonth, longMonth, day) =>
                renderMonthContent(month, shortMonth, longMonth, day)
            }
            renderCustomHeader={(props) => <CustomHeader {...props} />}
            className="form-control"
            placeholderText="Seleccione un mes y año"
            onKeyDown={(e) => e.preventDefault()} // Deshabilita la entrada por teclado
        />
    );
};

export default CustomDatePicker;