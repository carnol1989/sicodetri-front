// src/__tests__/unit/router/GlobalRouter.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import GlobalRouter from '../../../router/GlobalRouter';

// Mock de useAuth para controlar isPending
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from '../../../hooks/useAuth';

// Mock de PrivateRoute como passthrough (muestra children)
jest.mock('../../../components/PrivateRoute', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="private-route">{children}</div>,
}));

// Mocks de componentes usados en las rutas privadas
jest.mock('../../../views/Home', () => () => <div>Home Component</div>);
jest.mock('../../../components/NavBar', () => () => <div>NavBar Component</div>);
jest.mock('../../../views/FileUpload', () => () => <div>FileUpload Component</div>);
jest.mock('../../../views/TemporaryDeductions', () => () => (
  <div>TemporaryDeductions Component</div>
));
jest.mock('../../../views/TemporaryAdditions', () => () => <div>TemporaryAdditions Component</div>);
jest.mock('../../../views/PermanentAdditions', () => () => <div>PermanentAdditions Component</div>);
jest.mock('../../../views/ReportTaxBook', () => () => <div>ReportTaxBook Component</div>);
jest.mock('../../../views/ReportDetailDepreciation', () => () => (
  <div>ReportDetailDepreciation Component</div>
));

// Mocks de rutas públicas
jest.mock('../../../views/CallbackPage', () => () => <div>CallbackPage Component</div>);
jest.mock('../../../views/ErrorPage', () => () => <div>ErrorPage Component</div>);

// Helper para renderizar GlobalRouter en una ruta concreta
const renderWithRoute = (path) => {
  window.history.pushState({}, 'Test page', path);
  return render(<GlobalRouter />);
};

describe('GlobalRouter Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra pantalla de carga cuando isPending = true', () => {
    useAuth.mockReturnValue({ isPending: true });
    renderWithRoute('/');
    expect(screen.getByText('Cargando aplicación…')).toBeInTheDocument();
    // En loading no se monta NavBar ni rutas
    expect(screen.queryByText('NavBar Component')).not.toBeInTheDocument();
  });

  it('siempre renderiza NavBar cuando isPending = false', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/');
    expect(screen.getByText('NavBar Component')).toBeInTheDocument();
  });

  it('renderiza Home en la ruta "/"', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/');
    expect(screen.getByTestId('private-route')).toBeInTheDocument();
    expect(screen.getByText('Home Component')).toBeInTheDocument();
  });

  it('renderiza FileUpload en "/upload"', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/upload');
    expect(screen.getByText('FileUpload Component')).toBeInTheDocument();
  });

  it('renderiza TemporaryDeductions en "/temporary-deduction"', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/temporary-deduction');
    expect(screen.getByText('TemporaryDeductions Component')).toBeInTheDocument();
  });

  it('renderiza TemporaryAdditions en "/temporary-addition"', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/temporary-addition');
    expect(screen.getByText('TemporaryAdditions Component')).toBeInTheDocument();
  });

  it('renderiza PermanentAdditions en "/permanent-addition"', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/permanent-addition');
    expect(screen.getByText('PermanentAdditions Component')).toBeInTheDocument();
  });

  it('renderiza ReportTaxBook en "/report-tax-book"', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/report-tax-book');
    expect(screen.getByText('ReportTaxBook Component')).toBeInTheDocument();
  });

  it('renderiza ReportDetailDepreciation en "/report-detail-depreciation"', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/report-detail-depreciation');
    expect(screen.getByText('ReportDetailDepreciation Component')).toBeInTheDocument();
  });

  it('renderiza CallbackPage en "/callback" (ruta pública)', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/callback');
    expect(screen.getByText('CallbackPage Component')).toBeInTheDocument();
  });

  it('renderiza ErrorPage en "/error" (ruta pública)', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/error');
    expect(screen.getByText('ErrorPage Component')).toBeInTheDocument();
  });

  it('redirige (wildcard "*") hacia "/" mostrando Home', () => {
    useAuth.mockReturnValue({ isPending: false });
    renderWithRoute('/ruta-que-no-existe');
    // Si el Navigate a "/" funciona, terminaremos en Home
    expect(screen.getByText('Home Component')).toBeInTheDocument();
  });
});
