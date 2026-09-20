import { QuartzComponent, QuartzComponentConstructor } from "./types"

export interface ComponentManifest {
  name: string
  displayName: string
  description: string
  version: string
  quartzVersion?: string
  author?: string
  homepage?: string
  defaultPosition?: string
  defaultPriority?: number
}

export interface RegisteredComponent {
  component: QuartzComponent | QuartzComponentConstructor
  source: string
  manifest?: ComponentManifest
}

/** @internal Exported for testing only. */
export class ComponentRegistry {
  private components = new Map<string, RegisteredComponent>()
  private instanceCache = new Map<string, QuartzComponent>()
  private optionOverrides = new Map<string, Record<string, unknown>>()
  // Identity for constructors, used to build cache keys. Held in a WeakMap
  // rather than stamped onto the constructor so ids can't leak between
  // registries, and issued from a counter that never rewinds — deriving them
  // from instanceCache.size let a cleared cache hand a newly-seen constructor
  // an id another constructor still held, so the two shared a cache entry.
  private ctorIds = new WeakMap<object, string>()
  private nextCtorId = 0

  register(
    name: string,
    component: QuartzComponent | QuartzComponentConstructor,
    source: string,
    manifest?: ComponentManifest,
  ): void {
    const existing = this.components.get(name)
    if (existing && existing.source !== source) {
      console.warn(`Component "${name}" is being overwritten by ${source}`)
    }
    this.components.set(name, { component, source, manifest })
  }

  get(name: string): RegisteredComponent | undefined {
    return this.components.get(name)
  }

  getAll(): Map<string, RegisteredComponent> {
    return new Map(this.components)
  }

  /** Store option overrides for a plugin, keyed by plugin directory name. */
  setOptionOverrides(pluginName: string, opts?: Record<string, unknown>): void {
    if (!opts || Object.keys(opts).length === 0) return
    this.optionOverrides.set(pluginName, { ...this.optionOverrides.get(pluginName), ...opts })
    this.instanceCache.clear()
  }

  getOptionOverrides(pluginName: string): Record<string, unknown> | undefined {
    return this.optionOverrides.get(pluginName)
  }

  /**
   * Instantiate a component constructor with options, returning a cached instance
   * if the same constructor was already called with equivalent options.
   * This prevents duplicate afterDOMLoaded scripts when the same component
   * appears in multiple page-type layouts.
   */
  instantiate(
    constructor: QuartzComponentConstructor<any>,
    options?: Record<string, unknown>,
  ): QuartzComponent {
    const optsKey = options !== undefined ? JSON.stringify(options) : ""
    // Use constructor identity + serialized options as cache key
    const cacheKey = `${this.idFor(constructor)}:${optsKey}`

    const cached = this.instanceCache.get(cacheKey)
    if (cached) return cached

    const instance = constructor(options)
    this.instanceCache.set(cacheKey, instance)
    return instance
  }

  getAllComponents(): QuartzComponent[] {
    // Deduplicate by component reference (same constructor may be registered under multiple keys)
    const seen = new Set<QuartzComponent | QuartzComponentConstructor>()
    const results: QuartzComponent[] = []
    for (const r of this.components.values()) {
      if (seen.has(r.component)) continue
      seen.add(r.component)
      try {
        let instance: QuartzComponent
        if (typeof r.component === "function") {
          // Check if this constructor was already instantiated (with any options).
          // Re-instantiating with `undefined` when options were provided would create
          // a duplicate instance with separate afterDOMLoaded scripts.
          const existing = this.findCachedInstance(r.component as QuartzComponentConstructor)
          instance =
            existing ?? this.instantiate(r.component as QuartzComponentConstructor, undefined)
        } else {
          instance = r.component as QuartzComponent
        }
        if (instance) {
          results.push(instance)
        }
      } catch {
        // Skip components that fail to instantiate
      }
    }
    return results
  }

  /** @internal For testing only — resets all registry state. */
  clear(): void {
    this.components.clear()
    this.instanceCache.clear()
    this.optionOverrides.clear()
    // Reset the ids alongside the cache they key into. Resetting only one of
    // the two is what caused constructors to collide on a shared cache entry.
    this.ctorIds = new WeakMap()
    this.nextCtorId = 0
  }

  /** Stable id for a constructor, assigned on first use. */
  private idFor(constructor: QuartzComponentConstructor<any>): string {
    let id = this.ctorIds.get(constructor)
    if (id === undefined) {
      id = `ctor_${this.nextCtorId++}`
      this.ctorIds.set(constructor, id)
    }
    return id
  }

  private findCachedInstance(
    constructor: QuartzComponentConstructor<any>,
  ): QuartzComponent | undefined {
    // Look up only — a constructor with no id has never been instantiated.
    const ctorId = this.ctorIds.get(constructor)
    if (!ctorId) return undefined
    for (const [key, instance] of this.instanceCache) {
      if (key.startsWith(`${ctorId}:`)) return instance
    }
    return undefined
  }
}

export const componentRegistry = new ComponentRegistry()

export function defineComponent<Options extends object | undefined = undefined>(
  factory: QuartzComponentConstructor<Options>,
  manifest: ComponentManifest,
): QuartzComponentConstructor<Options> {
  ;(factory as any).__quartzComponent = { manifest }
  return factory
}
