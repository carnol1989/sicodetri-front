// src/router/GlobalRouter.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import NavBar from '../components/NavBar';
import PrivateRoute from '../components/PrivateRoute';

import CallbackPage from '../views/CallbackPage';
import Home from '../views/Home';
import FileUpload from '../views/FileUpload';
import TemporaryDeductions from '../views/TemporaryDeductions';
import TemporaryAdditions from '../views/TemporaryAdditions';
import PermanentAdditions from '../views/PermanentAdditions';
import ReportTaxBook from '../views/ReportTaxBook';
import ReportDetailDepreciation from '../views/ReportDetailDepreciation';

import ErrorPage from '../views/ErrorPage';

export default function AppRouter() {
  const { isPending } = useAuth();

  if (isPending) return <div>Cargando aplicación…</div>;

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/error" element={<ErrorPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <FileUpload />
              </PrivateRoute>
            }
          />

          <Route
            path="/temporary-deduction"
            element={
              <PrivateRoute>
                <TemporaryDeductions />
              </PrivateRoute>
            }
          />

          <Route
            path="/temporary-addition"
            element={
              <PrivateRoute>
                <TemporaryAdditions />
              </PrivateRoute>
            }
          />

          <Route
            path="/permanent-addition"
            element={
              <PrivateRoute>
                <PermanentAdditions />
              </PrivateRoute>
            }
          />

          <Route
            path="/report-tax-book"
            element={
              <PrivateRoute>
                <ReportTaxBook />
              </PrivateRoute>
            }
          />

          <Route
            path="/report-detail-depreciation"
            element={
              <PrivateRoute>
                <ReportDetailDepreciation />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
