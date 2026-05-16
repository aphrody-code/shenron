"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Decorator: () => Decorator,
  Modifier: () => Modifier,
  getLinkedObjects: () => getLinkedObjects
});
module.exports = __toCommonJS(index_exports);

// src/decorator/classes/Decorator.ts
var Decorator = class {
  _targetClass;
  _sourceClass;
  _propertyName;
  _methodReference;
  _parameterIndex;
  /**
   * The zero-based index of the parameter being decorated (parameter decorators only).
   */
  get index() {
    return this._parameterIndex;
  }
  /**
   * The class constructor where this decorator was applied.
   */
  get classRef() {
    return this._targetClass;
  }
  set classRef(value) {
    this._targetClass = value;
    this.from = value;
  }
  /**
   * The original class where the decoration was first applied.
   * May differ from `classRef` in inheritance scenarios.
   */
  get from() {
    return this._sourceClass;
  }
  set from(value) {
    this._sourceClass = value;
  }
  /**
   * The name of the property or method being decorated.
   */
  get key() {
    return this._propertyName;
  }
  /**
   * The actual method function reference (for method decorators).
   */
  get method() {
    return this._methodReference;
  }
  /**
   * Determines if this decorator was applied to a class constructor.
   */
  get isClass() {
    return !!this._methodReference;
  }
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
  attachToTarget(classConstructor, propertyKey, methodDescriptor, parameterIndex) {
    const isClassDecoration = methodDescriptor === void 0 && parameterIndex === void 0;
    const resolvedClass = isClassDecoration ? classConstructor : classConstructor.constructor;
    const resolvedPropertyName = isClassDecoration ? resolvedClass.name : propertyKey;
    const resolvedMethod = isClassDecoration ? resolvedClass : methodDescriptor?.value;
    return this.decorate(
      resolvedClass,
      resolvedPropertyName,
      resolvedMethod,
      resolvedClass,
      parameterIndex
    );
  }
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
  decorate(targetClass, propertyName, methodRef, sourceClass, parameterIndex) {
    this._sourceClass = sourceClass ?? targetClass;
    this._targetClass = targetClass;
    this._propertyName = propertyName;
    this._methodReference = methodRef;
    this._parameterIndex = parameterIndex;
    return this;
  }
};

// src/decorator/util.ts
function getLinkedObjects(referenceDecorator, decoratorCollection) {
  return decoratorCollection.filter((candidateDecorator) => {
    let isSameLocation = referenceDecorator.from === candidateDecorator.from && referenceDecorator.key === candidateDecorator.key;
    if (referenceDecorator.index !== void 0 && candidateDecorator.index !== void 0) {
      isSameLocation &&= referenceDecorator.index === candidateDecorator.index;
    }
    return isSameLocation;
  });
}

// src/decorator/classes/Modifier.ts
var Modifier = class _Modifier extends Decorator {
  _modificationFunction;
  _applicableDecoratorTypes;
  /**
   * Creates a new decorator modifier.
   * @param modificationFunction - The function that modifies target decorators.
   * @param applicableDecoratorTypes - The list of decorator types that can be modified.
   */
  constructor(modificationFunction, applicableDecoratorTypes) {
    super();
    this._modificationFunction = modificationFunction;
    this._applicableDecoratorTypes = applicableDecoratorTypes;
  }
  /**
   * Factory method for creating modifier instances with better type inference.
   * @param modificationFunction - The function that performs the modification.
   * @param applicableDecoratorTypes - The decorator types that can be modified.
   * @returns A new modifier instance.
   */
  static create(modificationFunction, ...applicableDecoratorTypes) {
    return new _Modifier(
      modificationFunction,
      applicableDecoratorTypes
    );
  }
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
  static async modify(modifierCollection, decoratorCollection) {
    await Promise.all(
      modifierCollection.map(async (modifier) => {
        let linkedDecorators = getLinkedObjects(modifier, decoratorCollection);
        linkedDecorators = linkedDecorators.filter(
          (linkedDecorator) => modifier._applicableDecoratorTypes.some(
            (decoratorType) => linkedDecorator instanceof decoratorType
          )
        );
        await Promise.all(
          linkedDecorators.map(
            (linkedDecorator) => modifier.apply(linkedDecorator)
          )
        );
      })
    );
  }
  /**
   * Applies this modifier's function to a specific decorator.
   * @param targetDecorator - The decorator to modify.
   * @returns The result of the modification function.
   */
  async apply(targetDecorator) {
    await this._modificationFunction(targetDecorator);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Decorator,
  Modifier,
  getLinkedObjects
});
