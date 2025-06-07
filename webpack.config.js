const path = require('path');

module.exports = {
    entry: './src/index.js',  // Punto de entrada de tu aplicación
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',   // Archivo de salida
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,  // Configuración para archivos .mjs
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-transform-runtime'],
                    },
                },
            },
            // Puedes agregar más reglas aquí para otros tipos de archivos
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.mjs'],
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 3000,
    },
};
