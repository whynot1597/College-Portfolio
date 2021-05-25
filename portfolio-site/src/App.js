import ProfileDrawer from "./ProfileDrawer";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import StarredProjects from "./StarredProjects";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  card: {
    minWidth: theme.spacing(20),
    minHeight: theme.spacing(20),
  },
  drawer: {
    width: theme.spacing(30),
    flexShrink: 0,
  },
  drawerPaper: {
    width: theme.spacing(30),
  },
  logo: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    fontSize: 20,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>hello</div>
      <ProfileDrawer classes={classes} />
      <StarredProjects classes={classes} />
      {/* <Header />
      <StarredProjects />
      <OtherProjects />
      <Interests /> */}
    </div>
  );
}

export default App;
