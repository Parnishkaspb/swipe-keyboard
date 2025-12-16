let Keyboard = window.SimpleKeyboard.default;
let swipe = window.SimpleKeyboardSwipe.default;

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  useMouseEvents: true,
  modules: [swipe],
  layout: {
    default: [
      "ё 1 2 3 4 5 6 7 8 9 0 - =",
      "й ц у к е н г ш щ з х ъ",
      "ф ы в а п р о л д ж э",
      "{shift} я ч с м и т ь б ю .",
      "{space}"
    ]
  }
});

console.log(keyboard);

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);
}
