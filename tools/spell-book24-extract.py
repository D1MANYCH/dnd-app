# spell-book24-extract.py — индекс заклинаний гл.7 «Книги Игрока 2024» (E24-2).
# Вытаскивает из PDF (вне git, путь как в phb-search.py) для каждого заклинания:
# русское имя, английское имя в [скобках], уровень, школу, ритуал, список классов
# из скобок под заголовком. Текст описаний НЕ сохраняется (только индекс).
# Запуск: python tools/spell-book24-extract.py [out.json]
# По умолчанию пишет tests/_spell-book24-index.json (UTF-8); stdout — ASCII-сводка.
# Дальше: node tools/spell-book24-diff.js
import sys, os, re, json

BOOK = r"C:\Users\Kargi\Downloads\ДНД\files\DND rules\Книга Игрока 2024 v2.5 (3).pdf"
PAGES = (225, 329)  # PDF-страницы гл.7 (списки классов гл.3 не нужны — классы указаны под каждым заклинанием)

SCHOOLS = {
    "воплощение": "воплощение", "вызов": "вызов", "иллюзия": "иллюзия", "некромантия": "некромантия",
    "ограждение": "ограждение", "очарование": "очарование", "преобразование": "преобразование",
    "прорицание": "прорицание",
}


# Списки заклинаний классов гл.3: таблицы «Заклинания <класса> N уровня» — строки
# «имя / Школа / Особое». Имена в переводе книги (сопоставление с БД — в diff.js).
CLASS_LIST_PAGES = {
    "бард": (51, 55), "волшебник": (79, 83), "друид": (91, 95), "жрец": (102, 106),
    "колдун": (113, 117), "паладин": (130, 134), "следопыт": (148, 152), "чародей": (160, 164),
}
SCHOOL_CAP = {"Вызов", "Воплощение", "Иллюзия", "Некромантия", "Ограждение", "Очарование", "Преобразование", "Прорицание"}


def extract_class_lists(doc):
    out = {}
    for cls, (a, b) in CLASS_LIST_PAGES.items():
        toks = []
        for i in range(a - 1, b):
            toks += [l.strip() for l in doc[i].get_text().splitlines() if l.strip()]
        names, pending, active = [], [], False
        for t in toks:
            if re.search(r"(\d)\s*уровня\)?$", t) and re.search(r"заклинани|заговор", t, re.I):
                active, pending = True, []
                continue
            if not active:
                continue
            if t in ("Заклинание", "Закланание", "Школа", "Особое", "Спец.", "Спец") or re.fullmatch(r"\d+", t) or t.startswith("==="):
                continue
            if t in SCHOOL_CAP:
                if pending:
                    names.append(" ".join(pending))
                pending = []
                continue
            if re.fullmatch(r"[-—КРМM,\s]+", t):
                continue
            pending.append(t)
            if len(pending) > 3:
                pending = []
        seen, uniq = set(), []
        for n in names:
            k = re.sub(r"(\w)- (\w)", r"\1\2", n)
            if k not in seen:
                seen.add(k)
                uniq.append(k)
        out[cls] = uniq
    return out


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "tests", "_spell-book24-index.json")
    if not os.path.exists(BOOK):
        print("BOOK NOT FOUND")
        return 2
    import fitz
    doc = fitz.open(BOOK)
    lines = []
    for i in range(PAGES[0] - 1, PAGES[1]):
        for l in doc[i].get_text().splitlines():
            s = l.rstrip()
            if s.strip():
                lines.append((i + 1, s))

    spells = []
    n = len(lines)
    i = 0
    while i < n:
        page, s = lines[i]
        # «Имя [Name]» на одной строке или «[Name]» отдельной строкой
        # закрытая скобка в конце строки, либо строка начинается с «[» и скобка не закрыта (перенос)
        m = re.match(r"^(?:(.+?)\s+)?\[([^\]]+)(\])\s*$", s.strip()) or re.match(r"^()\[([^\]]+)()$", s.strip())
        if not m:
            i += 1
            continue
        same_line_ru = (m.group(1) or "").strip()
        en = m.group(2).strip()
        j = i + 1
        # английское имя перенесено на вторую строку
        while not m.group(3) and j < n:
            t = lines[j][1].strip()
            en += " " + t.rstrip("]").strip()
            if t.endswith("]"):
                j += 1
                break
            j += 1
        # русское имя — строка(и) перед скобками; вторая строка, если предыдущая
        # не похожа на конец абзаца (нет точки/двоеточия в конце) и начинается с заглавной
        ru = same_line_ru or lines[i - 1][1].strip()
        # блок характеристик перед заголовком выгружается одной строкой — берём хвост после точки
        if len(ru) > 60:
            ru = re.split(r"[.!?]\s+", ru)[-1].strip()
        prev2 = lines[i - 2][1].strip() if i >= 2 and not same_line_ru else ""
        # заголовок в две строки: предыдущая строка короткая, с заглавной, без знака конца абзаца
        # и не служебная («8 уровень», «Заговоры», номер страницы)
        if (ru and prev2 and len(prev2) <= 35 and prev2[0].isupper() and not re.search(r"[.:;!?)\]]$", prev2)
                and not re.match(r"^(\d+|\d+ уровень|Заговоры|Оригинал|=== .*)$", prev2)
                and (ru[0].islower() or ru[0].isupper())):
            ru = prev2 + " " + ru
        # строка уровня
        lvl_line = lines[j][1].strip() if j < n else ""
        lm = re.match(r"^(Заговор|(\d)\s*уровень),\s*([а-яё]+)(.*)$", lvl_line, re.I)
        if not lm:
            spells.append({"ru": ru, "en": en, "page": page, "error": "no level line: " + lvl_line})
            i = j
            continue
        level = 0 if lm.group(1).lower().startswith("заговор") else int(lm.group(2))
        school = lm.group(3).lower()
        ritual = bool(re.search(r"ритуал", lvl_line, re.I))
        j += 1
        # классы в скобках, могут занимать несколько строк (переносы «по- кровитель» склеиваем)
        cls = ""
        if j < n and lines[j][1].strip().startswith("("):
            while j < n:
                t = lines[j][1].strip()
                cls += (" " if cls else "") + t
                j += 1
                if t.endswith(")"):
                    break
        cls = re.sub(r"(\w)- (\w)", r"\1\2", cls)
        classes = [c.strip().rstrip(")").lstrip("(").strip() for c in cls.split(",")] if cls else []
        classes = [c for c in classes if c]
        # ритуал в 2024 помечен в строке «Время накладывания: … или ритуал»
        if j < n and lines[j][1].strip().startswith("Время накладывания") and re.search(r"ритуал", lines[j][1], re.I):
            ritual = True
        spells.append({"ru": ru, "en": en, "level": level, "school": SCHOOLS.get(school, school),
                       "ritual": ritual, "classes": classes, "page": page})
        i = j

    # блоки характеристик (Дух зверя и т.п.) — не заклинания, отбрасываем
    errs = [s for s in spells if "error" in s]
    spells = [s for s in spells if "error" not in s]
    class_lists = extract_class_lists(doc)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"_comment": "Индекс гл.7 PHB 2024 (имена/уровень/школа/классы, без текстов) + списки заклинаний классов гл.3 (classLists, русские имена книги). Генерится tools/spell-book24-extract.py, читается tools/spell-book24-diff.js",
                   "spells": spells, "classLists": class_lists}, f, ensure_ascii=False, indent=1)
    by = {}
    for s in spells:
        by[s.get("level", "?")] = by.get(s.get("level", "?"), 0) + 1
    print("class lists: " + " ".join("%s=%d" % (k.encode("ascii", "replace").decode(), len(v)) for k, v in class_lists.items()))
    print("spells: %d  by level: %s  errors: %d -> %s" % (len(spells), sorted(by.items(), key=lambda x: str(x[0])), len(errs), os.path.normpath(out_path)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
