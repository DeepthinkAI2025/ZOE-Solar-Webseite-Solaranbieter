/**
 * Simple DI Container - Fallback Alternative to tsyringe
 *
 * This is a lightweight dependency injection container that can be used
 * as a fallback if tsyringe/reflect-metadata issues persist.
 */

type ServiceFactory<T = any> = () => T;
type ServiceDefinition<T = any> = {
  instance?: T;
  factory?: ServiceFactory<T>;
  singleton: boolean;
};

class SimpleDIContainer {
  private services = new Map<string, ServiceDefinition>();

  /**
   * Register a singleton service
   */
  registerSingleton<T>(token: string | symbol, factory: ServiceFactory<T>): void {
    const key = this.getKey(token);
    this.services.set(key, {
      factory,
      singleton: true
    });
  }

  /**
   * Register a transient service (new instance each time)
   */
  registerTransient<T>(token: string | symbol, factory: ServiceFactory<T>): void {
    const key = this.getKey(token);
    this.services.set(key, {
      factory,
      singleton: false
    });
  }

  /**
   * Register an instance directly
   */
  registerInstance<T>(token: string | symbol, instance: T): void {
    const key = this.getKey(token);
    this.services.set(key, {
      instance,
      singleton: true
    });
  }

  /**
   * Resolve a service
   */
  resolve<T>(token: string | symbol): T {
    const key = this.getKey(token);
    const service = this.services.get(key);

    if (!service) {
      throw new Error(`Service not registered: ${key}`);
    }

    // Return existing instance for singletons
    if (service.instance !== undefined) {
      return service.instance as T;
    }

    // Create new instance
    if (service.factory) {
      const instance = service.factory();

      // Store instance if singleton
      if (service.singleton) {
        service.instance = instance;
      }

      return instance;
    }

    throw new Error(`Cannot resolve service: ${key}`);
  }

  /**
   * Check if a service is registered
   */
  isRegistered(token: string | symbol): boolean {
    const key = this.getKey(token);
    return this.services.has(key);
  }

  /**
   * Clear all registered services
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Remove a specific service
   */
  remove(token: string | symbol): boolean {
    const key = this.getKey(token);
    return this.services.delete(key);
  }

  private getKey(token: string | symbol): string {
    return typeof token === 'string' ? token : token.toString();
  }
}

// Global container instance
const container = new SimpleDIContainer();

/**
 * Decorator for registering singleton services
 */
export function singleton(token?: string | symbol) {
  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    const key = token || constructor.name;

    // Register with container
    container.registerSingleton(key, () => {
      return new constructor();
    });

    // Add a static resolve method for convenience
    (constructor as any).resolve = () => container.resolve(key);

    return constructor;
  };
}

/**
 * Decorator for injecting dependencies
 */
export function inject(token: string | symbol) {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    // This is a simplified version - in production, you'd want more sophisticated
    // parameter decoration handling
    const injectionKey = `${target.constructor.name}_injections`;
    if (!target[injectionKey]) {
      target[injectionKey] = [];
    }
    target[injectionKey][parameterIndex] = token;
  };
}

/**
 * Resolve a service from the container
 */
export function resolve<T>(token: string | symbol): T {
  return container.resolve<T>(token);
}

/**
 * Register a singleton service
 */
export function registerSingleton<T>(token: string | symbol, factory: ServiceFactory<T>): void {
  container.registerSingleton(token, factory);
}

/**
 * Register a transient service
 */
export function registerTransient<T>(token: string | symbol, factory: ServiceFactory<T>): void {
  container.registerTransient(token, factory);
}

/**
 * Register an instance
 */
export function registerInstance<T>(token: string | symbol, instance: T): void {
  container.registerInstance(token, instance);
}

/**
 * Get the global container instance
 */
export function getContainer(): SimpleDIContainer {
  return container;
}

/**
 * Utility to create a service with auto-registration
 */
export function createService<T>(
  factory: ServiceFactory<T>,
  options: { singleton?: boolean; token?: string | symbol } = {}
): () => T {
  const { singleton = true, token = factory.name } = options;

  if (singleton) {
    container.registerSingleton(token, factory);
  } else {
    container.registerTransient(token, factory);
  }

  return () => container.resolve(token);
}

// Export the container class for advanced usage
export { SimpleDIContainer };
export default container;