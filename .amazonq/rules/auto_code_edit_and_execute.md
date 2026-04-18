# Rule: Auto Code Edit and Execute

## Purpose
Enable the AI to automatically modify, run, and validate code within the project without requiring explicit user execution.

## Scope
- Applies to all source code files within the project workspace.
- Supports JavaScript, TypeScript, Python, and other configured runtimes.

## Capabilities
The AI is allowed to:
1. Edit existing code files to fix bugs, refactor logic, or implement features.
2. Create new files when necessary for functionality.
3. Run the project or specific scripts automatically after making changes.
4. Install required dependencies if missing.
5. Analyze runtime errors and iterate until the issue is resolved.

## Execution Behavior
- After any code modification, the AI must:
  1. Run the relevant command (e.g., `npm run dev`, `npm test`, `python main.py`).
  2. Capture output and logs.
  3. Identify errors or warnings.
  4. Apply fixes and re-run until successful or stable.

## Safety Constraints
- Do NOT execute destructive commands (e.g., deleting databases, wiping files).
- Do NOT expose or modify environment secrets (.env files) unless explicitly required.
- Limit execution to the local development environment only.
- Avoid infinite execution loops—stop after 5 failed attempts and report.

## Validation
- Ensure the system runs without errors after modifications.
- Confirm expected outputs or behavior changes.
- Maintain code readability and structure.

## Reporting
- Summarize:
  - Changes made
  - Commands executed
  - Errors encountered and fixes applied
  - Final system status

## Trigger
This rule is triggered automatically when:
- The user requests code changes
- Errors are detected in the system
- A feature implementation requires testing
