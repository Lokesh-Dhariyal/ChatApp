class apiResponse {
  constructor(statusCode, data, message = "") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // If statusCode is less than 400, it means success (true), otherwise failure (false)
  }
}
export { apiResponse };
