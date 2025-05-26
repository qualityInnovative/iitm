var i = 0;
var speed = 50;
var txt = "admissions are open for graduate programs";

export const typeWriter = (el) => {
  //   const element = document.querySelector(el);
  //   const txt = element.dataset.txt;
  if (i < txt.length) {
    el.innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
};

export const isInViewport = (element) => {
  // Get the bounding client rectangle position in the viewport
  var bounding = element.getBoundingClientRect();
  // console.log(bounding);

  // Checking part. Here the code checks if it's *fully* visible
  // Edit this part if you just want a partial visibility
  if (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    // console.log("In the viewport! :)");
    // funcIn();
    return true;
  } else {
    // console.log("Not in the viewport. :(");
    // funcOut();
    return false;
  }
};
