<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`,
with the subject in lowercase, imperative mood, and no trailing period. The types already in
use here are `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `copy`, and `remove`.

Do not add `Co-Authored-By` trailers, "Generated with" lines, or any other attribution to an
AI agent, neither in commit messages nor in PR descriptions.

# Writing

Never use an em-dash (`—`) in any text you produce. This covers site copy, blog posts,
markdown, code comments, commit messages, and PR descriptions.

Rewrite rather than swapping in a different dash. Depending on the sentence, the fix is
usually a colon when what follows explains what came before, a full stop when the clauses
can stand alone, commas or "whether ... or" around an aside, or a conjunction such as "so",
"since", or "and". En-dashes stay available for numeric ranges.
