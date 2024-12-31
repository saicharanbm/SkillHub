import { Link } from "react-router-dom";
function PageNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#F89A28] mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Oops! It seems you've wandered off the map.
        </p>
        <div className="flex justify-center items-center mb-6 pt-4">
          <div className="w-24 h-2 bg-orange-500 relative">
            <div className="absolute -top-8 left-0 w-8 h-8 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="absolute -top-8 right-0 w-8 h-8 bg-orange-400 rounded-full animate-bounce"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Let’s guide you back to safety.{" "}
          <Link to={"/"} className="text-[#F89A28] underline">
            Go Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
