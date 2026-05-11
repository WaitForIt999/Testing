const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  LevelFormat, ExternalHyperlink, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// Colors
const BLUE = "4472C4";
const LIGHT_GRAY = "F2F2F2";
const DARK_GRAY = "404040";
const MED_GRAY = "666666";
const WHITE = "FFFFFF";

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function sectionHeader(text) {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
    children: [
      new TextRun({
        text: " " + text + " ",
        bold: true,
        color: WHITE,
        size: 20,
        font: "Calibri",
        shading: { type: ShadingType.CLEAR, fill: BLUE },
      })
    ],
    shading: { type: ShadingType.CLEAR, fill: BLUE },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE }
    }
  });
}

function skillItem(text) {
  return new Paragraph({
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text, size: 18, font: "Calibri", color: DARK_GRAY })]
  });
}

function jobEntry(title, company, location, dateFrom, dateTo, bullets) {
  const items = [];
  items.push(new Paragraph({
    spacing: { before: 100, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 7200 }],
    children: [
      new TextRun({ text: title, bold: true, size: 20, font: "Calibri", color: DARK_GRAY }),
      new TextRun({ text: "\t", size: 20 }),
      new TextRun({ text: dateFrom, size: 18, font: "Calibri", color: MED_GRAY }),
    ]
  }));
  items.push(new Paragraph({
    spacing: { before: 0, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 7200 }],
    children: [
      new TextRun({ text: company, size: 18, font: "Calibri", color: BLUE, bold: true }),
      new TextRun({ text: "\t", size: 18 }),
      new TextRun({ text: dateTo, size: 18, font: "Calibri", color: MED_GRAY }),
    ]
  }));
  for (const b of bullets) {
    items.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 30, after: 0 },
      children: [new TextRun({ text: b, size: 18, font: "Calibri", color: DARK_GRAY })]
    }));
  }
  return items;
}

function eduEntry(degree, school, dateFrom, dateTo, desc) {
  return [
    new Paragraph({
      spacing: { before: 100, after: 0 },
      tabStops: [{ type: TabStopType.RIGHT, position: 7200 }],
      children: [
        new TextRun({ text: degree, bold: true, size: 20, font: "Calibri", color: DARK_GRAY }),
        new TextRun({ text: "\t", size: 20 }),
        new TextRun({ text: dateFrom, size: 18, font: "Calibri", color: MED_GRAY }),
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 0 },
      tabStops: [{ type: TabStopType.RIGHT, position: 7200 }],
      children: [
        new TextRun({ text: school, size: 18, font: "Calibri", color: BLUE, bold: true }),
        new TextRun({ text: "\t", size: 18 }),
        new TextRun({ text: dateTo, size: 18, font: "Calibri", color: MED_GRAY }),
      ]
    }),
    new Paragraph({
      spacing: { before: 30, after: 0 },
      children: [new TextRun({ text: desc, size: 18, font: "Calibri", color: DARK_GRAY })]
    })
  ];
}

function infoLine(label, value) {
  return new Paragraph({
    spacing: { before: 40, after: 0 },
    children: [
      new TextRun({ text: label + "  ", size: 18, font: "Calibri", color: BLUE, bold: true }),
      new TextRun({ text: value, size: 18, font: "Calibri", color: DARK_GRAY }),
    ]
  });
}

// Left column content (skills)
const leftColWidth = 2400;
const rightColWidth = 7000;
const totalWidth = leftColWidth + rightColWidth;

// Skills list
const allSkills = [
  "Selenium WebDriver", "Git", "Confluence", "AI Testing", "Python",
  "JavaScript", "TypeScript", "QA", "Manual Testing", "Regression Testing",
  "Smoke Testing", "Integration Testing", "A/B Testing",
  "Basic Penetration Testing", "Playwright", "Jest", "Vitest",
  "Postman", "Bug Tracking", "Nanos", "SQL", "YAML",
  "REST API", "GraphQL", "Data Analysis", "CI",
  "Linux", "Azure", "Kubb", "OpenAPI", "MS Office"
];

function makeLeftCell(children) {
  return new TableCell({
    width: { size: leftColWidth, type: WidthType.DXA },
    borders: noBorders,
    shading: { type: ShadingType.CLEAR, fill: LIGHT_GRAY },
    margins: { top: 80, bottom: 80, left: 160, right: 160 },
    children,
  });
}

function makeRightCell(children) {
  return new TableCell({
    width: { size: rightColWidth, type: WidthType.DXA },
    borders: noBorders,
    shading: { type: ShadingType.CLEAR, fill: WHITE },
    margins: { top: 80, bottom: 80, left: 200, right: 160 },
    children,
  });
}

// Header row - name and contact info
const headerTable = new Table({
  width: { size: totalWidth, type: WidthType.DXA },
  columnWidths: [leftColWidth, rightColWidth],
  borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
  rows: [
    new TableRow({
      children: [
        // Left: name block
        new TableCell({
          width: { size: leftColWidth, type: WidthType.DXA },
          borders: noBorders,
          shading: { type: ShadingType.CLEAR, fill: LIGHT_GRAY },
          margins: { top: 200, bottom: 200, left: 160, right: 160 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              spacing: { before: 0, after: 0 },
              children: [new TextRun({ text: "Lukas", bold: true, size: 52, font: "Calibri", color: DARK_GRAY })]
            }),
            new Paragraph({
              spacing: { before: 0, after: 0 },
              children: [new TextRun({ text: "Fiala", bold: true, size: 52, font: "Calibri", color: DARK_GRAY })]
            }),
            new Paragraph({
              spacing: { before: 40, after: 0 },
              children: [new TextRun({ text: "Junior QA Engineer", size: 22, font: "Calibri", color: MED_GRAY })]
            }),
          ]
        }),
        // Right: contact info
        new TableCell({
          width: { size: rightColWidth, type: WidthType.DXA },
          borders: noBorders,
          shading: { type: ShadingType.CLEAR, fill: WHITE },
          margins: { top: 200, bottom: 200, left: 200, right: 160 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            infoLine("📞", "+30 727 884 983"),
            infoLine("✉", "Tabunikuo50@gmail.com"),
            infoLine("📍", "4910 Alounovat"),
            infoLine("🔗", "Github"),
            infoLine("🔗", "LinkedIn"),
          ]
        }),
      ]
    })
  ]
});

// Summary paragraph
const summaryPara = new Paragraph({
  spacing: { before: 100, after: 100 },
  children: [new TextRun({
    text: "Detail-oriented Junior QA Engineer with a strong foundation in manual, regression and AI testing. Hands-on experience in automated testing tools like Playwright and Selenium, with hands-on experience in defect tracking and cross-functional collaboration. Committed to delivering high-quality software.",
    size: 18, font: "Calibri", color: DARK_GRAY
  })]
});

// Work experience entries
const workExp = [
  ...jobEntry("Junior QA Engineer", "Insio Software, Prague", "", "October 2025", "Current", [
    "Execute manual and regression testing to ensure stable releases across multiple environments",
    "Design and maintain test cases, checklists, and bug reports",
    "Identify, document and track defects using Jira",
    "Collaborate with developers and the product team to clarify requirements",
    "Participate in regression and release testing",
  ]),
  ...jobEntry("Customer Support & Manual Tester", "Protel Systems, Prague", "", "September 2024", "July 2025", [
    "Provided tech/level support to customers via the ticketing system and email",
    "Performed manual testing of internal and customer-facing applications",
    "Reproduced reported issues and validated fixes",
    "Assisted with writing basic test scenarios and documentation",
  ]),
  ...jobEntry("Front Desk Receptionist", "Hotel Perto, Prague", "", "September 2023", "August 2024", [
    "Managed guest check-in/check-out and reservations",
    "Handled customer inquiries and resolved issues professionally",
    "Worked with hotel management systems and POS software",
  ]),
  ...jobEntry("Front Desk Receptionist", "Aquapalace Hotel, Prague", "", "June 2021", "August 2023", [
    "Delivered front-desk operations in a high-volume hotel environment",
    "Coordinated with housekeeping and management teams",
    "Ensured a high level of customer satisfaction",
  ]),
];

// Education
const education = [
  ...eduEntry(
    "Secondary School Diploma (Matura Equivalent)",
    "High School of Entrepreneurship, Prague",
    "September 2016",
    "June 2020",
    "Focus on economics, accounting, marketing, and the basics of business activity."
  )
];

// References
const references = [
  new Paragraph({
    spacing: { before: 60, after: 30 },
    children: [
      new TextRun({ text: "Josef Karamon – CTO at Insio  ", size: 18, font: "Calibri", color: DARK_GRAY }),
      new TextRun({ text: "josef.karamon@insio.cz", size: 18, font: "Calibri", color: BLUE }),
    ]
  }),
  new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [
      new TextRun({ text: "Hedvika Truneckova – CEO at Protel  ", size: 18, font: "Calibri", color: DARK_GRAY }),
      new TextRun({ text: "hedvika.truneckova@protelsystems.cz", size: 18, font: "Calibri", color: BLUE }),
    ]
  }),
];

// Languages
const languages = [
  skillItem("Czech – Native"),
  skillItem("English – C1"),
  skillItem("German – A2"),
];

// Interests
const interests = [
  skillItem("Computer Games"),
  skillItem("Team sport"),
  skillItem("Travels"),
];

// Build main two-column body table
const mainTable = new Table({
  width: { size: totalWidth, type: WidthType.DXA },
  columnWidths: [leftColWidth, rightColWidth],
  borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
  rows: [
    new TableRow({
      children: [
        makeLeftCell([
          sectionHeader("Skills"),
          ...allSkills.map(s => skillItem(s)),
          sectionHeader("Languages"),
          ...languages,
          sectionHeader("Interests"),
          ...interests,
        ]),
        makeRightCell([
          sectionHeader("Work experience"),
          ...workExp,
          sectionHeader("Education"),
          ...education,
          sectionHeader("References"),
          ...references,
        ]),
      ]
    })
  ]
});

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 260 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 600, right: 600, bottom: 600, left: 600 }
      }
    },
    children: [
      headerTable,
      new Paragraph({ spacing: { before: 60, after: 0 }, children: [new TextRun({ text: "", size: 18 })] }),
      summaryPara,
      new Paragraph({
        spacing: { before: 0, after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } },
        children: [new TextRun({ text: "", size: 4 })]
      }),
      mainTable,
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/Lukas_Fiala_CV.docx", buffer);
  console.log("Done!");
});