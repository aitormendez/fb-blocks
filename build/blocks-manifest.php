<?php
// This file is generated. Do not modify it manually.
return array(
	'fb-blocks' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/fb-blocks',
		'version' => '0.1.0',
		'title' => 'Fb Blocks',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Example block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'fb-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'marquee' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'fb-blocks/marquee',
		'version' => '0.1.0',
		'title' => 'Marquee',
		'description' => 'Un texto con efecto de marquesina.',
		'category' => 'common',
		'icon' => 'admin-site',
		'textdomain' => 'fb-blocks-marquee',
		'supports' => array(
			'align' => array(
				'wide',
				'full'
			),
			'html' => false
		),
		'attributes' => array(
			'marqueeText' => array(
				'type' => 'string',
				'default' => 'Sample marquee text'
			),
			'backgroundColor' => array(
				'type' => 'string',
				'default' => '#000000'
			),
			'pillBackgroundColor' => array(
				'type' => 'string',
				'default' => '#ffffff'
			),
			'textColor' => array(
				'type' => 'string',
				'default' => '#000000'
			),
			'speed' => array(
				'type' => 'number',
				'default' => 10
			),
			'fontFamily' => array(
				'type' => 'string',
				'default' => 'arial, sans-serif'
			),
			'linkUrl' => array(
				'type' => 'string',
				'default' => '#'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'viewStyle' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'post' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'fb-blocks/post',
		'version' => '0.1.0',
		'title' => 'Post',
		'description' => 'Muestra un post o producto con distintos layouts.',
		'category' => 'widgets',
		'icon' => 'admin-post',
		'textdomain' => 'post',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'attributes' => array(
			'contentType' => array(
				'type' => 'string',
				'default' => 'product'
			),
			'postId' => array(
				'type' => 'number',
				'default' => 0
			),
			'layout' => array(
				'type' => 'string',
				'default' => 'layout1'
			),
			'backgroundColor' => array(
				'type' => 'string',
				'default' => '#ffff00'
			),
			'backgroundInteriorColor' => array(
				'type' => 'string',
				'default' => '#ffffff'
			),
			'textColor' => array(
				'type' => 'string',
				'default' => '#000000'
			),
			'borderColor' => array(
				'type' => 'string',
				'default' => '#3e2b2f'
			),
			'image_url' => array(
				'type' => 'string',
				'default' => 'https://via.placeholder.com/150'
			),
			'align' => array(
				'type' => 'string'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'video' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'fb-blocks/video',
		'version' => '0.1.0',
		'title' => 'FB Video',
		'category' => 'fb',
		'icon' => 'video-alt3',
		'description' => 'FB custom video block with Bunny.net player integration.',
		'textdomain' => 'blocks/video',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'attributes' => array(
			'libraryId' => array(
				'type' => 'string',
				'default' => '265348'
			),
			'videoId' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoSrc' => array(
				'type' => 'string',
				'default' => ''
			),
			'thumbnailUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'align' => array(
				'type' => 'string',
				'default' => 'none'
			),
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			),
			'loop' => array(
				'type' => 'boolean',
				'default' => false
			),
			'muted' => array(
				'type' => 'boolean',
				'default' => false
			),
			'controls' => array(
				'type' => 'boolean',
				'default' => true
			),
			'playsInline' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'supports' => array(
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => false,
				'padding' => false
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'html' => false
		)
	)
);
