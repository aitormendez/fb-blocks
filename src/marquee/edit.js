import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	URLInput,
} from "@wordpress/block-editor";
import {
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	PanelBody,
	ColorPalette,
	RangeControl,
	SelectControl,
} from "@wordpress/components";
import { useState, useEffect, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { gsap } from "gsap";

/**
 * Familias tipográficas disponibles en el menú:
 */
const fontFamilies = [
	{ label: "Arial", value: "arial,sans-serif" },
	{ label: "Times New Roman", value: "times-new-roman,times,serif" },
	{ label: "Bugrino", value: "Bugrino,sans-serif" },
	{ label: "FK Display", value: "FK Display,sans-serif" },
	{ label: "ArialBlack", value: "ArialBlack,sans-serif" },
];

/**
 * Bloque "Marquee" - Edit component
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		marqueeText,
		backgroundColor,
		pillBackgroundColor,
		textColor,
		speed,
		fontFamily,
		linkUrl,
	} = attributes;

	// Control de preview vs edición
	const [isPreview, setIsPreview] = useState(false);

	// Ref para medir el contenedor
	const containerRef = useRef(null);

	// Almacenará un array de strings: cada string será un “fragmento” que renderizamos en <span>
	const [repeatedSpans, setRepeatedSpans] = useState([]);

	// === Manejo de cambios en atributos (Inspector/Editor) ===
	const onChangeMarqueeText = (val) => setAttributes({ marqueeText: val });
	const onChangeBackgroundColor = (val) =>
		setAttributes({ backgroundColor: val });
	const onChangePillBackgroundColor = (val) =>
		setAttributes({ pillBackgroundColor: val });
	const onChangeTextColor = (val) => setAttributes({ textColor: val });
	const onChangeSpeed = (val) => setAttributes({ speed: val });
	const onChangeFontFamily = (val) => setAttributes({ fontFamily: val });
	const onChangeLinkUrl = (val) => setAttributes({ linkUrl: val });

	// Toggle preview
	const togglePreview = () => setIsPreview(!isPreview);

	/**
	 * useEffect para calcular cuántas veces hay que repetir el texto.
	 * Cuando entras en modo "Preview", medimos el ancho del contenedor vs. el ancho de una sola instancia.
	 */
	useEffect(() => {
		if (!isPreview) return;
		if (!containerRef.current) return;

		const containerWidth = containerRef.current.offsetWidth;

		// Crear un elemento temporal para medir el ancho de una sola instancia de marqueeText
		const tempSpan = document.createElement("span");
		tempSpan.style.whiteSpace = "nowrap";
		tempSpan.style.visibility = "hidden";
		tempSpan.style.fontFamily = fontFamily; // Para que mida igual que la vista final
		tempSpan.innerText = marqueeText;

		containerRef.current.appendChild(tempSpan);
		const singleWidth = tempSpan.offsetWidth;
		containerRef.current.removeChild(tempSpan);

		// Calcular cuántas copias hacen falta para "llenar" y permitir el scroll infinito.
		const needed = Math.ceil(containerWidth / singleWidth) + 2;

		// Crear un array con la cantidad de copias necesaria
		const repeatsArray = Array.from({ length: needed }, () => marqueeText);

		setRepeatedSpans(repeatsArray);
	}, [isPreview, marqueeText, fontFamily]);

	/**
	 * useEffect para animar con GSAP todos los .marquee-text (hay dos nodos para el loop infinito).
	 */
	useEffect(() => {
		if (!isPreview) return;

		// En el siguiente frame, iniciamos la animación
		requestAnimationFrame(() => {
			const container = containerRef.current;
			if (!container) return;

			// Seleccionamos todos los .marquee-text dentro del contenedor
			const textElements = container.querySelectorAll(".marquee-text");
			if (!textElements.length) return;

			gsap.to(textElements, {
				xPercent: -100,
				duration: speed,
				repeat: -1,
				ease: "none",
			});
		});

		// Limpiar animación al desmontar o al cambiar algo relevante
		return () => gsap.killTweensOf(".marquee-text");
	}, [isPreview, repeatedSpans, speed]);

	// === Render ===
	return (
		<div {...useBlockProps()}>
			{/* === ToolBar Superior === */}
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={isPreview ? "edit" : "visibility"}
						label={
							isPreview ? __("Edit", "fb-blocks") : __("Preview", "fb-blocks")
						}
						onClick={togglePreview}
					/>
				</ToolbarGroup>
			</BlockControls>

			{/* === Inspector Lateral (Atributos) === */}
			<InspectorControls>
				<PanelBody
					title={__("Background Color", "fb-blocks")}
					initialOpen={true}
				>
					<ColorPalette
						__nextHasNoMarginBottom
						value={backgroundColor}
						onChange={onChangeBackgroundColor}
					/>
				</PanelBody>
				<PanelBody
					title={__("Pill Background Color", "fb-blocks")}
					initialOpen={true}
				>
					<ColorPalette
						__nextHasNoMarginBottom
						value={pillBackgroundColor}
						onChange={onChangePillBackgroundColor}
					/>
				</PanelBody>
				<PanelBody title={__("Text Color", "fb-blocks")} initialOpen={true}>
					<ColorPalette
						__nextHasNoMarginBottom
						value={textColor}
						onChange={onChangeTextColor}
					/>
				</PanelBody>
				<PanelBody title={__("Speed", "fb-blocks")} initialOpen={true}>
					<RangeControl
						__nextHasNoMarginBottom
						label={__("Marquee Speed", "fb-blocks")}
						value={speed}
						onChange={onChangeSpeed}
						min={1}
						max={20}
					/>
				</PanelBody>
				<PanelBody title={__("Font Family", "fb-blocks")} initialOpen={true}>
					<SelectControl
						__nextHasNoMarginBottom
						label={__("Font Family", "fb-blocks")}
						value={fontFamily}
						options={fontFamilies}
						onChange={onChangeFontFamily}
					/>
				</PanelBody>
			</InspectorControls>

			{/* === Vista Edición VS Vista Previa === */}
			{isPreview ? (
				<div
					className="marquee-wrapper"
					ref={containerRef}
					style={{
						position: "relative",
						overflow: "hidden",
						backgroundColor,
						whiteSpace: "nowrap",
					}}
				>
					<div
						className="marquee-pill"
						style={{
							backgroundColor: pillBackgroundColor,
							display: "flex",
							flexDirection: "row",
						}}
					>
						{/* 
							Las dos <span> con className="marquee-text" para el loop infinito.
							Aquí mapeamos repeatedSpans para generar un <span> por cada instancia.
						*/}
						<span
							className="marquee-text"
							style={{
								display: "inline-block",
								whiteSpace: "nowrap",
								color: textColor,
								fontFamily,
							}}
						>
							{repeatedSpans.map((text, i) => (
								<span key={i} style={{ marginRight: "1em" }}>
									{text}
								</span>
							))}
						</span>

						<span
							className="marquee-text"
							style={{
								display: "inline-block",
								whiteSpace: "nowrap",
								color: textColor,
								fontFamily,
							}}
						>
							{repeatedSpans.map((text, i) => (
								<span key={i} style={{ marginRight: "1em" }}>
									{text}
								</span>
							))}
						</span>
					</div>
				</div>
			) : (
				<div>
					<TextControl
						__nextHasNoMarginBottom
						label={__("Marquee Text", "fb-blocks")}
						value={marqueeText}
						onChange={onChangeMarqueeText}
						placeholder={__("Add your marquee text here...", "fb-blocks")}
					/>
					<URLInput
						__nextHasNoMarginBottom
						label={__("Link URL", "fb-blocks")}
						value={linkUrl}
						onChange={onChangeLinkUrl}
						placeholder={__(
							"Add your link here or type to search",
							"fb-blocks",
						)}
					/>
				</div>
			)}
		</div>
	);
}
