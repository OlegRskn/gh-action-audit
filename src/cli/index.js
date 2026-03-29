const parseRepoInput = require("../github/parseRepoInput");
const fetchWorkflowFiles = require("../github/fetchWorkflowFiles");
const fetchWorkflowContent = require("../github/fetchWorkflowContent");
const parseWorkflowYaml = require("../parser/parseWorkflowYaml");
const analyzeWorkflow = require("../analyzer/analyzeWorkflow");

function countFindingsBySeverity(findings) {
  return findings.reduce(
    (acc, finding) => {
      const severity = finding.severity || "unknown";
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0, unknown: 0 },
  );
}

function formatFinding(finding) {
  return [
    `[${finding.severity.toUpperCase()}] ${finding.type}`,
    `Job: ${finding.job}`,
    `Step: ${finding.step}`,
    `Uses: ${finding.uses}`,
    `Message: ${finding.message}`,
  ].join("\n");
}

function groupFindingsByFile(findings) {
  const groups = new Map();

  for (const finding of findings) {
    const key = finding.file;

    if (!groups.has(key)) {
      groups.set(key, {
        file: finding.file,
        workflowName: finding.workflowName,
        findings: [],
      });
    }

    groups.get(key).findings.push(finding);
  }

  return [...groups.values()];
}

function printSummary(owner, repo, workflowFiles, findings) {
  const severityCounts = countFindingsBySeverity(findings);

  console.log(`Repository: ${owner}/${repo}`);
  console.log(`Workflows scanned: ${workflowFiles.length}`);
  console.log(`Findings: ${findings.length}`);
  console.log("");
  console.log("Summary:");
  console.log(`High: ${severityCounts.high}`);
  console.log(`Medium: ${severityCounts.medium}`);
  console.log(`Low: ${severityCounts.low}`);

  if (severityCounts.unknown > 0) {
    console.log(`Unknown: ${severityCounts.unknown}`);
  }

  console.log("");
}

function printFindings(findings) {
  const groupedFindings = groupFindingsByFile(findings);

  for (const group of groupedFindings) {
    console.log(`File: ${group.file}`);

    if (group.workflowName) {
      console.log(`Workflow: ${group.workflowName}`);
    }

    console.log("");

    for (const finding of group.findings) {
      console.log(formatFinding(finding));
      console.log("");
    }
  }
}

async function main() {
  const input = process.argv[2];
  const { owner, repo } = parseRepoInput(input);

  const workflowFiles = await fetchWorkflowFiles(owner, repo);

  if (workflowFiles.length === 0) {
    console.log(`Repository: ${owner}/${repo}`);
    console.log("No workflows found");
    return;
  }

  const allFindings = [];

  for (const file of workflowFiles) {
    const content = await fetchWorkflowContent(owner, repo, file.path);
    const parsedWorkflow = parseWorkflowYaml(content);
    const findings = analyzeWorkflow(parsedWorkflow);

    const findingsWithMetadata = findings.map((finding) => ({
      ...finding,
      file: file.path,
      workflowName: parsedWorkflow.name,
    }));

    allFindings.push(...findingsWithMetadata);
  }

  printSummary(owner, repo, workflowFiles, allFindings);

  if (allFindings.length === 0) {
    console.log("No issues found");
    return;
  }

  printFindings(allFindings);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
