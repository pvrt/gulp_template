/* -------------------------
plugins
------------------------- */
const glyphs            = '! "#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~©«»ЁАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяё‐‑‒–—―‘‚“„…‰™°₽€”’′″×';
const browsersync       = require("browser-sync").create();
const del               = require("del");
const ttf2woff2         = require('gulp-ttf2woff2');
const ttf2woff          = require('gulp-ttf2woff');
const gulp              = require("gulp");
const plumber           = require("gulp-plumber");
const autoprefixer      = require('gulp-autoprefixer');
const svgmin            = require('gulp-svgmin');
const pug               = require("gulp-pug");
const sass              = require("gulp-dart-sass");
const sassGlob          = require('gulp-sass-glob');
const webpack           = require('webpack-stream');
const embedSvg          = require('gulp-embed-svg');

/* -------------------------
paths
------------------------- */
const path = {
  source: {
    root: "./source/",
    scss: "./source/scss/",
    js: "./source/js/",
    pug: "./source/pug/",
    images: "./source/images/",
    svg: "./source/svg/",
    fonts: "./source/fonts/*",
    static: "./static/"
  },
  build: {
    root: "./build/",
    css: "./build/css/",
    js: "./build/js/",
    images: "./build/images/",
    svg: "./build/svg/",
    fonts: "./build/fonts/"
  }
}

/* -------------------------
browsersync
------------------------- */
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: path.build.root
    },
    port: 80,
    ui: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: {
        submit: false,
        inputs: false,
        toggles: false
      }
    },
    logLevel: "info",
    open: false,
    tunnel: false
  });
  done();
}

/* -------------------------
clean
------------------------- */
function clean() {
  return del([path.build.root]);
}

/* -------------------------
images
------------------------- */
function images() {
  return gulp.src(path.source.images + "**/*")
    .pipe(gulp.dest(path.build.images));
}

/* -------------------------
svg
------------------------- */
function svg() {
  return gulp.src(path.source.svg + "**/*")
    .pipe(svgmin({
      multipass: true,
      full: true,
      plugins: [
        'preset-default',
        'sortAttrs',
        'removeComments',
        'removeEmptyAttrs',
        'removeEmptyText',
        'removeEmptyContainers',
        'removeUselessStrokeAndFill',
        'removeViewBox',
        {
          name: 'removeAttrs',
          params: {
            attrs: '(fill|stroke)'
          }
        },
        {
          name: 'cleanupIDs',
          params: {
            minify: true,
          }
        }
      ]
    }))
    .pipe(gulp.dest(path.build.svg));
}

/* -------------------------
scss
------------------------- */
function styles() {
  return gulp.src(path.source.scss + "style.scss")
    .pipe(sassGlob())
    .pipe(plumber())
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(path.build.css))
    .pipe(browsersync.stream());
}

/* -------------------------
js
------------------------- */
function scripts() {
  return gulp.src([path.source.root])
    .pipe(webpack(require('./webpack.config.js'), null, function(err, stats) {}))
    .pipe(gulp.dest(path.build.js))
    .pipe(browsersync.stream())
}

/* -------------------------
pages
------------------------- */
function pages() {
  return gulp.src([path.source.pug + "./pages/*.pug"])
    .pipe(pug({
      pretty: true
    }))
    .pipe(embedSvg({
      selectors: 'img[src*="svg"] ',
      root: './build/svg'
    }))
    .pipe(gulp.dest(path.build.root))
    .pipe(browsersync.stream())
}

/* -------------------------
fonts
------------------------- */
function fontsWoff() {
  return gulp.src([path.source.fonts + "*.{ttf,otf}"])
    .pipe(ttf2woff())
    .pipe(gulp.dest(path.build.fonts))
}

function fontsWoff2() {
  return gulp.src([path.source.fonts + "*.{ttf,otf}"])
    .pipe(ttf2woff2())
    .pipe(gulp.dest(path.build.fonts))
}

/* -------------------------
static
------------------------- */
function static() {
  return gulp.src(path.source.static + "**/*")
    .pipe(gulp.dest(path.build.root));
}

/* -------------------------
watch
------------------------- */
function watchFiles() {
  gulp.watch(path.source.scss + "**/*", styles);
  gulp.watch(path.source.js + "**/*", scripts);
  gulp.watch(path.source.svg + "**/*", svg);
  gulp.watch(path.source.pug + "**/*", pages);
  gulp.watch(path.source.images + "**/*", images);
  gulp.watch(path.source.static + "**/*", static);
}

/* -------------------------
tasks
------------------------- */
const build = gulp.series(
  clean,
  svg,
  gulp.parallel(
    static,
    fontsWoff,
    fontsWoff2,
    styles,
    images,
    scripts,
    pages
  )
);

const watch = gulp.series(
  build,
  gulp.parallel(
    watchFiles,
    browserSync
  )
);

/* -------------------------
export tasks
------------------------- */
exports.svg = svg;
exports.images = images;
exports.styles = styles;
exports.js = scripts;
exports.fontsWoff = fontsWoff;
exports.fontsWoff2 = fontsWoff2;
exports.clean = clean;
exports.pages = pages;
exports.build = build;
exports.default = watch;