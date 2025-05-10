<?php

/**
 * Render callback para fb-blocks/post.
 *
 * @param array  $attributes Atributos del bloque (vienen del JS).
 * @param string $content    Contenido (no lo usamos porque save = null).
 */
if (! function_exists('fb_blocks_render_post_block')) {
    function fb_blocks_render_post_block($attributes, $content)
    {
        // Extraer atributos
        $post_id    = $attributes['postId'] ?? 0;
        $layout     = $attributes['layout'] ?? 'layout1';
        $post_type  = $attributes['contentType'] ?? 'product';
        $align = isset($attributes['align']) ? 'align' . $attributes['align'] : '';


        // Obtener el post o producto
        $post_object = null;
        if ('product' === $post_type && function_exists('wc_get_product')) {
            $post_object = wc_get_product($post_id);
        } elseif ($post_id) {
            $post_object = get_post($post_id);
        }

        // Si no existe el post/producto, mostrar mensaje
        if (! $post_object) {
            return '<p>Post not found.</p>';
        }

        // Obtener datos del post
        if ('product' === $post_type) {
            $name      = $post_object->get_name();
            $image_id  = $post_object->get_image_id();
            $excerpt   = $post_object->get_short_description() ?: 'El producto no tiene descripción.';
        } else {
            $name      = $post_object->post_title;
            $image_id  = get_post_thumbnail_id($post_id);
            $excerpt   = get_the_excerpt($post_id) ?: 'El post no tiene excerpt.';
        }

        $image_url = wp_get_attachment_image_url($image_id, 'full') ?: 'https://via.placeholder.com/150';
        $image_meta = wp_get_attachment_metadata($image_id);
        $image_orientation = '';

        if ($image_meta && isset($image_meta['width'], $image_meta['height'])) {
            if ($image_meta['width'] > $image_meta['height']) {
                $image_orientation = 'horizontal';
            } elseif ($image_meta['width'] < $image_meta['height']) {
                $image_orientation = 'vertical';
            }
        }

        // Convertir el post_type en su plural
        $post_type_plural = [
            'post'    => 'Posts',
            'page'    => 'Pages',
            'project' => 'Projects',
            'story'   => 'News',
            'product' => 'Products',
        ];
        $post_type_label = $post_type_plural[$post_type] ?? ucfirst($post_type) . 's';

        // Extraer atributos de color, etc.
        $bg_color       = $attributes['backgroundColor'] ?? '#ffffff';
        $bg_inner       = $attributes['backgroundInteriorColor'] ?? '#ffffff';
        $text_color     = $attributes['textColor'] ?? '#3e2b2f';
        $border_color   = $attributes['borderColor'] ?? '#3e2b2f';

        // obtener artista
        $artist_names = '';
        $terms = get_the_terms($post_id, 'artist');
        if (!is_wp_error($terms) && !empty($terms)) {
            $artist_names = implode(', ', wp_list_pluck($terms, 'name'));
        }


        // Generar HTML según el layout seleccionado
        ob_start();
        switch ($layout) {
            case 'layout1':
?>
                <div class="fb-post-layout1-wrapper <?php echo esc_attr($align); ?>" style="background-color: <?php echo esc_attr($bg_color); ?>;">
                    <div class="fb-post-layout1-col-left " style="border-color: <?php echo esc_attr($border_color); ?>;"></div>

                    <a href="<?php echo esc_url(get_permalink($post_id)); ?>" class="fb-post-layout1-center" style="background-color: <?php echo esc_attr($bg_inner); ?>;">
                        <div class="fb-post-layout1-image-wrapper">
                            <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($name); ?>"
                                class="fb-post-layout1-image <?php echo $image_orientation === 'horizontal' ? 'horizontal' : 'vertical'; ?>">
                        </div>
                        <div class="fb-post-layout1-title" style="color: <?php echo esc_attr($text_color); ?>;">
                            <?php
                            echo esc_html($name);
                            if ($artist_names) {
                                echo ' by ' . esc_html($artist_names);
                            }
                            ?>
                        </div>

                    </a>

                    <div class="fb-post-layout1-col-right" style="border-color: <?php echo esc_attr($border_color); ?>;"></div>
                </div>

            <?php
                break;


            case 'layout2':
            ?>
                <a href="<?php echo esc_url(get_permalink($post_id)); ?>" class="fb-post-layout2-wrapper <?php echo esc_attr($align); ?>" style="border-color: <?php echo esc_attr($border_color); ?>;">
                    <div class="fb-post-layout2-text" style="background-color: <?php echo esc_attr($bg_color); ?>;">
                        <div class="fb-post-layout2-text-inner">
                            <div class="fb-post-type-label" style="color: <?php echo esc_attr($text_color); ?>;">
                                <?php echo esc_html($post_type_label); ?>
                            </div>
                            <div class="fb-post-title" style="color: <?php echo esc_attr($text_color); ?>;">
                                <?php echo esc_html($name); ?>
                            </div>
                            <div class="fb-post-excerpt" style="color: <?php echo esc_attr($text_color); ?>;">
                                <?php echo wp_kses_post($excerpt); ?>
                            </div>
                        </div>
                    </div>
                    <div class="fb-post-layout2-image">
                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($name); ?>" class="<?php echo $image_orientation === 'horizontal' ? 'horizontal' : 'vertical'; ?>">
                    </div>
                </a>
            <?php
                break;


            case 'layout3':
            default:
            ?>
                <a href="<?php echo esc_url(get_permalink($post_id)); ?>" class="fb-post-layout3-wrapper <?php echo esc_attr($align); ?>">
                    <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($name); ?>" class="fb-post-layout3-image <?php echo ($image_orientation === 'horizontal') ? 'horizontal' : 'vertical'; ?>">
                    <div class="fb-post-layout3-content" style="background-color: <?php echo esc_attr($bg_color); ?>;">
                        <div class="fb-post-label" style="color: <?php echo esc_attr($text_color); ?>;">
                            <?php echo esc_html($post_type_label); ?>
                        </div>
                        <h3 class="fb-post-title" style="color: <?php echo esc_attr($text_color); ?>;">
                            <?php echo esc_html($name); ?>
                        </h3>
                        <div class="fb-post-excerpt" style="color: <?php echo esc_attr($text_color); ?>;">
                            <?php echo wp_kses_post($excerpt); ?>
                        </div>
                    </div>
                </a>
<?php
                break;
        }

        return ob_get_clean();
    }
}
