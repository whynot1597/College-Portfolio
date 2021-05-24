export const checkValidString = (machine, str) => {
  const { startState, acceptedStates, nodes } = machine;
  if (!startState || acceptedStates.length === 0 || nodes.size === 0) {
    return false;
  }

  const testTransition = (str, currentNode) => {
    console.log(currentNode);
    if (!currentNode) {
      return testTransition(str, {
        name: startState,
        value: nodes.get(startState),
      });
      //Start the cycle
    } else if (str === "") {
      //check if current node is accepted
      return acceptedStates.includes(currentNode.name);
    } else {
      // try to transition to next node
      let char = str[0];

      let result;
      currentNode.value.children.forEach((value, child) => {
        if (!result && value.rel.includes(char)) {
          result = testTransition(str.substring(1), {
            name: child,
            value: nodes.get(child),
          });
        }
        if (!result && value.rel.includes("λ")) {
          result = result = testTransition(str, {
            name: child,
            value: nodes.get(child),
          });
        }
      });

      return result;
    }
  };

  const result = testTransition(str);

  return result;
};
