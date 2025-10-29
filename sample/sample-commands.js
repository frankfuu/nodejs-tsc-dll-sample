const commandsForFormfeed = [["FORMFEED \r\n"]];

const commandsForSampleTicket = [
  `DIRECTION 1 \r\n`,
  `SET CUTTER OFF \r\n`,
  `CODEPAGE UTF-8 \r\n`,
  // `SHIFT 18 \r\n`,
  `SPEED 5 \r\n`,
  `SET CUTTER 1 \r\n`,
  `TEXT 864,572.3,"ARIAL_STD.TTF",90,14,14,2,"MSocSc(NPM)" \r\n`,
  `TEXT 734,572.3,"ARIAL_BOLD.TTF",90,26,26,2,"Sample Sample" \r\n`,
  `TEXT 604,572.3,"ARIAL_BOLD.TTF",90,26,26,2,"Sample Sample" \r\n`,
  `TEXT 474,572.3,"HKU_MING.TTF",90,26,26,2,"Sample 中文中文中文" \r\n`,
  `QRCODE 190,572.3,M,10,A,90,X318,J5,M2, "99999999999" \r\n`,
  `TEXT 153.4,218.3,"ARIAL_BOLD.TTF",90,23,23,2,"XX-99" \r\n`,
  `TEXT 207.68,1003.0000000000001,"ARIAL_BOLD.TTF",90,13,13,2,"XX" \r\n`,
  `TEXT 207.68,837.8000000000001,"ARIAL_BOLD.TTF",90,13,13,2,"99" \r\n`,
  `TEXT 136.88,837.8000000000001,"ARIAL_BOLD.TTF",90,13,13,2,"88" \r\n`,
  `TEXT 136.88,1003.0000000000001,"ARIAL_BOLD.TTF",90,13,13,2,"7" \r\n`,
  `TEXT 864,94.4,"ARIAL_BOLD.TTF",90,12,12,2,"" \r\n`,
  `TEXT 864,1026.6,"ARIAL_BOLD.TTF",90,12,12,2,"" \r\n`,
  `PRINT 1,1 \r\n`,
];

const hktbTicket1 = [
  `DIRECTION 0 \r\n`,
  // `DIRECTION 0 \r\n`,
  `SET CUTTER OFF \r\n`,
  `CODEPAGE UTF-8 \r\n`,
  `SPEED 5 \r\n`,
  `SET CUTTER 1 \r\n`,
  `TEXT 472,800,"ARIAL_BOLD.TTF",0,16,16,2,"Chan Tai Man" \r\n`,
  `TEXT 472,900,"ARIAL_STD.TTF",0,14,14,2,"HKTB Company" \r\n`,
  // `TEXT 604,572.3,"ARIAL_BOLD.TTF",90,26,26,2,"Sample Sample" \r\n`,
  `PRINT 1,1 \r\n`,
];
