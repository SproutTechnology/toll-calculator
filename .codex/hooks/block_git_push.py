#!/usr/bin/env python3
"""Block Codex from running git push through Bash tool calls."""

import json
import re
import shlex
import sys


SEPARATORS = {";", "&&", "||", "|", "\n"}
WRAPPERS = {"command", "exec", "env", "time", "noglob"}
GIT_GLOBAL_OPTIONS_WITH_VALUE = {
    "-C",
    "-c",
    "--git-dir",
    "--work-tree",
    "--namespace",
    "--exec-path",
    "--config-env",
}


def shell_tokens(command: str) -> list[str]:
    lexer = shlex.shlex(command, posix=True, punctuation_chars="|&;()")
    lexer.whitespace_split = True
    lexer.commenters = ""
    return list(lexer)


def split_commands(tokens: list[str]) -> list[list[str]]:
    commands: list[list[str]] = [[]]
    for token in tokens:
        if token in SEPARATORS or set(token) <= {"&", "|", ";"}:
            if commands[-1]:
                commands.append([])
            continue
        commands[-1].append(token)
    return [command for command in commands if command]


def is_git_push(command_tokens: list[str]) -> bool:
    index = 0
    while index < len(command_tokens) and command_tokens[index] in WRAPPERS:
        index += 1

    if index >= len(command_tokens) or command_tokens[index] != "git":
        return False

    index += 1
    while index < len(command_tokens):
        token = command_tokens[index]
        if token == "push":
            return True
        if token in GIT_GLOBAL_OPTIONS_WITH_VALUE:
            index += 2
            continue
        if any(token.startswith(option + "=") for option in GIT_GLOBAL_OPTIONS_WITH_VALUE):
            index += 1
            continue
        if token.startswith("-"):
            index += 1
            continue
        return False

    return False


def blocks_git_push(command: str) -> bool:
    if not re.search(r"\bgit\b", command) or not re.search(r"\bpush\b", command):
        return False
    try:
        tokens = shell_tokens(command)
    except ValueError:
        # Malformed shell syntax should not hide an obvious push attempt.
        return bool(re.search(r"(^|[;&|()\s])git\s+.*\bpush\b", command))
    return any(is_git_push(part) for part in split_commands(tokens))


def main() -> int:
    payload = json.load(sys.stdin)
    command = payload.get("tool_input", {}).get("command", "")

    if blocks_git_push(command):
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "deny",
                        "permissionDecisionReason": "Repository policy blocks Codex/agent sessions from running git push.",
                    }
                }
            )
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
