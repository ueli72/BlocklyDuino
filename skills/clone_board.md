# Skill: clone_board

## Purpose
Automate the process of cloning an existing BlocklyDuino board (currently optimized for duplicating `esp32-s3-devkitc1` variants) into a branded/customized variant.

## When to Use
- The user asks for a new board that is based on an existing one.
- The user provides a new board name and, optionally, an image and description.
- The new board reuses the same firmware sources as the original (no hardware-specific code changes yet).

## Required Inputs
1. **Board ID** (machine-readable, snake_case). Example: `playground_brumbrum`.
2. **Display name**. Example: `Playground BrumBrum`.
3. **Image path** (absolute path to PNG/JPG supplied by user).
4. **Description** to show in board selection modal.

If any input is missing, ask the user for it once.

## Workflow
1. **Create board directory**
   - Duplicate `boards/playground_master` into `boards/<new-id>`.
   - Update `pins.json` → `board` field and `name` field to new board ID/name.
   - Replace any textual references to the original marketing name with the new one.
   - Update the new `README.md` header/intro to mention the new board name and description.

2. **Register board**
   - Append entry in `boards/boards.json` with new id, display name, profile `esp32`, and directory path.
   - Validate JSON formatting (trailing commas etc.).

3. **Front-end assets**
   - Copy provided board image into `blocklyduino/media/<image>` (prefer PNG).
   - Update `blocklyduino/index.html`:
     - Board selection modal: add new card with image, name, description, and `data-board` matching new ID.
     - Inline board selector `<select>`: add new `<option>`.

4. **Translations**
   - Update `blocklyduino/lang/en.js` and `blocklyduino/lang/de.js`:
     - Add `brumbrumDesc`-style entry inside `boardSelection` section (choose key based on board ID).
     - Reuse provided description; translate to German if needed (or flag for follow-up if translation is missing).

5. **Blockly helper data**
   - In `blocklyduino/blockly_helper.js`:
     - Extend `BOARD_INFO` with new board id/name/image.
      - Extend `PIN_DATA` by deep-cloning the `playground_master` block; update board/name strings for tooltips.
     - Ensure profile selection logic treats both IDs identically (set default profile to `esp32`).

6. **Board-specific blocks**
   - Mirror any per-board lists (e.g., `KY023_ANALOG_PINS`) so the new ID maps to the same configuration as the base board.

7. **Follow-up**
   - Only run `python3 generate_templates.py` if firmware sources were touched (not required for pure metadata clones).
   - Summarize all touchpoints in final response and provide next steps (e.g., run templates script if hardware code modified later).

## Validation Checklist
- `boards/boards.json` contains the new entry and remains valid JSON.
- Board selection modal shows the new card with correct image and description.
- Selecting the new board updates the top toolbar board info panel.
- Pin reference panel works (because `PIN_DATA` entry exists).
- KY023 (and similar) dropdowns populate for the new board.
- Media assets load (verify relative path).

## Notes
- Stay within ASCII unless original file uses UTF-8 special characters.
- Avoid modifying `blocklyduino/templates.js` manually (auto-generated).
- If user provides additional requirements (custom pins, firmware changes), handle them after base clone workflow.
