# Claude Code & Claude Projects Integration Guide

This guide explains how to integrate the **Agentic Engineering System (AES)** with Anthropic's **Claude Code** CLI and **Claude Projects**.

---

## 1. Claude Code CLI Integration

Claude Code reads instructions from `CLAUDE.md` in the project root (as well as global instructions from `~/.claude/CLAUDE.md`).

### Generating `CLAUDE.md`
Run the AES export command in your repository:
```bash
npx aes export --target claude
```

This compiles:
* `rules/global-principles.md`
* Your active stack rules (e.g. `rules/stack-react-vite-ssg.md`)
* The project configuration from `project.config.json`

### Executing Quality Gates inside Claude Code
Because Claude Code has integrated terminal capabilities, you can prompt Claude directly:
```
Claude, before concluding this feature, run `npm run gate` and present the Quality Gate proof table.
```

Claude will execute the scripts locally, calculate real bundle metrics, and format the output according to AES epistemic standards.

---

## 2. Claude Projects (Web)

When using Claude in the web interface with Claude Projects:
1. **Custom Instructions:** Copy the contents of `rules/global-principles.md` and your stack rules into the Project's *Custom Instructions*.
2. **Project Knowledge:** Upload `project.config.json` and `docs/quality-gates.md` to the *Project Knowledge* repository.
