// src/__tests__/unit/views/FileUpload.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import FileUpload from '../../../views/FileUpload';
import FinancialFixedAssetService from '../../../services/FinancialFixedAssetService';

// Mock de CustomDatePicker como un input de tipo date
jest.mock('../../../components/CustomDatePicker', () => (props) => (
  <input
    data-testid="datepicker"
    type="date"
    value={props.selected ? props.selected.toISOString().substr(0, 10) : ''}
    onChange={(e) => props.onChange(new Date(e.target.value))}
  />
));

// Mock de FinancialFixedAssetService
jest.mock('../../../services/FinancialFixedAssetService', () => ({
  uploadService: jest.fn(),
  saveService: jest.fn(),
}));

describe('FileUpload Component', () => {
  beforeEach(() => {
    FinancialFixedAssetService.uploadService.mockReset();
    FinancialFixedAssetService.saveService.mockReset();
  });

  function setup() {
    const utils = render(<FileUpload />);
    const fileInput = utils.container.querySelector('input[type="file"]');
    const dateInput = screen.getByTestId('datepicker');
    // <--- Aquí usamos getByRole en vez de getByText
    const uploadBtn = screen.getByRole('button', { name: 'Subir Archivo' });
    const saveBtn = screen.getByRole('button', { name: 'Guardar Información' });
    return { ...utils, fileInput, dateInput, uploadBtn, saveBtn };
  }

  test('botones inician deshabilitados', () => {
    const { uploadBtn, saveBtn } = setup();
    expect(uploadBtn).toBeDisabled();
    expect(saveBtn).toBeDisabled();
  });

  test('muestra error si trato de subir sin periodo', async () => {
    const { fileInput, uploadBtn } = setup();
    // selecciono archivo pero no periodo
    const file = new File(['hola'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    // ahora el botón de subir se habilita (periodo sigue vacío, pero disabled chequea selectedFiles&&period)
    // en este caso, como period es falsy, el onClick no dispara uploadService, sino el mensaje
    await act(async () => {
      fireEvent.click(uploadBtn);
    });
    expect(FinancialFixedAssetService.uploadService).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent('Por favor seleccione un periodo.');
    expect(screen.getByRole('alert')).toHaveClass('alert-danger');
  });

  test('subida exitosa muestra progreso, mensaje y habilita guardar', async () => {
    FinancialFixedAssetService.uploadService.mockImplementation((file, period, onProgress) => {
      // Simular progreso
      onProgress({ loaded: 20, total: 100 });
      onProgress({ loaded: 100, total: 100 });
      return Promise.resolve({ data: { code: '00', message: 'Upload OK' } });
    });

    const { fileInput, dateInput, uploadBtn, saveBtn, container } = setup();
    // seteo periodo
    fireEvent.change(dateInput, { target: { value: '2025-07-01' } });
    // seteo archivo
    const file = new File(['datos'], 'data.xlsx', { type: 'application/vnd.ms-excel' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // ahora uploadBtn está habilitado
    expect(uploadBtn).toBeEnabled();
    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    // progres bar aparece con 100%
    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toHaveStyle('width: 100%');
    expect(progressBar).toHaveTextContent('100%');

    // mensaje de éxito
    expect(await screen.findByRole('alert')).toHaveTextContent('Upload OK');
    expect(screen.getByRole('alert')).toHaveClass('alert-success');

    // verifica que el servicio se llamó con fecha formateada
    expect(FinancialFixedAssetService.uploadService).toHaveBeenCalledWith(
      file,
      '2025-07-01',
      expect.any(Function),
    );

    // botón de guardar ahora habilitado
    expect(saveBtn).toBeEnabled();
  });

  test('error en subida resetea estado y muestra mensaje', async () => {
    FinancialFixedAssetService.uploadService.mockRejectedValue(new Error('fail'));

    const { fileInput, dateInput, uploadBtn, saveBtn } = setup();
    // seteo periodo y archivo
    fireEvent.change(dateInput, { target: { value: '2025-07-02' } });
    const file = new File(['x'], 'x.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    // mensaje de error
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo subir el archivo.');
    expect(screen.getByRole('alert')).toHaveClass('alert-danger');

    // estado reseteado: guardar debe estar deshabilitado
    expect(saveBtn).toBeDisabled();
  });

  test('guardar exitoso muestra mensaje y progreso', async () => {
    FinancialFixedAssetService.uploadService.mockResolvedValue({
      data: { code: '00', message: 'OK' },
    });
    FinancialFixedAssetService.saveService.mockImplementation((period, onProgress) => {
      onProgress({ loaded: 50, total: 200 });
      onProgress({ loaded: 200, total: 200 });
      return Promise.resolve({ data: { code: '00', message: 'Save OK' } });
    });

    const { fileInput, dateInput, uploadBtn, saveBtn, container } = setup();
    // primero subir para habilitar guardar
    fireEvent.change(dateInput, { target: { value: '2025-07-03' } });
    const file = new File(['1'], '1.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await act(async () => fireEvent.click(uploadBtn));
    await waitFor(() => screen.getByRole('alert'));

    // ahora guardar
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    // progreso de guardado
    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toHaveStyle('width: 100%');
    expect(progressBar).toHaveTextContent('100%');

    // mensaje de guardado
    expect(await screen.findByRole('alert')).toHaveTextContent('Save OK');
    expect(screen.getByRole('alert')).toHaveClass('alert-success');

    expect(FinancialFixedAssetService.saveService).toHaveBeenCalledWith(
      '2025-07-03',
      expect.any(Function),
    );
  });

  test('error en guardar resetea estado y muestra mensaje', async () => {
    FinancialFixedAssetService.uploadService.mockResolvedValue({
      data: { code: '00', message: 'OK' },
    });
    FinancialFixedAssetService.saveService.mockRejectedValue(new Error('fail save'));

    const { fileInput, dateInput, uploadBtn, saveBtn } = setup();
    // subir
    fireEvent.change(dateInput, { target: { value: '2025-07-04' } });
    const file = new File(['abc'], 'abc.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await act(async () => fireEvent.click(uploadBtn));
    await waitFor(() => screen.getByRole('alert'));

    // guardar
    await act(async () => fireEvent.click(saveBtn));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo guardar la información.',
    );
    expect(screen.getByRole('alert')).toHaveClass('alert-danger');

    // tras error, save vuelve a deshabilitarse
    expect(saveBtn).toBeDisabled();
  });

  test('muestra error si trato de guardar sin periodo', async () => {
    const { fileInput, saveBtn } = setup();

    // 1) selecciono archivo (period sigue vacío)
    const file = new File(['contenido'], 'archivo.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 2) hago click en "Guardar Información" sin periodo
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    // no debe llamar al servicio de guardado
    expect(FinancialFixedAssetService.saveService).not.toHaveBeenCalled();

    // debe mostrar la alerta de periodo faltante
    expect(await screen.findByRole('alert')).toHaveTextContent('Por favor seleccione un periodo.');
    expect(screen.getByRole('alert')).toHaveClass('alert-danger');
  });
});
