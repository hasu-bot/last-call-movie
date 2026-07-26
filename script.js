const progress = document.querySelector("#progress");
const toTop = document.querySelector("#toTop");
const daysLeft = document.querySelector("#daysLeft");
const siteHeader = document.querySelector("#siteHeader");
const menuButton = document.querySelector("#menuButton");
const siteNav = document.querySelector("#siteNav");
const charactersRoot = document.querySelector("#characters");
const galleryRoot = document.querySelector("#galleryGrid");
const photoReelRoot = document.querySelector("#photoReelTrack");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");

const characters = [
  {
    role: "VOCAL & GUITAR",
    name: "南 晴人",
    actor: "田川隼嗣",
    instagram: "https://www.instagram.com/shunji.kimagure/",
    description: "まっすぐで不器用な主人公。音楽と出会い、高校最後の夏を駆け抜ける。",
    image: "/img/char-haruto.jpg"
  },
  {
    role: "CHILDHOOD FRIEND",
    name: "牧野 葵",
    actor: "中村瑠衣",
    instagram: "https://www.instagram.com/nakarui0216/",
    description: "晴人の幼なじみ。不器用な想いを抱えながら、いつもそばで見守っている。",
    image: "/img/char-aoi.jpg"
  },
  {
    role: "BASS",
    name: "篠原 陸",
    actor: "守永莉音",
    instagram: "https://www.instagram.com/rion09_09/",
    description: "冷静でクールなベーシスト。仲間を支えながら、自分の進路にも向き合っていく。",
    image: "/img/char-riku.jpg"
  },
  {
    role: "DRUMS",
    name: "日野 陽平",
    actor: "濱田敏生",
    instagram: "https://www.instagram.com/hayase.0924/",
    description: "バンドのムードメーカー。誰よりも音楽を楽しみ、仲間を明るく引っ張る存在。",
    image: "/img/char-yohei.jpg"
  },
  {
    role: "MUSICIAN",
    name: "榊 秀也",
    actor: "三島竜太",
    instagram: "https://www.instagram.com/ryuta3island321/",
    description: "天草で活動するミュージシャン。晴人たちの音楽に大きな影響を与える。",
    image: "/img/char-hideya.jpg"
  },
  {
    role: "TEACHER",
    name: "白石 茜",
    actor: "美紗都",
    instagram: "https://www.instagram.com/c5.kumq.c5/",
    description: "東京から来た音楽教師。音楽の楽しさを教え、彼らの夏を動かしていく。",
    image: "/img/char-akane.jpg"
  }
];

const galleryItems = [
  { image: "/img/gallery-1.jpg", className: "wide" },
  { image: "/img/gallery-2.jpg", className: "" },
  { image: "/img/gallery-3.jpg", className: "" },
  { image: "/img/gallery-4.jpg", className: "wide" },
  { image: "/img/gallery-6.jpg", className: "" },
  { image: "/img/gallery-7.jpg", className: "" },
  { image: "/img/gallery-5.jpg", className: "wide" }
];

const photoReelItems = [
  { image: "/img/filmstrip/film-01.jpg", alt: "海辺で撮影に臨む出演者" },
  { image: "/img/filmstrip/film-02.jpg", alt: "自転車と並ぶ出演者たち" },
  { image: "/img/filmstrip/film-03.jpg", alt: "海辺で過ごす出演者たち" },
  { image: "/img/filmstrip/film-04.jpg", alt: "撮影の合間に話す出演者たち" },
  { image: "/img/filmstrip/film-05.jpg", alt: "海辺の撮影を見守る人たち" },
  { image: "/img/filmstrip/film-06.jpg", alt: "海辺に立つ出演者" },
  { image: "/img/filmstrip/film-07.jpg", alt: "夕暮れの撮影風景" },
  { image: "/img/filmstrip/film-08.jpg", alt: "青空の下で行われるライブ撮影" },
  { image: "/img/filmstrip/film-09.jpg", alt: "青い海を進む撮影船" },
  { image: "/img/filmstrip/film-10.jpg", alt: "天草の景色を背にした集合写真" },
  { image: "/img/filmstrip/film-11.jpg", alt: "海辺のステージに並ぶ出演者たち" },
  { image: "/img/filmstrip/film-12.jpg", alt: "撮影機材を確認するスタッフ" },
  { image: "/img/filmstrip/film-13.jpg", alt: "屋外撮影に臨む出演者とスタッフ" },
  { image: "/img/filmstrip/film-14.jpg", alt: "ライブシーンで使われたギター" },
  { image: "/img/filmstrip/film-15.jpg", alt: "船上での撮影風景" },
  { image: "/img/filmstrip/film-16.jpg", alt: "港で撮影する出演者たち" },
  { image: "/img/filmstrip/film-17.jpg", alt: "カメラの前で打ち合わせる出演者" },
  { image: "/img/filmstrip/film-18.jpg", alt: "青空の下に集まった撮影チーム" }
];

function setDaysLeft() {
  const eventDate = new Date("2026-08-29T00:00:00+09:00");
  const msLeft = eventDate.getTime() - Date.now();
  daysLeft.textContent = String(Math.max(0, Math.ceil(msLeft / 86_400_000)));
}

function renderCharacters() {
  charactersRoot.replaceChildren(
    ...characters.map((character) => {
      const card = document.createElement("article");
      card.className = "cast-card reveal";

      const photo = document.createElement("div");
      photo.className = "cast-photo";
      photo.style.backgroundImage = `url('${character.image}')`;
      photo.setAttribute("role", "img");
      photo.setAttribute("aria-label", `${character.name}役 ${character.actor}`);

      const role = document.createElement("span");
      role.className = "cast-role";
      role.textContent = character.role;

      const name = document.createElement("h3");
      name.append(document.createTextNode(character.name));
      const actor = document.createElement("small");
      actor.textContent = character.actor;
      name.append(actor);

      const description = document.createElement("p");
      description.textContent = character.description;

      card.append(photo, role, name, description);

      if (character.instagram) {
        const link = document.createElement("a");
        link.className = "cast-insta";
        link.href = character.instagram;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Instagram";
        card.append(link);
      }

      return card;
    })
  );
}

function renderGallery() {
  galleryRoot.replaceChildren(
    ...galleryItems.map((item, index) => {
      const button = document.createElement("button");
      button.className = `gallery-item reveal ${item.className}`.trim();
      button.type = "button";
      button.style.backgroundImage = `url('${item.image}')`;
      button.setAttribute("aria-label", `ギャラリー画像 ${index + 1} を拡大表示`);
      button.addEventListener("click", () => openLightbox(item.image));
      return button;
    })
  );
}

function renderPhotoReel() {
  const createSet = (duplicate = false) => {
    const set = document.createElement("div");
    set.className = "motion-strip-set";

    if (duplicate) {
      set.setAttribute("aria-hidden", "true");
    }

    photoReelItems.forEach((item, index) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = duplicate ? "" : item.alt;
      image.loading = "lazy";
      image.decoding = "async";

      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      figure.append(image, number);
      set.append(figure);
    });

    return set;
  };

  photoReelRoot.replaceChildren(createSet(), createSet(true));
}

function syncScrollEffects() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
  progress.style.width = `${percent}%`;
  toTop.classList.toggle("show", window.scrollY > 520);
  siteHeader.classList.toggle("scrolled", window.scrollY > 24);
}

function setMenu(open) {
  siteHeader.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

function openLightbox(image) {
  lightboxImage.src = image;
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  lightbox.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("modal-open");
}

renderCharacters();
renderGallery();
renderPhotoReel();
setDaysLeft();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -8%", threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
window.addEventListener("scroll", syncScrollEffects, { passive: true });
window.addEventListener("resize", syncScrollEffects, { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
menuButton.addEventListener("click", () => setMenu(!siteHeader.classList.contains("open")));
siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.querySelectorAll("[data-close-lightbox]").forEach((button) => button.addEventListener("click", closeLightbox));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    closeLightbox();
  }
});

syncScrollEffects();
