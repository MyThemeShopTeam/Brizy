import { styleColor } from "visual/utils/style2";

export function cssStyleColor({ v, device, state, prefix }) {
  const color = styleColor({ v, device, state, prefix });

  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleLabelColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "labelColor" });
}

