import { useReducer } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Snackbar,
} from "@material-ui/core";
import { useContext, useState } from "react";
import ClassContext from "./ClassContext";
import { Alert } from "./Alert";
import { MachineContext } from "./MachineContext";

const NodeInput = (props) => {
  const [isNodeError, setIsNodeError] = useState(false);
  const toAddReducer = (node, action) => {
    switch (action.type) {
      case "parent":
        return { ...node, parent: action.value };
      case "child":
        return { ...node, child: action.value };
      case "rel":
        return { ...node, rel: action.value };
      default:
        return;
    }
  };

  const [toAdd, setToAdd] = useReducer(toAddReducer, {
    parent: "",
    child: "",
    rel: "",
  });
  const { machine, setMachine } = useContext(MachineContext);
  const classes = useContext(ClassContext)();

  const handleInput = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "parentInput":
        setToAdd({ type: "parent", value: value });
        break;

      case "childInput":
        setToAdd({ type: "child", value: value });
        break;

      case "relationship":
        setToAdd({ type: "rel", value: value });
        break;

      default:
        console.error("INVALID INPUT");
        break;
    }
  };

  const handleButton = (event) => {
    const { name } = event.currentTarget;
    switch (name) {
      case "submit":
        if (
          toAdd.child === "Dead State" ||
          toAdd.parent === "Dead State" ||
          toAdd.child.includes(",") ||
          toAdd.parent.includes(",")
        ) {
          setIsNodeError(true);
          break;
        }
        setMachine({ type: "addNode", node: toAdd });
        break;

      default:
        console.error("INVALID BUTTON");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsNodeError(false);
  };

  return (
    <div>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <TextField
            name="parentInput"
            onChange={handleInput}
            error={!toAdd.parent}
            label="Parent"
            helperText="Parent is required"
          />
        </Grid>
        <Grid item>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            error={!toAdd.rel}
          >
            <InputLabel>Relationship</InputLabel>
            <Select
              name="relationship"
              onChange={handleInput}
              // value={rel}
              MenuProps={{ classes: { paper: classes.menuPaper } }}
              className={classes.selectEmpty}
            >
              <MenuItem value="λ" key="λ">
                λ
              </MenuItem>
              {machine.alphabet.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Relationship is required</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            name="childInput"
            onChange={handleInput}
            error={!toAdd.child}
            label="Child"
            helperText="Child is required"
          />
        </Grid>
        <Grid item>
          <Button onClick={handleButton} type="button" name="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={isNodeError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" name="DFAError">
          Node name cannot be named "Dead State" or contain ","
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NodeInput;
