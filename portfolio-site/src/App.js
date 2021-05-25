import ProfileDrawer from "./ProfileDrawer";
import React from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import "./App.css";
import StarredProjects from "./StarredProjects";
import { Paper } from "@material-ui/core";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  card: {
    minWidth: theme.spacing(20),
    maxWidth: theme.spacing(40),
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
  },
  cardText: {
    color: theme.palette.text.primary,
    padding: theme.spacing(1),
    textAlign: "left",
    fontSize: 15,
  },
  drawer: {
    width: theme.spacing(50),
    flexShrink: 0,
  },
  drawerPaper: {
    width: theme.spacing(50),
    background: theme.palette.action.active,
  },
  logo: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  content: {
    flexGrow: 1,
  },
  background: {
    height: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.background}>
        <Paper className={classes.root}>
          <ProfileDrawer classes={classes} />
          <StarredProjects classes={classes} />
        </Paper>
      </div>
    </ThemeProvider>
  );
}

export default App;
