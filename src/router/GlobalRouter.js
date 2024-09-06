import React from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../views/Home";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import FileUpload from "../components/FileUpload";

function GlobalRouter() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} index />
                <Route path="/upload" element={<FileUpload />} />
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