import React from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../views/Home";
import NavBar from "../components/NavBar";
import FileUpload from "../views/FileUpload";
import TemporaryDeductions from "../views/TemporaryDeductions";

function GlobalRouter() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} index />
                <Route path="/upload" element={<Layout><FileUpload /></Layout>} />
                <Route path="/temporary-deduction" element={<Layout><TemporaryDeductions /></Layout>} />
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