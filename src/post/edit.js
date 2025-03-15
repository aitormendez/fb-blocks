import { debounce } from "lodash";
import {
	BlockControls,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton, PanelBody } from "@wordpress/components";

import {
	SelectControl,
	TextControl,
	RadioControl,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

import Preview from "./preview";

const Edit = ({ attributes, setAttributes }) => {
	const {
		postId,
		contentType = "product",
		layout = "layout1",
		backgroundColor = "#ffffff",
		backgroundInteriorColor = "#ffffff",
		borderColor = "#3e2b2f",
		textColor = "#000000",
		image_url = "https://via.placeholder.com/150",
		align = "",
	} = attributes;

	const [isPreview, setIsPreview] = useState(false);
	const [posts, setPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPostName, setSelectedPostName] = useState("");
	const [excerpt, setExcerpt] = useState("This is a sample excerpt.");
	const [postTypeLabel, setPostTypeLabel] = useState("Projects");

	const togglePreview = () => setIsPreview((prev) => !prev);

	const image_orientation = "horizontal";

	// Función para manejar el cambio del color de fondo
	const handleBackgroundColorChange = (newColor) => {
		setAttributes({ backgroundColor: newColor });
	};

	const handleBackgroundInteriorColorChange = (newColor) => {
		setAttributes({ backgroundInteriorColor: newColor });
	};

	const handleTextColorChange = (newColor) => {
		setAttributes({ textColor: newColor });
	};

	const handleBorderColorChange = (newColor) => {
		setAttributes({ borderColor: newColor });
	};

	useEffect(() => {
		const fetchPosts = () => {
			const postTypePath =
				contentType === "product" ? "/wc/v3/products" : `/wp/v2/${contentType}`;
			apiFetch({ path: `${postTypePath}?per_page=100` })
				.then((posts) => {
					setPosts(posts);
					setFilteredPosts(posts);

					if (postId) {
						const selectedPost = posts.find((post) => post.id === postId);
						if (selectedPost) {
							setSelectedPostName(
								selectedPost.name || selectedPost.title.rendered,
							);

							// Obtener y actualizar el excerpt
							setExcerpt(
								selectedPost.excerpt?.rendered || "El post no tiene excerpt",
							);

							// Actualizar el postTypeLabel
							const postTypeLabels = {
								post: "Posts",
								page: "Pages",
								project: "Projects",
								story: "Stories",
								product: "Products",
							};
							setPostTypeLabel(postTypeLabels[contentType] || "Content");

							// Hacer una llamada a la API para obtener la URL de la imagen destacada
							if (selectedPost.featured_media) {
								apiFetch({
									path: `/wp/v2/media/${selectedPost.featured_media}`,
								})
									.then((media) => {
										const imageUrl =
											media.source_url || "https://via.placeholder.com/150";
										setAttributes({ image_url: imageUrl });
									})
									.catch((error) => {
										console.error("Error fetching media:", error);
										setAttributes({
											image_url: "https://via.placeholder.com/150",
										});
									});
							} else {
								setAttributes({ image_url: "https://via.placeholder.com/150" });
							}
						}
					}
				})
				.catch((error) => {
					console.error("Error loading posts:", error);
				});
		};

		fetchPosts();
	}, [postId, contentType]);

	useEffect(() => {
		if (!searchTerm) {
			return;
		}

		const debouncedFetchPosts = debounce((searchTerm, setPosts) => {
			const postTypePath =
				contentType === "product"
					? "/wc/v3/products"
					: `/wp/v2/${contentType}s`;
			apiFetch({
				path: `${postTypePath}?search=${encodeURIComponent(
					searchTerm,
				)}&per_page=100`,
			}).then((posts) => {
				setPosts(posts);
			});
		}, 300);

		debouncedFetchPosts(searchTerm, setPosts);
	}, [searchTerm, contentType]);

	useEffect(() => {
		const searchFilter = posts.filter((post) =>
			(post.name || post.title.rendered)
				.toLowerCase()
				.includes(searchTerm.toLowerCase()),
		);
		setFilteredPosts(searchFilter);
	}, [searchTerm, posts]);

	const updatePost = (selectedId) => {
		const post = posts.find((post) => post.id.toString() === selectedId);
		if (post) {
			setAttributes({ postId: parseInt(selectedId) });
			setSelectedPostName(post.name || post.title.rendered);

			// Obtener y actualizar el excerpt
			setExcerpt(post.excerpt?.rendered || "El post no tiene excerpt");

			// Actualizar el postTypeLabel
			const postTypeLabels = {
				post: "Posts",
				page: "Pages",
				project: "Projects",
				story: "Stories",
				product: "Products",
			};
			setPostTypeLabel(postTypeLabels[contentType] || "Content");

			// Si post.featured_media es un ID, haz una solicitud para obtener la imagen
			if (post.featured_media) {
				apiFetch({ path: `/wp/v2/media/${post.featured_media}` })
					.then((media) => {
						const imageUrl =
							media.source_url || "https://via.placeholder.com/150";
						setAttributes({ image_url: imageUrl });
					})
					.catch((error) => {
						console.error("Error fetching media:", error);
						setAttributes({ image_url: "https://via.placeholder.com/150" });
					});
			} else {
				setAttributes({ image_url: "https://via.placeholder.com/150" });
			}
		}
	};

	const updateContentType = (selectedContentType) => {
		setAttributes({ contentType: selectedContentType, postId: 0 }); // Reiniciar la selección al cambiar de tipo de contenido
	};

	return (
		<div>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={isPreview ? "edit" : "visibility"}
						label={isPreview ? "Editar" : "Vista previa"}
						onClick={togglePreview}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__("Settings", "sage")}>
					<SelectControl
						label={__("Select Content Type", "sage")}
						value={contentType}
						options={[
							{ label: __("Product", "sage"), value: "product" },
							{ label: __("Project", "sage"), value: "project" },
							{ label: __("Story", "sage"), value: "story" },
						]}
						onChange={updateContentType}
					/>
					<PanelColorSettings
						title={__("Background Color", "sage")}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: handleBackgroundColorChange,
								label: __("Background Color", "sage"),
							},
						]}
					/>
					<PanelColorSettings
						title={__("Background Interior Color", "sage")}
						colorSettings={[
							{
								value: backgroundInteriorColor,
								onChange: handleBackgroundInteriorColorChange,
								label: __("Background Interior Color", "sage"),
							},
						]}
					/>
					<PanelColorSettings
						title={__("Text Color", "sage")}
						colorSettings={[
							{
								value: textColor,
								onChange: handleTextColorChange,
								label: __("Text Color", "sage"),
							},
						]}
					/>
					<PanelColorSettings
						title={__("Border Color", "sage")}
						colorSettings={[
							{
								value: borderColor,
								onChange: handleBorderColorChange,
								label: __("Border Color", "sage"),
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>

			{isPreview ? (
				<Preview
					layout={layout}
					name={selectedPostName || "Sample Product"}
					image_url={image_url}
					image_orientation={image_orientation}
					backgroundColor={backgroundColor}
					backgroundInteriorColor={backgroundInteriorColor}
					textColor={textColor}
					borderColor={borderColor}
					excerpt={excerpt}
					align={align}
					post_type_label={postTypeLabel}
				/>
			) : (
				<div>
					{selectedPostName && (
						<p>
							{__("Selected Content:", "sage")}{" "}
							<strong>{selectedPostName}</strong>
						</p>
					)}
					<TextControl
						label={__("Search Posts", "sage")}
						value={searchTerm}
						onChange={(search) => setSearchTerm(search)}
					/>
					<SelectControl
						label={__("Select a Post", "sage")}
						value={postId.toString()}
						options={[
							{ label: __("Select...", "sage"), value: "" },
							...filteredPosts.map((post) => ({
								label: post.name || post.title.rendered,
								value: post.id.toString(),
							})),
						]}
						onChange={updatePost}
					/>
					<RadioControl
						label={__("Select Layout", "sage")}
						selected={layout}
						options={[
							{ label: __("Layout 1", "sage"), value: "layout1" },
							{ label: __("Layout 2", "sage"), value: "layout2" },
							{ label: __("Layout 3", "sage"), value: "layout3" },
						]}
						onChange={(selectedLayout) =>
							setAttributes({ layout: selectedLayout })
						}
					/>
				</div>
			)}
		</div>
	);
};

Edit.propTypes = {
	attributes: PropTypes.shape({
		postId: PropTypes.number,
		layout: PropTypes.string,
		backgroundColor: PropTypes.string,
		image_url: PropTypes.string,
		align: PropTypes.string,
	}).isRequired,
	setAttributes: PropTypes.func.isRequired,
};

export default Edit;
