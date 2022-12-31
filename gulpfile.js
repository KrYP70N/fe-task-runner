const { src, dest, parallel, series } = require('gulp')
const gulpIf = require('gulp-if')
const pug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'))
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const babel = require('gulp-babel')

require('dotenv').config()
const { NODE_ENV, OUTPUT_TEMPLATE, OUTPUT_STYLE, OUTPUT_ASSET, OUTPUT_JS } = process.env
const production = NODE_ENV === 'prod'

const template = _ => {
  return src('./src/template/*.pug')
    .pipe(pug({
      pretty: production ? true : false
    }))
    .pipe(dest(OUTPUT_TEMPLATE))
}

const style = _ => {
  return src('./src/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(production, uglify()))
    .pipe(dest(OUTPUT_STYLE))
}

const javascript = _ => {
  return src('./src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpIf(production, uglify()))
    .pipe(dest(OUTPUT_JS))
}

const asset = _ => {
  return src('./src/asset/**/*.*')
    .pipe(dest(OUTPUT_ASSET))
}

const cleanDist = _ => {
  return src('dist', { read: false, allowEmpty: true })
    .pipe(clean())
}

exports.default = series(cleanDist, parallel(template, style, javascript, asset))