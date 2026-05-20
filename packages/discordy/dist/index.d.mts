export * from '@rpbey/di';
import { Decorator, ClassMethodDecorator, MethodDecoratorEx, ClassDecoratorEx, ParameterDecoratorEx, Modifier } from '@rpbey/internal';
export * from '@rpbey/internal';
import { Client as Client$1, Snowflake, Interaction, Message, MessageReaction, PartialMessageReaction, User, PartialUser, ApplicationCommand, PermissionResolvable, InteractionContextType, ApplicationIntegrationType, LocalizationMap, ApplicationCommandType, ChatInputCommandInteraction, ChannelType, ApplicationCommandOptionType, ApplicationCommandOptionData, ClientOptions as ClientOptions$1, ClientEvents, RestEvents, ThreadChannel, GuildChannel, GuildMember, Role, AutocompleteInteraction, Attachment, Channel, APIRole, APIInteractionDataResolvedGuildMember, SlashCommandBuilder, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandUserOption, ButtonInteraction, ModalSubmitInteraction, AnySelectMenuInteraction, ContextMenuCommandInteraction } from 'discord.js';

/**
 * Extended Discord.js client with discordx functionality
 *
 * @param options - Client options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/basics/client)
 */
declare class Client extends Client$1 {
    private _botId;
    private _isBuilt;
    private _prefix;
    private _simpleCommandConfig?;
    private _silent;
    private _botGuilds;
    private _guards;
    logger: ILogger;
    applicationCommandManager: ApplicationCommandManager;
    interactionHandler: InteractionHandler;
    simpleCommandManager: SimpleCommandManager;
    reactionManager: ReactionManager;
    debugManager: DebugManager;
    get botId(): string;
    set botId(value: string);
    get silent(): boolean;
    set silent(value: boolean);
    get guards(): GuardFunction[];
    set guards(value: GuardFunction[]);
    get prefix(): IPrefixResolver;
    set prefix(value: IPrefixResolver);
    get simpleCommandConfig(): SimpleCommandConfig | undefined;
    set simpleCommandConfig(value: SimpleCommandConfig | undefined);
    get botGuilds(): IGuild[];
    set botGuilds(value: IGuild[]);
    get botResolvedGuilds(): Promise<string[]>;
    get instance(): MetadataStorage;
    static get applicationCommands(): readonly DApplicationCommand[];
    static get applicationCommandSlashes(): readonly DApplicationCommand[];
    static get applicationCommandSlashesFlat(): readonly DApplicationCommand[];
    static get applicationCommandSlashOptions(): readonly DApplicationCommandOption[];
    static get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[];
    static get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[];
    static get applicationCommandUsers(): readonly DApplicationCommand[];
    static get applicationCommandMessages(): readonly DApplicationCommand[];
    static get events(): readonly DOn[];
    static get discords(): readonly DDiscord[];
    static get buttonComponents(): readonly DComponent[];
    static get modalComponents(): readonly DComponent[];
    static get selectMenuComponents(): readonly DComponent[];
    static get reactions(): readonly DReaction[];
    static get simpleCommands(): readonly DSimpleCommand[];
    static get simpleCommandsByName(): readonly ISimpleCommandByName[];
    static get simpleCommandMappedPrefix(): readonly string[];
    static get instance(): MetadataStorage;
    get applicationCommands(): readonly DApplicationCommand[];
    get applicationCommandSlashes(): readonly DApplicationCommand[];
    get applicationCommandSlashesFlat(): readonly DApplicationCommand[];
    get applicationCommandSlashOptions(): readonly DApplicationCommandOption[];
    get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[];
    get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[];
    get applicationCommandUsers(): readonly DApplicationCommand[];
    get applicationCommandMessages(): readonly DApplicationCommand[];
    get events(): readonly DOn[];
    get discords(): readonly DDiscord[];
    get buttonComponents(): readonly DComponent[];
    get modalComponents(): readonly DComponent[];
    get selectMenuComponents(): readonly DComponent[];
    get reactions(): readonly DReaction[];
    get simpleCommands(): readonly DSimpleCommand[];
    get simpleCommandsByName(): readonly ISimpleCommandByName[];
    get simpleCommandMappedPrefix(): readonly string[];
    constructor(options: ClientOptions);
    /**
     * Start bot
     */
    login(token: string): Promise<string>;
    /**
     * Build the client and initialize all systems
     */
    build(): Promise<void>;
    initApplicationCommands(retainDeleted?: boolean): Promise<void>;
    clearApplicationCommands(...guilds: Snowflake[]): Promise<void>;
    executeInteraction(interaction: Interaction): Awaited<unknown>;
    parseCommand(message: Message, caseSensitive?: boolean): Promise<SimpleCommandParseType | SimpleCommandMessage>;
    executeCommand(message: Message, caseSensitive?: boolean): Promise<unknown>;
    executeReaction(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<unknown>;
    trigger(options: EventConfig, params: any): Promise<any[]>;
    /**
     * Bind discordx events to client
     */
    initEvents(): void;
    /**
     * Unbind all discordx events initialized by the initEvents method.
     */
    removeEvents(): void;
    printDebug(): void;
}

declare class ApplicationCommandMixin {
    command: ApplicationCommand;
    instance: DApplicationCommand;
    constructor(command: ApplicationCommand, instance: DApplicationCommand);
    get name(): string;
    get description(): string;
}

/**
 * Simple command message
 */
declare class SimpleCommandMessage {
    prefix: string;
    argString: string;
    message: Message;
    info: DSimpleCommand;
    splitter?: ArgSplitter | undefined;
    options: SimpleOptionType[];
    constructor(prefix: string, argString: string, message: Message, info: DSimpleCommand, splitter?: ArgSplitter | undefined);
    get name(): string;
    get description(): string;
    /**
     * Resolve options
     */
    resolveOptions(): Promise<SimpleOptionType[]>;
    /**
     * Verify that all options are valid
     *
     * @returns
     */
    isValid(): boolean;
    /**
     * Get related commands
     *
     * @returns
     */
    getRelatedCommands(): DSimpleCommand[];
    /**
     * Send usage syntax for command
     *
     * @returns
     */
    sendUsageSyntax(): Promise<Message>;
}

/**
 * Base class for method decorators that can be executed with guard middleware.
 *
 * @category Decorator
 */
declare abstract class Method extends Decorator {
    protected _discord: DDiscord;
    protected _guards: DGuard[];
    get discord(): DDiscord;
    set discord(value: DDiscord);
    /**
     * Creates an executable function that runs all guards followed by the main method.
     *
     * The execution flow follows this pattern:
     * ```typescript
     * async (params, client) => {
     *   await guard1(params, client, next, sharedData)
     *   await guard2(params, client, next, sharedData)
     *   await guard3(params, client, next, sharedData)
     *   await mainMethod(parsedParams, params, client, sharedData)
     * }
     * ```
     *
     * @returns Function that executes the complete guard chain
     */
    get execute(): (guards: GuardFunction[], ...params: unknown[]) => Promise<unknown>;
    /**
     * Gets all guards that will be executed for this method.
     *
     * Combines guards in this order:
     * 1. Global guards from the Discord client
     * 2. Class-level guards from @Discord decorator
     * 3. Method-specific guards from this method
     * 4. The main method itself (as the final "guard")
     */
    get guards(): DGuard[];
    set guards(value: DGuard[]);
    /**
     * Parses the raw execution parameters into the format expected by the method.
     * Must be implemented by subclasses to handle their specific parameter types.
     *
     * @param params - Raw execution parameters (e.g., Discord interaction, client)
     * @returns Parsed parameters ready for method execution
     */
    abstract parseParams(...params: unknown[]): Awaitable<unknown[]>;
    /**
     * Creates a guard execution chain that processes guards sequentially.
     *
     * Each guard receives:
     * - Original parameters (interaction, client, etc.)
     * - Next function to continue the chain
     * - Shared data object for passing data between guards
     *
     * The final method receives:
     * - Parsed parameters (command options, etc.)
     * - Original parameters (interaction, client, etc.)
     * - Shared data object
     *
     * @param globalGuards - Guards to prepend to the execution chain
     * @returns Function that executes the complete guard chain
     */
    private createGuardChain;
}

interface CreateStructure$7 {
    botIds?: string[];
    contexts?: InteractionContextType[] | null;
    defaultMemberPermissions?: PermissionResolvable | string | null;
    description: string;
    descriptionLocalizations?: LocalizationMap | null;
    dmPermission?: boolean;
    guilds?: IGuild[];
    integrationTypes?: ApplicationIntegrationType[];
    name: string;
    nameLocalizations?: LocalizationMap | null;
    nsfw?: boolean;
    type: ApplicationCommandType;
}
/**
 * @category Decorator
 */
declare class DApplicationCommand extends Method {
    private _botIds;
    private _contexts;
    private _defaultMemberPermissions;
    private _description;
    private _descriptionLocalizations;
    private _dmPermission;
    private _group?;
    private _guilds;
    private _integrationTypes;
    private _name;
    private _nameLocalizations;
    private _nsfw;
    private _options;
    private _subgroup?;
    private _type;
    get botIds(): string[];
    set botIds(value: string[]);
    get description(): string;
    set description(value: string);
    get defaultMemberPermissions(): PermissionResolvable | string | null;
    set defaultMemberPermissions(value: PermissionResolvable | string | null);
    get dmPermission(): boolean;
    set dmPermission(value: boolean);
    get contexts(): InteractionContextType[] | null;
    set contexts(value: InteractionContextType[] | null);
    get integrationTypes(): ApplicationIntegrationType[];
    set integrationTypes(value: ApplicationIntegrationType[]);
    get descriptionLocalizations(): LocalizationMap | null;
    set descriptionLocalizations(value: LocalizationMap | null);
    get group(): string | undefined;
    set group(value: string | undefined);
    get guilds(): IGuild[];
    set guilds(value: IGuild[]);
    get name(): string;
    set name(value: string);
    get nameLocalizations(): LocalizationMap | null;
    set nameLocalizations(value: LocalizationMap | null);
    get nsfw(): boolean;
    set nsfw(value: boolean);
    get options(): DApplicationCommandOption[];
    set options(value: DApplicationCommandOption[]);
    get subgroup(): string | undefined;
    set subgroup(value: string | undefined);
    get type(): ApplicationCommandType;
    set type(value: ApplicationCommandType);
    constructor(data: CreateStructure$7);
    static create(data: CreateStructure$7): DApplicationCommand;
    isBotAllowed(botId: string): boolean;
    getGuilds(client: Client): Promise<string[]>;
    isGuildAllowed(client: Client, guildId: string | null): Promise<boolean>;
    toSubCommand(): DApplicationCommandOption;
    toJSON(): ApplicationCommandDataEx;
    parseParams(interaction: ChatInputCommandInteraction): Promise<unknown[]>;
}

interface CreateStructure$6<T> {
    name: string;
    payload: Partial<T>;
    root?: string;
}
/**
 * @category Decorator
 */
declare class DApplicationCommandGroup<InfoType = DApplicationCommand | DApplicationCommandOption> extends Decorator {
    name: string;
    root?: string;
    payload: Partial<InfoType>;
    constructor(options: CreateStructure$6<InfoType>);
    static create<T = DApplicationCommand | DApplicationCommandOption>(options: CreateStructure$6<T>): DApplicationCommandGroup<T>;
}

interface CreateStructure$5 {
    autocomplete?: SlashAutoCompleteOption;
    channelType?: ChannelType[];
    choices?: DApplicationCommandOptionChoice[];
    description: string;
    descriptionLocalizations?: LocalizationMap | null;
    index?: number;
    maxLength?: number;
    maxValue?: number;
    minLength?: number;
    minValue?: number;
    name: string;
    nameLocalizations?: LocalizationMap | null;
    required?: boolean;
    transformer?: TransformerFunction;
    type: ApplicationCommandOptionType;
}
/**
 * @category Decorator
 */
declare class DApplicationCommandOption extends Decorator {
    private _autocomplete;
    private _channelTypes;
    private _choices;
    private _description;
    private _descriptionLocalizations;
    private _name;
    private _nameLocalizations;
    private _maxValue?;
    private _minValue?;
    private _maxLength?;
    private _minLength?;
    private _options;
    private _required;
    private _type;
    private _transformer?;
    get autocomplete(): SlashAutoCompleteOption;
    set autocomplete(value: SlashAutoCompleteOption);
    get channelTypes(): ChannelType[] | undefined;
    set channelTypes(value: ChannelType[] | undefined);
    get choices(): DApplicationCommandOptionChoice[];
    set choices(value: DApplicationCommandOptionChoice[]);
    get description(): string;
    set description(value: string);
    get descriptionLocalizations(): LocalizationMap | null;
    set descriptionLocalizations(value: LocalizationMap | null);
    get isNode(): boolean;
    get maxValue(): number | undefined;
    set maxValue(value: number | undefined);
    get minValue(): number | undefined;
    set minValue(value: number | undefined);
    get maxLength(): number | undefined;
    set maxLength(value: number | undefined);
    get minLength(): number | undefined;
    set minLength(value: number | undefined);
    get name(): string;
    set name(value: string);
    get nameLocalizations(): LocalizationMap | null;
    set nameLocalizations(value: LocalizationMap | null);
    get options(): DApplicationCommandOption[];
    set options(value: DApplicationCommandOption[]);
    get required(): boolean;
    set required(value: boolean);
    get type(): ApplicationCommandOptionType;
    set type(value: ApplicationCommandOptionType);
    constructor(data: CreateStructure$5);
    static create(data: CreateStructure$5): DApplicationCommandOption;
    toJSON(): ApplicationCommandOptionData;
    parseType(interaction: ChatInputCommandInteraction): unknown;
    parse(interaction: ChatInputCommandInteraction): Awaitable<unknown>;
}

interface SimpleCommandConfig {
    /**
     * Global argument splitter for simple command
     */
    argSplitter?: ArgSplitter;
    /**
     * bot prefix or prefix resolver
     */
    prefix?: IPrefixResolver;
    /**
     * Define global response for certain conditions
     */
    responses?: {
        /**
         * Define response for not found command
         */
        notFound?: string | ((command: Message) => Awaitable<void>);
    };
}
interface ClientOptions extends ClientOptions$1 {
    /**
     * Set the guilds globally for application commands
     */
    botGuilds?: IGuild[];
    /**
     * Specify bot id (added for multiple bot support)
     */
    botId?: string;
    /**
     * The global guards
     */
    guards?: GuardFunction[];
    /**
     * Set custom logger implementation
     */
    logger?: ILogger;
    /**
     * Do not log anything
     */
    silent?: boolean;
    /**
     * simple command related customization
     */
    simpleCommand?: SimpleCommandConfig;
}

type Awaitable<T> = Promise<T> | T;
type TransformerFunction = (value: any, interaction: ChatInputCommandInteraction) => Awaitable<any>;
type Next = (...paramsToNext: unknown[]) => Promise<unknown>;
type IPrefix = string | string[];
type IPrefixResolver = string | string[] | ((message: Message) => Awaitable<string | string[]>);
type IGuild = Snowflake | Snowflake[] | ((client: Client, command: DApplicationCommand | DComponent | DReaction | SimpleCommandMessage | undefined) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);
interface ISimpleCommandByName {
    command: DSimpleCommand;
    name: string;
}

declare const SpecialCharactersList: readonly ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "+", "=", "{", "}", "[", "]", "|", "\\", "/", ":", ";", "\"", "'", "<", ">", ",", ".", "?", " "];
type SpecialCharacters = (typeof SpecialCharactersList)[number];
type ForbidCharacter<S extends string, Character extends string> = S extends `${string}${Character}${string}` ? never : S;
type WhitelistWords<S, D extends string> = S extends "" ? unknown : S extends `${D}${infer Tail}` ? WhitelistWords<Tail, D> : never;
type TruncateTo32<T extends string> = T extends "" ? unknown : T extends `${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}` ? T extends `${infer F}${R}` ? F : never : T;
type NotEmptyCheck<T> = T extends "" ? never : T;
type NotEmpty<T> = NotEmptyCheck<T> extends never ? "A string of zero length is not allowed" : T;
type VName<S extends string> = NotEmptyCheck<S> & Lowercase<S> & TruncateTo32<S> & ForbidCharacter<S, SpecialCharacters>;
type VerifyName<T extends string> = T extends VName<T> ? T : VName<T> extends never ? "Name must only be lowercase with no space as per Discord guidelines" : VName<T>;

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discordx.js.org/docs/discordx/basics/args-of)
 */
type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];
/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discordx.js.org/docs/discordx/basics/rest-args-of)
 */
type RestArgsOf<K extends keyof RestEvents> = RestEvents[K];
/**
 * Event options
 */
interface EventOptions {
    botIds?: string[];
    event: keyof ClientEvents;
    priority?: number;
}
/**
 * Rest event options
 */
interface RestEventOptions {
    botIds?: string[];
    event: keyof RestEvents;
    priority?: number;
}
/**
 * Guard function
 */
type GuardFunction<Type = any, DataType = any> = (params: Type, client: Client, next: Next, data: DataType) => any;
/**
 * Custom logger
 */
interface ILogger {
    error(...args: unknown[]): void;
    info(...args: unknown[]): void;
    log(...args: unknown[]): void;
    warn(...args: unknown[]): void;
}
/**
 * Reaction options
 */
interface ReactionOptions<T extends string = string> {
    aliases?: string[];
    botIds?: string[];
    description?: string;
    directMessage?: boolean;
    emoji: NotEmpty<T>;
    guilds?: IGuild[];
    partial?: boolean;
    remove?: boolean;
}
/**
 * Slash choice type
 */
interface SlashChoiceType<T extends string = string, X = string | number> {
    name: NotEmpty<T>;
    nameLocalizations?: LocalizationMap;
    value?: X;
}
/**
 * Component type
 */
interface ComponentOptions<T extends string = string> {
    botIds?: string[];
    guilds?: IGuild[];
    id?: NotEmpty<T> | RegExp;
}

/**
 * Component type enum
 */
declare enum ComponentType {
    Button = 0,
    SelectMenu = 1,
    Modal = 2
}
/**
 * Component type enum
 */
declare enum SimpleCommandParseType {
    notCommand = 0,
    notFound = 1
}

type ArgSplitter = string | RegExp | ((command: SimpleCommandMessage) => string[]);
interface SimpleCommandOptions<T extends string = string> {
    aliases?: string[];
    argSplitter?: ArgSplitter;
    botIds?: string[];
    description?: string;
    directMessage?: boolean;
    guilds?: IGuild[];
    name?: NotEmpty<T>;
    prefix?: IPrefix;
}
interface SimpleCommandOptionOptions<T extends string = string> {
    description?: string;
    name: NotEmpty<T>;
    type: SimpleCommandOptionType;
}
type SimpleOptionType = string | number | boolean | ThreadChannel | GuildChannel | User | GuildMember | Role | null;
declare enum SimpleCommandOptionType {
    String = 0,
    Number = 1,
    Boolean = 2,
    User = 3,
    Channel = 4,
    Role = 5,
    Mentionable = 6
}

interface ApplicationCommandOptions<T extends string, TD extends string> {
    botIds?: string[];
    contexts?: InteractionContextType[];
    defaultMemberPermissions?: PermissionResolvable;
    description: TD;
    descriptionLocalizations?: LocalizationMap;
    dmPermission?: boolean;
    guilds?: IGuild[];
    integrationTypes?: ApplicationIntegrationType[];
    name?: T;
    nameLocalizations?: LocalizationMap;
    nsfw?: boolean;
}
interface SlashOptionBaseOptions<T extends string, TD extends string> {
    autocomplete?: undefined;
    channelTypes?: undefined;
    description: TD;
    descriptionLocalizations?: LocalizationMap;
    maxLength?: undefined;
    maxValue?: undefined;
    minLength?: undefined;
    minValue?: undefined;
    name: T;
    nameLocalizations?: LocalizationMap;
    nsfw?: boolean;
    required?: boolean;
    type: Exclude<ApplicationCommandOptionType, ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup | ApplicationCommandOptionType.Channel>;
}
type SlashOptionChannelOptions<T extends string, TD extends string> = Omit<SlashOptionBaseOptions<T, TD>, "channelTypes" | "type"> & {
    channelTypes?: ChannelType[];
    type: ApplicationCommandOptionType.Channel;
};
type SlashOptionAutoCompleteOptions<T extends string, TD extends string> = Omit<SlashOptionBaseOptions<T, TD>, "autocomplete" | "type"> & {
    autocomplete?: SlashAutoCompleteOption;
    type: ApplicationCommandOptionType.String | ApplicationCommandOptionType.Number | ApplicationCommandOptionType.Integer;
};
type SlashOptionNumberOptions<T extends string, TD extends string> = Omit<SlashOptionBaseOptions<T, TD>, "maxValue" | "minValue" | "autocomplete" | "type"> & {
    autocomplete?: SlashAutoCompleteOption;
    maxValue?: number;
    minValue?: number;
    type: ApplicationCommandOptionType.Number | ApplicationCommandOptionType.Integer;
};
type SlashOptionStringOptions<T extends string, TD extends string> = Omit<SlashOptionBaseOptions<T, TD>, "maxLength" | "minLength" | "autocomplete" | "type"> & {
    autocomplete?: SlashAutoCompleteOption;
    maxLength?: number;
    minLength?: number;
    type: ApplicationCommandOptionType.String;
};
type SlashOptionOptions<T extends string, TD extends string> = SlashOptionBaseOptions<T, TD> | SlashOptionChannelOptions<T, TD> | SlashOptionNumberOptions<T, TD> | SlashOptionStringOptions<T, TD> | SlashOptionAutoCompleteOptions<T, TD>;
type SlashAutoCompleteOption = undefined | boolean | ((interaction: AutocompleteInteraction, command: DApplicationCommand) => void | Promise<void>);
interface ApplicationCommandDataEx {
    contexts: InteractionContextType[] | null;
    defaultMemberPermissions?: PermissionResolvable | string | null;
    description?: string;
    descriptionLocalizations?: LocalizationMap | null;
    dmPermission?: boolean;
    integrationTypes: ApplicationIntegrationType[];
    name: string;
    nameLocalizations?: LocalizationMap | null;
    nsfw?: boolean;
    options: ApplicationCommandOptionData[];
    type: ApplicationCommandType;
}
interface ApplicationCommandOptionChoiceDataEx {
    name: string;
    nameLocalizations?: LocalizationMap | null;
    value: string | number;
}
/**
 * Slash group options
 */
interface SlashGroupBase<T extends string, TD extends string> {
    description: TD;
    descriptionLocalizations?: LocalizationMap;
    name: T;
    nameLocalizations?: LocalizationMap;
}
type SlashGroupRoot<T extends string, TD extends string> = SlashGroupBase<T, TD> & {
    contexts?: InteractionContextType[];
    defaultMemberPermissions?: PermissionResolvable;
    dmPermission?: boolean;
    integrationTypes?: ApplicationIntegrationType[];
    root?: undefined;
};
type SlashGroupSubRoot<T extends string, TD extends string, TR extends string> = SlashGroupBase<T, TD> & {
    contexts?: undefined;
    defaultMemberPermissions?: undefined;
    dmPermission?: undefined;
    integrationTypes?: undefined;
    root?: TR;
};
type SlashGroupOptions<T extends string, TD extends string, TR extends string> = SlashGroupRoot<T, TD> | SlashGroupSubRoot<T, TD, TR>;
type SlashOptionResult = {
    [ApplicationCommandOptionType.Attachment]: Attachment;
    [ApplicationCommandOptionType.Channel]: Channel;
    [ApplicationCommandOptionType.String]: string;
    [ApplicationCommandOptionType.Boolean]: boolean;
    [ApplicationCommandOptionType.Integer]: number;
    [ApplicationCommandOptionType.Number]: number;
    [ApplicationCommandOptionType.Mentionable]: User | Role | GuildMember | APIRole | APIInteractionDataResolvedGuildMember;
    [ApplicationCommandOptionType.Role]: Role | APIRole;
    [ApplicationCommandOptionType.User]: GuildMember | APIInteractionDataResolvedGuildMember | User;
};

/**
 * @category Decorator
 */
declare class DApplicationCommandOptionChoice extends Decorator {
    private _name;
    private _nameLocalizations;
    private _value;
    get name(): string;
    set name(value: string);
    get nameLocalizations(): LocalizationMap | null;
    set nameLocalizations(value: LocalizationMap | null);
    get value(): string | number;
    set value(value: string | number);
    constructor(data: SlashChoiceType);
    static create(data: SlashChoiceType): DApplicationCommandOptionChoice;
    toJSON(): ApplicationCommandOptionChoiceDataEx;
}

interface CreateStructure$4 {
    botIds?: string[];
    guilds?: IGuild[];
    id: string | RegExp;
    type: ComponentType;
}
/**
 * @category Decorator
 */
declare class DComponent extends Method {
    private _type;
    private _id;
    private _guilds;
    private _botIds;
    get type(): ComponentType;
    get botIds(): string[];
    set botIds(value: string[]);
    get id(): string | RegExp;
    set id(value: string | RegExp);
    get guilds(): IGuild[];
    set guilds(value: IGuild[]);
    constructor(data: CreateStructure$4);
    static create(data: CreateStructure$4): DComponent;
    isBotAllowed(botId: string): boolean;
    getGuilds(client: Client): Promise<string[]>;
    isGuildAllowed(client: Client, guildId: string | null): Promise<boolean>;
    isId(text: string): boolean;
    parseParams(): never[];
}

/**
 * @category Decorator
 */
declare class DDiscord extends Decorator {
    private _applicationCommands;
    private _botIds;
    private _buttonComponents;
    private _description;
    private _events;
    private _guards;
    private _guilds;
    private _modalComponents;
    private _name;
    private _reactions;
    private _selectMenuComponents;
    private _simpleCommands;
    get applicationCommands(): DApplicationCommand[];
    set applicationCommands(value: DApplicationCommand[]);
    get botIds(): string[];
    set botIds(value: string[]);
    get buttons(): DComponent[];
    set buttons(value: DComponent[]);
    get description(): string;
    set description(value: string);
    get events(): DOn[];
    set events(value: DOn[]);
    get guards(): DGuard[];
    set guards(value: DGuard[]);
    get guilds(): IGuild[];
    set guilds(value: IGuild[]);
    get instance(): unknown;
    get modal(): DComponent[];
    set modal(value: DComponent[]);
    get name(): string;
    set name(value: string);
    get reactions(): DReaction[];
    set reactions(value: DReaction[]);
    get selectMenus(): DComponent[];
    set selectMenus(value: DComponent[]);
    get simpleCommands(): DSimpleCommand[];
    set simpleCommands(value: DSimpleCommand[]);
    constructor(name: string, description?: string);
    static create(name: string, description?: string): DDiscord;
}

/**
 * @category Decorator
 */
declare class DGuard extends Decorator {
    protected _fn: GuardFunction;
    get fn(): GuardFunction;
    constructor(fn: GuardFunction);
    static create(fn: GuardFunction): DGuard;
}

interface CreateStructure$3 {
    botIds?: string[];
    event: string;
    once: boolean;
    priority?: number;
    rest: boolean;
}
/**
 * @category Decorator
 */
declare class DOn extends Method {
    protected _event: string;
    protected _once: boolean;
    protected _rest: boolean;
    protected _priority: number;
    protected _botIds: string[];
    get botIds(): string[];
    set botIds(value: string[]);
    get event(): string;
    set event(value: string);
    get once(): boolean;
    set once(value: boolean);
    get priority(): number;
    set priority(value: number);
    get rest(): boolean;
    set rest(value: boolean);
    constructor(data: CreateStructure$3);
    static create(data: CreateStructure$3): DOn;
    isBotAllowed(botId: string): boolean;
    parseParams(): never[];
}

interface CreateStructure$2 {
    aliases?: string[];
    botIds?: string[];
    description?: string;
    directMessage?: boolean;
    emoji: string;
    guilds?: IGuild[];
    partial?: boolean;
    remove?: boolean;
}
/**
 * @category Decorator
 */
declare class DReaction extends Method {
    private _emoji;
    private _description;
    private _directMessage;
    private _guilds;
    private _botIds;
    private _aliases;
    private _remove;
    private _partial;
    get aliases(): string[];
    set aliases(value: string[]);
    get botIds(): string[];
    set botIds(value: string[]);
    get guilds(): IGuild[];
    set guilds(value: IGuild[]);
    get directMessage(): boolean;
    set directMessage(value: boolean);
    get emoji(): string;
    set emoji(value: string);
    get description(): string;
    set description(value: string);
    get remove(): boolean;
    set remove(value: boolean);
    get partial(): boolean;
    set partial(value: boolean);
    constructor(data: CreateStructure$2);
    static create(data: CreateStructure$2): DReaction;
    isBotAllowed(botId: string): boolean;
    getGuilds(client: Client): Promise<string[]>;
    isGuildAllowed(client: Client, guildId: string | null): Promise<boolean>;
    parseParams(): never[];
}

interface CreateStructure$1 {
    aliases?: string[];
    argSplitter?: ArgSplitter;
    botIds?: string[];
    description?: string;
    directMessage?: boolean;
    guilds?: IGuild[];
    name: string;
    prefix?: IPrefix;
}
/**
 * @category Decorator
 */
declare class DSimpleCommand extends Method {
    private _description;
    private _name;
    private _prefix;
    private _directMessage;
    private _argSplitter?;
    private _options;
    private _guilds;
    private _botIds;
    private _aliases;
    get aliases(): string[];
    set aliases(value: string[]);
    get botIds(): string[];
    set botIds(value: string[]);
    get prefix(): IPrefix | undefined;
    set prefix(value: IPrefix | undefined);
    get guilds(): IGuild[];
    set guilds(value: IGuild[]);
    get argSplitter(): ArgSplitter | undefined;
    set argSplitter(value: ArgSplitter | undefined);
    get directMessage(): boolean;
    set directMessage(value: boolean);
    get name(): string;
    set name(value: string);
    get description(): string;
    set description(value: string);
    get options(): DSimpleCommandOption[];
    set options(value: DSimpleCommandOption[]);
    constructor(data: CreateStructure$1);
    static create(data: CreateStructure$1): DSimpleCommand;
    isBotAllowed(botId: string): boolean;
    getGuilds(client: Client, command: SimpleCommandMessage): Promise<string[]>;
    isGuildAllowed(client: Client, command: SimpleCommandMessage, guildId: string | null): Promise<boolean>;
    parseParams(command: SimpleCommandMessage): SimpleOptionType[];
    parseParamsEx(command: SimpleCommandMessage): Promise<SimpleOptionType[]>;
}

interface CreateStructure {
    description?: string;
    name: string;
    type?: SimpleCommandOptionType;
}
/**
 * @category Decorator
 */
declare class DSimpleCommandOption extends Decorator {
    private _name;
    private _description;
    private _type;
    get name(): string;
    set name(value: string);
    get type(): SimpleCommandOptionType;
    set type(value: SimpleCommandOptionType);
    get description(): string;
    set description(value: string);
    constructor(data: CreateStructure);
    static create(data: CreateStructure): DSimpleCommandOption;
}

/**
 * Execute your application button, event, select menu, simple command, slash by defined bot
 * when multiple bots are running simultaneously
 *
 * @param botId - Bot identifier
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/bot)
 *
 * @category Decorator
 */
declare function Bot<T extends string>(botId: NotEmpty<T>): ClassMethodDecorator;
/**
 * Execute your application button, event, select menu, simple command, slash by defined bot
 * when multiple bots are running simultaneously
 *
 * @param botIds - Multiple bot identifiers
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/bot)
 *
 * @category Decorator
 */
declare function Bot(...botIds: string[]): ClassMethodDecorator;

/**
 * Interact with buttons with a defined identifier
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/button-component)
 *
 * @category Decorator
 */
declare function ButtonComponent(): MethodDecoratorEx;
/**
 * Interact with buttons with a defined identifier
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/button-component)
 *
 * @category Decorator
 */
declare function ButtonComponent<T extends string>(options: ComponentOptions<T>): MethodDecoratorEx;

/**
 * Interact with context menu with a defined identifier
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/context-menu)
 *
 * @category Decorator
 */
declare function ContextMenu<TName extends string>(options: Omit<ApplicationCommandOptions<NotEmpty<TName>, never> & {
    type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
}, "description" | "descriptionLocalizations">): MethodDecoratorEx;

/**
 * Create a metadata instance for the class
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/discord)
 *
 * @category Decorator
 */
declare function Discord(): ClassDecoratorEx;

/**
 * Define middleware for buttons, events, select menus, simple commands, slashes, etc.
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/guard)
 *
 * @category Decorator
 */
declare function Guard<Type = any, DataType = any>(...fns: GuardFunction<Type, DataType>[]): ClassMethodDecorator;

/**
 * Use buttons, events, select menus, simple commands and slashes for a defined guild only
 *
 * @param guildId - Guild identifier
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/guild)
 *
 * @category Decorator
 */
declare function Guild(guildId: IGuild): ClassMethodDecorator;
/**
 * Use buttons, events, select menus, simple commands and slashes for a defined guild only
 *
 * @param guildIds - Guild identifiers
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/guild)
 *
 * @category Decorator
 */
declare function Guild(...guildIds: IGuild[]): ClassMethodDecorator;

/**
 * Create modal interaction handler
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/modal-component)
 *
 * @category Decorator
 */
declare function ModalComponent(): MethodDecoratorEx;
/**
 * Create modal interaction handler
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/modal-component)
 *
 * @category Decorator
 */
declare function ModalComponent<T extends string>(options: ComponentOptions<T>): MethodDecoratorEx;

/**
 * Handle discord events with a defined handler
 *
 * @param options - Event options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/on)
 *
 * @category Decorator
 */
declare function On(options?: EventOptions): MethodDecoratorEx;
declare namespace On {
    var rest: (options?: RestEventOptions) => MethodDecoratorEx;
}

/**
 * Handle discord events once only with a defined handler
 *
 * @param options - Event parameters
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/once)
 *
 * @category Decorator
 */
declare function Once(options?: EventOptions): MethodDecoratorEx;
declare namespace Once {
    var rest: (options?: RestEventOptions) => MethodDecoratorEx;
}

/**
 * Handle a reaction with a specified emoji
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/reaction)
 *
 * @category Decorator
 */
declare function Reaction(): MethodDecoratorEx;
/**
 * Handle a reaction with a specified emoji (a Unicode string, custom name, or Snowflake)
 *
 * @param options - reaction options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/reaction)
 *
 * @category Decorator
 */
declare function Reaction<T extends string>(options: ReactionOptions<T>): MethodDecoratorEx;

/**
 * Interact with select menu with a defined identifier
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/select-menu-component)
 *
 * @category Decorator
 */
declare function SelectMenuComponent(): MethodDecoratorEx;
/**
 * Interact with select menu with a defined identifier
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/select-menu-component)
 *
 * @category Decorator
 */
declare function SelectMenuComponent<T extends string>(options: ComponentOptions<T>): MethodDecoratorEx;

/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command)
 *
 * @category Decorator
 */
declare function SimpleCommand(): MethodDecoratorEx;
/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 *
 * @param options - Command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command)
 *
 * @category Decorator
 */
declare function SimpleCommand<T extends string>(options: SimpleCommandOptions<T>): MethodDecoratorEx;

/**
 * Add a simple command option
 *
 * @param options - Command option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command-option)
 *
 * @category Decorator
 */
declare function SimpleCommandOption<T extends string>(options: SimpleCommandOptionOptions<T>): ParameterDecoratorEx;

/**
 * Handle a slash command with a defined name
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
declare function Slash(options: SlashCommandBuilder): MethodDecoratorEx;
/**
 * Handle a slash command with a defined name
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
declare function Slash<T extends string, TD extends string>(options: ApplicationCommandOptions<VerifyName<T>, NotEmpty<TD>>): MethodDecoratorEx;

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
 *
 * @category Decorator
 */
declare function SlashChoice<T extends string>(...choices: NotEmpty<T>[]): ParameterDecoratorEx;
/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
 *
 * @category Decorator
 */
declare function SlashChoice(...choices: number[]): ParameterDecoratorEx;
/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
 *
 * @category Decorator
 */
declare function SlashChoice<T extends string, X = string | number>(...choices: SlashChoiceType<T, X>[]): ParameterDecoratorEx;

/**
 * Assign a group to a method or class
 *
 * @param name - Name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
declare function SlashGroup<T extends string>(name: VerifyName<T>): ClassMethodDecorator;
/**
 * Assign a group to a method or class
 *
 * @param name - Name of group
 * @param root - Root name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
declare function SlashGroup<TName extends string, TRoot extends string>(name: VerifyName<TName>, root: VerifyName<TRoot>): ClassMethodDecorator;
/**
 * Create slash group
 *
 * @param options - Group options
 * ___
 *
 * [View discordx documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
declare function SlashGroup<T extends string, TD extends string, TR extends string>(options: SlashGroupOptions<VerifyName<T>, NotEmpty<TD>, VerifyName<TR>>): ClassDecoratorEx;

/**
 * Add a slash command option
 *
 * @param options - Slash option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-option)
 *
 * @category Decorator
 */
declare function SlashOption(options: SlashCommandAttachmentOption | SlashCommandBooleanOption | SlashCommandChannelOption | SlashCommandIntegerOption | SlashCommandMentionableOption | SlashCommandNumberOption | SlashCommandRoleOption | SlashCommandStringOption | SlashCommandUserOption, transformer?: TransformerFunction): ParameterDecoratorEx;
/**
 * Add a slash command option
 *
 * @param options - Slash option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-option)
 *
 * @category Decorator
 */
declare function SlashOption<T extends string, TD extends string>(options: SlashOptionOptions<VerifyName<T>, NotEmpty<TD>>, transformer?: TransformerFunction): ParameterDecoratorEx;

declare class ApplicationCommandManager {
    private client;
    constructor(client: Client);
    initApplicationCommands(retainDeleted?: boolean): Promise<void>;
    clearApplicationCommands(...guilds: Snowflake[]): Promise<void>;
    private getCommandsByGuild;
    private initGuildApplicationCommands;
    private initGlobalApplicationCommands;
    private categorizeGuildCommands;
    private categorizeGlobalCommands;
    private logCommandChanges;
    private prepareBulkUpdate;
}

declare class DebugManager {
    private client;
    constructor(client: Client);
    printDebug(): void;
    private printEvents;
    private printComponents;
    private printComponentType;
    private printReactions;
    private printContextMenus;
    private printApplicationCommands;
    private printOptions;
    private printSimpleCommands;
    private printSimpleOptions;
}

interface EventConfig {
    eventName: string;
    isOnce: boolean;
    isRest: boolean;
}
interface EventGroup extends EventConfig {
    handlers: DOn[];
}
declare class EventManager {
    private groups;
    private cleanupFunctions;
    add(event: DOn): void;
    /**
     * Execute handlers for a specific event group
     */
    private executeHandlers;
    /**
     * Trigger an event manually (used for testing)
     */
    trigger(client: Client, { eventName, isOnce, isRest }: EventConfig): (...params: any[]) => Promise<any[]>;
    initEvents(client: Client): void;
    removeEvents(): void;
    clear(): void;
}

declare class InteractionHandler {
    private client;
    constructor(client: Client);
    executeInteraction(interaction: Interaction): Awaited<unknown>;
    executeCommandInteraction(interaction: ChatInputCommandInteraction | AutocompleteInteraction): Promise<unknown>;
    executeComponent(components: readonly DComponent[], interaction: ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction): Promise<unknown>;
    executeContextMenu(interaction: ContextMenuCommandInteraction): Awaited<unknown>;
    private getApplicationCommandGroupTree;
    private getApplicationCommandFromTree;
}

declare class ReactionManager {
    private client;
    constructor(client: Client);
    executeReaction(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<unknown>;
    parseReaction(message: MessageReaction | PartialMessageReaction): DReaction | undefined;
}

declare class SimpleCommandManager {
    private client;
    constructor(client: Client);
    executeCommand(message: Message, caseSensitive?: boolean): Promise<unknown>;
    parseCommand(message: Message, caseSensitive?: boolean): Promise<SimpleCommandParseType | SimpleCommandMessage>;
    private getMessagePrefix;
}

/**
 * @category Internal
 */
declare class MetadataStorage {
    private static _isBuilt;
    private static _instance;
    private _discords;
    private _guards;
    private _modifiers;
    private _events;
    private _eventManager;
    private _buttonComponents;
    private _modalComponents;
    private _selectMenuComponents;
    private _reactions;
    private _simpleCommandOptions;
    private _simpleCommands;
    private _simpleCommandsByName;
    private _simpleCommandMappedPrefix;
    private _applicationCommandMessages;
    private _applicationCommandSlashes;
    private _applicationCommandSlashesFlat;
    private _applicationCommandSlashOptions;
    private _applicationCommandUsers;
    private _applicationCommandSlashGroups;
    private _applicationCommandSlashSubGroups;
    static clear(): void;
    static get isBuilt(): boolean;
    static get instance(): MetadataStorage;
    static set instance(value: MetadataStorage);
    get applicationCommandSlashes(): readonly DApplicationCommand[];
    get applicationCommandSlashesFlat(): readonly DApplicationCommand[];
    get applicationCommandSlashOptions(): readonly DApplicationCommandOption[];
    get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[];
    get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[];
    get applicationCommandUsers(): readonly DApplicationCommand[];
    get applicationCommandMessages(): readonly DApplicationCommand[];
    get applicationCommands(): readonly DApplicationCommand[];
    get buttonComponents(): readonly DComponent[];
    get discords(): readonly DDiscord[];
    private get discordMembers();
    get events(): readonly DOn[];
    get eventManager(): EventManager;
    get isBuilt(): boolean;
    get modalComponents(): readonly DComponent[];
    get reactions(): readonly DReaction[];
    get selectMenuComponents(): readonly DComponent[];
    get simpleCommandsByName(): readonly ISimpleCommandByName[];
    get simpleCommandMappedPrefix(): readonly string[];
    get simpleCommands(): readonly DSimpleCommand[];
    /**
     * Get the list of used events without duplications
     */
    get usedEvents(): readonly DOn[];
    addApplicationCommandSlash(slash: DApplicationCommand): void;
    addApplicationCommandUser(slash: DApplicationCommand): void;
    addApplicationCommandMessage(slash: DApplicationCommand): void;
    addApplicationCommandSlashOption(option: DApplicationCommandOption): void;
    addApplicationCommandSlashGroups(group: DApplicationCommandGroup<Partial<DApplicationCommand>>): void;
    addApplicationCommandSlashSubGroups(subGroup: DApplicationCommandGroup<Partial<DApplicationCommandOption>>): void;
    addComponentButton(button: DComponent): void;
    addComponentModal(selectMenu: DComponent): void;
    addComponentSelectMenu(selectMenu: DComponent): void;
    addDiscord(discord: DDiscord): void;
    addGuard(guard: DGuard): void;
    addModifier<T extends Decorator = Decorator>(modifier: Modifier<T>): void;
    addOn(on: DOn): void;
    addReaction(reaction: DReaction): void;
    addSimpleCommand(cmd: DSimpleCommand): void;
    addSimpleCommandOption(cmdOption: DSimpleCommandOption): void;
    build(): Promise<void>;
    private buildSimpleCommands;
    private groupSlashes;
}

/**
 * Converts the provided arguments into a single flat array of strings.
 * Accepts multiple arguments, each of which can be a string or an array of strings.
 * If an argument is a string, it is wrapped in an array. If it is an array, it is flattened.
 *
 * @param {...(string | string[])[]} input - One or more strings or arrays of strings.
 * @returns {string[]} A flat array of strings.
 */
declare function toStringArray(...input: (string | string[])[]): string[];

/**
 * Recursively match field
 *
 * @param object
 * @param keys
 * @param onMatch
 */
declare function RecursivelyMatchField(object: Record<string, any>, keys: string[], onMatch: (object: any, key: string) => void): void;
/**
 * Check if ApplicationCommand and DApplicationCommand has same properties
 *
 * @param findCommand
 * @param DCommand
 * @param isGuild
 * @returns
 */
declare function isApplicationCommandEqual(findCommand: ApplicationCommand, DCommand: DApplicationCommand, isGuild?: true): boolean;

/**
 * Resolve IGuilds
 * @param client
 * @param command
 * @param guilds
 * @returns
 */
declare const resolveIGuilds: (client: Client, command: DApplicationCommand | DComponent | DReaction | SimpleCommandMessage | undefined, guilds: IGuild[]) => Promise<string[]>;

/**
 * Slash name validator
 * @param name - name
 * @returns
 */
declare function SlashNameValidator(name: string): true;

export { type ApplicationCommandDataEx, ApplicationCommandManager, ApplicationCommandMixin, type ApplicationCommandOptionChoiceDataEx, type ApplicationCommandOptions, type ArgSplitter, type ArgsOf, type Awaitable, Bot, ButtonComponent, Client, type ClientOptions, type ComponentOptions, ComponentType, ContextMenu, DApplicationCommand, DApplicationCommandGroup, DApplicationCommandOption, DApplicationCommandOptionChoice, DComponent, DDiscord, DGuard, DOn, DReaction, DSimpleCommand, DSimpleCommandOption, DebugManager, Discord, type EventConfig, type EventGroup, EventManager, type EventOptions, type ForbidCharacter, Guard, type GuardFunction, Guild, type IGuild, type ILogger, type IPrefix, type IPrefixResolver, type ISimpleCommandByName, InteractionHandler, MetadataStorage, ModalComponent, type Next, type NotEmpty, type NotEmptyCheck, On, Once, Reaction, ReactionManager, type ReactionOptions, RecursivelyMatchField, type RestArgsOf, type RestEventOptions, SelectMenuComponent, SimpleCommand, type SimpleCommandConfig, SimpleCommandManager, SimpleCommandMessage, SimpleCommandOption, type SimpleCommandOptionOptions, SimpleCommandOptionType, type SimpleCommandOptions, SimpleCommandParseType, type SimpleOptionType, Slash, type SlashAutoCompleteOption, SlashChoice, type SlashChoiceType, SlashGroup, type SlashGroupBase, type SlashGroupOptions, type SlashGroupRoot, type SlashGroupSubRoot, SlashNameValidator, SlashOption, type SlashOptionAutoCompleteOptions, type SlashOptionBaseOptions, type SlashOptionChannelOptions, type SlashOptionNumberOptions, type SlashOptionOptions, type SlashOptionResult, type SlashOptionStringOptions, type SpecialCharacters, SpecialCharactersList, type TransformerFunction, type TruncateTo32, type VName, type VerifyName, type WhitelistWords, isApplicationCommandEqual, resolveIGuilds, toStringArray };
