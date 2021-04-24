import scss from "rollup-plugin-scss";

export default {
  input: 'src/index.js',
  plugins: [
    scss({
      output: "./dist/main.css",
      outputStyle: "compressed",
      failOnError: true,
    })
  ],
  output: {
    sourcemap: false,
    exports: 'named',
    file: 'dist/_index.js',
    format: 'es'
  }
}