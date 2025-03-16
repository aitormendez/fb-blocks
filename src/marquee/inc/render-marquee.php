<?php

/**
 * Render callback para el bloque marquee.
 * file: render-marquee.php
 */

function fb_blocks_render_marquee_block($attributes)
{
    // Extraer atributos
    $marqueeText       = $attributes['marqueeText']       ?? 'Marquee Text';
    $backgroundColor   = $attributes['backgroundColor']   ?? '#000000';
    $pillBackground    = $attributes['pillBackgroundColor'] ?? '#ffffff';
    $textColor         = $attributes['textColor']         ?? '#000000';
    $fontFamily        = $attributes['fontFamily']        ?? 'arial,sans-serif';
    $speed             = $attributes['speed']             ?? 5;
    $linkUrl           = $attributes['linkUrl']           ?? '';

    // En este HTML solo ponemos una “estructura base”.
    // Usamos data-* para pasarle al JS la info necesaria.
    ob_start();
?>
    <div
        class="js-marquee marquee-wrapper"
        style="position: relative; overflow: hidden; background-color: <?php echo esc_attr($backgroundColor); ?>; white-space: nowrap;"
        data-text="<?php echo esc_attr($marqueeText); ?>"
        data-pill-background="<?php echo esc_attr($pillBackground); ?>"
        data-text-color="<?php echo esc_attr($textColor); ?>"
        data-font-family="<?php echo esc_attr($fontFamily); ?>"
        data-speed="<?php echo esc_attr($speed); ?>"
        data-link-url="<?php echo esc_url($linkUrl); ?>">
        <div
            class="marquee-pill"
            style="background-color: <?php echo esc_attr($pillBackground); ?>; display: flex; flex-direction: row;">
            <!-- Si quieres una instancia “mínima” para usuarios sin JS. Opcional. -->
            <span
                class="marquee-text"
                style="display: inline-block; white-space: nowrap; color: <?php echo esc_attr($textColor); ?>; font-family: <?php echo esc_attr($fontFamily); ?>;">
                <?php echo esc_html($marqueeText); ?>
            </span>
        </div>
    </div>
<?php

    return ob_get_clean();
}
