import DisplayedSurveys from "./DisplayedSurveys";
import React from "react";
import { Link } from "react-router-dom";
import { SmallHeader } from "../../components/common/header";
import { CenteredFooter } from "../../components/common/footer";
import { Layout } from "../../components/common/layout";

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
                <DisplayedSurveys />
            </main>
        </Layout>
    );
}
