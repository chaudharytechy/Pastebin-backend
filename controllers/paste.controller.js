const Paste = require("../models/Paste");
const { getNow } = require("../utils/time");

exports.createPaste = async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views !== undefined && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const now = Date.now();

  const paste = await Paste.create({
    content,
    createdAt: now,
    expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
    maxViews: max_views ?? null
  });

  res.status(201).json({
    id: paste._id.toString(),
    url: `${process.env.BASE_URL}/api/pastes/${paste._id}`
  });
};

// exports.getPaste = async (req, res) => {
//     // console.log(req.params.id,"hh")
//   const paste = await Paste.findById(req.params.id);
// //   console.log(paste)
//   if (!paste) {
//     return res.status(404).json({ error: "Not found" });
//   }

//   const now = getNow(req);

//   if (paste.expiresAt && now > paste.expiresAt) {
//     return res.status(404).json({ error: "Not found2" });
//   }

//   if (paste.maxViews !== null && paste.views >= paste.maxViews) {
//     return res.status(404).json({ error: "Not found3" });
//   }

//   paste.views += 1;
//   await paste.save();

//   res.json({
//     content: paste.content,
//     remaining_views:
//       paste.maxViews === null ? null : paste.maxViews - paste.views,
//     expires_at: paste.expiresAt
//       ? new Date(paste.expiresAt).toISOString()
//       : null
//   });
// };



exports.getPaste = async (req, res) => {
  const paste = await Paste.findById(req.params.id);

  if (!paste) {
    return res.status(404).send(renderError("Paste not found"));
  }

  const now = getNow(req);

  if (paste.expiresAt && now > paste.expiresAt) {
    return res.status(404).send(
      renderError("Sorry, this paste has expired.")
    );
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return res.status(404).send(
      renderError("Sorry, this paste has reached its view limit.")
    );
  }

  paste.views += 1;
  await paste.save();

  return res.status(200).send(renderContent(paste.content));
};

/* ---------- helpers (same file, no extra work) ---------- */

function renderContent(content) {
  return `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Paste</title>
  <style>
    body {
      background: #0f172a;
      color: #e5e7eb;
      font-family: monospace;
      padding: 40px;
    }
    pre {
      background: #020617;
      padding: 20px;
      border-radius: 8px;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <pre>${escapeHtml(content)}</pre>
</body>
</html>
`;
}

function renderError(message) {
  return `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Paste unavailable</title>
  <style>
    body {
      background: #020617;
      color: #f87171;
      font-family: Arial;
      text-align: center;
      padding-top: 100px;
    }
  </style>
</head>
<body>
  <h2>${message}</h2>
</body>
</html>
`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
