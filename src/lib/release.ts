// Single source of truth for the published release. Update this file (and
// only this file) for a new release; values are copied from the GitHub
// release API (size and sha256 "digest" of each asset).
//
// A requirement set to null is not shown on the site. Never put placeholder
// text here: `npm run check:copy` fails on bracketed placeholders.

const BASE = "https://github.com/Ayoub-EDAHLOULI/Rafeeq/releases/download/0.1.0";

export type ReleaseFile = {
  name: string;
  url: string;
  bytes: number;
  sha256: string;
};

export const RELEASE = {
  version: "0.1.0",
  pageUrl: "https://github.com/Ayoub-EDAHLOULI/Rafeeq/releases/tag/0.1.0",
  standard: {
    exe: {
      name: "Rafeeq_0.1.0_x64-setup.exe",
      url: `${BASE}/Rafeeq_0.1.0_x64-setup.exe`,
      bytes: 3059261,
      sha256: "b80df16bf132ef15597a531f41df740b6582c88724d46fefa3893aa80566b559",
    },
    msi: {
      name: "Rafeeq_0.1.0_x64_en-US.msi",
      url: `${BASE}/Rafeeq_0.1.0_x64_en-US.msi`,
      bytes: 4321280,
      sha256: "abf9e5dcc7c719d85324464cbfd33350a67a036281964298a3c340527975bf94",
    },
  },
  bundled: {
    exe: {
      name: "Rafeeq_0.1.0_x64_bundled-setup.exe",
      url: `${BASE}/Rafeeq_0.1.0_x64_bundled-setup.exe`,
      bytes: 482352960,
      sha256: "dbe9e70ec6d2c5aac4dca8414f2a47d435f516dfd337c07c9b02d03245ef8d30",
    },
    msi: {
      name: "Rafeeq_0.1.0_x64_en-US_bundled.msi",
      url: `${BASE}/Rafeeq_0.1.0_x64_en-US_bundled.msi`,
      bytes: 481878016,
      sha256: "dbdb978ff662fe5fb4188128da492aa99e63a0fb79a28e985ce9effb8f725135",
    },
  },
  requirements: {
    minWindows: "10" as string | null,
    // Hidden until tested on a real 8 GB machine.
    minRamGb: null as number | null,
  },
} as const;

// Sizes are shown the way Windows reports them (binary megabytes), rounded,
// with a localized unit ("~460 MB", "~460 Mo"). Western digits everywhere,
// including Arabic (decision D5). Arabic uses the long unit name, because the
// short form ("م.ب") is not widely recognized.
export function formatSize(bytes: number, locale: string): string {
  const value = Math.round(bytes / 2 ** 20);
  const formatted = new Intl.NumberFormat(`${locale}-u-nu-latn`, {
    style: "unit",
    unit: "megabyte",
    unitDisplay: locale === "ar" ? "long" : "short",
    maximumFractionDigits: 0,
  }).format(value);
  return `~${formatted}`;
}
