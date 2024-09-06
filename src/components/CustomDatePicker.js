// src/components/CustomDatePicker.js

import React from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';

const CustomDatePicker = ({ selected, onChange }) => {
    const years = Array.from({ length: getYear(new Date()) - 1990 + 1 }, (_, i) => 1990 + i);
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat="yyyy-MM" // Formato de la fecha (Año-Mes)
            className="form-control"
            placeholderText="Seleccione un mes y año"
            onKeyDown={(e) => e.preventDefault()} // Deshabilita la entrada por teclado
            renderCustomHeader={({
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
                </div>
            )}
        />
    );
};

export default CustomDatePicker;