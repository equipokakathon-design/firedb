# Flame in Freefall — SI-powered fire-safety dashboard by Team Nova Data

NASA Space Apps Challenge 2026 · Team **Nova Data** · Challenge: **Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data**

FireDB unifies the experimental tables of **19 combustion investigations** from NASA's Physical Sciences Informatics (PSI) repository into one clean database and turns them into an interactive, bilingual (English/Spanish) dashboard with an AI assistant that answers questions using only those data.

## What the website does
- **Overview & key findings** – e.g. no solid material has been tested in microgravity at ≥ 30% O₂, the expected lunar-base atmosphere.
- **Ask the data (AI)** – questions in English or Spanish; answers cite PSI IDs and say when data are missing.
- **Habitat relevance** – ranks investigations for a spacecraft, space station, lunar base, Mars base or pressurized rover with transparent criteria.
- **O₂–pressure map** – every test plotted against Earth/ISS, lunar-base and spacesuit atmospheres.
- **Investigation profiles** – objectives, hardware, fuels, sample shapes and sizes, measurements, and which variables changed between tests.
- **Compare** – similarities and differences between any two investigations.
- **Suppression (FLEX)**, **next-generation equipment**, **applications on Earth**.
- **For modelers** – variable coverage, downloads (CSV/JSON/SQLite) and a worked logistic-regression example.
- **Data quality** – 181 fixes and warnings, each traceable to its source file and row.

## Repository layout
```
index.html              the website (single self-contained page)
tests.csv …             unified data: tests, investigations, sessions, quality_log (CSV), firedb.json, firedb.sqlite
netlify/functions/ask.mjs  server function that calls Google Gemini (key kept in Netlify)
netlify.toml            Netlify settings
```
The Python data pipeline (cleaning, 31 verification checks and the site generator) was run offline with pandas, openpyxl and scikit-learn.

## AI assistant
The page tries, in order: (1) Claude, when opened inside claude.ai; (2) Google Gemini through `/api/ask` (needs the `GEMINI_API_KEY` environment variable in Netlify; optional `GEMINI_MODEL`); (3) precomputed answers when no live AI is available. The model receives only the FireDB context and must cite PSI IDs.

## NASA data used
NASA Physical Sciences Informatics (PSI), https://psi.nasa.gov/physci/repo/ (CC0): PSI-10 ACME Flame Design, PSI-20 ACME BRE, PSI-21 ACME CLD Flame, PSI-22 ACME E-FIELD Flames, PSI-23 ACME s-Flame, PSI-25 BASS-II, PSI-26 BASS, PSI-39 CFI, PSI-47 DAFT/DAFT-2, PSI-68 FLEX-2, PSI-69 FLEX, PSI-98 Saffire-I, PSI-99 Saffire-II, PSI-100 Saffire-III, PSI-101 SAME-R, PSI-102 SAME, PSI-106 SLICE, PSI-107 SPICE (requirements document only), PSI-159 ACME CFI-G. Supporting documents: Saffire objectives paper, SAME concept document, FLEX-2 and SPICE science requirements documents.

## Use of AI
AI tools (Claude by Anthropic) were used to write the data-cleaning and verification code, the website code, the investigation summaries, the English/Spanish texts and the precomputed answers. The live assistant uses Claude or Google Gemini at question time. All numbers come from the PSI data; the team reviewed the outputs and the automated checks (`verify_db.py`). No NASA logos or branding were generated or modified.

## License
Data: NASA PSI, CC0. Code: MIT.
