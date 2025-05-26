import { isInViewport } from "./helpers.js";

const tab = document.querySelectorAll(".section-statistics__tabs li");
const tabs = {
  overview: document.querySelector(".section-statistics__tab--overview"),
  academic: document.querySelector(".section-statistics__tab--academic"),
  campus: document.querySelector(".section-statistics__tab--campus"),
  student: document.querySelector(".section-statistics__tab--student"),
};

const counters = {
  overview: document.querySelectorAll(
    ".section-statistics__tab--overview div .count"
  ),
  academic: document.querySelectorAll(
    ".section-statistics__tab--academic div .count"
  ),
  campus: document.querySelectorAll(
    ".section-statistics__tab--campus div .count"
  ),
  student: document.querySelectorAll(
    ".section-statistics__tab--student div .count"
  ),
};

// Removes the last active element so that we can set a new one
const removeLastActive = () => {
  tab.forEach((node) => node.classList.remove("active"));
};

// Hides the current div so that we can show other
const hideCurrent = () => {
  for (const t in tabs) {
    tabs[t].classList.add("hidden");
  }
};

// Loops through all tab li's
for (const t of tab) {
  // Adds event listener to the li
  t.addEventListener("click", (e) => {
    // Checks which tab is clicked and displays the content according
    if (e.target.textContent == "overview") {
      // Hides the current element
      hideCurrent();

      // Shows the clicked element
      tabs.overview.classList.remove("hidden");

      // Counter effect
      counters.overview.forEach((node) => {
        node.style.setProperty("--num", node.dataset.count);
      });

      // Removes the current active element
      removeLastActive();

      // Adds the active class to clicked element
      if (e.target.tagName.toLowerCase() == "li")
        e.target.classList.add("active");
      else if (e.target.tagName.toLowerCase() == "a")
        e.target.parentElement.classList.add("active");
    } else if (e.target.textContent == "academic") {
      hideCurrent();

      tabs.academic.classList.remove("hidden");
      counters.academic.forEach((node) => {
        node.style.setProperty("--num", node.dataset.count);
      });

      removeLastActive();

      if (e.target.tagName.toLowerCase() == "li")
        e.target.classList.add("active");
      else if (e.target.tagName.toLowerCase() == "a")
        e.target.parentElement.classList.add("active");
    } else if (e.target.textContent == "campus") {
      hideCurrent();

      tabs.campus.classList.remove("hidden");

      counters.campus.forEach((node) => {
        node.style.setProperty("--num", node.dataset.count);
      });

      removeLastActive();

      if (e.target.tagName.toLowerCase() == "li")
        e.target.classList.add("active");
      else if (e.target.tagName.toLowerCase() == "a")
        e.target.parentElement.classList.add("active");
    } else if (e.target.textContent == "student") {
      hideCurrent();

      tabs.student.classList.remove("hidden");

      counters.student.forEach((node) => {
        node.style.setProperty("--num", node.dataset.count);
      });

      removeLastActive();

      if (e.target.tagName.toLowerCase() == "li")
        e.target.classList.add("active");
      else if (e.target.tagName.toLowerCase() == "a")
        e.target.parentElement.classList.add("active");
    } else if (e.target.textContent == "alumni") {
      hideCurrent();

      tabs.alumni.classList.remove("hidden");

      counters.alumni.forEach((node) => {
        node.style.setProperty("--num", node.dataset.count);
      });

      removeLastActive();

      if (e.target.tagName.toLowerCase() == "li")
        e.target.classList.add("active");
      else if (e.target.tagName.toLowerCase() == "a")
        e.target.parentElement.classList.add("active");
    }
  });
}

const firstRun = () => {
  if (isInViewport(document.querySelector(".section-statistics__tab"))) {
    counters.overview.forEach((node) => {
      node.style.setProperty("--num", node.dataset.count);
    });
  }
};
// Calls the funciton when the div comes inside the viewport
window.addEventListener("scroll", firstRun);
// Calls the function on page load if div is directly displayed when the page loads
window.addEventListener("load", firstRun);
