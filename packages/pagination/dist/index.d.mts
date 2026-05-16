import { Message, MessageCollectorOptionsParams, MessageComponentType, ComponentEmojiResolvable, ButtonStyle, BaseMessageOptions, Attachment, MessageEditAttachmentData, CommandInteraction, MessageComponentInteraction, ContextMenuCommandInteraction, TextBasedChannel, PartialGroupDMChannel, InteractionCollector, ButtonInteraction, StringSelectMenuInteraction } from 'discord.js';

declare class PaginationBuilder {
    private readonly item;
    private readonly currentPage;
    private readonly perPage;
    private readonly skipAmount;
    private readonly maxPage;
    private readonly config?;
    constructor(_item: PaginationItem, _currentPage: number, _maxPage: number, _config?: PaginationOptions);
    private validateInputs;
    private prepareMessage;
    /**
     * Get the display text for a page
     */
    private getPageText;
    /**
     * Create page-specific options for select menu
     */
    private createPageOptions;
    private calculateButtonStates;
    private createNavigationButtons;
    private createButton;
    getBaseItem(): PaginationItem;
    getPaginatedItem(): PaginationItem;
}

declare class Pagination<T extends PaginationResolver = PaginationResolver> {
    private sendTo;
    private config?;
    private _pages;
    private _maxLength;
    private _currentPage;
    private _collectors?;
    private _message?;
    private _isSent;
    private _isFollowUp;
    get message(): Message;
    get isSent(): boolean;
    get currentPage(): number;
    get maxLength(): number;
    get pages(): PaginationItem[] | T;
    setCurrentPage(page: number): void;
    setMaxLength(length: number): void;
    setPages(pages: PaginationItem[] | T): void;
    constructor(sendTo: PaginationSendTo, pageData: PaginationItem[] | T, config?: PaginationOptions | undefined);
    /**
     * Validate configuration and throw descriptive errors
     */
    private validateConfiguration;
    /**
     * Validate button configuration
     */
    private validateButtonOptions;
    /**
     * Log debug messages with consistent formatting
     */
    private debug;
    /**
     * Handle update errors gracefully
     */
    private unableToUpdate;
    /**
     * Get skip amount
     */
    private getSkipAmount;
    /**
     * Get button ID with fallback to default
     */
    private getButtonId;
    /**
     * Get menu ID with fallback to default
     */
    private getMenuId;
    /**
     * Get time with fallback to default
     */
    private getTime;
    /**
     * Get page
     */
    getPage: (page: number) => Promise<PaginationBuilder>;
    /**
     * Send pagination
     * @returns
     */
    send(): Promise<{
        collectors: PaginationCollectors;
        message: Message;
    }>;
    /**
     * Stop the pagination collector
     */
    stop(): void;
    /**
     * Navigate to a specific page
     */
    navigateToPage(page: number): boolean;
    /**
     * Navigate to next page
     */
    navigateNext(): boolean;
    /**
     * Navigate to previous page
     */
    navigatePrevious(): boolean;
    /**
     * Check if pagination can navigate to next page
     */
    canNavigateNext(): boolean;
    /**
     * Check if pagination can navigate to previous page
     */
    canNavigatePrevious(): boolean;
    /**
     * Get current page info
     */
    getPageInfo(): {
        currentPage: number;
        totalPages: number;
        canNext: boolean;
        canPrevious: boolean;
        isFirst: boolean;
        isLast: boolean;
    };
    /**
     * Navigate to first page
     */
    navigateToStart(): boolean;
    /**
     * Navigate to last page
     */
    navigateToEnd(): boolean;
    /**
     * Handle exit
     */
    private handleExit;
    /**
     * Update the pagination message with current page
     */
    private updatePaginationMessage;
    /**
     * Send message via interaction (reply or followUp)
     */
    private sendInteractionMessage;
    /**
     * Send message based on sendTo type
     */
    private sendMessage;
    /**
     * Create and configure the collectors
     */
    private createCollector;
    /**
     * Setup collector event handlers
     */
    private setupCollectorEvents;
    /**
     * Handle button interaction
     */
    private handleButtonInteraction;
    /**
     * Handle select menu interaction
     */
    private handleSelectMenuInteraction;
    /**
     * Handle collector end event
     */
    private handleCollectorEnd;
}

type Resolver = (page: number, pagination: Pagination) => PaginationItem | Promise<PaginationItem>;
declare class PaginationResolver<T extends Resolver = Resolver> {
    resolver: T;
    maxLength: number;
    constructor(resolver: T, maxLength: number);
}

declare const defaultTime = 300000;
declare const defaultPerPageItem = 10;
declare const defaultIds: {
    buttons: {
        previous: string;
        backward: string;
        forward: string;
        next: string;
        exit: string;
    };
    menu: string;
};
interface PaginationItem extends BaseMessageOptions {
    attachments?: (Attachment | MessageEditAttachmentData)[];
}
type PaginationInteractions = CommandInteraction | MessageComponentInteraction | ContextMenuCommandInteraction;
type PaginationSendTo = PaginationInteractions | Message | Exclude<TextBasedChannel, PartialGroupDMChannel>;
declare enum SelectMenuPageId {
    Start = -1,
    End = -2
}
interface BasicPaginationOptions extends MessageCollectorOptionsParams<MessageComponentType> {
    /**
     * Debug log
     */
    debug?: boolean;
    /**
     * Set ephemeral response
     */
    ephemeral?: boolean;
    /**
     * Initial page (default: 0)
     */
    initialPage?: number;
    /**
     * Number of items shown per page in select menu
     */
    itemsPerPage?: number;
    /**
     * Pagination timeout callback
     */
    onTimeout?: (page: number, message: Message) => void;
}
interface ButtonOptions {
    /**
     * Show button in row
     */
    enabled?: boolean;
    /**
     * Button emoji
     */
    emoji?: ComponentEmojiResolvable | null;
    /**
     * Button id
     */
    id?: string;
    /**
     * Button label
     */
    label?: string | null;
    /**
     * Button style
     */
    style?: ButtonStyle;
}
interface NavigationButtonOptions {
    /**
     * Whether to show navigation buttons (e.g., next, previous, skip) in the pagination row.
     */
    disabled?: boolean;
    /**
     * Previous button options
     */
    previous?: ButtonOptions;
    /**
     * Backward button options (-10)
     */
    backward?: ButtonOptions;
    /**
     * Forward button options (+10)
     */
    forward?: ButtonOptions;
    /**
     * Next button options
     */
    next?: ButtonOptions;
    /**
     * Exit button options
     */
    exit?: ButtonOptions;
    /**
     * Number of pages to skip with skip buttons (default: 10)
     */
    skipAmount?: number;
}
interface SelectMenuOptions {
    /**
     * Whether to show select menu in the pagination row.
     */
    disabled?: boolean;
    /**
     * Various labels
     */
    labels?: {
        end?: string;
        start?: string;
    };
    /**
     * custom select menu id (default: 'discordx@pagination@menu')
     */
    menuId?: string;
    /**
     * Define page text, use `{page}` to print page number
     * Different page texts can also be defined for different items using arrays
     */
    pageText?: string | string[];
    /**
     * Custom range placeholder format
     * Use {start}, {end}, and {total} as placeholders
     */
    rangePlaceholderFormat?: string;
}
interface PaginationOptions extends BasicPaginationOptions {
    /**
     * Navigation button configuration
     */
    buttons?: NavigationButtonOptions;
    /**
     * Select menu configuration
     */
    selectMenu?: SelectMenuOptions;
}
interface IPaginate {
    currentPage: number;
    endIndex: number;
    endPage: number;
    pageSize: number;
    pages: number[];
    startIndex: number;
    startPage: number;
    totalItems: number;
    totalPages: number;
}
interface PaginationCollectors {
    buttonCollector: InteractionCollector<ButtonInteraction>;
    menuCollector: InteractionCollector<StringSelectMenuInteraction>;
}

interface PaginationConfig {
    totalItems: number;
    currentPage?: number;
    pageSize?: number;
    maxPages?: number;
}
/**
 * Creates pagination data for UI controls and data slicing
 * @param config - Pagination configuration object
 * @returns Complete pagination information
 * @throws {Error} When input validation fails
 *
 * @example
 * ```typescript
 * const pagination = createPagination({
 *   totalItems: 100,
 *   currentPage: 5,
 *   pageSize: 10,
 *   maxPages: 7
 * });
 * ```
 */
declare function createPagination(config: PaginationConfig): IPaginate;

export { type BasicPaginationOptions, type ButtonOptions, type IPaginate, type NavigationButtonOptions, Pagination, PaginationBuilder, type PaginationCollectors, type PaginationConfig, type PaginationInteractions, type PaginationItem, type PaginationOptions, PaginationResolver, type PaginationSendTo, type Resolver, type SelectMenuOptions, SelectMenuPageId, createPagination, defaultIds, defaultPerPageItem, defaultTime };
