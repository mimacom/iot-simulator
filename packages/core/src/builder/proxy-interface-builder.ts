import { InterfaceBuilder } from './interface-builder.type';

class ProxyInterfaceBuilder<T> {
    private built: T = {} as T;
    private readonly proxy: InterfaceBuilder<T>;

    constructor(defaults?: T) {
          this.assignDefaults(defaults);
          this.proxy = new Proxy(
                  {},
                  {
                            get: (target: object, propertyKey: PropertyKey) =>
                    this.handleProxyGet(propertyKey),
                          }) as InterfaceBuilder<T>;
        }

    public getProxy(): InterfaceBuilder<T> {
          return this.proxy;
        }

    private handleProxyGet(propertyKey: PropertyKey): any {
          if (propertyKey === 'build') {
                  return () => this.build();
                }

          return (value: any): InterfaceBuilder<T> => {
                  Object.assign(this.built, {[propertyKey]: value});

                  return this.proxy;
                };
        }

    private assignDefaults(defaults: T): void {
          if (defaults) {
                  this.built = Object.assign({}, this.built, defaults);
                }
        }

    private build(): T {
          return this.built;
        }
}

/**
 *  * Provides builders method based on given `T` interface.
 *   *
 *    * @param defaults Default T object to ensure that all required properties are filled
 *     * @returns InterfaceBuilder
 *      */
export function builderOf<T>(defaults?: T): InterfaceBuilder<T> {
    return new ProxyInterfaceBuilder<T>(defaults).getProxy();
}

