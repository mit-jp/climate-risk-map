import React from "react";
import Footer from './Footer';
import Header from './Header';

const DownloadData = () => {
    return (
        <React.Fragment>
            <Header />
            <h2>Choose data to download</h2>
            <ul id="download">
                <li><a href={process.env.PUBLIC_URL + "/climate.csv"}>Climate data</a></li>
                <li><a href={process.env.PUBLIC_URL + "/demographics.csv"}>Socioeconomic data</a></li>
            </ul>
            <Footer />
        </React.Fragment>
    );
}

export default DownloadData;