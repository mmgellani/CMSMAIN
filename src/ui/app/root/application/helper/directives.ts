import Vue from "vue";

function updateFunction(el, binding) {
  let options = binding.value || {};
  $(el)
    .select2(options)
    .on("select2:select", e => {
      el.dispatchEvent(new Event("change"));
    });
}
Vue.directive("select", {
  inserted: updateFunction,
  componentUpdated: updateFunction
});

Vue.directive("uppercase", (el, _, vnode) => {
  el.addEventListener("keyup", (e: any) => {
    e.target.value = e.target.value.toUpperCase();
    vnode.componentInstance.$emit("input", e.target.value.toUpperCase());
  });
});

Vue.directive("digitsonly", (el: any, binding: any) => {
  if (/[\d\.]+/i.test(el.value)) {
    console.log("ok");
  } else {
    let newValue = el.value.replace(/[a-zA-Z]+/gi, "");
    el.value = newValue;
    binding.value = el.value;
  }
});

Vue.directive("restrict", (el: any, binding: any) => {
  el.addEventListener("keydown", e => {
    // delete, backpsace, tab, escape, enter,
    let special = [46, 8, 9, 27, 13, 32];
    if (binding.modifiers["decimal"]) {
      // decimal(numpad), period
      special.push(110, 190);
    }
    // special from above
    if (
      special.indexOf(e.keyCode) !== -1 ||
      // Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return; // allow
    }
    if (
      binding.modifiers["alpha"] &&
      // a-z/A-Z
      (e.keyCode >= 65 && e.keyCode <= 90)
    ) {
      return; // allow
    }
    if (
      binding.modifiers["number"] &&
      // number keys without shift
      ((!e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) ||
        // numpad number keys
        (e.keyCode >= 96 && e.keyCode <= 105))
    ) {
      return; // allow
    }
    // otherwise stop the keystroke
    e.preventDefault(); // prevent
  }); // end addEventListener
});
