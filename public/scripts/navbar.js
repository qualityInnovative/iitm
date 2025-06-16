const btn = document.querySelectorAll("nav li");
const navLinks = document.querySelectorAll(".nav-links");

// Removes the hide-nav-links class from nav-links div to make it visisble
const showNavLink = (node) => {
  console.log(node.textContent);
  if (node.textContent.toLowerCase() == "home")
    document.querySelector("#home-links")?.classList.remove("hide-nav-links");
  else if (node.textContent.toLowerCase() == "about")
    document.querySelector("#about-links").classList.remove("hide-nav-links");
  else if (node.textContent.toLowerCase() == "academics")
    document
      .querySelector("#academics-links")
      .classList.remove("hide-nav-links");
  else if (node.textContent.toLowerCase() == "campus")
    document.querySelector("#campus-links").classList.remove("hide-nav-links");
  else if (node.textContent.toLowerCase() == "admissions(new)")
    document
      .querySelector("#admissions-links")
      .classList.remove("hide-nav-links");
  else if (node.textContent.toLowerCase() == "placements")
    document
      .querySelector("#placements-links")
      .classList.remove("hide-nav-links");
  else if (node.textContent.toLowerCase() == "community")
    document
      .querySelector("#community-links")
      .classList.remove("hide-nav-links");
};

// Adds the hide-nav-links class to nav-links div to make it invisible
const hideNavLink = (node) => {
  if (node.textContent.toLowerCase() == "home")
    document.querySelector("#home-links")?.classList.add("hide-nav-links");
  // console.log("home");
  else if (node.textContent.toLowerCase() == "about")
    document.querySelector("#about-links").classList.add("hide-nav-links");
  else if (node.textContent.toLowerCase() == "academics")
    document.querySelector("#academics-links").classList.add("hide-nav-links");
  else if (node.textContent.toLowerCase() == "campus")
    document.querySelector("#campus-links").classList.add("hide-nav-links");
  else if (node.textContent.toLowerCase() == "admissions")
    document.querySelector("#admissions-links").classList.add("hide-nav-links");
  else if (node.textContent.toLowerCase() == "placements")
    document.querySelector("#placements-links").classList.add("hide-nav-links");
  else if (node.textContent.toLowerCase() == "community")
    document.querySelector("#community-links").classList.add("hide-nav-links");
};

// On mouse over buttons shows the nav-links div
btn.forEach((node) => {
  node.addEventListener("mouseover", () => showNavLink(node));
});

// On mouse out buttons hides the nav-links div
btn.forEach((node) => {
  node.addEventListener("mouseout", () => hideNavLink(node));
});

// Keeps the nav-links div visible as long as cursor is inside it
navLinks.forEach((node) => {
  node.addEventListener("mouseover", () => {
    node.classList.remove("hide-nav-links");
  });
});

// Hides the nav-div once the mouse is out of it
navLinks.forEach((node) => {
  node.addEventListener("mouseout", () => {
    node.classList.add("hide-nav-links");
  });
});

//? FOR NAVBAR OF SMALL SCREENS
const menuBtn = document.querySelector(".menuButton");
const input = document.querySelector("#check");
const navCont = document.querySelector(".small-navs-container");
const navLis = document.querySelectorAll(".small-navs__ul--li");
const linkLis = document.querySelectorAll(".links-ul");

// Function to hide currently open links-ul div when another link-ul is clicked to open
const hideAll = () => {
  linkLis.forEach((node) => {
    node.classList.add("hidden");
  });
  navLis.forEach((node) => {
    node.classList.remove("open");
  });
};

// Expands and collapses navLis
menuBtn.addEventListener("click", (event) => {
  if (event.target === input) {
    navCont.classList.toggle("hidden");
    hideAll();
  }
});


// Expands linkLis
// BUG: Collaps doesn't work. linkLis only expand
// NOTE: Each time, irrespective of state of linkLis, hidden is being removed and open is being added. This is what's causing the problem.
navLis.forEach((node) => {
  node.addEventListener("click", (event) => {
    const isAbout = node.textContent.toLowerCase() === "about";
    const isAcademics = node.textContent.toLowerCase() === "academics";
    const isAdmissions = node.textContent.toLowerCase() === "admissions";
    const isPlacements = node.textContent.toLowerCase() === "placements";
    const isCampus = node.textContent.toLowerCase() === "campus";
    const isCommunity = node.textContent.toLowerCase() === "community";

    // console.log(event.target);

    // Checks which navLis node is being clicked and expands related linkLis
    if (isAbout) {
      hideAll();
      const aboutSection = document.querySelector("#small-about");
      const aboutLinks = document.querySelector("#small-about-links");

      // console.log(node.textContent);
      // console.log(aboutSection.classList.contains("open"));
      // console.log(aboutLinks.classList.contains("hidden"));

      // if (aboutLinks.classList.contains("hidden")) {
      //   console.log("hidden removed");
      //   aboutLinks.classList.remove("hidden");
      // } else {
      //   console.log("hidden added");
      //   aboutLinks.classList.add("hidden");
      // }
      // if (aboutSection.classList.contains("open")) {
      //   console.log("open removed");
      //   aboutSection.classList.remove("open");
      // } else {
      //   console.log("open added");
      //   aboutSection.classList.add("open");
      // }
      aboutSection.classList.toggle("open");
      aboutLinks.classList.toggle("hidden");
    } else if (isAcademics) {
      hideAll();
      const academicsLinks = document.querySelector("#small-academics-links");
      const academicsSection = document.querySelector("#small-academics");
      academicsLinks.classList.toggle("hidden");
      academicsSection.classList.toggle("open");
    } else if (isAdmissions) {
      hideAll();
      const admissionsLinks = document.querySelector("#small-admissions-links");
      const admissionsSection = document.querySelector("#small-admissions");
      admissionsLinks.classList.toggle("hidden");
      admissionsSection.classList.toggle("open");
    } else if (isPlacements) {
      hideAll();
      const placementsLinks = document.querySelector("#small-placements-links");
      const placementsSection = document.querySelector("#small-placements");
      placementsLinks.classList.toggle("hidden");
      placementsSection.classList.toggle("open");
    } else if (isCampus) {
      hideAll();
      const campusLinks = document.querySelector("#small-campus-links");
      const campusSection = document.querySelector("#small-campus");
      campusLinks.classList.toggle("hidden");
      campusSection.classList.toggle("open");
    } else if (isCommunity) {
      hideAll();
      const communityLinks = document.querySelector("#small-community-links");
      const communitySection = document.querySelector("#small-community");
      communityLinks.classList.toggle("hidden");
      communitySection.classList.toggle("open");
    }
  });
});

