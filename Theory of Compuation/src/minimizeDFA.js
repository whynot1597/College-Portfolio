export const minimizeDFA = (machine, groups = []) => {
  // Initial setup
  if (groups.length === 0) {
    let accepted = new Map();
    let rejected = new Map();
    // Create accept and non accept groups
    machine.nodes.forEach((value, node) => {
      machine.acceptedStates.includes(node)
        ? accepted.set(node, machine.nodes.get(node))
        : rejected.set(node, machine.nodes.get(node));
    });
    // Recursive call to do minimization

    groups = [
      { name: Array.from(accepted.keys()), nodes: accepted },
      { name: Array.from(rejected.keys()), nodes: rejected },
    ];

    return minimizeDFA(machine, groups);
  }

  // Do minimization

  let newGroups = [];

  groups.forEach((group) => {
    group.nodes.forEach((value, node) => {
      let children = Array.from(value.children.entries());

      // Generate object to add to new groups
      let toAdd = {
        added: false,
        name: node,
        value: value,
        parent: group.name.join(", "),
      };

      // Generate rel properties for toAdd object
      children.forEach((child) => {
        let name = child[0];
        let rels = child[1].rel;
        rels.forEach((rel) => {
          groups.forEach((group) => {
            if (group.name.includes(name)) {
              toAdd[rel] = group.name;
            }
          });
        });
      });

      // Check each group to see if every rel leads to same node
      newGroups.forEach((newGroup) => {
        // make sure the origin is the same group
        if (newGroup.parent !== toAdd.parent) {
          return;
        }

        let allSame = true;
        machine.alphabet.forEach((item) => {
          // if we find a rel that is different, trigger allSame and early return
          if (newGroup[item] !== toAdd[item]) {
            allSame = false;
            return;
          }
        });

        // allSame never triggered to add to current group and early return
        if (allSame) {
          newGroup.name.push(toAdd.name);
          newGroup.nodes.set(toAdd.name, toAdd.value);
          toAdd.added = true;
          return;
        }
      });

      // if node was never added, need to create a new group and add it
      if (!toAdd.added) {
        let newNodes = new Map();
        newNodes.set(toAdd.name, toAdd.value);
        let newGroup = {
          name: [toAdd.name],
          nodes: newNodes,
          parent: toAdd.parent,
        };
        machine.alphabet.forEach((item) => {
          newGroup[item] = toAdd[item];
        });
        newGroups = [...newGroups, newGroup];
        toAdd.added = true;
      }
    });
  });

  if (newGroups.length === groups.length) {
    // At minimized state so
    // Build Machine from groups
    return buildMachine(machine, newGroups);
  }

  // Need to keep minimizing
  return minimizeDFA(machine, newGroups);
};

const buildMachine = (machine, groups) => {
  // Create empty machine
  let newMachine = { startState: "", acceptedStates: [], nodes: new Map() };

  // Generate new nodes
  let nodes = new Map();
  groups.forEach((group) => {
    let children = new Map();
    machine.alphabet.forEach((item) => {
      let name = group[item].join(", ");
      let child = children.get(name);
      if (child) {
        child.rel.push(item);
      } else {
        child = { rel: [item] };
      }
      children.set(name, child);
    });
    nodes.set(group.name.join("/ "), { children: children });
  });
  newMachine.nodes = nodes;

  // Set start state
  newMachine.nodes.forEach((value, node) => {
    let oldNodes = node.split(", ");
    oldNodes.forEach((oldNode) => {
      if (machine.startState === oldNode) {
        newMachine.startState = node;
      }
    });
  });

  // Set acceptedStates
  newMachine.nodes.forEach((value, node) => {
    let oldNodes = node.split("/ ");
    for (let i = 0; i < oldNodes.length; i++) {
      if (machine.acceptedStates.includes(oldNodes[i])) {
        newMachine.acceptedStates.push(node);
        return;
      }
    }
  });

  newMachine.alphabet = machine.alphabet;

  return newMachine;
};
