let Keyboard = window.SimpleKeyboard.default;
let swipe = window.SimpleKeyboardSwipe.default;

// Инициализация клавиатуры с русской раскладкой
let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  useMouseEvents: true,
  modules: [swipe],
  layout: {
    default: [
      "й ц у к е н г ш щ з х",
      "ф ы в а п р о л д ж э",
      "{shift} я ч с м и т ь б ю {backspace}",
      "{capslock} {globe} , {space} . {enter}"
    ]
  },
  // Дополнительные настройки
  preventMouseDownDefault: true,
  preventMouseUpDefault: true
});

console.log("Keyboard initialized:", keyboard);

// Обработчик изменения ввода
function onChange(input) {
  const inputElement = document.querySelector(".input");
  if (inputElement) {
    inputElement.value = input;
  }
  console.log("Input changed:", input);
}

// Обработчик нажатия клавиши
function onKeyPress(button) {
  console.log("Button pressed:", button);
  
  // Специальная обработка для некоторых клавиш
  if (button === "{space}") {
    const inputElement = document.querySelector(".input");
    if (inputElement) {
      inputElement.value += " ";
    }
  }
}

// Фокус на input при загрузке
window.addEventListener("load", () => {
  const inputElement = document.querySelector(".input");
  if (inputElement) {
    inputElement.focus();
  }
});
