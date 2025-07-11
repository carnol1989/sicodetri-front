import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react';
import ProjectionGenerator from './ProjectionGenerator';

jest.mock('./CustomDatePicker', () => {
  return ({ onChange }) => (
    <button
      data-testid="datepicker"
      onClick={() => onChange(new Date('2025-07-11'))}
    >
      Select Period
    </button>
  );
});

describe('ProjectionGenerator', () => {
  const title = 'Mi Título';
  const param = 'ABC';

  it('1) inicial: muestra título, botón con clase disabled, sin progress ni alert', () => {
    const dummyService = jest.fn();
    render(
      <ProjectionGenerator title={title} serviceFn={dummyService} param={param} />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /generar proyección/i });
    expect(button).toHaveClass('disabled');           // <── cambiado
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('2) genera sin periodo muestra solo la alerta de validación', async () => {
    const dummyService = jest.fn();
    render(
      <ProjectionGenerator title={title} serviceFn={dummyService} param={param} />
    );

    const button = screen.getByRole('button', { name: /generar proyección/i });
    fireEvent.click(button);                          // ahora SI dispara generate()

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveClass('alert', 'alert-danger');
    expect(alert).toHaveTextContent('Por favor seleccione un periodo.');
    expect(dummyService).not.toHaveBeenCalled();
  });

  it('3) generación exitosa actualiza progress y alerta success', async () => {
    const serviceFn = jest.fn((periodFormatted, p, cb) => {
      cb({ lengthComputable: true, loaded: 50, total: 100 });
      return Promise.resolve({ data: { code: '00', message: 'Éxito' } });
    });

    render(
      <ProjectionGenerator title={title} serviceFn={serviceFn} param={param} />
    );

    fireEvent.click(screen.getByTestId('datepicker'));
    fireEvent.click(screen.getByRole('button', { name: /generar proyección/i }));

    await waitFor(() => {
      expect(serviceFn).toHaveBeenCalledWith(
        '2025-07-11',
        param,
        expect.any(Function)
      );
    });

    await waitFor(() => {
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(progress.style.width).toBe('50%');
    });

    const successAlert = screen.getByRole('alert');
    expect(successAlert).toHaveClass('alert', 'alert-success');
    expect(successAlert).toHaveTextContent('Éxito');
  });

  it('4) fallo en serviceFn muestra alerta de error y resetea progreso', async () => {
    const serviceFn = jest.fn((periodFormatted, p, cb) => {
      cb({ lengthComputable: true, loaded: 30, total: 100 });
      return Promise.reject(new Error('fail'));
    });

    render(
      <ProjectionGenerator title={title} serviceFn={serviceFn} param={param} />
    );

    fireEvent.click(screen.getByTestId('datepicker'));
    fireEvent.click(screen.getByRole('button', { name: /generar proyección/i }));

    await waitFor(() => {
      expect(serviceFn).toHaveBeenCalledWith(
        '2025-07-11',
        param,
        expect.any(Function)
      );
    });

    await waitFor(() => {
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress.style.width).toBe('0%');
    });

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveClass('alert', 'alert-danger');
    expect(errorAlert).toHaveTextContent('No se pudo generar la proyección.');
  });

  it('5) no actualiza progreso cuando lengthComputable es false y luego maneja éxito', async () => {
    // 1) serviceFn que llama al callback con lengthComputable:false
    const serviceFn = jest.fn((periodFormatted, p, cb) => {
      cb({ lengthComputable: false, loaded: 500, total: 1000 });
      return Promise.resolve({ data: { code: '00', message: 'Listo' } });
    });

    render(
      <ProjectionGenerator title={title} serviceFn={serviceFn} param={param} />
    );

    // 2) Seleccionamos período y disparamos generación
    fireEvent.click(screen.getByTestId('datepicker'));
    fireEvent.click(screen.getByRole('button', { name: /generar proyección/i }));

    // 3) Esperamos a que se llame al servicio
    await waitFor(() => {
      expect(serviceFn).toHaveBeenCalledWith(
        '2025-07-11',
        param,
        expect.any(Function)
      );
    });

    // 4) Verificamos que el progressbar NO subió (permanece en 0%)
    await waitFor(() => {
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress.style.width).toBe('0%');
    });

    // 5) Y se muestra la alerta de éxito con el mensaje retornado
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert', 'alert-success');
    expect(alert).toHaveTextContent('Listo');
  });
});