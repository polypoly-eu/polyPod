import ActiveSurveys from "./ActiveSurveys";
import React from "react";
import { Link } from "react-router-dom";
import { SmallHeader } from "@polypoly-eu/poly-look/lib/header";
import { CenteredFooter } from "@polypoly-eu/poly-look/lib/footer";
import { Layout } from "@polypoly-eu/poly-look/lib/layout";

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
