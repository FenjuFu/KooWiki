const repoForm = document.getElementById("repo-form");
const askForm = document.getElementById("ask-form");
const repoUrlInput = document.getElementById("repo-url");
const askInput = document.getElementById("ask-input");
const workspace = document.getElementById("workspace");
const repoSummary = document.getElementById("repo-summary");
const wikiSections = document.getElementById("wiki-sections");
const chatLog = document.getElementById("chat-log");
const messageTemplate = document.getElementById("message-template");
const archSvg = document.getElementById("arch-svg");

const mockSectionSeeds = [
  ["项目概览", "解释系统目标、边界和主要技术栈。"],
  ["模块地图", "梳理目录结构与模块职责，形成快速导航。"],
  ["核心流程", "描述请求链路、状态流和关键调用。"],
  ["接口与契约", "梳理 API、输入输出和错误约定。"],
  ["运行与部署", "整理本地开发、CI/CD、发布路径。"],
];

const cannedAnswers = [
  {
    match: ["渲染", "render", "流程"],
    answer:
      "核心渲染流程通常从入口路由开始，经过数据获取层与模板/组件层，最终由渲染器输出 HTML 或 UI 结果。建议优先梳理入口函数和请求处理器。",
    citations: ["src/router.ts:12-55", "src/render/index.ts:1-88"],
  },
  {
    match: ["鉴权", "auth", "登录"],
    answer:
      "鉴权链路应拆为身份识别、权限校验、审计记录三段。先确认中间件挂载顺序，再看接口级别策略是否覆盖管理员与普通用户。",
    citations: ["src/middleware/auth.ts:3-72", "src/policies/access.ts:1-49"],
  },
  {
    match: ["默认", "other"],
    answer:
      "我已基于仓库结构生成了初版说明。下一步建议追问具体模块（如 API、数据层、CI）以获得更精确、可追溯的回答。",
    citations: ["docs/overview.md:1-30", "README.md:1-65"],
  },
];

repoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = repoUrlInput.value.trim();
  if (!url) return;

  renderSummary(url);
  renderWiki();
  renderArchitecture();

  workspace.classList.remove("hidden");
  askInput.focus();
});

askForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = askInput.value.trim();
  if (!question) return;

  const response = pickAnswer(question);
  appendMessage(question, response.answer, response.citations);
  askInput.value = "";
});

function renderSummary(url) {
  const host = new URL(url).hostname;
  const repo = url.split("/").slice(-2).join("/");
  const cards = [
    ["仓库", repo || "未知"],
    ["来源", host],
    ["索引状态", "已完成（模拟）"],
    ["最近更新", new Date().toLocaleDateString("zh-CN")],
  ];

  repoSummary.innerHTML = cards
    .map(
      ([label, value]) =>
        `<article class="summary-card"><strong>${label}</strong><span>${value}</span></article>`,
    )
    .join("");
}

function renderWiki() {
  wikiSections.innerHTML = mockSectionSeeds
    .map(
      ([title, text]) =>
        `<article class="wiki-item"><h3>${title}</h3><p>${text}</p></article>`,
    )
    .join("");
}

function pickAnswer(question) {
  const normalized = question.toLowerCase();
  return (
    cannedAnswers.find((entry) =>
      entry.match.some((keyword) => normalized.includes(keyword)),
    ) || cannedAnswers[cannedAnswers.length - 1]
  );
}

function appendMessage(question, answer, citations) {
  const fragment = messageTemplate.content.cloneNode(true);
  fragment.querySelector(".question").textContent = `Q: ${question}`;
  fragment.querySelector(".answer").textContent = `A: ${answer}`;

  const citationList = fragment.querySelector(".citations");
  citations.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    citationList.appendChild(li);
  });

  chatLog.prepend(fragment);
}

function renderArchitecture() {
  archSvg.innerHTML = `
    <defs>
      <marker id="arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
        <polygon points="0 0, 12 4, 0 8" fill="#64748b" />
      </marker>
    </defs>

    <g fill="#fff" stroke="#94a3b8">
      <rect x="25" y="95" width="130" height="60" rx="10" />
      <rect x="205" y="35" width="130" height="60" rx="10" />
      <rect x="205" y="155" width="130" height="60" rx="10" />
      <rect x="390" y="95" width="130" height="60" rx="10" />
      <rect x="560" y="95" width="120" height="60" rx="10" />
    </g>

    <g font-size="14" fill="#0f172a" font-family="Inter, sans-serif">
      <text x="63" y="130">Git Repo</text>
      <text x="230" y="70">Parser</text>
      <text x="229" y="190">Indexer</text>
      <text x="430" y="130">RAG QA</text>
      <text x="590" y="130">Wiki UI</text>
    </g>

    <g stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#arrow)">
      <line x1="155" y1="125" x2="205" y2="65" />
      <line x1="155" y1="125" x2="205" y2="185" />
      <line x1="335" y1="65" x2="390" y2="125" />
      <line x1="335" y1="185" x2="390" y2="125" />
      <line x1="520" y1="125" x2="560" y2="125" />
    </g>
  `;
}
