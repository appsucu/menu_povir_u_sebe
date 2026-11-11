# Typography and Assets Specification

## Purpose
The typography and assets capability defines local self-hosted font loading (NAMU Pro, MacPaw Fixel Text), WebP image assets, font licensing, and automated font update scripts.

## Requirements

### Requirement: Self-hosted typography delivery
The system SHALL serve all font files locally in WOFF2 format without relying on external font delivery CDNs or third-party tracking services.

#### Scenario: Local font asset loading
- **WHEN** client browser requests webpage assets
- **THEN** NAMU Pro and MacPaw Fixel Text font files are loaded from the local assets directory

### Requirement: Font licensing compliance
The system SHALL maintain complete font licensing terms, notices, and attribution within the public repository distribution.

#### Scenario: Verify licensing documents
- **WHEN** repository or distribution files are inspected
- **THEN** valid licensing terms for Fixel and NAMU fonts are present in font-licenses.txt

### Requirement: Automated font refresh utility
The system SHALL provide a Python script scripts/download_fonts.py to download, verify, and update Fixel font files and corresponding CSS rules.

#### Scenario: Running font refresh script
- **WHEN** maintainer executes the download_fonts.py script
- **THEN** font assets are refreshed and verified against upstream releases
