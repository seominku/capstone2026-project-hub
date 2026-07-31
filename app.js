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
  }

  function searchIndex(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return [
      ...data.tasks.map((item) => ({ group: "작업", title: item.title, detail: `${item.id} · ${item.detail}`, href: "#sprint" })),
      ...data.qa.map((item) => ({ group: "QA", title: item.title, detail: `${item.id} · ${item.status}`, href: "#quality" })),
      ...data.changes.map((item) => ({ group: "변경", title: item.title, detail: item.detail, href: "#changes" })),
      ...data.documents.map((item) => ({ group: "문서", title: item.title, detail: item.description, href: item.path }))
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
    document.addEventListener("click", (event) => { if (!event.target.closest(".search-box") && !event.target.closest(".search-results")) results.hidden = true; });
  }

  function setupNavigation() {
    const links = $$(".nav-link");
    const sections = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current.target.id}`));
    }, { rootMargin: "-18% 0px -65%", threshold: [0.05, 0.25] });
    sections.forEach((section) => observer.observe(section));
    $(".mobile-menu").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
    links.forEach((link) => link.addEventListener("click", () => $(".sidebar").classList.remove("open")));
  }

  renderOverview();
  renderTasks();
  renderRoadmap();
  renderQa();
  renderChanges();
  renderDocuments();
  renderFeedback();
  setupFeedback();
  setupFilters();
  setupSearch();
  setupNavigation();
})();
