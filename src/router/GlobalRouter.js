// src/router/GlobalRouter.js
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../views/Home';
import NavBar from '../components/NavBar';
import FileUpload from '../views/FileUpload';
import TemporaryDeductions from '../views/TemporaryDeductions';
import TemporaryAdditions from '../views/TemporaryAdditions';
import ReportTaxBook from '../views/ReportTaxBook';
import ReportDetailDepreciation from '../views/ReportDetailDepreciation';
import PermanentAdditions from '../views/PermanentAdditions';

function GlobalRouter() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route
          path="/upload"
          element={
            <Layout>
              <FileUpload />
            </Layout>
          }
        />
        <Route
          path="/temporary-deduction"
          element={
            <Layout>
              <TemporaryDeductions />
            </Layout>
          }
        />
        <Route
          path="/temporary-addition"
          element={
            <Layout>
              <TemporaryAdditions />
            </Layout>
          }
        />
        <Route
          path="/permanent-addition"
          element={
            <Layout>
              <PermanentAdditions />
            </Layout>
          }
        />
        <Route
          path="/report-tax-book"
          element={
            <Layout>
              <ReportTaxBook />
            </Layout>
          }
        />
        <Route
          path="/report-detail-depreciation"
          element={
            <Layout>
              <ReportDetailDepreciation />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const Layout = ({ children }) => <>{children}</>;

export default GlobalRouter;
