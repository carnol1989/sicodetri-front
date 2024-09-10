import React from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';

const CustomDatePicker = ({ selected, onChange, dateFormat = "yyyy-MM" }) => {
    const years = Array.from({ length: getYear(new Date()) - 1990 + 1 }, (_, i) => 1990 + i);
    const firstYear = years[0];
    const lastYear = years[years.length - 1];

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
                              changeMonth,
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
            {dateFormat === "yyyy-MM-dd" && (
                <>
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
                    <select
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                        }
                    >
                        {months.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        {">"}
                    </button>
                </>
            )}
            {dateFormat === "yyyy-MM" && (
                <>
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
                </>
            )}
            {dateFormat === "yyyy" && (
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
            showYearPicker={dateFormat === "yyyy"}
            showMonthYearPicker={dateFormat === "yyyy-MM"}
            dateFormat={dateFormat}
            renderMonthContent={(month, shortMonth, longMonth, day) =>
                renderMonthContent(month, shortMonth, longMonth, day)
            }
            renderCustomHeader={(props) => <CustomHeader {...props} />}
            className="form-control"
            placeholderText={dateFormat === "yyyy-MM-dd" ? "Seleccione una fecha" : dateFormat === "yyyy" ? "Seleccione un año" : "Seleccione un mes y año"}
            onKeyDown={(e) => e.preventDefault()} // Deshabilita la entrada por teclado
            showYearDropdown={dateFormat !== "yyyy-MM"}
            showMonthDropdown={dateFormat === "yyyy-MM-dd"}
        />
    );
};

export default CustomDatePicker;