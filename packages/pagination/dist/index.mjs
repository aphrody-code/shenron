// src/pagination/builder.ts
import {
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  StringSelectMenuBuilder
} from "discord.js";

// src/utils/paginate.ts
var DEFAULT_CURRENT_PAGE = 0;
var DEFAULT_PAGE_SIZE = 10;
var DEFAULT_MAX_PAGES = 10;
var MIN_PAGE_NUMBER = 0;
var MIN_TOTAL_ITEMS = 0;
var MIN_PAGE_SIZE = 1;
var MIN_MAX_PAGES = 1;
function validatePaginationInputs(totalItems, currentPage, pageSize, maxPages) {
  if (!Number.isInteger(totalItems) || totalItems < MIN_TOTAL_ITEMS) {
    throw new Error(
      `Total items must be a non-negative integer, received: ${totalItems.toString()}`
    );
  }
  if (!Number.isInteger(currentPage) || currentPage < MIN_PAGE_NUMBER) {
    throw new Error(
      `Current page must be a non-negative integer, received: ${currentPage.toString()}`
    );
  }
  if (!Number.isInteger(pageSize) || pageSize < MIN_PAGE_SIZE) {
    throw new Error(
      `Page size must be a positive integer, received: ${pageSize.toString()}`
    );
  }
  if (!Number.isInteger(maxPages) || maxPages < MIN_MAX_PAGES) {
    throw new Error(
      `Max pages must be a positive integer, received: ${maxPages.toString()}`
    );
  }
}
function calculateTotalPages(totalItems, pageSize) {
  return Math.ceil(totalItems / pageSize);
}
function normalizeCurrentPage(currentPage, totalPages) {
  if (totalPages === 0) return 0;
  return Math.max(MIN_PAGE_NUMBER, Math.min(currentPage, totalPages - 1));
}
function calculatePageRange(currentPage, totalPages, maxPages) {
  if (totalPages <= maxPages) {
    return { startPage: 0, endPage: totalPages - 1 };
  }
  const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
  const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
  if (currentPage <= maxPagesBeforeCurrentPage) {
    return { startPage: 0, endPage: maxPages - 1 };
  }
  if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
    return {
      startPage: totalPages - maxPages,
      endPage: totalPages - 1
    };
  }
  return {
    startPage: currentPage - maxPagesBeforeCurrentPage,
    endPage: currentPage + maxPagesAfterCurrentPage
  };
}
function calculateItemIndexes(currentPage, pageSize, totalItems) {
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
  return { startIndex, endIndex };
}
function generatePageNumbers(startPage, endPage) {
  const pageCount = endPage - startPage + 1;
  return Array.from({ length: pageCount }, (_, index) => startPage + index);
}
function createPagination(config) {
  const {
    totalItems,
    currentPage = DEFAULT_CURRENT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    maxPages = DEFAULT_MAX_PAGES
  } = config;
  try {
    validatePaginationInputs(totalItems, currentPage, pageSize, maxPages);
    const totalPages = calculateTotalPages(totalItems, pageSize);
    const normalizedCurrentPage = normalizeCurrentPage(currentPage, totalPages);
    const { startPage, endPage } = calculatePageRange(
      normalizedCurrentPage,
      totalPages,
      maxPages
    );
    const { startIndex, endIndex } = calculateItemIndexes(
      normalizedCurrentPage,
      pageSize,
      totalItems
    );
    const pages = generatePageNumbers(startPage, endPage);
    return {
      currentPage: normalizedCurrentPage,
      endIndex,
      endPage,
      pageSize,
      pages,
      startIndex,
      startPage,
      totalItems,
      totalPages
    };
  } catch (error) {
    throw new Error(
      `Pagination creation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// src/pagination/builder.ts
var PaginationBuilder = class {
  item;
  currentPage;
  perPage;
  skipAmount;
  maxPage;
  config;
  constructor(_item, _currentPage, _maxPage, _config) {
    this.item = this.prepareMessage(_item);
    this.currentPage = _currentPage;
    this.maxPage = _maxPage;
    this.config = _config;
    this.perPage = _config?.itemsPerPage ?? defaultPerPageItem;
    this.skipAmount = _config?.buttons?.skipAmount ?? defaultPerPageItem;
    this.validateInputs();
  }
  validateInputs() {
    if (this.currentPage < 0 || this.currentPage >= this.maxPage) {
      throw new Error(
        `Page ${this.currentPage.toString()} is out of bounds (0-${String(this.maxPage - 1)})`
      );
    }
    if (this.maxPage <= 0) {
      throw new Error("Maximum pages must be greater than 0");
    }
    if (this.config?.buttons?.disabled && this.config.selectMenu?.disabled) {
      throw new Error(
        "Both navigation buttons and the select menu cannot be disabled at the same time"
      );
    }
  }
  prepareMessage(item) {
    return {
      ...item,
      attachments: item.attachments ?? [],
      components: item.components ?? [],
      embeds: item.embeds ?? [],
      files: item.files ?? []
    };
  }
  /**
   * Get the display text for a page
   */
  getPageText(pageNumber) {
    if (Array.isArray(this.config?.selectMenu?.pageText)) {
      return this.config.selectMenu.pageText[pageNumber] ?? "Page {page}";
    }
    return this.config?.selectMenu?.pageText ?? "Page {page}";
  }
  /**
   * Create page-specific options for select menu
   */
  createPageOptions(paginator) {
    const options = paginator.pages.map((pageNumber) => {
      const pageText = this.getPageText(pageNumber);
      return {
        label: pageText.replace(
          "{page}",
          (pageNumber + 1).toString().padStart(2, "0")
        ),
        value: pageNumber.toString()
      };
    });
    if (paginator.currentPage !== 0) {
      options.unshift({
        label: this.config?.selectMenu?.labels?.start ?? "First page",
        value: (-1) /* Start */.toString()
      });
    }
    if (paginator.currentPage !== paginator.totalPages - 1) {
      options.push({
        label: this.config?.selectMenu?.labels?.end ?? "Last page",
        value: (-2) /* End */.toString()
      });
    }
    return options;
  }
  calculateButtonStates() {
    return {
      canGoPrevious: this.currentPage > 0,
      canSkipBackward: this.currentPage > 0,
      canSkipForward: this.currentPage < this.maxPage - 1,
      canGoNext: this.currentPage < this.maxPage - 1
    };
  }
  createNavigationButtons() {
    const states = this.calculateButtonStates();
    const buttonConfigs = [
      {
        key: "previous",
        defaults: {
          emoji: "\u25C0\uFE0F",
          id: defaultIds.buttons.previous,
          label: "Previous",
          style: ButtonStyle.Secondary
        },
        disabled: !states.canGoPrevious,
        enabled: true
      },
      {
        key: "backward",
        defaults: {
          emoji: "\u23EA",
          id: defaultIds.buttons.backward,
          label: `-${String(Math.min(this.currentPage, this.skipAmount))}`,
          style: ButtonStyle.Primary
        },
        disabled: !states.canSkipBackward,
        enabled: true
      },
      {
        key: "forward",
        defaults: {
          emoji: "\u23E9",
          id: defaultIds.buttons.forward,
          label: `+${String(Math.min(this.maxPage - (this.currentPage + 1), this.skipAmount))}`,
          style: ButtonStyle.Primary
        },
        disabled: !states.canSkipForward,
        enabled: true
      },
      {
        key: "next",
        defaults: {
          emoji: "\u25B6\uFE0F",
          id: defaultIds.buttons.next,
          label: "Next",
          style: ButtonStyle.Secondary
        },
        disabled: !states.canGoNext,
        enabled: true
      },
      {
        key: "exit",
        defaults: {
          emoji: "\u2694\uFE0F",
          id: defaultIds.buttons.exit,
          label: "Stop",
          style: ButtonStyle.Danger
        },
        disabled: false,
        enabled: false
      }
    ];
    const buttons = [];
    for (const config of buttonConfigs) {
      const userConfig = this.config?.buttons?.[config.key];
      const isEnabled = userConfig?.enabled ?? config.enabled;
      if (isEnabled) {
        buttons.push(this.createButton(config));
      }
    }
    return buttons;
  }
  createButton(config) {
    const userConfig = this.config?.buttons?.[config.key];
    const button = new ButtonBuilder().setCustomId(userConfig?.id ?? config.defaults.id).setStyle(userConfig?.style ?? config.defaults.style).setDisabled(config.disabled);
    const label = userConfig?.label ?? config.defaults.label;
    if (label) {
      button.setLabel(label);
    }
    const emoji = userConfig?.emoji ?? config.defaults.emoji;
    if (emoji) {
      button.setEmoji(emoji);
    }
    if (!label && !emoji) {
      throw Error("Pagination buttons must include either an emoji or a label");
    }
    return button;
  }
  getBaseItem() {
    return this.item;
  }
  getPaginatedItem() {
    const paginator = createPagination({
      currentPage: this.currentPage,
      totalItems: this.maxPage,
      pageSize: 1,
      maxPages: this.perPage
    });
    const defaultFormat = "Currently viewing #{start} - #{end} of #{total}";
    const format = this.config?.selectMenu?.rangePlaceholderFormat ?? defaultFormat;
    const rangePlaceholder = format.replace("{start}", (paginator.startPage + 1).toString()).replace("{end}", (paginator.endPage + 1).toString()).replace("{total}", paginator.totalItems.toString());
    const options = this.createPageOptions(paginator);
    const menu = new StringSelectMenuBuilder().setCustomId(this.config?.selectMenu?.menuId ?? defaultIds.menu).setPlaceholder(rangePlaceholder).setOptions(options);
    const buttons = this.createNavigationButtons();
    const messageComponents = this.item.components ?? [];
    const components = [...messageComponents];
    if (!this.config?.selectMenu?.disabled) {
      components.push({
        components: [menu],
        type: ComponentType.ActionRow
      });
    }
    if (!this.config?.buttons?.disabled) {
      components.push({
        components: buttons,
        type: ComponentType.ActionRow
      });
    }
    return { ...this.item, components };
  }
};

// src/pagination/pagination.ts
import {
  ChannelType,
  ChatInputCommandInteraction,
  CommandInteraction,
  ComponentType as ComponentType2,
  ContextMenuCommandInteraction,
  Message,
  MessageComponentInteraction
} from "discord.js";
var Pagination = class {
  constructor(sendTo, pageData, config) {
    this.sendTo = sendTo;
    this.config = config;
    this._currentPage = config?.initialPage ?? 0;
    this.setPages(pageData);
    this.validateConfiguration();
  }
  sendTo;
  config;
  //#region Properties & Constructor
  _pages = [];
  _maxLength = 0;
  _currentPage = 0;
  _collectors;
  _message;
  _isSent = false;
  _isFollowUp = false;
  get message() {
    if (!this._message) {
      throw new Error(
        "Pagination has not sent yet. Please send pagination to retrieve message"
      );
    }
    return this._message;
  }
  get isSent() {
    return this._isSent;
  }
  get currentPage() {
    return this._currentPage;
  }
  get maxLength() {
    return this._maxLength;
  }
  get pages() {
    return this._pages;
  }
  setCurrentPage(page) {
    if (page < 0 || page >= this._maxLength) {
      throw new Error(
        `Page ${page.toString()} is out of bounds. Must be between 0 and ${(this._maxLength - 1).toString()}`
      );
    }
    this._currentPage = page;
  }
  setMaxLength(length) {
    if (length <= 0) {
      throw new Error("Maximum length must be greater than 0");
    }
    this._maxLength = length;
    if (this._currentPage >= this._maxLength) {
      this._currentPage = 0;
    }
  }
  setPages(pages) {
    this._pages = pages;
    this._maxLength = Array.isArray(pages) ? pages.length : pages.maxLength;
    if (this._currentPage >= this._maxLength) {
      this._currentPage = 0;
    }
  }
  //#endregion
  //#region Configuration & Validation
  /**
   * Validate configuration and throw descriptive errors
   */
  validateConfiguration() {
    if (this.config?.ephemeral && this.config.buttons?.exit?.enabled) {
      throw new Error("Ephemeral pagination does not support exit mode");
    }
    if (this.maxLength <= 0) {
      throw new Error("Pagination must have at least one page");
    }
    if (this.currentPage < 0 || this.currentPage >= this.maxLength) {
      throw new Error(
        `Initial page ${this.currentPage.toString()} is out of bounds. Must be between 0 and ${(this.maxLength - 1).toString()}`
      );
    }
    this.validateButtonOptions();
  }
  /**
   * Validate button configuration
   */
  validateButtonOptions() {
    const ids = [
      this.getButtonId("previous"),
      this.getButtonId("backward"),
      this.getButtonId("forward"),
      this.getButtonId("next"),
      this.getButtonId("exit")
    ];
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Duplicate button IDs found: ${duplicates.join(", ")}`);
    }
  }
  //#endregion
  //#region Utility & Helper Methods
  /**
   * Log debug messages with consistent formatting
   */
  debug(message) {
    if (this.config?.debug) {
      console.log(`[Pagination] ${message}`);
    }
  }
  /**
   * Handle update errors gracefully
   */
  unableToUpdate(error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    this.debug(`Unable to update pagination: ${errorMessage}`);
  }
  /**
   * Get skip amount
   */
  getSkipAmount() {
    return this.config?.buttons?.skipAmount ?? defaultPerPageItem;
  }
  /**
   * Get button ID with fallback to default
   */
  getButtonId(buttonType) {
    return this.config?.buttons?.[buttonType]?.id ?? defaultIds.buttons[buttonType];
  }
  /**
   * Get menu ID with fallback to default
   */
  getMenuId() {
    return this.config?.selectMenu?.menuId ?? defaultIds.menu;
  }
  /**
   * Get time with fallback to default
   */
  getTime() {
    return this.config?.time ?? defaultTime;
  }
  //#endregion
  //#region Public API - Core Functionality
  /**
   * Get page
   */
  getPage = async (page) => {
    if (page < 0 || page >= this.maxLength) {
      throw new Error(
        `Page ${String(page)} is out of bounds (0-${String(this.maxLength - 1)})`
      );
    }
    const item = Array.isArray(this.pages) ? structuredClone(this.pages[page]) : await this.pages.resolver(page, this);
    if (!item) {
      throw new Error(`No content found for page ${page.toString()}`);
    }
    const pagination = new PaginationBuilder(
      item,
      page,
      this.maxLength,
      this.config
    );
    return pagination;
  };
  /**
   * Send pagination
   * @returns
   */
  async send() {
    if (this._isSent) {
      throw new Error(
        "Pagination has already been sent. Create a new instance to send again."
      );
    }
    try {
      const page = await this.getPage(this.currentPage);
      const message = await this.sendMessage(page.getPaginatedItem());
      const collectors = this.createCollector(message);
      this._collectors = collectors;
      this._message = message;
      this._isSent = true;
      this.debug(
        `Pagination sent successfully with ${this.maxLength.toString()} pages`
      );
      return { collectors, message };
    } catch (error) {
      this.debug(`Failed to send pagination: ${String(error)}`);
      throw new Error(
        `Failed to send pagination: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
  /**
   * Stop the pagination collector
   */
  stop() {
    if (this._collectors) {
      if (!this._collectors.buttonCollector.ended) {
        this._collectors.buttonCollector.stop();
      }
      if (!this._collectors.menuCollector.ended) {
        this._collectors.menuCollector.stop();
      }
      this.debug("Pagination stopped manually");
    }
  }
  //#endregion
  //#region Public API - Navigation
  /**
   * Navigate to a specific page
   */
  navigateToPage(page) {
    if (page < 0 || page >= this.maxLength) {
      this.debug(
        `Cannot navigate to page ${page.toString()}: out of bounds (0-${String(this.maxLength - 1)})`
      );
      return false;
    }
    if (page === this.currentPage) {
      this.debug(`Already on page ${page.toString()}`);
      return false;
    }
    this.setCurrentPage(page);
    this.debug(`Navigated to page ${page.toString()}`);
    return true;
  }
  /**
   * Navigate to next page
   */
  navigateNext() {
    if (this.currentPage >= this.maxLength - 1) {
      this.debug("Cannot navigate next: already on last page");
      return false;
    }
    this.setCurrentPage(this.currentPage + 1);
    this.debug(`Navigated to next page: ${this.currentPage.toString()}`);
    return true;
  }
  /**
   * Navigate to previous page
   */
  navigatePrevious() {
    if (this.currentPage <= 0) {
      this.debug("Cannot navigate previous: already on first page");
      return false;
    }
    this.setCurrentPage(this.currentPage - 1);
    this.debug(`Navigated to previous page: ${this.currentPage.toString()}`);
    return true;
  }
  //#endregion
  //#region Public API - State & Utilities
  /**
   * Check if pagination can navigate to next page
   */
  canNavigateNext() {
    return this.currentPage < this.maxLength - 1;
  }
  /**
   * Check if pagination can navigate to previous page
   */
  canNavigatePrevious() {
    return this.currentPage > 0;
  }
  /**
   * Get current page info
   */
  getPageInfo() {
    return {
      currentPage: this.currentPage,
      totalPages: this.maxLength,
      canNext: this.canNavigateNext(),
      canPrevious: this.canNavigatePrevious(),
      isFirst: this.currentPage === 0,
      isLast: this.currentPage === this.maxLength - 1
    };
  }
  /**
   * Navigate to first page
   */
  navigateToStart() {
    if (this.currentPage === 0) {
      this.debug("Already on first page");
      return false;
    }
    this.setCurrentPage(0);
    this.debug("Navigated to start page");
    return true;
  }
  /**
   * Navigate to last page
   */
  navigateToEnd() {
    const lastPage = this.maxLength - 1;
    if (this.currentPage === lastPage) {
      this.debug("Already on last page");
      return false;
    }
    this.setCurrentPage(lastPage);
    this.debug("Navigated to end page");
    return true;
  }
  //#endregion
  //#region Private - Message Handling
  /**
   * Handle exit
   */
  async handleExit(interaction) {
    try {
      await interaction.deferUpdate();
      const page = await this.getPage(this.currentPage);
      await interaction.editReply(page.getBaseItem());
      this.stop();
    } catch (error) {
      this.unableToUpdate(error);
    }
  }
  /**
   * Update the pagination message with current page
   */
  async updatePaginationMessage(interaction) {
    try {
      await interaction.deferUpdate();
      const page = await this.getPage(this.currentPage);
      await interaction.editReply(page.getPaginatedItem());
    } catch (error) {
      this.unableToUpdate(error);
    }
  }
  /**
   * Send message via interaction (reply or followUp)
   */
  async sendInteractionMessage(message) {
    const interaction = this.sendTo;
    if (interaction.deferred || interaction.replied) {
      this._isFollowUp = true;
    }
    const messageOptions = {
      ...message,
      ephemeral: this.config?.ephemeral
    };
    if (this._isFollowUp) {
      const reply = await interaction.followUp({
        ...messageOptions,
        fetchReply: true
      });
      return reply;
    } else {
      const response = await interaction.reply({
        ...messageOptions,
        withResponse: true
      });
      const message2 = response.resource?.message;
      if (!message2) {
        throw new Error(
          "Missing Intent: GUILD_MESSAGES\nWithout guild message intent, pagination does not work. Consider adding GUILD_MESSAGES as an intent\nRead more at https://discordx.js.org/docs/faq/Errors/Pagination#missing-intent-guild_messages"
        );
      }
      return message2;
    }
  }
  /**
   * Send message based on sendTo type
   */
  async sendMessage(message) {
    if (this.sendTo instanceof Message) {
      return await this.sendTo.reply(message);
    }
    if (this.sendTo instanceof CommandInteraction || this.sendTo instanceof MessageComponentInteraction || this.sendTo instanceof ContextMenuCommandInteraction) {
      return await this.sendInteractionMessage(message);
    }
    if (this.sendTo.type === ChannelType.GuildStageVoice) {
      throw new Error("Pagination not supported with guild stage channel");
    }
    return await this.sendTo.send(message);
  }
  //#endregion
  //#region Private - Collector Management
  /**
   * Create and configure the collectors
   */
  createCollector(message) {
    const buttonCollector = message.createMessageComponentCollector({
      ...this.config,
      componentType: ComponentType2.Button,
      time: this.getTime()
    });
    const menuCollector = message.createMessageComponentCollector({
      ...this.config,
      componentType: ComponentType2.StringSelect,
      time: this.getTime()
    });
    this.setupCollectorEvents({ buttonCollector, menuCollector });
    return { buttonCollector, menuCollector };
  }
  /**
   * Setup collector event handlers
   */
  setupCollectorEvents({
    buttonCollector,
    menuCollector
  }) {
    const resetCollectorTimers = () => {
      const timerOptions = {
        idle: this.config?.idle,
        time: this.getTime()
      };
      buttonCollector.resetTimer(timerOptions);
      menuCollector.resetTimer(timerOptions);
    };
    buttonCollector.on("collect", async (interaction) => {
      const shouldContinue = this.handleButtonInteraction(interaction);
      if (shouldContinue) {
        await this.updatePaginationMessage(interaction);
        resetCollectorTimers();
      }
    });
    menuCollector.on("collect", async (interaction) => {
      const shouldContinue = this.handleSelectMenuInteraction(interaction);
      if (shouldContinue) {
        await this.updatePaginationMessage(interaction);
        resetCollectorTimers();
      }
    });
    buttonCollector.on("end", () => {
      menuCollector.stop();
      void this.handleCollectorEnd();
    });
    menuCollector.on("end", () => {
      buttonCollector.stop();
      void this.handleCollectorEnd();
    });
  }
  /**
   * Handle button interaction
   */
  handleButtonInteraction(interaction) {
    const customId = interaction.customId;
    if (customId === defaultIds.buttons.exit) {
      void this.handleExit(interaction);
      return false;
    } else if (customId === defaultIds.buttons.previous) {
      return this.navigatePrevious();
    } else if (customId === defaultIds.buttons.next) {
      return this.navigateNext();
    } else if (customId === defaultIds.buttons.backward) {
      return this.navigateToPage(
        Math.max(0, this.currentPage - this.getSkipAmount())
      );
    } else if (customId === defaultIds.buttons.forward) {
      return this.navigateToPage(
        Math.min(this.maxLength - 1, this.currentPage + this.getSkipAmount())
      );
    }
    return false;
  }
  /**
   * Handle select menu interaction
   */
  handleSelectMenuInteraction(interaction) {
    if (interaction.customId !== this.getMenuId()) {
      return false;
    }
    const selectedValue = Number(interaction.values[0] ?? 0);
    if (selectedValue === -1 /* Start */) {
      return this.navigateToStart();
    } else if (selectedValue === -2 /* End */) {
      return this.navigateToEnd();
    } else {
      return this.navigateToPage(selectedValue);
    }
  }
  /**
   * Handle collector end event
   */
  async handleCollectorEnd() {
    if (!this._message) return;
    try {
      const page = await this.getPage(this.currentPage);
      if (this.message.editable) {
        if (this.config?.ephemeral && this.sendTo instanceof ChatInputCommandInteraction && !this._isFollowUp) {
          await this.sendTo.editReply(page.getBaseItem());
        } else {
          await this.message.edit(page.getBaseItem());
        }
      }
      if (this.config?.onTimeout) {
        this.config.onTimeout(this.currentPage, this.message);
      }
    } catch (error) {
      this.unableToUpdate(error);
    }
  }
  //#endregion
};

// src/pagination/resolver.ts
var PaginationResolver = class {
  constructor(resolver, maxLength) {
    this.resolver = resolver;
    this.maxLength = maxLength;
  }
  resolver;
  maxLength;
};

// src/pagination/types.ts
var defaultTime = 3e5;
var defaultPerPageItem = 10;
var prefixId = "discordx@pagination@";
var defaultIds = {
  buttons: {
    previous: `${prefixId}previous`,
    backward: `${prefixId}backward`,
    forward: `${prefixId}forward`,
    next: `${prefixId}next`,
    exit: `${prefixId}exit`
  },
  menu: `${prefixId}menu`
};
var SelectMenuPageId = /* @__PURE__ */ ((SelectMenuPageId2) => {
  SelectMenuPageId2[SelectMenuPageId2["Start"] = -1] = "Start";
  SelectMenuPageId2[SelectMenuPageId2["End"] = -2] = "End";
  return SelectMenuPageId2;
})(SelectMenuPageId || {});
export {
  Pagination,
  PaginationBuilder,
  PaginationResolver,
  SelectMenuPageId,
  createPagination,
  defaultIds,
  defaultPerPageItem,
  defaultTime
};
