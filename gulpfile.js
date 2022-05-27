const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const browsersync = require("browser-sync").create();

// HTML task
gulp.task("html", () => {
	return gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

// Typescript task
gulp.task("ts", () => {
	return gulp.src("src/*.ts").pipe(tsProject()).pipe(gulp.dest("dist"));
});

// Sass task
gulp.task("sass", () => {
	return gulp.src("src/style.scss").pipe(sass()).pipe(gulp.dest("dist")).pipe(browsersync.stream());
});

// Watch task
gulp.task("watch", () => {
	gulp.watch(["src/*.html", "src/*.ts"], gulp.series("html", "ts", "browsersyncReload"));
	gulp.watch("src/style.scss", gulp.series("sass"));
});

// Browser sync tasks
gulp.task("browsersyncServe", (cb) => {
	browsersync.init({
		port: 5500,
		server: { baseDir: "./dist" },
	});
	cb();
});

gulp.task("browsersyncReload", (cb) => {
	browsersync.reload();
	cb();
});

// Default task
gulp.task("default", gulp.series("browsersyncServe", "html", "ts", "sass", "watch"));
