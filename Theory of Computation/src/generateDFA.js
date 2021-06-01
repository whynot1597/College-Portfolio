import { isDFA } from "./isDFA";

export const generateDFA = (machine) => {
  if (isDFA(machine)) {
    return machine;
  }
  if (!machine.startState) {
    console.error("Need a start state");
    return machine;
  }

  const createNodes = (currentNode, table = new Map()) => {
    let name = currentNode.join(", ");
    if (!name) {
      name = "Dead State";
    }
    if (table.get(name)) {
      return;
    }

    let toAdd = createEmptyNode(machine);

    currentNode.forEach((node) => {
      machine.nodes.get(node).children.forEach((value, child) => {
        machine.alphabet.forEach((item) => {
          if (value.rel.includes(item) && !toAdd[item].includes(child)) {
            toAdd[item].push(child);
          }
        });
      });
    });

    table.set(name, toAdd);

    Object.values(toAdd).forEach((node) => {
      createNodes(node, table);
    });
    return table;
  };

  const createEmptyNode = (machine) => {
    let toAdd = {};
    machine.alphabet.forEach((item) => {
      toAdd[item] = [];
    });
    return toAdd;
  };

  let epsilonTable = new Map();

  machine.nodes.forEach((value, node) => {
    let toAdd = [];
    value.children.forEach((value, child) => {
      if (value.rel.includes("λ")) {
        toAdd.push(child);
      }
    });
    epsilonTable.set(node, toAdd);
  });

  let beginningNode = epsilonClosure(machine.startState, epsilonTable);

  const buildMachine = (table) => {
    let newMachine = {
      alphabet: machine.alphabet,
      nodes: new Map(),
      acceptedStates: [],
    };

    // Generate Nodes
    table.forEach((value, node) => {
      let children = new Map();
      machine.alphabet.forEach((item) => {
        let name = value[item].join(", ");
        if (!name) {
          name = "Dead State";
        }
        let child = children.get(name);
        if (child) {
          child.rel.push(item);
        } else {
          child = { rel: [item] };
        }
        children.set(name, child);
      });
      newMachine.nodes.set(node, { children: children });
    });

    // Set Start State
    newMachine.startState = beginningNode.join(", ");

    // Set Accept states
    table.forEach((value, node) => {
      let name = node.split(", ");
      machine.acceptedStates.forEach((oldNode) => {
        if (name.includes(oldNode)) {
          newMachine.acceptedStates.push(node);
          return;
        }
      });
    });

    return newMachine;
  };

  return buildMachine(createNodes(beginningNode));
};

const epsilonClosure = (node, table, result = [node]) => {
  let value = table.get(node);
  value.forEach((node) => {
    result.push(node);
    value.forEach((child) => {
      epsilonClosure(child, table, result);
    });
  });
  return result;
};
