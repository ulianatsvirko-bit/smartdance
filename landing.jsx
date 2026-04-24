const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ff1f7a",
  "accent2": "#ffd93d",
  "accent3": "#7ec8ff",
  "bg": "#ffffff",
  "ink": "#0a0a0a",
  "heroVariant": "marquee",
  "showTicker": true,
  "density": "spacious"
}/*EDITMODE-END*/;

const PROGRAMS = [
  {
    tag: "01 / CONTEMPORARY LAB",
    titleA: "Современная",
    titleB: "хореография",
    titleC: "и её техники",
    pills: ["Modern", "Contemporary", "Jazz", "Classic"],
    items: [
      "Балетная гимнастика — фитболы, кубы, эспандеры, балансиры",
      "Классический экзерсис и современная классика",
      "Джаз: основы стиля и постановочная работа",
      "Release, floor work, flying low, акробатика",
      "Импровизация — теория и практика поиска своего стиля",
      "Уличные направления для пластичности и чувства ритма",
    ],
  },
  {
    tag: "02 / STREET LAB",
    titleA: "Современные",
    titleB: "уличные",
    titleC: "направления",
    pills: ["Hip-hop", "House", "Vogue", "Krump", "Waacking", "Afro"],
    items: [
      "Hip-hop, house, shuffle, dancehall, jazz-funk, krump, waacking, vogue, afro",
      "Авторская street-хореография от педагогов центра",
      "Alternative choreo — новый взгляд на уличные стили",
      "Акробатика в современном танце и ОФП",
      "Modern и contemporary — зачем это в хип-хопе",
      "Импровизация и поиск собственного почерка",
    ],
  },
];

const STYLES = [
  "hip-hop", "house", "shuffle", "dancehall", "jazz-funk",
  "krump", "waacking", "vogue", "afro", "contemporary",
  "modern", "jazz", "ballet", "floor work", "flying low",
];

const DAY = [
  { time: "10:00 — 12:00", label: "Класс 1", kind: "class" },
  { time: "12:20 — 14:30", label: "Класс 2", kind: "class" },
  { time: "14:30", label: "Обед", kind: "break" },
  { time: "15:00 — 18:00", label: "Развлекательная программа", kind: "fun" },
];

const SESSIONS = [
  {
    id: "july",
    label: "Смена I · июль",
    short: "06.07 — 31.07.2026",
    month: "июль 2026",
    address: "пр. Независимости, 179",
    venue: "Минск",
    weeks: [
      { n: "01", dates: "06.07 — 10.07" },
      { n: "02", dates: "13.07 — 17.07" },
      { n: "03", dates: "20.07 — 24.07" },
      { n: "04", dates: "27.07 — 31.07" },
    ],
  },
  {
    id: "august",
    label: "Смена II · август",
    short: "03.08 — 28.08.2026",
    month: "август 2026",
    address: "ул. Саперов, 5 · ФОК «Атлант»",
    venue: "Минск · ФОК «Атлант»",
    weeks: [
      { n: "01", dates: "03.08 — 07.08" },
      { n: "02", dates: "10.08 — 14.08" },
      { n: "03", dates: "17.08 — 21.08" },
      { n: "04", dates: "24.08 — 28.08" },
    ],
  },
];

const PRICING_EARLY = [
  { weeks: "1 неделя", price: "360", classes: "20 МК" },
  { weeks: "2 недели", price: "490", classes: "40 МК" },
  { weeks: "3 недели", price: "590", classes: "60 МК" },
  { weeks: "4 недели", price: "690", classes: "80 МК" },
];
const PRICING_LATE = [
  { weeks: "1 неделя", price: "410" },
  { weeks: "2 недели", price: "540" },
  { weeks: "3 недели", price: "640" },
  { weeks: "4 недели", price: "740" },
];

const RESULTS = [
  { n: "01", t: "Физическая форма", d: "Восстановим и укрепим тело — пластичнее, сильнее, готовы к сезону 2026–2027." },
  { n: "02", t: "Предкастинг", d: "По итогам интенсива — до основного кастинга в концертный состав." },
  { n: "03", t: "10+ стилей", d: "По каждому направлению — этюд, челлендж, клип или перфоманс." },
  { n: "04", t: "Итоговый показ", d: "31 июля и 28 августа — перфоманс, зарисовки, этюды и сюрпризы от педагогов." },
  { n: "05", t: "SUPER HERO", d: "Неделя — сертификат HERO. Все 4 недели смены — SUPER HERO + памятный приз." },
];

const TEACHERS = [
  { name: "Инга Жихарева", role: "педагог-хореограф, 17 лет стажа · street / jazz / эстрада" },
  { name: "Татьяна Шеметовец", role: "солистка Большого театра Беларуси · балет" },
  { name: "Игорь Артамонов", role: "солист Большого театра Беларуси · балет" },
  { name: "Артём Козырев", role: "современная хореография · break dance" },
  { name: "Кристина Гарон-Мосесова", role: "vogue · jazz funk" },
  { name: "Анна Гичева", role: "классический танец · гимнастика" },
  { name: "Галина Хаменко", role: "акробатика · современная хореография" },
];

const GUESTS = [
  "Дмитрий Залесский", "Ольга Лабовкина", "Юлия Михайлова",
  "Елена Подольская", "Юрий Шклярик", "Павел Любинский", "Юлия Дружченко",
];

// ---------------- Components ----------------

function StripedPlaceholder({ label, h = 360, rotate = 0 }) {
  return (
    <div className="ph" style={{ height: h, transform: `rotate(${rotate}deg)` }}>
      <div className="ph-stripes" />
      <div className="ph-label">{label}</div>
    </div>
  );
}

function Marquee({ items, reverse = false, speed = 40 }) {
  const content = [...items, ...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}>
        {content.map((it, i) => (
          <span key={i} className="marquee-item">
            {it}<span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Ticker() {
  return (
    <div className="ticker">
      <Marquee items={["06.07 — 31.07.2026 · смена I", "03.08 — 28.08.2026 · смена II", "Минск", "пр. Независимости 179", "ул. Саперов 5 · ФОК Атлант", "2 смены · 4 недели каждая", "10+ стилей", "SMART DANCE LAB 2026"]} speed={60} />
    </div>
  );
}

function Hero({ variant }) {
  if (variant === "split") return <HeroSplit />;
  if (variant === "editorial") return <HeroEditorial />;
  return <HeroMarquee />;
}

function HeroMarquee() {
  const [session, setSession] = useState(0);
  const s = SESSIONS[session];
  return (
    <section className="hero hero-center">
      <div className="hero-weeks">
        {SESSIONS.map((ss, i) => (
          <button
            key={ss.id}
            className={`hero-week ${session === i ? "is-active" : ""}`}
            onClick={() => setSession(i)}
          >
            {ss.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="hero-dates">
        <h2 className="hero-dates-n">{s.short}</h2>
        <span className="hero-dates-sub">{s.venue.toUpperCase()} · {s.address}</span>
      </div>

      <h1 className="hero-title">
        <span className="hero-title-row">ИНТЕНСИВ</span>
        <span className="hero-title-row">ЛАБОРАТОРИЯ</span>
        <span className="hero-title-row hero-title-brand">SMART DANCE</span>
      </h1>

      <p className="hero-lede">
        Выбрана {session === 0 ? "первая" : "вторая"} смена — {s.month}. Четыре недели, 1—4 на выбор.
        Готовим универсальных танцоров, готовых к самым смелым воплощениям стиля.
      </p>

      <a href="#enroll" className="btn btn-pink btn-big">ЗАБРОНИРОВАТЬ</a>
    </section>
  );
}

function HeroSplit() {
  return (
    <section className="hero hero-split">
      <div className="hero-split-left">
        <span className="kicker">SMART DANCE LAB · 2026</span>
        <h1 className="display display-tight">
          <span>Танцуй</span>
          <span className="row-accent">всё</span>
          <span>без&nbsp;страха.</span>
        </h1>
        <p className="lede">
          Минск · две смены: 06.07 — 31.07 (пр. Независимости 179) и 03.08 — 28.08 (ул. Саперов 5, ФОК «Атлант»).
          Универсальные танцоры делаются здесь.
        </p>
        <div className="hero-cta">
          <a href="#enroll" className="btn btn-primary">Записаться</a>
          <a href="#pricing" className="btn btn-ghost">Цены →</a>
        </div>
      </div>
      <div className="hero-split-right">
        <StripedPlaceholder label="FOTO · танцоры в зале 300 м²" h={520} />
      </div>
    </section>
  );
}

function HeroEditorial() {
  return (
    <section className="hero hero-editorial">
      <div className="edi-grid">
        <span className="edi-no">№ 06 / SUMMER 2026</span>
        <span className="edi-issue">SMART DANCE&nbsp;LAB</span>
        <h1 className="edi-title">
          Танцоры, которые <em>могут</em> танцевать <u>всё</u>.
        </h1>
        <p className="edi-lede">
          Интенсив-лаборатория. Две смены. 4 недели каждая. 10+ стилей. Универсальность вместо узкой специализации.
        </p>
        <div className="edi-meta">
          <span>MINSK</span>
          <span>I · 06.07 — 31.07.2026 · пр. Независимости 179</span>
          <span>II · 03.08 — 28.08.2026 · ул. Саперов 5</span>
        </div>
      </div>
    </section>
  );
}

function Section({ id, kicker, title, children, tone }) {
  return (
    <section id={id} className={`sec ${tone || ""}`}>
      <div className="sec-head">
        <span className="kicker">{kicker}</span>
        <h2 className="sec-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Manifesto() {
  return (
    <section className="sec manifesto">
      <span className="kicker">01 / manifesto</span>
      <p className="manifesto-text">
        Забудьте об <u>узкой специализации</u>. Сегодня востребованы те,
        кто владеет <span className="hl">разными стилями</span> и не боится экспериментировать.
        Мы готовим <em>универсальных танцоров</em>, готовых к любым вызовам современной хореографии.
      </p>
    </section>
  );
}

function WhatWeDo() {
  const items = [
    { n: "01", t: "10+ танцевальных направлений", d: "от классики до уличных стилей" },
    { n: "02", t: "Развитие тела и ОФП", d: "физическая подготовка танцора" },
    { n: "03", t: "Импровизация, джемы, dance off", d: "практика поиска своего стиля" },
    { n: "04", t: "Танцевальные челленджи", d: "каждый день — новая задача" },
    { n: "05", t: "Фотосессии", d: "профессиональные проекты" },
    { n: "06", t: "Съёмки клипов", d: "работа в кадре и на площадке" },
    { n: "07", t: "Танцевальный фильм", d: "большой проект лаборатории" },
    { n: "08", t: "Отдых в кругу друзей", d: "образование и развлечения" },
  ];
  return (
    <Section id="what" kicker="02 / что мы делаем" title="Восемь форматов, одно лето.">
      <div className="what-grid">
        {items.map((it) => (
          <div className="what-card" key={it.n}>
            <span className="what-n">{it.n}</span>
            <h3 className="what-t">{it.t}</h3>
            <p className="what-d">{it.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ForWho() {
  return (
    <section className="sec forwho">
      <div className="forwho-col">
        <span className="kicker">03a / для танцоров</span>
        <h2 className="sec-title">Это шанс.</h2>
        <ul className="ticklist">
          <li>подтянуть уровень интенсивом с профессионалами</li>
          <li>выйти из зоны комфорта и найти свой стиль</li>
          <li>попасть в концертные составы Центра</li>
          <li>подготовиться к поступлению на «хореографию»</li>
          <li>сняться в клипах и танцевальных фотосессиях</li>
          <li>отдохнуть с друзьями</li>
        </ul>
      </div>
      <div className="forwho-col forwho-col-alt">
        <span className="kicker">03b / для родителей</span>
        <h2 className="sec-title">Это уверенность.</h2>
        <ul className="ticklist">
          <li>детей мы берём на себя — полдня или весь день</li>
          <li>здоровый образ жизни, никаких гаджетов</li>
          <li>свежий воздух — парки Победы и Дрозды</li>
          <li>заняты любимым делом</li>
          <li>образование в современном искусстве — музеи и лекции</li>
          <li>красивые проекты — фото и видео на память</li>
        </ul>
      </div>
    </section>
  );
}

function Programs() {
  return (
    <Section id="programs" kicker="04 / программы" title="Две программы. Твой уровень.">
      <div className="prog-cards">
        {PROGRAMS.map((p, i) => (
          <div className="prog-card" key={i}>
            <span className="prog-card-tag">{p.tag}</span>
            <h3 className="prog-card-title">
              <span>{p.titleA}</span>
              <span className="prog-card-title-em">{p.titleB}</span>
              <span>{p.titleC}</span>
            </h3>
            <div className="prog-pills">
              {p.pills.map((pill, j) => (
                <span key={j} className="prog-pill">{pill}</span>
              ))}
            </div>
            <ul className="prog-card-list">
              {p.items.map((it, j) => (
                <li key={j}><span className="prog-card-dot" />{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AgeGroups() {
  const ages = [
    { r: "6 — 8", label: "младшие" },
    { r: "9 — 11", label: "средние" },
    { r: "12+", label: "старшие" },
  ];
  return (
    <Section id="ages" kicker="05 / возрастные группы" title="И девчонки, и парни.">
      <div className="ages">
        {ages.map((a, i) => (
          <div key={i} className="age-card">
            <span className="age-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="age-range">{a.r}</span>
            <span className="age-label">{a.label}</span>
          </div>
        ))}
      </div>
      <p className="ages-note">
        Мы делим учеников по возрасту, уровню подготовки и направлению танцев. Некоторые младшие по уровню могут попасть в старшие группы.
      </p>
    </Section>
  );
}

function Schedule() {
  const [session, setSession] = useState(0);
  const [week, setWeek] = useState(0);
  const s = SESSIONS[session];
  const weeks = s.weeks;
  const selectWeek = (i) => setWeek(i);
  const selectSession = (i) => { setSession(i); setWeek(0); };
  return (
    <Section id="schedule" kicker="06 / расписание" title="Две смены. Пн — Пт.">
      <div className="sched-sessions">
        {SESSIONS.map((ss, i) => (
          <button
            key={ss.id}
            className={`sched-session ${session === i ? "is-active" : ""}`}
            onClick={() => selectSession(i)}
          >
            <span className="sched-session-n">{ss.label}</span>
            <span className="sched-session-d">{ss.short}</span>
            <span className="sched-session-a">{ss.address}</span>
          </button>
        ))}
      </div>

      <div className="sched-weeks">
        {weeks.map((w, i) => (
          <button
            key={i}
            className={`sched-week ${week === i ? "is-active" : ""}`}
            onClick={() => selectWeek(i)}
          >
            <span className="sched-week-n">Неделя {w.n}</span>
            <span className="sched-week-d">{w.dates}</span>
          </button>
        ))}
      </div>

      <div className="sched-day">
        <div className="sched-day-head">
          <span>типовой день · {s.label.toLowerCase()}</span>
          <span>{weeks[week].dates}</span>
        </div>
        <div className="sched-slots">
          {DAY.map((d, i) => (
            <div key={i} className={`sched-slot kind-${d.kind}`}>
              <span className="sched-time">{d.time}</span>
              <span className="sched-label">{d.label}</span>
              <span className="sched-dash" />
            </div>
          ))}
        </div>
        <p className="sched-note">
          Программа в обеих сменах одинаковая — разница только в адресе: смена I проходит по {SESSIONS[0].address}, смена II — по {SESSIONS[1].address}.
          Возможно посещение 1, 2, 3 или 4 недели внутри смены в любой комбинации. Формат мастер-классов — присоединиться можно в любой момент. Ребёнка можно забрать сразу после классов, развлекательная программа — по желанию.
        </p>
      </div>
    </Section>
  );
}

function FunProgram() {
  const places = [
    "музеи", "планетарий", "ботанический сад", "центр океанографии",
    "контактный зоопарк", "VR-парк", "кинотеатр", "аквапарк",
    "батутная арена", "пикники в парках", "ИЗО и творчество",
  ];
  return (
    <Section id="fun" kicker="07 / развлекательная программа" title="После танцев — приключения.">
      <div className="fun-grid">
        <div className="fun-text">
          <p className="lede">
            Обед в кафе ФОК «Атлант», а дальше каждый день — новое место. Программа зависит от мероприятий в Минске и погоды, финальное расписание — после 1 августа.
          </p>
          <p className="mono-note">
            * Оплачивается отдельно по стоимости входных билетов.
            С детьми на всех мероприятиях присутствует педагог.
          </p>
        </div>
        <ul className="fun-chips">
          {places.map((p, i) => (
            <li key={i} className="fun-chip"><span className="fun-chip-n">{String(i + 1).padStart(2, "0")}</span>{p}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Teachers() {
  return (
    <Section id="teachers" kicker="08 / педагоги" title="Кто будет работать с детьми.">
      <div className="teachers">
        {TEACHERS.map((t, i) => (
          <div key={i} className="teacher">
            <div className="teacher-ph">
              <StripedPlaceholder label={`FOTO · ${t.name}`} h={260} />
            </div>
            <div className="teacher-body">
              <span className="teacher-n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="teacher-name">{t.name}</h3>
              <p className="teacher-role">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="guests">
        <span className="kicker">приглашённые</span>
        <h3 className="guests-title">И секретные гости.</h3>
        <p className="guests-lede">
          Прошлые сборы посетили — но кто приедет в этот раз, узнаете уже во время лаборатории.
        </p>
        <ul className="guests-list">
          {GUESTS.map((g, i) => (
            <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{g}</li>
          ))}
          <li className="guest-secret"><span>??</span>сюрприз</li>
        </ul>
      </div>
    </Section>
  );
}

function Results() {
  return (
    <Section id="results" kicker="09 / результаты" title="Каких результатов достигнем.">
      <ol className="results">
        {RESULTS.map((r) => (
          <li key={r.n} className="result">
            <span className="result-n">{r.n}</span>
            <div className="result-body">
              <h3 className="result-t">{r.t}</h3>
              <p className="result-d">{r.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Pricing() {
  const [mode, setMode] = useState("early");
  const data = mode === "early" ? PRICING_EARLY : PRICING_LATE;
  return (
    <Section id="pricing" kicker="10 / стоимость" title="Выбирай длительность.">
      <div className="pay-toggle">
        <button
          className={`pay-btn ${mode === "early" ? "is-active" : ""}`}
          onClick={() => setMode("early")}
        >
          <span>до 15.06.2026</span>
          <span className="pay-btn-sub">ранняя цена</span>
        </button>
        <button
          className={`pay-btn ${mode === "late" ? "is-active" : ""}`}
          onClick={() => setMode("late")}
        >
          <span>с 16.06.2026</span>
          <span className="pay-btn-sub">стандартная</span>
        </button>
      </div>

      <div className="prices">
        {data.map((p, i) => (
          <div key={i} className={`price ${i === 3 ? "price-hero" : ""}`}>
            <span className="price-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="price-w">{p.weeks}</span>
            <span className="price-amount">
              <strong>{p.price}</strong><em>руб</em>
            </span>
            {p.classes && <span className="price-inc">{p.classes}</span>}
          </div>
        ))}
      </div>

      <div className="pay-notes">
        <p>* Стоимость одинаковая для обеих смен — июль (пр. Независимости 179) и август (ул. Саперов 5).</p>
        <p>* Иное количество дней — индивидуальный расчёт по часам мастер-классов и дате оплаты.</p>
        <p>* Для участников выездного лагеря — <b>скидка 50%</b> на городские сборы.</p>
      </div>
    </Section>
  );
}

function Certificate() {
  return (
    <section className="sec certs">
      <div className="cert">
        <span className="kicker">11a / сертификат</span>
        <div className="cert-face">
          <span className="cert-label">CERTIFICATE</span>
          <h3 className="cert-title">SMART DANCE<br/>HERO</h3>
          <span className="cert-meta">1 неделя лаборатории</span>
        </div>
      </div>
      <div className="cert cert-super">
        <span className="kicker">11b / и супер-версия</span>
        <div className="cert-face">
          <span className="cert-label">CERTIFICATE</span>
          <h3 className="cert-title">SMART DANCE<br/>SUPER HERO</h3>
          <span className="cert-meta">все 4 недели + памятный приз</span>
        </div>
      </div>
    </section>
  );
}

function Enroll() {
  const [form, setForm] = useState({ name: "", child: "", age: "", session: SESSIONS[0].id, weeks: [], program: "A", phone: "" });
  const [sent, setSent] = useState(false);
  const activeSession = SESSIONS.find((s) => s.id === form.session) || SESSIONS[0];
  const toggleWeek = (n) => {
    setForm((f) => ({
      ...f,
      weeks: f.weeks.includes(n) ? f.weeks.filter((x) => x !== n) : [...f.weeks, n],
    }));
  };
  const pickSession = (id) => setForm((f) => ({ ...f, session: id, weeks: [] }));
  const submit = (e) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <section id="enroll" className="sec enroll enroll-done">
        <span className="kicker">12 / заявка принята</span>
        <h2 className="enroll-done-title">Увидимся в зале 300 м².</h2>
        <p className="lede">Мы свяжемся с вами по телефону {form.phone || "+ —"} в течение дня. Договор оферты и финальная анкета придут на почту.</p>
        <button className="btn btn-ghost" onClick={() => setSent(false)}>← назад</button>
      </section>
    );
  }

  return (
    <section id="enroll" className="sec enroll">
      <div className="enroll-head">
        <span className="kicker">12 / запись</span>
        <h2 className="sec-title">Записаться на лабораторию.</h2>
      </div>
      <form className="enroll-form" onSubmit={submit}>
        <label className="field">
          <span className="field-l">01 / ваше имя</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Родитель" />
        </label>
        <label className="field">
          <span className="field-l">02 / имя ребёнка</span>
          <input required value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} placeholder="Танцор" />
        </label>
        <label className="field">
          <span className="field-l">03 / возраст</span>
          <input required type="number" min="5" max="18" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="10" />
        </label>
        <label className="field">
          <span className="field-l">04 / телефон</span>
          <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+375 —" />
        </label>

        <div className="field field-wide">
          <span className="field-l">05 / смена</span>
          <div className="prog-pick">
            {SESSIONS.map((s) => (
              <button
                type="button"
                key={s.id}
                className={`prog-pick-btn ${form.session === s.id ? "is-on" : ""}`}
                onClick={() => pickSession(s.id)}
              >
                {s.label} · {s.short}
              </button>
            ))}
          </div>
        </div>

        <div className="field field-wide">
          <span className="field-l">06 / недели (любая комбинация в рамках смены)</span>
          <div className="weeks-pick">
            {activeSession.weeks.map((w) => (
              <button
                type="button"
                key={w.n}
                className={`week-pick ${form.weeks.includes(w.n) ? "is-on" : ""}`}
                onClick={() => toggleWeek(w.n)}
              >
                <span>{w.n}</span>
                <span className="week-pick-d">{w.dates}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field field-wide">
          <span className="field-l">07 / программа</span>
          <div className="prog-pick">
            {["A / contemporary", "B / street"].map((p) => (
              <button
                type="button"
                key={p}
                className={`prog-pick-btn ${form.program === p[0] ? "is-on" : ""}`}
                onClick={() => setForm({ ...form, program: p[0] })}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="enroll-foot">
          <p className="mono-note">
            нажимая «отправить», вы подтверждаете, что ознакомились с договором оферты.
          </p>
          <button type="submit" className="btn btn-primary btn-big">Отправить заявку →</button>
        </div>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="foot-col">
          <span className="kicker">контакты</span>
          <a className="foot-link" href="tel:+375447599414">+375 44 759-94-14</a>
          <a className="foot-link" href="tel:+375293070180">+375 29 307-01-80</a>
          <a className="foot-link" href="mailto:contact@smartdance.by">contact@smartdance.by</a>
        </div>
        <div className="foot-col">
          <span className="kicker">адреса</span>
          <p><b>Смена I · июль</b><br/>пр. Независимости, 179</p>
          <p><b>Смена II · август</b><br/>ул. Саперов, 5 · ФОК «Атлант»</p>
        </div>
        <div className="foot-col">
          <span className="kicker">даты</span>
          <p>I · 06.07 — 31.07.2026</p>
          <p>II · 03.08 — 28.08.2026</p>
          <p>пн — пт</p>
        </div>
        <div className="foot-col foot-col-big">
          <div className="foot-logo">SMART<br/>DANCE<br/><em>lab</em></div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© smartdance.by 2026</span>
        <span>центр современной хореографии · Минск</span>
      </div>
    </footer>
  );
}

// ---------------- App ----------------

function App() {
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent2", t.accent2 || "#ffd93d");
    document.documentElement.style.setProperty("--accent3", t.accent3 || "#7ec8ff");
    document.documentElement.style.setProperty("--bg", t.bg);
    document.documentElement.style.setProperty("--ink", t.ink);
    document.documentElement.dataset.density = t.density;
  }, [t]);

  return (
    <div className="page">
      <header className="nav">
        <div className="nav-logo">SMART/DANCE<span>·lab 06</span></div>
        <nav className="nav-links">
          <a href="#what">что</a>
          <a href="#programs">программы</a>
          <a href="#schedule">расписание</a>
          <a href="#teachers">педагоги</a>
          <a href="#pricing">цены</a>
        </nav>
        <a href="#enroll" className="btn btn-primary btn-sm">Записаться</a>
      </header>

      {t.showTicker && <Ticker />}

      <Hero variant={t.heroVariant} />

      <section className="strip">
        <Marquee items={STYLES} speed={50} />
      </section>

      <Manifesto />
      <WhatWeDo />
      <ForWho />
      <Programs />
      <AgeGroups />
      <Schedule />
      <FunProgram />
      <Teachers />
      <Results />
      <Certificate />
      <Pricing />
      <Enroll />
      <Footer />

      <TweaksPanel>
        <TweakSection title="Hero">
          <TweakRadio
            label="Layout"
            value={t.heroVariant}
            onChange={(v) => setT({ heroVariant: v })}
            options={[
              { value: "marquee", label: "Marquee" },
              { value: "split", label: "Split / photo" },
              { value: "editorial", label: "Editorial" },
            ]}
          />
          <TweakToggle label="Top ticker" value={t.showTicker} onChange={(v) => setT({ showTicker: v })} />
        </TweakSection>
        <TweakSection title="Colors">
          <TweakColor label="Accent (pink)" value={t.accent} onChange={(v) => setT({ accent: v })} />
          <TweakColor label="Accent 2 (yellow)" value={t.accent2} onChange={(v) => setT({ accent2: v })} />
          <TweakColor label="Accent 3 (blue)" value={t.accent3} onChange={(v) => setT({ accent3: v })} />
          <TweakColor label="Background" value={t.bg} onChange={(v) => setT({ bg: v })} />
          <TweakColor label="Ink" value={t.ink} onChange={(v) => setT({ ink: v })} />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio
            label="Density"
            value={t.density}
            onChange={(v) => setT({ density: v })}
            options={[
              { value: "tight", label: "Tight" },
              { value: "spacious", label: "Spacious" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Palette presets">
          <TweakButton label="SMART (pink + yellow + blue)" onClick={() => setT({ bg: "#ffffff", ink: "#0a0a0a", accent: "#ff1f7a", accent2: "#ffd93d", accent3: "#7ec8ff" })} />
          <TweakButton label="Hot pink mono" onClick={() => setT({ bg: "#ffffff", ink: "#0a0a0a", accent: "#ff1f7a", accent2: "#ff1f7a", accent3: "#ff1f7a" })} />
          <TweakButton label="Ink mode" onClick={() => setT({ bg: "#0a0a0a", ink: "#ffffff", accent: "#ff1f7a", accent2: "#ffd93d", accent3: "#7ec8ff" })} />
          <TweakButton label="Cream + pink" onClick={() => setT({ bg: "#faf6ee", ink: "#0a0a0a", accent: "#ff1f7a", accent2: "#ffd93d", accent3: "#7ec8ff" })} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
