// src/__tests__/services/FinancialFixedAssetService.test.js

// 1) Fijamos la env var ANTES de cualquier import
process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS = '/financial-fixed-assets';

import http from '../../http-common';
import Service from '../../services/FinancialFixedAssetService';

describe('FinancialFixedAssetService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sube el archivo con éxito', async () => {
    const dummy = { success: true };
    const postSpy = jest
      .spyOn(http, 'post')
      .mockResolvedValue({ data: dummy });

    const file = new File(['a'], 'test.xlsx');
    const onUploadProgress = jest.fn();

    const resp = await Service.uploadService(file, '2025-01', onUploadProgress);

    expect(postSpy).toHaveBeenCalledWith(
      '/financial-fixed-assets/upload?period=2025-01',
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      })
    );
    expect(resp.data).toEqual(dummy);
  });

  it('guarda datos con saveService correctamente', async () => {
    const dummy = { saved: true };
    const postSpy = jest
      .spyOn(http, 'post')
      .mockResolvedValue({ data: dummy });

    const onUploadProgress = jest.fn();
    const resp = await Service.saveService('2025-03', onUploadProgress);

    expect(postSpy).toHaveBeenCalledWith(
      '/financial-fixed-assets?period=2025-03',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress,
      })
    );
    expect(resp.data).toEqual(dummy);
  });

  it('genera deducciones temporales con generateTemporaryDeductionsService', async () => {
    const dummy = { deducciones: [] };
    const postSpy = jest
      .spyOn(http, 'post')
      .mockResolvedValue({ data: dummy });

    const onUploadProgress = jest.fn();
    const resp = await Service.generateTemporaryDeductionsService(
      '2025-04',
      'ACC1',
      onUploadProgress
    );

    expect(postSpy).toHaveBeenCalledWith(
      '/financial-fixed-assets/projection?type=TEMPORARY_DEDUCTIONS&period=2025-04&account=ACC1',
      {},
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress,
      })
    );
    expect(resp.data).toEqual(dummy);
  });

  it('genera adiciones temporales con generateTemporaryAdditionsService', async () => {
    const dummy = { additions: [] };
    const postSpy = jest
      .spyOn(http, 'post')
      .mockResolvedValue({ data: dummy });

    const onUploadProgress = jest.fn();
    const resp = await Service.generateTemporaryAdditionsService(
      '2025-05',
      'ACC2',
      onUploadProgress
    );

    expect(postSpy).toHaveBeenCalledWith(
      '/financial-fixed-assets/projection?type=TEMPORARY_ADDITIONS&period=2025-05&account=ACC2',
      {},
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress,
      })
    );
    expect(resp.data).toEqual(dummy);
  });

  it('genera adiciones permanentes con generatePermanentAdditionsService', async () => {
    const dummy = { permAdd: [] };
    const postSpy = jest
      .spyOn(http, 'post')
      .mockResolvedValue({ data: dummy });

    const onUploadProgress = jest.fn();
    const resp = await Service.generatePermanentAdditionsService(
      '2025-06',
      'ACC3',
      onUploadProgress
    );

    expect(postSpy).toHaveBeenCalledWith(
      '/financial-fixed-assets/projection?type=PERMANENT_ADDITIONS&period=2025-06&account=ACC3',
      {},
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress,
      })
    );
    expect(resp.data).toEqual(dummy);
  });

  it('genera reporte y dispara download', async () => {
    const fakeBlob = new Blob([''], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const headers = {
      'content-disposition': 'attachment; filename="reporte.xlsx"',
    };
    const getSpy = jest
      .spyOn(http, 'get')
      .mockResolvedValue({ data: fakeBlob, headers });

    // Polyfill de createObjectURL en JSDOM
    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:url');

    const realAnchor = document.createElement('a');
    const clickSpy = jest.fn();
    realAnchor.click = clickSpy;
    jest.spyOn(document, 'createElement').mockReturnValue(realAnchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation();

    await Service.generateReportsService(
      'X',
      '2025',
      '',
      '',
      '',
      '',
      '',
      '',
      () => {}
    );

    expect(getSpy).toHaveBeenCalledWith(
      '/financial-fixed-assets/report?' +
      'option=X&fileType=xlsx&year=2025&mainCode=&accountingAccount=' +
      '&startAcquisitionDate=&endAcquisitionDate=&startDateUse=&endDateUse=',
      expect.objectContaining({
        responseType: 'blob',
        onDownloadProgress: expect.any(Function),
      })
    );
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('lanza error cuando falla la descarga de reportes', async () => {
    // Forzamos error en http.get
    const networkError = new Error('network');
    jest.spyOn(http, 'get').mockRejectedValue(networkError);

    // Spy al console.error
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(
      Service.generateReportsService(
        'X',
        '2025',
        '',
        '',
        '',
        '',
        '',
        '',
        () => {}
      )
    ).rejects.toThrow('Error al descargar el reporte');

    expect(errorSpy).toHaveBeenCalledWith(
      'Error descargando el archivo:',
      networkError
    );
  });

  it('usa nombre de archivo por defecto si no hay Content-Disposition', async () => {
    const fakeBlob = new Blob([''], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    // headers sin content-disposition
    const getSpy = jest
      .spyOn(http, 'get')
      .mockResolvedValue({ data: fakeBlob, headers: {} });

    // polyfill createObjectURL
    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:url');

    // simulamos <a>
    const anchor = { setAttribute: jest.fn(), click: jest.fn(), href: '', download: '' };
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation();

    await Service.generateReportsService(
      'X',
      '2025',
      '',
      '',
      '',
      '',
      '',
      '',
      () => {}
    );

    expect(getSpy).toHaveBeenCalled();
    expect(anchor.setAttribute).toHaveBeenCalledWith('style', 'display:none');
    // al no haber header, download se queda en el valor por defecto
    expect(anchor.download).toBe('archivo.xlsx');
    expect(anchor.click).toHaveBeenCalled();
  });

  it('mantiene el nombre por defecto si Content-Disposition no coincide con el regex', async () => {
    const fakeBlob = new Blob([''], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    // header mal formado
    const getSpy = jest
      .spyOn(http, 'get')
      .mockResolvedValue({ data: fakeBlob, headers: {
          'content-disposition': 'inline; something=else'
        }});

    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:url');

    const anchor = { setAttribute: jest.fn(), click: jest.fn(), href: '', download: '' };
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation();

    await Service.generateReportsService(
      'X',
      '2025',
      '',
      '',
      '',
      '',
      '',
      '',
      () => {}
    );

    expect(getSpy).toHaveBeenCalled();
    // se ejecutó el .match() pero al no coincidir, download sigue por defecto
    expect(anchor.download).toBe('archivo.xlsx');
    expect(anchor.click).toHaveBeenCalled();
  });

  it('codifica parámetros especiales y dispara el callback onDownloadProgress', async () => {
    const fakeBlob = new Blob([''], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const headers = {
      'content-disposition': 'attachment; filename="special.xlsx"',
    };
    const progressSpy = jest.fn();

    // Mock de http.get simulando llamada a onDownloadProgress y devolviendo blob+headers
    const getSpy = jest
      .spyOn(http, 'get')
      .mockImplementation((url, config) => {
        // la URL debe contener los valores correctamente codificados
        expect(url).toContain('mainCode=A%26B%20C');        // "A&B C"
        expect(url).toContain('accountingAccount=C%2FD');   // "C/D"
        expect(url).toContain('startAcquisitionDate=2025-01-01');
        expect(url).toContain('endAcquisitionDate=2025-12-31');
        expect(url).toContain('startDateUse=2025-02-15');
        expect(url).toContain('endDateUse=2025-11-30');

        // debe inyectar la función wrapper
        expect(typeof config.onDownloadProgress).toBe('function');
        // simulamos un evento de progreso
        config.onDownloadProgress({ loaded: 123, total: 456 });
        return Promise.resolve({ data: fakeBlob, headers });
      });

    // Polyfill necesario para JSDOM
    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:url');

    // Stub del <a>
    const anchor = { setAttribute: jest.fn(), click: jest.fn(), href: '', download: '' };
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation();

    // Llamada con parámetros especiales (el noveno parámetro es nuestro progressSpy)
    await Service.generateReportsService(
      'OPT',
      '2025',
      'A&B C',
      'C/D',
      '2025-01-01',
      '2025-12-31',
      '2025-02-15',
      '2025-11-30',
      progressSpy
    );

    // El callback que pasó el usuario debe haberse llamado con el objeto que simulamos
    expect(progressSpy).toHaveBeenCalledWith({ loaded: 123, total: 456 });
    // Y la descarga se dispara igual
    expect(anchor.click).toHaveBeenCalled();
  });

  it('genera reporte sin callback de progreso (onDownloadProgress undefined)', async () => {
    const fakeBlob = new Blob([''], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const headers = {}; // no importa aquí
    const getSpy = jest
      .spyOn(http, 'get')
      // comprobamos que recibimos un config con onDownloadProgress aunque no lo pasemos
      .mockImplementation((url, config) => {
        expect(typeof config.onDownloadProgress).toBe('function');
        return Promise.resolve({ data: fakeBlob, headers });
      });

    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:url');

    const anchor = { setAttribute: jest.fn(), click: jest.fn(), href: '', download: '' };
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation();

    // Llamamos SIN el noveno parámetro
    await Service.generateReportsService(
      'OPT',
      '2025',
      '',
      '',
      '',
      '',
      '',
      '' // aquí onDownloadProgress queda undefined
    );

    expect(getSpy).toHaveBeenCalled();
    expect(anchor.click).toHaveBeenCalled();
  });

  it('no falla el wrapper onDownloadProgress cuando no se provee callback', async () => {
    const fakeBlob = new Blob([''], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const headers = {};

    // capturamos el config para luego llamar al wrapper
    let capturedConfig;
    jest
      .spyOn(http, 'get')
      .mockImplementation((url, config) => {
        capturedConfig = config;
        return Promise.resolve({ data: fakeBlob, headers });
      });

    // Polyfill JSDOM
    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:url');
    const anchor = { setAttribute: jest.fn(), click: jest.fn(), href: '', download: '' };
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation();

    // Llamamos SIN pasar el onDownloadProgress
    await Service.generateReportsService(
      'X', '2025', '', '', '', '', '', ''
    );

    // El wrapper debe existir y no romper al invocarlo
    expect(typeof capturedConfig.onDownloadProgress).toBe('function');
    expect(() => capturedConfig.onDownloadProgress({ loaded: 1, total: 2 })).not.toThrow();

    // Y la descarga sigue disparándose
    expect(anchor.click).toHaveBeenCalled();
  });
});
