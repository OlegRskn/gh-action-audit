async function fetchWorkflowFiles(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`;
  const res = await fetch(url);
  if (res.status === 404) {
    return [];
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("unexpected GitHub API response");
  }

  return data
    .filter(
      (item) =>
        item.type === "file" &&
        (item.name.endsWith(".yml") || item.name.endsWith(".yaml")),
    )
    .map((item) => ({
      name: item.name,
      path: item.path,
    }));
}
module.exports = fetchWorkflowFiles;
