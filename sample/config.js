"use strict";

// Centralized configuration with environment-variable overrides.
// Keep shapes compatible with existing server logic.

const config = {
  // Express server port (number)
  port: Number(process.env.PORT) || 8888,

  // Static file directory for express.static
  staticDir: process.env.STATIC_DIR || "./",

  // Edge.NET (C# bridge) configuration
  edge: {
    assemblyFile: process.env.TSC_ASSEMBLY_FILE || "tsclibnet.dll",
    typeName: process.env.TSC_TYPE_NAME || "TSCSDK.node_ethernet",
  },

  // Default printer settings used by print helpers
  printer: {
    ipaddress: process.env.PRINTER_IP || "192.168.8.169",
    port: process.env.PRINTER_PORT || "9100",
    delay: process.env.PRINTER_DELAY || "500",
  },
};

module.exports = config;
