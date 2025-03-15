<?php
if (! function_exists('fb_blocks_render_marquee_block')) {
    function fb_blocks_render_marquee_block($attributes, $content)
    {
        $marqueeText         = $attributes['marqueeText'] ?? 'Test text';
        $backgroundColor     = $attributes['backgroundColor'] ?? '#000';
        $pillBackgroundColor = $attributes['pillBackgroundColor'] ?? '#fff';
        $textColor           = $attributes['textColor'] ?? '#000';
        $speed               = $attributes['speed'] ?? 10;
        $fontFamily          = $attributes['fontFamily'] ?? 'arial, sans-serif';
        $linkUrl             = $attributes['linkUrl'] ?? '#';
        $align               = isset($attributes['align']) ? $attributes['align'] : '';

        ob_start();
?>
        <!-- HTML similar a marquee.blade.php -->
        <div class="marquee <?php echo esc_attr($align); ?> px-12 py-4"
            data-text="<?php echo esc_attr($marqueeText); ?>"
            data-pill-background-color="<?php echo esc_attr($pillBackgroundColor); ?>"
            data-text-color="<?php echo esc_attr($textColor); ?>"
            data-speed="<?php echo esc_attr($speed); ?>"
            data-font-family="<?php echo esc_attr($fontFamily); ?>"
            data-link-url="<?php echo esc_attr($linkUrl); ?>"
            style="background-color: <?php echo esc_attr($backgroundColor); ?>;">
        </div>
<?php
        return ob_get_clean();
    }
}
