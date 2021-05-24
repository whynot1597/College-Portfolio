export const isDFA = (machine) => {
  let valid = true;
  let number = 0;
  machine.nodes.forEach((value, node) => {
    value.children.forEach((value, child) => {
      if (value.rel.includes("λ")) {
        valid = false;
        return;
      }
      number += value.rel.length;
    });
    if (number !== machine.alphabet.length) {
      valid = false;
      return;
    }
    number = 0;
  });
  return machine.startState && valid;
};
