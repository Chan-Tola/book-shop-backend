export class LogoutUser {
  /**
   * For JWT, logout is primarily a client-side action.
   * This execute method can be used for logging or clear-up tasks.
   */
  async execute() {
    // If you use Redis for blacklisting tokens, you would add that logic here.
    // For now, we simply return a success message.
    return {
      message:
        "Logged out successfully. Please delete the token from the client.",
    };
  }
}
