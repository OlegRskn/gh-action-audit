const parseRepoInput = require("./parseRepoInput");

test("parses valid owner/repo", () => {
  expect(parseRepoInput("octocat/Hello-World")).toEqual({
    owner: "octocat",
    repo: "Hello-World",
  });
});

test("trims surrounding spaces", () => {
  expect(parseRepoInput("  octocat/Hello-World  ")).toEqual({
    owner: "octocat",
    repo: "Hello-World",
  });
});

test("throws when argument is missing", () => {
  expect(() => parseRepoInput(undefined)).toThrow(
    "repository argument is required",
  );
});

test("throws on null input", () => {
  expect(() => parseRepoInput(null)).toThrow("incorrect input");
});

test("throws on non-string input", () => {
  expect(() => parseRepoInput(123)).toThrow("incorrect input");
});

test("throws on empty string", () => {
  expect(() => parseRepoInput("")).toThrow("incorrect format (owner/repo)");
});

test("throws on spaces only", () => {
  expect(() => parseRepoInput("   ")).toThrow("incorrect format (owner/repo)");
});

test("throws on missing slash", () => {
  expect(() => parseRepoInput("octocat")).toThrow(
    "incorrect format (owner/repo)",
  );
});

test("throws on missing repo", () => {
  expect(() => parseRepoInput("octocat/")).toThrow(
    "incorrect format (owner/repo)",
  );
});

test("throws on missing owner", () => {
  expect(() => parseRepoInput("/Hello-World")).toThrow(
    "incorrect format (owner/repo)",
  );
});

test("throws on multiple slashes", () => {
  expect(() => parseRepoInput("octocat/Hello-World/extra")).toThrow(
    "incorrect format (owner/repo)",
  );
});
