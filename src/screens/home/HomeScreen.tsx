import ActiveSurveys from "./ActiveSurveys";
import React from "react";
import { Link } from "react-router-dom";
import { SmallHeader } from  "../../../polylook/components/header";
import { CenteredFooter } from  "../../../polylook/components/footer";
import Layout from "../../../polylook/components/layout";

function SettingsButton() {
  return <img src="/icons/settings.svg" width="60" height="60"/>;
}

function HomeHeader() {
  return <SmallHeader right={<SettingsButton/>}>
    <h1 className="page-title">
      <Link to="/home">polyPod</Link>
    </h1>
  </SmallHeader>;
}

function HomeFooter() {
  return <CenteredFooter>
    <button>Prüfe auf neue Umfragen</button>
  </CenteredFooter>;
}

export default function HomeScreen() {
  return <Layout header={<HomeHeader/>} footer={<HomeFooter/>}>
    <main>
      <ActiveSurveys />
    </main>
  </Layout>;
}
