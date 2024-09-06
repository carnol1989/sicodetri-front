import React from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../views/Home";
import Header from "../components/Header";

function GlobalRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} index />
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