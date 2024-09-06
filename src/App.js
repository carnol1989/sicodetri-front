import React from "react";

import "./styles/styles.css"
import "./styles/sticky-footer-navbar.css"

import {FixedAssetContext} from "./context/FixedAssetContext";

import Footer from "./components/Footer";

import GlobalRouter from "./router/GlobalRouter";
import Header from "./components/Header";

function App() {

    const fixedAssetList = [];

    return (
        <div>
            <FixedAssetContext.Provider value={{fixedAssetList}}>
                <Header/>
                <GlobalRouter></GlobalRouter>
                <Footer/>
            </FixedAssetContext.Provider>
        </div>
    );

}

export default App;
