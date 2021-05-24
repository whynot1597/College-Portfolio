import React, { createContext, useReducer } from "react";

const emptyMachine = {
  startState: "",
  acceptedStates: [],
  nodes: new Map(),
  alphabet: [],
  dotSrc: "",
};

const createDOT = (machine) => {
  if (machine.nodes.size === 0) {
    return "";
  }
  let maxNode = 0;
  let maxEdge = 0;

  let result = "";
  result = result + `digraph G { `;
  result = result + `graph [bgcolor=transparent] `;
  result =
    result +
    `node [fillcolor="transparent" color="white" style="filled" fontcolor="white"] `;
  result = result + `edge [fontcolor="white" color="white"] `;
  machine.nodes.forEach((value, node) => {
    result =
      result +
      ` "${node}" [id="NodeId${maxNode++}" label="${node}" shape="${
        machine.acceptedStates.includes(node) ? "doublecircle" : "circle"
      }"] `;
    value.children.forEach((value, child) => {
      result =
        result +
        `"${node}" -> "${child}" [id="EdgeId${maxEdge++}" label="${value.rel
          .sort()
          .join(", ")}" fontcolor="white"] `;
    });
  });
  if (machine.startState) {
    result = result + `start [label="" shape=none height=0 width=0] `;
    result =
      result + `start -> "${machine.startState}" [id="EdgeId${maxEdge++}"]`;
  }
  result = result + `}`;

  return result;
};

let reducer = (machine, action) => {
  let newMachine = machine;
  let index;
  switch (action.type) {
    case "alphabet":
      newMachine = { ...emptyMachine, alphabet: action.alphabet };
      break;

    case "changeMachine":
      newMachine = action.machine;
      break;

    case "accepted":
      index = newMachine.acceptedStates.indexOf(action.node);
      if (index > -1) {
        newMachine.acceptedStates.splice(index, 1);
      } else {
        newMachine.acceptedStates.push(action.node);
      }
      break;

    case "start":
      newMachine =
        machine.startState === action.node
          ? { ...machine, startState: "" }
          : { ...machine, startState: action.node };
      break;

    case "addNode":
      const toAdd = action.node;
      if (!toAdd.parent || !toAdd.child || !toAdd.rel) {
        break;
      }
      let node = newMachine.nodes.get(toAdd.parent);
      if (node) {
        let child = node.children.get(toAdd.child);
        if (child) {
          if (!child.rel.includes(toAdd.rel)) {
            node.children.set(toAdd.child, {
              rel: [toAdd.rel, ...child.rel],
            });
          }
        } else {
          node.children.set(toAdd.child, { rel: [toAdd.rel] });
        }
      } else {
        let children = new Map();
        children.set(toAdd.child, { rel: [toAdd.rel] });
        newMachine.nodes.set(toAdd.parent, { children: children });
      }
      let child = newMachine.nodes.get(toAdd.child);
      if (!child) {
        newMachine.nodes.set(toAdd.child, { children: new Map() });
      }
      break;

    case "deleteNode":
      if (newMachine.startState === action.node) {
        newMachine.startState = "";
      }

      index = newMachine.acceptedStates.indexOf(action.node);
      if (index > -1) {
        newMachine.acceptedStates.splice(index, 1);
      }

      newMachine.nodes.delete(action.node);

      newMachine.nodes.forEach((value, node) => {
        value.children.forEach((value, child) => {
          if (child === action.node) {
            newMachine.nodes.get(node).children.delete(child);
          }
        });
      });
      break;

    default:
      return;
  }

  return { ...newMachine, dotSrc: createDOT(newMachine) };
};

const MachineContext = createContext(emptyMachine);

function MachineProvider(props) {
  const [machine, setMachine] = useReducer(reducer, emptyMachine);
  return (
    <MachineContext.Provider value={{ machine, setMachine }}>
      {props.children}
    </MachineContext.Provider>
  );
}

export { MachineContext, MachineProvider };
