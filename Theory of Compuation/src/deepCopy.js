export const deepCopy = (machine) => {
  let newMachine = Object.assign({}, machine);

  // Nodes is a map to need to fix
  let newNodes = new Map();
  machine.nodes.forEach((value, node) => {
    let newChildren = new Map();
    value.children.forEach((value, child) => {
      let newRel = [];
      value.rel.forEach((rel) => {
        newRel.push(rel);
      });
      newChildren.set(child, { rel: newRel });
    });
    newNodes.set(node, { children: newChildren });
  });
  newMachine.nodes = newNodes;

  // acceptedStates is array
  let newAcceptedStates = [];
  machine.acceptedStates.forEach((state) => {
    newAcceptedStates.push(state);
  });
  newMachine.acceptedStates = newAcceptedStates;

  return newMachine;
};
