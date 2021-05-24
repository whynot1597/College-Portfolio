import "./App.css";
import { Graphviz } from "graphviz-react";
import { useContext, useState } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import {
  Button,
  TextField,
  Grid,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  TextareaAutosize,
  FormHelperText,
  Checkbox,
  ButtonGroup,
  Snackbar,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import green from "@material-ui/core/colors/green";

import NodeInput from "./NodeInput";
import SavedMachinesTable from "./SavedMachinesTable";

import { checkValidString } from "./checkValidString";
import { minimizeDFA } from "./minimizeDFA";
import { isDFA } from "./isDFA";
import { generateDFA } from "./generateDFA";
import { MachineContext } from "./MachineContext";
import { Alert } from "./Alert";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    secondary: green,
  },
});

const useStyles = makeStyles((theme) => ({
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
}));

function App() {
  const classes = useStyles();
  const { machine, setMachine } = useContext(MachineContext);
  const [isDFAError, setIsDFAError] = useState(false);
  const [isValidString, setIsValidString] = useState();

  const handleInput = (event) => {
    const { name, value, id } = event.target;
    switch (name) {
      case "isAccepted":
        setMachine({ type: "accepted", node: id });
        break;

      case "isStart":
        setMachine({ type: "start", node: id });
        break;

      case "alphabet":
        setMachine({ type: "alphabet", alphabet: value.split("\n") });
        break;

      case "userString":
        setIsValidString(checkValidString(machine, value));
        break;

      case undefined:
        break;

      default:
        console.error("INVALID INPUT");
    }
  };

  const handleButton = (event) => {
    let { name, id } = event.currentTarget;

    switch (name) {
      case "minimizeDFA":
        if (isDFA(machine)) {
          setMachine({ type: "changeMachine", machine: minimizeDFA(machine) });
        } else {
          setIsDFAError(true);
        }
        break;

      case "generateDFA":
        setMachine({ type: "changeMachine", machine: generateDFA(machine) });
        break;

      case "DFAError":
        setIsDFAError(false);
        break;

      case "delete":
        setMachine({ type: "deleteNode", node: id });
        break;

      case "binaryAlphabet":
        setMachine({ type: "alphabet", alphabet: ["0", "1"] });
        break;

      case "decimalAlphabet":
        setMachine({
          type: "alphabet",
          alphabet: [...Array(10).keys()].map((number) => number.toString()),
        });
        break;

      case "englishCombinedAlphabet":
        setMachine({
          type: "alphabet",
          alphabet: [...Array(26)]
            .map((val, i) => String.fromCharCode(i + 65))
            .concat(
              [...Array(26)].map((val, i) => String.fromCharCode(i + 97))
            ),
        });
        break;

      case "englishUpperAlphabet":
        setMachine({
          type: "alphabet",
          alphabet: [...Array(26)].map((val, i) => String.fromCharCode(i + 65)),
        });
        break;

      case "englishLowerAlphabet":
        setMachine({
          type: "alphabet",
          alphabet: [...Array(26)].map((val, i) => String.fromCharCode(i + 97)),
        });
        break;

      default:
        console.error("Invalid Button");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsDFAError(false);
  };

  const generateRows = () => {
    return Array.from(machine.nodes).map((node) => {
      let name = node[0];
      let children = Array.from(node[1].children);

      return (
        <TableRow key={name}>
          <TableCell component="th" scope="row">
            {name}
          </TableCell>
          <TableCell>{generateChildrenString(children, "λ")}</TableCell>
          {machine.alphabet.map((item) => (
            <TableCell>{generateChildrenString(children, item)}</TableCell>
          ))}
          <TableCell>
            <Checkbox
              checked={machine.acceptedStates.includes(name)}
              onChange={handleInput}
              name="isAccepted"
              id={name}
            />
          </TableCell>
          <TableCell>
            <Switch
              checked={machine.startState === name}
              onChange={handleInput}
              name="isStart"
              id={name}
            />
          </TableCell>
          <TableCell>
            <Button name="delete" onClick={handleButton} id={name}>
              <Delete />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  const generateChildrenString = (children, acceptedStr) => {
    let result = [];
    children.forEach((child) => {
      if (child[1].rel.includes(acceptedStr)) {
        result.push(child[0]);
      }
    });
    return result.join(", ");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <form className="submission">
          <Grid
            container
            spacing={2}
            style={{ textAlign: "center" }}
            justify="center"
          >
            <Grid item>
              <TextareaAutosize
                rowsMin={3}
                rowsMax={10}
                onChange={handleInput}
                name="alphabet"
                value={machine.alphabet.join("\n")}
              />
              <FormHelperText>Alphabet</FormHelperText>
            </Grid>
            <Grid item>
              <ButtonGroup>
                <Button onClick={handleButton} name="binaryAlphabet">
                  Binary
                </Button>
                <Button onClick={handleButton} name="decimalAlphabet">
                  Decimal
                </Button>
                <Button onClick={handleButton} name="englishCombinedAlphabet">
                  English Alphabet (Combined)
                </Button>
                <Button onClick={handleButton} name="englishUpperAlphabet">
                  English Alphabet (Upper)
                </Button>
                <Button onClick={handleButton} name="englishLowerAlphabet">
                  English Alphabet (Lower)
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <NodeInput machine={machine} setMachine={setMachine} />
        </form>
        <Grid container justify="center" spacing={2}>
          <Grid item>
            {machine.dotSrc ? (
              <div>
                <Graphviz dot={machine.dotSrc} />
              </div>
            ) : null}
          </Grid>
        </Grid>
        <Grid container justify="center" spacing={2}>
          <Grid item>
            <TableContainer component={Paper} className="TableContainer">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Node Name</TableCell>
                    <TableCell>λ</TableCell>
                    {machine.alphabet.map((item) => (
                      <TableCell>{item}</TableCell>
                    ))}
                    <TableCell>Accepted</TableCell>
                    <TableCell>Start State</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{generateRows()}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid container justify="center" spacing={2}>
          <Grid item>
            <TextField
              name="userString"
              onChange={handleInput}
              onClick={handleInput}
              label="Leave blank for empty string"
              className={classes.textField}
              error={!isValidString}
              color={isValidString ? "secondary" : "primary"}
            />
          </Grid>
          <Grid item>
            <Button
              name="minimizeDFA"
              onClick={handleButton}
              disabled={isDFAError}
            >
              Minimize
            </Button>
          </Grid>
          <Grid item>
            <Button name="generateDFA" onClick={handleButton}>
              Convert to DFA
            </Button>
          </Grid>
        </Grid>
        <SavedMachinesTable setMachine={setMachine} />
        <Snackbar
          open={isDFAError}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" name="DFAError">
            This is not a DFA!
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;
