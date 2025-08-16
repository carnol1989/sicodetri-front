// src/__tests__/unit/views/TemporaryDeductions.test.jsx
import { render } from '@testing-library/react';
import TemporaryDeductions from '../../../views/TemporaryDeductions';
import ProjectionGenerator from '../../../components/ProjectionGenerator';
import FinancialFixedAssetService from '../../../services/FinancialFixedAssetService';

jest.mock('../../../components/ProjectionGenerator', () => jest.fn(() => null));

describe('TemporaryDeductions component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar ProjectionGenerator exactamente una vez', () => {
    render(<TemporaryDeductions />);
    expect(ProjectionGenerator).toHaveBeenCalledTimes(1);
  });

  it('se pasa a ProjectionGenerator los props correctos', () => {
    render(<TemporaryDeductions />);
    const [[props]] = ProjectionGenerator.mock.calls;

    expect(props.title).toBe('Generación de Deducciones Temporales');
    expect(props.serviceFn).toBe(FinancialFixedAssetService.generateTemporaryDeductionsService);
    expect(props.param).toBe('332');
  });

  it('coincide con el snapshot', () => {
    const { asFragment } = render(<TemporaryDeductions />);
    expect(asFragment()).toMatchSnapshot();
  });
});
