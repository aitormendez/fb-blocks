import { registerBlockType } from "@wordpress/blocks";
import edit from "./edit";
import metadata from "./block.json";

// Importa estilos globales, si quieres
// import "./style.scss";

registerBlockType(metadata.name, {
	...metadata,
	edit,
	save: () => null, // usaremos render_callback en PHP
});
