import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import FinancialFixedAssetService from '../../src/services/FinancialFixedAssetService';

describe('FinancialFixedAssetService', () => {
  let mock;
  beforeAll(() => {
    mock = new AxiosMockAdapter(axios);
  });
  afterEach(() => {
    mock.reset();
  });
  afterAll(() => {
    mock.restore();
  });

  it('sube el archivo con éxito', async () => {
    const dummyResponse = { data: { success: true } };
    mock.onPost(/\/upload/).reply(200, dummyResponse);

    const file = new File(['a'], 'test.xlsx');
    const resp = await FinancialFixedAssetService.uploadService(file, '2025-01', () => {});
    expect(resp.data).toEqual(dummyResponse.data);
  });

  it('genera reporte y dispara download', async () => {
    // Simula un blob vacío y cabecera Content-Disposition
    const headers = { 'content-disposition': 'attachment; filename="reporte.xlsx"' };
    mock.onGet(/\/report\?/).reply(200, new Blob(), headers);

    // Como la función usa window.URL.createObjectURL, podemos espiar:
    const urlSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
    const clickSpy = jest.fn();
    jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
      setAttribute: () => {},
      style: '',
    });

    await FinancialFixedAssetService.generateReportsService('X', 2025, '', '', '', '', '', '');

    expect(urlSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });
});
