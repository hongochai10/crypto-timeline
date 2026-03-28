/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready in",
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        onlyCategories: ["performance"],
      },
    },
    assert: {
      assertions: {
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "max-potential-fid": ["error", { maxNumericValue: 100 }],
        "interactive": ["warn", { maxNumericValue: 3800 }],
        "speed-index": ["warn", { maxNumericValue: 3400 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
