async function fetchWorkflowContent(owner, repo, path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `GitHub API error (${owner}/${repo}/${path}): ${res.status} ${res.statusText}`,
    );
  }
  const data = await res.json();

  if (!data || data.type !== "file" || !data.content) {
    throw new Error(`Invalid file response for ${owner}/${repo}/${path}`);
  }

  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return content;
}
module.exports = fetchWorkflowContent;
