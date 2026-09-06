// src/logic/impl/DefaultDependencyRegistryEngine.ts
var DefaultDependencyRegistryEngine = class _DefaultDependencyRegistryEngine {
  static _instance;
  _services = /* @__PURE__ */ new Map();
  static get instance() {
    _DefaultDependencyRegistryEngine._instance ??= new _DefaultDependencyRegistryEngine();
    return _DefaultDependencyRegistryEngine._instance;
  }
  addService(serviceConstructor) {
    const service = new serviceConstructor();
    this._services.set(serviceConstructor, service);
  }
  clearAllServices() {
    this._services.clear();
  }
  getAllServices() {
    return new Set(this._services.values());
  }
  getService(classType) {
    return this._services.get(classType);
  }
};

// src/logic/AbstractConfigurableDependencyInjector.ts
var AbstractConfigurableDependencyInjector = class {
  injector;
  useToken = false;
  _serviceSet = /* @__PURE__ */ new Set();
  setInjector(injector) {
    this.injector = injector;
    return this;
  }
  setUseTokenization(useToken) {
    this.useToken = useToken;
    return this;
  }
};

// src/logic/impl/TsyringeDependencyRegistryEngine.ts
var TsyringeDependencyRegistryEngine = class _TsyringeDependencyRegistryEngine extends AbstractConfigurableDependencyInjector {
  static token = /* @__PURE__ */ Symbol("@rpbey/discordy");
  static _instance;
  factory = null;
  static get instance() {
    _TsyringeDependencyRegistryEngine._instance ??= new _TsyringeDependencyRegistryEngine();
    return _TsyringeDependencyRegistryEngine._instance;
  }
  addService(serviceConstructor) {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    this._serviceSet.add(serviceConstructor);
    if (this.useToken) {
      if (!this.factory) {
        throw new Error("Unable to init tokenization without instance factory");
      }
      const instanceCashingSingletonFactory = this.getInstanceCashingSingletonFactory(serviceConstructor);
      this.injector.register(_TsyringeDependencyRegistryEngine.token, {
        useFactory: instanceCashingSingletonFactory
      });
    } else {
      this.injector.registerSingleton(serviceConstructor);
    }
  }
  clearAllServices() {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    this.injector.clearInstances();
  }
  getService(classType) {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    const clazz = classType;
    if (this.useToken && !this.injector.isRegistered(clazz)) {
      return this.injector.resolveAll(_TsyringeDependencyRegistryEngine.token).find(
        (instance) => instance.constructor === clazz
      ) ?? null;
    }
    return this.injector.resolve(clazz);
  }
  getAllServices() {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    if (this.useToken) {
      return new Set(this.injector.resolveAll(_TsyringeDependencyRegistryEngine.token));
    }
    const retSet = /* @__PURE__ */ new Set();
    for (const classRef of this._serviceSet) {
      retSet.add(this.injector.resolve(classRef));
    }
    return retSet;
  }
  setToken(token) {
    _TsyringeDependencyRegistryEngine.token = token;
    return this;
  }
  setCashingSingletonFactory(factory) {
    this.factory = factory;
    return this;
  }
  getInstanceCashingSingletonFactory(clazz) {
    if (!this.factory) {
      throw new Error("Unable to init tokenization without instance factory");
    }
    return this.factory((c) => {
      if (!c.isRegistered(clazz)) {
        c.registerSingleton(clazz);
      }
      return c.resolve(clazz);
    });
  }
};

// src/logic/impl/TypeDiDependencyRegistryEngine.ts
import { Token } from "typedi";
var TypeDiDependencyRegistryEngine = class _TypeDiDependencyRegistryEngine extends AbstractConfigurableDependencyInjector {
  static token = new Token("@rpbey/discordy");
  static _instance;
  service;
  static get instance() {
    _TypeDiDependencyRegistryEngine._instance ??= new _TypeDiDependencyRegistryEngine();
    return _TypeDiDependencyRegistryEngine._instance;
  }
  addService(serviceConstructor) {
    if (!this.service) {
      throw new Error("Please set the Service!");
    }
    this._serviceSet.add(serviceConstructor);
    if (this.useToken) {
      this.service({
        id: _TypeDiDependencyRegistryEngine.token,
        multiple: true
      })(serviceConstructor);
    } else {
      this.service()(serviceConstructor);
    }
  }
  clearAllServices() {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }
    this.injector.reset();
  }
  setService(service) {
    this.service = service;
    return this;
  }
  setToken(token) {
    _TypeDiDependencyRegistryEngine.token = token;
    return this;
  }
  getAllServices() {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }
    if (this.useToken) {
      return new Set(this.injector.getMany(_TypeDiDependencyRegistryEngine.token));
    }
    const retSet = /* @__PURE__ */ new Set();
    for (const classRef of this._serviceSet) {
      retSet.add(this.injector.get(classRef));
    }
    return retSet;
  }
  getService(classType) {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }
    if (this.useToken) {
      return this.injector.getMany(_TypeDiDependencyRegistryEngine.token).find(
        (clazz) => clazz.constructor === classType
      ) ?? null;
    }
    return this.injector.get(classType);
  }
};

// src/index.ts
var typeDiDependencyRegistryEngine = TypeDiDependencyRegistryEngine.instance;
var tsyringeDependencyRegistryEngine = TsyringeDependencyRegistryEngine.instance;
var defaultDependencyRegistryEngine = DefaultDependencyRegistryEngine.instance;
var DIService = class _DIService {
  static _engine = defaultDependencyRegistryEngine;
  static get engine() {
    return _DIService._engine;
  }
  static set engine(engine) {
    _DIService._engine = engine;
  }
  /**
   * @deprecated use DIService.engine instead
   */
  static get instance() {
    return _DIService.engine;
  }
};
export {
  AbstractConfigurableDependencyInjector,
  DIService,
  DefaultDependencyRegistryEngine,
  TsyringeDependencyRegistryEngine,
  TypeDiDependencyRegistryEngine,
  defaultDependencyRegistryEngine,
  tsyringeDependencyRegistryEngine,
  typeDiDependencyRegistryEngine
};
