import React, { useContext, useReducer, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@material-ui/core";
import { Publish, Delete, Add } from "@material-ui/icons";
import { deepCopy } from "./deepCopy";
import { MachineContext } from "./MachineContext";

const SavedMachinesTable = (props) => {
  const savedMachineReducer = (state, action) => {
    switch (action.type) {
      case "remove":
        state.delete(action.name);
        return state;
      case "add":
        state.set(action.name, action.machine);
        return state;
      default:
        return;
    }
  };

  const { machine, setMachine } = useContext(MachineContext);

  const [savedMachines, setSavedMachines] = useReducer(
    savedMachineReducer,
    new Map()
  );
  const [currentMachineName, setCurrentMachineName] = useState("");
  const [getMachineName, setGetMachineName] = useState(false);

  const handleButton = (event) => {
    let { name, id } = event.currentTarget;
    // List Item has unsusual behavior so need to get the attribute
    name = name ? name : event.currentTarget.getAttribute("name");
    switch (name) {
      case "removeMachine":
        setSavedMachines({ type: "remove", name: id });
        break;

      case "restoreMachine":
        setMachine({
          type: "changeMachine",
          machine: deepCopy(savedMachines.get(id)),
        });
        break;

      case "closeGetMachineName":
        if (currentMachineName) {
          setSavedMachines({
            type: "add",
            machine: deepCopy(machine),
            name: currentMachineName,
          });
        }
        setGetMachineName(false);
        break;

      case "saveMachine":
        setGetMachineName(true);
        break;
      default:
        return;
    }
  };

  const handleInput = (event) => {
    const { name, value } = event.currentTarget;
    switch (name) {
      case "machineName":
        setCurrentMachineName(value);
        break;
      default:
        return;
    }
  };

  const generateSavedMachines = () => {
    return Array.from(savedMachines).map((machine) => {
      let name = machine[0];
      return (
        <ListItem button onClick={handleButton} name="restoreMachine" id={name}>
          <ListItemAvatar>
            <Avatar>
              <Publish />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              name="removeMachine"
              onClick={handleButton}
              id={name}
            >
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };
  return (
    <div>
      <Fab
        color="secondary"
        variant="extended"
        name="saveMachine"
        onClick={handleButton}
      >
        <Add />
        Save Machine
      </Fab>
      <List>{generateSavedMachines()}</List>
      <Dialog open={getMachineName} name="getMachineName">
        <DialogTitle>Name your machine</DialogTitle>
        <DialogContent>
          <TextField name="machineName" onChange={handleInput} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleButton} name="closeGetMachineName">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SavedMachinesTable;
