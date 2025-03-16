import { registerBlockType } from "@wordpress/blocks";
import edit from "./edit";
import metadata from "./block.json";
import "./editor.css";
import "./style.css";

registerBlockType(metadata.name, {
	...metadata,
	edit,
	save: () => null, // usaremos render_callback en PHP
});
