import { DependencyContainer, FactoryFunction } from 'tsyringe';
import { Container, Token, Service } from 'typedi';

/**
 * Interface to facilitate the ability to add custom IOC containers by conforming to the proxy of adding and retrieval of services
 */
interface IDependencyRegistryEngine {
    /**
     * Add a service from the IOC container.
     * @param serviceConstructor - The type of service to add
     */
    addService(serviceConstructor: any): void;
    /**
     * Clear all Discord service classes
     */
    clearAllServices(): void;
    /**
     * Get all Discord service classes
     * @returns {Set<unknown>}
     */
    getAllServices(): Set<unknown>;
    /**
     * Get a service from the IOC container
     * @param {T} classType - the Class of the service to retrieve
     * @returns {InstanceOf<T> | null} the instance of this service or null if there is no instance
     */
    getService<T>(classType: T): InstanceOf<T> | null;
}

declare class DefaultDependencyRegistryEngine implements IDependencyRegistryEngine {
    private static _instance;
    private _services;
    static get instance(): DefaultDependencyRegistryEngine;
    addService(serviceConstructor: any): void;
    clearAllServices(): void;
    getAllServices(): Set<unknown>;
    getService<T>(classType: T): InstanceOf<T>;
}

declare abstract class AbstractConfigurableDependencyInjector<I> implements IDependencyRegistryEngine {
    protected injector: I | undefined;
    protected useToken: boolean;
    protected _serviceSet: Set<unknown>;
    setInjector(injector: I): this;
    setUseTokenization(useToken: boolean): this;
    abstract addService(serviceConstructor: any): void;
    abstract clearAllServices(): void;
    abstract getAllServices(): Set<unknown>;
    abstract getService<T>(serviceConstructor: T): InstanceOf<T> | null;
}

type Factory = <T>(factoryFunc: FactoryFunction<T>) => FactoryFunction<T>;
declare class TsyringeDependencyRegistryEngine extends AbstractConfigurableDependencyInjector<DependencyContainer> {
    static token: symbol;
    private static _instance;
    private factory;
    static get instance(): TsyringeDependencyRegistryEngine;
    addService(serviceConstructor: any): void;
    clearAllServices(): void;
    getService<T>(classType: T): InstanceOf<T> | null;
    getAllServices(): Set<unknown>;
    setToken(token: symbol): this;
    setCashingSingletonFactory(factory: Factory): this;
    private getInstanceCashingSingletonFactory;
}

declare class TypeDiDependencyRegistryEngine extends AbstractConfigurableDependencyInjector<typeof Container> {
    static token: Token<unknown>;
    private static _instance;
    private service;
    static get instance(): TypeDiDependencyRegistryEngine;
    addService(serviceConstructor: any): void;
    clearAllServices(): void;
    setService(service: typeof Service): this;
    setToken<T>(token: Token<T>): this;
    getAllServices(): Set<unknown>;
    getService<T>(classType: T): InstanceOf<T> | null;
}

declare const typeDiDependencyRegistryEngine: TypeDiDependencyRegistryEngine;
declare const tsyringeDependencyRegistryEngine: TsyringeDependencyRegistryEngine;
declare const defaultDependencyRegistryEngine: DefaultDependencyRegistryEngine;
type InstanceOf<T> = T extends new (...args: unknown[]) => infer R ? R : unknown;
declare type Constructable<T> = new (...args: any[]) => T;
/**
 * The dependency injection service creates a single instance of a class and stores it globally using the singleton design pattern
 *
 * @category Internal
 */
declare class DIService {
    private static _engine;
    static get engine(): IDependencyRegistryEngine;
    static set engine(engine: IDependencyRegistryEngine);
    /**
     * @deprecated use DIService.engine instead
     */
    static get instance(): IDependencyRegistryEngine;
}

export { AbstractConfigurableDependencyInjector, type Constructable, DIService, DefaultDependencyRegistryEngine, type IDependencyRegistryEngine, type InstanceOf, TsyringeDependencyRegistryEngine, TypeDiDependencyRegistryEngine, defaultDependencyRegistryEngine, tsyringeDependencyRegistryEngine, typeDiDependencyRegistryEngine };
