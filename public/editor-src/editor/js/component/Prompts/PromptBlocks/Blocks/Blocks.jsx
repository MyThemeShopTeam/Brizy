import React, { Component } from "react";
import _ from "underscore";
import Scrollbars from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import SearchInput from "../common/SearchInput";
import DataFilter from "../common/DataFilter";
import ThumbnailGrid from "../common/ThumbnailGrid";
import { t } from "visual/utils/i18n";

let defaultFilter = {
  type: 0,
  category: "*",
  search: ""
};

class Blocks extends Component {
  static defaultProps = {
    showSidebar: true,
    showSearch: true,
    showType: true, // dark | light
    showCategories: true,
    loading: false,
    kits: [],
    styles: [],
    types: [],
    categories: [],
    blocks: [],
    HeaderSlotLeft: _.noop,
    HeaderSlotRight: _.noop,
    onAddBlocks: _.noop,
    onClose: _.noop,
    onChange: _.noop,
    onChangeKit: _.noop
  };

  getData(kits, kitId) {
    const { categoriesFilter } = this.props;
    const kit = kits.find(({ id }) => id === kitId);
    const { categories, blocks, styles, types } = kit;

    // categories
    const categoriesData = categoriesFilter([
      { id: "*", title: t("All Categories") },
      ...categories
    ]);

    // filter blocks
    const categoryIds = new Map(categoriesData.map(cat => [cat.id, true]));
    const blocksData = blocks.filter(block =>
      block.cat.some(cat => categoryIds.get(cat))
    );

    return {
      styles,
      types,
      categories: categoriesData,
      blocks: blocksData
    };
  }

  handleThumbnailAdd = thumbnailData => {
    this.props.onChange(thumbnailData);
  };

  handleImportKit = kitId => {
    this.props.onChangeKit(kitId);
  };

  renderLoading() {
    const { showSidebar, showSearch, HeaderSlotLeft } = this.props;

    return (
      <>
        {showSearch && (
          <HeaderSlotLeft>
            <SearchInput className="brz-ed-popup-two-header__search" />
          </HeaderSlotLeft>
        )}
        {showSidebar && (
          <div className="brz-ed-popup-two-body__sidebar">
            <div className="brz-ed-popup-two-sidebar-body" />
          </div>
        )}
        <div className="brz-ed-popup-two-body__content brz-ed-popup-two-body__content--loading">
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      </>
    );
  }

  render() {
    const {
      loading,
      kits,
      blocks,
      types,
      categories,
      selectedKit,
      showSearch,
      showSidebar,
      showType,
      showCategories,
      HeaderSlotLeft
    } = this.props;

    if (loading) {
      return this.renderLoading();
    }

    const filterFn = (item, currentFilter) => {
      const typeMatch = currentFilter.type === item.type;

      const categoryMatch =
        currentFilter.category === "*" ||
        item.cat.includes(Number(currentFilter.category));

      const searchMatch =
        currentFilter.search === "" ||
        new RegExp(
          currentFilter.search.replace(/[.*+?^${}()|[\]\\]/g, ""),
          "i"
        ).test(item.keywords);

      return typeMatch && categoryMatch && searchMatch;
    };

    const countersColorBlocks = {};
    const countersSectionBlocks = {};
    const showImportKit =
      kits.filter(({ id }) => id !== selectedKit).length > 0;

    return (
      <DataFilter
        data={blocks}
        filterFn={filterFn}
        defaultFilter={defaultFilter}
      >
        {(filteredThumbnails, currentFilter, setFilter) => {
          defaultFilter.type = currentFilter.type;

          if (!countersColorBlocks[currentFilter.type]) {
            for (let i = 0; i < blocks.length; i++) {
              const blockType = blocks[i].type; // dark | light
              const blockCategories = blocks[i].cat; // header | footer etc.

              if (countersColorBlocks[blockType] === undefined) {
                countersColorBlocks[blockType] = 1;
              } else {
                countersColorBlocks[blockType]++;
              }

              if (currentFilter.type === blockType) {
                countersSectionBlocks["*"] = countersColorBlocks[blockType];

                for (let j = 0; j < blockCategories.length; j++) {
                  const category = blockCategories[j];

                  if (countersSectionBlocks[category] === undefined) {
                    countersSectionBlocks[category] = 1;
                  } else {
                    countersSectionBlocks[category]++;
                  }
                }
              }
            }
          }

          return (
            <>
              {showSearch && (
                <HeaderSlotLeft>
                  <SearchInput
                    className="brz-ed-popup-two-header__search"
                    value={currentFilter.search}
                    onChange={value => setFilter({ search: value })}
                  />
                </HeaderSlotLeft>
              )}

              {showSidebar && (
                <Sidebar>
                  {showImportKit && (
                    <SidebarOption title="BLOCKS">
                      <Select
                        defaultValue={selectedKit}
                        className="brz-control__select--dark brz-control__select--full-width"
                        maxItems="6"
                        itemHeight="30"
                        onChange={this.handleImportKit}
                      >
                        {kits.map(({ id, name }, index) => (
                          <SelectItem key={index} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </Select>
                    </SidebarOption>
                  )}
                  {showType && (
                    <SidebarOption title="STYLES">
                      <SidebarList
                        lists={types}
                        counters={countersColorBlocks}
                        value={currentFilter.type}
                        onChange={value => setFilter({ type: value })}
                      />
                    </SidebarOption>
                  )}
                  {showCategories && (
                    <SidebarOption title="CATEGORIES">
                      <SidebarList
                        lists={categories}
                        counters={countersSectionBlocks}
                        value={currentFilter.category}
                        onChange={value => setFilter({ category: value })}
                      />
                    </SidebarOption>
                  )}
                </Sidebar>
              )}

              <div className="brz-ed-popup-two-body__content">
                <Scrollbars>
                  {filteredThumbnails.length > 0 ? (
                    <ThumbnailGrid
                      data={filteredThumbnails}
                      onThumbnailAdd={this.handleThumbnailAdd}
                    />
                  ) : (
                    <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
                      <p className="brz-ed-popup-two-blocks__grid-clear-text">
                        {t("Nothing here, please refine your search.")}
                      </p>
                    </div>
                  )}
                </Scrollbars>
              </div>
            </>
          );
        }}
      </DataFilter>
    );
  }
}

export default Blocks;
