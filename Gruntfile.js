module.exports = function (grunt) {
    const banner = `/*
 *    ______                  _                _____  ______
 *   |  ____|                | |              |  __ \\|  ____|
 *   | |__ ___  _ __ ___  ___| |_ _ __ _   _  | |__) | |__
 *   |  __/ _ \\| '__/ _ \\/ __| __| '__| | | | |  ___/|  __|
 *   | | | (_) | | |  __/\\__ \\ |_| |  | |_| | | |    | |____
 *   |_|  \\___/|_|  \\___||___/\\__|_|   \\__, | |_|    |______|
 *                                      __/ |
 *                                     |___/
 *
 * Built at ${(new Date()).toDateString()}
 * © DDCompany (https://vk.com/id331953744)
 */\n`;
    const modFiles = [
        'gui/**',
        'lib/**',
        'res/**',
        "build.config",
        "config.json",
        "launcher.js",
        "mod.info",
        "mod_icon.png",
        "main.js"
    ];

    function createModInfo(version = "") {
        grunt.file.delete("mod.info");
        grunt.file.write("mod.info", JSON.stringify({
            name: "ForestryPE",
            author: "DDCompany",
            description: "Need Wood? Get Forestry!",
            version: version
        }, null, '\t'))
    }

    function readIncludes(dir) {
        let arr = [];

        grunt.file.read(dir + "/.includes")
            .split("\n")
            .forEach((text) => {
                if (text.trim()
                    && !text.startsWith("#")
                    && !text.startsWith("//")) {
                    arr.push(dir + "/" + text)
                }
            });

        return arr;
    }

    grunt.initConfig({
        concat: {
            options: {
                banner: banner
            },
            dist: {
                src: readIncludes("dev"),
                dest: 'main.js',
            }
        },

        compress: {
            icmod: {
                options: {
                    mode: "zip",
                    archive: function () {
                        return `releases/ForestryPE-${grunt.option("ver")}.icmod`
                    }
                },
                files: [
                    {
                        src: modFiles,
                        dest: "Forestry/"
                    }
                ]
            },
            zip: {
                options: {
                    mode: "zip",
                    archive: function () {
                        return `releases/ForestryPE-${grunt.option("ver")}.zip`
                    }
                },
                files: [
                    {
                        src: modFiles
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', "", function () {
        grunt.task.run("concat");
        createModInfo()
    });

    grunt.registerTask('release', "", function () {
        const version = grunt.option("ver");
        createModInfo(version);
        grunt.task.run("concat");

        if (!grunt.option("zip")) {
            grunt.task.run("compress:icmod");
        } else grunt.task.run("compress:zip");
    });
};