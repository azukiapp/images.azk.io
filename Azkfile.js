/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  "images-azk": {
    // Dependent systems
    depends: [],
    // More images:  http://images.azk.io
    image: {"docker": "node:0.10"},
    // Steps to execute before running instances
    provision: [
      "npm install",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "node index.js",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      '/azk/#{manifest.dir}': path("."),
    },
    scalable: {"default": 2},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "8080"
    },
    envs: {
      // set instances variables
      NODE_ENV: "dev",
      // PATH: "node_modules/.bin:$PATH",
    },
  },
});



