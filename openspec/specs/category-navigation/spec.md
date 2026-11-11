# Category Navigation Specification

## Purpose
The category navigation capability provides sticky horizontal toolbar navigation, scrollspy active category tracking, smooth view jumping, and overflow button controls.

## Requirements

### Requirement: Sticky toolbar and dynamic offset calculation
The system SHALL maintain the category navigation toolbar in a fixed sticky position at the top of the viewport and compute dynamic offset variables for scroll anchors.

#### Scenario: Viewport scrolling past header
- **WHEN** user scrolls down past the page header
- **THEN** navigation toolbar remains docked at the viewport top and updates the CSS sticky offset variable

### Requirement: Active category scrollspy
The system SHALL track the currently visible category section in the viewport using IntersectionObserver and highlight the corresponding navigation link.

#### Scenario: Section enters viewport
- **WHEN** user scrolls to a different category section
- **THEN** the corresponding navigation link receives aria-current attribute and scrolls into horizontal view

### Requirement: Horizontal scroll navigation and overflow controls
The system SHALL provide horizontal scroll capability with previous and next chevron buttons when navigation categories exceed viewport width.

#### Scenario: Toolbar overflow on narrow screens
- **WHEN** category links exceed available horizontal navigation width
- **THEN** chevron buttons are displayed, enabling smooth horizontal scrolling in both directions

### Requirement: Category selection click behavior
The system SHALL smoothly scroll the page to the target category section and clear any active search query when a navigation link is clicked.

#### Scenario: User clicks category link
- **WHEN** user clicks on a category link in the navigation toolbar
- **THEN** viewport scrolls smoothly to the chosen category and any active search filter is cleared
