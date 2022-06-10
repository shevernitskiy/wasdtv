import typescript from 'rollup-plugin-typescript2'
export default [
  {
    input: './src/wasdtv.ts',
    output: {
      file: './lib/wasdtv.esm.js',
      format: 'esm',
    },
    plugins: [typescript()],
    external: ['axios', 'socket.io-client', 'events', 'm3u8stream'],
  },
  {
    input: './src/wasdtv.ts',
    output: {
      file: './lib/wasdtv.js',
      format: 'cjs',
    },
    plugins: [typescript()],
    external: ['axios', 'socket.io-client', 'events', 'm3u8stream'],
  },
]
