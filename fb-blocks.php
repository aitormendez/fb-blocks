<?php

/**
 * Plugin Name:       Fb Blocks
 * Description:       Bloques personalizados de FB Blocks.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       fb-blocks
 *
 * @package FbBlocks
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

require_once plugin_dir_path(__FILE__) . 'includes/api/video-resolutions.php';

/**
 * Registrar bloques desde build/blocks-manifest.php.
 */
function fb_blocks_register_all_blocks()
{
	$manifest_file = __DIR__ . '/build/blocks-manifest.php';

	if (! file_exists($manifest_file)) {
		error_log('⚠️ Error: blocks-manifest.php no encontrado en ' . $manifest_file);
		return;
	}

	// Carga la información del manifest
	$manifest_data = require $manifest_file;

	// Registra automáticamente todos los bloques *excepto* "post"
	foreach (array_keys($manifest_data) as $block_type) {
		// Si este bloque es "post", lo saltamos
		if ($block_type === 'post' || $block_type === 'marquee') {
			continue;
		}
		register_block_type(__DIR__ . "/build/{$block_type}");
	}
}
add_action('init', 'fb_blocks_register_all_blocks');

/**
 * Cargar render callback del bloque 'post'.
 */
require_once plugin_dir_path(__FILE__) . 'src/post/inc/render-post.php';

/**
 * Registrar el bloque 'post' con render_callback.
 */
function fb_blocks_register_post_block()
{
	register_block_type(
		__DIR__ . '/build/post',
		[
			'render_callback' => 'fb_blocks_render_post_block',
		]
	);
}
add_action('init', 'fb_blocks_register_post_block');

/**
 * Cargar render callback del bloque 'marquee'.
 */
require_once plugin_dir_path(__FILE__) . 'src/marquee/inc/render-marquee.php';


/**
 * Registrar el bloque 'marquee' con render_callback.
 */
function fb_blocks_register_marquee_block()
{
	register_block_type(
		__DIR__ . '/build/marquee',
		[
			'render_callback' => 'fb_blocks_render_marquee_block',
		]
	);
}
add_action('init', 'fb_blocks_register_marquee_block');
