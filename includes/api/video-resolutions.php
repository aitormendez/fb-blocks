<?php

/**
 * Plugin integration for Bunny.net video resolution fetching.
 * Registers REST endpoint: /wp-json/fb/v1/video-resolutions
 */

add_action('rest_api_init', function () {
    register_rest_route('fb/v1', '/video-resolutions', [
        'methods'             => 'GET',
        'callback'            => 'fb_blocks_get_video_resolutions',
        'permission_callback' => '__return_true',
    ]);
});

function fb_blocks_get_video_resolutions($data)
{
    $video_id   = sanitize_text_field($data->get_param('video_id'));
    $library_id = sanitize_text_field($data->get_param('library_id')) ?? '265348';

    if (!$video_id) {
        return new WP_Error('no_video_id', 'No video ID provided', ['status' => 400]);
    }

    $video_details = fb_blocks_fetch_video_details($video_id, $library_id);

    if (empty($video_details)) {
        return new WP_Error('no_encodings', 'No video resolutions found', ['status' => 404]);
    }

    $response = rest_ensure_response($video_details);
    $response->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    $response->header('Pragma', 'no-cache');
    $response->header('Expires', '0');

    return $response;
}

function fb_blocks_fetch_video_details($video_id, $library_id)
{
    $api_key      = getenv('BUNNY_KEY');
    $pull_zone    = 'vz-9a0bcf65-610'; // Puedes hacer esto dinámico si cambia entre entornos
    $api_endpoint = "https://video.bunnycdn.com/library/{$library_id}/videos/{$video_id}";

    $response = wp_remote_get($api_endpoint, [
        'headers' => [
            'AccessKey' => $api_key,
        ],
    ]);

    if (is_wp_error($response)) {
        return [];
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (isset($data['availableResolutions'])) {
        return [
            'hlsUrl'       => "https://{$pull_zone}.b-cdn.net/{$video_id}/playlist.m3u8",
            'thumbnailUrl' => "https://{$pull_zone}.b-cdn.net/{$video_id}/thumbnail.jpg",
        ];
    }

    return [];
}
