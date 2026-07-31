(function () {
  "use strict";

  const data = window.PROJECT_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value = "") => String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

  const activeTotal = data.meta.total - data.meta.cut;
  const progress = Math.round((data.meta.done / activeTotal) * 100);
  const feedbackKey = "rootbound-project-feedback-v1";
  let feedback = loadFeedback();
  let taskFilter = "all";
  let weaponFilter = "all";
  let monsterFilter = "all";
  const gameViews = new Set(["game-bible", "story", "arsenal", "bestiary", "boss"]);
  const routeMap = {
    "": "game-bible",
    "#overview": "game-bible",
    "#world": "game-bible",
    "#game-bible": "game-bible",
    "#story": "story",
    "#arsenal": "arsenal",
    "#bestiary": "bestiary",
    "#boss": "boss",
    "#development": "development",
    "#sprint": "development",
    "#changes": "development",
    "#quality": "quality",
    "#roadmap": "quality",
    "#documents": "documents",
    "#feedback": "feedback"
  };

  function resolveView(hash = window.location.hash) {
    return routeMap[hash.toLowerCase()] || "game-bible";
  }

  function showView(view, options = {}) {
    const { updateHistory = false, hash = `#${view}`, smooth = true } = options;
    const nextView = [...gameViews, "development", "quality", "documents", "feedback"].includes(view) ? view : "game-bible";

    $$(".page-section").forEach((section) => {
      section.hidden = section.dataset.page !== nextView;
    });
    $$(".top-nav-link").forEach((link) => {
      const active = link.dataset.view === "game-bible" ? gameViews.has(nextView) : link.dataset.view === nextView;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    $$(".subnav-link").forEach((link) => {
      const active = link.dataset.view === nextView;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const subnav = $("#gameSubnav");
    subnav.hidden = !gameViews.has(nextView);
    $("#primaryNav").classList.remove("open");
    $(".mobile-menu").setAttribute("aria-expanded", "false");

    if (updateHistory) window.history.pushState({ view: nextView }, "", hash);
    if (smooth) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function loadFeedback() {
    try {
      const stored = JSON.parse(localStorage.getItem(feedbackKey));
      return Array.isArray(stored) ? stored : [...data.feedbackSeed];
    } catch (_) {
      return [...data.feedbackSeed];
    }
  }

  function saveFeedback() {
    localStorage.setItem(feedbackKey, JSON.stringify(feedback));
  }

  function renderOverview() {
    $("#progressValue").textContent = `${progress}%`;
    $("#progressRing").style.setProperty("--progress", `${progress * 3.6}deg`);
    $("#progressCaption").textContent = `완료 ${data.meta.done} · 대기 ${data.meta.todo} · 제외 ${data.meta.cut}`;
    $("#metricCards").innerHTML = data.metrics.map((metric) => `
      <article class="metric-card panel tone-${metric.tone}">
        <span class="metric-icon">${metric.icon}</span>
        <div><p>${metric.label}</p><strong>${metric.value}</strong><small>${metric.detail}</small></div>
      </article>`).join("");
  }

  function renderTasks() {
    const tasks = data.tasks.filter((task) => {
      if (taskFilter === "all") return true;
      if (taskFilter === "risk") return task.risk;
      return task.status === taskFilter;
    });
    $("#taskGrid").innerHTML = tasks.map((task) => `
      <article class="task-card panel ${task.status} ${task.risk ? "risk" : ""}">
        <div class="task-top"><span class="priority ${task.priority.toLowerCase()}">${task.priority}</span><span class="task-tag">${escapeHtml(task.tag)}</span></div>
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(task.detail)}</p>
        <div class="task-bottom"><code>${escapeHtml(task.id)}</code><span>${task.status === "done" ? "완료 ✓" : "대기 →"}</span></div>
      </article>`).join("");
  }

  function renderRoadmap() {
    $("#roadmapTrack").innerHTML = data.roadmap.map((item, index) => `
      <div class="roadmap-item ${item.state}">
        <div class="roadmap-node"><span>${item.state === "done" ? "✓" : index + 1}</span></div>
        <time>${item.date}</time><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small>
      </div>`).join("");
  }

  function renderQa() {
    $("#qaCount").textContent = `${data.qa.length} ACTIVE`;
    $("#qaList").innerHTML = data.qa.map((item) => `
      <div class="qa-item">
        <span class="qa-signal ${item.tone}"></span>
        <div><strong>${escapeHtml(item.title)}</strong><code>${escapeHtml(item.id)}</code></div>
        <span class="qa-state">${escapeHtml(item.status)}</span><b>${item.severity}</b>
      </div>`).join("");
  }

  function renderChanges() {
    $("#changeTimeline").innerHTML = data.changes.map((item) => `
      <div class="timeline-item tone-${item.tone}">
        <time>${item.time}</time><span class="timeline-dot"></span>
        <div><small>${item.group}</small><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div>
      </div>`).join("");
  }

  function renderDocuments() {
    $("#documentGrid").innerHTML = data.documents.map((doc) => `
      <a class="document-card panel accent-${doc.accent}" href="${encodeURI(doc.path)}">
        <span class="doc-type">${doc.type}</span><span class="doc-arrow">↗</span>
        <h3>${escapeHtml(doc.title)}</h3><p>${escapeHtml(doc.description)}</p>
      </a>`).join("");
  }

  function renderGameBible() {
    $("#gameFacts").innerHTML = data.game.facts.map((fact) => `
      <article class="game-fact panel">
        <strong>${escapeHtml(fact.value)}</strong><span>${escapeHtml(fact.label)}</span><small>${escapeHtml(fact.detail)}</small>
      </article>`).join("");
    $("#pillarGrid").innerHTML = data.game.pillars.map((pillar) => `
      <article class="pillar-card panel tone-${pillar.tone}">
        <span>${pillar.index}</span><h3>${escapeHtml(pillar.title)}</h3><p>${escapeHtml(pillar.detail)}</p>
      </article>`).join("");
    $("#coreLoop").innerHTML = data.game.loop.map((step, index) => `
      <div class="loop-step"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(step)}</strong></div>`).join("");
  }

  function renderStory() {
    $("#storyActs").innerHTML = data.game.story.map((chapter) => `
      <article class="story-card panel story-${chapter.tone}">
        <div class="story-index"><span>${escapeHtml(chapter.act)}</span><strong>${escapeHtml(chapter.chapters)}</strong></div>
        <h3>${escapeHtml(chapter.title)}</h3><p>${escapeHtml(chapter.detail)}</p>
        <small>${escapeHtml(chapter.place)}</small>
      </article>`).join("");
    $("#storyClues").innerHTML = data.game.clues.map((clue, index) => `
      <div class="clue-item"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(clue.label)}</strong><p>${escapeHtml(clue.detail)}</p></div></div>`).join("");
  }

  function renderUnityAssetGallery(selector, items) {
    $(selector).innerHTML = items.map((item) => `
      <a class="unity-asset-card" href="${encodeURI(item.image)}" target="_blank" rel="noreferrer" title="${escapeHtml(item.source)}">
        <span class="unity-asset-image"><img src="${encodeURI(item.image)}" alt="Unity 프로젝트의 ${escapeHtml(item.name)} 프리팹 렌더" loading="lazy" width="768" height="768"></span>
        <span class="unity-asset-copy"><small>${escapeHtml(item.type)}</small><strong>${escapeHtml(item.name)}</strong><i>확대 보기 ↗</i></span>
      </a>`).join("");
  }

  function renderArsenal() {
    $("#weaponFamilies").innerHTML = data.game.weaponFamilies.map((family) => `
      <article class="weapon-family panel tone-${family.tone}">
        <span>${escapeHtml(family.name)}</span><strong>${escapeHtml(family.role)}</strong>
        <div><b>${escapeHtml(family.fit)}</b><small>${escapeHtml(family.opposite)}</small></div>
      </article>`).join("");
    renderUnityAssetGallery("#weaponAssetGallery", [...data.unityAssets.armor, ...data.unityAssets.weapons]);
    const weapons = data.game.weapons.filter((weapon) => weaponFilter === "all" || weapon.family === weaponFilter);
    $("#weaponGrid").innerHTML = weapons.map((weapon) => `
      <article class="weapon-card panel family-${weapon.family}">
        <div class="weapon-silhouette" aria-hidden="true"><span></span></div>
        <div class="weapon-heading"><span>${escapeHtml(weapon.rarity)}</span><small>${escapeHtml(weapon.type)}</small></div>
        <h3>${escapeHtml(weapon.name)}</h3>
        <strong class="weapon-damage">공격력 ${escapeHtml(weapon.damage)}</strong>
        <p>${escapeHtml(weapon.detail)}</p>
      </article>`).join("");
    $("#memoryGrid").innerHTML = data.game.memories.map((memory) => `
      <article class="memory-card rarity-${memory.rarity.toLowerCase()}">
        <div><span>${escapeHtml(memory.rarity)}</span><b>${memory.damage}</b></div>
        <strong>${escapeHtml(memory.name)}</strong>
        <small>${escapeHtml(memory.weight)} · ${escapeHtml(memory.trait)}</small>
      </article>`).join("");
  }

  function renderBestiary() {
    $("#depthTrack").innerHTML = data.game.depths.map((depth, index) => `
      <article class="depth-card tone-${depth.tone}">
        <span>${escapeHtml(depth.chapters)}</span><strong>${escapeHtml(depth.title)}</strong><small>${escapeHtml(depth.detail)}</small>
        ${index < data.game.depths.length - 1 ? '<i aria-hidden="true">→</i>' : ""}
      </article>`).join("");
    renderUnityAssetGallery("#monsterAssetGallery", data.unityAssets.monsters);
    const monsters = data.game.monsters.filter((monster) => {
      if (monsterFilter === "all") return true;
      if (monsterFilter === "elite") return monster.rank === "네임드";
      return monster.group === monsterFilter;
    });
    $("#monsterGrid").innerHTML = monsters.map((monster) => `
      <article class="monster-card panel ${monster.rank === "네임드" ? "elite" : ""}">
        <div class="monster-emblem" aria-hidden="true"><span>${monster.rank === "네임드" ? "✦" : "◇"}</span></div>
        <div class="monster-meta"><span>${escapeHtml(monster.rank)}</span><small>${escapeHtml(monster.role)}</small></div>
        <h3>${escapeHtml(monster.ko)}</h3><code>${escapeHtml(monster.name)}</code>
        <p>${escapeHtml(monster.feature)}</p><b>${escapeHtml(monster.status)}</b>
      </article>`).join("");
  }

  function renderBoss() {
    $("#bossPhases").innerHTML = data.game.boss.phases.map((phase) => `
      <article class="boss-phase panel tone-${phase.tone}">
        <div><span>${escapeHtml(phase.phase)}</span><b>HP ${escapeHtml(phase.hp)}</b></div>
        <h3>${escapeHtml(phase.title)}</h3>
        <strong>${escapeHtml(phase.pattern)}</strong><p>${escapeHtml(phase.intent)}</p>
      </article>`).join("");
  }

  function feedbackLabel(status) {
    return { open: "검토 대기", in_progress: "진행 중", resolved: "반영 완료" }[status] || status;
  }

  function renderFeedback() {
    const counts = feedback.reduce((map, item) => ({ ...map, [item.status]: (map[item.status] || 0) + 1 }), {});
    $("#feedbackSummary").innerHTML = `<span><b>${feedback.length}</b> 전체</span><span><b>${counts.open || 0}</b> 검토 대기</span><span><b>${counts.in_progress || 0}</b> 진행 중</span><span><b>${counts.resolved || 0}</b> 반영 완료</span>`;
    $("#feedbackList").innerHTML = feedback.length ? feedback.map((item) => `
      <article class="feedback-item" data-id="${escapeHtml(item.id)}">
        <div class="feedback-main">
          <div class="feedback-tags"><span>${escapeHtml(item.priority)}</span><span>${escapeHtml(item.category)}</span><time>${escapeHtml(item.createdAt)}</time></div>
          <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p>
        </div>
        <div class="feedback-actions">
          <button class="status-button ${item.status}" data-action="cycle" type="button">${feedbackLabel(item.status)}</button>
          <button class="delete-button" data-action="delete" type="button" aria-label="피드백 삭제">×</button>
        </div>
      </article>`).join("") : `<div class="empty-state">아직 피드백이 없습니다. 첫 의견을 남겨보세요.</div>`;
  }

  function openFeedbackDialog() {
    const dialog = $("#feedbackDialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function setupFeedback() {
    ["#openFeedback", "#openFeedbackBottom"].forEach((selector) => $(selector).addEventListener("click", openFeedbackDialog));
    $$("[data-dialog-close]", $("#feedbackDialog")).forEach((button) => {
      button.addEventListener("click", () => $("#feedbackDialog").close());
    });
    $("#feedbackForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const now = new Date();
      feedback.unshift({
        id: `feedback-${Date.now()}`,
        title: form.get("title").trim(),
        detail: form.get("detail").trim(),
        category: form.get("category"),
        priority: form.get("priority"),
        status: "open",
        createdAt: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`
      });
      saveFeedback();
      renderFeedback();
      event.currentTarget.reset();
      $("#feedbackDialog").close();
    });
    $("#feedbackList").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      const item = event.target.closest(".feedback-item");
      if (!button || !item) return;
      const index = feedback.findIndex((entry) => entry.id === item.dataset.id);
      if (index < 0) return;
      if (button.dataset.action === "delete") feedback.splice(index, 1);
      if (button.dataset.action === "cycle") {
        const order = ["open", "in_progress", "resolved"];
        feedback[index].status = order[(order.indexOf(feedback[index].status) + 1) % order.length];
      }
      saveFeedback();
      renderFeedback();
    });
  }

  function setupFilters() {
    $("#taskFilters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      taskFilter = button.dataset.filter;
      $$("button", event.currentTarget).forEach((item) => item.classList.toggle("active", item === button));
      renderTasks();
    });
    $("#weaponFilters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      weaponFilter = button.dataset.filter;
      $$('button', event.currentTarget).forEach((item) => item.classList.toggle("active", item === button));
      renderArsenal();
    });
    $("#monsterFilters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      monsterFilter = button.dataset.filter;
      $$('button', event.currentTarget).forEach((item) => item.classList.toggle("active", item === button));
      renderBestiary();
    });
  }

  function searchIndex(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return [
      ...data.tasks.map((item) => ({ group: "작업", title: item.title, detail: `${item.id} · ${item.detail}`, href: "#sprint" })),
      ...data.qa.map((item) => ({ group: "QA", title: item.title, detail: `${item.id} · ${item.status}`, href: "#quality" })),
      ...data.changes.map((item) => ({ group: "변경", title: item.title, detail: item.detail, href: "#changes" })),
      ...data.documents.map((item) => ({ group: "문서", title: item.title, detail: item.description, href: item.path })),
      ...data.game.story.map((item) => ({ group: "스토리", title: item.title, detail: `${item.chapters} · ${item.detail}`, href: "#story" })),
      ...data.game.weapons.map((item) => ({ group: "무기", title: item.name, detail: `${item.type} · 공격력 ${item.damage}`, href: "#arsenal" })),
      ...data.game.memories.map((item) => ({ group: "기억", title: item.name, detail: `${item.weight} · ${item.trait}`, href: "#arsenal" })),
      ...data.game.monsters.map((item) => ({ group: "몬스터", title: item.ko, detail: `${item.name} · ${item.feature}`, href: "#bestiary" })),
      ...data.game.boss.phases.map((item) => ({ group: "보스", title: item.title, detail: `${item.phase} · ${item.pattern}`, href: "#boss" }))
    ].filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(normalized)).slice(0, 8);
  }

  function setupSearch() {
    const input = $("#globalSearch");
    const results = $("#searchResults");
    const update = () => {
      const found = searchIndex(input.value);
      if (!input.value.trim()) { results.hidden = true; return; }
      results.innerHTML = found.length ? found.map((item) => `<a href="${encodeURI(item.href)}"><span>${item.group}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></a>`).join("") : `<div class="empty-state">검색 결과가 없습니다.</div>`;
      results.hidden = false;
      const box = input.closest(".search-box").getBoundingClientRect();
      results.style.top = `${box.bottom + 8}px`;
      results.style.right = `${window.innerWidth - box.right}px`;
    };
    input.addEventListener("input", update);
    input.addEventListener("keydown", (event) => { if (event.key === "Escape") { input.value = ""; results.hidden = true; input.blur(); } });
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); input.focus(); input.select(); }
    });
    results.addEventListener("click", (event) => {
      const link = event.target.closest("a[href^='#']");
      if (!link) return;
      event.preventDefault();
      input.value = "";
      results.hidden = true;
      showView(resolveView(link.getAttribute("href")), { updateHistory: true, hash: link.getAttribute("href") });
    });
    document.addEventListener("click", (event) => { if (!event.target.closest(".search-box") && !event.target.closest(".search-results")) results.hidden = true; });
  }

  function setupNavigation() {
    $$("[data-view]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault();
      showView(link.dataset.view, { updateHistory: true, hash: link.getAttribute("href") });
    }));

    $(".mobile-menu").addEventListener("click", (event) => {
      event.stopPropagation();
      const nav = $("#primaryNav");
      const open = nav.classList.toggle("open");
      event.currentTarget.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest("#primaryNav") || event.target.closest(".mobile-menu")) return;
      $("#primaryNav").classList.remove("open");
      $(".mobile-menu").setAttribute("aria-expanded", "false");
    });
    window.addEventListener("popstate", () => showView(resolveView(), { smooth: false }));
    window.addEventListener("hashchange", () => showView(resolveView(), { smooth: false }));
    showView(resolveView(), { smooth: false });
  }

  renderOverview();
  renderTasks();
  renderRoadmap();
  renderQa();
  renderChanges();
  renderDocuments();
  renderGameBible();
  renderStory();
  renderArsenal();
  renderBestiary();
  renderBoss();
  renderFeedback();
  setupFeedback();
  setupFilters();
  setupSearch();
  setupNavigation();
})();
