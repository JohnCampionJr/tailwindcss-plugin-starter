import * as plugin from 'tailwindcss/plugin'
import type { KeyValuePair, ResolvableTo } from 'tailwindcss/types/config'

export interface PluginThemeConfig {
  tabSize: ResolvableTo<KeyValuePair>
}

export interface PluginConfig {
  className: string
  theme: Partial<PluginThemeConfig>
}

const examplePlugin = plugin.withOptions<PluginConfig>(
  function (options) {
    const className = options ? options.className : 'markdown'

    return function ({ addBase, addUtilities, matchUtilities, addComponents, addVariant, theme }) {
      /**
       * Add base styles
       * https://tailwindcss.com/docs/plugins#adding-base-styles
       */

      addBase({
        h1: { fontSize: theme('fontSize.3xl') },
        h2: { fontSize: theme('fontSize.xl') },
      })

      /**
       * Static utilities
       * https://tailwindcss.com/docs/plugins#static-utilities
       */

      addUtilities({
        '.content-hidden': {
          'content-visibility': 'hidden',
        },
        '.content-visible': {
          'content-visibility': 'visible',
        },
      })

      /**
       * Dynamic utilities
       * https://tailwindcss.com/docs/plugins#dynamic-utilities
       */

      matchUtilities(
        {
          tab: (value: any) => ({
            tabSize: value,
          }),
        },
        { values: theme('tabSize') }
      )

      /**
       * Adding components
       * https://tailwindcss.com/docs/plugins#adding-components
       */

      addComponents({
        [`.${className}`]: {
          padding: '.5rem 1rem',
          fontWeight: '600',
        },
      })

      /**
       * Add variants
       * https://tailwindcss.com/docs/plugins#adding-variants
       */

      addVariant('optional', '&:optional')

      // @ts-expect-error ctx is not in TW types
      addVariant('foo', ctx => {
        // Do stuff with ctx
        return `& ${ctx.container.nodes[0].selector}`
      })
    }
  },
  // @ts-expect-error - Config is return value, but content is not included here
  function (options) {
    /**
     * Provide default values
     */
    return {
      theme: {
        tabSize: {
          1: '1',
          2: '2',
          4: '4',
          8: '8',
        },
      },
    } as Partial<PluginConfig>
  }
)

module.exports = examplePlugin
