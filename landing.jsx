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
  { time: "10:00 — 11:30", label: "Мастер-класс 1", kind: "class" },
  { time: "11:30 — 12:00", label: "Перерыв", kind: "break" },
  { time: "12:00 — 13:30", label: "Мастер-класс 2", kind: "class" },
  { time: "13:30 — 14:30", label: "Обед", kind: "break" },
  { time: "14:30 — 18:00", label: "Развлекательная программа", kind: "fun" },
];

const SESSIONS = [
  {
    id: "june",
    label: "Смена I · июнь",
    short: "01.06 — 26.06.2026",
    month: "июнь 2026",
    address: "пр. Независимости, 179",
    venue: "Минск",
    weeks: [
      { n: "01", dates: "01.06 — 05.06" },
      { n: "02", dates: "08.06 — 12.06" },
      { n: "03", dates: "15.06 — 19.06" },
      { n: "04", dates: "22.06 — 26.06" },
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
  { n: "04", t: "Итоговый показ", d: "26 июня и 28 августа — перфоманс, зарисовки, этюды и сюрпризы от педагогов." },
  { n: "05", t: "SUPER HERO", d: "Неделя — сертификат HERO. Все 4 недели смены — SUPER HERO + памятный приз." },
];

const TEACHERS = [
  { name: "Ксения Агафонова", role: "стрит, джаз и contemporary · hip-hop / jazz funk / heels", cat: "all", photo: "assets/teachers/ksenia.jpg" },
  { name: "Вероника Гордиенко", role: "модерн и contemporary · свободная пластика", cat: "contemporary", photo: "assets/teachers/veronika.jpg" },
  { name: "Кристина Гарон-Мосесова", role: "vogue · jazz funk", cat: "street", photo: "assets/teachers/kristina.jpg" },
  { name: "Денис Новиков", role: "уличные стили · hip-hop / break dance / street choreography", cat: "street", photo: "assets/teachers/denis.jpg" },
  { name: "Галина Хаменко", role: "акробатика · современная хореография", cat: "contemporary", photo: "assets/teachers/galina.jpg" },
  { name: "Полина Огоновская", role: "уличные стили и хип-хоп", cat: "street", photo: "assets/teachers/polina-o.jpg" },
  { name: "Полина Вертейко", role: "jazz funk · girls only", cat: "street", photo: "assets/teachers/polina-v.jpg" },
];

const TEACHERS_AUGUST = [
  { name: "Татьяна Шеметовец", role: "классический танец · балет", cat: "all", photo: "assets/teachers/tatiana.jpg" },
  { name: "Игорь Артамонов", role: "уличные стили · hip-hop / krump", cat: "street", photo: "assets/teachers/igor.jpg" },
  { name: "Инга Жихарева", role: "contemporary · модерн", cat: "contemporary", photo: "assets/teachers/inga.jpg" },
  { name: "Кристина Гарон-Мосесова", role: "vogue · jazz funk", cat: "street", photo: "assets/teachers/kristina.jpg" },
  { name: "Анна Нищеменко", role: "хип-хоп · уличные направления", cat: "street", photo: "assets/teachers/anna.jpg" },
  { name: "Полина Вертейко", role: "jazz funk · girls only", cat: "street", photo: "assets/teachers/polina-v.jpg" },
  { name: "Вероника Гордиенко", role: "модерн и contemporary · свободная пластика", cat: "contemporary", photo: "assets/teachers/veronika.jpg" },
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
      <Marquee items={["летние городские сборы", "01.06 — 26.06.2026 · смена I", "03.08 — 28.08.2026 · смена II", "танцы", "развлечения", "друзья", "10+ стилей", "ОФП и импровизация", "челленджи и джемы", "фотосессии и съёмки клипов", "лето в кругу своих"]} speed={60} />
    </div>
  );
}

function Hero({ variant, session, onSessionChange }) {
  if (variant === "split") return <HeroSplit />;
  if (variant === "editorial") return <HeroEditorial />;
  return <HeroMarquee session={session} onSessionChange={onSessionChange} />;
}

function HeroMarquee({ session, onSessionChange }) {
  const s = SESSIONS[session];
  return (
    <section className="hero hero-editorial-v2">
      <div className="hero-grain" aria-hidden="true" />

      <div className="hero-top">
        <div className="hero-sessions">
          {SESSIONS.map((ss, i) => (
            <button
              key={ss.id}
              className={`hero-session-pill ${session === i ? "is-active" : ""}`}
              onClick={() => onSessionChange(i)}
            >
              <span className="hero-session-roman">{i === 0 ? "I" : "II"}</span>
              <span className="hero-session-month">{ss.month.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <h1 className="hero-display">
        <span className="hero-display-line hero-display-serif">Летние городские</span>
        <span className="hero-display-line hero-display-sub">танцевальные сборы</span>
        <span className="hero-display-line hero-display-brand">
          SMART <span className="hero-display-brand-em">DANCE</span>
        </span>
      </h1>

      <div className="hero-rule">
        <span className="hero-rule-tick" />
        <span className="hero-rule-label">{s.label.toUpperCase()}</span>
        <span className="hero-rule-line" />
      </div>

      <div className="hero-info">
        <div className="hero-info-col">
          <span className="hero-info-kicker">даты</span>
          <span className="hero-info-value">{s.short}</span>
          <span className="hero-info-hint">вся смена или отдельные недели</span>
        </div>
        <div className="hero-info-col">
          <span className="hero-info-kicker">адрес</span>
          <span className="hero-info-value">{s.address}</span>
        </div>
        <div className="hero-info-col hero-info-col-cta">
          <a href="#enroll" className="hero-cta-link">
            <span className="hero-cta-l1">Забронировать</span>
            <span className="hero-cta-arrow" aria-hidden="true">→</span>
          </a>
          <a href="#pricing" className="hero-cta-sub">смотреть цены</a>
        </div>
      </div>

      <div className="hero-badge" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="hero-badge-svg">
          <defs>
            <path id="badge-circle" d="M 60 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
          </defs>
          <text className="hero-badge-text">
            <textPath href="#badge-circle" startOffset="0">
              · DANCE LAB · DANCE LAB · DANCE LAB · DANCE LAB ·
            </textPath>
          </text>
        </svg>
        <span className="hero-badge-core">2026</span>
      </div>
    </section>
  );
}

function HeroPhoto() {
  return (
    <section className="hero-photo" aria-label="Группа танцоров">
      <figure className="hero-photo-figure">
        <img
          src="assets/hero-troupe.jpg"
          alt="Танцоры SMART DANCE LAB у окна"
          loading="eager"
          fetchPriority="high"
        />
        <figcaption className="hero-photo-caption">
          <span className="hero-photo-tag">фрейм 01</span>
          <span className="hero-photo-text">наша труппа · перед итоговым показом</span>
        </figcaption>
      </figure>
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
          Минск · две смены: 01.06 — 26.06 (пр. Независимости 179) и 03.08 — 28.08 (ул. Саперов 5, ФОК «Атлант»).
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
          <span>I · 01.06 — 26.06.2026 · пр. Независимости 179</span>
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

function Intro() {
  return (
    <section className="sec intro" id="intro">
      <p className="intro-lede">
        Летние сборы со <em>SMART DANCE</em> — как настоящий лагерь, только в Минске.
        Дети танцуют, дружат и проводят лето на максимум.
      </p>
      <div className="intro-grid">
        <div className="intro-cell">
          <span className="intro-cell-n">10:00 — 13:30</span>
          <p className="intro-cell-t">Танцы и ОФП</p>
          <p className="intro-cell-d">Два мастер-класса по 1,5 часа с педагогами центра и приглашёнными гостями.</p>
        </div>
        <div className="intro-cell">
          <span className="intro-cell-n">14:30 — 18:00</span>
          <p className="intro-cell-t">Развлекательная программа</p>
          <p className="intro-cell-d">Парки, музеи, аквапарк, съёмки клипов и фотосессии — каждый день новое.</p>
        </div>
        <div className="intro-cell">
          <span className="intro-cell-n">пн — пт</span>
          <p className="intro-cell-t">Гибкий формат</p>
          <p className="intro-cell-d">Можно прийти на всю смену или взять только нужные недели.</p>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="sec manifesto">
      <div className="manifesto-side">
        <span className="manifesto-mark" aria-hidden="true">✺</span>
      </div>
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
    { n: "01", t: "10+ танцевальных направлений", d: "от классики до уличных стилей", icon: "✦" },
    { n: "02", t: "Развитие тела и ОФП", d: "физическая подготовка танцора", icon: "✺" },
    { n: "03", t: "Импровизация, поиск своего стиля", d: "различные техники и практики на поиск своего стиля", icon: "❋" },
    { n: "04", t: "Танцевальные челленджи", d: "каждый день — новая задача", icon: "✸" },
    { n: "05", t: "Фотосессии", d: "профессиональные проекты", icon: "❀" },
    { n: "06", t: "Съёмки клипов", d: "работа в кадре и на площадке", icon: "✤" },
    { n: "07", t: "Танцевальный фильм", d: "большой проект лаборатории", icon: "✹" },
    { n: "08", t: "Отдых в кругу друзей", d: "образование и развлечения", icon: "✿" },
  ];
  return (
    <section id="what" className="what-section">
      <div className="what-bg" aria-hidden="true">
        <span className="what-bg-blob what-bg-blob-1" />
        <span className="what-bg-blob what-bg-blob-2" />
      </div>
      <div className="what-inner">
        <div className="what-head">
          <span className="kicker what-kicker">02 / что мы делаем</span>
          <h2 className="what-title">Танцы, дружба,<br/><em>лето.</em></h2>
        </div>
        <div className="what-grid">
          {items.map((it, i) => (
            <div className={`what-card what-card-${(i % 4) + 1}`} key={it.n}>
              <div className="what-card-top">
                <span className="what-n">{it.n}</span>
                <span className="what-icon" aria-hidden="true">{it.icon}</span>
              </div>
              <h3 className="what-t">{it.t}</h3>
              <p className="what-d">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWho() {
  return (
    <section className="forwho-cards">
      <article className="forwho-card forwho-card-dancers">
        <span className="forwho-card-tag">это шанс</span>
        <h2 className="forwho-card-title">для <em>танцоров</em></h2>
        <ul className="forwho-card-list">
          <li>подтянуть уровень интенсивом с профессионалами</li>
          <li>выйти из зоны комфорта и найти свой стиль</li>
          <li>попасть в концертные составы Центра</li>
          <li>подготовиться к поступлению на «хореографию»</li>
          <li>сняться в клипах и танцевальных фотосессиях</li>
          <li>отдохнуть с друзьями</li>
        </ul>
      </article>
      <article className="forwho-card forwho-card-parents">
        <span className="forwho-card-tag">это возможность</span>
        <h2 className="forwho-card-title">для <em>родителей</em></h2>
        <ul className="forwho-card-list">
          <li>детей мы берём на себя — полдня или весь день</li>
          <li>здоровый образ жизни, никаких гаджетов</li>
          <li>свежий воздух — парки Победы и Дрозды</li>
          <li>заняты любимым делом</li>
          <li>образование в современном искусстве — музеи и лекции</li>
          <li>красивые проекты — фото и видео на память</li>
        </ul>
      </article>
    </section>
  );
}

function Programs() {
  return (
    <Section id="programs" kicker="04 / программы" title={<>Два направления: <em>contemporary</em> vs <em>street</em>.</>} tone="programs-tone">
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
  return (
    <section id="ages" className="ages-v2">
      <div className="ages-v2-inner">
        <div className="ages-v2-head">
          <h2 className="ages-v2-title">от <em>6&#8209;7 лет</em> и старше</h2>
          <p className="ages-v2-lede">
            Мы делим участников <b>по возрасту</b>, <b>уровню подготовки</b> и <b>направлению танцев</b>.
            Берём и&nbsp;девочек, и&nbsp;мальчиков. Некоторые младшие по уровню могут попасть в старшие группы — всё индивидуально.
          </p>
        </div>
        <div className="ages-v2-pills">
          <span className="ages-v2-pill"><span className="ages-v2-pill-n">6 — 8</span>младшие</span>
          <span className="ages-v2-pill"><span className="ages-v2-pill-n">9 — 11</span>средние</span>
          <span className="ages-v2-pill"><span className="ages-v2-pill-n">12+</span>старшие</span>
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <Section id="schedule" kicker="06 / расписание" title={<>Две <em>смены</em>.</>}>
      <div className="sessions-v2">
        {SESSIONS.map((s, i) => (
          <article key={s.id} className={`session-v2 session-v2-${s.id}`}>
            <div className="session-v2-body">
              <span className="session-v2-month">{s.month}</span>
              <h3 className="session-v2-dates">{s.short}</h3>
              <p className="session-v2-addr">{s.address}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="sessions-note">
        Программа в обеих сменах одинаковая — разница только в адресе: смена I проходит по {SESSIONS[0].address},
        смена II — по {SESSIONS[1].address}. Возможно посещение 1, 2, 3 или 4 недели внутри смены в любой
        комбинации. Формат мастер-классов — присоединиться можно в любой момент. Ребёнка можно забрать сразу
        после классов, развлекательная программа — по желанию.
      </p>
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
    <Section id="fun" kicker="07 / развлекательная программа" title={<>После танцев — <em>приключения</em>.</>}>
      <div className="fun-grid">
        <div className="fun-text">
          <p className="lede">
            Обед в кафе, а дальше каждый день — новое место. Программа зависит от мероприятий в Минске и погоды, финальное расписание — после 1 июня.
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

// ===== TeachersV1 — backup of the columns variant, не рендерится =====
function TeachersV1() {
  const groups = [
    { id: "street", title: "Street", hint: "уличные стили", items: TEACHERS.filter((t) => t.cat === "street") },
    { id: "contemporary", title: "Contemporary", hint: "классика и современное", items: TEACHERS.filter((t) => t.cat === "contemporary") },
    { id: "all", title: "Универсальные", hint: "для всех направлений", items: TEACHERS.filter((t) => t.cat === "all") },
  ];
  return (
    <Section id="teachers" kicker="08 / педагоги" title={<>Кто будет <em>работать</em> с детьми.</>}>
      <div className="teachers-cols">
        {groups.map((g) => (
          <div className={`teachers-col teachers-col-${g.id}`} key={g.id}>
            <div className="teachers-col-head">
              <span className="teachers-col-title">{g.title}</span>
              <span className="teachers-col-hint">{g.hint}</span>
            </div>
            <div className="teachers-col-list">
              {g.items.map((t, i) => (
                <div key={i} className={`teacher-tile teacher-tile-${g.id}`}>
                  <h3 className="teacher-name">{t.name}</h3>
                  <p className="teacher-role">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <GuestsBlock />
    </Section>
  );
}

// Общий «секретные гости» блок, чтобы не дублировать в обеих версиях
function GuestsBlock() {
  return (
    <div className="guests-v2">
      <div className="guests-v2-body">
        <span className="guests-v2-tag">сюрприз</span>
        <h3 className="guests-v2-title">И&nbsp;секретные <em>гости.</em></h3>
        <p className="guests-v2-lede">
          На каждой смене будут приглашённые педагоги&nbsp;— топовые хореографы и&nbsp;звёзды
          белорусской и&nbsp;международной сцены. Кто именно&nbsp;— пока не&nbsp;скажем,
          пусть это останется приятным сюрпризом.
        </p>
        <div className="guests-v2-marks" aria-hidden="true">
          <span>?</span><span>?</span><span>?</span>
        </div>
      </div>
    </div>
  );
}

// ===== Teachers — активная версия с фото =====
function Teachers({ session, onSessionChange }) {
  const teachers = session === 0 ? TEACHERS : TEACHERS_AUGUST;
  const catLabel = { street: "street", contemporary: "contemp.", all: "universal" };
  return (
    <Section id="teachers" kicker="08 / педагоги" title={<>Кто будет <em>работать</em> с детьми.</>}>
      <div className="teachers-session-switch">
        {SESSIONS.map((ss, i) => (
          <button
            key={ss.id}
            className={`teachers-session-btn ${session === i ? "is-active" : ""}`}
            onClick={() => onSessionChange(i)}
          >
            <span className="teachers-session-roman">{i === 0 ? "I" : "II"}</span>
            <span className="teachers-session-month">{ss.month.split(" ")[0]}</span>
          </button>
        ))}
      </div>
      <div className="teachers-grid">
        {teachers.map((t, i) => (
          <article key={i} className={`teacher-card teacher-card-${t.cat}`}>
            <div className={`teacher-card-photo ${t.photo ? "has-img" : ""}`} aria-hidden="true">
              {t.photo ? (
                <img src={t.photo} alt={t.name} loading="lazy" />
              ) : (
                <span className="teacher-card-initial">{t.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</span>
              )}
              <span className="teacher-card-cat">{catLabel[t.cat]}</span>
            </div>
            <div className="teacher-card-body">
              <h3 className="teacher-card-name">{t.name}</h3>
              <p className="teacher-card-role">{t.role}</p>
            </div>
          </article>
        ))}
      </div>

      <GuestsBlock />
    </Section>
  );
}

function Results() {
  return (
    <Section id="results" kicker="09 / результаты" title={<>Каких <em>результатов</em> достигнем.</>}>
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
    <Section id="pricing" kicker="10 / стоимость" title={<>Сколько <em>стоит</em>?</>}>
      <div className="pay-toggle">
        <button
          className={`pay-btn ${mode === "early" ? "is-active" : ""}`}
          onClick={() => setMode("early")}
        >
          <span>до 15.05.2026</span>
          <span className="pay-btn-sub">ранняя цена</span>
        </button>
        <button
          className={`pay-btn ${mode === "late" ? "is-active" : ""}`}
          onClick={() => setMode("late")}
        >
          <span>с 16.05.2026</span>
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
        <p>* Стоимость одинаковая для обеих смен — июнь (пр. Независимости 179) и август (ул. Саперов 5).</p>
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

function FloatingCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      href="#enroll"
      className={`floating-cta ${visible ? "is-visible" : ""}`}
      aria-label="Записаться на смену"
      aria-hidden={!visible}
    >
      <span className="floating-cta-text">Записаться</span>
      <span className="floating-cta-arrow" aria-hidden="true">→</span>
    </a>
  );
}

function EnrollCta({ text, variant = "want" }) {
  return (
    <section className={`enroll-cta enroll-cta-${variant}`}>
      <p className="enroll-cta-text">{text}</p>
      <a href="#enroll" className="enroll-cta-link">
        Записаться <span>→</span>
      </a>
    </section>
  );
}

// TODO: вставить реальные ссылки на Google-формы
const ENROLL_LINKS = {
  june: "https://forms.gle/REPLACE_WITH_JUNE_FORM",
  august: "https://forms.gle/REPLACE_WITH_AUGUST_FORM",
};

function Enroll() {
  return (
    <section id="enroll" className="enroll-v2">
      <div className="enroll-v2-head">
        <span className="enroll-v2-tag">регистрация открыта</span>
        <h2 className="enroll-v2-title">Хочу <em>попасть</em><br/>на лето&nbsp;со SMART&nbsp;DANCE</h2>
        <p className="enroll-v2-lede">
          Выбери смену и заполни короткую анкету — мы свяжемся в течение дня.
        </p>
      </div>
      <div className="enroll-v2-buttons">
        {SESSIONS.map((s) => (
          <a
            key={s.id}
            href={ENROLL_LINKS[s.id] || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`enroll-v2-btn enroll-v2-btn-${s.id}`}
          >
            <span className="enroll-v2-btn-label">{s.label}</span>
            <span className="enroll-v2-btn-dates">{s.short}</span>
            <span className="enroll-v2-btn-arrow" aria-hidden="true">→</span>
          </a>
        ))}
      </div>
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
          <p><b>Смена I · июнь</b><br/>пр. Независимости, 179</p>
          <p><b>Смена II · август</b><br/>ул. Саперов, 5 · ФОК «Атлант»</p>
        </div>
        <div className="foot-col">
          <span className="kicker">даты</span>
          <p>I · 01.06 — 26.06.2026</p>
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
  const [session, setSession] = useState(0);

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
        <a href="#" className="nav-logo">
          <img src="assets/logo.png" alt="SMART DANCE" />
        </a>
        <nav className="nav-links">
          <a href="#what">что</a>
          <a href="#programs">программы</a>
          <a href="#schedule">расписание</a>
          <a href="#teachers">педагоги</a>
          <a href="#pricing">цены</a>
        </nav>
        <a href="#enroll" className="btn btn-primary btn-sm">Записаться</a>
      </header>

      <Hero variant={t.heroVariant} session={session} onSessionChange={setSession} />

      {t.showTicker && <Ticker />}

      <Intro />
      <WhatWeDo />
      <ForWho />
      <AgeGroups />
      <Programs />
      <Manifesto />
      <Teachers session={session} onSessionChange={setSession} />
      <FunProgram />
      <Schedule />
      <Pricing />
      <Enroll />
      <Footer />

      <FloatingCta />

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
