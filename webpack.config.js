/**
 * @file webpack.config.js
 * @description Configuración principal de Webpack para la aplicación React.
 * Define la entrada, salida, reglas de transformación (Babel),
 * resolución de módulos y servidor de desarrollo con soporte HMR.
 *
 * @requires path Módulo nativo de Node.js para gestionar rutas de archivos y directorios.
 */
const path = require('path');

/**
 * Configuración de Webpack para compilar y servir la aplicación en entorno de desarrollo.
 *
 * @type {Configuration}
 * @property {string} entry - Punto de entrada de la aplicación.
 * @property {object} output - Configuración de salida del bundle.
 * @property {string} output.path - Ruta absoluta de la carpeta de salida.
 * @property {string} output.filename - Nombre del archivo compilado.
 * @property {boolean} output.clean - Limpia la carpeta de salida en cada build.
 * @property {object} module - Reglas de transformación para los módulos.
 * @property {Array<object>} module.rules - Lista de reglas aplicadas a los archivos fuente.
 * @property {RegExp} module.rules.test - Expresión regular para identificar archivos soportados (.js, .mjs).
 * @property {RegExp} module.rules.exclude - Exclusión de la carpeta node_modules.
 * @property {object} module.rules.use - Loader utilizado en la transformación.
 * @property {string} module.rules.use.loader - Loader principal (`babel-loader`).
 * @property {object} module.rules.use.options - Opciones de configuración de Babel.
 * @property {string[]} module.rules.use.options.presets - Presets de Babel (`@babel/preset-env`, `@babel/preset-react`).
 * @property {string[]} module.rules.use.options.plugins - Plugins de Babel (`@babel/plugin-transform-runtime`).
 * @property {object} resolve - Configuración de resolución de módulos.
 * @property {string[]} resolve.extensions - Extensiones soportadas (.js, .jsx, .mjs).
 * @property {object} devServer - Configuración del servidor de desarrollo.
 * @property {object} devServer.static - Directorio estático a servir (reemplazo de contentBase).
 * @property {boolean} devServer.compress - Habilita compresión gzip.
 * @property {number} devServer.port - Puerto en el que corre el servidor (3000).
 * @property {boolean} devServer.open - Abre el navegador automáticamente.
 * @property {boolean} devServer.hot - Habilita Hot Module Replacement (HMR).
 * @property {string} mode - Modo de compilación (`development`).
 */
module.exports = {
    entry: './src/index.js', // Punto de entrada
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js', // Archivo compilado
        clean: true, // Limpia /dist en cada build
    },
    module: {
        rules: [
            {
                test: /\.m?js$/, // Soporta .js y .mjs
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-transform-runtime'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.mjs'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Reemplaza contentBase
        },
        compress: true,
        port: 3000,
        open: true, // Abre el navegador automáticamente
        hot: true,  // HMR (Hot Module Replacement)
    },
    mode: 'development',
};
