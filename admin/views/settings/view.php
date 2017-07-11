<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var array $types
 */

?>
<div class="wrap">
    <h1><?php echo brizy()->get_name() . ' ' . __( 'settings' ); ?></h1>

    <form method="post" novalidate="novalidate">
		<?php wp_nonce_field() ?>
        <table class="form-table">
            <tbody>
            <tr>
                <th scope="row">Post types</th>
                <td>
                    <fieldset>
                        <legend class="screen-reader-text"><span>Date Format</span></legend>
						<?php foreach ( $types as $type ) : ?>
                            <label>
                                <input type="checkbox"
                                       name="post-types[]"
                                       value="<?php echo $type['type']; ?>"
									<?php echo $type['selected'] ? 'checked' : ''; ?>
                                >
								<?php echo $type['name']; ?>
                            </label>
                            <br>
						<?php endforeach ?>
                    </fieldset>
                </td>
            </tr>
            </tbody>
        </table>
        <p class="submit">
            <button type="submit"
                    id="submit"
                    class="button button-primary"
            ><?php _e( 'Save Changes' ); ?></button>
        </p>
    </form>
</div>