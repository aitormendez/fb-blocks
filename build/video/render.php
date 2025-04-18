<?php

$attrs = $attributes ?? [];

$videoSrc = esc_url($attrs['videoSrc'] ?? '');
$poster   = esc_url($attrs['thumbnailUrl'] ?? '');
$autoplay = !empty($attrs['autoplay']) ? 'autoplay' : '';
$loop     = !empty($attrs['loop']) ? 'loop' : '';
$muted    = !empty($attrs['muted']) ? 'muted' : '';
$controls = !empty($attrs['controls']) ? 'controls' : '';
$playsInline = !empty($attrs['playsInline']) ? 'playsinline' : '';

if (! $videoSrc) {
    return '<p>⚠️ No video selected.</p>';
}

?>
<div
    class="fb-video-player"
    data-videosrc="<?= esc_attr($videoSrc) ?>"
    data-poster="<?= esc_attr($poster) ?>"
    data-autoplay="<?= esc_attr($attrs['autoplay'] ? 'true' : 'false') ?>"
    data-loop="<?= esc_attr($attrs['loop'] ? 'true' : 'false') ?>"
    data-muted="<?= esc_attr($attrs['muted'] ? 'true' : 'false') ?>"
    data-controls="<?= esc_attr($attrs['controls'] ? 'true' : 'false') ?>"
    data-playsinline="<?= esc_attr($attrs['playsInline'] ? 'true' : 'false') ?>"></div>