import type { NextPage } from "next";
import { Fragment } from "react";
import HomePage from "@containers/Home";
import MetaTitle from "@design/MetaTitle";

const Home: NextPage = () => {
  return (
    <Fragment>
      <MetaTitle title="UTE Translate" />
      <HomePage />
    </Fragment>
  );
};

export default Home;
