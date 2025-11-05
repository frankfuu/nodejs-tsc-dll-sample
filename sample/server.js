"use strict";

const edge = require("edge-js");
const express = require("express");
const config = require("./config");
const app = express();

// Disable CORS - Allow all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Load middleware: use built-in body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(config.staticDir));

// Helper to load edge methods with consistent error logging.
function loadEdgeMethod(methodName) {
  try {
    return edge.func({
      assemblyFile: config.edge.assemblyFile,
      typeName: config.edge.typeName,
      methodName: methodName,
    });
  } catch (err) {
    console.error(`Failed to load ${methodName}:`, err && err.message ? err.message : err);
    // Return a stub that throws when called so callers fail fast and predictably.
    return async function () {
      throw new Error(`Edge method ${methodName} not available`);
    };
  }
}

// Exported/available native methods
const openport = loadEdgeMethod("openport");
const about = loadEdgeMethod("about");
const sendcommand = loadEdgeMethod("sendcommand");
const clearbuffer = loadEdgeMethod("clearbuffer");
const printerfont = loadEdgeMethod("printerfont");
const barcode = loadEdgeMethod("barcode");
const printlabel = loadEdgeMethod("printlabel");
const closeport = loadEdgeMethod("closeport");
const printer_status = loadEdgeMethod("printerstatus_string");
const sendcommand_utf8 = loadEdgeMethod("sendcommand_utf8");
const sendcommand_binary = loadEdgeMethod("sendcommand_binary");
const windowsfont = loadEdgeMethod("windowsfont");

// Basic Auth Configuration - Modify users here
const AUTHORIZED_USERS = [
  { username: "admin", password: "admin123" },
  { username: "printer", password: "print456" },
  // Add more users as needed: { username: "user", password: "pass" }
];

// Basic Auth Middleware
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="API"');
    return res.status(401).json({ ok: false, error: "Authentication required" });
  }

  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    const user = AUTHORIZED_USERS.find((u) => u.username === username && u.password === password);

    if (!user) {
      res.setHeader("WWW-Authenticate", 'Basic realm="API"');
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    // Authentication successful
    req.user = { username: user.username };
    next();
  } catch (err) {
    res.setHeader("WWW-Authenticate", 'Basic realm="API"');
    return res.status(401).json({ ok: false, error: "Invalid authentication format" });
  }
}

// Simple health/test endpoints
app.get("/test_get", basicAuth, (req, res) => {
  console.log("GET /test_get called");
  res.json({ ok: true, message: "GET Function Test!!" });
});

app.post("/", async (req, res) => {
  console.log("POST / called");
  // Fire-and-forget printing but catch top-level errors
  // printTest().catch((err) => console.error("printTest error:", err));
  printTest().catch((err) => console.error("printTest error:", err));
  // Redirect back to referer if present, otherwise send simple JSON
  const referer = req.get("referer");
  if (referer) return res.redirect(referer);
  res.json({ ok: true });
});

// Execute an array of commands sequentially using await sendcommand()
async function executeCommands(commands, address = DEFAULT_PRINTER, options = {}) {
  console.log(`commands = `, commands);

  const { clearBuffer = true, closeDelayMs = 2000 } = options;

  if (!Array.isArray(commands) || commands.length === 0) {
    throw new Error("commands must be a non-empty array");
  }

  // Normalize commands to strings (support array of strings or array of {command: string})
  const lines = commands.map((c) => (typeof c === "string" ? c : c && (c.command || c.raw))).filter(Boolean);
  if (lines.length === 0) throw new Error("no valid commands provided");

  const opened = await openport(address, true);
  if (!opened) throw new Error("failed to open printer port");

  try {
    try {
      await printer_status(300, true);
    } catch (_) {
      // Ignore printer_status errors for this flow
    }
    if (clearBuffer) await clearbuffer("", true);
    for (const line of lines) {
      await sendcommand(line);
    }
    await closeport(closeDelayMs, true);
    return { ok: true, sent: lines.length };
  } catch (err) {
    try {
      await closeport(500, true);
    } catch (_) {}
    throw err;
  }
}

// REST endpoint to accept an array of commands and send them sequentially
// Content-Type: application/json
// Body shape: { "commands": ["TEXT ...", {"command": "PRINT 1,1 \r\n"}], "printer": { ... }, "options": { clearBuffer: true, closeDelayMs: 2000 } }
app.post("/api/print/commands", basicAuth, async (req, res) => {
  try {
    const { commands, printer, options } = req.body || {};
    const address = printer && typeof printer === "object" ? { ...DEFAULT_PRINTER, ...printer } : DEFAULT_PRINTER;
    const result = await executeCommands(commands, address, options);
    res.json(result);
  } catch (err) {
    res.status(400).json({ ok: false, error: err && err.message ? err.message : String(err) });
  }
});

// Printer address used by helper functions — keep as a constant for easy changes.
const DEFAULT_PRINTER = config.printer;

async function printfile() {
  const address = DEFAULT_PRINTER;

  const font_variable = { x: "50", y: "50", fonttype: "3", rotation: "0", xmul: "1", ymul: "1", text: "Font Test" };
  const windowsfont_variable = {
    x: 50,
    y: 250,
    fontheight: 64,
    rotation: 0,
    fontstyle: 0,
    fontunderline: 0,
    szFaceName: "Arial",
    content: "Windowsfont Test from Frank",
  };
  const barcode_variable = {
    x: "50",
    y: "100",
    type: "128",
    height: "70",
    readable: "0",
    rotation: "0",
    narrow: "3",
    wide: "1",
    code: "123456",
  };
  const label_variable = { quantity: "1", copy: "1" };

  if (await openport(address, true)) {
    const status = await printer_status(300, true);
    await clearbuffer("", true);
    await printerfont(font_variable, true);
    await barcode(barcode_variable, true);
    await windowsfont(windowsfont_variable, true);
    await sendcommand("CODEPAGE UTF-8", true);
    await sendcommand('TEXT 250,50,"0",0,10,10,"Text Test!!"', true);
    await printlabel(label_variable, true);
    await closeport(2000, true);
  }
}

async function printTest() {
  const address = DEFAULT_PRINTER;

  if (await openport(address, true)) {
    const status = await printer_status(300, true);
    console.log(`status = ${status}`);

    // Use sendcommand; keep original sequence but await properly.
    await clearbuffer("", true);
    await sendcommand(`TEXT 250,50,"0",0,10,10,"Text Frank"`);
    await sendcommand(`PRINT 1,1 \r\n`);

    await closeport(2000, true);
  }
}

// If this file is run directly, start the server. When required as a module (for tests), don't auto-listen.
const PORT = config.port;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

// Export app and helper functions to enable testing and re-use.
module.exports = { app, printTest, printfile, DEFAULT_PRINTER };
