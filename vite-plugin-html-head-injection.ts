import type { Plugin } from 'vite';

/**
 * HTML Head Script-Injection Plugin for Critical Polyfills
 *
 * This plugin injects critical polyfills (like reflect-metadata) directly into the HTML head
 * to ensure they load before any other bundled code, solving timing and load order issues.
 */
export function htmlHeadScriptInjectionPlugin(): Plugin {
  return {
    name: 'html-head-script-injection',
    transformIndexHtml(html) {
      // Critical reflect-metadata polyfill script with synchronous execution
      const reflectMetadataPolyfill = `
<script data-polyfill="reflect-metadata">
// SYNCHRONOUS reflect-metadata polyfill - executes immediately
(function(){
  'use strict';
  console.log('🔧 Loading reflect-metadata polyfill...');

  // Create Reflect object if missing
  if (typeof window.Reflect === 'undefined') {
    window.Reflect = {};
    console.log('✅ Created Reflect object');
  }

  // Only add methods if they don't exist
  if (typeof window.Reflect.getMetadata === 'undefined') {
    const metadata = new Map();
    const metadataKeys = new Map();

    window.Reflect.defineMetadata = function(metadataKey, metadataValue, target, propertyKey) {
      const targetKey = typeof target === 'function' ? target.name : (target.constructor ? target.constructor.name : target.toString());
      if (!metadata.has(targetKey)) {
        metadata.set(targetKey, new Map());
        metadataKeys.set(targetKey, new Set());
      }
      const targetMetadata = metadata.get(targetKey);
      const targetKeys = metadataKeys.get(targetKey);
      const key = (propertyKey && propertyKey.toString) ? propertyKey.toString() : 'constructor';
      targetMetadata.set(metadataKey + ':' + key, metadataValue);
      targetKeys.add(key);
    };

    window.Reflect.getMetadata = function(metadataKey, target, propertyKey) {
      const targetKey = typeof target === 'function' ? target.name : (target.constructor ? target.constructor.name : target.toString());
      const targetMetadata = metadata.get(targetKey);
      if (!targetMetadata) {
        const proto = Object.getPrototypeOf(target);
        if (proto && proto !== Object.prototype) {
          return arguments.callee(metadataKey, proto, propertyKey);
        }
        return undefined;
      }
      const key = (propertyKey && propertyKey.toString) ? propertyKey.toString() : 'constructor';
      return targetMetadata.get(metadataKey + ':' + key);
    };

    window.Reflect.getOwnMetadata = function(metadataKey, target, propertyKey) {
      const targetKey = typeof target === 'function' ? target.name : (target.constructor ? target.constructor.name : target.toString());
      const targetMetadata = metadata.get(targetKey);
      if (!targetMetadata) return undefined;
      const key = (propertyKey && propertyKey.toString) ? propertyKey.toString() : 'constructor';
      return targetMetadata.get(metadataKey + ':' + key);
    };

    window.Reflect.hasMetadata = function(metadataKey, target, propertyKey) {
      return window.Reflect.getMetadata(metadataKey, target, propertyKey) !== undefined;
    };

    window.Reflect.hasOwnMetadata = function(metadataKey, target, propertyKey) {
      return window.Reflect.getOwnMetadata(metadataKey, target, propertyKey) !== undefined;
    };

    window.Reflect.getMetadataKeys = function(target, propertyKey) {
      const targetKey = typeof target === 'function' ? target.name : (target.constructor ? target.constructor.name : target.toString());
      const targetKeys = metadataKeys.get(targetKey);
      if (!targetKeys) {
        const proto = Object.getPrototypeOf(target);
        if (proto && proto !== Object.prototype) {
          return arguments.callee(proto, propertyKey);
        }
        return [];
      }
      const keys = Array.from(targetKeys);
      if (propertyKey !== undefined) {
        return keys.filter(k => k === propertyKey.toString());
      }
      return keys;
    };

    window.Reflect.getOwnMetadataKeys = function(target, propertyKey) {
      const targetKey = typeof target === 'function' ? target.name : (target.constructor ? target.constructor.name : target.toString());
      const targetKeys = metadataKeys.get(targetKey);
      if (!targetKeys) return [];
      const keys = Array.from(targetKeys);
      if (propertyKey !== undefined) {
        return keys.filter(k => k === propertyKey.toString());
      }
      return keys;
    };

    window.Reflect.deleteMetadata = function(metadataKey, target, propertyKey) {
      const targetKey = typeof target === 'function' ? target.name : (target.constructor ? target.constructor.name : target.toString());
      const targetMetadata = metadata.get(targetKey);
      const targetKeys = metadataKeys.get(targetKey);
      if (targetMetadata && targetKeys) {
        const key = (propertyKey && propertyKey.toString) ? propertyKey.toString() : 'constructor';
        targetMetadata.delete(metadataKey + ':' + key);
        if (Object.keys(targetMetadata).length === 0) {
          metadata.delete(targetKey);
          metadataKeys.delete(targetKey);
        } else {
          targetKeys.delete(key);
        }
      }
    };

    // Mark polyfill as ready
    window.Reflect._polyfillReady = true;
    console.log('✅ Complete reflect-metadata polyfill loaded with', metadata.size, 'targets');
    console.log('🔍 Available Reflect methods:', Object.getOwnPropertyNames(Reflect).filter(name => typeof Reflect[name] === 'function'));
  } else {
    console.log('ℹ️ Reflect already available');
    window.Reflect._polyfillReady = true;
  }
})();
</script>

<!-- Ensure polyfill is loaded before any other scripts -->
<script>
// Block script execution until polyfill is ready
(function checkPolyfill() {
  if (window.Reflect && window.Reflect._polyfillReady) {
    console.log('✅ Reflect polyfill verified and ready');
  } else {
    console.warn('⏳ Waiting for Reflect polyfill...');
    setTimeout(checkPolyfill, 10);
  }
})();
</script>`;

      // Find the position to inject the script (after <head> or before first script)
      const headMatch = html.match(/<head[^>]*>/i);

      if (headMatch && headMatch.index !== undefined) {
        const insertionPoint = headMatch.index + headMatch[0].length;

        // Insert the polyfill script after the <head> tag
        const modifiedHtml =
          html.slice(0, insertionPoint) +
          '\n' + reflectMetadataPolyfill + '\n' +
          html.slice(insertionPoint);

        console.log('✅ Injected reflect-metadata polyfill into HTML head');
        return modifiedHtml;
      } else {
        console.warn('⚠️ Could not find <head> tag in HTML for injection');
        return html;
      }
    }
  };
}