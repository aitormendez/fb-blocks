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
        $align      = $attributes['align'] ?? '';

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

        // Generar HTML según el layout seleccionado
        ob_start();
        switch ($layout) {
            case 'layout1':
?>
                <div class="flex aspect-[50/60] w-full !max-w-none md:aspect-[100/50]">
                    <div class="col-left w-[10%] border-r-2 md:w-[30%]" style="background-color: <?php echo esc_attr($bg_color); ?>; border-color: <?php echo esc_attr($border_color); ?>;"></div>

                    <a href="<?php echo esc_url(get_permalink($post_id)); ?>" class="col-center group flex w-[80%] flex-col justify-between md:w-[40%]" style="background-color: <?php echo esc_attr($bg_inner); ?>;">
                        <div class="flex h-full items-center justify-center">
                            <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($name); ?>" class="<?php echo $image_orientation === 'horizontal' ? 'w-full' : 'w-2/3'; ?> filter transition-all duration-300 group-hover:brightness-75 group-hover:hue-rotate-[180deg] group-hover:saturate-150">
                        </div>
                        <div class="font-arialblack mx-4 mb-3 grow-0 text-sm md:text-base" style="color: <?php echo esc_attr($text_color); ?>;">
                            <?php echo esc_html($name); ?>
                        </div>
                    </a>

                    <div class="col-right w-[10%] border-l-2 md:w-[30%]" style="background-color: <?php echo esc_attr($bg_color); ?>; border-color: <?php echo esc_attr($border_color); ?>;"></div>
                </div>
            <?php
                break;

            case 'layout2':
            ?>
                <a href="<?php echo esc_url(get_permalink($post_id)); ?>" class="not-prose <?php echo esc_attr($align); ?> group mx-6 my-6 flex border-y-2 py-4 md:flex-row" style="border-color: <?php echo esc_attr($border_color); ?>;">
                    <div class="flex justify-center p-6 pb-10 md:w-1/2" style="background-color: <?php echo esc_attr($bg_color); ?>;">
                        <div class="flex h-full w-full max-w-lg flex-col justify-between">
                            <div class="font-bugrino font-light" style="color: <?php echo esc_attr($text_color); ?>;">
                                <?php echo esc_html($post_type_label); ?>
                            </div>
                            <div class="font-arialblack my-6 text-center text-sm md:text-base" style="color: <?php echo esc_attr($text_color); ?>;">
                                <?php echo esc_html($name); ?>
                            </div>
                            <div class="font-fk text-center text-sm md:text-base" style="color: <?php echo esc_attr($text_color); ?>;">
                                <?php echo wp_kses_post($excerpt); ?>
                            </div>
                        </div>
                    </div>
                    <div class="flex h-full w-full items-center justify-center md:w-1/2">
                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($name); ?>" class="<?php echo $image_orientation === 'horizontal' ? 'w-full' : 'w-2/3'; ?> filter transition-all duration-300 group-hover:brightness-75 group-hover:hue-rotate-[180deg] group-hover:saturate-150">
                    </div>
                </a>
            <?php
                break;

            case 'layout3':
            default:
            ?>
                <a href="<?php echo esc_url(get_permalink($post_id)); ?>" class="not-prose <?php echo esc_attr($align); ?> relative flex flex-col items-center justify-center">
                    <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($name); ?>" class="<?php echo ($image_orientation === 'horizontal') ? 'horizontal' : 'vertical'; ?>">
                    <div class="p-6 pb-14 transition-opacity duration-500 md:absolute md:w-1/2 md:max-w-lg md:hover:opacity-0" style="background-color: <?php echo esc_attr($bg_color); ?>;">
                        <div class="font-bugrino font-light" style="color: <?php echo esc_attr($text_color); ?>;">
                            <?php echo esc_html($post_type_label); ?>
                        </div>
                        <h3 class="font-arialblack my-14 text-center" style="color: <?php echo esc_attr($text_color); ?>;">
                            <?php echo esc_html($name); ?>
                        </h3>
                        <div class="font-fk text-center text-sm" style="color: <?php echo esc_attr($text_color); ?>;">
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
