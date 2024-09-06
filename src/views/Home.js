import React from "react";
import FileUpload from "../components/FileUpload";

const Home = () => {
    return (
        <>
            {/* Begin page content */}
            <main className="flex-shrink-0">
                <div className="container">
                    <FileUpload />
                </div>
            </main>
        </>
    );
}

export default Home;