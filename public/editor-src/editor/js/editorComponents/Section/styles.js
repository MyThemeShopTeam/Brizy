import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleZIndex"],
      interval: ["cssStyleVisibleMode|||preview"]
    },
    ".brz &&:hover .brz-container__wrap": {
      interval: ["cssStyleVisibleMode|||editor"]
    },
    ".brz &&:hover .brz-section__content": {
      standart: ["cssStyleSectionSliderHeight"]
    },
    ".brz && .brz-slick-slider__dots:hover": {
      standart: ["cssStyleSectionColorDots"]
    },
    ".brz && .brz-slick-slider__arrow:hover": {
      standart: ["cssStyleSectionColorArrows"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
