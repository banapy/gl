import babel from '@rollup/plugin-babel'
// import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import path from 'path'
import resolve from 'rollup-plugin-node-resolve' // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
import { eslint } from 'rollup-plugin-eslint' // eslint插件
import ts from 'rollup-plugin-typescript2'
const getPath = _path => path.resolve(__dirname, _path)
import packageJSON from './package.json'

const extensions = [
    '.js',
    '.ts',
    '.tsx'
]
export default {
    input: "./scripts/index.ts",
    output: {
        format: 'umd',
        file: 'dist/bundle.js', // 打包后输出文件
        name: 'window',  // 打包后的内容会挂载到window，name就是挂载到window的名称
        sourcemap: true // 代码调试  开发环境填true
    },
    plugins: [
        resolve(extensions),
        commonjs(),
        // eslint({
        //     throwOnError: true,
        //     include: ['scripts/**/*.ts'],
        //     exclude: ['node_modules/**', 'lib/**']
        // }),
        ts({
            tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
            extensions
        }),

        babel({
            exclude: 'node_modules/**'
        }),
        // uglify(),
        livereload(),
        serve({
            open: true,
            port: 8001,
            openPage: "/examples/index.html",
            contentBase: "",
        }),

    ],
}