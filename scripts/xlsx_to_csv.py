#!/usr/bin/env python3
"""Export the Consolidated_Master sheet from the working XLSX to master_data.csv.

Uses only the Python standard library so the GitHub deployment pipeline can treat the
Excel workbook as the canonical human-maintained master without depending on Excel,
LibreOffice, pandas, or openpyxl.
"""
from __future__ import annotations

import csv
import re
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source_data"
XLSX = SOURCE / "Consolidated_Person_Days_Master_Input_Data.xlsx"
CSV_OUT = SOURCE / "master_data.csv"
SHEET_NAME = "Consolidated_Master"

NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL_DOC = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS_REL_PKG = "http://schemas.openxmlformats.org/package/2006/relationships"


def col_index(cell_ref: str) -> int:
    letters = re.match(r"([A-Z]+)", cell_ref)
    if not letters:
        return 0
    value = 0
    for ch in letters.group(1):
        value = value * 26 + (ord(ch) - 64)
    return value - 1


def shared_strings(zf: ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    values = []
    for si in root.findall(f"{{{NS_MAIN}}}si"):
        values.append("".join((t.text or "") for t in si.iter(f"{{{NS_MAIN}}}t")))
    return values


def worksheet_path(zf: ZipFile, sheet_name: str) -> str:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    target_rel_id = None
    sheets = workbook.find(f"{{{NS_MAIN}}}sheets")
    if sheets is None:
        raise ValueError("Workbook has no sheets collection")
    for sheet in sheets:
        if sheet.attrib.get("name") == sheet_name:
            target_rel_id = sheet.attrib.get(f"{{{NS_REL_DOC}}}id")
            break
    if not target_rel_id:
        raise ValueError(f"Sheet {sheet_name!r} not found in workbook")

    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    for rel in rels.findall(f"{{{NS_REL_PKG}}}Relationship"):
        if rel.attrib.get("Id") == target_rel_id:
            target = rel.attrib.get("Target", "")
            return target.lstrip("/")
    raise ValueError(f"Relationship for sheet {sheet_name!r} not found")


def cell_text(cell: ET.Element, strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join((t.text or "") for t in cell.iter(f"{{{NS_MAIN}}}t"))
    value_node = cell.find(f"{{{NS_MAIN}}}v")
    if value_node is None or value_node.text is None:
        return ""
    raw = value_node.text
    if cell_type == "s":
        return strings[int(raw)]
    if cell_type == "b":
        return "TRUE" if raw == "1" else "FALSE"
    return raw


def extract_rows() -> list[list[str]]:
    with ZipFile(XLSX) as zf:
        strings = shared_strings(zf)
        sheet_path = worksheet_path(zf, SHEET_NAME)
        root = ET.fromstring(zf.read(sheet_path))
        sheet_data = root.find(f"{{{NS_MAIN}}}sheetData")
        if sheet_data is None:
            raise ValueError("Worksheet has no sheetData")

        raw_rows: list[list[str]] = []
        for row in sheet_data.findall(f"{{{NS_MAIN}}}row"):
            cells = row.findall(f"{{{NS_MAIN}}}c")
            if not cells:
                raw_rows.append([])
                continue
            max_col = max(col_index(c.attrib.get("r", "A1")) for c in cells)
            values = [""] * (max_col + 1)
            for c in cells:
                values[col_index(c.attrib.get("r", "A1"))] = cell_text(c, strings)
            raw_rows.append(values)

    header_idx = next(
        (i for i, r in enumerate(raw_rows) if r and r[0].strip() == "Reference Year"),
        None,
    )
    if header_idx is None:
        raise ValueError("Could not locate the Consolidated_Master header row")

    header = raw_rows[header_idx]
    width = len(header)
    rows = [header]
    for row in raw_rows[header_idx + 1:]:
        padded = (row + [""] * width)[:width]
        if not padded[0].strip():
            continue
        rows.append(padded)
    return rows


def main() -> None:
    if not XLSX.exists():
        raise FileNotFoundError(f"Missing canonical workbook: {XLSX}")
    rows = extract_rows()
    with CSV_OUT.open("w", encoding="utf-8-sig", newline="") as fh:
        csv.writer(fh).writerows(rows)
    print(f"Exported {len(rows) - 1} rows from {SHEET_NAME} to {CSV_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
