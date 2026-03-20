#!/usr/bin/env python3
"""
Generate templates.js from board source files.
This script reads the actual source files from boards/ directory
and generates the templates.js file used by BlocklyDuino.
"""

import json
import os

BOARDS_JSON = "boards/boards.json"
OUTPUT_FILE = "blockly/apps/blocklyduino/templates.js"

FILES_TO_INCLUDE = [
    "platformio.ini",
    ".gitignore",
]

DIRECTORIES_TO_SCAN = [
    ("include", ".h"),
    ("src", ".cpp"),
    (".vscode", ".json"),
]

FILES_TO_EXCLUDE = [
    "src/main.cpp",
    ".vscode/c_cpp_properties.json",
    ".vscode/launch.json",
    ".vscode/tasks.json",
    ".vscode/extensions.json",
]


def escape_js_string(s):
    """Escape a string for use in JavaScript."""
    s = s.replace("\\", "\\\\")
    s = s.replace("'", "\\'")
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "\\r")
    s = s.replace("\t", "\\t")
    return s


def read_file(filepath):
    """Read file content."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def get_files_for_board(board_dir):
    """Get all files to include for a board."""
    files = {}
    
    for filename in FILES_TO_INCLUDE:
        filepath = os.path.join(board_dir, filename)
        if os.path.exists(filepath):
            key = filename
            files[key] = read_file(filepath)
    
    for subdir, ext in DIRECTORIES_TO_SCAN:
        subdir_path = os.path.join(board_dir, subdir)
        if os.path.exists(subdir_path) and os.path.isdir(subdir_path):
            for filename in os.listdir(subdir_path):
                if filename.endswith(ext):
                    relative_path = os.path.join(subdir, filename)
                    if relative_path not in FILES_TO_EXCLUDE:
                        filepath = os.path.join(subdir_path, filename)
                        files[relative_path] = read_file(filepath)
    
    return files


def generate_templates():
    """Generate the templates.js file."""
    with open(BOARDS_JSON, "r", encoding="utf-8") as f:
        boards_data = json.load(f)
    
    templates = {}
    
    for board in boards_data["boards"]:
        board_id = board["id"]
        board_dir = board["directory"]
        
        if not os.path.exists(board_dir):
            print(f"Warning: Board directory not found: {board_dir}")
            continue
        
        files = get_files_for_board(board_dir)
        templates[board_id] = files
        print(f"Processed board: {board_id} ({len(files)} files)")
    
    js_content = "var BOARD_TEMPLATES = {\n"
    
    boards_list = list(templates.items())
    for i, (board_id, files) in enumerate(boards_list):
        is_last_board = (i == len(boards_list) - 1)
        
        js_content += f"  '{board_id}': {{\n"
        
        files_list = list(files.items())
        for j, (filepath, content) in enumerate(files_list):
            is_last_file = (j == len(files_list) - 1)
            escaped_content = escape_js_string(content)
            if is_last_file:
                js_content += f"    '{filepath}': '{escaped_content}'\n"
            else:
                js_content += f"    '{filepath}': '{escaped_content}',\n"
        
        if is_last_board:
            js_content += "  }\n"
        else:
            js_content += "  },\n"
    
    js_content += "\n};\n"
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
    
    print(f"\nGenerated: {OUTPUT_FILE}")


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    generate_templates()
