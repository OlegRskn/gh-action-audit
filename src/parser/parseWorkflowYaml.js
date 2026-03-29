const YAML = require("yaml");

function parseWorkflowYaml(yamlText) {
  const parsed = YAML.parse(yamlText);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("invalid workflow yaml");
  }

  const jobs =
    parsed.jobs && typeof parsed.jobs === "object" ? parsed.jobs : {};

  const normalizedJobs = Object.fromEntries(
    Object.entries(jobs).map(([jobName, jobConfig]) => {
      const steps = Array.isArray(jobConfig?.steps)
        ? jobConfig.steps.map((step) => ({
            name: step.name,
            uses: step.uses,
            run: step.run,
          }))
        : [];

      return [jobName, { steps }];
    }),
  );

  return {
    name: parsed.name,
    jobs: normalizedJobs,
  };
}

module.exports = parseWorkflowYaml;
