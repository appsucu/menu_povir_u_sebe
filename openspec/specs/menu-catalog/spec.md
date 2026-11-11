# Menu Catalog Specification

## Purpose
The menu catalog capability provides structured presentation of catering dishes organized into semantic categories with accessible cards, ingredient disclosures, and Schema.org structured data.

## Requirements

### Requirement: Category organization and presentation
The system SHALL present catering dishes organized into distinct semantic sections corresponding to defined culinary categories.

#### Scenario: Display categories
- **WHEN** user views the menu catalog
- **THEN** dishes are grouped into 7 categories: Фокача, Салати, Тарти та байтси, Міні-галети, Солоні паї, Десерти, and Напої

### Requirement: Dish card structure and subgrid alignment
The system SHALL render each menu item as an article card displaying dish title, portion, description, order note, price, and optimized WebP image aligned via CSS Subgrid.

#### Scenario: Dish card layout
- **WHEN** a dish card is rendered in the viewport
- **THEN** title, portion, price in UAH, image with descriptive alt text, and order notes align consistently across adjacent cards

### Requirement: Ingredient disclosure and allergen details
The system SHALL provide an expandable details disclosure for dishes that contain ingredient lists or allergen information.

#### Scenario: Toggle ingredient details
- **WHEN** user expands the ingredient disclosure element on a dish card
- **THEN** full recipe composition and allergen details become visible without disrupting card grid alignment

### Requirement: Structured data consistency
The system SHALL embed Schema.org MenuItem JSON-LD structured data in the catalog page consistent with the menu.json data source.

#### Scenario: Structured data verification
- **WHEN** search engines or crawlers parse the catalog page
- **THEN** valid JSON-LD metadata matching dish names, prices, and descriptions is present
