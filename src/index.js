import "./index.css";
import Canvas from "./canvas";

class SimpleKeyboardSwipe {
  init = keyboard => {
    keyboard.registerModule("swipe", module => {
      module.Canvas = Canvas;

      module.init = () => {
        module.initVars();
        module.canvasHandler = new module.Canvas();
        // Обновляем размеры canvas после применения размеров клавиш
        module.canvasHandler.init(
          keyboard.keyboardDOM,
          module.canvasW,
          module.canvasH
        );
        module.initEvents();
        module.applyKeyDimensions();

        // Обновляем размеры canvas после применения размеров клавиш
        setTimeout(() => {
          if (keyboard.keyboardDOM && module.canvasHandler.canvas) {
            const keyboardRect = keyboard.keyboardDOM.getBoundingClientRect();
            module.canvasHandler.canvas.style.width = `${keyboardRect.width}px`;
            module.canvasHandler.canvas.style.height = `${keyboardRect.height}px`;
            module.canvasHandler.canvas.width = keyboardRect.width;
            module.canvasHandler.canvas.height = keyboardRect.height;
          }
        }, 150);
      };

      module.initVars = () => {
        let keyboardDOMClass = keyboard.keyboardDOMClass;

        keyboard.keyboardDOM = document.querySelector(`.${keyboardDOMClass}`);
        module.canvasW = keyboard.keyboardDOM.offsetWidth;
        module.canvasH = keyboard.keyboardDOM.offsetHeight;
        module.isMouseClicked = false;
        module.isMouseInCanvas = false;
        module.prevX = 0;
        module.currX = 0;
        module.prevY = 0;
        module.currY = 0;
        module.lastButton = "";
        module.swipeTolerance = 30;
        module.stoppedTime = 50;
        module.repeatResetTime = 200;

        // Новые переменные для хранения данных
        module.currentStroke = []; // Текущий штрих (массив точек)
        module.allStrokes = []; // Все штрихи (массив массивов)
        module.currentStrokeKey = ""; // Ключ для текущего штриха

        // Захардкоженные размеры клавиш
        module.keyDimensions = {
          й: { x: 0, y: 15, w: 99, h: 154 },
          ц: { x: 98, y: 15, w: 99, h: 154 },
          у: { x: 196, y: 15, w: 100, h: 154 },
          к: { x: 295, y: 15, w: 99, h: 154 },
          е: { x: 393, y: 15, w: 99, h: 154 },
          н: { x: 491, y: 15, w: 99, h: 154 },
          г: { x: 589, y: 15, w: 99, h: 154 },
          ш: { x: 687, y: 15, w: 99, h: 154 },
          щ: { x: 785, y: 15, w: 100, h: 154 },
          з: { x: 884, y: 15, w: 99, h: 154 },
          х: { x: 982, y: 15, w: 98, h: 154 },
          ф: { x: 0, y: 169, w: 99, h: 154 },
          ы: { x: 98, y: 169, w: 99, h: 154 },
          в: { x: 196, y: 169, w: 100, h: 154 },
          а: { x: 295, y: 169, w: 99, h: 154 },
          п: { x: 393, y: 169, w: 99, h: 154 },
          р: { x: 491, y: 169, w: 99, h: 154 },
          о: { x: 589, y: 169, w: 99, h: 154 },
          л: { x: 687, y: 169, w: 99, h: 154 },
          д: { x: 785, y: 169, w: 100, h: 154 },
          ж: { x: 884, y: 169, w: 99, h: 154 },
          э: { x: 982, y: 169, w: 98, h: 154 },
          "{shift}": { x: 0, y: 323, w: 120, h: 154 },
          shift: { x: 0, y: 323, w: 120, h: 154 },
          я: { x: 119, y: 323, w: 94, h: 154 },
          ч: { x: 212, y: 323, w: 95, h: 154 },
          с: { x: 306, y: 323, w: 94, h: 154 },
          м: { x: 399, y: 323, w: 95, h: 154 },
          и: { x: 493, y: 323, w: 94, h: 154 },
          т: { x: 586, y: 323, w: 95, h: 154 },
          ь: { x: 680, y: 323, w: 94, h: 154 },
          б: { x: 773, y: 323, w: 95, h: 154 },
          ю: { x: 867, y: 323, w: 95, h: 154 },
          "{backspace}": { x: 961, y: 323, w: 119, h: 154 },
          backspace: { x: 961, y: 323, w: 119, h: 154 },
          "{capslock}": { x: 0, y: 477, w: 141, h: 154 },
          toNumberState: { x: 0, y: 477, w: 141, h: 154 },
          "{globe}": { x: 140, y: 477, w: 120, h: 154 },
          globe: { x: 140, y: 477, w: 120, h: 154 },
          ",": { x: 259, y: 477, w: 98, h: 154 },
          "{space}": { x: 356, y: 477, w: 455, h: 154 },
          space: { x: 356, y: 477, w: 455, h: 154 },
          ".": { x: 810, y: 477, w: 98, h: 154 },
          "{enter}": { x: 907, y: 477, w: 173, h: 154 },
          enter: { x: 907, y: 477, w: 173, h: 154 }
        };
      };

      module.initEvents = () => {
        module.canvasHandler.canvas.addEventListener(
          "mousemove",
          e => {
            module.onMouseMove(e);
          },
          false
        );
        module.canvasHandler.canvas.addEventListener(
          "mousedown",
          e => {
            module.onMouseDown(e);
          },
          false
        );
        module.canvasHandler.canvas.addEventListener(
          "mouseup",
          e => {
            module.onMouseUp();
          },
          false
        );
        module.canvasHandler.canvas.addEventListener(
          "mouseout",
          e => {
            module.onMouseOut();
          },
          false
        );
        module.canvasHandler.canvas.addEventListener(
          "mouseenter",
          e => {
            module.onMouseEnter(e);
          },
          false
        );

        document.addEventListener("touchstart", module.touchHandler, true);
        document.addEventListener("touchmove", module.touchHandler, true);
        document.addEventListener("touchend", module.touchHandler, true);
        document.addEventListener("touchcancel", module.touchHandler, true);
      };

      module.onMouseDown = e => {
        module.swipeStart = true;
        module.isMouseClicked = true;
        module.isMouseInCanvas = true;
        module.updateCurrentPosition(e);
        module.canvasHandler.canvas.classList.add("swipe-mousedown");
        module.canvasHandler.canvas.classList.remove("swipe-mouseup");

        module.startNewStroke(e);

        module.isMouseHold = true;
        module.holdTimeout = setTimeout(function() {
          if (module.isMouseHold) {
            module.handleInteraction(e);
          }
          clearTimeout(module.holdTimeout);
        }, 500);
      };

      module.onMouseUp = () => {
        if (module.currentStroke.length > 0) {
          module.finishCurrentStroke();
        }

        module.isMouseHold = false;
        module.swipeStart = false;
        module.canvasHandler.clear();
        module.isMouseClicked = false;
        module.canvasHandler.canvas.classList.add("swipe-mouseup");
        module.canvasHandler.canvas.classList.remove("swipe-mousedown");
        module.canvasHandler.canvas.classList.remove("swipe-mouseenter");
        module.canvasHandler.canvas.classList.remove("swipe-mousemove");
      };

      module.onMouseEnter = e => {
        module.swipeStart = false;
        module.isMouseClicked = false;
        module.canvasHandler.clear();
        module.isMouseInCanvas = true;
        module.canvasHandler.canvas.classList.add("swipe-mouseenter");
        module.canvasHandler.canvas.classList.remove("swipe-mouseout");
      };

      module.onMouseOut = () => {
        if (module.currentStroke.length > 0) {
          module.finishCurrentStroke();
        }

        module.swipeStart = false;
        module.canvasHandler.clear();
        module.isMouseInCanvas = false;
        module.canvasHandler.canvas.classList.add("swipe-mouseout");
        module.canvasHandler.canvas.classList.remove("swipe-mouseenter");
        module.canvasHandler.canvas.classList.remove("swipe-mousemove");
      };

      module.onMouseMove = e => {
        module.isMouseHold = false;

        if (module.isMouseClicked && module.isMouseInCanvas) {
          clearTimeout(module.mouseStopped);
          module.mouseStopped = false;

          module.updateCurrentPosition(e);
          module.canvasHandler.draw(
            module.prevX,
            module.prevY,
            module.currX,
            module.currY
          );

          module.addPointToStroke(e);

          module.mouseStopped = setTimeout(() => {
            module.mouseStopped = true;
            module.handleInteraction(e);
          }, module.stoppedTime);
        }

        module.canvasHandler.canvas.classList.add("swipe-mousemove");
      };

      module.startNewStroke = e => {
        module.currentStroke = [];
        module.currentStrokeKey = this.generateStrokeKey();

        let element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
          // Проверяем наши кастомные клавиши
          let label = element.getAttribute("data-key-label");
          if (!label) {
            // Если не наша клавиша, проверяем оригинальную
            label = element.getAttribute("data-skbtn");
          }
          if (label) {
            module.currentStrokeKey = label;
          }
        }

        module.addPointToStroke(e);
      };

      module.addPointToStroke = e => {
        const point = {
          x: module.currX,
          y: module.currY,
          timestamp: Date.now()
        };
        module.currentStroke.push(point);
      };

      module.finishCurrentStroke = () => {
        if (module.currentStroke.length > 0) {
          const pointsArray = module.currentStroke.map(point => ({
            x: point.x,
            y: point.y,
            t: point.timestamp
          }));

          console.log(pointsArray);

          module.allStrokes.push(pointsArray);

          module.currentStroke = [];
          module.currentStrokeKey = "";
        }
      };

      module.generateStrokeKey = () => {
        return `stroke_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      };

      module.getAllStrokesData = () => {
        return module.allStrokes;
      };

      module.clearAllStrokesData = () => {
        module.allStrokes = [];
        module.currentStroke = [];
        module.currentStrokeKey = "";
      };

      module.applyKeyDimensions = () => {
        if (!module.keyDimensions) {
          return;
        }

        // Используем setTimeout чтобы убедиться, что клавиатура полностью отрендерена
        setTimeout(() => {
          // Скрываем все оригинальные кнопки
          const originalButtons = keyboard.keyboardDOM.querySelectorAll(
            ".hg-button"
          );
          originalButtons.forEach(button => {
            button.style.setProperty("display", "none", "important");
          });

          // Получаем все кнопки клавиатуры для получения их содержимого
          const buttons = keyboard.keyboardDOM.querySelectorAll(".hg-button");

          // Создаем мапу для быстрого поиска кнопок по метке
          const buttonMap = {};
          buttons.forEach(button => {
            const label = button.getAttribute("data-skbtn");
            if (label) {
              // Сохраняем кнопку для разных вариантов метки
              buttonMap[label] = button;
              const labelWithoutBraces = label.replace(/[{}]/g, "");
              if (labelWithoutBraces !== label) {
                buttonMap[labelWithoutBraces] = button;
              }
            }
          });

          // Создаем контейнер для наших клавиш
          const keysContainer = document.createElement("div");
          keysContainer.className = "custom-keyboard-keys";
          keysContainer.style.position = "absolute";
          keysContainer.style.top = "0";
          keysContainer.style.left = "0";
          keysContainer.style.width = "100%";
          keysContainer.style.height = "100%";
          keysContainer.style.zIndex = "10";

          // Создаем отдельные элементы для каждой клавиши
          Object.keys(module.keyDimensions).forEach(label => {
            const dimensions = module.keyDimensions[label];
            let originalButton = buttonMap[label];

            // Если не нашли по метке, пробуем найти без фигурных скобок
            if (!originalButton) {
              const labelWithoutBraces = label.replace(/[{}]/g, "");
              originalButton = buttonMap[labelWithoutBraces];
            }

            if (dimensions) {
              // Создаем новый элемент клавиши
              const keyElement = document.createElement("div");
              keyElement.className = "custom-key";
              keyElement.setAttribute("data-key-label", label);

              // Применяем захардкоженные размеры и позицию с !important
              keyElement.style.setProperty("position", "absolute", "important");
              keyElement.style.setProperty(
                "left",
                `${dimensions.x}px`,
                "important"
              );
              keyElement.style.setProperty(
                "top",
                `${dimensions.y}px`,
                "important"
              );
              keyElement.style.setProperty(
                "width",
                `${dimensions.w}px`,
                "important"
              );
              keyElement.style.setProperty(
                "height",
                `${dimensions.h}px`,
                "important"
              );
              keyElement.style.setProperty("margin", "0", "important");
              keyElement.style.setProperty("margin-top", "0", "important");
              keyElement.style.setProperty("margin-bottom", "0", "important");
              keyElement.style.setProperty("margin-left", "0", "important");
              keyElement.style.setProperty("margin-right", "0", "important");
              keyElement.style.setProperty("padding", "0", "important");
              keyElement.style.setProperty("padding-top", "0", "important");
              keyElement.style.setProperty("padding-bottom", "0", "important");
              keyElement.style.setProperty("padding-left", "0", "important");
              keyElement.style.setProperty("padding-right", "0", "important");
              keyElement.style.setProperty(
                "box-sizing",
                "border-box",
                "important"
              );
              keyElement.style.setProperty("border", "none", "important");
              keyElement.style.setProperty("border-width", "0", "important");
              keyElement.style.setProperty(
                "line-height",
                "normal",
                "important"
              );
              keyElement.style.setProperty(
                "min-height",
                `${dimensions.h}px`,
                "important"
              );
              keyElement.style.setProperty(
                "max-height",
                `${dimensions.h}px`,
                "important"
              );

              // Копируем содержимое и стили из оригинальной кнопки
              if (originalButton) {
                keyElement.innerHTML = originalButton.innerHTML;
                const computedStyle = window.getComputedStyle(originalButton);
                keyElement.style.background =
                  computedStyle.background || "#fff";
                keyElement.style.boxShadow =
                  computedStyle.boxShadow || "0 0 3px -1px rgba(0, 0, 0, .3)";
                keyElement.style.display = "flex";
                keyElement.style.alignItems = "center";
                keyElement.style.justifyContent = "center";
                keyElement.style.cursor = "pointer";
                keyElement.style.fontSize = computedStyle.fontSize || "inherit";
                keyElement.style.color = computedStyle.color || "inherit";
                keyElement.style.fontFamily =
                  computedStyle.fontFamily || "inherit";
                keyElement.style.fontWeight =
                  computedStyle.fontWeight || "inherit";

                // Связываем клик с оригинальной кнопкой
                keyElement.addEventListener("click", () => {
                  if (originalButton.onclick) {
                    originalButton.onclick();
                  } else {
                    originalButton.click();
                  }
                });
              }

              keysContainer.appendChild(keyElement);
            }
          });

          // Добавляем контейнер с клавишами в клавиатуру
          if (keyboard.keyboardDOM) {
            keyboard.keyboardDOM.style.position = "relative";
            keyboard.keyboardDOM.appendChild(keysContainer);
          }
        }, 100);
      };

      module.updateCurrentPosition = e => {
        // Вычисляем координаты относительно клавиатуры, а не canvas
        // чтобы они совпадали с координатами клавиш
        var keyboardRect = keyboard.keyboardDOM.getBoundingClientRect();

        module.prevX = module.currX;
        module.prevY = module.currY;
        module.currX = e.clientX - keyboardRect.left;
        module.currY = e.clientY - keyboardRect.top;

        module.getMouseDirection(e);
      };

      module.getMouseDirection = e => {
        let stagingX;
        let stagingY;

        //deal with the horizontal case
        if (module.enforceTolerance(module.prevX, module.currX)) {
          if (module.prevX < module.currX) {
            stagingX = "right";
          } else {
            stagingX = "left";
          }
        }

        //deal with the vertical case
        if (module.enforceTolerance(module.prevX, module.currX)) {
          if (module.prevY < module.currY) {
            stagingY = "down";
          } else {
            stagingY = "up";
          }
        }

        if (stagingY !== module.yDirection || stagingX !== module.xDirection) {
          if (stagingX) module.xDirection = stagingX;

          if (stagingY) module.yDirection = stagingY;

          if (module.swipeStart) {
            module.handleInteraction(e);
            module.swipeStart = false;
          }
        }
      };

      module.handleInteraction = e => {
        module.canvasHandler.canvas.style.display = "none";

        let element = document.elementFromPoint(e.clientX, e.clientY);

        if (element) {
          // Проверяем наши кастомные клавиши
          let label = element.getAttribute("data-key-label");
          let button = null;

          if (label) {
            // Находим оригинальную кнопку
            const buttons = keyboard.keyboardDOM.querySelectorAll(".hg-button");
            buttons.forEach(btn => {
              const btnLabel = btn.getAttribute("data-skbtn");
              if (
                btnLabel === label ||
                btnLabel === label.replace(/[{}]/g, "")
              ) {
                button = btn;
              }
            });
          } else {
            // Если не наша клавиша, проверяем оригинальную
            label = element.getAttribute("data-skbtn");
            button = element;
          }

          if (
            label &&
            button &&
            (module.lastButton !== label || module.isMouseHold) &&
            button.onclick
          ) {
            if (
              module.isMouseHold &&
              ((!label.includes("{") && !label.includes("}")) ||
                label === "{bksp}" ||
                label === "{space}")
            ) {
              module.holdInteractionTimeout = setTimeout(() => {
                button.onclick();
                module.handleInteraction(e);
              }, 100);
            } else {
              clearTimeout(module.holdInteractionTimeout);
              button.onclick();
              module.lastButton = label;

              let lastButtonTimeout = setTimeout(() => {
                clearTimeout(lastButtonTimeout);
                module.lastButton = "";
              }, module.repeatResetTime);
            }
          }

          module.canvasHandler.canvas.style.display = "block";
        }
      };

      module.enforceTolerance = (n1, n2, tolerance) => {
        tolerance = tolerance || module.swipeTolerance;

        let numAbs = Math.abs(n1 - n2);

        if (numAbs > tolerance || numAbs === 0) {
          return true;
        } else {
          return false;
        }
      };

      module.throttle = (callback, limit) => {
        var wait = false;
        if (!wait) {
          callback();
          wait = true;
          setTimeout(function() {
            wait = false;
          }, limit);
        }
      };

      module.touchHandler = event => {
        var touches = event.changedTouches,
          first = touches[0],
          type = "";

        switch (event.type) {
          case "touchstart":
            type = "mousedown";
            break;
          case "touchmove":
            type = "mousemove";
            break;
          case "touchend":
            type = "mouseup";
            break;
          default:
            return;
        }

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(
          type,
          true,
          true,
          window,
          1,
          first.screenX,
          first.screenY,
          first.clientX,
          first.clientY,
          false,
          false,
          false,
          false,
          0,
          null
        );

        module.canvasHandler.canvas.dispatchEvent(simulatedEvent);
        event.preventDefault();
      };

      module.init();
    });
  };
}

export default SimpleKeyboardSwipe;
