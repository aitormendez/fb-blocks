<?php
// This file is generated. Do not modify it manually.
return array(
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
				'default' => '#ffffff'
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
		'style' => 'file:./style.css'
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
	)
);
