import ActiveSurveys from "./ActiveSurveys";
import React from "react";
import { Link } from "react-router-dom";
import { SmallHeader } from "../../../polylook/components/header";
import { CenteredFooter } from "../../../polylook/components/footer";
import Layout from "../../../polylook/components/layout";

function HomeHeader() {
    return (
        <SmallHeader>
            <h1 className="page-title">
                <Link to="/home">polyPod</Link>
            </h1>
        </SmallHeader>
    );
}

function HomeFooter() {
    return (
        <CenteredFooter>
            <button>Prüfe auf neue Umfragen</button>
        </CenteredFooter>
    );
}

export default function HomeScreen() {
    return (
        <Layout header={<HomeHeader />} footer={<HomeFooter />}>
            <main>
                <ActiveSurveys />
            </main>
        </Layout>
    );
}
