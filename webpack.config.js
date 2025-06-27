const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.resolve(__dirname, "app");
const dirShared = path.resolve(__dirname, "shared");
const dirStyles = path.resolve(__dirname, "styles");
const dirNode = "node_modules";

module.exports = {
    entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],
    resolve: {
        modules: [dirApp, dirShared, dirStyles, dirNode],
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./shared",
                    to: "",
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new CleanWebpackPlugin(),
    ],
    performance: {
        hints: IS_DEVELOPMENT ? false : "warning",
        maxAssetSize: 250000, // 250kb
        maxEntrypointSize: 250000, // 250kb
        assetFilter: function (assetFilename) {
            // Only show warnings for js and css files, exclude images
            return (
                (assetFilename.endsWith(".js") || assetFilename.endsWith(".css")) &&
                !assetFilename.match(/\.(png|jpe?g|gif|svg|webp)$/i)
            );
        },
    },
    optimization: {
        minimize: true,
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        encodeOptions: {
                            jpeg: {
                                quality: 80,
                            },
                            png: {
                                quality: 80,
                            },
                            webp: {
                                quality: 80,
                            },
                        },
                    },
                },
            }),
            new TerserPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader, options: { publicPath: "" } },
                    { loader: "css-loader" },
                    { loader: "postcss-loader" },
                    { loader: "sass-loader" },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|woff|woff2|eot|ttf|otf|fnt)$/,
                loader: "file-loader",
                options: {
                    name() {
                        return "[hash].[ext]";
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                enforce: "pre",
                use: [
                    {
                        loader: ImageMinimizerPlugin.loader,
                        options: {
                            minimizer: {
                                implementation: ImageMinimizerPlugin.sharpMinify,
                                options: {
                                    encodeOptions: {
                                        jpeg: {
                                            quality: 80,
                                        },
                                        png: {
                                            quality: 80,
                                        },
                                        webp: {
                                            quality: 80,
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: "raw-loader",
                exclude: /node_modules/,
            },

            {
                test: /\.(glsl|frag|vert)$/,
                loader: "glslify-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
