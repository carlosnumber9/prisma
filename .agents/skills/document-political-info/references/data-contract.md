# Formation and provincial presence contract

This skill serves only the existing portal: formation identity, an official website, branding actually used in the catalogue and proclaimed Congress presence by province for 29 November 2026. It does not collect people or maintain a general political knowledge base.

Use the exact [provincial contract](../../../../docs/provincial-data.md) for `content/editorial/provincial-presence.json`. The deterministic provincial generator validates it and projects existing formation/programme destinations. Preserve accepted IDs and original denominations. Programme identity aliases belong in `content/editorial/programme-identities.json` and require evidenced agreement; a coalition does not automatically share a constituent party's programme.

Official websites, colours and licensed local fonts used by the interface belong directly in the [programme catalogue](../../../../docs/content-contract.md#catalogues-and-identifiers). Record only the minimal official URL, consultation date and provenance needed for those fields in [catalogue provenance](../../../../docs/catalogue-provenance.md). Do not collect unused palettes, logo variants, statutes or font research. An incidental website font does not establish an official typeface or embedding rights.

Prepare verification notes, raw captures and unaccepted previews outside Git. Before saving an accepted batch, verify official authority, electoral identity, dates, corrections, coverage and every changed provincial association. Recheck all deterministic constraints and compare the exact accepted preview with the saved file. Offline structural checks do not establish factual accuracy. Existing accepted content survives unresolved research.

Never create `content/political-info`, person entities, individual affiliation/office facts, candidate arrays, list order, substitutes, Senate datasets or duplicated review copies. Saving accepted facts does not itself authorise Git publication; follow the [Git workflow](../../../../docs/git-workflow.md).
