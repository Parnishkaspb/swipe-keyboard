#!/usr/bin/env python3
"""
Генерирует правильный keyDimensions объект для SimpleKeyboardSwipe
на основе датасета с форматом: id,буква,???,x1,y1,x2,y2
"""

# Данные из датасета (формат: буква, x1, y1, x2, y2)
# Пример строки: 0,й,False,0,15,99,154
keys_data = """
й,0,15,99,154
ц,98,15,197,154
у,196,15,296,154
к,295,15,394,154
е,393,15,492,154
н,491,15,590,154
г,589,15,688,154
ш,687,15,786,154
щ,785,15,885,154
з,884,15,983,154
х,982,15,1080,154
ф,0,154,99,293
ы,98,154,197,293
в,196,154,296,293
а,295,154,394,293
п,393,154,492,293
р,491,154,590,293
о,589,154,688,293
л,687,154,786,293
д,785,154,885,293
ж,884,154,983,293
э,982,154,1080,293
shift,0,293,120,447
я,119,293,213,447
ч,212,293,307,447
с,306,293,400,447
м,399,293,494,447
и,493,293,587,447
т,586,293,681,447
ь,680,293,774,447
б,773,293,868,447
ю,867,293,962,447
backspace,961,293,1080,447
toNumberState,0,447,141,631
globe,140,447,260,631
comma,259,447,357,631
space,356,447,811,631
period,810,447,908,631
enter,907,447,1080,631
"""

def parse_keys():
    result = {}
    for line in keys_data.strip().split('\n'):
        if not line:
            continue
        parts = line.split(',')
        key = parts[0]
        x1, y1, x2, y2 = map(int, parts[1:5])
        
        result[key] = {
            'x': x1,
            'y': y1,
            'w': x2 - x1,
            'h': y2 - y1,
            'cx': (x1 + x2) / 2,
            'cy': (y1 + y2) / 2
        }
    return result

def generate_js_object(keys):
    """Генерирует JavaScript объект keyDimensions"""
    lines = []
    for key, dims in keys.items():
        # Для клавиш с {} и без
        key_variants = [key]
        if key in ['shift', 'backspace', 'toNumberState', 'globe', 'space', 'enter']:
            key_variants.append(f'{{{key}}}')
        
        for variant in key_variants:
            lines.append(f'{variant}:{{x:{dims["x"]},y:{dims["y"]},w:{dims["w"]},h:{dims["h"]}}}')
    
    return ','.join(lines)

def generate_debug_info(keys):
    """Генерирует информацию для отладки"""
    print("=== Проверка координат клавиш ===\n")
    
    test_keys = ['й', 'ц', 'х', 'space']
    for key in test_keys:
        if key in keys:
            dims = keys[key]
            print(f"Клавиша '{key}':")
            print(f"  Область: ({dims['x']}, {dims['y']}) -> ({dims['x']+dims['w']}, {dims['y']+dims['h']})")
            print(f"  Размер: {dims['w']}x{dims['h']}px")
            print(f"  Центр: ({dims['cx']}, {dims['cy']})")
            print()

if __name__ == '__main__':
    keys = parse_keys()
    
    # Вывод для отладки
    generate_debug_info(keys)
    
    # Генерация JS объекта
    print("=== JavaScript keyDimensions ===\n")
    js_object = generate_js_object(keys)
    print(f"n.keyDimensions={{{js_object}}}")
    print("\n=== Готово! ===")
    print(f"Всего клавиш: {len(keys)}")

