import React from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../views/Home";
import NavBar from "../components/NavBar";
import FileUpload from "../views/FileUpload";
import TemporaryDeductions from "../views/TemporaryDeductions";
import ReportTaxBook from "../views/ReportTaxBook";

function GlobalRouter() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} index />
                <Route path="/upload" element={<Layout><FileUpload /></Layout>} />
                <Route path="/temporary-deduction" element={<Layout><TemporaryDeductions /></Layout>} />
                <Route path="/report-tax-book" element={<Layout><ReportTaxBook /></Layout>} />
            </Routes>
        </BrowserRouter>
    )
}

const Layout = ({children}) => (
  <>
      {children}
  </>
);

export default GlobalRouter;