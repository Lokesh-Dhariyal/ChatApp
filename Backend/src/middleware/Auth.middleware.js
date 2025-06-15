import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { apiError } from "../utils/ApiError.utils.js";
import { verifyToken } from "../utils/VerifyTokens.utils.js";

const jwtVerification = asyncHandler(async (req, _, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new apiError(400, "Invalid Token");
    }

    const user = await verifyToken(accessToken)
    if (!user) {
      throw new apiError(400, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(400, `Token verification failed: ${error.message}`);
  }
});

export { jwtVerification };
