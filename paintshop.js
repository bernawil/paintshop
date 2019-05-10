const parseInput = input => {
  const inputLines = input.split("\n").filter(l => l);
  const totalColors = parseInt(inputLines.shift());
  return {
    totalColors,
    customers: inputLines.map(line => line.match(/\d \w/g)).map(l =>
      l.map(i => ({
        color: i.match(/\d/)[0],
        type: i.match(/[a-zA-Z]/)[0]
      }))
    )
  };
};

const permutateTypes = colors =>
  colors.map(color => [{ color, type: "G" }, { color, type: "M" }]);

const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);

const cartesianProduct = (...sets) => {
  const loop = (t, a, ...more) =>
    a === undefined ? [t] : flatMap(x => loop([...t, x], ...more), a);
  return loop([], ...sets);
};

const satisfiesCustomer = (picks, choices) => {
  for (choice of choices)
    for (pick of picks) {
      if (pick.color === choice.color && pick.type === choice.type) return true;
    }

  return false;
};

const satisfiesAll = (picks, customerChoices) => {
  for (choices of customerChoices)
    if (!satisfiesCustomer(picks, choices)) return false;

  return true;
};

const colorArray = totalColors => {
  let i = 1;
  let colors = [];
  for (let i = 1; i <= totalColors; i++) colors.push(String(i));

  return colors;
};

const countMattes = combination =>
  combination.reduce((acc, curr) => {
    return curr.type === "M" ? acc + 1 : acc;
  }, 0);

const minMattes = combinations =>
  combinations.reduce((acc, curr) => {
    return countMattes(curr) < countMattes(acc) ? curr : acc;
  }, combinations[0]);

const printResult = result =>
  !result
    ? "no solution exists"
    : result
        .sort((a, b) => (a.color > b.color ? 1 : -1))
        .map(c => c.type)
        .join("  ");

const optimize = ({ totalColors, customers: customerChoices }) => {
  const colors = colorArray(totalColors);
  const combinations = cartesianProduct(...permutateTypes(colors));
  const validCombinations = combinations.filter(c =>
    satisfiesAll(c, customerChoices)
  );
  if (!validCombinations.length) return null;

  const mostOptimal = minMattes(validCombinations);

  return mostOptimal;
};

process.stdin.on("data", data => {
  const inputText = String(data);
  const parsed = parseInput(inputText);
  const result = printResult(optimize(parsed));
  console.log(result);
  return result === "no solution exists" ? process.exit(1) : process.exit(0);
});
