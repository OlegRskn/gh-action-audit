const findUnpinnedActions = require("./rules/findUnpinnedActions");

function analyzeWorkflow(parsedWorkflow) {
  return [...findUnpinnedActions(parsedWorkflow)];
}

module.exports = analyzeWorkflow;
