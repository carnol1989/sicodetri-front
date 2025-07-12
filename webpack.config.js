const path = require('path');

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
