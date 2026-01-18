#!/usr/bin/env python3
"""
Заменяет keyDimensions в минифицированном build/index.js
на правильные координаты из датасета
"""
import re

# Новый keyDimensions (правильный)
NEW_KEYDIMS = '{й:{x:0,y:15,w:99,h:139},ц:{x:98,y:15,w:99,h:139},у:{x:196,y:15,w:100,h:139},к:{x:295,y:15,w:99,h:139},е:{x:393,y:15,w:99,h:139},н:{x:491,y:15,w:99,h:139},г:{x:589,y:15,w:99,h:139},ш:{x:687,y:15,w:99,h:139},щ:{x:785,y:15,w:100,h:139},з:{x:884,y:15,w:99,h:139},х:{x:982,y:15,w:98,h:139},ф:{x:0,y:154,w:99,h:139},ы:{x:98,y:154,w:99,h:139},в:{x:196,y:154,w:100,h:139},а:{x:295,y:154,w:99,h:139},п:{x:393,y:154,w:99,h:139},р:{x:491,y:154,w:99,h:139},о:{x:589,y:154,w:99,h:139},л:{x:687,y:154,w:99,h:139},д:{x:785,y:154,w:100,h:139},ж:{x:884,y:154,w:99,h:139},э:{x:982,y:154,w:98,h:139},shift:{x:0,y:293,w:120,h:154},{shift}:{x:0,y:293,w:120,h:154},я:{x:119,y:293,w:94,h:154},ч:{x:212,y:293,w:95,h:154},с:{x:306,y:293,w:94,h:154},м:{x:399,y:293,w:95,h:154},и:{x:493,y:293,w:94,h:154},т:{x:586,y:293,w:95,h:154},ь:{x:680,y:293,w:94,h:154},б:{x:773,y:293,w:95,h:154},ю:{x:867,y:293,w:95,h:154},backspace:{x:961,y:293,w:119,h:154},{backspace}:{x:961,y:293,w:119,h:154},toNumberState:{x:0,y:447,w:141,h:184},{toNumberState}:{x:0,y:447,w:141,h:184},globe:{x:140,y:447,w:120,h:184},{globe}:{x:140,y:447,w:120,h:184},comma:{x:259,y:447,w:98,h:184},space:{x:356,y:447,w:455,h:184},{space}:{x:356,y:447,w:455,h:184},period:{x:810,y:447,w:98,h:184},enter:{x:907,y:447,w:173,h:184},{enter}:{x:907,y:447,w:173,h:184}}'

def fix_build_file():
    # Читаем файл
    with open('build/index.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Паттерн для поиска keyDimensions
    # Ищем от "keyDimensions={" до закрывающей "}" с вложенными объектами
    pattern = r'keyDimensions=\{[^\}]+:[^\}]+\}(?:,[^\}]+:[^\}]+\})*\}'
    
    # Находим старый keyDimensions
    match = re.search(pattern, content)
    if not match:
        print("ERROR: keyDimensions не найден в build/index.js!")
        return False
    
    old_keydims = match.group(0)
    print(f"Найден старый keyDimensions (длина: {len(old_keydims)} символов)")
    print(f"Первые 100 символов: {old_keydims[:100]}...")
    
    # Заменяем
    new_content = content.replace(old_keydims, f'keyDimensions={NEW_KEYDIMS}')
    
    # Проверяем, что замена произошла
    if new_content == content:
        print("ERROR: Замена не выполнена!")
        return False
    
    # Сохраняем
    with open('build/index.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Файл обновлен!")
    print(f"Новый keyDimensions (длина: {len(NEW_KEYDIMS)} символов)")
    print(f"\nПроверка ключевых координат:")
    print("  й: y=15, h=139 (правильно: y1=15, y2=154)")
    print("  ц: y=15, h=139")
    print("  space: y=447, h=184 (правильно: y1=447, y2=631)")
    
    return True

if __name__ == '__main__':
    if fix_build_file():
        print("\n=== ГОТОВО! ===")
        print("Теперь координаты клавиш соответствуют датасету.")
        print("Центр клавиши 'й': (49.5, 84.5) вместо (49.5, 92.0)")
    else:
        print("\n=== ОШИБКА! ===")
        print("Восстановите из резервной копии: cp build/index.js.backup build/index.js")

