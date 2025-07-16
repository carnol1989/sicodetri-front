// src/__tests__/unit/views/TemporaryAdditions.test.jsx
import { render } from '@testing-library/react';
import TemporaryAdditions from '../../../views/TemporaryAdditions';
import ProjectionGenerator from '../../../components/ProjectionGenerator';
import FinancialFixedAssetService from '../../../services/FinancialFixedAssetService';

jest.mock('../../../components/ProjectionGenerator', () => jest.fn(() => null));

describe('TemporaryAdditions component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar ProjectionGenerator exactamente una vez', () => {
    render(<TemporaryAdditions />);
    expect(ProjectionGenerator).toHaveBeenCalledTimes(1);
  });

  it('se pasa a ProjectionGenerator los props correctos', () => {
    render(<TemporaryAdditions />);
    const [[props]] = ProjectionGenerator.mock.calls;

    expect(props.title).toBe('Generación de Adiciones Temporales');
    expect(props.serviceFn).toBe(
      FinancialFixedAssetService.generateTemporaryAdditionsService);
    expect(props.param).toBe('ALL');
  });

  it('coincide con el snapshot', () => {
    const { asFragment } = render(<TemporaryAdditions />);
    expect(asFragment()).toMatchSnapshot();
  })
});