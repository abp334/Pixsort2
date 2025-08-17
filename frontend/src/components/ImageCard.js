import React from "react";

const ImageCard = ({ image, isMarketplace, onList, onBuy }) => {
  const listForSaleHandler = () => {
    const price = prompt(`Enter price for "${image.title}":`);
    if (price && !isNaN(price) && Number(price) > 0) {
      onList(image._id, Number(price));
    } else if (price !== null) {
      alert("Please enter a valid price.");
    }
  };

  const buyHandler = () => {
    if (
      window.confirm(
        `Are you sure you want to buy "${image.title}" for $${image.price}?`
      )
    ) {
      onBuy(image._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 truncate">
          {image.title}
        </h3>
        <p className="text-sm text-gray-500">
          By: {image.user?.username || "You"}
        </p>
        <div className="mt-2 h-12 flex-grow">
          {image.overallCategories?.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          {isMarketplace ? (
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold text-gray-900">${image.price}</p>
              <button
                onClick={buyHandler}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
              >
                Buy
              </button>
            </div>
          ) : image.forSale ? (
            <div className="text-center text-green-600 font-semibold">
              Listed for Sale at ${image.price}
            </div>
          ) : (
            <button
              onClick={listForSaleHandler}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
            >
              List for Sale
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ImageCard;
