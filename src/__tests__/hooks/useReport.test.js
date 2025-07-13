// src/__tests__/hooks/useReport.test.js

// 1) Forzamos la zona horaria a UTC para eliminar offsets de fecha
process.env.TZ = 'UTC';

import React from 'react';
import { render, act } from '@testing-library/react';
import useReport from '../../hooks/useReport';
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';

function HookTest({ option, withYear, onRender }) {
  const api = useReport(option, withYear);
  onRender(api);
  return null;
}

describe('useReport (React 18 + RTL)', () => {
  let hookApi;

  beforeEach(() => {
    hookApi = null;
  });

  it('inicializa correctamente con withYear=false', () => {
    render(
      <HookTest
        option="OPT"
        withYear={false}
        onRender={api => (hookApi = api)}
      />
    );
    expect(hookApi.progress).toBe(0);
    expect(hookApi.year).toEqual(new Date('1900'));
    expect(hookApi.disabled).toBe(true);
  });

  it('activa el botón cuando se ponen todas las fechas (withYear=true)', () => {
    render(
      <HookTest
        option="OPT"
        withYear={true}
        onRender={api => (hookApi = api)}
      />
    );

    act(() => {
      hookApi.setYear(    new Date(2022, 0, 1)); // 1 ene 2022
      hookApi.setStartAcq(new Date(2022, 1, 1)); // 1 feb 2022
      hookApi.setEndAcq(  new Date(2022, 2, 1)); // 1 mar 2022
      hookApi.setStartUse(new Date(2022, 3, 1)); // 1 abr 2022
      hookApi.setEndUse(  new Date(2022, 4, 1)); // 1 may 2022
    });

    expect(hookApi.disabled).toBe(false);
  });

  it('llama a generateReportsService y actualiza progress', async () => {
    const mockGen = jest.fn((opt, yearF, mc, ac, sa, ea, su, eu, onProg) => {
      onProg({ lengthComputable: true, loaded: 40, total: 200 });
      return Promise.resolve();
    });
    FinancialFixedAssetService.generateReportsService = mockGen;

    render(
      <HookTest
        option="XYZ"
        withYear={true}
        onRender={api => (hookApi = api)}
      />
    );
    expect(hookApi).not.toBeNull();

    act(() => {
      hookApi.setYear(    new Date(2023, 7, 20)); // 20 ago 2023
      hookApi.setStartAcq(new Date(2023, 8, 1));  //  1 sep 2023
      hookApi.setEndAcq(  new Date(2023, 8, 30)); // 30 sep 2023
      hookApi.setStartUse(new Date(2023, 9, 1));  //  1 oct 2023
      hookApi.setEndUse(  new Date(2023, 9, 31)); // 31 oct 2023 <― aquí estaba el día equivocado
    });

    await act(async () => {
      await hookApi.generate();
    });

    expect(mockGen).toHaveBeenCalledWith(
      'XYZ',
      '2023',
      '',
      '',
      '2023-09-01',
      '2023-09-30',
      '2023-10-01',
      '2023-10-31',
      expect.any(Function)
    );
    expect(hookApi.progress).toBe(20);
  });

  it('no actualiza progress si lengthComputable es false', async () => {
    const mockGenFalse = jest.fn((opt, yearF, mc, ac, sa, ea, su, eu, onProg) => {
      onProg({ lengthComputable: false, loaded: 50, total: 100 });
      return Promise.resolve();
    });
    FinancialFixedAssetService.generateReportsService = mockGenFalse;

    render(
      <HookTest
        option="NOP"
        withYear={false}
        onRender={api => (hookApi = api)}
      />
    );
    expect(hookApi).not.toBeNull();

    act(() => {
      // 1) forzamos el año en horario local para que salga "1900"
      hookApi.setYear(new Date(1900, 0, 1));
      // 2) usamos el constructor numérico para las fechas
      hookApi.setStartAcq(new Date(2021, 0, 1));  // 1 ene 2021
      hookApi.setEndAcq(  new Date(2021, 0, 2));  // 2 ene 2021
      hookApi.setStartUse(new Date(2021, 0, 3));  // 3 ene 2021
      hookApi.setEndUse(  new Date(2021, 0, 4));  // 4 ene 2021
    });

    await act(async () => {
      await hookApi.generate();
    });

    expect(mockGenFalse).toHaveBeenCalledWith(
      'NOP',
      '1900',
      '',
      '',
      '2021-01-01',
      '2021-01-02',
      '2021-01-03',
      '2021-01-04',
      expect.any(Function)
    );
    // como lengthComputable = false, el progress debe mantenerse en 0
    expect(hookApi.progress).toBe(0);
  });
});
