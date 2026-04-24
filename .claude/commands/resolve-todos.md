---
description: Resolve all unchecked todos in TODOS.md via parallel sub-agents (one agent per cluster of related todos), then push changes to master
allowed-tools: Read, Write, Edit, Bash, Agent
---

## Context

Todo file: `/Users/rikstokmans/Claude/Portfolio Website/TODOS.md`

Repo map (absolute path → testing branch):

| Short name        | Path                                               | Testing branch |
|-------------------|----------------------------------------------------|----------------|
| portfolio-website | /Users/rikstokmans/Claude/Portfolio Website        | `master`       |

Failure policy: **skip-and-continue**. A single failing todo or group must never block the others. Report everything at the end.

---

## Task

### 1. Pre-flight

Run `git -C "/Users/rikstokmans/Claude/Portfolio Website" status --porcelain`. If the repo is dirty, **stop immediately** and print which files are modified. Do not proceed — the user needs a clean tree because the coordinator will checkout the branch and cherry-pick commits.

### 2. Parse todos

Read `TODOS.md`. Collect every `- [ ]` item as one todo, including any indented continuation lines below it as part of the description. Ignore `- [x]` lines and the file header. Assign each unchecked todo a short stable id: `t1`, `t2`, … in file order.

If there are zero unchecked todos, print "No todos to resolve." and stop.

### 3. Cluster related todos into groups

Look at the todo texts and decide which ones clearly belong together. Two todos belong in the same group when any of the following is true:

- They describe work in the same module, feature area, or page.
- They would likely edit the same files or the same function.
- One is a prerequisite or sequel of the other.
- They are phrased as variations of the same underlying problem.

Otherwise, keep them separate. **When in doubt, prefer singleton groups** — over-clustering wastes an agent's context on unrelated todos and increases the blast radius of a single failure.

Form groups and assign each a short id: `g1`, `g2`, … A group contains 1+ todo ids. Every todo must belong to exactly one group.

Before dispatching, print a one-line per-group summary so the user can see the plan:
```
g1 [t1, t3]   → customer-list perf
g2 [t2]       → dark mode flash
g3 [t4, t5]   → work orders pagination + sort
```

### 4. Dispatch one sub-agent per GROUP, in parallel

Send **one message containing all the Agent tool calls** so they run concurrently. For each group, call the `Agent` tool with:

- `subagent_type`: `general-purpose`
- `description`: `Resolve group <group-id>`
- `prompt`: the brief below, with `{{GROUP_ID}}`, `{{TODO_COUNT}}`, and `{{TODOS_BLOCK}}` substituted.

`{{TODOS_BLOCK}}` is the concatenation of every member todo in the group, formatted as:
```
Todo t1:
<<<
<full description, preserving indentation>
>>>

Todo t3:
<<<
<full description>
>>>
```

Do **not** pass `run_in_background`. We want to block until all agents finish.

---

#### Agent brief (substitute `{{GROUP_ID}}`, `{{TODO_COUNT}}`, `{{TODOS_BLOCK}}`)

```
You are resolving a GROUP of {{TODO_COUNT}} related todo(s) from the
Portfolio Website codebase (Next.js / TypeScript). Other agents are resolving
other groups in parallel — you must not touch their work or the shared repo
checkout.

Group id: {{GROUP_ID}}
Todos in this group:

{{TODOS_BLOCK}}

Repo paths and their branches:
  portfolio-website  /Users/rikstokmans/Claude/Portfolio Website  master

Procedure:

1. The group only ever requires changes in the one repo above.
   Explore the codebase enough to be confident before writing code.

2. Create a private worktree so parallel agents never collide.
   Work exclusively inside the worktree path:

       REPO="/Users/rikstokmans/Claude/Portfolio Website"
       SHORT="portfolio-website"
       BRANCH="master"
       WT="/tmp/todo-{{GROUP_ID}}-$SHORT"
       git -C "$REPO" fetch origin "$BRANCH"
       git -C "$REPO" worktree add "$WT" -b "todo/{{GROUP_ID}}-$SHORT" "origin/$BRANCH"

   All edits, builds, and commits happen inside $WT. Never touch $REPO directly.

3. Implement the change(s). Keep scope tight — solve only what the todos
   describe. No refactors, no drive-by fixes, no new abstractions.

   If the todos are genuinely related (same files/feature), group them
   into ONE cohesive commit. If you discover they are less related than
   they looked, you may still produce one commit covering whatever you
   resolve — just record which todos each commit addressed in the result
   JSON (see step 6).

   If a todo in the group turns out to be unresolvable or out of scope,
   skip it and note that in the result JSON. Keep going on the others.

4. Build inside the worktree:
   - Run `npm install` if `node_modules` is missing, then `npm run build`.
   - Must succeed. If the build fails, try to fix. If still failing after
     reasonable effort, do NOT commit.

5. If the build is green, stage and commit inside the worktree with a
   commit message you write yourself: one short imperative sentence
   that accurately covers what the commit does. No emojis, no task-id
   prefix, no Co-Authored-By.

6. Write a JSON result file at `/tmp/todo-{{GROUP_ID}}-result.json`
   with exactly this shape:

   {
     "group_id": "{{GROUP_ID}}",
     "todo_ids": ["t1", "t3"],
     "status": "success" | "partial" | "failed",
     "reason": "<string, required when status != success>",
     "unresolved_todo_ids": ["t3"],
     "changes": [
       {
         "repo_path": "/Users/rikstokmans/Claude/Portfolio Website",
         "short_name": "portfolio-website",
         "worktree_path": "/tmp/todo-{{GROUP_ID}}-portfolio-website",
         "branch": "todo/{{GROUP_ID}}-portfolio-website",
         "commit_sha": "<full sha>",
         "commit_message": "<your message>",
         "resolved_todo_ids": ["t1"]
       }
     ]
   }

   Rules:
   - `resolved_todo_ids` on each change lists the todo ids that commit
     actually addresses. A todo id may appear on multiple changes if it
     spans repos (e.g. a feature touching both front and back).
   - `unresolved_todo_ids` lists any todos from the group you could NOT
     address. Empty array if you handled them all.
   - `status = "success"` iff every member todo is covered by at least
     one change AND every repo you intended to change committed cleanly.
   - `status = "partial"` iff at least one commit landed but something
     else didn't — list only successfully-committed repos in `changes`
     and explain in `reason`.
   - `status = "failed"` iff nothing could be committed. `changes: []`.

7. Do NOT push. Do NOT edit TODOS.md. Do NOT remove worktrees. The
   coordinator handles all of that.

Your final message back to the coordinator: ≤ 3 lines. State the result
file path and a one-line outcome.
```

---

### 5. Collect results

After all agents return, read every `/tmp/todo-<group-id>-result.json` file. If a result file is missing for some group, treat every todo in that group as `failed` with reason `"agent did not produce a result file"`.

### 6. Coordinator phase — cherry-pick and push (serial, one repo at a time)

Flatten every successful/partial group's `changes` entries and group by `repo_path`. Within each repo, keep the order by the smallest `todo_id` in `resolved_todo_ids` (so `t1` changes land before `t5` changes). For each repo:

1. In the **original** repo path (not a worktree):
   ```
   git -C <repo-path> checkout <testing-branch>
   git -C <repo-path> pull --ff-only
   ```
2. For each change targeting this repo, in the order above:
   ```
   git -C <repo-path> cherry-pick <commit_sha>
   ```
   If it fails:
   ```
   git -C <repo-path> cherry-pick --abort
   ```
   Record every `(todo_id, short_name)` pair for each `todo_id` in that change's `resolved_todo_ids` as `"conflict"`, and continue.
3. If any cherry-pick succeeded on this repo:
   ```
   git -C <repo-path> push origin <testing-branch>
   ```
4. Clean up **all** worktrees for this repo, for every group (succeeded or not):
   ```
   git -C <repo-path> worktree remove <worktree-path> --force
   git -C <repo-path> branch -D <branch>
   ```
   Ignore errors from branches/worktrees that don't exist.

### 7. Update TODOS.md

Per-todo final state (derive from group results + cherry-pick outcomes):

- **done**: the todo appears in `resolved_todo_ids` of at least one change, AND every change that references this todo cherry-picked cleanly → flip `- [ ]` to `- [x]`.
- **partial**: the todo was resolved by the agent but at least one of its changes conflicted on cherry-pick → leave `- [ ]`, append an indented `> note: partial — conflict in <repo>` line.
- **unresolved**: the todo appears in the group's `unresolved_todo_ids` → leave `- [ ]`, append `> note: <reason from group>`.
- **failed**: the group status is `failed`, or the group produced no result file → leave `- [ ]`, append `> note: <reason>`.

Edit `TODOS.md` accordingly. If any lines changed:
```
git -C "/Users/rikstokmans/Claude/Portfolio Website" add TODOS.md
git -C "/Users/rikstokmans/Claude/Portfolio Website" commit -m "chore: tick resolved todos"
git -C "/Users/rikstokmans/Claude/Portfolio Website" push origin master
```

### 8. Final summary

Print a concise report:

```
Groups:
  g1 [t1, t3]  → resolved, pushed (reo-back, reo-front)
  g2 [t2]      → build-failed in reo-front
  g3 [t4, t5]  → t4 resolved, t5 unresolved (out of scope)

Resolved todos:
  - <todo text>

Unresolved / build-failed / conflicts:
  - <todo text>  →  <reason>

Repos pushed:
  - <repo>  (<branch>)
```

Omit sections that are empty.
