<?php
/**
 * Plugin Name: Imlo
 * Plugin URI: http://imlo.insof.uz
 * Version: 1.0
 * Author: Javlon Juraev
 * Author URI: https://www.juraev.uz
 * Description: TinyMCE tahrir oynasi uchun imloni tekshirish plagini
 * License: GPL2
 */

class Imlo_Class {

    function __construct() {
		if ( is_admin() ) {
			add_action( 'init', array( &$this, 'setup_imlo_plugin' ) );
		}
    }

	function setup_imlo_plugin() {

		if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		if ( get_user_option( 'rich_editing' ) !== 'true' ) {
			return;
		}

		add_filter( 'mce_external_plugins', array( &$this, 'add_tinymce_plugin' ) );
		add_filter( 'mce_buttons', array( &$this, 'add_tinymce_toolbar_button' ) );

	}
	
	function add_tinymce_plugin( $plugin_array ) {

		$plugin_array['imlo_class'] = plugin_dir_url( __FILE__ ) . 'imlo.js';
		return $plugin_array;

	}
	
	function add_tinymce_toolbar_button( $buttons ) {

		array_push( $buttons, 'imlo_class' );
		return $buttons;

	}

}

$imlo_class = new Imlo_Class;