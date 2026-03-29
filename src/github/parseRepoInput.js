function parseRepoInput(input) {
  if (input === undefined) {
    throw new Error("repository argument is required");
  }
  if (typeof input !== "string") {
    throw new Error("incorrect input");
  }
  const res = input.trim().split("/");
  if (res.length !== 2 || res[0].length === 0 || res[1].length === 0) {
    throw new Error("incorrect format (owner/repo)");
  }
  return { owner: res[0], repo: res[1] };
}

module.exports = parseRepoInput;
