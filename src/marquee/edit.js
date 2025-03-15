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

	// Refs para medir el contenedor y el texto
	const containerRef = useRef(null);
	const textRef = useRef(null);

	// Texto repetido para llenar el contenedor
	const [repeatedText, setRepeatedText] = useState(marqueeText);

	// === Manejo de cambios en atributos ===
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
	 * 1) Repetir el texto para llenar el ancho del contenedor (solo en preview).
	 */
	useEffect(() => {
		if (!isPreview) return;

		// Usamos requestAnimationFrame para post-renders y minimizar reflow
		requestAnimationFrame(() => {
			if (!containerRef.current || !textRef.current) return;

			const containerWidth = containerRef.current.offsetWidth;
			const tempSpan = textRef.current;
			let combined = marqueeText;

			// Ajustamos el innerText mientras sea más pequeño que el contenedor
			tempSpan.innerText = combined;
			while (tempSpan.offsetWidth < containerWidth) {
				combined += ` ${marqueeText}`;
				tempSpan.innerText = combined;
			}

			setRepeatedText(combined);
		});
	}, [marqueeText, isPreview]);

	/**
	 * 2) Animación GSAP para .marquee-text
	 *    - Se duplicarán dentro del contenedor si quieres bucle infinito
	 */
	useEffect(() => {
		if (!isPreview) return;

		// Hacemos la animación en el siguiente frame
		requestAnimationFrame(() => {
			const container = containerRef.current;
			if (!container) return;

			// Seleccionamos TODOS los .marquee-text dentro del contenedor
			const textElements = container.querySelectorAll(".marquee-text");
			if (!textElements.length) return;

			gsap.to(textElements, {
				xPercent: -100,
				duration: speed,
				repeat: -1,
				ease: "none",
			});
		});

		// Limpiar animación al desmontar / cambiar
		return () => gsap.killTweensOf(".marquee-text");
	}, [isPreview, repeatedText, speed]);

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
					}}
				>
					<span
						ref={textRef}
						className="marquee-text"
						style={{
							display: "inline-block",
							whiteSpace: "nowrap",
							backgroundColor: pillBackgroundColor,
							color: textColor,
							fontFamily,
						}}
					>
						{repeatedText}
					</span>
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
