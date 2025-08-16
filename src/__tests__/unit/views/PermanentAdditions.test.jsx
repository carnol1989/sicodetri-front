// src/__tests__/unit/views/PermanentAdditions.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import PermanentAdditions from '../../../views/PermanentAdditions';
import ProjectionGenerator from '../../../components/ProjectionGenerator';
import FinancialFixedAssetService from '../../../services/FinancialFixedAssetService';

// Mockeamos ProjectionGenerator para poder inspeccionar sus props
jest.mock('../../../components/ProjectionGenerator', () => jest.fn(() => null));

describe('PermanentAdditions component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar ProjectionGenerator exactamente una vez', () => {
    render(<PermanentAdditions />);
    expect(ProjectionGenerator).toHaveBeenCalledTimes(1);
  });

  it('le pasa a ProjectionGenerator los props correctos', () => {
    render(<PermanentAdditions />);
    const [[props]] = ProjectionGenerator.mock.calls;

    expect(props.title).toBe('Generación de Adiciones Permanentes');
    expect(props.serviceFn).toBe(FinancialFixedAssetService.generatePermanentAdditionsService);
    expect(props.param).toBe('332');
  });

  it('coincide con el snapshot', () => {
    const { asFragment } = render(<PermanentAdditions />);
    expect(asFragment()).toMatchSnapshot();
  });
});
