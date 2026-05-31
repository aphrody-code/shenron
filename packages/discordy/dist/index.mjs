var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.bun/reflect-metadata@0.2.2/node_modules/reflect-metadata/Reflect.js
var require_Reflect = __commonJS({
  "../../node_modules/.bun/reflect-metadata@0.2.2/node_modules/reflect-metadata/Reflect.js"() {
    "use strict";
    var Reflect2;
    (function(Reflect3) {
      (function(factory) {
        var root = typeof globalThis === "object" ? globalThis : typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
        var exporter = makeExporter(Reflect3);
        if (typeof root.Reflect !== "undefined") {
          exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter, root);
        if (typeof root.Reflect === "undefined") {
          root.Reflect = Reflect3;
        }
        function makeExporter(target, previous) {
          return function(key, value) {
            Object.defineProperty(target, key, { configurable: true, writable: true, value });
            if (previous)
              previous(key, value);
          };
        }
        function functionThis() {
          try {
            return Function("return this;")();
          } catch (_) {
          }
        }
        function indirectEvalThis() {
          try {
            return (void 0, eval)("(function() { return this; })()");
          } catch (_) {
          }
        }
        function sloppyModeThis() {
          return functionThis() || indirectEvalThis();
        }
      })(function(exporter, root) {
        var hasOwn = Object.prototype.hasOwnProperty;
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function";
        var supportsProto = { __proto__: [] } instanceof Array;
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
          // create an object in dictionary mode (a.k.a. "slow" mode in v8)
          create: supportsCreate ? function() {
            return MakeDictionary(/* @__PURE__ */ Object.create(null));
          } : supportsProto ? function() {
            return MakeDictionary({ __proto__: null });
          } : function() {
            return MakeDictionary({});
          },
          has: downLevel ? function(map, key) {
            return hasOwn.call(map, key);
          } : function(map, key) {
            return key in map;
          },
          get: downLevel ? function(map, key) {
            return hasOwn.call(map, key) ? map[key] : void 0;
          } : function(map, key) {
            return map[key];
          }
        };
        var functionPrototype = Object.getPrototypeOf(Function);
        var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : void 0;
        var metadataRegistry = GetOrCreateMetadataRegistry();
        var metadataProvider = CreateMetadataProvider(metadataRegistry);
        function decorate(decorators, target, propertyKey, attributes) {
          if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
              throw new TypeError();
            if (!IsObject(target))
              throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
              throw new TypeError();
            if (IsNull(attributes))
              attributes = void 0;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
          } else {
            if (!IsArray(decorators))
              throw new TypeError();
            if (!IsConstructor(target))
              throw new TypeError();
            return DecorateConstructor(decorators, target);
          }
        }
        exporter("decorate", decorate);
        function metadata(metadataKey, metadataValue) {
          function decorator(target, propertyKey) {
            if (!IsObject(target))
              throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
              throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
          }
          return decorator;
        }
        exporter("metadata", metadata);
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        function hasMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        function hasOwnMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        function getMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        function getOwnMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        function getMetadataKeys(target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        function getOwnMetadataKeys(target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        function deleteMetadata(metadataKey, target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
          var provider = GetMetadataProvider(
            target,
            propertyKey,
            /*Create*/
            false
          );
          if (IsUndefined(provider))
            return false;
          return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
          for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
              if (!IsConstructor(decorated))
                throw new TypeError();
              target = decorated;
            }
          }
          return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
          for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
              if (!IsObject(decorated))
                throw new TypeError();
              descriptor = decorated;
            }
          }
          return descriptor;
        }
        function OrdinaryHasMetadata(MetadataKey, O, P) {
          var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
          if (hasOwn2)
            return true;
          var parent = OrdinaryGetPrototypeOf(O);
          if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
          return false;
        }
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(provider))
            return false;
          return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
        }
        function OrdinaryGetMetadata(MetadataKey, O, P) {
          var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
          if (hasOwn2)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
          var parent = OrdinaryGetPrototypeOf(O);
          if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
          return void 0;
        }
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*Create*/
            false
          );
          if (IsUndefined(provider))
            return;
          return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
        }
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*Create*/
            true
          );
          provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
        }
        function OrdinaryMetadataKeys(O, P) {
          var ownKeys = OrdinaryOwnMetadataKeys(O, P);
          var parent = OrdinaryGetPrototypeOf(O);
          if (parent === null)
            return ownKeys;
          var parentKeys = OrdinaryMetadataKeys(parent, P);
          if (parentKeys.length <= 0)
            return ownKeys;
          if (ownKeys.length <= 0)
            return parentKeys;
          var set = new _Set();
          var keys = [];
          for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
              set.add(key);
              keys.push(key);
            }
          }
          for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
              set.add(key);
              keys.push(key);
            }
          }
          return keys;
        }
        function OrdinaryOwnMetadataKeys(O, P) {
          var provider = GetMetadataProvider(
            O,
            P,
            /*create*/
            false
          );
          if (!provider) {
            return [];
          }
          return provider.OrdinaryOwnMetadataKeys(O, P);
        }
        function Type(x) {
          if (x === null)
            return 1;
          switch (typeof x) {
            case "undefined":
              return 0;
            case "boolean":
              return 2;
            case "string":
              return 3;
            case "symbol":
              return 4;
            case "number":
              return 5;
            case "object":
              return x === null ? 1 : 6;
            default:
              return 6;
          }
        }
        function IsUndefined(x) {
          return x === void 0;
        }
        function IsNull(x) {
          return x === null;
        }
        function IsSymbol(x) {
          return typeof x === "symbol";
        }
        function IsObject(x) {
          return typeof x === "object" ? x !== null : typeof x === "function";
        }
        function ToPrimitive(input, PreferredType) {
          switch (Type(input)) {
            case 0:
              return input;
            case 1:
              return input;
            case 2:
              return input;
            case 3:
              return input;
            case 4:
              return input;
            case 5:
              return input;
          }
          var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
          var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
          if (exoticToPrim !== void 0) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
              throw new TypeError();
            return result;
          }
          return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        function OrdinaryToPrimitive(O, hint) {
          if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
              var result = toString_1.call(O);
              if (!IsObject(result))
                return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
              var result = valueOf.call(O);
              if (!IsObject(result))
                return result;
            }
          } else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
              var result = valueOf.call(O);
              if (!IsObject(result))
                return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
              var result = toString_2.call(O);
              if (!IsObject(result))
                return result;
            }
          }
          throw new TypeError();
        }
        function ToBoolean(argument) {
          return !!argument;
        }
        function ToString(argument) {
          return "" + argument;
        }
        function ToPropertyKey(argument) {
          var key = ToPrimitive(
            argument,
            3
            /* String */
          );
          if (IsSymbol(key))
            return key;
          return ToString(key);
        }
        function IsArray(argument) {
          return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
        }
        function IsCallable(argument) {
          return typeof argument === "function";
        }
        function IsConstructor(argument) {
          return typeof argument === "function";
        }
        function IsPropertyKey(argument) {
          switch (Type(argument)) {
            case 3:
              return true;
            case 4:
              return true;
            default:
              return false;
          }
        }
        function SameValueZero(x, y) {
          return x === y || x !== x && y !== y;
        }
        function GetMethod(V, P) {
          var func = V[P];
          if (func === void 0 || func === null)
            return void 0;
          if (!IsCallable(func))
            throw new TypeError();
          return func;
        }
        function GetIterator(obj) {
          var method = GetMethod(obj, iteratorSymbol);
          if (!IsCallable(method))
            throw new TypeError();
          var iterator = method.call(obj);
          if (!IsObject(iterator))
            throw new TypeError();
          return iterator;
        }
        function IteratorValue(iterResult) {
          return iterResult.value;
        }
        function IteratorStep(iterator) {
          var result = iterator.next();
          return result.done ? false : result;
        }
        function IteratorClose(iterator) {
          var f = iterator["return"];
          if (f)
            f.call(iterator);
        }
        function OrdinaryGetPrototypeOf(O) {
          var proto = Object.getPrototypeOf(O);
          if (typeof O !== "function" || O === functionPrototype)
            return proto;
          if (proto !== functionPrototype)
            return proto;
          var prototype = O.prototype;
          var prototypeProto = prototype && Object.getPrototypeOf(prototype);
          if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
          var constructor = prototypeProto.constructor;
          if (typeof constructor !== "function")
            return proto;
          if (constructor === O)
            return proto;
          return constructor;
        }
        function CreateMetadataRegistry() {
          var fallback;
          if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") {
            fallback = CreateFallbackProvider(root.Reflect);
          }
          var first;
          var second;
          var rest;
          var targetProviderMap = new _WeakMap();
          var registry = {
            registerProvider,
            getProvider,
            setProvider
          };
          return registry;
          function registerProvider(provider) {
            if (!Object.isExtensible(registry)) {
              throw new Error("Cannot add provider to a frozen registry.");
            }
            switch (true) {
              case fallback === provider:
                break;
              case IsUndefined(first):
                first = provider;
                break;
              case first === provider:
                break;
              case IsUndefined(second):
                second = provider;
                break;
              case second === provider:
                break;
              default:
                if (rest === void 0)
                  rest = new _Set();
                rest.add(provider);
                break;
            }
          }
          function getProviderNoCache(O, P) {
            if (!IsUndefined(first)) {
              if (first.isProviderFor(O, P))
                return first;
              if (!IsUndefined(second)) {
                if (second.isProviderFor(O, P))
                  return first;
                if (!IsUndefined(rest)) {
                  var iterator = GetIterator(rest);
                  while (true) {
                    var next = IteratorStep(iterator);
                    if (!next) {
                      return void 0;
                    }
                    var provider = IteratorValue(next);
                    if (provider.isProviderFor(O, P)) {
                      IteratorClose(iterator);
                      return provider;
                    }
                  }
                }
              }
            }
            if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
              return fallback;
            }
            return void 0;
          }
          function getProvider(O, P) {
            var providerMap = targetProviderMap.get(O);
            var provider;
            if (!IsUndefined(providerMap)) {
              provider = providerMap.get(P);
            }
            if (!IsUndefined(provider)) {
              return provider;
            }
            provider = getProviderNoCache(O, P);
            if (!IsUndefined(provider)) {
              if (IsUndefined(providerMap)) {
                providerMap = new _Map();
                targetProviderMap.set(O, providerMap);
              }
              providerMap.set(P, provider);
            }
            return provider;
          }
          function hasProvider(provider) {
            if (IsUndefined(provider))
              throw new TypeError();
            return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
          }
          function setProvider(O, P, provider) {
            if (!hasProvider(provider)) {
              throw new Error("Metadata provider not registered.");
            }
            var existingProvider = getProvider(O, P);
            if (existingProvider !== provider) {
              if (!IsUndefined(existingProvider)) {
                return false;
              }
              var providerMap = targetProviderMap.get(O);
              if (IsUndefined(providerMap)) {
                providerMap = new _Map();
                targetProviderMap.set(O, providerMap);
              }
              providerMap.set(P, provider);
            }
            return true;
          }
        }
        function GetOrCreateMetadataRegistry() {
          var metadataRegistry2;
          if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
            metadataRegistry2 = root.Reflect[registrySymbol];
          }
          if (IsUndefined(metadataRegistry2)) {
            metadataRegistry2 = CreateMetadataRegistry();
          }
          if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
            Object.defineProperty(root.Reflect, registrySymbol, {
              enumerable: false,
              configurable: false,
              writable: false,
              value: metadataRegistry2
            });
          }
          return metadataRegistry2;
        }
        function CreateMetadataProvider(registry) {
          var metadata2 = new _WeakMap();
          var provider = {
            isProviderFor: function(O, P) {
              var targetMetadata = metadata2.get(O);
              if (IsUndefined(targetMetadata))
                return false;
              return targetMetadata.has(P);
            },
            OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata2,
            OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata2,
            OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata2,
            OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys2,
            OrdinaryDeleteMetadata
          };
          metadataRegistry.registerProvider(provider);
          return provider;
          function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = metadata2.get(O);
            var createdTargetMetadata = false;
            if (IsUndefined(targetMetadata)) {
              if (!Create)
                return void 0;
              targetMetadata = new _Map();
              metadata2.set(O, targetMetadata);
              createdTargetMetadata = true;
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
              if (!Create)
                return void 0;
              metadataMap = new _Map();
              targetMetadata.set(P, metadataMap);
              if (!registry.setProvider(O, P, provider)) {
                targetMetadata.delete(P);
                if (createdTargetMetadata) {
                  metadata2.delete(O);
                }
                throw new Error("Wrong provider for target.");
              }
            }
            return metadataMap;
          }
          function OrdinaryHasOwnMetadata2(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap))
              return false;
            return ToBoolean(metadataMap.has(MetadataKey));
          }
          function OrdinaryGetOwnMetadata2(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap))
              return void 0;
            return metadataMap.get(MetadataKey);
          }
          function OrdinaryDefineOwnMetadata2(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              true
            );
            metadataMap.set(MetadataKey, MetadataValue);
          }
          function OrdinaryOwnMetadataKeys2(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap))
              return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
              var next = IteratorStep(iterator);
              if (!next) {
                keys.length = k;
                return keys;
              }
              var nextValue = IteratorValue(next);
              try {
                keys[k] = nextValue;
              } catch (e) {
                try {
                  IteratorClose(iterator);
                } finally {
                  throw e;
                }
              }
              k++;
            }
          }
          function OrdinaryDeleteMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(
              O,
              P,
              /*Create*/
              false
            );
            if (IsUndefined(metadataMap))
              return false;
            if (!metadataMap.delete(MetadataKey))
              return false;
            if (metadataMap.size === 0) {
              var targetMetadata = metadata2.get(O);
              if (!IsUndefined(targetMetadata)) {
                targetMetadata.delete(P);
                if (targetMetadata.size === 0) {
                  metadata2.delete(targetMetadata);
                }
              }
            }
            return true;
          }
        }
        function CreateFallbackProvider(reflect) {
          var defineMetadata2 = reflect.defineMetadata, hasOwnMetadata2 = reflect.hasOwnMetadata, getOwnMetadata2 = reflect.getOwnMetadata, getOwnMetadataKeys2 = reflect.getOwnMetadataKeys, deleteMetadata2 = reflect.deleteMetadata;
          var metadataOwner = new _WeakMap();
          var provider = {
            isProviderFor: function(O, P) {
              var metadataPropertySet = metadataOwner.get(O);
              if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
                return true;
              }
              if (getOwnMetadataKeys2(O, P).length) {
                if (IsUndefined(metadataPropertySet)) {
                  metadataPropertySet = new _Set();
                  metadataOwner.set(O, metadataPropertySet);
                }
                metadataPropertySet.add(P);
                return true;
              }
              return false;
            },
            OrdinaryDefineOwnMetadata: defineMetadata2,
            OrdinaryHasOwnMetadata: hasOwnMetadata2,
            OrdinaryGetOwnMetadata: getOwnMetadata2,
            OrdinaryOwnMetadataKeys: getOwnMetadataKeys2,
            OrdinaryDeleteMetadata: deleteMetadata2
          };
          return provider;
        }
        function GetMetadataProvider(O, P, Create) {
          var registeredProvider = metadataRegistry.getProvider(O, P);
          if (!IsUndefined(registeredProvider)) {
            return registeredProvider;
          }
          if (Create) {
            if (metadataRegistry.setProvider(O, P, metadataProvider)) {
              return metadataProvider;
            }
            throw new Error("Illegal state.");
          }
          return void 0;
        }
        function CreateMapPolyfill() {
          var cacheSentinel = {};
          var arraySentinel = [];
          var MapIterator = (
            /** @class */
            (function() {
              function MapIterator2(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
              }
              MapIterator2.prototype["@@iterator"] = function() {
                return this;
              };
              MapIterator2.prototype[iteratorSymbol] = function() {
                return this;
              };
              MapIterator2.prototype.next = function() {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                  var result = this._selector(this._keys[index], this._values[index]);
                  if (index + 1 >= this._keys.length) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  } else {
                    this._index++;
                  }
                  return { value: result, done: false };
                }
                return { value: void 0, done: true };
              };
              MapIterator2.prototype.throw = function(error) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                throw error;
              };
              MapIterator2.prototype.return = function(value) {
                if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
                }
                return { value, done: true };
              };
              return MapIterator2;
            })()
          );
          var Map2 = (
            /** @class */
            (function() {
              function Map3() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }
              Object.defineProperty(Map3.prototype, "size", {
                get: function() {
                  return this._keys.length;
                },
                enumerable: true,
                configurable: true
              });
              Map3.prototype.has = function(key) {
                return this._find(
                  key,
                  /*insert*/
                  false
                ) >= 0;
              };
              Map3.prototype.get = function(key) {
                var index = this._find(
                  key,
                  /*insert*/
                  false
                );
                return index >= 0 ? this._values[index] : void 0;
              };
              Map3.prototype.set = function(key, value) {
                var index = this._find(
                  key,
                  /*insert*/
                  true
                );
                this._values[index] = value;
                return this;
              };
              Map3.prototype.delete = function(key) {
                var index = this._find(
                  key,
                  /*insert*/
                  false
                );
                if (index >= 0) {
                  var size = this._keys.length;
                  for (var i = index + 1; i < size; i++) {
                    this._keys[i - 1] = this._keys[i];
                    this._values[i - 1] = this._values[i];
                  }
                  this._keys.length--;
                  this._values.length--;
                  if (SameValueZero(key, this._cacheKey)) {
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                  }
                  return true;
                }
                return false;
              };
              Map3.prototype.clear = function() {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              };
              Map3.prototype.keys = function() {
                return new MapIterator(this._keys, this._values, getKey);
              };
              Map3.prototype.values = function() {
                return new MapIterator(this._keys, this._values, getValue);
              };
              Map3.prototype.entries = function() {
                return new MapIterator(this._keys, this._values, getEntry);
              };
              Map3.prototype["@@iterator"] = function() {
                return this.entries();
              };
              Map3.prototype[iteratorSymbol] = function() {
                return this.entries();
              };
              Map3.prototype._find = function(key, insert) {
                if (!SameValueZero(this._cacheKey, key)) {
                  this._cacheIndex = -1;
                  for (var i = 0; i < this._keys.length; i++) {
                    if (SameValueZero(this._keys[i], key)) {
                      this._cacheIndex = i;
                      break;
                    }
                  }
                }
                if (this._cacheIndex < 0 && insert) {
                  this._cacheIndex = this._keys.length;
                  this._keys.push(key);
                  this._values.push(void 0);
                }
                return this._cacheIndex;
              };
              return Map3;
            })()
          );
          return Map2;
          function getKey(key, _) {
            return key;
          }
          function getValue(_, value) {
            return value;
          }
          function getEntry(key, value) {
            return [key, value];
          }
        }
        function CreateSetPolyfill() {
          var Set2 = (
            /** @class */
            (function() {
              function Set3() {
                this._map = new _Map();
              }
              Object.defineProperty(Set3.prototype, "size", {
                get: function() {
                  return this._map.size;
                },
                enumerable: true,
                configurable: true
              });
              Set3.prototype.has = function(value) {
                return this._map.has(value);
              };
              Set3.prototype.add = function(value) {
                return this._map.set(value, value), this;
              };
              Set3.prototype.delete = function(value) {
                return this._map.delete(value);
              };
              Set3.prototype.clear = function() {
                this._map.clear();
              };
              Set3.prototype.keys = function() {
                return this._map.keys();
              };
              Set3.prototype.values = function() {
                return this._map.keys();
              };
              Set3.prototype.entries = function() {
                return this._map.entries();
              };
              Set3.prototype["@@iterator"] = function() {
                return this.keys();
              };
              Set3.prototype[iteratorSymbol] = function() {
                return this.keys();
              };
              return Set3;
            })()
          );
          return Set2;
        }
        function CreateWeakMapPolyfill() {
          var UUID_SIZE = 16;
          var keys = HashMap.create();
          var rootKey = CreateUniqueKey();
          return (
            /** @class */
            (function() {
              function WeakMap2() {
                this._key = CreateUniqueKey();
              }
              WeakMap2.prototype.has = function(target) {
                var table = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  false
                );
                return table !== void 0 ? HashMap.has(table, this._key) : false;
              };
              WeakMap2.prototype.get = function(target) {
                var table = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  false
                );
                return table !== void 0 ? HashMap.get(table, this._key) : void 0;
              };
              WeakMap2.prototype.set = function(target, value) {
                var table = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  true
                );
                table[this._key] = value;
                return this;
              };
              WeakMap2.prototype.delete = function(target) {
                var table = GetOrCreateWeakMapTable(
                  target,
                  /*create*/
                  false
                );
                return table !== void 0 ? delete table[this._key] : false;
              };
              WeakMap2.prototype.clear = function() {
                this._key = CreateUniqueKey();
              };
              return WeakMap2;
            })()
          );
          function CreateUniqueKey() {
            var key;
            do
              key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
          }
          function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
              if (!create)
                return void 0;
              Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
          }
          function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
              buffer[i] = Math.random() * 255 | 0;
            return buffer;
          }
          function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
              var array = new Uint8Array(size);
              if (typeof crypto !== "undefined") {
                crypto.getRandomValues(array);
              } else if (typeof msCrypto !== "undefined") {
                msCrypto.getRandomValues(array);
              } else {
                FillRandomBytes(array, size);
              }
              return array;
            }
            return FillRandomBytes(new Array(size), size);
          }
          function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            data[6] = data[6] & 79 | 64;
            data[8] = data[8] & 191 | 128;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
              var byte = data[offset];
              if (offset === 4 || offset === 6 || offset === 8)
                result += "-";
              if (byte < 16)
                result += "0";
              result += byte.toString(16).toLowerCase();
            }
            return result;
          }
        }
        function MakeDictionary(obj) {
          obj.__ = void 0;
          delete obj.__;
          return obj;
        }
      });
    })(Reflect2 || (Reflect2 = {}));
  }
});

// src/index.ts
var import_reflect_metadata = __toESM(require_Reflect());
export * from "@rpbey/di";
export * from "@rpbey/internal";

// src/Client.ts
import {
  Client as ClientJS
} from "discord.js";
var Client = class _Client extends ClientJS {
  // Core properties
  _botId;
  _isBuilt = false;
  _prefix;
  _simpleCommandConfig;
  _silent;
  _botGuilds = [];
  _guards = [];
  logger;
  // Managers
  applicationCommandManager;
  interactionHandler;
  simpleCommandManager;
  reactionManager;
  debugManager;
  // Core getters/setters
  get botId() {
    return this._botId;
  }
  set botId(value) {
    this._botId = value;
  }
  get silent() {
    return this._silent;
  }
  set silent(value) {
    this._silent = value;
  }
  get guards() {
    return this._guards;
  }
  set guards(value) {
    this._guards = value;
  }
  get prefix() {
    return this._prefix;
  }
  set prefix(value) {
    this._prefix = value;
  }
  get simpleCommandConfig() {
    return this._simpleCommandConfig;
  }
  set simpleCommandConfig(value) {
    this._simpleCommandConfig = value;
  }
  get botGuilds() {
    return this._botGuilds;
  }
  set botGuilds(value) {
    this._botGuilds = value;
  }
  get botResolvedGuilds() {
    return resolveIGuilds(this, void 0, this._botGuilds);
  }
  get instance() {
    return MetadataStorage.instance;
  }
  // Proxy getters to MetadataStorage (static)
  static get applicationCommands() {
    return MetadataStorage.instance.applicationCommands;
  }
  static get applicationCommandSlashes() {
    return MetadataStorage.instance.applicationCommandSlashes;
  }
  static get applicationCommandSlashesFlat() {
    return MetadataStorage.instance.applicationCommandSlashesFlat;
  }
  static get applicationCommandSlashOptions() {
    return MetadataStorage.instance.applicationCommandSlashOptions;
  }
  static get applicationCommandSlashGroups() {
    return MetadataStorage.instance.applicationCommandSlashGroups;
  }
  static get applicationCommandSlashSubGroups() {
    return MetadataStorage.instance.applicationCommandSlashSubGroups;
  }
  static get applicationCommandUsers() {
    return MetadataStorage.instance.applicationCommandUsers;
  }
  static get applicationCommandMessages() {
    return MetadataStorage.instance.applicationCommandMessages;
  }
  static get events() {
    return MetadataStorage.instance.events;
  }
  static get discords() {
    return MetadataStorage.instance.discords;
  }
  static get buttonComponents() {
    return MetadataStorage.instance.buttonComponents;
  }
  static get modalComponents() {
    return MetadataStorage.instance.modalComponents;
  }
  static get selectMenuComponents() {
    return MetadataStorage.instance.selectMenuComponents;
  }
  static get reactions() {
    return MetadataStorage.instance.reactions;
  }
  static get simpleCommands() {
    return MetadataStorage.instance.simpleCommands;
  }
  static get simpleCommandsByName() {
    return MetadataStorage.instance.simpleCommandsByName;
  }
  static get simpleCommandMappedPrefix() {
    return MetadataStorage.instance.simpleCommandMappedPrefix;
  }
  static get instance() {
    return MetadataStorage.instance;
  }
  // Proxy getters to MetadataStorage (instance)
  get applicationCommands() {
    return _Client.applicationCommands;
  }
  get applicationCommandSlashes() {
    return _Client.applicationCommandSlashes;
  }
  get applicationCommandSlashesFlat() {
    return _Client.applicationCommandSlashesFlat;
  }
  get applicationCommandSlashOptions() {
    return _Client.applicationCommandSlashOptions;
  }
  get applicationCommandSlashGroups() {
    return _Client.applicationCommandSlashGroups;
  }
  get applicationCommandSlashSubGroups() {
    return _Client.applicationCommandSlashSubGroups;
  }
  get applicationCommandUsers() {
    return _Client.applicationCommandUsers;
  }
  get applicationCommandMessages() {
    return _Client.applicationCommandMessages;
  }
  get events() {
    return _Client.events;
  }
  get discords() {
    return _Client.discords;
  }
  get buttonComponents() {
    return _Client.buttonComponents;
  }
  get modalComponents() {
    return _Client.modalComponents;
  }
  get selectMenuComponents() {
    return _Client.selectMenuComponents;
  }
  get reactions() {
    return _Client.reactions;
  }
  get simpleCommands() {
    return _Client.simpleCommands;
  }
  get simpleCommandsByName() {
    return _Client.simpleCommandsByName;
  }
  get simpleCommandMappedPrefix() {
    return _Client.simpleCommandMappedPrefix;
  }
  constructor(options) {
    super(options);
    this._silent = options.silent ?? true;
    this._guards = options.guards ?? [];
    this._botGuilds = options.botGuilds ?? [];
    this._botId = options.botId ?? "bot";
    this._prefix = options.simpleCommand?.prefix ?? ["!"];
    this._simpleCommandConfig = options.simpleCommand;
    this.logger = options.logger ?? console;
    this.applicationCommandManager = new ApplicationCommandManager(this);
    this.interactionHandler = new InteractionHandler(this);
    this.simpleCommandManager = new SimpleCommandManager(this);
    this.reactionManager = new ReactionManager(this);
    this.debugManager = new DebugManager(this);
  }
  /**
   * Start bot
   */
  async login(token) {
    await this.build();
    if (!this.silent) {
      this.logger.log(
        `${this.user?.username ?? this.botId} >> connecting discord...
`
      );
    }
    return super.login(token);
  }
  /**
   * Build the client and initialize all systems
   */
  async build() {
    if (this._isBuilt) return;
    this._isBuilt = true;
    await this.instance.build();
    this.instance.eventManager.initEvents(this);
    if (!this.silent) {
      this.debugManager.printDebug();
    }
  }
  // === Application Command Management ===
  async initApplicationCommands(retainDeleted = false) {
    return this.applicationCommandManager.initApplicationCommands(
      retainDeleted
    );
  }
  async clearApplicationCommands(...guilds) {
    return this.applicationCommandManager.clearApplicationCommands(...guilds);
  }
  // === Interaction Handling ===
  executeInteraction(interaction) {
    return this.interactionHandler.executeInteraction(interaction);
  }
  // === Simple Command Management ===
  async parseCommand(message, caseSensitive = false) {
    return this.simpleCommandManager.parseCommand(message, caseSensitive);
  }
  async executeCommand(message, caseSensitive) {
    return this.simpleCommandManager.executeCommand(message, caseSensitive);
  }
  // === Reaction Management ===
  async executeReaction(reaction, user) {
    return this.reactionManager.executeReaction(reaction, user);
  }
  // === Event Management ===
  trigger(options, params) {
    const triggerFn = this.instance.eventManager.trigger(this, options);
    return triggerFn(params);
  }
  /**
   * Bind discordx events to client
   */
  initEvents() {
    this.instance.eventManager.initEvents(this);
  }
  /**
   * Unbind all discordx events initialized by the initEvents method.
   */
  removeEvents() {
    this.instance.eventManager.removeEvents();
  }
  // === Debug ===
  printDebug() {
    this.debugManager.printDebug();
  }
};

// src/classes/Mixin/ApplicationCommandMixin.ts
var ApplicationCommandMixin = class {
  constructor(command, instance) {
    this.command = command;
    this.instance = instance;
  }
  get name() {
    return this.command.name;
  }
  get description() {
    return this.command.description;
  }
};

// src/classes/SimpleCommandMessage.ts
import crypto2 from "crypto";
import { EmbedBuilder } from "discord.js";
var SimpleCommandMessage = class {
  constructor(prefix, argString, message, info, splitter) {
    this.prefix = prefix;
    this.argString = argString;
    this.message = message;
    this.info = info;
    this.splitter = splitter;
  }
  options = [];
  get name() {
    return this.info.name;
  }
  get description() {
    return this.info.description;
  }
  /**
   * Resolve options
   */
  resolveOptions() {
    return this.info.parseParamsEx(this);
  }
  /**
   * Verify that all options are valid
   *
   * @returns
   */
  isValid() {
    return !this.options.includes(null);
  }
  /**
   * Get related commands
   *
   * @returns
   */
  getRelatedCommands() {
    const commandName = this.info.name.split(" ")[0];
    if (!commandName) {
      return [];
    }
    return MetadataStorage.instance.simpleCommands.filter(
      (cmd) => cmd.name.startsWith(commandName) && cmd.name !== this.info.name
    );
  }
  /**
   * Send usage syntax for command
   *
   * @returns
   */
  sendUsageSyntax() {
    const maxLength = !this.info.options.length ? 0 : this.info.options.reduce(
      (a, b) => a.name.length > b.name.length ? a : b
    ).name.length;
    const embed = new EmbedBuilder();
    embed.setColor(crypto2.randomInt(654321));
    embed.setTitle("Command Info");
    embed.addFields({ name: "Name", value: this.info.name });
    embed.addFields({ name: "Description", value: this.info.description });
    if (this.info.aliases.length) {
      embed.addFields({ name: "Aliases", value: this.info.aliases.join(", ") });
    }
    embed.addFields({
      name: "Command Usage",
      value: `\`\`\`${this.prefix}${this.name} ${this.info.options.map((op) => `{${op.name}: ${SimpleCommandOptionType[op.type]}}`).join(" ")}\`\`\``
    });
    if (this.info.options.length) {
      embed.addFields({
        name: "Options",
        value: `\`\`\`${this.info.options.map((op) => `${op.name.padEnd(maxLength + 2)}: ${op.description}`).join("\n")}\`\`\``
      });
    }
    return this.message.reply({ embeds: [embed] });
  }
};

// src/decorators/classes/DApplicationCommand.ts
import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType
} from "discord.js";

// src/decorators/classes/Method.ts
import { Decorator } from "@rpbey/internal";
var Method = class extends Decorator {
  _discord;
  _guards = [];
  get discord() {
    return this._discord;
  }
  set discord(value) {
    this._discord = value;
  }
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
  get execute() {
    return (guards, ...params) => {
      const globalGuards = guards.map(
        (guard) => DGuard.create(guard.bind(void 0))
      );
      return this.createGuardChain(globalGuards)(...params);
    };
  }
  /**
   * Gets all guards that will be executed for this method.
   *
   * Combines guards in this order:
   * 1. Global guards from the Discord client
   * 2. Class-level guards from @Discord decorator
   * 3. Method-specific guards from this method
   * 4. The main method itself (as the final "guard")
   */
  get guards() {
    return [
      ...this.discord.guards,
      ...this._guards,
      DGuard.create(this._methodReference?.bind(this._discord.instance))
    ];
  }
  set guards(value) {
    this._guards = value;
  }
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
  createGuardChain(globalGuards) {
    const allGuards = [...globalGuards, ...this.guards];
    const executeNext = async (params, index, sharedData) => {
      const currentGuard = allGuards[index];
      const isLastGuard = index >= allGuards.length - 1;
      let result;
      if (isLastGuard) {
        const parsedParams = await this.parseParams(...params);
        const allArgs = [...parsedParams, ...params, sharedData];
        result = await currentGuard?.fn.apply(null, allArgs);
      } else {
        const nextFn = () => executeNext(params, index + 1, sharedData);
        const allArgs = [...params, nextFn, sharedData];
        result = await currentGuard?.fn.apply(null, allArgs);
      }
      return result ?? sharedData;
    };
    return (...params) => executeNext(params, 0, {});
  }
};

// src/decorators/classes/DApplicationCommand.ts
var DApplicationCommand = class _DApplicationCommand extends Method {
  _botIds;
  _contexts;
  _defaultMemberPermissions;
  _description;
  _descriptionLocalizations;
  _dmPermission;
  _group;
  _guilds;
  _integrationTypes;
  _name;
  _nameLocalizations;
  _nsfw;
  _options = [];
  _subgroup;
  _type;
  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }
  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }
  get defaultMemberPermissions() {
    return this._defaultMemberPermissions;
  }
  set defaultMemberPermissions(value) {
    this._defaultMemberPermissions = value;
  }
  get dmPermission() {
    return this._dmPermission;
  }
  set dmPermission(value) {
    this._dmPermission = value;
  }
  get contexts() {
    return this._contexts;
  }
  set contexts(value) {
    this._contexts = value;
  }
  get integrationTypes() {
    return this._integrationTypes;
  }
  set integrationTypes(value) {
    this._integrationTypes = value;
  }
  get descriptionLocalizations() {
    return this._descriptionLocalizations;
  }
  set descriptionLocalizations(value) {
    this._descriptionLocalizations = value;
  }
  get group() {
    return this._group;
  }
  set group(value) {
    this._group = value;
  }
  get guilds() {
    return this._guilds;
  }
  set guilds(value) {
    this._guilds = value;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get nameLocalizations() {
    return this._nameLocalizations;
  }
  set nameLocalizations(value) {
    this._nameLocalizations = value;
  }
  get nsfw() {
    return this._nsfw;
  }
  set nsfw(value) {
    this._nsfw = value;
  }
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
  }
  get subgroup() {
    return this._subgroup;
  }
  set subgroup(value) {
    this._subgroup = value;
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  constructor(data) {
    super();
    this._botIds = data.botIds ?? [];
    this._contexts = data.contexts ?? null;
    this._defaultMemberPermissions = data.defaultMemberPermissions ?? null;
    this._description = data.description;
    this._descriptionLocalizations = data.descriptionLocalizations ?? null;
    this._dmPermission = data.dmPermission ?? true;
    this._guilds = data.guilds ?? [];
    this._integrationTypes = data.integrationTypes ?? [
      ApplicationIntegrationType.GuildInstall
    ];
    this._name = data.name;
    this._nameLocalizations = data.nameLocalizations ?? null;
    this._nsfw = data.nsfw ?? false;
    this._type = data.type;
  }
  static create(data) {
    return new _DApplicationCommand(data);
  }
  isBotAllowed(botId) {
    if (!this.botIds.length) {
      return true;
    }
    return this.botIds.includes(botId);
  }
  async getGuilds(client) {
    const guilds = await resolveIGuilds(client, this, [
      ...client.botGuilds,
      ...this.guilds
    ]);
    return guilds;
  }
  async isGuildAllowed(client, guildId) {
    if (!guildId) {
      return true;
    }
    const guilds = await this.getGuilds(client);
    if (!guilds.length) {
      return true;
    }
    return guilds.includes(guildId);
  }
  toSubCommand() {
    const option = DApplicationCommandOption.create({
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      type: ApplicationCommandOptionType.Subcommand
    }).decorate(this.classRef, this.key, this.method, this.from, this.index);
    option.options = this.options;
    return option;
  }
  toJSON() {
    const options = [...this.options].reverse().sort((a, b) => {
      if ((a.type === ApplicationCommandOptionType.Subcommand || a.type === ApplicationCommandOptionType.SubcommandGroup) && (b.type === ApplicationCommandOptionType.Subcommand || b.type === ApplicationCommandOptionType.SubcommandGroup)) {
        return a.name < b.name ? -1 : 1;
      }
      return 0;
    }).map((option) => option.toJSON());
    const data = {
      contexts: this.contexts,
      defaultMemberPermissions: this.defaultMemberPermissions,
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      dmPermission: this.dmPermission,
      integrationTypes: this.integrationTypes,
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      nsfw: this.nsfw,
      options,
      type: this.type
    };
    return data;
  }
  parseParams(interaction) {
    return Promise.all(
      [...this.options].reverse().map((op) => op.parse(interaction))
    );
  }
};

// src/decorators/classes/DApplicationCommandGroup.ts
import { Decorator as Decorator2 } from "@rpbey/internal";
var DApplicationCommandGroup = class _DApplicationCommandGroup extends Decorator2 {
  name;
  root;
  payload;
  constructor(options) {
    super();
    this.name = options.name;
    this.root = options.root;
    this.payload = options.payload;
  }
  static create(options) {
    return new _DApplicationCommandGroup(options);
  }
};

// src/decorators/classes/DApplicationCommandOption.ts
import { Decorator as Decorator3 } from "@rpbey/internal";
import {
  ApplicationCommandOptionType as ApplicationCommandOptionType2
} from "discord.js";
var DApplicationCommandOption = class _DApplicationCommandOption extends Decorator3 {
  _autocomplete;
  _channelTypes = void 0;
  _choices = [];
  _description;
  _descriptionLocalizations;
  _name;
  _nameLocalizations;
  _maxValue;
  _minValue;
  _maxLength;
  _minLength;
  _options = [];
  _required = true;
  _type;
  _transformer;
  get autocomplete() {
    return this._autocomplete;
  }
  set autocomplete(value) {
    this._autocomplete = value;
  }
  get channelTypes() {
    return this._channelTypes;
  }
  set channelTypes(value) {
    this._channelTypes = value;
  }
  get choices() {
    return this._choices;
  }
  set choices(value) {
    this._choices = value;
  }
  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }
  get descriptionLocalizations() {
    return this._descriptionLocalizations;
  }
  set descriptionLocalizations(value) {
    this._descriptionLocalizations = value;
  }
  get isNode() {
    return this.type === ApplicationCommandOptionType2.Subcommand || this.type === ApplicationCommandOptionType2.SubcommandGroup;
  }
  get maxValue() {
    return this._maxValue;
  }
  set maxValue(value) {
    this._maxValue = value;
  }
  get minValue() {
    return this._minValue;
  }
  set minValue(value) {
    this._minValue = value;
  }
  get maxLength() {
    return this._maxLength;
  }
  set maxLength(value) {
    this._maxLength = value;
  }
  get minLength() {
    return this._minLength;
  }
  set minLength(value) {
    this._minLength = value;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get nameLocalizations() {
    return this._nameLocalizations;
  }
  set nameLocalizations(value) {
    this._nameLocalizations = value;
  }
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = value;
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  constructor(data) {
    super();
    this._name = data.name;
    this._autocomplete = data.autocomplete;
    this._channelTypes = data.channelType?.sort();
    this._choices = data.choices ?? [];
    this._description = data.description;
    this._parameterIndex = data.index;
    this._maxValue = data.maxValue;
    this._minValue = data.minValue;
    this._maxLength = data.maxLength;
    this._minLength = data.minLength;
    this._required = data.required ?? false;
    this._type = data.type;
    this._descriptionLocalizations = data.descriptionLocalizations ?? null;
    this._nameLocalizations = data.nameLocalizations ?? null;
    this._transformer = data.transformer;
  }
  static create(data) {
    return new _DApplicationCommandOption(data);
  }
  toJSON() {
    const options = [...this.options].reverse().map((option) => option.toJSON());
    const data = {
      autocomplete: this.autocomplete ? true : void 0,
      channelTypes: this.channelTypes,
      choices: this.isNode ? void 0 : this.choices.length === 0 ? void 0 : this.choices.map((choice) => choice.toJSON()),
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      maxLength: this.maxLength,
      maxValue: this.maxValue,
      minLength: this.minLength,
      minValue: this.minValue,
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      options: options.length === 0 ? void 0 : options,
      required: this.isNode ? void 0 : this.required,
      type: this.type
    };
    return data;
  }
  parseType(interaction) {
    switch (this.type) {
      case ApplicationCommandOptionType2.Attachment:
        return interaction.options.getAttachment(this.name) ?? void 0;
      case ApplicationCommandOptionType2.String:
        return interaction.options.getString(this.name) ?? void 0;
      case ApplicationCommandOptionType2.Boolean:
        return interaction.options.getBoolean(this.name) ?? void 0;
      case ApplicationCommandOptionType2.Number:
        return interaction.options.getNumber(this.name) ?? void 0;
      case ApplicationCommandOptionType2.Integer:
        return interaction.options.getInteger(this.name) ?? void 0;
      case ApplicationCommandOptionType2.Role:
        return interaction.options.getRole(this.name) ?? void 0;
      case ApplicationCommandOptionType2.Channel:
        return interaction.options.getChannel(this.name) ?? void 0;
      case ApplicationCommandOptionType2.Mentionable:
        return interaction.options.getMentionable(this.name) ?? void 0;
      case ApplicationCommandOptionType2.User:
        return interaction.options.getMember(this.name) ?? interaction.options.getUser(this.name) ?? void 0;
      default:
        return interaction.options.getString(this.name) ?? void 0;
    }
  }
  parse(interaction) {
    if (this._transformer !== void 0) {
      return this._transformer(this.parseType(interaction), interaction);
    }
    return this.parseType(interaction);
  }
};

// src/decorators/classes/DApplicationCommandOptionChoice.ts
import { Decorator as Decorator4 } from "@rpbey/internal";
var DApplicationCommandOptionChoice = class _DApplicationCommandOptionChoice extends Decorator4 {
  _name;
  _nameLocalizations;
  _value;
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get nameLocalizations() {
    return this._nameLocalizations;
  }
  set nameLocalizations(value) {
    this._nameLocalizations = value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  constructor(data) {
    super();
    this._name = data.name;
    this._nameLocalizations = data.nameLocalizations ?? null;
    this._value = data.value ?? data.name;
  }
  static create(data) {
    return new _DApplicationCommandOptionChoice(data);
  }
  toJSON() {
    return {
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      value: this.value
    };
  }
};

// src/decorators/classes/DComponent.ts
var DComponent = class _DComponent extends Method {
  _type;
  _id;
  _guilds;
  _botIds;
  get type() {
    return this._type;
  }
  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
  }
  get guilds() {
    return this._guilds;
  }
  set guilds(value) {
    this._guilds = value;
  }
  constructor(data) {
    super();
    this._type = data.type;
    this._id = data.id;
    this._guilds = data.guilds ?? [];
    this._botIds = data.botIds ?? [];
  }
  static create(data) {
    return new _DComponent(data);
  }
  isBotAllowed(botId) {
    if (!this.botIds.length) {
      return true;
    }
    return this.botIds.includes(botId);
  }
  async getGuilds(client) {
    const guilds = await resolveIGuilds(client, this, [
      ...client.botGuilds,
      ...this.guilds
    ]);
    return guilds;
  }
  async isGuildAllowed(client, guildId) {
    if (!guildId) {
      return true;
    }
    const guilds = await this.getGuilds(client);
    if (!guilds.length) {
      return true;
    }
    return guilds.includes(guildId);
  }
  isId(text) {
    return typeof this.id === "string" ? this.id === text : this.id.test(text);
  }
  parseParams() {
    return [];
  }
};

// src/decorators/classes/DDiscord.ts
import { DIService } from "@rpbey/di";
import { Decorator as Decorator5 } from "@rpbey/internal";
var DDiscord = class _DDiscord extends Decorator5 {
  _applicationCommands = [];
  _botIds = [];
  _buttonComponents = [];
  _description;
  _events = [];
  _guards = [];
  _guilds = [];
  _modalComponents = [];
  _name;
  _reactions = [];
  _selectMenuComponents = [];
  _simpleCommands = [];
  get applicationCommands() {
    return this._applicationCommands;
  }
  set applicationCommands(value) {
    this._applicationCommands = value;
  }
  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }
  get buttons() {
    return this._buttonComponents;
  }
  set buttons(value) {
    this._buttonComponents = value;
  }
  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }
  get events() {
    return this._events;
  }
  set events(value) {
    this._events = value;
  }
  get guards() {
    return this._guards;
  }
  set guards(value) {
    this._guards = value;
  }
  get guilds() {
    return this._guilds;
  }
  set guilds(value) {
    this._guilds = value;
  }
  get instance() {
    return DIService.engine.getService(this.from);
  }
  get modal() {
    return this._modalComponents;
  }
  set modal(value) {
    this._modalComponents = value;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get reactions() {
    return this._reactions;
  }
  set reactions(value) {
    this._reactions = value;
  }
  get selectMenus() {
    return this._selectMenuComponents;
  }
  set selectMenus(value) {
    this._selectMenuComponents = value;
  }
  get simpleCommands() {
    return this._simpleCommands;
  }
  set simpleCommands(value) {
    this._simpleCommands = value;
  }
  constructor(name, description) {
    super();
    this._name = name;
    this._description = description ?? name;
  }
  static create(name, description) {
    return new _DDiscord(name, description);
  }
};

// src/decorators/classes/DGuard.ts
import { Decorator as Decorator6 } from "@rpbey/internal";
var DGuard = class _DGuard extends Decorator6 {
  _fn;
  get fn() {
    return this._fn;
  }
  constructor(fn) {
    super();
    this._fn = fn;
  }
  static create(fn) {
    return new _DGuard(fn);
  }
};

// src/decorators/classes/DOn.ts
var DOn = class _DOn extends Method {
  _event;
  _once;
  _rest;
  _priority;
  _botIds;
  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }
  get event() {
    return this._event;
  }
  set event(value) {
    this._event = value;
  }
  get once() {
    return this._once;
  }
  set once(value) {
    this._once = value;
  }
  get priority() {
    return this._priority;
  }
  set priority(value) {
    this._priority = value;
  }
  get rest() {
    return this._rest;
  }
  set rest(value) {
    this._rest = value;
  }
  constructor(data) {
    super();
    this._event = data.event;
    this._once = data.once;
    this._priority = data.priority ?? Number.MAX_SAFE_INTEGER;
    this._rest = data.rest;
    this._botIds = data.botIds ?? [];
  }
  static create(data) {
    return new _DOn(data);
  }
  isBotAllowed(botId) {
    if (!this.botIds.length) {
      return true;
    }
    return this.botIds.includes(botId);
  }
  parseParams() {
    return [];
  }
};

// src/decorators/classes/DReaction.ts
var DReaction = class _DReaction extends Method {
  _emoji;
  _description;
  _directMessage;
  _guilds;
  _botIds;
  _aliases;
  _remove;
  _partial;
  get aliases() {
    return this._aliases;
  }
  set aliases(value) {
    this._aliases = value;
  }
  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }
  get guilds() {
    return this._guilds;
  }
  set guilds(value) {
    this._guilds = value;
  }
  get directMessage() {
    return this._directMessage;
  }
  set directMessage(value) {
    this._directMessage = value;
  }
  get emoji() {
    return this._emoji;
  }
  set emoji(value) {
    this._emoji = value;
  }
  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }
  get remove() {
    return this._remove;
  }
  set remove(value) {
    this._remove = value;
  }
  get partial() {
    return this._partial;
  }
  set partial(value) {
    this._partial = value;
  }
  constructor(data) {
    super();
    this._emoji = data.emoji;
    this._description = data.description ?? this.emoji;
    this._directMessage = data.directMessage ?? true;
    this._guilds = data.guilds ?? [];
    this._botIds = data.botIds ?? [];
    this._aliases = data.aliases ?? [];
    this._remove = data.remove ?? false;
    this._partial = data.partial ?? false;
  }
  static create(data) {
    return new _DReaction(data);
  }
  isBotAllowed(botId) {
    if (!this.botIds.length) {
      return true;
    }
    return this.botIds.includes(botId);
  }
  async getGuilds(client) {
    const guilds = await resolveIGuilds(client, this, [
      ...client.botGuilds,
      ...this.guilds
    ]);
    return guilds;
  }
  async isGuildAllowed(client, guildId) {
    if (!guildId) {
      return true;
    }
    const guilds = await this.getGuilds(client);
    if (!guilds.length) {
      return true;
    }
    return guilds.includes(guildId);
  }
  parseParams() {
    return [];
  }
};

// src/decorators/classes/DSimpleCommand.ts
import { ChannelType } from "discord.js";
var DSimpleCommand = class _DSimpleCommand extends Method {
  _description;
  _name;
  _prefix;
  _directMessage;
  _argSplitter;
  _options = [];
  _guilds;
  _botIds;
  _aliases;
  get aliases() {
    return this._aliases;
  }
  set aliases(value) {
    this._aliases = value;
  }
  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }
  get prefix() {
    return this._prefix;
  }
  set prefix(value) {
    this._prefix = value;
  }
  get guilds() {
    return this._guilds;
  }
  set guilds(value) {
    this._guilds = value;
  }
  get argSplitter() {
    return this._argSplitter;
  }
  set argSplitter(value) {
    this._argSplitter = value;
  }
  get directMessage() {
    return this._directMessage;
  }
  set directMessage(value) {
    this._directMessage = value;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
  }
  constructor(data) {
    super();
    this._name = data.name;
    this._description = data.description ?? this.name;
    this._directMessage = data.directMessage ?? true;
    this._argSplitter = data.argSplitter;
    this._options = [];
    this._prefix = data.prefix;
    this._guilds = data.guilds ?? [];
    this._botIds = data.botIds ?? [];
    this._aliases = data.aliases ?? [];
  }
  static create(data) {
    return new _DSimpleCommand(data);
  }
  isBotAllowed(botId) {
    if (!this.botIds.length) {
      return true;
    }
    return this.botIds.includes(botId);
  }
  async getGuilds(client, command) {
    const guilds = await resolveIGuilds(client, command, [
      ...client.botGuilds,
      ...this.guilds
    ]);
    return guilds;
  }
  async isGuildAllowed(client, command, guildId) {
    if (!guildId) {
      return true;
    }
    const guilds = await this.getGuilds(client, command);
    if (!guilds.length) {
      return true;
    }
    return guilds.includes(guildId);
  }
  parseParams(command) {
    return command.options;
  }
  parseParamsEx(command) {
    if (!this.options.length) {
      return Promise.resolve([]);
    }
    const splitterEx = this.argSplitter ?? command.splitter ?? " ";
    const args = typeof splitterEx === "function" ? splitterEx(command) : command.argString.split(splitterEx).filter((op) => op.length).map((op) => op.trim());
    return Promise.all(
      this.options.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).map(async (op, index) => {
        const option = args[index];
        const id = option?.replace(/\D/g, "");
        const validId = id !== void 0 && id.length >= 16 && id.length <= 20;
        if (!option?.length) {
          return null;
        }
        if (op.type === 2 /* Boolean */) {
          if (option.toLocaleLowerCase() === "false" || option.toLocaleLowerCase() === "0") {
            return false;
          }
          return Boolean(option);
        }
        if (op.type === 1 /* Number */) {
          return Number(option);
        }
        if (op.type === 4 /* Channel */) {
          if (!validId || !command.message.guild) {
            return null;
          }
          return command.message.guild.channels.fetch(id).catch(() => null);
        }
        if (op.type === 5 /* Role */) {
          if (!validId || !command.message.guild) {
            return null;
          }
          return command.message.guild.roles.fetch(id).catch(() => null);
        }
        if (op.type === 3 /* User */) {
          if (!validId) {
            return null;
          }
          if (command.message.channel.type === ChannelType.DM) {
            if (command.message.client.user.id === id) {
              return command.message.client.user;
            }
            if (command.message.author.id === id) {
              return command.message.author;
            }
            return null;
          }
          if (!command.message.guild) {
            return null;
          }
          return command.message.guild.members.fetch(id).catch(() => null);
        }
        if (op.type === 6 /* Mentionable */) {
          if (!validId) {
            return null;
          }
          if (command.message.channel.type === ChannelType.DM) {
            if (command.message.client.user.id === id) {
              return command.message.client.user;
            }
            if (command.message.author.id === id) {
              return command.message.author;
            }
            return null;
          }
          if (!command.message.guild) {
            return null;
          }
          const member = await command.message.guild.members.fetch(id).catch(() => null);
          if (member) {
            return member;
          }
          const role = await command.message.guild.roles.fetch(id).catch(() => null);
          return role;
        }
        return option;
      })
    );
  }
};

// src/decorators/classes/DSimpleCommandOption.ts
import { Decorator as Decorator7 } from "@rpbey/internal";
var DSimpleCommandOption = class _DSimpleCommandOption extends Decorator7 {
  _name;
  _description;
  _type;
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }
  constructor(data) {
    super();
    this._name = data.name;
    this._type = data.type ?? 0 /* String */;
    this._description = data.description ?? SimpleCommandOptionType[this._type].toLowerCase();
  }
  static create(data) {
    return new _DSimpleCommandOption(data);
  }
};

// src/decorators/decorators/Bot.ts
import { Modifier } from "@rpbey/internal";
function Bot(...botIds) {
  return (target, key, descriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier.create(
        (original) => {
          original.botIds = [
            ...original.botIds,
            ...botIds.filter((botId) => !original.botIds.includes(botId))
          ];
          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
              ...original.buttons,
              ...original.selectMenus,
              ...original.events
            ].forEach((ob) => {
              ob.botIds = [
                ...ob.botIds,
                ...botIds.filter((botId) => !ob.botIds.includes(botId))
              ];
            });
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
        DComponent,
        DOn,
        DReaction
      ).attachToTarget(target, key, descriptor)
    );
  };
}

// src/decorators/decorators/ButtonComponent.ts
function ButtonComponent(options) {
  return (target, key) => {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: options?.id ?? key,
      type: 0 /* Button */
    }).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}

// src/decorators/decorators/ContextMenu.ts
import { ApplicationCommandType } from "discord.js";
function ContextMenu(options) {
  return (target, key) => {
    const applicationCommand = DApplicationCommand.create({
      botIds: options.botIds,
      contexts: options.contexts,
      defaultMemberPermissions: options.defaultMemberPermissions,
      description: "",
      dmPermission: options.dmPermission,
      guilds: options.guilds,
      integrationTypes: options.integrationTypes,
      name: options.name ?? key,
      nameLocalizations: options.nameLocalizations,
      type: options.type
    }).decorate(target.constructor, key, target[key]);
    if (options.type === ApplicationCommandType.Message) {
      MetadataStorage.instance.addApplicationCommandMessage(applicationCommand);
    } else {
      MetadataStorage.instance.addApplicationCommandUser(applicationCommand);
    }
  };
}

// src/decorators/decorators/Discord.ts
function Discord() {
  return (target) => {
    const clazz = target;
    const instance = DDiscord.create(clazz.name).decorate(clazz, clazz.name);
    MetadataStorage.instance.addDiscord(instance);
  };
}

// src/decorators/decorators/Guard.ts
import { Modifier as Modifier2 } from "@rpbey/internal";
function Guard(...fns) {
  return (target, key, descriptor) => {
    const guards = fns.map((fn) => {
      return DGuard.create(fn).attachToTarget(
        target,
        key,
        descriptor
      );
    });
    MetadataStorage.instance.addModifier(
      Modifier2.create(
        (original) => {
          original.guards = guards;
        },
        DComponent,
        DApplicationCommand,
        DSimpleCommand,
        DOn,
        DDiscord,
        DReaction
      ).attachToTarget(target, key, descriptor)
    );
  };
}

// src/decorators/decorators/Guild.ts
import { Modifier as Modifier3 } from "@rpbey/internal";
function Guild(...guildIds) {
  return (target, key, descriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier3.create(
        (original) => {
          original.guilds = [...original.guilds, ...guildIds];
          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
              ...original.buttons,
              ...original.selectMenus
            ].forEach((obj) => {
              obj.guilds = [...obj.guilds, ...guildIds];
            });
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
        DComponent,
        DReaction
      ).attachToTarget(target, key, descriptor)
    );
  };
}

// src/decorators/decorators/ModalComponent.ts
function ModalComponent(options) {
  return (target, key) => {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: options?.id ?? key,
      type: 2 /* Modal */
    }).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentModal(button);
  };
}

// src/decorators/decorators/On.ts
function On(options) {
  return (target, key, descriptor) => {
    const clazz = target;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: false,
      priority: options?.priority,
      rest: false
    }).decorate(clazz.constructor, key, descriptor?.value);
    MetadataStorage.instance.addOn(on);
  };
}
On.rest = (options) => (target, key, descriptor) => {
  const clazz = target;
  const on = DOn.create({
    botIds: options?.botIds,
    event: options?.event ?? key,
    once: false,
    priority: options?.priority,
    rest: true
  }).decorate(clazz.constructor, key, descriptor?.value);
  MetadataStorage.instance.addOn(on);
};

// src/decorators/decorators/Once.ts
function Once(options) {
  return (target, key, descriptor) => {
    const clazz = target;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: true,
      priority: options?.priority,
      rest: false
    }).decorate(clazz.constructor, key, descriptor.value);
    MetadataStorage.instance.addOn(on);
  };
}
Once.rest = (options) => (target, key, descriptor) => {
  const clazz = target;
  const on = DOn.create({
    botIds: options?.botIds,
    event: options?.event ?? key,
    once: true,
    priority: options?.priority,
    rest: true
  }).decorate(clazz.constructor, key, descriptor?.value);
  MetadataStorage.instance.addOn(on);
};

// src/decorators/decorators/Reaction.ts
function Reaction(options) {
  return (target, key) => {
    const react = DReaction.create({
      aliases: options?.aliases,
      botIds: options?.botIds,
      description: options?.description,
      directMessage: options?.directMessage,
      emoji: options?.emoji ?? key,
      guilds: options?.guilds,
      partial: options?.partial,
      remove: options?.remove
    }).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addReaction(react);
  };
}

// src/decorators/decorators/SelectMenuComponent.ts
function SelectMenuComponent(options) {
  return (target, key) => {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: options?.id ?? key,
      type: 1 /* SelectMenu */
    }).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}

// src/decorators/decorators/SimpleCommand.ts
function SimpleCommand(options) {
  return (target, key) => {
    const cmd = DSimpleCommand.create({
      aliases: options?.aliases,
      argSplitter: options?.argSplitter,
      botIds: options?.botIds,
      description: options?.description,
      directMessage: options?.directMessage,
      guilds: options?.guilds,
      name: options?.name ?? key,
      prefix: options?.prefix
    }).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addSimpleCommand(cmd);
  };
}

// src/decorators/decorators/SimpleCommandOption.ts
import { Modifier as Modifier4 } from "@rpbey/internal";
function SimpleCommandOption(options) {
  return (target, key, index) => {
    const option = DSimpleCommandOption.create(options).decorate(
      target.constructor,
      key,
      target[key],
      target.constructor,
      index
    );
    MetadataStorage.instance.addModifier(
      Modifier4.create((original) => {
        original.options = [...original.options, option];
      }, DSimpleCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );
    MetadataStorage.instance.addSimpleCommandOption(option);
  };
}

// src/decorators/decorators/Slash.ts
import { ApplicationCommandType as ApplicationCommandType2, SlashCommandBuilder } from "discord.js";
function Slash(options) {
  return (target, key) => {
    const name = options.name ?? key;
    SlashNameValidator(name);
    let applicationCommand;
    if (options instanceof SlashCommandBuilder) {
      if (options.options.length > 0) {
        throw Error(
          "The builder options feature is not supported in discordx."
        );
      }
      applicationCommand = DApplicationCommand.create({
        defaultMemberPermissions: options.default_member_permissions,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        dmPermission: options.dm_permission ?? true,
        contexts: options.contexts,
        integrationTypes: options.integration_types,
        name,
        nameLocalizations: options.name_localizations,
        nsfw: options.nsfw,
        type: ApplicationCommandType2.ChatInput
      });
    } else {
      applicationCommand = DApplicationCommand.create({
        botIds: options.botIds,
        defaultMemberPermissions: options.defaultMemberPermissions,
        description: options.description,
        descriptionLocalizations: options.descriptionLocalizations,
        dmPermission: options.dmPermission ?? true,
        contexts: options.contexts,
        integrationTypes: options.integrationTypes,
        guilds: options.guilds,
        name,
        nameLocalizations: options.nameLocalizations,
        nsfw: options.nsfw,
        type: ApplicationCommandType2.ChatInput
      });
    }
    applicationCommand.decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addApplicationCommandSlash(applicationCommand);
  };
}

// src/decorators/decorators/SlashChoice.ts
import { Modifier as Modifier5 } from "@rpbey/internal";
function SlashChoice(...choices) {
  return (target, key, index) => {
    MetadataStorage.instance.addModifier(
      Modifier5.create((original) => {
        const allChoices = choices.map((choice) => {
          const resolveChoice = typeof choice === "number" ? { name: choice.toString(), value: choice } : typeof choice === "string" ? { name: choice, value: choice } : choice;
          return DApplicationCommandOptionChoice.create(resolveChoice);
        });
        original.choices = [...allChoices, ...original.choices];
      }, DApplicationCommandOption).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );
  };
}

// src/decorators/decorators/SlashGroup.ts
import {
  Modifier as Modifier6
} from "@rpbey/internal";
function SlashGroup(options, root) {
  return (target, key, descriptor) => {
    if (typeof options === "string") {
      MetadataStorage.instance.addModifier(
        Modifier6.create(
          (original) => {
            if (original instanceof DDiscord) {
              [...original.applicationCommands].forEach((obj) => {
                obj.group = root ?? options;
                obj.subgroup = root ? options : void 0;
              });
            } else {
              original.group = root ?? options;
              original.subgroup = root ? options : void 0;
            }
          },
          DApplicationCommand,
          DDiscord
        ).attachToTarget(target, key, descriptor)
      );
    } else {
      SlashNameValidator(options.name);
      const clazz = target;
      if (options.root) {
        MetadataStorage.instance.addApplicationCommandSlashSubGroups(
          DApplicationCommandGroup.create({
            name: options.name,
            payload: {
              description: options.description,
              descriptionLocalizations: options.descriptionLocalizations,
              nameLocalizations: options.nameLocalizations
            },
            root: options.root
          }).decorate(clazz, clazz.name)
        );
      } else {
        MetadataStorage.instance.addApplicationCommandSlashGroups(
          DApplicationCommandGroup.create({
            name: options.name,
            payload: {
              contexts: options.contexts,
              defaultMemberPermissions: options.defaultMemberPermissions,
              description: options.description,
              descriptionLocalizations: options.descriptionLocalizations,
              dmPermission: options.dmPermission,
              integrationTypes: options.integrationTypes,
              nameLocalizations: options.nameLocalizations
            }
          }).decorate(clazz, key ?? clazz.name)
        );
      }
    }
  };
}

// src/decorators/decorators/SlashOption.ts
import { Modifier as Modifier7 } from "@rpbey/internal";
import {
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption
} from "discord.js";
function SlashOption(options, transformer) {
  return (target, key, index) => {
    SlashNameValidator(options.name);
    let option;
    if (options instanceof SlashCommandAttachmentOption || options instanceof SlashCommandBooleanOption || options instanceof SlashCommandRoleOption || options instanceof SlashCommandMentionableOption || options instanceof SlashCommandUserOption) {
      option = DApplicationCommandOption.create({
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type
      });
    } else if (options instanceof SlashCommandChannelOption) {
      option = DApplicationCommandOption.create({
        channelType: options.channel_types,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type
      });
    } else if (options instanceof SlashCommandIntegerOption || options instanceof SlashCommandNumberOption) {
      const choices = options.choices?.map(
        (choice) => DApplicationCommandOptionChoice.create(choice)
      );
      option = DApplicationCommandOption.create({
        autocomplete: options.autocomplete,
        choices,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index,
        maxValue: options.max_value,
        minValue: options.min_value,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type
      });
    } else if (options instanceof SlashCommandStringOption) {
      const choices = options.choices?.map(
        (choice) => DApplicationCommandOptionChoice.create(choice)
      );
      option = DApplicationCommandOption.create({
        autocomplete: options.autocomplete,
        choices,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index,
        maxLength: options.max_length,
        minLength: options.min_length,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type
      });
    } else {
      option = DApplicationCommandOption.create({
        autocomplete: options.autocomplete,
        channelType: options.channelTypes,
        description: options.description,
        descriptionLocalizations: options.descriptionLocalizations,
        index,
        maxLength: options.maxLength,
        maxValue: options.maxValue,
        minLength: options.minLength,
        minValue: options.minValue,
        name: options.name,
        nameLocalizations: options.nameLocalizations,
        required: options.required,
        transformer,
        type: options.type
      });
    }
    option.decorate(
      target.constructor,
      key,
      target[key],
      target.constructor,
      index
    );
    MetadataStorage.instance.addModifier(
      Modifier7.create((original) => {
        original.options = [...original.options, option];
      }, DApplicationCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );
    MetadataStorage.instance.addApplicationCommandSlashOption(option);
  };
}

// src/logic/managers/ApplicationCommandManager.ts
import {
  ApplicationCommandType as ApplicationCommandType3
} from "discord.js";
var ApplicationCommandManager = class {
  constructor(client) {
    this.client = client;
  }
  async initApplicationCommands(retainDeleted = false) {
    const guildCommandStore = await this.getCommandsByGuild();
    const guildPromises = Array.from(guildCommandStore.entries()).map(
      ([guildId, commands]) => {
        const guild = this.client.guilds.cache.get(guildId);
        return guild ? this.initGuildApplicationCommands(guildId, commands, retainDeleted) : Promise.resolve();
      }
    );
    await Promise.all([
      Promise.all(guildPromises),
      this.initGlobalApplicationCommands(retainDeleted)
    ]);
  }
  async clearApplicationCommands(...guilds) {
    if (guilds.length) {
      await Promise.all(
        guilds.map(
          async (guildId) => this.client.guilds.cache.get(guildId)?.commands.set([])
        )
      );
    } else {
      await this.client.application?.commands.set([]);
    }
  }
  async getCommandsByGuild() {
    const botResolvedGuilds = await this.client.botResolvedGuilds;
    const guildCommandStore = /* @__PURE__ */ new Map();
    const allGuildCommands = this.client.applicationCommands.filter(
      (command) => {
        const guilds = [...botResolvedGuilds, ...command.guilds];
        return command.isBotAllowed(this.client.botId) && guilds.length;
      }
    );
    await Promise.all(
      allGuildCommands.map(async (command) => {
        const guilds = await resolveIGuilds(this.client, command, [
          ...botResolvedGuilds,
          ...command.guilds
        ]);
        guilds.forEach((guildId) => {
          const commands = guildCommandStore.get(guildId) ?? [];
          guildCommandStore.set(guildId, [...commands, command]);
        });
      })
    );
    return guildCommandStore;
  }
  async initGuildApplicationCommands(guildId, commands, retainDeleted) {
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      this.client.logger.warn(
        `${this.client.user?.username ?? this.client.botId} >> initGuildApplicationCommands: skipped (guild ${guildId} unavailable)`
      );
      return;
    }
    const discordCommands = await guild.commands.fetch({
      withLocalizations: true
    });
    const botResolvedGuilds = await this.client.botResolvedGuilds;
    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete
    } = await this.categorizeGuildCommands(
      commands,
      discordCommands,
      botResolvedGuilds
    );
    this.logCommandChanges(guild.toString(), {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted
    });
    const bulkUpdate = this.prepareBulkUpdate({
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted
    });
    if (bulkUpdate.length > 0) {
      await guild.commands.set(bulkUpdate);
    }
  }
  async initGlobalApplicationCommands(retainDeleted) {
    if (!this.client.application) {
      throw new Error(
        "Client not ready, connect to Discord before fetching commands"
      );
    }
    const botResolvedGuilds = await this.client.botResolvedGuilds;
    const allDiscordCommands = await this.client.application.commands.fetch();
    const discordCommands = allDiscordCommands.filter(
      (cmd) => !cmd.guild && cmd.type !== ApplicationCommandType3.PrimaryEntryPoint
    );
    const globalCommands = this.client.applicationCommands.filter((command) => {
      if (botResolvedGuilds.length || command.guilds.length) return false;
      if (command.botIds.length && !command.botIds.includes(this.client.botId))
        return false;
      return true;
    });
    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete
    } = this.categorizeGlobalCommands(globalCommands, discordCommands);
    this.logCommandChanges("global", {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted
    });
    const bulkUpdate = this.prepareBulkUpdate({
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted
    });
    if (bulkUpdate.length > 0) {
      await this.client.application.commands.set(
        bulkUpdate
      );
    }
  }
  async categorizeGuildCommands(commands, discordCommands, botResolvedGuilds) {
    const commandsToAdd = commands.filter((command) => {
      const match = (cmd) => cmd.name === command.name && cmd.type === command.type;
      return !discordCommands.find(match);
    });
    const commandsToUpdate = [];
    const commandsToSkip = [];
    commands.forEach((command) => {
      const match = (cmd) => cmd.name === command.name && cmd.type === command.type;
      const findCommand = discordCommands.find(match);
      if (!findCommand) return;
      const mixinCommand = new ApplicationCommandMixin(findCommand, command);
      if (!isApplicationCommandEqual(findCommand, command, true)) {
        commandsToUpdate.push(mixinCommand);
      } else {
        commandsToSkip.push(mixinCommand);
      }
    });
    const commandsToDelete = [];
    await Promise.all(
      discordCommands.map(async (cmd) => {
        const match = (command) => cmd.name === command.name && cmd.type === command.type;
        const commandFind = commands.find(match);
        if (!commandFind) {
          commandsToDelete.push(cmd);
          return;
        }
        const guilds = await resolveIGuilds(this.client, commandFind, [
          ...botResolvedGuilds,
          ...commandFind.guilds
        ]);
        if (!cmd.guildId || !guilds.includes(cmd.guildId)) {
          commandsToDelete.push(cmd);
        }
      })
    );
    return {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete
    };
  }
  categorizeGlobalCommands(commands, discordCommands) {
    const commandsToAdd = commands.filter((command) => {
      const match = (cmd) => cmd.name === command.name && cmd.type === command.type;
      return !discordCommands.find(match);
    });
    const commandsToUpdate = [];
    const commandsToSkip = [];
    commands.forEach((command) => {
      const match = (cmd) => cmd.name === command.name && cmd.type === command.type;
      const discordCommand = discordCommands.find(match);
      if (!discordCommand) return;
      const mixinCommand = new ApplicationCommandMixin(discordCommand, command);
      if (!isApplicationCommandEqual(discordCommand, command)) {
        commandsToUpdate.push(mixinCommand);
      } else {
        commandsToSkip.push(mixinCommand);
      }
    });
    const commandsToDelete = discordCommands.filter((cmd) => {
      const match = (command) => command.name !== cmd.name || command.type !== cmd.type;
      return commands.every(match);
    }).toJSON();
    return {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete
    };
  }
  logCommandChanges(target, changes) {
    if (this.client.silent) return;
    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted
    } = changes;
    let str = `${this.client.user?.username ?? this.client.botId} >> commands >> ${target}`;
    const addNames = commandsToAdd.map((cmd) => cmd.name).join(", ");
    const deleteNames = commandsToDelete.map((cmd) => cmd.name).join(", ");
    const skipNames = commandsToSkip.map((cmd) => cmd.name).join(", ");
    const updateNames = commandsToUpdate.map((cmd) => cmd.name).join(", ");
    const deleteOrRetain = retainDeleted ? "retaining" : "deleting";
    str += `
	>> adding   ${commandsToAdd.length.toString()} [${addNames}]`;
    str += `
	>> ${deleteOrRetain}   ${commandsToDelete.length.toString()} [${deleteNames}]`;
    str += `
	>> skipping   ${commandsToSkip.length.toString()} [${skipNames}]`;
    str += `
	>> updating   ${commandsToUpdate.length.toString()} [${updateNames}]
`;
    this.client.logger.log(str);
  }
  prepareBulkUpdate(data) {
    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted
    } = data;
    const bulkUpdate = [];
    commandsToSkip.forEach(
      (cmd) => void bulkUpdate.push(cmd.instance.toJSON())
    );
    commandsToAdd.forEach((cmd) => void bulkUpdate.push(cmd.toJSON()));
    commandsToUpdate.forEach(
      (cmd) => void bulkUpdate.push(cmd.instance.toJSON())
    );
    if (retainDeleted) {
      commandsToDelete.forEach((cmd) => {
        bulkUpdate.push(cmd.toJSON());
      });
    }
    return bulkUpdate;
  }
};

// src/logic/managers/DebugManager.ts
import { ApplicationCommandOptionType as ApplicationCommandOptionType3 } from "discord.js";
var DebugManager = class {
  constructor(client) {
    this.client = client;
  }
  printDebug() {
    if (!this.client.instance.isBuilt) {
      this.client.logger.error(
        "Build the app before running this method with client.build()"
      );
      return;
    }
    this.printEvents();
    this.printComponents();
    this.printReactions();
    this.printContextMenus();
    this.printApplicationCommands();
    this.printSimpleCommands();
    this.client.logger.log("\n");
  }
  printEvents() {
    this.client.logger.log("client >> Events");
    if (this.client.events.length) {
      this.client.events.forEach((event) => {
        const eventName = event.event;
        const className = event.classRef.name;
        const key = event.key;
        this.client.logger.log(`>> ${eventName} (${className}.${key})`);
      });
    } else {
      this.client.logger.log("	No event detected");
    }
    this.client.logger.log("");
  }
  printComponents() {
    this.printComponentType("buttons", this.client.buttonComponents);
    this.printComponentType("select menu's", this.client.selectMenuComponents);
    this.printComponentType("modals", this.client.modalComponents);
  }
  printComponentType(name, components) {
    this.client.logger.log(`client >> ${name}`);
    if (components.length) {
      components.forEach((component) => {
        const className = component.classRef.name;
        const key = component.key;
        this.client.logger.log(
          `>> ${component.id.toString()} (${className}.${key})`
        );
      });
    } else {
      this.client.logger.log(`	No ${name.slice(0, -1)} detected`);
    }
    this.client.logger.log("");
  }
  printReactions() {
    this.client.logger.log("client >> reactions");
    if (this.client.reactions.length) {
      this.client.reactions.forEach((reaction) => {
        const className = reaction.classRef.name;
        const key = reaction.key;
        this.client.logger.log(`>> ${reaction.emoji} (${className}.${key})`);
      });
    } else {
      this.client.logger.log("	No reaction detected");
    }
    this.client.logger.log("");
  }
  printContextMenus() {
    this.client.logger.log("client >> context menu's");
    const contexts = [
      ...this.client.applicationCommandUsers,
      ...this.client.applicationCommandMessages
    ];
    if (contexts.length) {
      contexts.forEach((menu) => {
        const type = menu.type.toString();
        const className = menu.classRef.name;
        const key = menu.key;
        this.client.logger.log(
          `>> ${menu.name} (${type}) (${className}.${key})`
        );
      });
    } else {
      this.client.logger.log("	No context menu detected");
    }
    this.client.logger.log("");
  }
  printApplicationCommands() {
    this.client.logger.log("client >> application commands");
    if (this.client.applicationCommands.length) {
      this.client.applicationCommands.forEach((command, index) => {
        if (command.botIds.length && !command.botIds.includes(this.client.botId)) {
          return;
        }
        const line = index !== 0 ? "\n" : "";
        const className = command.classRef.name;
        const key = command.key;
        this.client.logger.log(
          `${line}	>> ${command.name} (${className}.${key})`
        );
        this.printOptions(command.options, 2);
      });
    } else {
      this.client.logger.log("	No application command detected");
    }
    this.client.logger.log("");
  }
  printOptions(options, depth) {
    const tab = Array(depth).join("		");
    options.forEach((option, optionIndex) => {
      const className = option.classRef.name;
      const key = option.key;
      this.client.logger.log(
        `${(option.type === ApplicationCommandOptionType3.Subcommand || option.type === ApplicationCommandOptionType3.SubcommandGroup) && optionIndex !== 0 ? "\n" : ""}${tab}>> ${option.name}: ${ApplicationCommandOptionType3[option.type].toLowerCase()} (${className}.${key})`
      );
      this.printOptions(option.options, depth + 1);
    });
  }
  printSimpleCommands() {
    this.client.logger.log("client >> simple commands");
    if (this.client.simpleCommands.length) {
      this.client.simpleCommands.forEach((cmd) => {
        const className = cmd.classRef.name;
        const key = cmd.key;
        this.client.logger.log(`	>> ${cmd.name} (${className}.${key})`);
        if (cmd.aliases.length) {
          this.client.logger.log(`		aliases:`, cmd.aliases.join(", "));
        }
        this.printSimpleOptions(cmd.options, 2);
        this.client.logger.log("");
      });
    } else {
      this.client.logger.log("	No simple command detected");
    }
  }
  printSimpleOptions(options, depth) {
    const tab = Array(depth).join("		");
    options.forEach((option) => {
      const type = SimpleCommandOptionType[option.type];
      const className = option.classRef.name;
      const key = option.key;
      this.client.logger.log(
        `${tab}${option.name}: ${type} (${className}.${key})`
      );
    });
  }
};

// src/logic/managers/EventManager.ts
var EventManager = class {
  groups = /* @__PURE__ */ new Map();
  cleanupFunctions = [];
  add(event) {
    const key = `${event.event}_${String(event.once)}_${String(event.rest)}`;
    if (!this.groups.has(key)) {
      this.groups.set(key, {
        eventName: event.event,
        isOnce: event.once,
        isRest: event.rest,
        handlers: []
      });
    }
    const group = this.groups.get(key);
    group.handlers.push(event);
    group.handlers.sort((a, b) => a.priority - b.priority);
  }
  /**
   * Execute handlers for a specific event group
   */
  async executeHandlers(group, client, params) {
    const allowedHandlers = group.handlers.filter(
      (handler) => handler.isBotAllowed(client.botId)
    );
    const results = [];
    await allowedHandlers.reduce(
      (previousPromise, handler) => previousPromise.then(async () => {
        try {
          const result = await handler.execute(client.guards, params, client);
          results.push(result);
        } catch {
          results.push(null);
        }
      }),
      Promise.resolve()
    );
    return results;
  }
  /**
   * Trigger an event manually (used for testing)
   */
  trigger(client, { eventName, isOnce, isRest }) {
    const key = `${eventName}_${String(isOnce)}_${String(isRest)}`;
    const group = this.groups.get(key);
    if (!group) {
      return async () => [];
    }
    return async (...params) => {
      return this.executeHandlers(group, client, params);
    };
  }
  initEvents(client) {
    this.groups.forEach((group) => {
      const trigger = (...params) => {
        void this.executeHandlers(group, client, params);
      };
      const method = group.isOnce ? "once" : "on";
      if (group.isRest) {
        client.rest[method](group.eventName, trigger);
      } else {
        client[method](group.eventName, trigger);
      }
      this.cleanupFunctions.push(() => {
        if (group.isRest) {
          client.rest.off(group.eventName, trigger);
        } else {
          client.off(group.eventName, trigger);
        }
      });
    });
  }
  removeEvents() {
    this.cleanupFunctions.forEach((fn) => {
      fn();
    });
    this.cleanupFunctions.length = 0;
  }
  clear() {
    this.groups.clear();
    this.cleanupFunctions.length = 0;
  }
};

// src/logic/managers/InteractionHandler.ts
import { DIService as DIService2 } from "@rpbey/di";
import {
  ApplicationCommandOptionType as ApplicationCommandOptionType4,
  ApplicationCommandType as ApplicationCommandType4,
  InteractionType
} from "discord.js";
var InteractionHandler = class {
  constructor(client) {
    this.client = client;
  }
  executeInteraction(interaction) {
    if (interaction.isPrimaryEntryPointCommand()) {
      return null;
    }
    if (interaction.isButton()) {
      return this.executeComponent(this.client.buttonComponents, interaction);
    }
    if (interaction.type === InteractionType.ModalSubmit) {
      return this.executeComponent(this.client.modalComponents, interaction);
    }
    if (interaction.isAnySelectMenu()) {
      return this.executeComponent(
        this.client.selectMenuComponents,
        interaction
      );
    }
    if (interaction.isContextMenuCommand()) {
      return this.executeContextMenu(interaction);
    }
    return this.executeCommandInteraction(interaction);
  }
  async executeCommandInteraction(interaction) {
    const tree = this.getApplicationCommandGroupTree(interaction);
    const applicationCommand = this.getApplicationCommandFromTree(tree);
    if (!applicationCommand?.isBotAllowed(this.client.botId)) {
      if (!this.client.silent) {
        this.client.logger.warn(
          `${this.client.user?.username ?? this.client.botId} >> interaction not found, commandName: ${interaction.commandName}`
        );
      }
      return null;
    }
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const focusOption = interaction.options.getFocused(true);
      const option = applicationCommand.options.find(
        (op) => op.name === focusOption.name
      );
      if (option && typeof option.autocomplete === "function") {
        await option.autocomplete.call(
          DIService2.engine.getService(option.from),
          interaction,
          applicationCommand
        );
        return null;
      }
    }
    return applicationCommand.execute(
      this.client.guards,
      interaction,
      this.client
    );
  }
  async executeComponent(components, interaction) {
    const executes = components.filter((component) => {
      return component.isId(interaction.customId) && component.isBotAllowed(this.client.botId);
    });
    if (!executes.length) {
      if (!this.client.silent) {
        this.client.logger.warn(
          `${this.client.user?.username ?? this.client.botId} >> ${interaction.isButton() ? "button" : interaction.isAnySelectMenu() ? "select menu" : "modal"} component handler not found, interactionId: ${interaction.id} | customId: ${interaction.customId}`
        );
      }
      return null;
    }
    const results = await Promise.all(
      executes.map(async (component) => {
        if (!await component.isGuildAllowed(this.client, interaction.guildId)) {
          return null;
        }
        return component.execute(this.client.guards, interaction, this.client);
      })
    );
    return results;
  }
  executeContextMenu(interaction) {
    const applicationCommand = interaction.isUserContextMenuCommand() ? this.client.applicationCommandUsers.find(
      (cmd) => cmd.name === interaction.commandName
    ) : this.client.applicationCommandMessages.find(
      (cmd) => cmd.name === interaction.commandName
    );
    if (!applicationCommand?.isBotAllowed(this.client.botId)) {
      if (!this.client.silent) {
        this.client.logger.warn(
          `${this.client.user?.username ?? this.client.botId} >> context interaction not found, name: ${interaction.commandName}`
        );
      }
      return null;
    }
    return applicationCommand.execute(
      this.client.guards,
      interaction,
      this.client
    );
  }
  getApplicationCommandGroupTree(interaction) {
    const tree = [];
    const getOptionsTree = (option) => {
      if (!option) {
        return;
      }
      if (!option.type || option.type === ApplicationCommandOptionType4.SubcommandGroup || option.type === ApplicationCommandOptionType4.Subcommand) {
        if (option.name) {
          tree.push(option.name);
        }
        getOptionsTree(Array.from(option.options?.values() ?? [])[0]);
      }
    };
    getOptionsTree({
      name: interaction.commandName,
      options: Array.from(interaction.options.data.values()),
      type: void 0
    });
    return tree;
  }
  getApplicationCommandFromTree(tree) {
    return this.client.applicationCommandSlashesFlat.find((slash) => {
      switch (tree.length) {
        case 1:
          return slash.group === void 0 && slash.subgroup === void 0 && slash.name === tree[0] && slash.type === ApplicationCommandType4.ChatInput;
        case 2:
          return slash.group === tree[0] && slash.subgroup === void 0 && slash.name === tree[1] && slash.type === ApplicationCommandType4.ChatInput;
        case 3:
          return slash.group === tree[0] && slash.subgroup === tree[1] && slash.name === tree[2] && slash.type === ApplicationCommandType4.ChatInput;
        default:
          return false;
      }
    });
  }
};

// src/logic/managers/ReactionManager.ts
var ReactionManager = class {
  constructor(client) {
    this.client = client;
  }
  async executeReaction(reaction, user) {
    const action = this.parseReaction(reaction);
    if (!action) {
      return null;
    }
    if (!action.isBotAllowed(this.client.botId)) {
      return null;
    }
    if (!await action.isGuildAllowed(this.client, reaction.message.guildId)) {
      return null;
    }
    if (!action.directMessage && !reaction.message.guild) {
      return null;
    }
    if (!action.partial && reaction.partial) {
      reaction = await reaction.fetch();
    }
    if (!action.partial && user.partial) {
      user = await user.fetch();
    }
    if (action.remove) {
      await reaction.users.remove(user.id);
    }
    return action.execute(this.client.guards, reaction, user, this.client);
  }
  parseReaction(message) {
    const reaction = this.client.reactions.find((react) => {
      const validNames = [react.emoji, ...react.aliases];
      const { emoji } = message;
      return (emoji.id ? validNames.includes(emoji.id) : false) || (emoji.name ? validNames.includes(emoji.name) : false);
    });
    return reaction;
  }
};

// src/util/lodash-replacements.ts
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function omitKeys(obj, keys) {
  const out = {};
  const src = obj;
  for (const k of Object.keys(src)) {
    if (!keys.includes(k)) {
      out[k] = src[k];
    }
  }
  return out;
}
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(b)) return false;
  const aRec = a;
  const bRec = b;
  const ka = Object.keys(aRec);
  const kb = Object.keys(bRec);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.hasOwn(bRec, k)) return false;
    if (!deepEqual(aRec[k], bRec[k])) return false;
  }
  return true;
}

// src/logic/managers/SimpleCommandManager.ts
var SimpleCommandManager = class {
  constructor(client) {
    this.client = client;
  }
  async executeCommand(message, caseSensitive) {
    const command = await this.parseCommand(message, caseSensitive ?? false);
    if (command === 0 /* notCommand */) {
      return null;
    }
    if (command === 1 /* notFound */) {
      const handleNotFound = this.client.simpleCommandConfig?.responses?.notFound;
      if (handleNotFound) {
        if (typeof handleNotFound === "string") {
          await message.reply(handleNotFound);
        } else {
          await handleNotFound(message);
        }
      }
      return null;
    }
    if (!command.info.isBotAllowed(this.client.botId)) {
      return null;
    }
    if (!await command.info.isGuildAllowed(
      this.client,
      command,
      message.guildId
    )) {
      return null;
    }
    if (!command.info.directMessage && !message.guild) {
      return null;
    }
    return command.info.execute(this.client.guards, command, this.client);
  }
  async parseCommand(message, caseSensitive = false) {
    const prefix = await this.getMessagePrefix(message);
    const prefixRegex = RegExp(
      `^(${toStringArray(
        prefix,
        Array.from(this.client.simpleCommandMappedPrefix)
      ).map((pfx) => escapeRegExp(pfx)).join("|")})`
    );
    const isCommand = prefixRegex.test(message.content);
    if (!isCommand) {
      return 0 /* notCommand */;
    }
    const matchedPrefix = prefixRegex.exec(message.content)?.at(1) ?? "unknown";
    const contentWithoutPrefix = `${message.content.replace(prefixRegex, "").trim()} `;
    const commandRaw = this.client.simpleCommandsByName.find((cmd) => {
      if (caseSensitive) {
        return contentWithoutPrefix.startsWith(`${cmd.name} `);
      }
      return contentWithoutPrefix.toLowerCase().startsWith(`${cmd.name.toLowerCase()} `);
    });
    if (!commandRaw) {
      return 1 /* notFound */;
    }
    const commandArgs = contentWithoutPrefix.replace(new RegExp(commandRaw.name, "i"), "").trim();
    const command = new SimpleCommandMessage(
      matchedPrefix,
      commandArgs,
      message,
      commandRaw.command,
      this.client.simpleCommandConfig?.argSplitter
    );
    command.options = await command.resolveOptions();
    return command;
  }
  async getMessagePrefix(message) {
    if (typeof this.client.prefix !== "function") {
      return toStringArray(this.client.prefix);
    }
    const prefix = await this.client.prefix(message);
    return toStringArray(prefix);
  }
};

// src/logic/metadata/MetadataStorage.ts
import { DIService as DIService3 } from "@rpbey/di";
import { Modifier as Modifier8 } from "@rpbey/internal";
import {
  ApplicationCommandOptionType as ApplicationCommandOptionType5,
  ApplicationCommandType as ApplicationCommandType5
} from "discord.js";
var MetadataStorage = class _MetadataStorage {
  // internal
  static _isBuilt = false;
  static _instance;
  _discords = [];
  _guards = [];
  _modifiers = [];
  // events
  _events = [];
  _eventManager = new EventManager();
  // custom Handlers
  _buttonComponents = [];
  _modalComponents = [];
  _selectMenuComponents = [];
  // reactions
  _reactions = [];
  // simple command
  _simpleCommandOptions = [];
  _simpleCommands = [];
  _simpleCommandsByName = [];
  _simpleCommandMappedPrefix = /* @__PURE__ */ new Set();
  // discord commands
  _applicationCommandMessages = [];
  _applicationCommandSlashes = [];
  _applicationCommandSlashesFlat = [];
  _applicationCommandSlashOptions = [];
  _applicationCommandUsers = [];
  // groups
  _applicationCommandSlashGroups = [];
  _applicationCommandSlashSubGroups = [];
  // static getters
  static clear() {
    _MetadataStorage._isBuilt = false;
    _MetadataStorage._instance = new _MetadataStorage();
  }
  static get isBuilt() {
    return _MetadataStorage._isBuilt;
  }
  static get instance() {
    _MetadataStorage._instance ??= new _MetadataStorage();
    return _MetadataStorage._instance;
  }
  static set instance(value) {
    _MetadataStorage._instance = value;
  }
  // getters
  get applicationCommandSlashes() {
    return this._applicationCommandSlashes;
  }
  get applicationCommandSlashesFlat() {
    return this._applicationCommandSlashesFlat;
  }
  get applicationCommandSlashOptions() {
    return this._applicationCommandSlashOptions;
  }
  get applicationCommandSlashGroups() {
    return this._applicationCommandSlashGroups;
  }
  get applicationCommandSlashSubGroups() {
    return this._applicationCommandSlashSubGroups;
  }
  get applicationCommandUsers() {
    return this._applicationCommandUsers;
  }
  get applicationCommandMessages() {
    return this._applicationCommandMessages;
  }
  get applicationCommands() {
    return [
      ...this.applicationCommandSlashes,
      ...this.applicationCommandMessages,
      ...this.applicationCommandUsers
    ];
  }
  get buttonComponents() {
    return this._buttonComponents;
  }
  get discords() {
    return this._discords;
  }
  get discordMembers() {
    return [
      ...this._applicationCommandSlashes,
      ...this._applicationCommandUsers,
      ...this._applicationCommandMessages,
      ...this._reactions,
      ...this._simpleCommands,
      ...this._events,
      ...this._buttonComponents,
      ...this._modalComponents,
      ...this._selectMenuComponents
    ];
  }
  get events() {
    return this._events;
  }
  get eventManager() {
    return this._eventManager;
  }
  get isBuilt() {
    return _MetadataStorage._isBuilt;
  }
  get modalComponents() {
    return this._modalComponents;
  }
  get reactions() {
    return this._reactions;
  }
  get selectMenuComponents() {
    return this._selectMenuComponents;
  }
  get simpleCommandsByName() {
    return this._simpleCommandsByName;
  }
  get simpleCommandMappedPrefix() {
    return Array.from(this._simpleCommandMappedPrefix);
  }
  get simpleCommands() {
    return this._simpleCommands;
  }
  /**
   * Get the list of used events without duplications
   */
  get usedEvents() {
    return this.events.reduce((prev, event, index) => {
      const found = this.events.find((event2) => event.event === event2.event);
      const foundIndex = found ? this.events.indexOf(found) : -1;
      if (foundIndex === index || found?.once !== event.once) {
        prev.push(event);
      }
      return prev;
    }, []);
  }
  addApplicationCommandSlash(slash) {
    this._applicationCommandSlashes.push(slash);
  }
  addApplicationCommandUser(slash) {
    this._applicationCommandUsers.push(slash);
  }
  addApplicationCommandMessage(slash) {
    this._applicationCommandMessages.push(slash);
  }
  addApplicationCommandSlashOption(option) {
    this._applicationCommandSlashOptions.push(option);
  }
  addApplicationCommandSlashGroups(group) {
    this._applicationCommandSlashGroups.push(group);
  }
  addApplicationCommandSlashSubGroups(subGroup) {
    this._applicationCommandSlashSubGroups.push(subGroup);
  }
  addComponentButton(button) {
    this._buttonComponents.push(button);
  }
  addComponentModal(selectMenu) {
    this._modalComponents.push(selectMenu);
  }
  addComponentSelectMenu(selectMenu) {
    this._selectMenuComponents.push(selectMenu);
  }
  addDiscord(discord) {
    this._discords.push(discord);
    DIService3.engine.addService(discord.classRef);
  }
  addGuard(guard) {
    this._guards.push(guard);
    DIService3.engine.addService(guard.classRef);
  }
  addModifier(modifier) {
    this._modifiers.push(modifier);
  }
  addOn(on) {
    this._events.push(on);
    this._eventManager.add(on);
  }
  addReaction(reaction) {
    this._reactions.push(reaction);
  }
  addSimpleCommand(cmd) {
    this._simpleCommands.push(cmd);
  }
  addSimpleCommandOption(cmdOption) {
    this._simpleCommandOptions.push(cmdOption);
  }
  async build() {
    if (_MetadataStorage.isBuilt) {
      return;
    }
    _MetadataStorage._isBuilt = true;
    this.discordMembers.forEach((member) => {
      const discord = this._discords.find((instance) => {
        return instance.from === member.from;
      });
      if (!discord) {
        throw Error(
          `Did you forget to use the @discord decorator on your class: ${String(member.from.name)}
read more at https://discordx.js.org/docs/discordx/decorators/general/discord

`
        );
      }
      member.discord = discord;
      if (member instanceof DApplicationCommand) {
        discord.applicationCommands.push(member);
      }
      if (member instanceof DSimpleCommand) {
        discord.simpleCommands.push(member);
      }
      if (member instanceof DReaction) {
        discord.reactions.push(member);
      }
      if (member instanceof DOn) {
        discord.events.push(member);
      }
      if (member instanceof DComponent) {
        if (member.type === 0 /* Button */) {
          discord.buttons.push(member);
        } else if (member.type === 1 /* SelectMenu */) {
          discord.selectMenus.push(member);
        }
      }
    });
    await Modifier8.modify(this._modifiers, this._discords);
    await Modifier8.modify(this._modifiers, this._events);
    await Modifier8.modify(this._modifiers, this._applicationCommandSlashes);
    await Modifier8.modify(
      this._modifiers,
      this._applicationCommandSlashOptions
    );
    await Modifier8.modify(this._modifiers, this._applicationCommandMessages);
    await Modifier8.modify(this._modifiers, this._applicationCommandUsers);
    await Modifier8.modify(this._modifiers, this._simpleCommands);
    await Modifier8.modify(this._modifiers, this._simpleCommandOptions);
    await Modifier8.modify(this._modifiers, this._buttonComponents);
    await Modifier8.modify(this._modifiers, this._modalComponents);
    await Modifier8.modify(this._modifiers, this._reactions);
    await Modifier8.modify(this._modifiers, this._selectMenuComponents);
    this._applicationCommandSlashesFlat = this._applicationCommandSlashes;
    this._applicationCommandSlashes = this.groupSlashes();
    this.buildSimpleCommands();
  }
  buildSimpleCommands() {
    this._simpleCommands.forEach((cmd) => {
      if (cmd.prefix) {
        toStringArray(cmd.prefix).forEach(
          (pfx) => void this._simpleCommandMappedPrefix.add(pfx)
        );
      }
      if (this._simpleCommandsByName.some((c) => c.name === cmd.name)) {
        throw Error(`Duplicate simple command name: ${cmd.name}`);
      }
      this._simpleCommandsByName.push({ command: cmd, name: cmd.name });
      cmd.aliases.forEach((alias) => {
        if (this._simpleCommandsByName.some((c) => c.name === alias)) {
          throw Error(`Duplicate simple command name: ${alias}`);
        }
        this._simpleCommandsByName.push({ command: cmd, name: alias });
      });
    });
    this._simpleCommandsByName = this._simpleCommandsByName.sort((a, b) => {
      return b.name.length - a.name.length;
    });
  }
  groupSlashes() {
    const groupedSlashes = /* @__PURE__ */ new Map();
    this._applicationCommandSlashGroups.forEach((group) => {
      if (!group.payload.description) {
        throw Error(`Description required for slash group: ${group.name}`);
      }
      const slashParent = DApplicationCommand.create({
        contexts: group.payload.contexts,
        defaultMemberPermissions: group.payload.defaultMemberPermissions,
        description: group.payload.description,
        descriptionLocalizations: group.payload.descriptionLocalizations,
        dmPermission: group.payload.dmPermission,
        integrationTypes: group.payload.integrationTypes,
        name: group.name,
        nameLocalizations: group.payload.nameLocalizations,
        type: ApplicationCommandType5.ChatInput
      }).decorate(group.classRef, group.key, group.method);
      const discord = this._discords.find((instance) => {
        return instance.from === slashParent.from;
      });
      if (!discord) {
        return;
      }
      slashParent.discord = discord;
      slashParent.guilds = [...slashParent.discord.guilds];
      slashParent.botIds = [...slashParent.discord.botIds];
      groupedSlashes.set(group.name, slashParent);
      const slashes = this._applicationCommandSlashes.filter((slash) => {
        return slash.group === slashParent.name && !slash.subgroup;
      });
      slashes.forEach((slash) => {
        slashParent.options.push(slash.toSubCommand());
      });
      this._applicationCommandSlashesFlat.forEach((slash) => {
        if (slash.group === slashParent.name) {
          slash.guilds = slashParent.guilds;
          slash.botIds = slashParent.botIds;
        }
      });
    });
    this._applicationCommandSlashSubGroups.forEach((subGroup) => {
      if (!subGroup.payload.description) {
        throw Error(
          `Description required for slash sub group: ${subGroup.name} (root: ${subGroup.root ?? "unknown"})`
        );
      }
      const option = DApplicationCommandOption.create({
        description: subGroup.payload.description,
        descriptionLocalizations: subGroup.payload.descriptionLocalizations,
        name: subGroup.name,
        nameLocalizations: subGroup.payload.nameLocalizations,
        required: true,
        type: ApplicationCommandOptionType5.SubcommandGroup
      }).decorate(subGroup.classRef, subGroup.key, subGroup.method);
      const slashes = this._applicationCommandSlashes.filter((slash) => {
        return slash.group === subGroup.root && slash.subgroup === subGroup.name;
      });
      slashes.forEach((slash) => {
        option.options.push(slash.toSubCommand());
      });
      const groupName = subGroup.root ?? subGroup.name;
      const parentGroup = groupedSlashes.get(groupName);
      if (!parentGroup) {
        throw Error(`A subgroup declared without root: ${groupName}`);
      }
      parentGroup.options.push(option);
    });
    return [
      ...this._applicationCommandSlashes.filter((s) => !s.group && !s.subgroup),
      ...Array.from(groupedSlashes.values())
    ];
  }
};

// src/types/core/literal.ts
var SpecialCharactersList = [
  "~",
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "+",
  "=",
  "{",
  "}",
  "[",
  "]",
  "|",
  "\\",
  "/",
  ":",
  ";",
  '"',
  "'",
  "<",
  ">",
  ",",
  ".",
  "?",
  " "
];

// src/types/public/enum.ts
var ComponentType = /* @__PURE__ */ ((ComponentType2) => {
  ComponentType2[ComponentType2["Button"] = 0] = "Button";
  ComponentType2[ComponentType2["SelectMenu"] = 1] = "SelectMenu";
  ComponentType2[ComponentType2["Modal"] = 2] = "Modal";
  return ComponentType2;
})(ComponentType || {});
var SimpleCommandParseType = /* @__PURE__ */ ((SimpleCommandParseType2) => {
  SimpleCommandParseType2[SimpleCommandParseType2["notCommand"] = 0] = "notCommand";
  SimpleCommandParseType2[SimpleCommandParseType2["notFound"] = 1] = "notFound";
  return SimpleCommandParseType2;
})(SimpleCommandParseType || {});

// src/types/public/simple command.ts
var SimpleCommandOptionType = /* @__PURE__ */ ((SimpleCommandOptionType2) => {
  SimpleCommandOptionType2[SimpleCommandOptionType2["String"] = 0] = "String";
  SimpleCommandOptionType2[SimpleCommandOptionType2["Number"] = 1] = "Number";
  SimpleCommandOptionType2[SimpleCommandOptionType2["Boolean"] = 2] = "Boolean";
  SimpleCommandOptionType2[SimpleCommandOptionType2["User"] = 3] = "User";
  SimpleCommandOptionType2[SimpleCommandOptionType2["Channel"] = 4] = "Channel";
  SimpleCommandOptionType2[SimpleCommandOptionType2["Role"] = 5] = "Role";
  SimpleCommandOptionType2[SimpleCommandOptionType2["Mentionable"] = 6] = "Mentionable";
  return SimpleCommandOptionType2;
})(SimpleCommandOptionType || {});

// src/util/common.ts
function toStringArray(...input) {
  return input.flatMap((item) => Array.isArray(item) ? item : [item]);
}

// src/util/comparison.ts
function jsonToString(obj) {
  return JSON.stringify(
    obj,
    (_key, value) => typeof value === "bigint" ? value.toString() : value
  );
}
function RecursivelyMatchField(object, keys, onMatch) {
  Object.keys(object).forEach((k) => {
    if (keys.includes(k)) {
      onMatch(object, k);
    }
    if (object[k] && typeof object[k] === "object") {
      RecursivelyMatchField(object[k], keys, onMatch);
    }
  });
}
function isApplicationCommandEqual(findCommand, DCommand, isGuild) {
  const commandJson = findCommand.toJSON();
  const rawData = DCommand.toJSON();
  RecursivelyMatchField(
    commandJson,
    ["descriptionLocalizations", "nameLocalizations"],
    (object, key) => {
      if (object[key] === void 0) {
        object[key] = null;
      }
    }
  );
  RecursivelyMatchField(
    commandJson,
    ["descriptionLocalized", "nameLocalized", "dmPermission", "nsfw"],
    (object, key) => {
      if (object[key] === null) {
        object[key] = void 0;
      }
    }
  );
  if (isGuild) {
    RecursivelyMatchField(rawData, ["dmPermission"], (object, key) => {
      object[key] = void 0;
    });
  }
  const firstJson = JSON.parse(
    jsonToString(
      omitKeys(commandJson, [
        "applicationId",
        "defaultPermission",
        "descriptionLocalized",
        "guild",
        "guildId",
        "handler",
        "id",
        "nameLocalized",
        "permissions",
        "version"
      ])
    )
  );
  const secondJson = JSON.parse(jsonToString(rawData));
  return deepEqual(firstJson, secondJson);
}

// src/util/resolve-guilds.ts
var resolveIGuilds = async (client, command, guilds) => {
  const guildX = await Promise.all(
    guilds.map(
      async (guild) => typeof guild === "function" ? guild(client, command) : guild
    )
  );
  return [...new Set(guildX.flat(1))];
};

// src/util/slash-name-validator.ts
function SlashNameValidator(name) {
  const isNotValid = name.length === 0 || name.length > 32 || name.toLowerCase() !== name || SpecialCharactersList.some((c) => name.includes(c));
  if (isNotValid) {
    throw Error(
      `Invalid slash name: ${name}
Name must only be lowercase with no space as per Discord guidelines (https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming)
`
    );
  }
  return true;
}
export {
  ApplicationCommandManager,
  ApplicationCommandMixin,
  Bot,
  ButtonComponent,
  Client,
  ComponentType,
  ContextMenu,
  DApplicationCommand,
  DApplicationCommandGroup,
  DApplicationCommandOption,
  DApplicationCommandOptionChoice,
  DComponent,
  DDiscord,
  DGuard,
  DOn,
  DReaction,
  DSimpleCommand,
  DSimpleCommandOption,
  DebugManager,
  Discord,
  EventManager,
  Guard,
  Guild,
  InteractionHandler,
  MetadataStorage,
  ModalComponent,
  On,
  Once,
  Reaction,
  ReactionManager,
  RecursivelyMatchField,
  SelectMenuComponent,
  SimpleCommand,
  SimpleCommandManager,
  SimpleCommandMessage,
  SimpleCommandOption,
  SimpleCommandOptionType,
  SimpleCommandParseType,
  Slash,
  SlashChoice,
  SlashGroup,
  SlashNameValidator,
  SlashOption,
  SpecialCharactersList,
  isApplicationCommandEqual,
  resolveIGuilds,
  toStringArray
};
/*! Bundled license information:

reflect-metadata/Reflect.js:
  (*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** *)
*/
