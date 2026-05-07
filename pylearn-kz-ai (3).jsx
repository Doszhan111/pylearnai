/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          PyLearn KZ — AI-Powered Python Learning Platform        ║
 * ║          Қазақ тілінде Python үйрену платформасы                 ║
 * ║          Production Level — v4.0                                 ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * АРХИТЕКТУРА (Architecture):
 *   /data       — Сабақтар, жетістіктер, деңгейлер деректері
 *   /services   — localStorage, Python runner, AI API қызметтері
 *   /components — Қайта қолданылатын UI компоненттері
 *   /pages      — Негізгі беттер (Dashboard, Lesson, Teacher, AI Chat)
 *
 * AI МҮМКІНДІКТЕРІ (AI Features):
 *   A) AI Code Checker  — Кодты тексеру + қателерді Қазақша түсіндіру
 *   B) AI Teacher Chat  — Python сұрақтарына жауап беру
 *   C) Smart Feedback   — Тапсырмаларға толық түсіндірме
 *   D) Hint Generator   — Тұрып қалса кеңес беру
 */

import { useState, useEffect, useCallback, useRef, memo } from "react";

// ══════════════════════════════════════════════════════════════════
// § 1. DATA — Деректер
// ══════════════════════════════════════════════════════════════════

const LESSONS = [
  {
    id: 1, icon: "🐍", xpReward: 100,
    title: "Python-ға кіріспе",
    shortDesc: "Бірінші программаны жаз",
    theory: `Python — 1991 жылы Гвидо ван Россум жасаған программалау тілі. Аты жыланнан емес, «Monty Python» деген комедиялық шоудан алынған.

Python-ды қайда қолданады?
→ Google, YouTube, Instagram, Netflix
→ Ғылым мен зерттеулер
→ Жасанды интеллект (ChatGPT де Python!)
→ Ойындар мен роботтар

print() — экранға мәтін шығарады.
Мәтінді тырнақшаға алу міндетті: "мәтін" немесе 'мәтін'`,
    examples: [
      { title: "Сәлем Әлем!", code: `print("Сәлем, Әлем!")`, output: "Сәлем, Әлем!" },
      { title: "Бірнеше жол", code: `print("Менің атым Python")\nprint("Мен 6-сыныпта оқимын")\nprint("Программалауды жақсы көремін")`, output: "Менің атым Python\nМен 6-сыныпта оқимын\nПрограммалауды жақсы көремін" },
    ],
    commonErrors: [
      { wrong: "Print('сәлем')", right: "print('сәлем')", note: "Python кіші/бас әріпті ажыратады" },
      { wrong: "print(сәлем)", right: 'print("сәлем")', note: "Мәтінді тырнақшаға алу керек" },
    ],
    tasks: [
      { id: "t1", title: "Өз атыңды шығар", desc: "print() арқылы өз атыңды экранға шығар", starter: '# Атыңды осы жерге жаз\nprint("Атым: ...")', check: (out) => out.length > 0 },
      { id: "t2", title: "3 жолды шығар", desc: "Атыңды, қалаңды, жасыңды 3 жол etip шығар", starter: 'print("Атым: ...")\nprint("Қалам: ...")\nprint("Жасым: ...")', check: (out) => out.split("\n").filter(Boolean).length >= 3 },
    ],
    tests: [
      { type: "choice", q: "Python-да экранға мәтін шығару командасы?", opts: ["write()", "print()", "echo()", "show()"], ans: 1 },
      { type: "truefalse", q: "Python-да Print() мен print() — бірдей.", ans: false },
      { type: "fill", q: '___("Сәлем") — бос орынды толтыр', hint: "Мәтін шығаратын функция", ans: "print" },
      { type: "choice", q: "Python тілін кім жасады?", opts: ["Билл Гейтс", "Гвидо ван Россум", "Стив Джобс", "Линус Торвальдс"], ans: 1 },
      { type: "truefalse", q: "Instagram Python тілінде жазылған.", ans: true },
      { type: "choice", q: 'print("7" + "3") нәтижесі?', opts: ["10", "73", "қате", "7 3"], ans: 1 },
    ],
  },
  {
    id: 2, icon: "📦", xpReward: 120,
    title: "Айнымалылар",
    shortDesc: "Деректерді сақта және қолдан",
    theory: `Айнымалы — деректерді сақтайтын «жәшік». Оған ат беріп, ішіне мән саласың.

Жасау ережелері:
→ = белгісі арқылы жасалады: san = 5
→ Атауы әріптен немесе _ белгісінен басталуы керек
→ Бос орын болмайды: menin_atym ✓, менің атым ✗
→ Python кіші/бас әріпті ажыратады: jas ≠ Jas

Мән түрлері:
→ Сан: san = 42
→ Мәтін: at = "Арман"  
→ Ондық: baga = 3.99`,
    examples: [
      { title: "Айнымалы жасау", code: `at = "Арман"\njas = 13\nqala = "Астана"\nprint(at)\nprint(jas)\nprint(qala)`, output: "Арман\n13\nАстана" },
      { title: "Есептеу", code: `baga = 500\nadet = 3\njami = baga * adet\nprint("Жиыны:", jami, "теңге")`, output: "Жиыны: 1500 теңге" },
    ],
    commonErrors: [
      { wrong: "менің атым = 'Арман'", right: "menin_atym = 'Арман'", note: "Атауда бос орын болмайды" },
      { wrong: "print(at) — at анықталмаса", right: "at = 'Арман'\nprint(at)", note: "Алдымен жасап, сонан соң қолдан" },
    ],
    tasks: [
      { id: "t1", title: "Айнымалылар жаса", desc: "at, jas, qala айнымалыларын жасап шығар", starter: 'at = "Атың"\njas = 13\nqala = "Қалаң"\nprint(at, jas, qala)', check: (out) => out.length > 0 },
      { id: "t2", title: "Баға есепте", desc: "baga=250, adet=4, jami = baga*adet шығар", starter: 'baga = 250\nadet = 4\njami = baga * adet\nprint("Жиыны:", jami)', check: (out) => out.includes("1000") },
    ],
    tests: [
      { type: "choice", q: "Айнымалыға мән беру белгісі?", opts: ["==", "=", "!=", ":="], ans: 1 },
      { type: "truefalse", q: "Python-да jas мен Jas — бірдей айнымалылар.", ans: false },
      { type: "fill", q: "san ___ 10 — санды 10-ға тең ету", hint: "Меншіктеу операторы", ans: "=" },
      { type: "choice", q: 'at = "Арман" — "Арман" не?', opts: ["Функция", "Айнымалы мәні", "Команда", "Сан"], ans: 1 },
      { type: "truefalse", q: "Айнымалы атында бос орын болуы мүмкін.", ans: false },
      { type: "choice", q: "baga=100; adet=3; print(baga*adet) — нәтиже?", opts: ["103", "300", "1003", "қате"], ans: 1 },
    ],
  },
  {
    id: 3, icon: "🔢", xpReward: 130,
    title: "Деректер түрлері",
    shortDesc: "int, float, str, bool",
    theory: `Python-да 4 негізгі деректер түрі:

int   — бүтін сан:    42, -5, 0
float — ондық сан:    3.14, -0.5
str   — мәтін:        "Сәлем", 'Python'
bool  — логикалық:    True, False

type() — деректер түрін анықтайды
int()  — мәтінді санға айналдырады
str()  — санды мәтінге айналдырады
float()— санды ондыққа айналдырады`,
    examples: [
      { title: "Түрлерді тексеру", code: `san = 42\nondyk = 3.14\nmetin = "Python"\ndurys = True\nprint(type(san))\nprint(type(metin))`, output: "<class 'int'>\n<class 'str'>" },
      { title: "Айналдыру", code: `metin_san = "25"\nnagty_san = int(metin_san)\nprint(nagty_san + 5)`, output: "30" },
    ],
    commonErrors: [
      { wrong: '"5" + 3', right: 'int("5") + 3', note: "Мәтін санды қоса алмайды, алдымен айналдыр" },
      { wrong: "true / false", right: "True / False", note: "bool мәндері бас әріппен жазылады" },
    ],
    tasks: [
      { id: "t1", title: "Түрлерді анықта", desc: "4 айнымалы жасап, type() арқылы шығар", starter: 'a = 10\nb = 3.14\nc = "Python"\nd = True\nprint(type(a))\nprint(type(b))', check: (out) => out.includes("int") },
      { id: "t2", title: "Айналдыру", desc: '"30" мәтінін int-ке айналдырып, 20 қос', starter: 'metin = "30"\nsan = int(metin)\nprint(san + 20)', check: (out) => out.includes("50") },
    ],
    tests: [
      { type: "choice", q: "3.14 қандай тип?", opts: ["int", "str", "float", "bool"], ans: 2 },
      { type: "fill", q: '"42"-ні санға айналдыру: ___(\"42\")', hint: "Санға айналдыратын функция", ans: "int" },
      { type: "truefalse", q: "Python-да bool мәні: true (кіші әріппен).", ans: false },
      { type: "choice", q: "type(True) нәтижесі?", opts: ["bool", "int", "str", "True"], ans: 0 },
      { type: "truefalse", q: "str(100) нәтижесі — '100' мәтіні.", ans: true },
      { type: "choice", q: 'int("5") + int("3") = ?', opts: ["53", "8", "қате", "5+3"], ans: 1 },
    ],
  },
  {
    id: 4, icon: "⌨️", xpReward: 120,
    title: "input / print",
    shortDesc: "Пайдаланушымен сөйлес",
    theory: `input() — пайдаланушыдан деректер алады.
print() — экранға шығарады.

МАҢЫЗДЫ: input() БАРЛЫҒЫН мәтін (str) түрінде қайтарады!
Санмен жұмыс жасасаң — int() немесе float() керек.

print() мүмкіндіктері:
→ print("Сәлем", "Арман")      — бос орынмен
→ print("Жасы:", 13)           — мәтін + сан
→ print(f"Атым {at}, жасым {jas}") — f-string`,
    examples: [
      { title: "Атын сұрап сәлемдесу", code: `at = input("Атыңды жаз: ")\nprint("Сәлем,", at, "!")`, output: "Атыңды жаз: Арман\nСәлем, Арман !" },
      { title: "Жасын сұрап есептеу", code: `jyl = int(input("Туған жылың: "))\njas = 2025 - jyl\nprint(f"Жасың: {jas}")`, output: "Туған жылың: 2012\nЖасың: 13" },
    ],
    commonErrors: [
      { wrong: "san = input(); san + 5", right: "san = int(input()); san + 5", note: "input() мәтін береді, int() санға айналдырады" },
      { wrong: 'print("Жас:" + 13)', right: 'print("Жас:", 13)', note: "Мәтін мен санды + арқылы қоса алмайсың" },
    ],
    tasks: [
      { id: "t1", title: "Сәлемдесу", desc: "Атын сұрап, 'Сәлем, [ат]!' деп шығар", starter: 'at = input("Атыңды жаз: ")\nprint("Сәлем,", at, "!")', check: (out) => out.length > 0 },
      { id: "t2", title: "Жас есептеу", desc: "Туған жылды сұрап, 2025-тен алып жасын шығар", starter: 'jyl = int(input("Туған жылың: "))\njas = 2025 - jyl\nprint("Жасың:", jas)', check: (out) => out.length > 0 },
    ],
    tests: [
      { type: "choice", q: "input() қандай тип береді?", opts: ["int", "float", "str", "bool"], ans: 2 },
      { type: "fill", q: "Санды оқу: san = ___(input())", hint: "Санға айналдырады", ans: "int" },
      { type: "truefalse", q: 'print("Жасым:", 15) дұрыс жазылған.', ans: true },
      { type: "choice", q: 'f"Атым {at}" — бұл не?', opts: ["Айнымалы", "f-string", "Функция", "Тізім"], ans: 1 },
      { type: "truefalse", q: "input() санды автоматты int-ке айналдырады.", ans: false },
      { type: "choice", q: "at='Арман'; print(f'Сәлем {at}') нәтижесі?", opts: ["Сәлем {at}", "Сәлем Арман", "қате", "Сәлем"], ans: 1 },
    ],
  },
  {
    id: 5, icon: "➕", xpReward: 140,
    title: "Арифметика",
    shortDesc: "Математикалық операциялар",
    theory: `Python математика калькуляторы сияқты!

+   қосу:        5 + 3 = 8
-   алу:         10 - 4 = 6
*   көбейту:     3 * 4 = 12
/   бөлу:        10 / 3 = 3.333...
//  бүтін бөлу:  10 // 3 = 3
%   қалдық:      10 % 3 = 1
**  дәреже:      2 ** 8 = 256

Операциялар тәртібі (математикадағыдай):
1. ** (дәреже)
2. * / // % 
3. + -
Жақша арқылы тәртіпті өзгертуге болады: (2+3)*4`,
    examples: [
      { title: "Негізгі операциялар", code: `a = 17\nb = 5\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a // b)\nprint(a % b)`, output: "22\n12\n85\n3\n2" },
      { title: "Шеңбер аумағы", code: `r = 7\npi = 3.14159\naumaq = pi * r ** 2\nprint("Аумағы:", round(aumaq, 2))`, output: "Аумағы: 153.94" },
    ],
    commonErrors: [
      { wrong: "10 / 0", right: "if b != 0: print(a/b)", note: "Нөлге бөлу ZeroDivisionError береді" },
      { wrong: "2+3*4 = 20", right: "2+3*4 = 14", note: "* алдымен орындалады, + кейін" },
    ],
    tasks: [
      { id: "t1", title: "Тіктөртбұрыш ауданы", desc: "en=8, biiktik=5 болса ауданы?", starter: 'en = 8\nbiiktik = 5\naudan = en * biiktik\nprint("Аудан:", audan)', check: (out) => out.includes("40") },
      { id: "t2", title: "Ақша есебі", desc: "450*6 — 6 тауардың бағасын есепте", starter: 'baga = 450\nadet = 6\njami = baga * adet\nprint("Жиыны:", jami, "теңге")', check: (out) => out.includes("2700") },
    ],
    tests: [
      { type: "choice", q: "17 % 5 = ?", opts: ["3", "2", "1", "4"], ans: 1 },
      { type: "choice", q: "2 ** 10 = ?", opts: ["20", "512", "1024", "256"], ans: 2 },
      { type: "fill", q: "Бүтін бөлу: 17 ___ 5 = 3", hint: "Екі сызықша", ans: "//" },
      { type: "truefalse", q: "2 + 3 * 4 = 20 (Python-да)", ans: false },
      { type: "choice", q: "10 / 4 нәтижесінің типі?", opts: ["int", "float", "str", "bool"], ans: 1 },
      { type: "truefalse", q: "** операторы дәрежеге шығарады.", ans: true },
    ],
  },
  {
    id: 6, icon: "🔀", xpReward: 150,
    title: "Шарттар (if/elif/else)",
    shortDesc: "Шешім қабылдауды үйрен",
    theory: `if — шарт дұрыс болса, блок орындалады.
elif — келесі шартты тексереді.
else — басқа барлық жағдай.

Синтаксис:
if шарт:
    код (4 бос орын!)
elif екінші_шарт:
    код
else:
    код

Салыстыру:  ==  !=  >  <  >=  <=
Логикалық:  and  or  not`,
    examples: [
      { title: "Жұп/Тақ анықтау", code: `san = 17\nif san % 2 == 0:\n    print("Жұп сан")\nelse:\n    print("Тақ сан")`, output: "Тақ сан" },
      { title: "Баға жүйесі", code: `ball = 85\nif ball >= 90:\n    print("5 — Үздік")\nelif ball >= 70:\n    print("4 — Жақсы")\nelif ball >= 50:\n    print("3 — Қанағатт.")\nelse:\n    print("2 — Қайта оқы")`, output: "4 — Жақсы" },
    ],
    commonErrors: [
      { wrong: "if x = 5:", right: "if x == 5:", note: "= меншіктеу, == тең салыстыру" },
      { wrong: "if шарт (қос нүктесіз)", right: "if шарт:", note: "Қос нүкте : міндетті!" },
    ],
    tasks: [
      { id: "t1", title: "Жұп/Тақ", desc: "san=24 болса, жұп немесе тақ екенін шығар", starter: 'san = 24\nif san % 2 == 0:\n    print("Жұп сан")\nelse:\n    print("Тақ сан")', check: (out) => out.includes("Жұп") },
      { id: "t2", title: "Максимум", desc: "a=15, b=22 — үлкенін шығар", starter: 'a = 15\nb = 22\nif a > b:\n    print("Үлкені:", a)\nelse:\n    print("Үлкені:", b)', check: (out) => out.includes("22") },
    ],
    tests: [
      { type: "choice", q: "if блогының соңына не қойылады?", opts: [".", ";", ":", ","], ans: 2 },
      { type: "choice", q: '"Тең" салыстыру операторы?', opts: ["=", "==", "===", "!="], ans: 1 },
      { type: "truefalse", q: "else болуы міндетті.", ans: false },
      { type: "fill", q: "Тең емес: a ___ b", hint: "! + =", ans: "!=" },
      { type: "choice", q: "ball=75: if ball>=90: '5' elif ball>=70: '4' else: '3' — нәтиже?", opts: ["5", "4", "3", "қате"], ans: 1 },
      { type: "truefalse", q: "elif — else if дегенді білдіреді.", ans: true },
    ],
  },
  {
    id: 7, icon: "🔁", xpReward: 160,
    title: "For циклі",
    shortDesc: "Белгілі рет қайталан",
    theory: `for — range() немесе тізім бойынша айналып өтеді.

range() функциясы:
range(5)      → 0,1,2,3,4
range(1,6)    → 1,2,3,4,5
range(0,10,2) → 0,2,4,6,8 (қадам 2)

Тізіммен:
for san in [10, 20, 30]:
    print(san)

Мәтінмен:
for harp in "Python":
    print(harp)`,
    examples: [
      { title: "1-ден 5-ке дейін", code: `for i in range(1, 6):\n    print(i)`, output: "1\n2\n3\n4\n5" },
      { title: "Көбейту кестесі", code: `for i in range(1, 6):\n    print(f"3 × {i} = {3*i}")`, output: "3 × 1 = 3\n3 × 2 = 6\n3 × 3 = 9\n3 × 4 = 12\n3 × 5 = 15" },
    ],
    commonErrors: [
      { wrong: "range(1,5) → 1,2,3,4,5", right: "range(1,5) → 1,2,3,4 тек!", note: "Соңғы сан кірмейді" },
      { wrong: "for i in range(5) (қос нүктесіз)", right: "for i in range(5):", note: "Қос нүкте міндетті" },
    ],
    tasks: [
      { id: "t1", title: "Кестені шығар", desc: "5-ке көбейту кестесі (1×5 ... 10×5)", starter: 'for i in range(1, 11):\n    print(i, "×", 5, "=", i*5)', check: (out) => out.includes("50") },
      { id: "t2", title: "Жұп сандар", desc: "1-20 аралығындағы жұп сандарды шығар", starter: 'for i in range(2, 21, 2):\n    print(i)', check: (out) => out.includes("20") && out.includes("2") },
    ],
    tests: [
      { type: "choice", q: "range(3, 8) — қандай сандар?", opts: ["3,4,5,6,7,8", "3,4,5,6,7", "4,5,6,7,8", "3,4,5"], ans: 1 },
      { type: "fill", q: "0,2,4,6,8 шығару: range(0,10,___)", hint: "Қадам мөлшері", ans: "2" },
      { type: "truefalse", q: "range(5) нәтижесі: 1,2,3,4,5", ans: false },
      { type: "choice", q: 'for h in "КАЗ" — неше рет орындалады?', opts: ["2", "3", "4", "1"], ans: 1 },
      { type: "truefalse", q: "range(1, 6) — 5 элемент береді.", ans: true },
      { type: "choice", q: "range(10, 0, -2) — алғашқы мән?", opts: ["0", "10", "8", "2"], ans: 1 },
    ],
  },
  {
    id: 8, icon: "🌀", xpReward: 160,
    title: "While циклі",
    shortDesc: "Шарт бойынша қайталан",
    theory: `while — шарт дұрыс болса, қайталана береді.

while шарт:
    код

break   — циклді тоқтатады
continue — келесі итерацияға өту

НАЗАР: Шексіз цикл болмас үшін
шарт өзгеруі тиіс!

Мысал: санауыш = 0
while санауыш < 5:
    print(санауыш)
    санауыш += 1`,
    examples: [
      { title: "Санауыш", code: `i = 1\nwhile i <= 5:\n    print(i)\n    i += 1`, output: "1\n2\n3\n4\n5" },
      { title: "break қолдану", code: `i = 0\nwhile True:\n    i += 1\n    if i == 4:\n        break\n    print(i)`, output: "1\n2\n3" },
    ],
    commonErrors: [
      { wrong: "while True: (break жоқ)", right: "while True: ... break", note: "break болмаса шексіз цикл!" },
      { wrong: "while i < 5 (i өзгертпей)", right: "while i < 5: ... i += 1", note: "Санауышты өзгерт!" },
    ],
    tasks: [
      { id: "t1", title: "Кері санау", desc: "5-тен 1-ге дейін кері санау", starter: 'i = 5\nwhile i >= 1:\n    print(i)\n    i -= 1', check: (out) => out.includes("5") && out.includes("1") },
      { id: "t2", title: "Жиынтық", desc: "1+2+...+10 жиынтығын есепте", starter: 'jami = 0\ni = 1\nwhile i <= 10:\n    jami += i\n    i += 1\nprint("Жиыны:", jami)', check: (out) => out.includes("55") },
    ],
    tests: [
      { type: "choice", q: "while циклін тоқтататын команда?", opts: ["stop", "exit", "break", "end"], ans: 2 },
      { type: "truefalse", q: "while True: шексіз цикл жасайды.", ans: true },
      { type: "fill", q: "Санауышты арттыру: i ___ 1", hint: "+= операторы", ans: "+=" },
      { type: "choice", q: "continue не істейді?", opts: ["Циклді тоқтатады", "Келесіге өтеді", "Циклді бастайды", "Мән береді"], ans: 1 },
      { type: "truefalse", q: "while i < 5: i += 1 — 5 рет орындалады.", ans: true },
      { type: "choice", q: "i=0; while i<3: print(i); i+=1 — нәтиже?", opts: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"], ans: 1 },
    ],
  },
  {
    id: 9, icon: "📋", xpReward: 170,
    title: "Тізімдер (Lists)",
    shortDesc: "Деректер жинақтарымен жұмыс",
    theory: `Тізім — бірнеше мәнді сақтайтын құрылым.

Жасау: meyveler = ["алма", "алмұрт", "апельсин"]
Индекс: meyveler[0] → "алма" (0-дан басталады!)
Соңғысы: meyveler[-1] → "апельсин"

Әдістер:
.append(мән) — соңына қосу
.remove(мән) — жою
.sort()       — сұрыптау
len(тізім)    — ұзындық`,
    examples: [
      { title: "Тізім жасау", code: `sandар = [3, 1, 4, 1, 5, 9]\nprint(sandар[0])\nprint(len(sandар))\nsandар.append(2)\nprint(sandар)`, output: "3\n6\n[3, 1, 4, 1, 5, 9, 2]" },
      { title: "Тізімде цикл", code: `qalalar = ["Астана", "Алматы", "Шымкент"]\nfor q in qalalar:\n    print(q)`, output: "Астана\nАлматы\nШымкент" },
    ],
    commonErrors: [
      { wrong: "tizim[3] — 3 элемент болса", right: "тізімде индекс 0-ден басталады", note: "3 элементтің соңғысы [2]" },
      { wrong: "tizim.add(мән)", right: "tizim.append(мән)", note: "Python-да .add() жоқ, .append() қолдан" },
    ],
    tasks: [
      { id: "t1", title: "Тізім жаса", desc: "5 затты тізімге сал, бірін қос, барлығын шығар", starter: 'zattар = ["кітап", "қалам", "дәптер", "сызғыш", "өшіргіш"]\nzattар.append("портфель")\nprint(zattар)', check: (out) => out.includes("[") },
      { id: "t2", title: "Жиынтық", desc: "Сандар тізімінің жиынтығын санауыш арқылы есепте", starter: 'sandар = [10, 20, 30, 40, 50]\njami = 0\nfor s in sandар:\n    jami += s\nprint("Жиыны:", jami)', check: (out) => out.includes("150") },
    ],
    tests: [
      { type: "choice", q: "tizim = [10,20,30]; tizim[1] = ?", opts: ["10", "20", "30", "қате"], ans: 1 },
      { type: "fill", q: "Тізімге қосу: tizim.___(мән)", hint: "Соңына қосу", ans: "append" },
      { type: "truefalse", q: "Тізім индексі 1-ден басталады.", ans: false },
      { type: "choice", q: "len([1,2,3,4,5]) = ?", opts: ["4", "5", "6", "0"], ans: 1 },
      { type: "truefalse", q: "tizim[-1] — тізімнің соңғы элементі.", ans: true },
      { type: "choice", q: "Тізімдегі элементтерді өңдеуге қандай цикл қолайлы?", opts: ["while", "for", "if", "def"], ans: 1 },
    ],
  },
  {
    id: 10, icon: "⚙️", xpReward: 180,
    title: "Функциялар",
    shortDesc: "Кодты қайта қолдан",
    theory: `Функция — аталған код блогы. Бір рет жаз, көп рет шақыр.

def функция_аты(параметрлер):
    код
    return нәтиже

Неліктен керек?
→ Кодты қайталамайсың
→ Программа ұйымдасқан болады
→ Бір жерде өзгертсең — бәрі өзгереді

return — нәтиже қайтарады (болмаса None)
Параметрлер — функцияға берілетін мәндер`,
    examples: [
      { title: "Қарапайым функция", code: `def salemdese(at):\n    print(f"Сәлем, {at}!")\n\nsalemdese("Арман")\nsalemdese("Аида")`, output: "Сәлем, Арман!\nСәлем, Аида!" },
      { title: "Мән қайтару", code: `def audan(en, biiktik):\n    return en * biiktik\n\na = audan(5, 3)\nb = audan(10, 4)\nprint(a, b)`, output: "15 40" },
    ],
    commonErrors: [
      { wrong: "def func() (қос нүктесіз)", right: "def func():", note: "Қос нүкте міндетті" },
      { wrong: "func() — дейін шақыру", right: "def func(): ... ; func()", note: "Алдымен жасап, сонан шақыр" },
    ],
    tasks: [
      { id: "t1", title: "Квадрат функциясы", desc: "Санның квадратын қайтаратын функция жаз", starter: 'def kvadrat(san):\n    return san * san\n\nprint(kvadrat(5))\nprint(kvadrat(9))', check: (out) => out.includes("25") && out.includes("81") },
      { id: "t2", title: "Максимум функциясы", desc: "2 санның үлкенін қайтар", starter: 'def maksimum(a, b):\n    if a > b:\n        return a\n    else:\n        return b\n\nprint(maksimum(7, 12))\nprint(maksimum(100, 50))', check: (out) => out.includes("12") && out.includes("100") },
    ],
    tests: [
      { type: "choice", q: "Функция жасау кілт сөзі?", opts: ["function", "func", "def", "fn"], ans: 2 },
      { type: "fill", q: "Мән қайтару: ___ a + b", hint: "Нәтижені қайтару", ans: "return" },
      { type: "truefalse", q: "Функцияны жасамай тұрып шақыруға болады.", ans: false },
      { type: "choice", q: "def f(a, b): — a, b нелер?", opts: ["Айнымалылар", "Параметрлер", "Тізімдер", "Шарттар"], ans: 1 },
      { type: "truefalse", q: "return жоқ функция None қайтарады.", ans: true },
      { type: "choice", q: "def sq(n): return n*n — sq(6) = ?", opts: ["12", "36", "66", "қате"], ans: 1 },
    ],
  },
  {
    id: 11, icon: "🎮", xpReward: 200,
    title: "Санды тап ойыны",
    shortDesc: "Нақты ойын жаз!",
    theory: `Бұл сабақта нақты ойын жазамыз!

random модулі — кездейсоқ сандар жасайды:
import random
san = random.randint(1, 100)

Ойын алгоритмі:
1. import random
2. Кездейсоқ сан жаса (1-100)
3. Пайдаланушыдан болжам сұра
4. Аз/Көп/Дұрыс деп хабарла
5. Тапқанша қайтала
6. Нешінші болжамда тапқанын шығар`,
    examples: [
      { title: "random.randint()", code: `import random\nsan = random.randint(1, 10)\nprint("Кездейсоқ:", san)`, output: "Кездейсоқ: 7" },
      { title: "Ойын логикасы", code: `maqsat = 63\nboldzhau = 50\nif boldzhau < maqsat:\n    print("Аз! Үлкенірек")\nelif boldzhau > maqsat:\n    print("Көп! Кішірек")\nelse:\n    print("Дұрыс!")`, output: "Аз! Үлкенірек" },
    ],
    commonErrors: [
      { wrong: "import random ұмыту", right: "import random — бірінші жолда", note: "Модульді импорттауды ұмытпа" },
      { wrong: "input() нәтижесін int()-ке салмау", right: "int(input())", note: "input() мәтін береді, int() санға айналдырады" },
    ],
    tasks: [
      { id: "t1", title: "Болжам тексеру", desc: "maqsat=42, boldzhau=30 болса, аз/көп/дұрыс шығар", starter: 'maqsat = 42\nboldzhau = 30\nif boldzhau < maqsat:\n    print("Аз!")\nelif boldzhau > maqsat:\n    print("Көп!")\nelse:\n    print("Дұрыс!")', check: (out) => out.includes("Аз") },
    ],
    tests: [
      { type: "choice", q: "Кездейсоқ сан жасайтын модуль?", opts: ["math", "random", "time", "os"], ans: 1 },
      { type: "fill", q: "1-100 аралығында: random.___(1, 100)", hint: "Бүтін кездейсоқ сан", ans: "randint" },
      { type: "truefalse", q: "random.randint(1, 10) — 10 да шыға алады.", ans: true },
      { type: "choice", q: "random.randint(5, 5) = ?", opts: ["4", "5", "6", "кездейсоқ"], ans: 1 },
      { type: "truefalse", q: "import random — файлдың бас жағында жазылады.", ans: true },
      { type: "choice", q: "Ойын циклі қандай болуы тиіс?", opts: ["for", "while True: + break", "if/else", "функция"], ans: 1 },
    ],
  },
  {
    id: 12, icon: "🏆", xpReward: 300,
    title: "Финалдық жоба",
    shortDesc: "Барлық білімді біріктір!",
    theory: `Мақтаймыз! 11 сабақты аяқтадың! 🎉

Финалдық жобада не болуы керек:
✓ Кем дегенде 3 функция (def)
✓ Кем дегенде 1 цикл (for немесе while)
✓ Шарттар (if/elif/else)
✓ Тізімдер ([...])
✓ Пайдаланушымен диалог (input/print)

Жоба идеялары:
🎮 Викторина — сұрақтар мен жауаптар
📊 Калькулятор — қосымша мүмкіндіктермен
📚 Оқушылар журналы — бағаларды сақтау
🌡️ Конвертер — темп/валюта/ұзындық`,
    examples: [
      { title: "Мини-калькулятор", code: `def qos(a, b): return a + b\ndef al(a, b): return a - b\ndef kobe(a, b): return a * b\n\na = 10\nb = 3\nprint("+:", qos(a,b))\nprint("-:", al(a,b))\nprint("*:", kobe(a,b))`, output: "+: 13\n-: 7\n*: 30" },
    ],
    commonErrors: [],
    tasks: [
      { id: "t1", title: "Финалдық жоба", desc: "Өзің таңдаған мини-программа жаз (кем дегенде 20 жол)", starter: '# ═══════════════════════════════════\n# Менің финалдық жобам\n# Атым: ...\n# Тақырып: ...\n# ═══════════════════════════════════\n\nprint("Жобаңды осы жерге жаз!")', check: () => true },
    ],
    tests: [
      { type: "choice", q: "Функция жасау кілт сөзі?", opts: ["function", "def", "func", "create"], ans: 1 },
      { type: "truefalse", q: "Python-да тізім [] жақшамен жасалады.", ans: true },
      { type: "fill", q: "Кездейсоқ сан үшін: import ___", hint: "Модуль аты", ans: "random" },
      { type: "choice", q: "range(1, 6) неше элемент?", opts: ["4", "5", "6", "7"], ans: 1 },
      { type: "truefalse", q: "while True: — шексіз цикл жасайды.", ans: true },
      { type: "choice", q: "12 сабақты аяқтадың! Сен кімсің?", opts: ["Жаңадан бастаушы", "Орташа", "Python Hero 🐍", "Хакер"], ans: 2 },
    ],
  },
];

const ACHIEVEMENTS = [
  { id: "first_run", icon: "⚡", title: "Алғашқы код!", desc: "Бірінші рет кодты іске қосты", xpBonus: 25 },
  { id: "first_lesson", icon: "📖", title: "Бірінші сабақ", desc: "Бірінші сабақты аяқтады", xpBonus: 50 },
  { id: "test_ace", icon: "🎯", title: "Тест шебері", desc: "Сабақтың барлық тесттерінен 100% алды", xpBonus: 75 },
  { id: "half_done", icon: "🌟", title: "Жартысы аяқталды", desc: "6 сабақты аяқтады", xpBonus: 100 },
  { id: "loop_master", icon: "🔁", title: "Цикл шебері", desc: "For және while сабақтарын аяқтады", xpBonus: 80 },
  { id: "logic_guru", icon: "🧠", title: "Логика данышпаны", desc: "Шарттар сабағын аяқтады", xpBonus: 80 },
  { id: "python_hero", icon: "🏆", title: "Python Hero", desc: "Барлық 12 сабақты аяқтады!", xpBonus: 300 },
  { id: "speed_run", icon: "🚀", title: "Жылдам оқушы", desc: "Бір күнде 3 сабақ аяқтады", xpBonus: 60 },
  { id: "ai_helper", icon: "🤖", title: "AI достым", desc: "AI мұғалімнен 5 сұрақ сұрады", xpBonus: 40 },
];

const LEVELS = [
  { min: 0, name: "Жаңадан бастаушы", color: "#94a3b8", emoji: "🌱" },
  { min: 300, name: "Үйренуші", color: "#60a5fa", emoji: "📘" },
  { min: 700, name: "Практик", color: "#34d399", emoji: "💻" },
  { min: 1300, name: "Білгір", color: "#a78bfa", emoji: "🔮" },
  { min: 2000, name: "Шебер", color: "#f59e0b", emoji: "⭐" },
  { min: 3000, name: "Про", color: "#f97316", emoji: "🔥" },
  { min: 4500, name: "Python Hero 🐍", color: "#ef4444", emoji: "🏆" },
];

// ══════════════════════════════════════════════════════════════════
// § 2. SERVICES — Қызметтер
// ══════════════════════════════════════════════════════════════════

// --- 2a. localStorage сақтау ---
const SAVE_KEY = "pylearn_kz_v4";
function loadSave() {
  try {
    const d = localStorage.getItem(SAVE_KEY);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}
function doSave(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
}

// --- 2b. Python кодын іске қосу (Sandbox simulator) ---
// Нақты Python кодын браузерде орындайды (қауіпсіз имитация)
function runPythonCode(code) {
  try {
    const lines = code.split("\n");
    const output = [];
    const vars = {};

    // Берілген өрнекті есептейді
    const evalExpr = (expr) => {
      expr = expr.trim();
      if (expr === "True") return true;
      if (expr === "False") return false;
      if (expr === "None") return null;
      // Жолдар (strings)
      const strM = expr.match(/^(["'])(.*)(\1)$/);
      if (strM) return strM[2];
      // f-strings
      const fstrM = expr.match(/^f(["'])(.*)\1$/);
      if (fstrM) {
        return fstrM[2].replace(/\{([^}]+)\}/g, (_, v) => {
          const val = evalExpr(v.trim());
          return val !== undefined ? val : v;
        });
      }
      // ** дәреже
      if (expr.includes("**")) {
        const parts = expr.split("**");
        const a = evalExpr(parts[0].trim());
        const b = evalExpr(parts[1].trim());
        return Math.pow(Number(a), Number(b));
      }
      // % қалдық
      const modM = expr.match(/^(.+?)\s*%\s*(.+)$/);
      if (modM) return Number(evalExpr(modM[1])) % Number(evalExpr(modM[2]));
      // // бүтін бөлу
      const intDivM = expr.match(/^(.+?)\s*\/\/\s*(.+)$/);
      if (intDivM) return Math.floor(Number(evalExpr(intDivM[1])) / Number(evalExpr(intDivM[2])));
      // Негізгі арифметика
      const mathM = expr.match(/^(.+?)\s*([\+\-\*\/])\s*(.+)$/);
      if (mathM) {
        const a = evalExpr(mathM[1]), b = evalExpr(mathM[3]), op = mathM[2];
        if (typeof a === "string" || typeof b === "string") {
          if (op === "+") return String(a) + String(b);
        }
        const na = Number(a), nb = Number(b);
        if (op === "+") return na + nb;
        if (op === "-") return na - nb;
        if (op === "*") return na * nb;
        if (op === "/") return nb !== 0 ? na / nb : "ZeroDivisionError: division by zero";
      }
      // Сандар
      const numM = expr.match(/^-?\d+\.?\d*$/);
      if (numM) return parseFloat(expr);
      // Функция шақыру
      if (expr.includes("(")) {
        const fnM = expr.match(/^(\w+)\((.*)?\)$/);
        if (fnM) {
          const fn = fnM[1], arg = fnM[2] ? evalExpr(fnM[2]) : undefined;
          if (fn === "int") return Math.trunc(Number(arg));
          if (fn === "float") return parseFloat(arg);
          if (fn === "str") return String(arg);
          if (fn === "len") return typeof arg === "string" ? arg.length : 0;
          if (fn === "abs") return Math.abs(Number(arg));
          if (fn === "round") return Math.round(Number(arg));
          if (fn === "type") {
            const v = evalExpr(fnM[2]);
            if (typeof v === "boolean") return "<class 'bool'>";
            if (typeof v === "number" && Number.isInteger(v)) return "<class 'int'>";
            if (typeof v === "number") return "<class 'float'>";
            if (typeof v === "string") return "<class 'str'>";
          }
        }
      }
      if (expr in vars) return vars[expr];
      return expr;
    };

    let i = 0;
    while (i < lines.length) {
      const rawLine = lines[i];
      const line = rawLine.trim();
      i++;
      if (!line || line.startsWith("#") || line.startsWith("import") || line.startsWith("def ") || line.startsWith("class ")) continue;

      // print()
      if (line.startsWith("print(")) {
        const inner = line.slice(6, line.lastIndexOf(")")).trim();
        if (!inner) { output.push(""); continue; }
        const parts = inner.split(/,\s*/);
        const resolved = parts.map(p => {
          const v = evalExpr(p.trim());
          return v !== undefined ? String(v) : p.trim();
        });
        output.push(resolved.join(" "));
        continue;
      }

      // += -= *= /=
      const augM = line.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
      if (augM) {
        const [, name, op, valStr] = augM;
        const current = vars[name] ?? 0;
        const val = evalExpr(valStr);
        if (op === "+=") vars[name] = Number(current) + Number(val);
        else if (op === "-=") vars[name] = Number(current) - Number(val);
        else if (op === "*=") vars[name] = Number(current) * Number(val);
        else if (op === "/=") vars[name] = Number(current) / Number(val);
        continue;
      }

      // Меншіктеу (assignment)
      const asnM = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (asnM) {
        vars[asnM[1]] = evalExpr(asnM[2]);
        continue;
      }

      // for цикл
      if (line.startsWith("for ") && line.includes("range(")) {
        const forM = line.match(/for\s+(\w+)\s+in\s+range\(([^)]+)\)/);
        if (forM) {
          const varName = forM[1];
          const args = forM[2].split(",").map(x => Number(evalExpr(x.trim())));
          const start = args.length >= 2 ? args[0] : 0;
          const end = args.length >= 2 ? args[1] : args[0];
          const step = args.length >= 3 ? args[2] : 1;
          const bodyLines = [];
          while (i < lines.length && (lines[i].startsWith("    ") || lines[i].startsWith("\t"))) {
            bodyLines.push(lines[i].trim()); i++;
          }
          for (let k = start; (step > 0 ? k < end : k > end) && output.length < 100; k += step) {
            vars[varName] = k;
            for (const bl of bodyLines) {
              if (bl.startsWith("print(")) {
                const inner = bl.slice(6, bl.lastIndexOf(")")).trim();
                const parts = inner.split(/,\s*/);
                output.push(parts.map(p => { const v = evalExpr(p.trim()); return v !== undefined ? String(v) : p; }).join(" "));
              }
            }
          }
        }
        continue;
      }

      // if/elif/else (қарапайым)
      if (line.startsWith("if ") && line.endsWith(":")) {
        const bodyLines = [];
        while (i < lines.length && (lines[i].startsWith("    ") || lines[i].startsWith("\t"))) {
          bodyLines.push(lines[i].trim()); i++;
        }
        const condStr = line.slice(3, -1).trim();
        let condResult = false;
        try {
          const parts = condStr.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
          if (parts) {
            const a = evalExpr(parts[1]), b = evalExpr(parts[3]);
            const na = isNaN(Number(a)) ? a : Number(a);
            const nb = isNaN(Number(b)) ? b : Number(b);
            if (parts[2] === "==") condResult = na == nb;
            else if (parts[2] === "!=") condResult = na != nb;
            else if (parts[2] === ">") condResult = na > nb;
            else if (parts[2] === "<") condResult = na < nb;
            else if (parts[2] === ">=") condResult = na >= nb;
            else if (parts[2] === "<=") condResult = na <= nb;
          }
        } catch {}
        if (condResult) {
          for (const bl of bodyLines) {
            if (bl.startsWith("print(")) {
              const inner = bl.slice(6, bl.lastIndexOf(")")).trim();
              const parts = inner.split(/,\s*/);
              output.push(parts.map(p => { const v = evalExpr(p.trim()); return v !== undefined ? String(v) : p; }).join(" "));
            }
          }
        }
        continue;
      }
    }

    return { ok: true, output: output.join("\n") || "✓ Код орындалды (шығыс жоқ)" };
  } catch (e) {
    return { ok: false, output: "⚠️ Қате: " + e.message };
  }
}

// --- 2c. AI API — Claude Anthropic API арқылы ---
// Барлық AI қолдануы осы арқылы өтеді

// AI Код тексеру — кодты талдайды және Қазақша түсіндіреді
async function aiCheckCode(code, taskDesc, output) {
  const prompt = `Сен Python мұғаліміне (Қазақстан мектебі, 6-сынып оқушылары) арналған AI көмекшісіңдей.

Тапсырма: ${taskDesc}
Оқушы коды:
\`\`\`python
${code}
\`\`\`
Код шығысы: ${output || "(шығыс жоқ)"}

Осы кодты тексер және ТІКЕЛЕЙ Қазақ тілінде жауап бер (JSON форматында):
{
  "status": "excellent" | "good" | "has_errors" | "needs_improvement",
  "score": 0-100,
  "what_is_good": "Кодтың дұрыс жақтары (2-3 сөйлем)",
  "errors": ["Қате 1 (бар болса)", "Қате 2"],
  "how_to_fix": "Қалай түзетуге болады (нақты нұсқаулар)",
  "better_version": "Жақсартылған код үлгісі (қысқаша)",
  "encouragement": "Оқушыға ынталандырушы сөз (бір сөйлем)"
}

ТЕК JSON қайтар, басқа мәтін жоқ.`;

  return callAI(prompt);
}

// AI Кеңес беру — толық жауап емес, кеңес береді
async function aiGetHint(code, taskDesc) {
  const prompt = `Сен Python мұғаліміне арналған AI-сың. Оқушыға ТОЛЫҚ жауап берме, тек бағыт бер.

Тапсырма: ${taskDesc}
Оқушы коды:
\`\`\`python
${code}
\`\`\`

Қазақ тілінде ҚЫСҚАША бір кеңес бер (2-3 сөйлем). Толық жауап берме! Тек бір нақты бағыт.`;

  return callAI(prompt);
}

// AI Мұғалім чаты — Python туралы сұрақтарға жауап
async function aiTeacherChat(messages, studentLevel) {
  const systemPrompt = `Сен PyLearn KZ платформасының AI мұғалімісің. Қазақстанда 6-сынып оқушыларына Python үйретесің.

Оқушы деңгейі: ${studentLevel}

Ережелер:
1. БАРЛЫҒЫН Қазақ тілінде жауап бер
2. Қарапайым, түсінікті тілде сөйле (6-сынып деңгейінде)
3. Мысалдар арқылы түсіндір
4. Python кодын \`\`\`python блогына сал
5. Ынталандыр, мақта
6. Сұраққа тікелей жауап бер, ұзақ кіріспе жасама`;

  const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));

  return callAI(apiMessages[apiMessages.length - 1].content, systemPrompt, apiMessages.slice(0, -1));
}

// AI Smart Feedback — тест/тапсырма нәтижесіне толық түсіндірме
async function aiSmartFeedback(question, userAnswer, correctAnswer, isCorrect) {
  const prompt = `Сен Python мұғаліміне арналған AI-сың (Қазақстан, 6-сынып).

Сұрақ: ${question}
Оқушының жауабы: ${userAnswer}
Дұрыс жауап: ${correctAnswer}
Нәтиже: ${isCorrect ? "ДҰРЫС" : "БҰРЫС"}

Қазақ тілінде JSON форматында қайтар:
{
  "explanation": "Бұл не екенін түсіндір (2-3 сөйлем, қарапайым тілде)",
  "why_correct": "Неліктен ${correctAnswer} дұрыс екенін түсіндір",
  "memory_tip": "Есте сақтауға кеңес (бір сөйлем, мысалмен)",
  "example": "Python кодындағы мысал (бар болса)"
}

ТЕК JSON қайтар.`;

  return callAI(prompt);
}

// Орталық AI шақыру функциясы
async function callAI(userMessage, systemPrompt = null, history = []) {
  const defaultSystem = "Сен Қазақстандағы Python мұғаліміне арналған AI-сың. Барлық жауаптарды Қазақ тілінде бер. Қарапайым тілде сөйле.";

  const messages = [
    ...history,
    { role: "user", content: userMessage }
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt || defaultSystem,
      messages,
    }),
  });

  if (!response.ok) throw new Error("AI қызметіне қосылу мүмкін болмады");
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ══════════════════════════════════════════════════════════════════
// § 3. STYLES — CSS айнымалылары
// ══════════════════════════════════════════════════════════════════

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg: #0a0f1e;
    --bg2: #0f1628;
    --bg3: #141d35;
    --bg4: #1a2444;
    --card: #111827;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #f0f4ff;
    --text2: #8892b0;
    --text3: #4a5568;
    --accent: #6366f1;
    --accent2: #8b5cf6;
    --green: #10b981;
    --red: #ef4444;
    --yellow: #f59e0b;
    --blue: #3b82f6;
    --cyan: #06b6d4;
    --pink: #ec4899;
    --font: 'Plus Jakarta Sans', sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --r: 12px;
    --r2: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow2: 0 2px 12px rgba(0,0,0,0.3);
    --glow: 0 0 20px rgba(99,102,241,0.3);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    line-height: 1.6;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
    50% { box-shadow: 0 0 40px rgba(99,102,241,0.6); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes xpBounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); color: var(--yellow); }
    100% { transform: scale(1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes streakPulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  .slide-in { animation: slideIn 0.3s ease forwards; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--r2);
    font-family: var(--font); font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.2s;
    text-decoration: none;
  }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-primary {
    background: var(--accent); color: white;
  }
  .btn-primary:hover:not(:disabled) { background: var(--accent2); transform: translateY(-1px); box-shadow: var(--glow); }
  .btn-ghost {
    background: transparent; color: var(--text2);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover:not(:disabled) { background: var(--bg3); color: var(--text); border-color: var(--border); }
  .btn-success {
    background: rgba(16,185,129,0.15); color: var(--green);
    border: 1px solid rgba(16,185,129,0.3);
  }
  .btn-danger {
    background: rgba(239,68,68,0.15); color: var(--red);
    border: 1px solid rgba(239,68,68,0.3);
  }
  .btn-lg { padding: 12px 24px; font-size: 14px; border-radius: var(--r); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 20px;
  }
  .card-hover {
    transition: all 0.2s;
    cursor: pointer;
  }
  .card-hover:hover {
    border-color: var(--border2);
    transform: translateY(-2px);
    box-shadow: var(--shadow2);
  }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;
  }
  .badge-xp { background: rgba(245,158,11,0.15); color: var(--yellow); }
  .badge-level { background: rgba(99,102,241,0.15); color: var(--accent); }
  .badge-streak { background: rgba(239,68,68,0.15); color: var(--red); }
  .badge-new { background: rgba(16,185,129,0.15); color: var(--green); }

  .code-block {
    background: #0d1117;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--r2);
    padding: 16px;
    font-family: var(--mono);
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-x: auto;
    color: #e6edf3;
  }

  .progress-bar {
    background: var(--bg4);
    border-radius: 999px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .tab-btn {
    padding: 8px 16px; font-size: 13px; font-weight: 500;
    border: none; cursor: pointer; border-radius: var(--r2);
    font-family: var(--font); transition: all 0.2s;
    color: var(--text2); background: transparent;
  }
  .tab-btn.active { background: var(--bg3); color: var(--text); }
  .tab-btn:hover:not(.active) { color: var(--text); }

  .input-field {
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: var(--r2);
    padding: 10px 14px;
    font-family: var(--font);
    font-size: 13px;
    color: var(--text);
    outline: none;
    width: 100%;
    transition: border-color 0.2s;
  }
  .input-field:focus { border-color: var(--accent); }
  .input-field::placeholder { color: var(--text3); }

  .textarea-code {
    background: #0d1117;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--r2);
    padding: 14px;
    font-family: var(--mono);
    font-size: 13px;
    color: #e6edf3;
    outline: none;
    width: 100%;
    resize: vertical;
    line-height: 1.7;
    transition: border-color 0.2s;
  }
  .textarea-code:focus { border-color: var(--accent); }

  .ai-bubble-user {
    background: var(--accent);
    color: white;
    border-radius: 16px 16px 4px 16px;
    padding: 10px 14px;
    max-width: 80%;
    margin-left: auto;
    font-size: 13px;
    line-height: 1.5;
  }
  .ai-bubble-ai {
    background: var(--bg3);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 16px 16px 16px 4px;
    padding: 10px 14px;
    max-width: 85%;
    font-size: 13px;
    line-height: 1.6;
  }
  .ai-bubble-ai code {
    background: rgba(0,0,0,0.4);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 12px;
    color: #7ee787;
  }
  .ai-bubble-ai pre {
    background: #0d1117;
    border-radius: var(--r2);
    padding: 12px;
    margin: 8px 0;
    overflow-x: auto;
    font-family: var(--mono);
    font-size: 12px;
    color: #e6edf3;
    white-space: pre-wrap;
  }

  .lesson-locked { opacity: 0.4; cursor: not-allowed !important; }
  .lesson-done { border-color: rgba(16,185,129,0.3) !important; }
  .lesson-next { border-color: rgba(99,102,241,0.5) !important; animation: glow 2s ease infinite; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid var(--border2);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: var(--r);
    padding: 12px 18px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    z-index: 9999;
    box-shadow: var(--shadow);
    animation: slideIn 0.3s ease;
    max-width: 320px;
  }

  .grid-lessons {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 12px;
  }

  .xp-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 999px;
    font-size: 12px; font-weight: 600;
    background: rgba(245,158,11,0.12);
    color: var(--yellow);
    border: 1px solid rgba(245,158,11,0.2);
  }

  @media (max-width: 768px) {
    .desktop-sidebar { display: none !important; }
    .grid-lessons { grid-template-columns: repeat(2, 1fr); }
    .main-grid { grid-template-columns: 1fr !important; }
  }
`;

// ══════════════════════════════════════════════════════════════════
// § 4. REUSABLE COMPONENTS — Қайта қолданылатын компоненттер
// ══════════════════════════════════════════════════════════════════

// XP прогресс жолағы компоненті
const XPBar = memo(({ xp, levels }) => {
  const lvlIdx = levels.filter(l => xp >= l.min).length - 1;
  const lvl = levels[lvlIdx];
  const nextLvl = levels[lvlIdx + 1];
  const xpInLvl = xp - lvl.min;
  const xpToNext = nextLvl ? nextLvl.min - lvl.min : 1;
  const pct = Math.min(100, Math.round((xpInLvl / xpToNext) * 100));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "18px" }}>{lvl.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", color: lvl.color }}>{lvl.name}</span>
          {nextLvl && <span style={{ fontSize: "11px", color: "var(--text3)" }}>{xpToNext - xpInLvl} XP → {nextLvl.name}</span>}
        </div>
        <div className="progress-bar" style={{ height: "6px" }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${lvl.color}, ${nextLvl?.color || lvl.color})` }} />
        </div>
      </div>
    </div>
  );
});

// Streak (серия) көрсеткіші
const StreakBadge = memo(({ streak }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", animation: "streakPulse 2s ease infinite" }}>
    <span style={{ fontSize: "16px" }}>🔥</span>
    <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--red)" }}>{streak}</span>
    <span style={{ fontSize: "11px", color: "var(--text2)" }}>күн</span>
  </div>
));

// AI жүктеу индикаторы
const AILoading = () => (
  <div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "12px 16px", background: "var(--bg3)", borderRadius: "16px 16px 16px 4px", border: "1px solid var(--border)" }}>
    <div className="spinner" />
    <span style={{ fontSize: "13px", color: "var(--text2)" }}>AI мұғалім ойлануда...</span>
  </div>
);

// Markdown-ді HTML-ге дейін арнайы өңдейді (AI жауаптары үшін)
function formatAIMessage(text) {
  if (!text) return "";
  return text
    .replace(/```python\n?([\s\S]*?)```/g, '<pre>$1</pre>')
    .replace(/```\n?([\s\S]*?)```/g, '<pre>$1</pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

// Тест сұрағы компоненті
function TestQuestion({ q, idx, onAnswer }) {
  const [sel, setSel] = useState(null);
  const [fill, setFill] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const submit = async () => {
    if (submitted) return;
    let ok = false;
    if (q.type === "choice") ok = sel === q.ans;
    if (q.type === "truefalse") ok = (sel === 0) === q.ans;
    if (q.type === "fill") ok = fill.trim().toLowerCase() === q.ans.toLowerCase();
    setCorrect(ok);
    setSubmitted(true);
    onAnswer(ok);

    // AI Smart Feedback — тек бұрыс болса немесе толық түсіндіру қажет болса
    if (!ok) {
      setAiLoading(true);
      try {
        const userAns = q.type === "choice" ? q.opts[sel] : q.type === "truefalse" ? (sel === 0 ? "Дұрыс" : "Бұрыс") : fill;
        const correctAns = q.type === "choice" ? q.opts[q.ans] : q.type === "truefalse" ? (q.ans ? "Дұрыс" : "Бұрыс") : q.ans;
        const raw = await aiSmartFeedback(q.q, userAns || "жауап берілмеді", correctAns, ok);
        let parsed = null;
        try {
          const clean = raw.replace(/```json\n?|```/g, "").trim();
          parsed = JSON.parse(clean);
        } catch { parsed = { explanation: raw, why_correct: "", memory_tip: "", example: "" }; }
        setAiFeedback(parsed);
      } catch {}
      setAiLoading(false);
    }
  };

  const canSubmit = q.type === "fill" ? fill.trim().length > 0 : sel !== null;
  const typeColors = {
    choice: { bg: "rgba(59,130,246,0.12)", text: "var(--blue)", label: "Таңдамалы" },
    truefalse: { bg: "rgba(245,158,11,0.12)", text: "var(--yellow)", label: "Дұрыс/Бұрыс" },
    fill: { bg: "rgba(16,185,129,0.12)", text: "var(--green)", label: "Толтыру" },
  };
  const tc = typeColors[q.type];

  return (
    <div className="card fade-up" style={{
      marginBottom: "12px",
      borderColor: submitted ? (correct ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)") : "var(--border)",
      background: submitted ? (correct ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)") : "var(--card)",
    }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <span style={{ background: "var(--bg4)", padding: "1px 8px", borderRadius: "999px", fontSize: "11px", color: "var(--text2)", fontWeight: "600" }}>{idx + 1}</span>
        <span style={{ background: tc.bg, color: tc.text, padding: "1px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>{tc.label}</span>
      </div>
      <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.6", marginBottom: "14px" }}>{q.q}</p>

      {q.type === "choice" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {q.opts.map((o, i) => {
            let bg = "var(--bg3)", border = "1px solid var(--border)";
            if (submitted) {
              if (i === q.ans) { bg = "rgba(16,185,129,0.1)"; border = "1px solid rgba(16,185,129,0.4)"; }
              else if (i === sel && !correct) { bg = "rgba(239,68,68,0.1)"; border = "1px solid rgba(239,68,68,0.4)"; }
            } else if (i === sel) { bg = "rgba(99,102,241,0.1)"; border = "1px solid var(--accent)"; }
            return (
              <div key={i} onClick={() => !submitted && setSel(i)}
                style={{ padding: "10px 14px", borderRadius: "8px", border, background: bg, cursor: submitted ? "default" : "pointer", fontSize: "13px", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text3)", minWidth: "16px" }}>{String.fromCharCode(65 + i)}</span>
                <span>{o}</span>
                {submitted && i === q.ans && <span style={{ marginLeft: "auto", color: "var(--green)" }}>✓</span>}
                {submitted && i === sel && !correct && i !== q.ans && <span style={{ marginLeft: "auto", color: "var(--red)" }}>✗</span>}
              </div>
            );
          })}
        </div>
      )}

      {q.type === "truefalse" && (
        <div style={{ display: "flex", gap: "10px" }}>
          {["✓ Дұрыс", "✗ Бұрыс"].map((label, i) => {
            const correctIdx = q.ans ? 0 : 1;
            let bg = "var(--bg3)", border = "1px solid var(--border)";
            if (submitted) {
              if (i === correctIdx) { bg = "rgba(16,185,129,0.1)"; border = "1px solid rgba(16,185,129,0.4)"; }
              else if (i === sel) { bg = "rgba(239,68,68,0.1)"; border = "1px solid rgba(239,68,68,0.4)"; }
            } else if (i === sel) { bg = "rgba(99,102,241,0.1)"; border = "1px solid var(--accent)"; }
            return (
              <div key={i} onClick={() => !submitted && setSel(i)}
                style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: "8px", border, background: bg, cursor: submitted ? "default" : "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.15s" }}>
                {label}
              </div>
            );
          })}
        </div>
      )}

      {q.type === "fill" && (
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <input className="input-field" value={fill} onChange={e => setFill(e.target.value)} disabled={submitted}
            onKeyDown={e => e.key === "Enter" && canSubmit && !submitted && submit()}
            placeholder={q.hint || "Жауапты жаз..."}
            style={{ width: "180px", fontFamily: "var(--mono)",
              borderColor: submitted ? (correct ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)") : undefined }} />
          {submitted && !correct && (
            <span style={{ fontSize: "13px", color: "var(--red)" }}>
              Дұрысы: <code style={{ fontFamily: "var(--mono)", background: "var(--bg4)", padding: "1px 6px", borderRadius: "4px" }}>{q.ans}</code>
            </span>
          )}
        </div>
      )}

      <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {!submitted
          ? <button className="btn btn-primary" onClick={submit} disabled={!canSubmit}>Тексеру</button>
          : <span style={{ fontSize: "13px", fontWeight: "600", color: correct ? "var(--green)" : "var(--red)" }}>
              {correct ? "✓ Дұрыс! +10 XP" : "✗ Бұрыс — AI түсіндіруді оқы"}
            </span>
        }
      </div>

      {/* AI Smart Feedback */}
      {submitted && !correct && (
        <div style={{ marginTop: "14px", padding: "14px", background: "var(--bg3)", borderRadius: "var(--r2)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "10px" }}>
            <span>🤖</span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--accent)" }}>AI Мұғалімнің түсіндіруі</span>
          </div>
          {aiLoading ? <AILoading /> : aiFeedback ? (
            <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: "1.7" }}>
              {aiFeedback.explanation && <p style={{ marginBottom: "8px" }}>{aiFeedback.explanation}</p>}
              {aiFeedback.why_correct && <p style={{ marginBottom: "8px", color: "var(--green)" }}>✓ {aiFeedback.why_correct}</p>}
              {aiFeedback.memory_tip && <p style={{ padding: "8px 12px", background: "rgba(245,158,11,0.08)", borderRadius: "6px", borderLeft: "2px solid var(--yellow)", color: "var(--text)" }}>💡 {aiFeedback.memory_tip}</p>}
              {aiFeedback.example && <div style={{ marginTop: "8px" }}><div className="code-block" style={{ fontSize: "12px" }}>{aiFeedback.example}</div></div>}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Код редакторы + іске қосу компоненті
function CodeEditor({ taskId, starter, taskDesc, onRun, onXPEarn }) {
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);

  const runCode = () => {
    const result = runPythonCode(code);
    setOutput(result);
    onRun(result);
    onXPEarn(15, "code_run");
  };

  const checkWithAI = async () => {
    if (!output) { runCode(); return; }
    setAiLoading(true);
    setAiResult(null);
    try {
      const raw = await aiCheckCode(code, taskDesc, output.output);
      const clean = raw.replace(/```json\n?|```/g, "").trim();
      let parsed;
      try { parsed = JSON.parse(clean); }
      catch { parsed = { status: "good", score: 75, what_is_good: raw, errors: [], how_to_fix: "", better_version: "", encouragement: "Жақсы!" }; }
      setAiResult(parsed);
      if (parsed.score >= 80) onXPEarn(20, "ai_check");
    } catch (e) {
      setAiResult({ status: "error", what_is_good: "AI қолжетімді емес. Кейін қайталап көр.", errors: [], encouragement: "" });
    }
    setAiLoading(false);
  };

  const getHint = async () => {
    setShowHint(true);
    setHintLoading(true);
    try {
      const h = await aiGetHint(code, taskDesc);
      setHint(h);
    } catch { setHint("AI қолжетімді емес. Теорияны қайта оқып көр! 📚"); }
    setHintLoading(false);
  };

  const statusColors = {
    excellent: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.3)", text: "var(--green)", icon: "🌟", label: "Өте жақсы!" },
    good: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", text: "var(--blue)", icon: "👍", label: "Жақсы!" },
    has_errors: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)", text: "var(--red)", icon: "🔧", label: "Қателер бар" },
    needs_improvement: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", text: "var(--yellow)", icon: "💪", label: "Жақсарту керек" },
  };

  return (
    <div>
      <textarea className="textarea-code" value={code} onChange={e => setCode(e.target.value)}
        rows={8} spellCheck={false} autoComplete="off" autoCorrect="off" />

      <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={runCode}>▶ Іске қос</button>
        <button className="btn btn-ghost" onClick={checkWithAI} disabled={aiLoading}>
          {aiLoading ? <><div className="spinner" /> AI тексеруде...</> : "🤖 AI тексер"}
        </button>
        <button className="btn btn-ghost" onClick={getHint} style={{ marginLeft: "auto" }}>💡 Кеңес</button>
      </div>

      {/* Код шығысы */}
      {output && (
        <div style={{ marginTop: "12px", padding: "12px 14px", background: "#0d1117", borderRadius: "var(--r2)", border: `1px solid ${output.ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.3)"}` }}>
          <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "6px", fontFamily: "var(--mono)" }}>
            {output.ok ? "✓ Нәтиже:" : "⚠️ Қате:"}
          </div>
          <pre style={{ fontFamily: "var(--mono)", fontSize: "13px", color: output.ok ? "#7ee787" : "#f85149", whiteSpace: "pre-wrap", margin: 0 }}>{output.output}</pre>
        </div>
      )}

      {/* AI Кеңес */}
      {showHint && (
        <div style={{ marginTop: "12px", padding: "14px", background: "rgba(245,158,11,0.06)", borderRadius: "var(--r2)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <span>💡</span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--yellow)" }}>AI Кеңесі</span>
          </div>
          {hintLoading ? <AILoading /> : <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: "1.6" }}>{hint}</p>}
        </div>
      )}

      {/* AI Тексеру нәтижесі */}
      {aiResult && (() => {
        const sc = statusColors[aiResult.status] || statusColors.good;
        return (
          <div style={{ marginTop: "12px", padding: "16px", background: sc.bg, borderRadius: "var(--r)", border: `1px solid ${sc.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "18px" }}>{sc.icon}</span>
                <span style={{ fontWeight: "700", color: sc.text, fontSize: "14px" }}>{sc.label}</span>
              </div>
              {aiResult.score !== undefined && (
                <div style={{ background: "var(--bg4)", padding: "4px 12px", borderRadius: "999px" }}>
                  <span style={{ fontWeight: "700", color: sc.text, fontSize: "14px" }}>{aiResult.score}</span>
                  <span style={{ fontSize: "11px", color: "var(--text3)" }}>/100</span>
                </div>
              )}
            </div>

            {aiResult.what_is_good && (
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--green)" }}>✓ Жақсы жақтары:</span>
                <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px", lineHeight: "1.6" }}>{aiResult.what_is_good}</p>
              </div>
            )}

            {aiResult.errors && aiResult.errors.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--red)" }}>⚠️ Қателер:</span>
                {aiResult.errors.map((e, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px", paddingLeft: "12px", borderLeft: "2px solid var(--red)" }}>{e}</div>
                ))}
              </div>
            )}

            {aiResult.how_to_fix && (
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--blue)" }}>🔧 Түзету жолы:</span>
                <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px", lineHeight: "1.6" }}>{aiResult.how_to_fix}</p>
              </div>
            )}

            {aiResult.better_version && (
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--accent)" }}>✨ Жақсартылған үлгі:</span>
                <div className="code-block" style={{ marginTop: "6px", fontSize: "12px" }}>{aiResult.better_version}</div>
              </div>
            )}

            {aiResult.encouragement && (
              <div style={{ padding: "8px 12px", background: "rgba(99,102,241,0.08)", borderRadius: "6px", borderLeft: "2px solid var(--accent)" }}>
                <p style={{ fontSize: "13px", color: "var(--text)", fontStyle: "italic" }}>🌟 {aiResult.encouragement}</p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// AI Мұғалім чаты — толыққанды AI чат компоненті
function AITeacherChat({ studentLevel, onXPEarn, onAchievement, aiQuestionCount, setAiQuestionCount }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Сәлем! Мен — PyLearn AI мұғалімі! 🤖\n\nPython туралы кез-келген сұрағыңды қоя аласың. Мен Қазақ тілінде түсіндіремін!\n\nМысалы:\n• «for цикл қалай жұмыс істейді?»\n• «list пен tuple айырмашылығы?»\n• «менің кодымды тексер»"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await aiTeacherChat(newMessages, studentLevel);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      // AI сұрақ санауыш — жетістік үшін
      const newCount = aiQuestionCount + 1;
      setAiQuestionCount(newCount);
      onXPEarn(5, "ai_question");
      if (newCount >= 5) onAchievement("ai_helper");
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Кешіріңіз, AI қолжетімді емес. Интернет байланысын тексеріңіз немесе кейінірек қайталап көріңіз. 🙏"
      }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "print() қалай жұмыс істейді?",
    "for және while айырмашылығы?",
    "тізімге элемент қалай қосамын?",
    "функция қалай жасаймын?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "400px" }}>
      {/* Хабарламалар тізімі */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "420px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "8px", flexShrink: 0, marginTop: "2px" }}>🤖</div>
            )}
            {msg.role === "user"
              ? <div className="ai-bubble-user">{msg.content}</div>
              : <div className="ai-bubble-ai" dangerouslySetInnerHTML={{ __html: formatAIMessage(msg.content) }} />
            }
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🤖</div>
            <AILoading />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Жылдам сұрақтар */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 16px 10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {suggestions.map((s, i) => (
            <button key={i} className="btn btn-ghost btn-sm" onClick={() => setInput(s)} style={{ fontSize: "12px" }}>{s}</button>
          ))}
        </div>
      )}

      {/* Енгізу аймағы */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
        <input className="input-field" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Python туралы сұрақ қой..." style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={sendMessage} disabled={!input.trim() || loading}>
          {loading ? <div className="spinner" /> : "Жібер"}
        </button>
      </div>
    </div>
  );
}

// Мини-ойын: Қате аулау
function BugHuntGame({ onEarn }) {
  const bugs = [
    { code: "Print('Сәлем')", correct: "print('Сәлем')", hint: "Python кіші/бас әріпті ажыратады" },
    { code: "san = 5\nprint(San)", correct: "san = 5\nprint(san)", hint: "Айнымалы аты дәлме-дәл болуы керек" },
    { code: "if x = 5:\n    print('Бес')", correct: "if x == 5:\n    print('Бес')", hint: "= меншіктеу, == салыстыру" },
    { code: "for i in range(5)\n    print(i)", correct: "for i in range(5):\n    print(i)", hint: "Қос нүкте : міндетті!" },
    { code: "san = '10'\nprint(san + 5)", correct: "san = int('10')\nprint(san + 5)", hint: "Мәтінді int()-ке айналдыр" },
  ];
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  const check = () => {
    const ok = guess.trim().toLowerCase().includes(bugs[idx].correct.split("\n")[0].toLowerCase().substring(0, 5).toLowerCase());
    setResult(ok ? "correct" : "wrong");
    if (ok) { setScore(s => s + 1); onEarn(20); }
  };

  const next = () => {
    if (idx < bugs.length - 1) { setIdx(i => i + 1); setGuess(""); setResult(null); }
  };

  if (idx >= bugs.length) return <div style={{ textAlign: "center", padding: "30px" }}><div style={{ fontSize: "40px" }}>🎉</div><div style={{ fontSize: "16px", fontWeight: "700", marginTop: "12px" }}>Аяқталды! {score}/{bugs.length} дұрыс</div></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontSize: "13px", color: "var(--text2)" }}>{idx + 1} / {bugs.length}</span>
        <span style={{ fontSize: "13px", color: "var(--green)", fontWeight: "600" }}>✓ {score}</span>
      </div>
      <div className="code-block" style={{ color: "#f85149", marginBottom: "12px" }}>{bugs[idx].code}</div>
      <p style={{ fontSize: "13px", color: "var(--yellow)", marginBottom: "12px" }}>💡 Кеңес: {bugs[idx].hint}</p>
      <textarea className="textarea-code" value={guess} onChange={e => setGuess(e.target.value)}
        disabled={result !== null} rows={3} placeholder="Дұрыс кодты жаз..." />
      {result === null
        ? <button className="btn btn-primary" onClick={check} disabled={!guess.trim()} style={{ marginTop: "10px" }}>Тексеру</button>
        : <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: result === "correct" ? "var(--green)" : "var(--red)" }}>
              {result === "correct" ? "✓ Дұрыс! +20 XP" : `✗ Дұрысы: ${bugs[idx].correct}`}
            </span>
            {idx < bugs.length - 1 && <button className="btn btn-ghost btn-sm" onClick={next}>Келесі →</button>}
          </div>
      }
    </div>
  );
}

// Мини-ойын: Жылдам теру
function SpeedTypeGame({ onEarn }) {
  const snippets = ['print("Сәлем, Әлем!")', "for i in range(1, 6):", "    print(i * i)", "def audan(en, b):", "    return en * b"];
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [done, setDone] = useState(false);

  const current = snippets[idx];

  const handleChange = (e) => {
    if (!startTime) setStartTime(Date.now());
    setTyped(e.target.value);
    if (e.target.value === current) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setCompleted(prev => [...prev, { text: current, time: elapsed }]);
      onEarn(15);
      if (idx < snippets.length - 1) {
        setTimeout(() => { setIdx(i => i + 1); setTyped(""); setStartTime(null); }, 500);
      } else { setDone(true); }
    }
  };

  return done ? (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎉</div>
      <div style={{ fontSize: "16px", fontWeight: "700" }}>Жылдам тердің! +{snippets.length * 15} XP</div>
      {completed.map((c, i) => <div key={i} style={{ fontSize: "12px", color: "var(--text2)", margin: "3px 0" }}>{c.time}с — {c.text}</div>)}
    </div>
  ) : (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontSize: "13px", color: "var(--text2)" }}>{idx + 1} / {snippets.length}</span>
        <span className="xp-pill">⚡ {idx * 15} XP</span>
      </div>
      <div className="code-block" style={{ marginBottom: "12px", fontSize: "14px" }}>
        {current.split("").map((ch, i) => {
          let color = "var(--text3)";
          if (i < typed.length) color = typed[i] === ch ? "var(--green)" : "var(--red)";
          return <span key={i} style={{ color }}>{ch}</span>;
        })}
      </div>
      <input value={typed} onChange={handleChange} autoFocus
        className="input-field" style={{ fontFamily: "var(--mono)" }} placeholder="Осы жерге тер..." />
    </div>
  );
}

// Мини-ойын: Код сәйкестігі
function CodeMatchGame({ onEarn }) {
  const pairs = [
    { code: 'print("Сәлем")', output: "Сәлем" },
    { code: "2 ** 8", output: "256" },
    { code: 'len("Python")', output: "6" },
    { code: "17 % 5", output: "2" },
    { code: "int('42')", output: "42" },
  ];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const shuffled = [...pairs.map(p => p.output)].sort(() => Math.random() - 0.5);

  const check = (ans) => {
    setSelected(ans);
    const ok = ans === pairs[idx].output;
    setResult(ok ? "correct" : "wrong");
    if (ok) { setScore(s => s + 1); onEarn(10); }
  };

  const next = () => {
    if (idx < pairs.length - 1) { setIdx(i => i + 1); setSelected(null); setResult(null); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontSize: "13px", color: "var(--text2)" }}>{idx + 1} / {pairs.length}</span>
        <span style={{ fontSize: "13px", color: "var(--green)", fontWeight: "600" }}>✓ {score}</span>
      </div>
      <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "10px" }}>Нәтижесін тап:</p>
      <div className="code-block" style={{ marginBottom: "16px", fontSize: "14px" }}>{pairs[idx].code}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {shuffled.slice(0, 4).map((o, i) => {
          let bg = "var(--bg3)", border = "1px solid var(--border)";
          if (result && o === pairs[idx].output) { bg = "rgba(16,185,129,0.1)"; border = "1px solid rgba(16,185,129,0.4)"; }
          else if (selected === o && result === "wrong") { bg = "rgba(239,68,68,0.1)"; border = "1px solid rgba(239,68,68,0.4)"; }
          return (
            <div key={i} onClick={() => !result && check(o)}
              style={{ padding: "12px", textAlign: "center", borderRadius: "8px", border, background: bg, cursor: result ? "default" : "pointer", fontFamily: "var(--mono)", fontWeight: "600", transition: "all 0.15s" }}>
              {o}
            </div>
          );
        })}
      </div>
      {result && (
        <div style={{ marginTop: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: result === "correct" ? "var(--green)" : "var(--red)" }}>
            {result === "correct" ? "✓ Дұрыс! +10 XP" : `✗ Дұрысы: ${pairs[idx].output}`}
          </span>
          {idx < pairs.length - 1 && <button className="btn btn-ghost btn-sm" onClick={next}>Келесі →</button>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// § 5. PAGES — Беттер
// ══════════════════════════════════════════════════════════════════

// Навигация шапкасы
function Header({ xp, streak, levelName, levelColor, levelEmoji, onTeacher, onAIChat, aiChatActive }) {
  return (
    <header style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "58px" }}>
        {/* Лого */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🐍</div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "15px", letterSpacing: "-0.3px" }}>PyLearn KZ</div>
            <div style={{ fontSize: "10px", color: "var(--text3)" }}>AI-Powered Python</div>
          </div>
        </div>

        {/* Навигация статистикасы */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <StreakBadge streak={streak} />
          <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px" }}>{levelEmoji}</span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: levelColor }}>{levelName}</span>
          </div>
          <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
          <span className="xp-pill">⚡ {xp} XP</span>
          <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
          <button className={`btn btn-ghost btn-sm ${aiChatActive ? "btn-primary" : ""}`} onClick={onAIChat}
            style={aiChatActive ? { background: "var(--accent)" } : {}}>
            🤖 AI Мұғалім
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onTeacher}>👩‍🏫 Мұғалім</button>
        </div>
      </div>
    </header>
  );
}

// ══════════════════════════════════════════════════════════════════
// § 6. MAIN APP — Негізгі компонент
// ══════════════════════════════════════════════════════════════════

export default function App() {
  const saved = loadSave();

  // Күй (State) айнымалылары
  const [screen, setScreen] = useState("dashboard");
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("theory");
  const [completed, setCompleted] = useState(saved?.completed || []);
  const [earnedAch, setEarnedAch] = useState(saved?.earnedAch || []);
  const [xp, setXp] = useState(saved?.xp || 0);
  const [testScores, setTestScores] = useState(saved?.testScores || {});
  const [codeOutputs, setCodeOutputs] = useState({});
  const [toast, setToast] = useState(null);
  const [gameScreen, setGameScreen] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [dailyStreak] = useState(saved?.streak || 3);
  const [aiQuestionCount, setAiQuestionCount] = useState(saved?.aiQ || 0);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [lastXpGain, setLastXpGain] = useState(0);

  const lesson = LESSONS.find(l => l.id === activeId);
  const levelIdx = LEVELS.filter(l => xp >= l.min).length - 1;
  const levelInfo = LEVELS[levelIdx];
  const nextLevel = LEVELS[levelIdx + 1];

  // localStorage-ке сақтау
  useEffect(() => {
    doSave({ completed, earnedAch, xp, testScores, streak: dailyStreak, aiQ: aiQuestionCount });
  }, [completed, earnedAch, xp, testScores, aiQuestionCount]);

  const showToast = useCallback((msg, duration = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const earnXP = useCallback((amount, reason = "") => {
    setXp(prev => {
      const newXP = prev + amount;
      const prevLvl = LEVELS.filter(l => prev >= l.min).length - 1;
      const newLvl = LEVELS.filter(l => newXP >= l.min).length - 1;
      if (newLvl > prevLvl) showToast(`🎊 Жаңа деңгей! ${LEVELS[newLvl].emoji} ${LEVELS[newLvl].name}`, 4000);
      return newXP;
    });
    setLastXpGain(amount);
    setXpAnimating(true);
    setTimeout(() => setXpAnimating(false), 800);
  }, [showToast]);

  const giveAch = useCallback((id) => {
    setEarnedAch(prev => {
      if (prev.includes(id)) return prev;
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (!ach) return prev;
      showToast(`🏅 ${ach.icon} ${ach.title} — +${ach.xpBonus} XP!`, 3500);
      earnXP(ach.xpBonus, "achievement");
      return [...prev, id];
    });
  }, [earnXP, showToast]);

  const openLesson = (id) => {
    setActiveId(id);
    setTab("theory");
    setScreen("lesson");
    setShowAIChat(false);
  };

  const finishLesson = () => {
    if (!activeId || completed.includes(activeId)) return;
    const l = LESSONS.find(x => x.id === activeId);
    setCompleted(prev => {
      const nc = [...prev, activeId];
      earnXP(l.xpReward, "lesson");
      showToast(`🎉 Сабақ аяқталды! +${l.xpReward} XP`);
      giveAch("first_lesson");
      if (nc.length >= 6) giveAch("half_done");
      if (nc.includes(7) && nc.includes(8)) giveAch("loop_master");
      if (nc.includes(6)) giveAch("logic_guru");
      if (nc.length >= 12) giveAch("python_hero");
      return nc;
    });
  };

  const handleTestAnswer = (lid, isCorrect) => {
    if (isCorrect) earnXP(10);
    setTestScores(prev => {
      const s = prev[lid] || { r: 0, t: 0 };
      const ns = { r: s.r + (isCorrect ? 1 : 0), t: s.t + 1 };
      const updated = { ...prev, [lid]: ns };
      if (lesson && ns.t === lesson.tests.length && ns.r === lesson.tests.length) {
        giveAch("test_ace");
        earnXP(lesson.tests.length * 5, "test_ace");
      }
      return updated;
    });
  };

  // ── DASHBOARD беті ─────────────────────────────────────────────
  if (screen === "dashboard") {
    const xpInLevel = xp - levelInfo.min;
    const xpToNext = nextLevel ? nextLevel.min - levelInfo.min : 1;
    const totalLessonsXP = LESSONS.reduce((s, l) => s + l.xpReward, 0);

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <style>{GLOBAL_STYLES}</style>

        <Header xp={xp} streak={dailyStreak} levelName={levelInfo.name} levelColor={levelInfo.color}
          levelEmoji={levelInfo.emoji} onTeacher={() => setScreen("teacher")}
          onAIChat={() => setShowAIChat(!showAIChat)} aiChatActive={showAIChat} />

        {/* AI Мұғалім панелі (overlay) */}
        {showAIChat && (
          <div className="fade-in" style={{
            position: "fixed", right: "24px", bottom: "80px", width: "380px", maxWidth: "calc(100vw - 48px)",
            background: "var(--card)", border: "1px solid var(--border2)", borderRadius: "var(--r)",
            zIndex: 200, boxShadow: "0 8px 40px rgba(0,0,0,0.6)", overflow: "hidden",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700" }}>AI Мұғалім</div>
                  <div style={{ fontSize: "11px", color: "var(--green)" }}>● Онлайн</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAIChat(false)}>✕</button>
            </div>
            <AITeacherChat studentLevel={levelInfo.name} onXPEarn={earnXP} onAchievement={giveAch}
              aiQuestionCount={aiQuestionCount} setAiQuestionCount={setAiQuestionCount} />
          </div>
        )}

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
          <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", alignItems: "start" }}>

            {/* Негізгі контент */}
            <div>
              {/* Жоғарғы статистика карточкалары */}
              <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
                {[
                  { icon: "📚", val: `${completed.length}/${LESSONS.length}`, label: "Сабақтар", color: "var(--blue)" },
                  { icon: "⚡", val: xp, label: "XP ұпай", color: "var(--yellow)", animate: xpAnimating },
                  { icon: "🔥", val: dailyStreak, label: "Серия (күн)", color: "var(--red)" },
                  { icon: "🏅", val: earnedAch.length, label: "Жетістіктер", color: "var(--accent)" },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ textAlign: "center", padding: "16px", animationDelay: `${i * 0.08}s` }}>
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: s.color, animation: s.animate ? "xpBounce 0.6s ease" : undefined }}>{s.val}</div>
                    <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Деңгей прогресі */}
              <div className="card fade-up" style={{ marginBottom: "24px", animationDelay: "0.1s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: "700" }}>Деңгей прогресі</h2>
                  <span style={{ fontSize: "12px", color: "var(--text3)" }}>{Math.round(completed.length / LESSONS.length * 100)}% аяқталды</span>
                </div>
                <XPBar xp={xp} levels={LEVELS} />
                <div style={{ marginTop: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text3)", marginBottom: "5px" }}>
                    <span>Жалпы прогресс</span>
                    <span>{completed.length}/{LESSONS.length} сабақ</span>
                  </div>
                  <div className="progress-bar" style={{ height: "8px" }}>
                    <div className="progress-fill" style={{ width: `${Math.round(completed.length / LESSONS.length * 100)}%`, background: "linear-gradient(90deg, var(--green), var(--cyan))" }} />
                  </div>
                </div>
              </div>

              {/* Мини-ойындар */}
              <div className="fade-up" style={{ marginBottom: "24px", animationDelay: "0.15s" }}>
                <h2 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "var(--text2)" }}>🎮 Мини-ойындар</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {[
                    { id: "codeMatch", icon: "🎯", title: "Код сәйкестігі", desc: "Кодты нәтижесімен сәйкестендір", xpAmt: 50, color: "var(--blue)" },
                    { id: "bugHunt", icon: "🐛", title: "Қате аулау", desc: "Кодтағы қателерді тап", xpAmt: 80, color: "var(--red)" },
                    { id: "speedType", icon: "⚡", title: "Жылдам теру", desc: "Кодты жылдам тер", xpAmt: 75, color: "var(--yellow)" },
                  ].map(g => (
                    <div key={g.id} className="card card-hover" onClick={() => setGameScreen(g.id)}
                      style={{ padding: "14px", borderColor: "var(--border)" }}>
                      <div style={{ fontSize: "22px", marginBottom: "8px" }}>{g.icon}</div>
                      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>{g.title}</div>
                      <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "10px" }}>{g.desc}</div>
                      <span className="xp-pill">+{g.xpAmt} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Сабақтар тізімі */}
              <div className="fade-up" style={{ animationDelay: "0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h2 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text2)" }}>📚 Python Сабақтары (12)</h2>
                  <span style={{ fontSize: "12px", color: "var(--text3)" }}>Барлығы {totalLessonsXP} XP</span>
                </div>
                <div className="grid-lessons">
                  {LESSONS.map((l, i) => {
                    const done = completed.includes(l.id);
                    const isNext = !done && completed.length === i;
                    const locked = i > completed.length;
                    const score = testScores[l.id];
                    return (
                      <div key={l.id}
                        className={`card ${!locked ? "card-hover" : ""} ${done ? "lesson-done" : ""} ${isNext ? "lesson-next" : ""} ${locked ? "lesson-locked" : ""}`}
                        onClick={() => !locked && openLesson(l.id)}
                        style={{ padding: "14px", cursor: locked ? "not-allowed" : "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "22px" }}>{locked ? "🔒" : l.icon}</span>
                          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            {done && <span style={{ fontSize: "14px" }}>✅</span>}
                            {isNext && <span className="badge badge-new" style={{ fontSize: "10px" }}>Жалғастыр</span>}
                          </div>
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--text3)", marginBottom: "2px" }}>{l.id}-сабақ</div>
                        <div style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.3", marginBottom: "4px" }}>{l.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "10px" }}>{l.shortDesc}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="xp-pill" style={{ fontSize: "11px" }}>+{l.xpReward}</span>
                          {score && <span style={{ fontSize: "10px", color: "var(--text3)" }}>📝 {score.r}/{score.t}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Оң жақ боковой панель */}
            <div className="desktop-sidebar" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* AI Мұғалім кнопка */}
              <div className="card" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))", borderColor: "rgba(99,102,241,0.3)", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🤖</div>
                <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>AI Мұғалім</div>
                <div style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "14px", lineHeight: "1.5" }}>Python туралы кез-келген сұрақ қой! Қазақша жауап береді.</div>
                <button className="btn btn-primary" onClick={() => setShowAIChat(true)} style={{ width: "100%" }}>Сұрақ қою →</button>
              </div>

              {/* Жетістіктер */}
              <div className="card">
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "14px" }}>🏆 Жетістіктер</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {ACHIEVEMENTS.slice(0, 5).map(ach => {
                    const earned = earnedAch.includes(ach.id);
                    return (
                      <div key={ach.id} style={{ display: "flex", gap: "10px", alignItems: "center", opacity: earned ? 1 : 0.35 }}>
                        <span style={{ fontSize: "18px" }}>{ach.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "12px", fontWeight: "600", color: earned ? "var(--text)" : "var(--text3)" }}>{ach.title}</div>
                          <div style={{ fontSize: "11px", color: "var(--text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ach.desc}</div>
                        </div>
                        {earned && <span className="badge badge-xp">+{ach.xpBonus}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Апта күндері */}
              <div className="card">
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>🔥 Серия</div>
                <div style={{ display: "flex", gap: "6px", justifyContent: "space-between" }}>
                  {["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жк"].map((day, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ width: "100%", aspectRatio: "1", borderRadius: "6px", background: i < dailyStreak ? "var(--red)" : "var(--bg4)", marginBottom: "3px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                        {i < dailyStreak ? "🔥" : ""}
                      </div>
                      <div style={{ fontSize: "9px", color: "var(--text3)" }}>{day}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--text2)", textAlign: "center" }}>
                  {dailyStreak} күн үздіксіз оқу! 💪
                </div>
              </div>

              {/* Python AI кеңестері */}
              <div className="card" style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", color: "var(--green)" }}>💡 Python кеңесі</div>
                <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: "1.6" }}>
                  Код жазғанда AI тексеру мүмкіндігін қолдан — ол қателерді тауып, Қазақша түсіндіреді!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Мини-ойын модалі */}
        {gameScreen && (
          <div className="fade-in" style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "20px"
          }}>
            <div className="card slide-in" style={{ width: "100%", maxWidth: "480px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div style={{ fontSize: "15px", fontWeight: "700" }}>
                  {gameScreen === "codeMatch" ? "🎯 Код сәйкестігі" : gameScreen === "bugHunt" ? "🐛 Қате аулау" : "⚡ Жылдам теру"}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setGameScreen(null)}>✕</button>
              </div>
              {gameScreen === "codeMatch" && <CodeMatchGame onEarn={(xpAmt) => earnXP(xpAmt, "game")} />}
              {gameScreen === "bugHunt" && <BugHuntGame onEarn={(xpAmt) => earnXP(xpAmt, "game")} />}
              {gameScreen === "speedType" && <SpeedTypeGame onEarn={(xpAmt) => earnXP(xpAmt, "game")} />}
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  // ── САБАҚ беті ──────────────────────────────────────────────────
  if (screen === "lesson" && lesson) {
    const isDone = completed.includes(lesson.id);
    const score = testScores[lesson.id];
    const lessonIdx = LESSONS.findIndex(l => l.id === lesson.id);

    const tabs = [
      { id: "theory", label: "📖 Теория" },
      { id: "examples", label: "💻 Мысалдар" },
      { id: "tasks", label: "✍️ Тапсырмалар" },
      { id: "tests", label: "📝 Тесттер" },
    ];

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <style>{GLOBAL_STYLES}</style>

        {/* Сабақ шапкасы */}
        <header style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "58px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setScreen("dashboard")}>← Артқа</button>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "20px" }}>{lesson.icon}</span>
                <span style={{ fontWeight: "700", fontSize: "15px" }}>{lesson.title}</span>
                {isDone && <span className="badge badge-new">✓ Аяқталды</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className="xp-pill">+{lesson.xpReward} XP</span>
              {score && <span style={{ fontSize: "12px", color: "var(--text2)" }}>📝 {score.r}/{score.t}</span>}
            </div>
          </div>
          {/* Прогресс жолағы */}
          <div style={{ height: "2px", background: "var(--bg4)" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, var(--accent), var(--cyan))", width: `${Math.round((lessonIdx + 1) / LESSONS.length * 100)}%`, transition: "width 0.5s" }} />
          </div>
        </header>

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
          {/* Таб навигациясы */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "var(--bg2)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            {tabs.map(t => (
              <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)} style={{ flex: 1 }}>{t.label}</button>
            ))}
          </div>

          {/* ТЕОРИЯ */}
          {tab === "theory" && (
            <div className="fade-up">
              <div className="card" style={{ marginBottom: "16px" }}>
                <pre style={{ fontFamily: "var(--font)", fontSize: "14px", color: "var(--text2)", lineHeight: "1.8", whiteSpace: "pre-wrap", margin: 0 }}>{lesson.theory}</pre>
              </div>

              {/* Жалпы қателер */}
              {lesson.commonErrors.length > 0 && (
                <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--red)", marginBottom: "14px" }}>⚠️ Жиі кездесетін қателер</div>
                  {lesson.commonErrors.map((e, i) => (
                    <div key={i} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: i < lesson.commonErrors.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "6px" }}>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--red)", marginBottom: "4px" }}>✗ Бұрыс:</div>
                          <div className="code-block" style={{ color: "#f85149", fontSize: "12px" }}>{e.wrong}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--green)", marginBottom: "4px" }}>✓ Дұрыс:</div>
                          <div className="code-block" style={{ color: "#7ee787", fontSize: "12px" }}>{e.right}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text3)", fontStyle: "italic" }}>💡 {e.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* МЫСАЛДАР */}
          {tab === "examples" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {lesson.examples.map((ex, i) => (
                <div key={i} className="card">
                  <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>{ex.title}</div>
                  <div className="code-block" style={{ marginBottom: "10px" }}>{ex.code}</div>
                  <div style={{ padding: "10px 14px", background: "#0d1117", borderRadius: "var(--r2)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "4px" }}>Нәтиже:</div>
                    <pre style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "#7ee787", whiteSpace: "pre-wrap", margin: 0 }}>{ex.output}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ТАПСЫРМАЛАР */}
          {tab === "tasks" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {lesson.tasks.map((task, i) => (
                <div key={task.id} className="card">
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ background: "var(--bg4)", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "var(--accent)", flexShrink: 0 }}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700" }}>{task.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--text2)" }}>{task.desc}</div>
                    </div>
                  </div>
                  <CodeEditor
                    taskId={`${lesson.id}-${task.id}`}
                    starter={task.starter}
                    taskDesc={task.desc}
                    onRun={(result) => {
                      if (result.ok && task.check(result.output)) {
                        earnXP(25, "task");
                        showToast("✓ Тапсырма орындалды! +25 XP");
                        giveAch("first_run");
                      }
                    }}
                    onXPEarn={earnXP}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ТЕСТТЕР */}
          {tab === "tests" && (
            <div className="fade-up">
              {lesson.tests.map((q, i) => (
                <TestQuestion key={`${lesson.id}-${i}`} q={q} idx={i}
                  onAnswer={(ok) => handleTestAnswer(lesson.id, ok)} />
              ))}

              <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
                {!isDone ? (
                  <button className="btn btn-primary btn-lg" onClick={finishLesson}>
                    ✓ Сабақты аяқта +{lesson.xpReward} XP
                  </button>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "4px" }}>🎉</div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--green)" }}>Сабақ аяқталды!</div>
                  </div>
                )}
                <button className="btn btn-ghost btn-lg" onClick={() => setScreen("dashboard")}>Артқа</button>
              </div>
            </div>
          )}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  // ── МҰҒАЛІМ беті ────────────────────────────────────────────────
  if (screen === "teacher") {
    const students = [
      { name: "Арман Б.", xp: 350, done: 3, tests: { r: 14, t: 18 } },
      { name: "Аида М.", xp: 820, done: 7, tests: { r: 38, t: 42 } },
      { name: "Дамир С.", xp: 220, done: 2, tests: { r: 8, t: 12 } },
      { name: "Жансая Т.", xp: 1100, done: 9, tests: { r: 51, t: 54 } },
      { name: "Нурлан К.", xp: 540, done: 5, tests: { r: 26, t: 30 } },
      { name: "Мадина Е.", xp: 410, done: 4, tests: { r: 20, t: 24 } },
    ];
    const avgXP = Math.round(students.reduce((s, x) => s + x.xp, 0) / students.length);
    const avgDone = (students.reduce((s, x) => s + x.done, 0) / students.length).toFixed(1);
    const allTests = students.reduce((s, x) => ({ r: s.r + x.tests.r, t: s.t + x.tests.t }), { r: 0, t: 0 });
    const avgTest = Math.round(allTests.r / allTests.t * 100);

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <style>{GLOBAL_STYLES}</style>
        <header style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "58px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setScreen("dashboard")}>← Артқа</button>
              <span style={{ fontWeight: "700", fontSize: "15px" }}>👩‍🏫 Мұғалім панелі</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-ghost btn-sm">📄 PDF жүктеу</button>
              <button className="btn btn-ghost btn-sm">📊 Есеп</button>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" }}>
          {/* Жиынтық статистика */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { icon: "👥", label: "Оқушылар", value: students.length, color: "var(--blue)" },
              { icon: "📚", label: "Орт. сабақ", value: `${avgDone}/${LESSONS.length}`, color: "var(--green)" },
              { icon: "⚡", label: "Орт. XP", value: avgXP, color: "var(--yellow)" },
              { icon: "📝", label: "Орт. тест", value: `${avgTest}%`, color: avgTest >= 70 ? "var(--green)" : "var(--red)" },
            ].map(s => (
              <div key={s.label} className="card fade-up" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Оқушылар кестесі */}
          <div className="card fade-up" style={{ marginBottom: "24px", padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontSize: "14px", fontWeight: "700" }}>Оқушылар прогресі</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "var(--bg2)" }}>
                    {["Оқушы", "Деңгей", "XP", "Прогресс", "Тест нәтижесі", "Статус"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "var(--text3)", fontWeight: "600", fontSize: "11px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => {
                    const lvl = LEVELS.filter(l => s.xp >= l.min).slice(-1)[0] || LEVELS[0];
                    const testPct = Math.round(s.tests.r / s.tests.t * 100);
                    return (
                      <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "600" }}>{s.name}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ color: lvl.color, fontWeight: "600", fontSize: "12px" }}>{lvl.emoji} {lvl.name}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: "600" }}>{s.xp}</td>
                        <td style={{ padding: "12px 16px", minWidth: "140px" }}>
                          <div className="progress-bar" style={{ height: "6px", marginBottom: "3px" }}>
                            <div className="progress-fill" style={{ width: `${Math.round(s.done / LESSONS.length * 100)}%`, background: "var(--blue)" }} />
                          </div>
                          <span style={{ fontSize: "11px", color: "var(--text3)" }}>{s.done}/{LESSONS.length}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontWeight: "600", color: testPct >= 80 ? "var(--green)" : testPct >= 60 ? "var(--yellow)" : "var(--red)" }}>
                            {s.tests.r}/{s.tests.t} ({testPct}%)
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span className={`badge ${s.done >= 7 ? "badge-new" : "badge-xp"}`}>
                            {s.done >= 7 ? "Үздік" : s.done >= 4 ? "Жақсы" : "Орташа"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Сабақтар бойынша прогресс */}
          <div className="card fade-up">
            <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px" }}>Сабақтар бойынша орташа прогресс</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
              {LESSONS.map(l => {
                const avg = Math.round(students.filter(s => s.done >= l.id).length / students.length * 100);
                return (
                  <div key={l.id} style={{ background: "var(--bg3)", borderRadius: "var(--r2)", padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "16px" }}>{l.icon}</span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: avg >= 70 ? "var(--green)" : "var(--yellow)" }}>{avg}%</span>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "600", marginBottom: "6px", lineHeight: "1.3", color: "var(--text2)" }}>{l.title}</div>
                    <div className="progress-bar" style={{ height: "4px" }}>
                      <div className="progress-fill" style={{ width: `${avg}%`, background: avg >= 70 ? "var(--green)" : "var(--yellow)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return <div style={{ background: "var(--bg)", minHeight: "100vh" }}><style>{GLOBAL_STYLES}</style></div>;
}
