import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

const Preview = ({
  layout = 'layout1',
  name = 'Sample Product',
  image_url = 'https://via.placeholder.com/150',
  image_orientation = 'horizontal',
  backgroundColor = '#ffffff',
  backgroundInteriorColor = '#ffffff',
  textColor = '#3e2b2f',
  borderColor = '#3e2b2f',
  artists_terms = [],
  excerpt = 'This is a sample excerpt.',
  align = '',
  post_type_label = 'Projects',
}) => {
  return (
    <div className="preview-block">
      {layout === 'layout1' && (
        <div className="product-block flex aspect-[50/60] w-full !max-w-none md:aspect-[100/50]">
          <div
            className="col-left w-[10%] border-r-2 md:w-[30%]"
            style={{ backgroundColor, borderColor }}
          ></div>

          <div
            className="col-center flex w-[80%] flex-col justify-between md:w-[40%]"
            style={{ backgroundColor: backgroundInteriorColor }}
          >
            <div className="flex h-full items-center justify-center">
              <img
                src={image_url}
                alt={name}
                className={
                  image_orientation === 'horizontal' ? 'w-full' : 'w-2/3'
                }
              />
            </div>

            <div
              className="mx-4 mb-3 grow-0 font-arialblack text-sm md:text-base"
              style={{ color: textColor }}
            >
              {artists_terms.length > 0 ? (
                <>
                  <span>{name} by </span>
                  {artists_terms.map((term, index) => (
                    <span key={index}>{term.name}</span>
                  ))}
                </>
              ) : (
                <span>{name}</span>
              )}
            </div>
          </div>

          <div
            className="col-right w-[10%] border-l-2 md:w-[30%]"
            style={{ backgroundColor, borderColor }}
          ></div>
        </div>
      )}

      {layout === 'layout2' && (
        <div
          className={`not-prose ${align} mx-6 flex border-y-2 py-4 md:flex-row`}
          style={{ borderColor }}
        >
          <div
            style={{ backgroundColor }}
            className="flex flex-col justify-between p-6  w-full md:w-1/2"
          >
            <div
              style={{ color: textColor }}
              className="font-bugrino font-light"
            >
              {post_type_label}
            </div>
            <div
              style={{ color: textColor }}
              className="my-6 text-center font-arialblack text-sm"
            >
              {name}
            </div>
            <div
              className="excerpt text-center font-fk text-sm"
              style={{
                color: textColor,
              }}
            >
              <style>{`
                .excerpt * {
                  color: ${textColor} !important;
                }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: excerpt }} />
            </div>
          </div>
          <div className="flex h-full items-center justify-center  w-full md:w-1/2">
            <img
              src={image_url}
              alt={name}
              className={
                image_orientation === 'horizontal' ? 'w-full' : 'w-2/3'
              }
            />
          </div>
        </div>
      )}

      {layout === 'layout3' && (
        <div
          className={`not-prose ${align} relative flex flex-col items-center justify-center`}
        >
          <img
            src={image_url}
            alt={name}
            className={
              image_orientation === 'horizontal' ? 'horizontal' : 'vertical'
            }
          />
          <div
            className={
              'p-6 pb-14 transition-opacity duration-500 md:absolute md:w-1/2 md:max-w-lg md:hover:opacity-0'
            }
            style={{ backgroundColor }}
          >
            {/* Post Type Label */}
            <div
              className="font-bugrino font-light"
              style={{ color: textColor }}
            >
              {post_type_label}
            </div>

            {/* Post Title */}
            <h3
              className="font-arialblack my-14 text-center"
              style={{ color: textColor }}
            >
              {name}
            </h3>

            {/* Post Excerpt con solución del layout 2 */}
            <div
              className="excerpt font-fk text-center text-sm"
              style={{ color: textColor }}
            >
              <style>{`
          .excerpt * {
            color: ${textColor} !important;
          }
        `}</style>
              <div dangerouslySetInnerHTML={{ __html: excerpt }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Preview.propTypes = {
  layout: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  image_orientation: PropTypes.string,
  backgroundColor: PropTypes.string,
  artists_terms: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
};

export default Preview;
