import React from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

// const darkTheme = createMuiTheme({
//   palette: {
//     type: "dark",
//     secondary: green,
//   },
// });

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(2),
//     minWidth: 150,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
//   menuPaper: {
//     maxHeight: 300,
//   },
//   textField: {
//     width: "25ch",
//   },
// }));

const MachineContext = React.createContext(
  makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(2),
      minWidth: 150,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    menuPaper: {
      maxHeight: 300,
    },
    textField: {
      width: "25ch",
    },
  }))
);

export default MachineContext;
