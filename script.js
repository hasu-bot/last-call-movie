const scrollRoot = document.querySelector("#scrollRoot");
const progress = document.querySelector("#progress");
const toTop = document.querySelector("#toTop");
const daysLeft = document.querySelector("#daysLeft");
const charactersRoot = document.querySelector("#characters");
const galleryRoot = document.querySelector("#gallery");
const trailerModal = document.querySelector("#trailerModal");
const trailerFrame = document.querySelector("#trailerFrame");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const trailerEmbedUrl = "https://www.youtube.com/embed/yOuTtrSztFU?autoplay=1&rel=0";

const characters = [
  {
    id: "haruto",
    role: "VOCAL & GUITAR",
    name: "南 晴人",
    actor: "田川隼嗣",
    instagram: "https://www.instagram.com/shunji.kimagure/",
    description: "まっすぐで不器用な主人公。音楽と出会い、高校最後の夏を駆け抜ける。",
    image: "/img/char-haruto.jpg"
  },
  {
    id: "aoi",
    role: "CHILDHOOD FRIEND",
    name: "牧野 葵",
    actor: "中村瑠衣",
    instagram: "https://www.instagram.com/nakarui0216/",
    description: "晴人の幼なじみ。不器用な想いを抱えながら、いつもそばで見守っている。",
    image: "/img/char-aoi.jpg"
  },
  {
    id: "riku",
    role: "BASS",
    name: "篠原 陸",
    actor: "守永莉音",
    instagram: "https://www.instagram.com/rion09_09/",
    description: "冷静でクールなベーシスト。仲間を支えながら、自分の進路にも向き合っていく。",
    image: "/img/char-riku.jpg"
  },
  {
    id: "yohei",
    role: "DRUMS",
    name: "日野 陽平",
    actor: "濱田敏生",
    instagram: "https://www.instagram.com/hayase.0924/",
    description: "バンドのムードメーカー。誰よりも音楽を楽しみ、仲間を明るく引っ張る存在。",
    image: "/img/char-yohei.jpg"
  },
  {
    id: "hideya",
    role: "MUSICIAN",
    name: "榊 秀也",
    actor: "三島竜太",
    instagram: "https://www.instagram.com/ryuta3island321/",
    description: "天草で活動するミュージシャン。晴人たちの前に現れ、彼らの音楽に大きな影響を与える。",
    image: "/img/char-hideya.jpg"
  },
  {
    id: "akane",
    role: "TEACHER",
    name: "白石 茜",
    actor: "美紗都",
    instagram: "https://www.instagram.com/c5.kumq.c5/",
    description: "東京から来た音楽教師。晴人たちに音楽の楽しさを教え、彼らの夏を動かしていく。",
    image: "/img/char-akane.jpg"
  }
];

const galleryItems = [
  { image: "/img/gallery-1.jpg", className: "wide" },
  { image: "/img/gallery-2.jpg", className: "wide" },
  { image: "/img/gallery-3.jpg", className: "wide" },
  { image: "/img/gallery-4.jpg", className: "wide" },
  { image: "/img/gallery-6.jpg", className: "" },
  { image: "/img/gallery-7.jpg", className: "" },
  { image: "/img/gallery-5.jpg", className: "wide" }
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
      card.className = "card reveal";

      const image = document.createElement("span");
      if (character.image) {
        image.className = "photo";
        image.style.backgroundImage = `url('${character.image}')`;
      } else {
        image.className = "photo-empty";
        image.innerHTML = `<span>STILL — ${character.name}</span>`;
      }

      const body = document.createElement("span");
      body.innerHTML = `
        <span class="role">${character.role}</span>
        <span class="name">${character.name}</span>
        ${character.actor ? `<span class="actor">${character.actor}</span>` : ""}
        <span class="description">${character.description}</span>
        ${
          character.instagram
            ? `<a class="cast-insta" href="${character.instagram}" target="_blank" rel="noopener">Instagram</a>`
            : ""
        }
      `;

      card.append(image, body);
      return card;
    })
  );
}

function renderGallery() {
  galleryRoot.replaceChildren(
    ...galleryItems.map((item) => {
      const button = document.createElement("button");
      button.className = `photo reveal ${item.className}`.trim();
      button.type = "button";
      button.style.backgroundImage = `url('${item.image}')`;
      button.setAttribute("aria-label", "ギャラリー画像を拡大表示");
      button.addEventListener("click", () => openLightbox(item.image));
      return button;
    })
  );
}

function syncScrollEffects() {
  const max = scrollRoot.scrollHeight - scrollRoot.clientHeight;
  const percent = max > 0 ? Math.min(100, (scrollRoot.scrollTop / max) * 100) : 0;
  progress.style.width = `${percent}%`;
  toTop.classList.toggle("show", percent > 5);

  scrollRoot.querySelectorAll("[data-parallax]").forEach((element) => {
    const factor = Number.parseFloat(element.dataset.parallax || "0");
    element.style.transform = `translateY(${scrollRoot.scrollTop * factor}px)`;
  });
}

function openModal() {
  trailerFrame.src = trailerEmbedUrl;
  trailerModal.hidden = false;
}

function closeModal() {
  trailerModal.hidden = true;
  trailerFrame.src = "";
}

function openLightbox(image) {
  lightboxImage.style.backgroundImage = `url('${image}')`;
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.style.backgroundImage = "";
}

renderCharacters();
renderGallery();
setDaysLeft();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  { root: scrollRoot, threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
scrollRoot.addEventListener("scroll", syncScrollEffects, { passive: true });
toTop.addEventListener("click", () => scrollRoot.scrollTo({ top: 0, behavior: "smooth" }));
document.querySelectorAll("[data-open-modal]").forEach((button) => button.addEventListener("click", openModal));
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
document.querySelectorAll("[data-close-lightbox]").forEach((button) => button.addEventListener("click", closeLightbox));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeLightbox();
  }
});
syncScrollEffects();
