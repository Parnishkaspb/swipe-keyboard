let Keyboard = window.SimpleKeyboard.default;
let swipe = window.SimpleKeyboardSwipe.default;

// CLIENT 2: подключается к localhost:8001
const API_URL = 'http://localhost:8001/api/v1';
const KEYBOARD_WIDTH = 1080;
const KEYBOARD_HEIGHT = 631;

// Инициализация клавиатуры с русской раскладкой (только свайп, без обычного ввода)
let keyboard = new Keyboard({
  onChange: input => {}, // Отключаем автоматический ввод
  onKeyPress: button => {}, // Отключаем обработку нажатий
  useMouseEvents: true,
  disableButtonHold: true,
  modules: [swipe],
  layout: {
    default: [
      "й ц у к е н г ш щ з х",
      "ф ы в а п р о л д ж э",
      "{shift} я ч с м и т ь б ю {backspace}",
      "{toNumberState} {globe} , {space} . {enter}"
    ]
  },
  display: {
    "{shift}": "⇧",
    "{backspace}": "⌫",
    "{enter}": "↵",
    "{toNumberState}": "123",
    "{globe}": "🌐",
    "{space}": " "
  },
  preventMouseDownDefault: true,
  preventMouseUpDefault: true
});

console.log("Keyboard initialized:", keyboard);

let lastSwipeData = null;

async function predictSwipe() {
  const swipeModule = keyboard.modules.swipe;
  const lastStroke = swipeModule.allStrokes[swipeModule.allStrokes.length - 1];
  
  if (!lastStroke) {
    alert('Сделайте свайп по клавиатуре!');
    return;
  }
  
  const canvasW = swipeModule.canvasW;
  const canvasH = swipeModule.canvasH;
  const startTime = lastStroke[0].t;
  
  // Проверяем размеры canvas
  if (canvasW !== KEYBOARD_WIDTH || canvasH !== KEYBOARD_HEIGHT) {
    console.warn(`Canvas size mismatch! Expected ${KEYBOARD_WIDTH}x${KEYBOARD_HEIGHT}, got ${canvasW}x${canvasH}`);
  }
  
  // ОТПРАВЛЯЕМ ПИКСЕЛИ (не нормализуем!)
  const coords = lastStroke.map(p => ({
    x: p.x,  // пиксели 0-1080
    y: p.y,  // пиксели 0-631
    t: (p.t - startTime) / 1000
  }));
  
  console.log('Sending pixel coords:', coords);
  console.log(`First point: (${coords[0].x.toFixed(2)}, ${coords[0].y.toFixed(2)})`);
  console.log(`Last point: (${coords[coords.length-1].x.toFixed(2)}, ${coords[coords.length-1].y.toFixed(2)})`);
  
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      gesture_id: crypto.randomUUID(),
      coords: coords,
      word: ""
    })
  });
  
  const data = await response.json();
  console.log('Predicted:', data.predicted_word);
  
  // Сохранить данные свайпа
  lastSwipeData = {
    coords: coords,
    predictedWord: data.predicted_word
  };
  
  // Показать блок подтверждения
  document.getElementById('predictedWord').textContent = data.predicted_word;
  document.getElementById('correctWord').value = data.predicted_word;
  document.getElementById('predictionBlock').style.display = 'block';
  document.getElementById('predictBtn').style.display = 'none';
}

// Принять предсказание
document.getElementById('acceptBtn').addEventListener('click', async () => {
  if (!lastSwipeData) return;
  
  // Сохранить с предсказанным словом
  await fetch(`${API_URL}/swipes`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      gesture_id: crypto.randomUUID(),
      coords: lastSwipeData.coords,
      word: lastSwipeData.predictedWord
    })
  });
  
  // Вставить в input
  const currentInput = document.querySelector(".input").value;
  document.querySelector(".input").value = currentInput + lastSwipeData.predictedWord + ' ';
  
  resetPredictionUI();
});

// Сохранить исправленное
document.getElementById('correctBtn').addEventListener('click', async () => {
  if (!lastSwipeData) return;
  
  const correctedWord = document.getElementById('correctWord').value.trim();
  if (!correctedWord) {
    alert('Введите правильное слово!');
    return;
  }
  
  // Сохранить с исправленным словом
  await fetch(`${API_URL}/swipes`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      gesture_id: crypto.randomUUID(),
      coords: lastSwipeData.coords,
      word: correctedWord
    })
  });
  
  // Вставить в input
  const currentInput = document.querySelector(".input").value;
  document.querySelector(".input").value = currentInput + correctedWord + ' ';
  
  resetPredictionUI();
});

// Отменить
document.getElementById('cancelBtn').addEventListener('click', () => {
  resetPredictionUI();
});

function resetPredictionUI() {
  document.getElementById('predictionBlock').style.display = 'none';
  document.getElementById('predictBtn').style.display = 'block';
  document.getElementById('correctWord').value = '';
  lastSwipeData = null;
}

document.getElementById('predictBtn').addEventListener('click', predictSwipe);

