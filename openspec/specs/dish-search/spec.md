# Dish Search Specification

## Purpose
The dish search capability provides real-time client-side dish filtering across titles, portions, ingredients, notes, keyword highlighting, keyboard shortcuts, and URL synchronization.

## Requirements

### Requirement: Real-time search filtering
The system SHALL instantly filter dishes matching query text across titles, portions, ingredients, notes, and image descriptions as the user types.

#### Scenario: User types search query
- **WHEN** user inputs text into the search input field
- **THEN** dish catalog dynamically updates to show only matching dishes in the search results grid

### Requirement: Ukrainian text normalization
The system SHALL normalize search queries and dish content by standardizing Ukrainian letters, apostrophe variations, and whitespace before evaluating matches.

#### Scenario: Query with apostrophe or mixed case
- **WHEN** user searches using various apostrophe characters or uppercase letters
- **THEN** normalization treats apostrophes identically and matches regardless of character casing

### Requirement: Relevance scoring and results ranking
The system SHALL score and rank matched dishes prioritizing exact title matches first, all tokens in title second, any token in title third, and ingredient text matches fourth.

#### Scenario: Multi-token query ranking
- **WHEN** user enters multiple search terms
- **THEN** dishes containing all terms in their title appear before dishes containing terms only in description text

### Requirement: Search match highlighting
The system SHALL wrap matching query tokens inside HTML mark tags within dish title elements while preserving original character casing.

#### Scenario: Visual highlight in results
- **WHEN** dishes are displayed in search results
- **THEN** matching search words inside each dish title are highlighted with mark tags

### Requirement: Accessible search feedback
The system SHALL announce matching dish count in Ukrainian with correct plural forms to assistive technologies via an ARIA live region.

#### Scenario: Screen reader announcement
- **WHEN** search results are updated
- **THEN** live region announces result count using appropriate Ukrainian forms (страва, страви, страв)

### Requirement: URL parameter synchronization
The system SHALL synchronize active search queries with the URL query parameter q and restore search state upon page reload.

#### Scenario: Direct link with query parameter
- **WHEN** page is loaded with a q URL query parameter
- **THEN** search input is populated and filtered results are immediately displayed

### Requirement: Keyboard shortcuts and clear actions
The system SHALL focus the search input when the user presses the slash key or Ctrl/Cmd+K, and clear the active query when Escape or the clear button is pressed.

#### Scenario: Quick search hotkey
- **WHEN** user presses slash or Ctrl+K outside an editable input
- **THEN** search input receives focus with existing text selected

#### Scenario: Escape clears search
- **WHEN** user presses Escape inside the search input
- **THEN** search query is cleared, restoring full category view
