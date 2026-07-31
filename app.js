(function () {
  "use strict";

  const data = window.PROJECT_DATA;
  const catalog = window.EQUIPMENT_CATALOG || { weapons: [], armor: [], memories: [] };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value = "") => String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

  const activeTotal = data.meta.total - data.meta.cut;
  const progress = Math.round((data.meta.done / activeTotal) * 100);
  const feedbackKey = "rootbound-project-feedback-v1";
  let feedback = loadFeedback();
  let taskFilter = "all";
  let weaponFilter = "all";
  let memoryFilter = "all";
  let armorFilter = "all";
  let armorQuery = "";
  let armorPage = 1;
  let monsterFilter = "all";
  const armorPageSize = 24;
  const gameViews = new Set(["game-bible", "story", "weapons", "memories", "armor", "bestiary"]);
  const routeMap = {
    "": "game-bible",
    "#overview": "game-bible",
    "#world": "game-bible",
    "#game-bible": "game-bible",
    "#story": "story",
    "#arsenal": "weapons",
    "#weapons": "weapons",
    "#memories": "memories",
    "#armor": "armor",
    "#bestiary": "bestiary",
    "#boss": "bestiary",
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
    $("#storyNovel").innerHTML = `
      <header class="novel-title-page">
        <span>ROOTBOUND · A TALE OF INHERITANCE</span>
        <h3>잠들지 않는 숲</h3>
        <p>검은 안개 속에서 되풀이되는 한 짐꾼과 오래된 수호자의 이야기</p>
      </header>
      ${data.game.novel.map((chapter, index) => `
        <section class="novel-chapter">
          <div class="novel-chapter-heading"><span>${escapeHtml(chapter.chapter)}</span><h4>${escapeHtml(chapter.title)}</h4></div>
          <div class="novel-prose">${chapter.paragraphs.map((paragraph, paragraphIndex) => `<p class="${index === 0 && paragraphIndex === 0 ? "novel-opener" : ""}">${escapeHtml(paragraph)}</p>`).join("")}</div>
        </section>`).join("")}
      <footer class="novel-ending"><span>END OF ONE GENERATION</span><strong>그리고 다음 수레가 숲으로 들어온다.</strong></footer>`;
  }

  function renderUnityAssetGallery(selector, items) {
    $(selector).innerHTML = items.map((item) => `
      <a class="unity-asset-card ${item.rank === "네임드" ? "asset-elite" : ""}" href="${encodeURI(item.image)}" target="_blank" rel="noreferrer" title="${escapeHtml(item.source)}">
        <span class="unity-asset-image"><img src="${encodeURI(item.image)}" alt="Unity 프로젝트의 ${escapeHtml(item.name)} 프리팹 렌더" loading="lazy" width="768" height="768"></span>
        <span class="unity-asset-copy"><small>${escapeHtml(item.type)}</small><strong>${escapeHtml(item.name)}</strong>${item.detail ? `<em>${escapeHtml(item.detail)}</em>` : ""}<i>확대 보기 ↗</i></span>
      </a>`).join("");
  }

  function renderWeapons() {
    $("#weaponFamilies").innerHTML = data.game.weaponFamilies.map((family) => `
      <article class="weapon-family panel tone-${family.tone}">
        <span>${escapeHtml(family.name)}</span><strong>${escapeHtml(family.role)}</strong>
        <div><b>${escapeHtml(family.fit)}</b><small>${escapeHtml(family.opposite)}</small></div>
      </article>`).join("");
    const weapons = catalog.weapons.filter((weapon) => weaponFilter === "all" || weapon.classKey === weaponFilter);
    $("#weaponCatalogCount").textContent = `${weapons.length} / ${catalog.weapons.length}종`;
    $("#weaponAssetGallery").innerHTML = weapons.map((weapon) => `
      <a class="unity-asset-card catalog-card grade-${weapon.grade.toLowerCase()}" href="${encodeURI(weapon.image)}" target="_blank" rel="noreferrer" title="${escapeHtml(`${weapon.asset} · ${weapon.prefab}`)}">
        <span class="unity-asset-image"><img src="${encodeURI(weapon.image)}" alt="${escapeHtml(weapon.name)} 무기 렌더" loading="lazy" width="640" height="640"></span>
        <span class="unity-asset-copy"><small>${escapeHtml(weapon.className)} · ${escapeHtml(weapon.grade)}</small><strong>${escapeHtml(weapon.name)}</strong><em>공격력 ${escapeHtml(weapon.damage)} · ${escapeHtml(weapon.prefab)}</em><i>${escapeHtml(weapon.asset)}</i></span>
      </a>`).join("");
  }

  function renderMemories() {
    const memories = catalog.memories.filter((memory) => memoryFilter === "all" || memory.weight === memoryFilter);
    $("#memoryCatalogCount").textContent = `${memories.length} / ${catalog.memories.length}종`;
    $("#memoryAssetGallery").innerHTML = memories.map((memory) => `
      <a class="unity-asset-card catalog-card memory-catalog-card grade-${memory.grade.toLowerCase()}" href="${encodeURI(memory.image)}" target="_blank" rel="noreferrer" title="${escapeHtml(`${memory.asset} · ${memory.clip}`)}">
        <span class="unity-asset-image"><img src="${encodeURI(memory.image)}" alt="${escapeHtml(memory.name)} 기억 아이콘" loading="lazy" width="64" height="64"></span>
        <span class="unity-asset-copy"><small>${escapeHtml(memory.weightName)} · ${escapeHtml(memory.grade)}</small><strong>${escapeHtml(memory.name)}</strong><em>피해 ${memory.damage} · ${escapeHtml(memory.tag)} · ${escapeHtml(memory.element)}</em><i>${escapeHtml(memory.clip)}</i></span>
      </a>`).join("");
  }

  function renderArmor() {
    const normalized = armorQuery.trim().toLowerCase();
    const filtered = catalog.armor.filter((armor) => {
      const matchesFilter = armorFilter === "all" || (armorFilter === "featured" ? armor.featured : armor.slot === armorFilter);
      const searchText = `${armor.name} ${armor.asset} ${armor.collection} ${armor.part} ${armor.slotName}`.toLowerCase();
      return matchesFilter && (!normalized || searchText.includes(normalized));
    });
    const pageCount = Math.max(1, Math.ceil(filtered.length / armorPageSize));
    armorPage = Math.min(armorPage, pageCount);
    const start = (armorPage - 1) * armorPageSize;
    const visible = filtered.slice(start, start + armorPageSize);

    $("#armorCatalogCount").textContent = `검색 결과 ${filtered.length}종`;
    $("#armorPage").textContent = `${armorPage} / ${pageCount}`;
    $("#armorPrev").disabled = armorPage <= 1;
    $("#armorNext").disabled = armorPage >= pageCount;
    $("#armorCatalogGrid").innerHTML = visible.length ? visible.map((armor) => `
      <a class="armor-catalog-card grade-${armor.grade.toLowerCase()}" href="${encodeURI(armor.image)}" target="_blank" rel="noreferrer" title="${escapeHtml(`${armor.asset} · ${armor.part}`)}">
        <span class="armor-catalog-image"><img src="${encodeURI(armor.image)}" alt="${escapeHtml(armor.name)} 아이콘" loading="lazy" width="64" height="64"></span>
        <span class="armor-catalog-copy"><small>${escapeHtml(armor.slotName)} · ${escapeHtml(armor.collection)}</small><strong>${escapeHtml(armor.name)}</strong><em>방어 ${escapeHtml(armor.defence)} · 체력 ${escapeHtml(armor.hp)}</em></span>
      </a>`).join("") : `<div class="empty-state catalog-empty">조건에 맞는 방어구가 없습니다.</div>`;
    renderUnityAssetGallery("#accessoryAssetGallery", data.unityAssets.accessories);
  }

  function renderBestiary() {
    $("#depthTrack").innerHTML = data.game.depths.map((depth, index) => `
      <article class="depth-card tone-${depth.tone}">
        <span>${escapeHtml(depth.chapters)}</span><strong>${escapeHtml(depth.title)}</strong><small>${escapeHtml(depth.detail)}</small>
        ${index < data.game.depths.length - 1 ? '<i aria-hidden="true">→</i>' : ""}
      </article>`).join("");
    const monsters = data.game.monsters.filter((monster) => {
      if (monsterFilter === "all") return true;
      if (monsterFilter === "elite") return monster.rank === "네임드";
      return monster.group === monsterFilter;
    });
    const visibleAssets = data.unityAssets.monsters.filter((asset) => monsters.some((monster) => monster.ko === asset.name));
    renderUnityAssetGallery("#monsterAssetGallery", visibleAssets);
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
      renderWeapons();
    });
    $("#memoryFilters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      memoryFilter = button.dataset.filter;
      $$('button', event.currentTarget).forEach((item) => item.classList.toggle("active", item === button));
      renderMemories();
    });
    $("#armorFilters").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      armorFilter = button.dataset.filter;
      armorPage = 1;
      $$('button', event.currentTarget).forEach((item) => item.classList.toggle("active", item === button));
      renderArmor();
    });
    $("#armorSearch").addEventListener("input", (event) => {
      armorQuery = event.currentTarget.value;
      armorPage = 1;
      renderArmor();
    });
    $("#armorPrev").addEventListener("click", () => {
      armorPage = Math.max(1, armorPage - 1);
      renderArmor();
      $("#armorCatalogGrid").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("#armorNext").addEventListener("click", () => {
      armorPage += 1;
      renderArmor();
      $("#armorCatalogGrid").scrollIntoView({ behavior: "smooth", block: "start" });
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
      ...catalog.weapons.map((item) => ({ group: "무기", title: item.name, detail: `${item.className} · 공격력 ${item.damage}`, href: "#weapons" })),
      ...catalog.memories.map((item) => ({ group: "기억", title: item.name, detail: `${item.weightName} · 피해 ${item.damage} · ${item.tag}`, href: "#memories" })),
      ...catalog.armor.map((item) => ({ group: "방어구", title: item.name, detail: `${item.slotName} · ${item.collection}`, href: "#armor" })),
      ...data.unityAssets.accessories.map((item) => ({ group: "액세서리", title: item.name, detail: item.detail, href: "#armor" })),
      ...data.unityAssets.monsters.map((item) => ({ group: "몬스터", title: item.name, detail: `${item.type} · ${item.detail}`, href: "#bestiary" })),
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
  renderWeapons();
  renderMemories();
  renderArmor();
  renderBestiary();
  renderBoss();
  renderFeedback();
  setupFeedback();
  setupFilters();
  setupSearch();
  setupNavigation();
})();
