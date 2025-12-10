<?php

return [
    /*
     * The base path of your Vite project.
     * The correct path depends on how you structured your project.
     */
    'build_path' => 'build', 
    'entrypoints' => [
    'car_dealership/src/index.jsx',
],

/*
 * The directory where Vite stores its assets.
 * This usually corresponds to the `outDir` in your vite.config.js.
 * In your setup, it's `backend/public/build`, but for Laravel,
 * it's relative to the public directory.
 *
 * Since your vite.config.js specifies `outDir: '../../backend/public/build'`,
 * and Laravel's public directory is `public`,
 * the manifest will actually be found at `public/build`.
 * So, we set 'manifest_directory' to 'build'.
 */
'manifest_directory' => 'build', // Это путь относительно `public/` Laravel

            ];
