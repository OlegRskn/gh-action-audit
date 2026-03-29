function isFullCommitSha(ref) {
  return /^[a-f0-9]{40}$/i.test(ref);
}

function findUnpinnedActions(parsedWorkflow) {
  const findings = [];

  for (const [jobName, job] of Object.entries(parsedWorkflow.jobs || {})) {
    const steps = Array.isArray(job.steps) ? job.steps : [];

    for (const step of steps) {
      if (!step.uses) continue;
      if (typeof step.uses !== "string") continue;

      if (step.uses.startsWith("./")) continue;
      if (step.uses.startsWith("docker://")) continue;
      if (!step.uses.includes("@")) continue;

      const [, ref] = step.uses.split("@");

      if (!isFullCommitSha(ref)) {
        findings.push({
          type: "UNPINNED_ACTION",
          severity: "medium",
          job: jobName,
          step: step.name || "(unnamed step)",
          uses: step.uses,
          message: "Action is not pinned to a full commit SHA",
        });
      }
    }
  }

  return findings;
}

module.exports = findUnpinnedActions;
