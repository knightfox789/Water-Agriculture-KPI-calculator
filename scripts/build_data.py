#!/usr/bin/env python3
"""Build browser-ready JSON/GeoJSON from the normalized master CSV and ESRI shapefile.

Run from repository root:
    python scripts/build_data.py

The script intentionally performs no person-days calculation. It only validates and
publishes raw source inputs. All output calculations happen client-side in app.js.
"""
from __future__ import annotations

import csv
import json
import math
from pathlib import Path
from typing import Any

import shapefile  # pyshp
from pyproj import CRS, Transformer
from shapely.geometry import mapping, shape as shapely_shape
from shapely.ops import transform as shapely_transform

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source_data"
DATA = ROOT / "data"
CONFIG = ROOT / "config"
MASTER_CSV = SOURCE / "master_data.csv"
SHP = SOURCE / "State_NWIC.shp"
PRJ = SOURCE / "State_NWIC.prj"

REQUIRED_COLUMNS = [
    "Reference Year",
    "Basis Type",
    "Season",
    "State",
    "Crop",
    "Human Labour Cost (₹/ha)",
    "Seasonal Avg Daily Wage (₹/day)",
    "Yield (qtl/ha)",
    "Wage Reference Period",
    "Human Labour Source",
    "Wage Source",
    "Yield Source",
    "Source Report",
    "Annex 5.6 Report Page",
    "Notes",
]

NUMERIC_COLUMNS = {
    "Human Labour Cost (₹/ha)",
    "Seasonal Avg Daily Wage (₹/day)",
    "Yield (qtl/ha)",
    "Annex 5.6 Report Page",
}


def clean_number(value: str) -> float | int | None:
    text = (value or "").strip()
    if text == "":
        return None
    try:
        number = float(text.replace(",", ""))
    except ValueError as exc:
        raise ValueError(f"Expected numeric value, got {value!r}") from exc
    if math.isfinite(number) and number.is_integer():
        return int(number)
    return number


def load_master() -> tuple[list[dict[str, Any]], dict[str, Any]]:
    if not MASTER_CSV.exists():
        raise FileNotFoundError(f"Missing {MASTER_CSV}")

    records: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str, str, str]] = set()

    with MASTER_CSV.open("r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        missing = [c for c in REQUIRED_COLUMNS if c not in (reader.fieldnames or [])]
        if missing:
            raise ValueError(f"master_data.csv is missing required columns: {missing}")

        for line_no, row in enumerate(reader, start=2):
            rec: dict[str, Any] = {}
            for col in REQUIRED_COLUMNS:
                raw = row.get(col, "")
                rec[col] = clean_number(raw) if col in NUMERIC_COLUMNS else (raw or "").strip()

            key = (
                str(rec["Reference Year"]),
                str(rec["Basis Type"]),
                str(rec["Season"]),
                str(rec["State"]),
                str(rec["Crop"]),
            )
            if key in seen:
                raise ValueError(f"Duplicate master key at line {line_no}: {key}")
            seen.add(key)

            if rec["Basis Type"] not in {"Actual", "Projected"}:
                raise ValueError(f"Invalid Basis Type at line {line_no}: {rec['Basis Type']!r}")
            if rec["Season"] not in {"Kharif", "Rabi"}:
                raise ValueError(f"Invalid Season at line {line_no}: {rec['Season']!r}")
            if not rec["Reference Year"] or not rec["State"] or not rec["Crop"]:
                raise ValueError(f"Blank key field at line {line_no}")
            if rec["Yield (qtl/ha)"] is None:
                raise ValueError(f"Yield is required at line {line_no}")

            records.append(rec)

    years = sorted({r["Reference Year"] for r in records}, key=lambda y: int(str(y).split("-")[0]))
    metadata = {
        "recordCount": len(records),
        "states": sorted({r["State"] for r in records}),
        "crops": sorted({r["Crop"] for r in records}),
        "years": years,
        "seasons": sorted({r["Season"] for r in records}),
        "basisTypes": sorted({r["Basis Type"] for r in records}),
        "schemaVersion": 1,
    }
    return records, metadata


def build_state_geojson(master_states: set[str]) -> dict[str, Any]:
    state_names = json.loads((CONFIG / "state_codes.json").read_text(encoding="utf-8"))
    src_crs = CRS.from_wkt(PRJ.read_text(encoding="utf-8"))
    transformer = Transformer.from_crs(src_crs, CRS.from_epsg(4326), always_xy=True)

    reader = shapefile.Reader(str(SHP))
    fields = [f[0] for f in reader.fields[1:]]
    features: list[dict[str, Any]] = []

    for sr in reader.iterShapeRecords():
        attrs = dict(zip(fields, sr.record))
        code = str(attrs.get("State", "")).strip()
        state_code = str(attrs.get("state_code", "")).strip()
        full_name = state_names.get(code, code)

        geom = shapely_shape(sr.shape.__geo_interface__)
        geom = shapely_transform(transformer.transform, geom)
        # ~500–1000 m generalization for fast Leaflet rendering while preserving topology.
        geom = geom.simplify(0.006, preserve_topology=True)

        features.append({
            "type": "Feature",
            "properties": {
                "shapeCode": code,
                "stateCode": state_code,
                "stateName": full_name,
                "hasMasterData": full_name in master_states,
            },
            "geometry": mapping(geom),
        })

    return {"type": "FeatureCollection", "features": features}


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    records, metadata = load_master()
    states_geojson = build_state_geojson(set(metadata["states"]))

    (DATA / "master.json").write_text(
        json.dumps({"metadata": metadata, "records": records}, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    (DATA / "states.geojson").write_text(
        json.dumps(states_geojson, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    (DATA / "version.json").write_text(
        json.dumps({
            "schemaVersion": metadata["schemaVersion"],
            "recordCount": metadata["recordCount"],
            "source": "source_data/master_data.csv",
        }, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Built {len(records)} master records")
    print(f"Built {len(states_geojson['features'])} state/UT geometries")
    print(f"Master states: {len(metadata['states'])}")


if __name__ == "__main__":
    main()
