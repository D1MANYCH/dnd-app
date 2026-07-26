# phb-search.py — поиск правил в локальных PDF «Книги Игрока» (эталон сабагента dnd-rules).
# Книги лежат ВНЕ репозитория (git их не видит), путь — в BOOKS ниже. Требует pymupdf.
# Запуск:
#   python tools/phb-search.py 2014 find "бонус мастерства" out.txt [лимит]
#   python tools/phb-search.py 2014 page out.txt 62 63
# Результат — всегда в файл в UTF-8: консоль Windows (cp1251) кириллицу калечит.
# В stdout только ASCII-сводка. Номер страницы книги (не PDF) берётся из колонтитула.
import sys, os, re

BOOKS = {
    "2014": r"C:\Users\Kargi\Downloads\ДНД\files\DND rules\DnD5e Книга Игрока.pdf",
    "2024": r"C:\Users\Kargi\Downloads\ДНД\files\DND rules\Книга Игрока 2024 v2.5 (3).pdf",
}


def printed_page(text):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for cand in (lines[:2] + lines[-2:]) if lines else []:
        if re.match(r"^\d{1,3}$", cand):
            return cand
    return "?"


def main():
    if len(sys.argv) < 4 or sys.argv[1] not in BOOKS:
        print("usage: phb-search.py <2014|2024> find <query> <out.txt> [limit]")
        print("       phb-search.py <2014|2024> page <out.txt> <page> [page...]")
        return 2
    path = BOOKS[sys.argv[1]]
    if not os.path.exists(path):
        print("BOOK NOT FOUND: " + path.encode("ascii", "replace").decode("ascii"))
        return 2
    import fitz

    doc = fitz.open(path)
    mode = sys.argv[2]
    chunks = []

    if mode == "find":
        query = sys.argv[3].lower()
        out_path = sys.argv[4]
        limit = int(sys.argv[5]) if len(sys.argv) > 5 else 6
        for i, page in enumerate(doc):
            text = page.get_text()
            if query in text.lower():
                chunks.append("=== PDF-стр. %d | книга стр. %s ===\n%s\n"
                              % (i + 1, printed_page(text), text))
                if len(chunks) >= limit:
                    break
        print("hits: %d -> %s" % (len(chunks), out_path))
    elif mode == "page":
        out_path = sys.argv[3]
        for arg in sys.argv[4:]:
            i = int(arg) - 1
            if 0 <= i < doc.page_count:
                text = doc[i].get_text()
                chunks.append("=== PDF-стр. %d | книга стр. %s ===\n%s\n"
                              % (i + 1, printed_page(text), text))
        print("pages: %d -> %s" % (len(chunks), out_path))
    else:
        print("unknown mode: " + mode)
        return 2

    body = "".join(chunks) if chunks else "НЕ НАЙДЕНО"
    open(out_path, "w", encoding="utf-8").write(body)
    return 0


sys.exit(main())
