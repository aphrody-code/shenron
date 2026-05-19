/**
 * Base decorator class that tracks metadata about where decorators are applied.
 *
 * This class serves as the foundation for all decorator implementations in the framework,
 * providing a consistent way to track and link decorators across classes, methods, and parameters.
 *
 * @category Decorator
 */
declare class Decorator {
    protected _targetClass: Record<string, any>;
    protected _sourceClass: Record<string, any>;
    protected _propertyName: string;
    protected _methodReference?: Record<string, any>;
    protected _parameterIndex?: number;
    /**
     * The zero-based index of the parameter being decorated (parameter decorators only).
     */
    get index(): number | undefined;
    /**
     * The class constructor where this decorator was applied.
     */
    get classRef(): Record<string, any>;
    set classRef(value: Record<string, any>);
    /**
     * The original class where the decoration was first applied.
     * May differ from `classRef` in inheritance scenarios.
     */
    get from(): Record<string, any>;
    set from(value: Record<string, any>);
    /**
     * The name of the property or method being decorated.
     */
    get key(): string;
    /**
     * The actual method function reference (for method decorators).
     */
    get method(): Record<string, any> | undefined;
    /**
     * Determines if this decorator was applied to a class constructor.
     */
    get isClass(): boolean;
    /**
     * Automatically detects the decoration target type and applies appropriate metadata.
     *
     * This method handles the complexity of TypeScript's decorator signatures and
     * normalizes them into a consistent internal representation.
     *
     * @param classConstructor - The class constructor
     * @param propertyKey - Property/method name (undefined for class decorators)
     * @param methodDescriptor - Method descriptor (undefined for parameter decorators)
     * @param parameterIndex - Parameter index (undefined for class/method decorators)
     * @returns This instance for method chaining
     */
    attachToTarget(classConstructor: Record<string, any>, propertyKey?: string, methodDescriptor?: PropertyDescriptor, parameterIndex?: number): this;
    /**
     * Manually sets all metadata properties for this decorator.
     *
     * @param targetClass - The class being decorated
     * @param propertyName - The property/method name
     * @param methodRef - The method function reference
     * @param sourceClass - The originating class (defaults to targetClass)
     * @param parameterIndex - The parameter position
     * @returns This instance for method chaining
     */
    decorate(targetClass: Record<string, any>, propertyName: string, methodRef?: Record<string, any>, sourceClass?: Record<string, any>, parameterIndex?: number): this;
}

type ModificationFunction<TTarget extends Decorator> = (targetDecorator: TTarget) => void | Promise<void>;
type DecoratorConstructor<T extends Decorator> = new (...args: any[]) => T;
/**
 * A powerful system for modifying the behavior of existing decorators without altering their implementation.
 *
 * Modifiers allow you to create cross-cutting concerns that can affect multiple decorators
 * based on their type and location. This enables features like development mode overrides,
 * logging, validation, and dynamic behavior changes.
 *
 * @category Internal
 */
declare class Modifier<TTarget extends Decorator = Decorator> extends Decorator {
    private _modificationFunction;
    private _applicableDecoratorTypes;
    /**
     * Creates a new decorator modifier.
     * @param modificationFunction - The function that modifies target decorators.
     * @param applicableDecoratorTypes - The list of decorator types that can be modified.
     */
    constructor(modificationFunction: ModificationFunction<TTarget>, applicableDecoratorTypes: DecoratorConstructor<TTarget>[]);
    /**
     * Factory method for creating modifier instances with better type inference.
     * @param modificationFunction - The function that performs the modification.
     * @param applicableDecoratorTypes - The decorator types that can be modified.
     * @returns A new modifier instance.
     */
    static create<TModificationTarget extends Decorator>(modificationFunction: ModificationFunction<TModificationTarget>, ...applicableDecoratorTypes: DecoratorConstructor<TModificationTarget>[]): Modifier<TModificationTarget>;
    /**
     * Applies a collection of modifiers to a collection of decorators.
     *
     * This is the main entry point for the modification system. It processes all modifiers
     * and applies them to their applicable decorators in parallel for better performance.
     *
     * @param modifierCollection - The collection of modifiers to apply.
     * @param decoratorCollection - The collection of decorators to potentially modify.
     * @returns A promise that resolves when all modifications are applied.
     */
    static modify(modifierCollection: Modifier[], decoratorCollection: Decorator[]): Promise<void>;
    /**
     * Applies this modifier's function to a specific decorator.
     * @param targetDecorator - The decorator to modify.
     * @returns The result of the modification function.
     */
    apply(targetDecorator: TTarget): Promise<void>;
}

/**
 * Finds all decorators that are applied to the same location as a reference decorator.
 *
 * Decorators are considered "linked" when they are applied to the same class member:
 * - Same class and same method/property for method/property decorators
 * - Same class, same method, and same parameter position for parameter decorators
 *
 * @example
 * ```typescript
 * // Method decorators - all linked together
 * @Slash()
 * @Permission()
 * method() {}
 * ```
 * @example
 * ```typescript
 * // Parameter decorators - each parameter position creates separate links
 * method(
 *    @Option()
 *    @Required()
 *    param: string
 * ) {}
 * ```
 * @example
 * ```typescript
 * // Class decorators - linked to the class itself
 * @Discord()
 * @Injectable()
 * class MyBot {}
 * ```
 * @param referenceDecorator - The decorator to find linked decorators for.
 * @param decoratorCollection - The collection of decorators to search through.
 * @returns Array of decorators that are applied to the same location.
 */
declare function getLinkedObjects<TDecorator extends Decorator>(referenceDecorator: Decorator, decoratorCollection: TDecorator[]): TDecorator[];

type ClassDecoratorEx = (target: Record<string, any>, propertyKey?: undefined, descriptor?: undefined) => void;
type PropertyDecorator = (target: Record<string, any>, propertyKey: string, descriptor?: undefined) => void;
type MethodDecoratorEx = <T>(target: Record<string, any>, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void;
type ParameterDecoratorEx = (target: Record<string, any>, propertyKey: string, parameterIndex: number) => void;
type ClassMethodDecorator = <T>(target: Record<string, any>, propertyKey?: string, descriptor?: TypedPropertyDescriptor<T>) => void;

export { type ClassDecoratorEx, type ClassMethodDecorator, Decorator, type DecoratorConstructor, type MethodDecoratorEx, type ModificationFunction, Modifier, type ParameterDecoratorEx, type PropertyDecorator, getLinkedObjects };
