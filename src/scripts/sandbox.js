const fetchWorkflowFiles = require("../../github/fetchWorkflowFiles");
const fetchWorkflowContent = require("../../github/fetchWorkflowContent");
const parseWorkflowYaml = require("../../parser/parseWorkflowYaml");

async function main() {
  const owner = "actions";
  const repo = "starter-workflows";

  const files = await fetchWorkflowFiles(owner, repo);
  const content = await fetchWorkflowContent(owner, repo, files[0].path);
  const parsed = parseWorkflowYaml(content);

  console.dir(parsed, { depth: null });
}

main().catch((error) => {
  console.error(error.message);
});
