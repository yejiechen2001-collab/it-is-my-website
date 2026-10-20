const searchInput = document.querySelector("#journal-search");
const clearButton = document.querySelector("#clear-search");
const weekEntries = Array.from(document.querySelectorAll(".week-entry"));
const searchStatus = document.querySelector("#search-status");
const emptyMessage = document.querySelector("#empty-search");
const moreWeeksButton = document.querySelector("#more-weeks");
const reflectionFields = Array.from(document.querySelectorAll(".week-editor textarea"));
const journalSection = document.querySelector("#journal");
const weeksPerPage = 4;
let visibleWeekCount = weeksPerPage;

document.querySelectorAll('a[href="#journal"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (journalSection) journalSection.hidden = false;
  });
});

if (journalSection && window.location.hash === "#journal") {
  journalSection.hidden = false;
  journalSection.scrollIntoView();
}

reflectionFields.forEach((field) => {
  const storageKey = `yejiechen-reflection-week-${field.dataset.week}`;

  try {
    field.value = localStorage.getItem(storageKey) || "";
  } catch {
    field.value = "";
  }

  field.addEventListener("input", () => {
    try {
      localStorage.setItem(storageKey, field.value);
    } catch {}
  });
});

if (searchInput && clearButton && weekEntries.length && searchStatus && emptyMessage && moreWeeksButton) {
  function updateSearch() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    weekEntries.forEach((entry, index) => {
      const matches = entry.querySelector("summary").textContent.toLowerCase().includes(query);
      const isVisible = matches && (query.length > 0 || index < visibleWeekCount);
      entry.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    clearButton.hidden = query.length === 0;
    moreWeeksButton.hidden = query.length > 0 || visibleWeekCount >= weekEntries.length;
    emptyMessage.hidden = visibleCount > 0;
    searchStatus.textContent = query
      ? `${visibleCount} of ${weekEntries.length} weeks found`
      : `Showing ${visibleCount} of ${weekEntries.length} weeks`;
  }

  searchInput.addEventListener("input", updateSearch);
  moreWeeksButton.addEventListener("click", () => {
    visibleWeekCount = Math.min(visibleWeekCount + weeksPerPage, weekEntries.length);
    updateSearch();
  });
  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    updateSearch();
    searchInput.focus();
  });

  updateSearch();
}
